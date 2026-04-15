import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import type { SeasonPassTier, SeasonPassClaim } from '../types/database';

interface TierWithClaim extends SeasonPassTier {
  claimed: boolean;
  claimedAt: string | null;
}

interface UseSeasonPassRewardsReturn {
  tiers: TierWithClaim[];
  loading: boolean;
  error: string | null;
  claiming: string | null;
  claimTier: (tierId: string) => Promise<{ ok: boolean; error?: string }>;
  refresh: () => Promise<void>;
}

export function useSeasonPassRewards(confirmedCount: number): UseSeasonPassRewardsReturn {
  const { user, refreshProfile } = useAuth();
  const [tiers, setTiers] = useState<TierWithClaim[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [claiming, setClaiming] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);

    try {
      const [tiersRes, claimsRes] = await Promise.all([
        supabase.from('season_pass_tiers').select('*').order('tier_number'),
        supabase.from('season_pass_claims').select('*').eq('user_id', user.id),
      ]);

      if (tiersRes.error) throw tiersRes.error;
      if (claimsRes.error) throw claimsRes.error;

      const claimsMap = new Map<string, SeasonPassClaim>(
        (claimsRes.data ?? []).map((c) => [c.tier_id, c])
      );

      const merged: TierWithClaim[] = (tiersRes.data ?? []).map((tier) => ({
        ...tier,
        claimed: claimsMap.has(tier.id),
        claimedAt: claimsMap.get(tier.id)?.claimed_at ?? null,
      }));

      setTiers(merged);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load season pass');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel(`season_pass_claims:${user.id}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'season_pass_claims', filter: `user_id=eq.${user.id}` },
        () => { load(); }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user, load]);

  const claimTier = useCallback(
    async (tierId: string): Promise<{ ok: boolean; error?: string }> => {
      if (!user) return { ok: false, error: 'Not authenticated' };
      setClaiming(tierId);

      try {
        const { data, error: rpcErr } = await supabase
          .rpc('fn_claim_season_pass_tier', { p_user_id: user.id, p_tier_id: tierId });

        if (rpcErr) return { ok: false, error: rpcErr.message };

        const result = data as { ok: boolean; error?: string };
        if (result.ok) {
          await load();
          await refreshProfile();
        }
        return result;
      } catch (e: unknown) {
        return { ok: false, error: e instanceof Error ? e.message : 'Unknown error' };
      } finally {
        setClaiming(null);
      }
    },
    [user, load, refreshProfile]
  );

  return { tiers, loading, error, claiming, claimTier, refresh: load };
}
