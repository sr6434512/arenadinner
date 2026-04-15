import React from 'react';
import { Check, Clock, UserPlus } from 'lucide-react';
import type { Referral } from '../../types/database';

interface InviteSlotsProps {
  referrals: Referral[];
  maxSlots?: number;
}

export function InviteSlots({ referrals, maxSlots = 10 }: InviteSlotsProps) {
  const slots = Array.from({ length: Math.max(maxSlots, referrals.length) }, (_, i) => {
    const ref = referrals[i];
    return ref ?? null;
  }).slice(0, Math.max(maxSlots, referrals.length));

  return (
    <div className="flex flex-wrap gap-2">
      {slots.map((ref, i) => {
        if (!ref) {
          return (
            <div
              key={i}
              className="w-10 h-10 rounded-xl border-2 border-dashed border-arena-border flex items-center justify-center text-slate-600"
              title="Empty slot"
            >
              <UserPlus size={14} />
            </div>
          );
        }

        const isConfirmed = ref.status === 'confirmed' || ref.status === 'rewarded';
        const isPending = ref.status === 'pending';

        return (
          <div
            key={ref.id}
            className={`
              w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm
              relative group cursor-default
              ${isConfirmed
                ? 'bg-success-500/15 border border-success-500/30 text-success-400'
                : 'bg-gold-500/10 border border-gold-500/20 text-gold-400'
              }
            `}
            title={`${ref.referee?.username ?? 'Player'} — ${ref.status}`}
          >
            {ref.referee?.username?.[0]?.toUpperCase() ?? '?'}
            <span className={`
              absolute -bottom-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center
              ${isConfirmed ? 'bg-success-500' : 'bg-gold-500'}
            `}>
              {isConfirmed ? <Check size={8} className="text-white" /> : <Clock size={8} className="text-arena-bg" />}
            </span>

            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-arena-surface border border-arena-border rounded-lg text-xs text-slate-300 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
              {ref.referee?.username ?? 'Player'} · {ref.status}
            </div>
          </div>
        );
      })}
    </div>
  );
}
