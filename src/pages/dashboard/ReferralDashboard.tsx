import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users, Copy, Check, Share2, Trophy, Gift, Clock,
  TrendingUp, ChevronRight, Sparkles, ArrowRight
} from 'lucide-react';
import { PageShell } from '../../components/layout/PageShell';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { ProgressRing } from '../../components/referral/ProgressRing';
import { InviteSlots } from '../../components/referral/InviteSlots';
import { ClaimModal } from '../../components/referral/ClaimModal';
import { useReferrals } from '../../hooks/useReferrals';
import { useSeasonPassRewards } from '../../hooks/useSeasonPassRewards';
import { useNotification } from '../../context/NotificationContext';
import { formatCurrency } from '../../lib/utils';
import type { SeasonPassTier } from '../../types/database';

function ReferralStat({ label, value, icon, color }: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <Card>
      <CardBody className="flex items-center gap-4">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
          {icon}
        </div>
        <div>
          <p className="text-2xl font-display font-bold text-white">{value}</p>
          <p className="text-2xs text-slate-500 uppercase tracking-wider">{label}</p>
        </div>
      </CardBody>
    </Card>
  );
}

export function ReferralDashboard() {
  const { notify } = useNotification();
  const {
    referralCode, referrals, confirmedCount, pendingCount,
    loading: refLoading, shareUrl
  } = useReferrals();

  const {
    tiers, loading: tiersLoading, claiming, claimTier
  } = useSeasonPassRewards(confirmedCount);

  const [copied, setCopied] = useState(false);
  const [selectedTier, setSelectedTier] = useState<SeasonPassTier | null>(null);

  const handleCopy = async () => {
    if (!shareUrl) return;
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    notify('success', 'Copied!', 'Invite link copied to clipboard.');
  };

  const handleShare = async () => {
    if (!shareUrl) return;
    if (navigator.share) {
      await navigator.share({ title: 'Join ArenaDinner', url: shareUrl });
    } else {
      handleCopy();
    }
  };

  const handleClaimConfirm = async () => {
    if (!selectedTier) return;
    const result = await claimTier(selectedTier.id);
    if (result.ok) {
      notify('success', 'Reward Claimed!', `${formatCurrency(selectedTier.reward_amount)} credited to your wallet.`);
      setSelectedTier(null);
    } else {
      notify('error', 'Claim Failed', result.error ?? 'Please try again.');
    }
  };

  const nextTier = tiers.find((t) => !t.claimed && confirmedCount < t.required_referrals);
  const claimableTier = tiers.find((t) => !t.claimed && confirmedCount >= t.required_referrals);

  return (
    <PageShell variant="dashboard">
      <div className="space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold text-white">
              Referral <span className="text-gold-400">Rewards</span>
            </h1>
            <p className="text-slate-400 text-sm mt-0.5">
              Invite friends, earn wallet credits, unlock season pass tiers
            </p>
          </div>
          {claimableTier && (
            <button
              onClick={() => setSelectedTier(claimableTier)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gold-500/15 border border-gold-500/30 text-gold-400 text-sm font-semibold hover:bg-gold-500/25 transition-colors animate-pulse"
            >
              <Sparkles size={15} />
              Claim Available
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <ReferralStat
            label="Total Invited"
            value={referrals.length}
            icon={<Users size={18} />}
            color="bg-cyan-500/10 text-cyan-400"
          />
          <ReferralStat
            label="Confirmed"
            value={confirmedCount}
            icon={<Check size={18} />}
            color="bg-success-500/10 text-success-400"
          />
          <ReferralStat
            label="Pending"
            value={pendingCount}
            icon={<Clock size={18} />}
            color="bg-gold-500/10 text-gold-400"
          />
          <ReferralStat
            label="Rewards Earned"
            value={referralCode ? formatCurrency(referralCode.total_rewards_earned) : '₹0'}
            icon={<TrendingUp size={18} />}
            color="bg-gold-500/10 text-gold-400"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-5">
            <Card glow={referralCode ? 'gold' : 'none'}>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Share2 size={17} className="text-gold-400" />
                  <h3 className="font-display font-bold text-white">Your Invite Link</h3>
                </div>
              </CardHeader>
              <CardBody className="space-y-4">
                {refLoading ? (
                  <div className="h-10 bg-arena-surface rounded-lg animate-pulse" />
                ) : (
                  <>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-arena-surface border border-arena-border rounded-xl px-4 py-3 text-sm text-slate-300 font-mono truncate">
                        {shareUrl || 'Generating your link...'}
                      </div>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={handleCopy}
                        icon={copied ? <Check size={15} /> : <Copy size={15} />}
                      >
                        {copied ? 'Copied' : 'Copy'}
                      </Button>
                      <Button
                        size="sm"
                        onClick={handleShare}
                        icon={<Share2 size={15} />}
                      >
                        Share
                      </Button>
                    </div>

                    {referralCode && (
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-slate-400">Your code:</span>
                        <span className="font-mono font-bold text-gold-400 text-sm tracking-widest bg-gold-500/10 border border-gold-500/20 rounded-lg px-3 py-1">
                          {referralCode.code}
                        </span>
                      </div>
                    )}

                    <p className="text-sm text-slate-500">
                      When a friend registers using your link and joins their first tournament, you earn a wallet reward automatically.
                    </p>
                  </>
                )}
              </CardBody>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users size={17} className="text-cyan-400" />
                    <h3 className="font-display font-bold text-white">Your Invites</h3>
                  </div>
                  <Badge variant="neutral" size="sm">{referrals.length} total</Badge>
                </div>
              </CardHeader>
              <CardBody className="space-y-4">
                {refLoading ? (
                  <div className="h-16 bg-arena-surface rounded-lg animate-pulse" />
                ) : referrals.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-14 h-14 rounded-2xl bg-arena-surface border border-arena-border flex items-center justify-center mx-auto mb-3">
                      <Users size={24} className="text-slate-600" />
                    </div>
                    <p className="text-slate-400 font-medium">No referrals yet</p>
                    <p className="text-slate-600 text-sm mt-1">Share your link to get started</p>
                  </div>
                ) : (
                  <>
                    <InviteSlots referrals={referrals} maxSlots={Math.max(10, referrals.length)} />
                    <div className="space-y-2 mt-2">
                      {referrals.slice(0, 5).map((ref) => {
                        const isConfirmed = ref.status === 'confirmed' || ref.status === 'rewarded';
                        return (
                          <div key={ref.id} className="flex items-center gap-3 py-2 border-b border-arena-border last:border-0">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-xs font-bold text-slate-300">
                              {ref.referee?.username?.[0]?.toUpperCase() ?? '?'}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-white truncate">
                                {ref.referee?.username ?? 'Player'}
                              </p>
                              <p className="text-2xs text-slate-500">
                                {new Date(ref.created_at).toLocaleDateString('en-IN', {
                                  day: 'numeric', month: 'short', year: 'numeric',
                                })}
                              </p>
                            </div>
                            <Badge
                              variant={isConfirmed ? 'success' : 'gold'}
                              dot={ref.status === 'pending'}
                              size="sm"
                            >
                              {isConfirmed ? 'Confirmed' : 'Pending'}
                            </Badge>
                            {isConfirmed && ref.reward_amount > 0 && (
                              <span className="text-xs text-success-400 font-semibold">
                                +{formatCurrency(ref.reward_amount)}
                              </span>
                            )}
                          </div>
                        );
                      })}
                      {referrals.length > 5 && (
                        <p className="text-xs text-slate-500 text-center pt-1">
                          +{referrals.length - 5} more referrals
                        </p>
                      )}
                    </div>
                  </>
                )}
              </CardBody>
            </Card>
          </div>

          <div className="space-y-4">
            {nextTier && (
              <Card>
                <CardBody className="text-center space-y-3">
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Next Milestone</p>
                  <div className="relative inline-flex items-center justify-center">
                    <ProgressRing
                      value={confirmedCount}
                      max={nextTier.required_referrals}
                      size={96}
                      strokeWidth={7}
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="font-display text-xl font-bold text-white">{confirmedCount}</span>
                      <span className="text-2xs text-slate-500">/ {nextTier.required_referrals}</span>
                    </div>
                  </div>
                  <div>
                    <p className="font-bold text-white">{nextTier.title}</p>
                    <p className="text-2xl font-display font-bold text-gold-400 mt-1">
                      {formatCurrency(nextTier.reward_amount)}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      {nextTier.required_referrals - confirmedCount} more{' '}
                      {nextTier.required_referrals - confirmedCount === 1 ? 'referral' : 'referrals'} to unlock
                    </p>
                  </div>
                </CardBody>
              </Card>
            )}

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Trophy size={17} className="text-gold-400" />
                  <h3 className="font-display font-bold text-white">Season Pass</h3>
                </div>
              </CardHeader>
              <CardBody className="space-y-3 pt-2">
                {tiersLoading ? (
                  <div className="space-y-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-12 bg-arena-surface rounded-lg animate-pulse" />
                    ))}
                  </div>
                ) : (
                  tiers.map((tier) => {
                    const unlocked = confirmedCount >= tier.required_referrals;
                    const canClaim = unlocked && !tier.claimed;

                    return (
                      <div
                        key={tier.id}
                        className={`
                          flex items-center gap-3 p-3 rounded-xl border transition-all
                          ${tier.claimed
                            ? 'bg-success-500/5 border-success-500/20'
                            : canClaim
                            ? 'bg-gold-500/10 border-gold-500/30 cursor-pointer hover:bg-gold-500/15'
                            : 'bg-arena-surface border-arena-border opacity-60'
                          }
                        `}
                        onClick={() => canClaim && setSelectedTier(tier)}
                      >
                        <div className={`
                          w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold
                          ${tier.claimed ? 'bg-success-500/20 text-success-400' : canClaim ? 'bg-gold-500/20 text-gold-400' : 'bg-arena-border text-slate-600'}
                        `}>
                          {tier.claimed ? <Check size={14} /> : tier.tier_number}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-semibold truncate ${tier.claimed ? 'text-slate-400' : 'text-white'}`}>
                            {tier.title}
                          </p>
                          <p className="text-2xs text-slate-500">{tier.required_referrals} referrals</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className={`text-sm font-bold ${tier.claimed ? 'text-slate-500' : 'text-gold-400'}`}>
                            {formatCurrency(tier.reward_amount)}
                          </p>
                          {canClaim && (
                            <p className="text-2xs text-gold-400 font-semibold flex items-center gap-0.5 justify-end">
                              Claim <ChevronRight size={10} />
                            </p>
                          )}
                          {tier.claimed && (
                            <p className="text-2xs text-success-400">Claimed</p>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </CardBody>
            </Card>

            <Card>
              <CardBody className="space-y-3">
                <div className="flex items-center gap-2">
                  <Gift size={16} className="text-cyan-400" />
                  <h4 className="font-semibold text-white text-sm">How it works</h4>
                </div>
                {[
                  { step: '1', text: 'Share your unique invite link with friends' },
                  { step: '2', text: 'Friend registers using your link' },
                  { step: '3', text: 'They join their first tournament' },
                  { step: '4', text: 'You receive wallet credits automatically' },
                ].map((item) => (
                  <div key={item.step} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-gold-500/15 border border-gold-500/20 flex items-center justify-center text-2xs font-bold text-gold-400 flex-shrink-0 mt-0.5">
                      {item.step}
                    </div>
                    <p className="text-sm text-slate-400">{item.text}</p>
                  </div>
                ))}
                <Link to="/tournaments">
                  <Button fullWidth variant="secondary" size="sm" icon={<ArrowRight size={14} />} iconPosition="right">
                    Browse Tournaments
                  </Button>
                </Link>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>

      {selectedTier && (
        <ClaimModal
          tier={selectedTier}
          confirmedCount={confirmedCount}
          onConfirm={handleClaimConfirm}
          onClose={() => setSelectedTier(null)}
          claiming={claiming === selectedTier.id}
        />
      )}
    </PageShell>
  );
}
