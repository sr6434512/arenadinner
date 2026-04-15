import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import type { ReferralCode, Referral } from '../types/database';

interface UseReferralsReturn {
  referralCode: ReferralCode | null;
  referrals: Referral[];
  confirmedCount: number;
  pendingCount: number;
  loading: boolean;
  error: string | null;
  shareUrl: string;
  refresh: () => Promise<void>;
}

export function useReferrals(): UseReferralsReturn {
  const { user } = useAuth();
  const [referralCode, setReferralCode] = useState<ReferralCode | null>(null);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);

    try {
      const { data: code, error: codeErr } = await supabase
        .rpc('fn_get_or_create_referral_code', { p_user_id: user.id });

      if (codeErr) throw codeErr;

      const { data: rc, error: rcErr } = await supabase
        .from('referral_codes')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (rcErr) throw rcErr;
      setReferralCode(rc);

      const { data: refs, error: refsErr } = await supabase
        .from('referrals')
        .select('*, referee:profiles!referrals_referee_id_fkey(username, avatar_url)')
        .eq('referrer_id', user.id)
        .order('created_at', { ascending: false });

      if (refsErr) throw refsErr;
      setReferrals((refs as Referral[]) ?? []);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load referrals');
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
      .channel(`referrals:${user.id}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'referrals', filter: `referrer_id=eq.${user.id}` },
        () => { load(); }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user, load]);

  const confirmedCount = referrals.filter(
    (r) => r.status === 'confirmed' || r.status === 'rewarded'
  ).length;

  const pendingCount = referrals.filter((r) => r.status === 'pending').length;

  const shareUrl = referralCode
    ? `${window.location.origin}/register?ref=${referralCode.code}`
    : '';

  return {
    referralCode,
    referrals,
    confirmedCount,
    pendingCount,
    loading,
    error,
    shareUrl,
    refresh: load,
  };
}
