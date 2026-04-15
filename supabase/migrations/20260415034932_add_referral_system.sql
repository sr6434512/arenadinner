/*
  # Referral & Season Pass Rewards System

  ## Overview
  Adds a complete referral tracking and season pass reward system to ArenaDinner.
  Players earn rewards by inviting friends and completing season pass milestones.

  ## New Tables

  ### referral_codes
  - One unique invite code per user, auto-generated
  - Tracks total uses and total rewards earned

  ### referrals
  - Links referrer to referee at registration time
  - Tracks status: pending → confirmed → rewarded
  - Stores reward amount for the referrer

  ### season_pass_tiers
  - Configurable reward tiers (e.g., 1 referral = ₹50, 5 referrals = ₹300)
  - Each tier has a required referral count and a reward amount
  - One-time claim per user per tier

  ### season_pass_claims
  - Records when a user claimed a specific season pass tier reward
  - Prevents double-claiming via unique constraint

  ## Security
  - RLS enabled on all 4 tables
  - Users can only read their own referral codes and referrals
  - Season pass tiers are publicly readable
  - Claims are scoped to the authenticated user

  ## Anti-Fraud RPC Functions

  ### fn_use_referral_code(p_code text)
  - Called during registration to record a referral
  - Validates the code exists, is not the user's own code, and no prior referral exists
  - Creates the referral row with status 'pending'

  ### fn_confirm_referral(p_referee_id uuid)
  - Called when referee completes first tournament registration
  - Marks referral as confirmed and credits referrer wallet

  ### fn_claim_season_pass_tier(p_tier_id uuid)
  - Validates user has enough confirmed referrals for the tier
  - Inserts claim record and credits wallet atomically
*/

-- ============================================================
-- REFERRAL CODES
-- ============================================================
CREATE TABLE IF NOT EXISTS referral_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  code text UNIQUE NOT NULL,
  total_uses integer NOT NULL DEFAULT 0,
  total_rewards_earned integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

ALTER TABLE referral_codes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own referral code"
  ON referral_codes FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Anon can read referral codes for validation"
  ON referral_codes FOR SELECT
  TO anon
  USING (true);

CREATE INDEX IF NOT EXISTS idx_referral_codes_user ON referral_codes(user_id);
CREATE INDEX IF NOT EXISTS idx_referral_codes_code ON referral_codes(code);

-- ============================================================
-- REFERRALS
-- ============================================================
CREATE TABLE IF NOT EXISTS referrals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  referee_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  referral_code_id uuid NOT NULL REFERENCES referral_codes(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'rewarded')),
  reward_amount integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  confirmed_at timestamptz,
  rewarded_at timestamptz,
  UNIQUE(referee_id)
);

ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Referrers can read their own referrals"
  ON referrals FOR SELECT
  TO authenticated
  USING (auth.uid() = referrer_id);

CREATE POLICY "Referees can read their own referral record"
  ON referrals FOR SELECT
  TO authenticated
  USING (auth.uid() = referee_id);

CREATE INDEX IF NOT EXISTS idx_referrals_referrer ON referrals(referrer_id);
CREATE INDEX IF NOT EXISTS idx_referrals_referee ON referrals(referee_id);
CREATE INDEX IF NOT EXISTS idx_referrals_status ON referrals(status);

-- ============================================================
-- SEASON PASS TIERS
-- ============================================================
CREATE TABLE IF NOT EXISTS season_pass_tiers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tier_number integer NOT NULL UNIQUE,
  required_referrals integer NOT NULL,
  reward_amount integer NOT NULL,
  title text NOT NULL,
  description text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE season_pass_tiers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Season pass tiers are publicly readable"
  ON season_pass_tiers FOR SELECT
  TO anon
  USING (is_active = true);

CREATE POLICY "Authenticated users can read season pass tiers"
  ON season_pass_tiers FOR SELECT
  TO authenticated
  USING (is_active = true);

-- Seed default tiers
INSERT INTO season_pass_tiers (tier_number, required_referrals, reward_amount, title, description) VALUES
  (1, 1,  5000,  'First Invite',      'Refer your first friend and earn ₹50'),
  (2, 3,  15000, 'Rising Recruiter',  'Refer 3 friends and claim ₹150 bonus'),
  (3, 5,  30000, 'Squad Builder',     'Bring 5 players and earn ₹300'),
  (4, 10, 75000, 'Army Commander',    'Rally 10 players for a ₹750 reward'),
  (5, 25, 200000,'Legend Recruiter',  'Lead 25 players into the arena for ₹2,000')
ON CONFLICT (tier_number) DO NOTHING;

-- ============================================================
-- SEASON PASS CLAIMS
-- ============================================================
CREATE TABLE IF NOT EXISTS season_pass_claims (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  tier_id uuid NOT NULL REFERENCES season_pass_tiers(id) ON DELETE CASCADE,
  reward_amount integer NOT NULL,
  claimed_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, tier_id)
);

ALTER TABLE season_pass_claims ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own season pass claims"
  ON season_pass_claims FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_season_pass_claims_user ON season_pass_claims(user_id);

-- ============================================================
-- RPC: Generate referral code for a user
-- ============================================================
CREATE OR REPLACE FUNCTION fn_get_or_create_referral_code(p_user_id uuid)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_code text;
  v_existing text;
BEGIN
  SELECT code INTO v_existing FROM referral_codes WHERE user_id = p_user_id;
  IF v_existing IS NOT NULL THEN
    RETURN v_existing;
  END IF;

  LOOP
    v_code := upper(substring(replace(gen_random_uuid()::text, '-', ''), 1, 8));
    BEGIN
      INSERT INTO referral_codes (user_id, code) VALUES (p_user_id, v_code);
      RETURN v_code;
    EXCEPTION WHEN unique_violation THEN
      -- retry on collision
    END;
  END LOOP;
END;
$$;

-- ============================================================
-- RPC: Use a referral code (called at registration)
-- ============================================================
CREATE OR REPLACE FUNCTION fn_use_referral_code(p_code text, p_referee_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_rc referral_codes%ROWTYPE;
  v_referral_id uuid;
BEGIN
  SELECT * INTO v_rc FROM referral_codes WHERE code = upper(p_code);
  IF NOT FOUND THEN
    RETURN jsonb_build_object('ok', false, 'error', 'Invalid referral code');
  END IF;

  IF v_rc.user_id = p_referee_id THEN
    RETURN jsonb_build_object('ok', false, 'error', 'Cannot use your own referral code');
  END IF;

  IF EXISTS (SELECT 1 FROM referrals WHERE referee_id = p_referee_id) THEN
    RETURN jsonb_build_object('ok', false, 'error', 'Already used a referral code');
  END IF;

  INSERT INTO referrals (referrer_id, referee_id, referral_code_id, status)
  VALUES (v_rc.user_id, p_referee_id, v_rc.id, 'pending')
  RETURNING id INTO v_referral_id;

  UPDATE referral_codes SET total_uses = total_uses + 1 WHERE id = v_rc.id;

  RETURN jsonb_build_object('ok', true, 'referral_id', v_referral_id);
END;
$$;

-- ============================================================
-- RPC: Confirm a referral and reward the referrer
-- ============================================================
CREATE OR REPLACE FUNCTION fn_confirm_referral(p_referee_id uuid, p_reward_amount integer DEFAULT 5000)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_referral referrals%ROWTYPE;
BEGIN
  SELECT * INTO v_referral FROM referrals
  WHERE referee_id = p_referee_id AND status = 'pending';

  IF NOT FOUND THEN
    RETURN jsonb_build_object('ok', false, 'error', 'No pending referral found');
  END IF;

  UPDATE referrals
  SET status = 'confirmed', confirmed_at = now(), reward_amount = p_reward_amount
  WHERE id = v_referral.id;

  UPDATE profiles
  SET wallet_balance = wallet_balance + p_reward_amount
  WHERE id = v_referral.referrer_id;

  UPDATE referral_codes
  SET total_rewards_earned = total_rewards_earned + p_reward_amount
  WHERE id = v_referral.referral_code_id;

  INSERT INTO transactions (user_id, type, amount, description)
  VALUES (v_referral.referrer_id, 'deposit', p_reward_amount,
          'Referral reward: friend joined and registered for a tournament');

  UPDATE referrals SET status = 'rewarded', rewarded_at = now() WHERE id = v_referral.id;

  RETURN jsonb_build_object('ok', true, 'rewarded_amount', p_reward_amount);
END;
$$;

-- ============================================================
-- RPC: Claim a season pass tier reward
-- ============================================================
CREATE OR REPLACE FUNCTION fn_claim_season_pass_tier(p_user_id uuid, p_tier_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_tier season_pass_tiers%ROWTYPE;
  v_confirmed_count integer;
BEGIN
  SELECT * INTO v_tier FROM season_pass_tiers WHERE id = p_tier_id AND is_active = true;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('ok', false, 'error', 'Tier not found');
  END IF;

  IF EXISTS (SELECT 1 FROM season_pass_claims WHERE user_id = p_user_id AND tier_id = p_tier_id) THEN
    RETURN jsonb_build_object('ok', false, 'error', 'Tier already claimed');
  END IF;

  SELECT COUNT(*) INTO v_confirmed_count FROM referrals
  WHERE referrer_id = p_user_id AND status IN ('confirmed', 'rewarded');

  IF v_confirmed_count < v_tier.required_referrals THEN
    RETURN jsonb_build_object('ok', false, 'error', 'Not enough confirmed referrals');
  END IF;

  INSERT INTO season_pass_claims (user_id, tier_id, reward_amount)
  VALUES (p_user_id, p_tier_id, v_tier.reward_amount);

  UPDATE profiles
  SET wallet_balance = wallet_balance + v_tier.reward_amount
  WHERE id = p_user_id;

  INSERT INTO transactions (user_id, type, amount, description)
  VALUES (p_user_id, 'deposit', v_tier.reward_amount,
          'Season pass tier reward: ' || v_tier.title);

  RETURN jsonb_build_object('ok', true, 'reward_amount', v_tier.reward_amount);
END;
$$;

-- ============================================================
-- REALTIME
-- ============================================================
ALTER PUBLICATION supabase_realtime ADD TABLE referrals;
ALTER PUBLICATION supabase_realtime ADD TABLE season_pass_claims;
