/*
  # ArenaDinner Core Schema

  ## Overview
  Creates the full database schema for the ArenaDinner esports tournament SaaS platform.

  ## New Tables

  ### profiles
  - Extends Supabase auth.users with game UIDs, wallet balance, and role

  ### tenants
  - Organizer accounts with branding (logo, colors, slug)

  ### tournaments
  - Full tournament config: game type, slots, pricing, prizing, status lifecycle

  ### teams
  - Team records with captain, logo, and optional tag

  ### team_members
  - Roster entries linking users to teams with in-game names

  ### registrations
  - Tournament registration linking teams to slots with payment/approval status

  ### matches
  - Match instances within a tournament (round, schedule, status)

  ### match_results
  - Per-team per-match results: kills, placement, computed points

  ### notifications
  - User-targeted notification records

  ### transactions
  - Wallet transactions for entry fees, prizes, and refunds

  ## Security
  - RLS enabled on all tables
  - Players can read their own data and public tournament data
  - Organizers scoped to their own tournaments/tenants
  - Admins use service role

  ## Notes
  1. All timestamps use timestamptz for timezone safety
  2. wallet_balance stored as integer (paise/cents, not rupees/dollars)
  3. prize_distribution is a JSONB map: {"1": 5000, "2": 2000, "3": 1000}
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- PROFILES
-- ============================================================
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE NOT NULL,
  display_name text,
  avatar_url text,
  role text NOT NULL DEFAULT 'player' CHECK (role IN ('player', 'captain', 'organizer', 'admin')),
  bgmi_uid text,
  ff_uid text,
  wallet_balance integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Public profiles are readable"
  ON profiles FOR SELECT
  TO anon
  USING (true);

-- ============================================================
-- TENANTS
-- ============================================================
CREATE TABLE IF NOT EXISTS tenants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  logo_url text,
  banner_url text,
  primary_color text NOT NULL DEFAULT '#F59E0B',
  description text,
  is_verified boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tenants are publicly readable"
  ON tenants FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Authenticated users can read tenants"
  ON tenants FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Owners can update their tenant"
  ON tenants FOR UPDATE
  TO authenticated
  USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Owners can insert tenant"
  ON tenants FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = owner_id);

-- ============================================================
-- TOURNAMENTS
-- ============================================================
CREATE TABLE IF NOT EXISTS tournaments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid REFERENCES tenants(id) ON DELETE SET NULL,
  organizer_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  game text NOT NULL CHECK (game IN ('bgmi', 'freefire')),
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'open', 'ongoing', 'completed', 'cancelled')),
  team_size text NOT NULL DEFAULT 'squad' CHECK (team_size IN ('solo', 'duo', 'squad')),
  total_slots integer NOT NULL DEFAULT 32,
  filled_slots integer NOT NULL DEFAULT 0,
  entry_fee integer NOT NULL DEFAULT 0,
  prize_pool integer NOT NULL DEFAULT 0,
  prize_distribution jsonb,
  per_kill_prize integer NOT NULL DEFAULT 0,
  banner_url text,
  rules text,
  registration_deadline timestamptz,
  start_date timestamptz,
  end_date timestamptz,
  is_private boolean NOT NULL DEFAULT false,
  private_code text,
  approval_mode text NOT NULL DEFAULT 'auto' CHECK (approval_mode IN ('auto', 'manual')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE tournaments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public tournaments are readable by all"
  ON tournaments FOR SELECT
  TO anon
  USING (is_private = false AND status != 'draft');

CREATE POLICY "Authenticated users can read public tournaments"
  ON tournaments FOR SELECT
  TO authenticated
  USING (is_private = false AND status != 'draft');

CREATE POLICY "Organizers can read their own tournaments"
  ON tournaments FOR SELECT
  TO authenticated
  USING (auth.uid() = organizer_id);

CREATE POLICY "Organizers can insert tournaments"
  ON tournaments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = organizer_id);

CREATE POLICY "Organizers can update their own tournaments"
  ON tournaments FOR UPDATE
  TO authenticated
  USING (auth.uid() = organizer_id)
  WITH CHECK (auth.uid() = organizer_id);

CREATE INDEX IF NOT EXISTS idx_tournaments_game ON tournaments(game);
CREATE INDEX IF NOT EXISTS idx_tournaments_status ON tournaments(status);
CREATE INDEX IF NOT EXISTS idx_tournaments_organizer ON tournaments(organizer_id);

-- ============================================================
-- TEAMS
-- ============================================================
CREATE TABLE IF NOT EXISTS teams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  tag text,
  logo_url text,
  captain_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  tournament_id uuid REFERENCES tournaments(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE teams ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Teams are publicly readable"
  ON teams FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Authenticated users can read teams"
  ON teams FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Captains can insert teams"
  ON teams FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = captain_id);

CREATE POLICY "Captains can update their team"
  ON teams FOR UPDATE
  TO authenticated
  USING (auth.uid() = captain_id)
  WITH CHECK (auth.uid() = captain_id);

-- ============================================================
-- TEAM MEMBERS
-- ============================================================
CREATE TABLE IF NOT EXISTS team_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id uuid NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  in_game_name text NOT NULL,
  joined_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(team_id, user_id)
);

ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Team members are publicly readable"
  ON team_members FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Authenticated users can read team members"
  ON team_members FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can join teams"
  ON team_members FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can leave teams"
  ON team_members FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_team_members_team ON team_members(team_id);
CREATE INDEX IF NOT EXISTS idx_team_members_user ON team_members(user_id);

-- ============================================================
-- REGISTRATIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id uuid NOT NULL REFERENCES tournaments(id) ON DELETE CASCADE,
  team_id uuid NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  slot_number integer,
  payment_status text NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded')),
  approval_status text NOT NULL DEFAULT 'pending' CHECK (approval_status IN ('pending', 'approved', 'rejected')),
  registered_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(tournament_id, team_id),
  UNIQUE(tournament_id, slot_number)
);

ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Registrations are publicly readable"
  ON registrations FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Authenticated users can read registrations"
  ON registrations FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Team captains can register their teams"
  ON registrations FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM teams
      WHERE teams.id = team_id
      AND teams.captain_id = auth.uid()
    )
  );

CREATE POLICY "Organizers can update registrations for their tournaments"
  ON registrations FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM tournaments
      WHERE tournaments.id = tournament_id
      AND tournaments.organizer_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM tournaments
      WHERE tournaments.id = tournament_id
      AND tournaments.organizer_id = auth.uid()
    )
  );

CREATE INDEX IF NOT EXISTS idx_registrations_tournament ON registrations(tournament_id);
CREATE INDEX IF NOT EXISTS idx_registrations_team ON registrations(team_id);

-- ============================================================
-- MATCHES
-- ============================================================
CREATE TABLE IF NOT EXISTS matches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id uuid NOT NULL REFERENCES tournaments(id) ON DELETE CASCADE,
  match_number integer NOT NULL,
  round integer NOT NULL DEFAULT 1,
  status text NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'lobby', 'in_progress', 'completed')),
  scheduled_at timestamptz,
  started_at timestamptz,
  ended_at timestamptz,
  map text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE matches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Matches are publicly readable"
  ON matches FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Authenticated users can read matches"
  ON matches FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Organizers can insert matches for their tournaments"
  ON matches FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM tournaments
      WHERE tournaments.id = tournament_id
      AND tournaments.organizer_id = auth.uid()
    )
  );

CREATE POLICY "Organizers can update matches for their tournaments"
  ON matches FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM tournaments
      WHERE tournaments.id = tournament_id
      AND tournaments.organizer_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM tournaments
      WHERE tournaments.id = tournament_id
      AND tournaments.organizer_id = auth.uid()
    )
  );

CREATE INDEX IF NOT EXISTS idx_matches_tournament ON matches(tournament_id);

-- ============================================================
-- MATCH RESULTS
-- ============================================================
CREATE TABLE IF NOT EXISTS match_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id uuid NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  team_id uuid NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  placement integer,
  kills integer NOT NULL DEFAULT 0,
  placement_points integer NOT NULL DEFAULT 0,
  kill_points integer NOT NULL DEFAULT 0,
  total_points integer NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(match_id, team_id)
);

ALTER TABLE match_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Match results are publicly readable"
  ON match_results FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Authenticated users can read match results"
  ON match_results FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Organizers can insert match results"
  ON match_results FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM matches
      JOIN tournaments ON tournaments.id = matches.tournament_id
      WHERE matches.id = match_id
      AND tournaments.organizer_id = auth.uid()
    )
  );

CREATE POLICY "Organizers can update match results"
  ON match_results FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM matches
      JOIN tournaments ON tournaments.id = matches.tournament_id
      WHERE matches.id = match_id
      AND tournaments.organizer_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM matches
      JOIN tournaments ON tournaments.id = matches.tournament_id
      WHERE matches.id = match_id
      AND tournaments.organizer_id = auth.uid()
    )
  );

CREATE INDEX IF NOT EXISTS idx_match_results_match ON match_results(match_id);
CREATE INDEX IF NOT EXISTS idx_match_results_team ON match_results(team_id);

-- ============================================================
-- NOTIFICATIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type text NOT NULL DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'elimination', 'prize')),
  title text NOT NULL,
  message text NOT NULL,
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own notifications"
  ON notifications FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications"
  ON notifications FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);

-- ============================================================
-- TRANSACTIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  tournament_id uuid REFERENCES tournaments(id) ON DELETE SET NULL,
  type text NOT NULL CHECK (type IN ('entry_fee', 'prize_payout', 'refund', 'deposit')),
  amount integer NOT NULL,
  description text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own transactions"
  ON transactions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_transactions_user ON transactions(user_id);

-- ============================================================
-- ENABLE REALTIME
-- ============================================================
ALTER PUBLICATION supabase_realtime ADD TABLE match_results;
ALTER PUBLICATION supabase_realtime ADD TABLE matches;
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
