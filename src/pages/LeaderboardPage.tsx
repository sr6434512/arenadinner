import React from 'react';
import { Link } from 'react-router-dom';
import { Trophy, ExternalLink } from 'lucide-react';
import { PageShell } from '../components/layout/PageShell';
import { Badge } from '../components/ui/Badge';
import { DEMO_TOURNAMENTS, DEMO_LEADERBOARD } from '../lib/demoData';
import { formatCurrency, getGameConfig } from '../lib/utils';

export function LeaderboardPage() {
  const ongoingTournaments = DEMO_TOURNAMENTS.filter((t) => t.status === 'ongoing');

  return (
    <PageShell variant="public">
      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="section-heading mb-1">Leaderboards</h1>
          <p className="text-slate-400 text-sm">Live standings for ongoing tournaments</p>
        </div>

        {ongoingTournaments.map((t) => {
          const gameConfig = getGameConfig(t.game);
          return (
            <div key={t.id} className="arena-card overflow-hidden mb-6">
              <div className="relative h-32 overflow-hidden">
                <img src={t.banner_url ?? ''} alt={t.title} className="w-full h-full object-cover opacity-30" />
                <div className="absolute inset-0 flex items-center justify-between px-6">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant={gameConfig.variant}>{gameConfig.label}</Badge>
                      <span className="live-indicator">LIVE</span>
                    </div>
                    <h2 className="font-display text-2xl font-bold text-white">{t.title}</h2>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-2xs text-slate-500 uppercase tracking-wider">Prize Pool</p>
                      <p className="font-display text-2xl font-bold text-gold-400">{formatCurrency(t.prize_pool)}</p>
                    </div>
                    <Link
                      to={`/live/${t.id}`}
                      className="flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-arena-bg font-bold rounded-xl text-sm transition-colors shadow-glow-cyan"
                    >
                      <ExternalLink size={14} />
                      Full View
                    </Link>
                  </div>
                </div>
              </div>

              <table className="w-full">
                <thead>
                  <tr className="border-b border-arena-border bg-arena-surface/50">
                    <th className="text-left text-2xs text-slate-500 uppercase tracking-wider px-6 py-3 w-12">#</th>
                    <th className="text-left text-2xs text-slate-500 uppercase tracking-wider px-4 py-3">Team</th>
                    <th className="text-right text-2xs text-slate-500 uppercase tracking-wider px-4 py-3">Kills</th>
                    <th className="text-right text-2xs text-slate-500 uppercase tracking-wider px-6 py-3">Total Pts</th>
                  </tr>
                </thead>
                <tbody>
                  {DEMO_LEADERBOARD.map((row, i) => (
                    <tr key={row.rank} className={`border-b border-arena-border/50 last:border-0 ${i === 0 ? 'bg-gold-500/5' : ''}`}>
                      <td className="px-6 py-3">
                        <span className={`font-bold text-sm ${i === 0 ? 'rank-gold text-base' : i === 1 ? 'rank-silver' : i === 2 ? 'rank-bronze' : 'text-slate-500'}`}>
                          {row.rank}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm font-semibold text-white">{row.teamName}</td>
                      <td className="px-4 py-3 text-right text-sm font-bold text-danger-400">{row.kills}</td>
                      <td className="px-6 py-3 text-right">
                        <span className={`font-display font-bold ${i === 0 ? 'text-gold-400 text-lg' : 'text-white'}`}>
                          {row.total}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        })}

        {ongoingTournaments.length === 0 && (
          <div className="text-center py-20 arena-card">
            <Trophy size={40} className="text-slate-600 mx-auto mb-4" />
            <h3 className="font-display text-xl font-bold text-slate-500 mb-2">No live tournaments</h3>
            <p className="text-slate-600 text-sm">Check back when matches are in progress</p>
          </div>
        )}
      </div>
    </PageShell>
  );
}
