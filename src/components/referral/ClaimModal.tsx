import React from 'react';
import { X, Trophy, Sparkles, AlertCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import type { SeasonPassTier } from '../../types/database';
import { formatCurrency } from '../../lib/utils';

interface ClaimModalProps {
  tier: SeasonPassTier;
  confirmedCount: number;
  onConfirm: () => Promise<void>;
  onClose: () => void;
  claiming: boolean;
}

export function ClaimModal({ tier, confirmedCount, onConfirm, onClose, claiming }: ClaimModalProps) {
  const eligible = confirmedCount >= tier.required_referrals;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-md arena-card p-0 overflow-hidden">
        <div className="bg-gradient-to-br from-gold-500/20 to-gold-700/10 p-6 border-b border-arena-border">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gold-500/20 border border-gold-500/30 flex items-center justify-center">
                <Trophy size={22} className="text-gold-400" />
              </div>
              <div>
                <p className="text-xs text-gold-400 font-semibold uppercase tracking-wider">
                  Season Pass Tier {tier.tier_number}
                </p>
                <h3 className="font-display text-xl font-bold text-white mt-0.5">{tier.title}</h3>
              </div>
            </div>
            <button onClick={onClose} className="text-slate-500 hover:text-slate-300 transition-colors">
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-5">
          <div className="text-center">
            <p className="text-4xl font-display font-bold text-gold-400">
              {formatCurrency(tier.reward_amount)}
            </p>
            <p className="text-sm text-slate-400 mt-1">wallet credit upon claim</p>
          </div>

          <div className="bg-arena-surface rounded-xl p-4 border border-arena-border space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">Required referrals</span>
              <span className="font-bold text-white">{tier.required_referrals}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">Your confirmed referrals</span>
              <span className={`font-bold ${eligible ? 'text-success-400' : 'text-gold-400'}`}>
                {confirmedCount}
              </span>
            </div>
            {!eligible && (
              <div className="h-1.5 bg-arena-border rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-gold-600 to-gold-400 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min((confirmedCount / tier.required_referrals) * 100, 100)}%` }}
                />
              </div>
            )}
          </div>

          {!eligible && (
            <div className="flex items-start gap-3 bg-warning-500/10 border border-warning-500/20 rounded-xl p-4">
              <AlertCircle size={18} className="text-warning-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-warning-300">
                You need {tier.required_referrals - confirmedCount} more confirmed{' '}
                {tier.required_referrals - confirmedCount === 1 ? 'referral' : 'referrals'} to unlock this reward.
              </p>
            </div>
          )}

          {eligible && (
            <div className="flex items-start gap-3 bg-success-500/10 border border-success-500/20 rounded-xl p-4">
              <Sparkles size={18} className="text-success-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-success-300">
                You've earned this reward! Claim it now and the coins will be credited to your wallet instantly.
              </p>
            </div>
          )}

          <div className="flex gap-3 pt-1">
            <Button variant="secondary" fullWidth onClick={onClose}>
              Cancel
            </Button>
            <Button
              fullWidth
              disabled={!eligible}
              loading={claiming}
              onClick={onConfirm}
              icon={<Trophy size={16} />}
            >
              Claim Reward
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
