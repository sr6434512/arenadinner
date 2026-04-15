import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft, TrendingUp, TrendingDown, Minus,
  Skull, Maximize2, RefreshCw
} from 'lucide-react';
import { useRealtimeLeaderboard } from '../hooks/useRealtimeLeaderboard';
import { DEMO_TOURNAMENTS } from '../lib/demoData';
import { formatCurrency, getGameConfig } from '../lib/utils';
import { Badge } from '../components/ui/Badge';

const MATCH_PHASES = ['Lobby', 'Match 1', 'Match 2', 'Match 3', 'Match 4', 'Match 5'];

export function LiveLeaderboardPage() {
  const { matchId } = useParams<{ matchId: string }>();
  const id = matchId ?? DEMO_TOURNAMENTS[2].id;
  const tournament = DEMO_TOURNAMENTS.find((t) => t.id === id) ?? DEMO_TOURNAMENTS[2];
  const gameConfig = getGameConfig(tournament.game);
  const { entries, loading } = useRealtimeLeaderboard(id);

  const [phase, setPhase] = useState(2);
  const [killFeed, setKillFeed] = useState<{ id: string; text: string }[]>([]);
  const [elapsed, setElapsed] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const teams = ['Godlike', 'SouL', 'Team XO', 'OR Esports', 'S8UL'];
    const interval = setInterval(() => {
      const attacker = teams[Math.floor(Math.random() * teams.length)];
      let victim = teams[Math.floor(Math.random() * teams.length)];
      while (victim === attacker) victim = teams[Math.floor(Math.random() * teams.length)];
      setKillFeed((prev) => [
        { id: crypto.randomUUID(), text: `${attacker} eliminated ${victim} (+1 kill)` },
        ...prev.slice(0, 4),
      ]);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const mins = Math.floor(elapsed / 60).toString().padStart(2, '0');
  const secs = (elapsed % 60).toString().padStart(2, '0');

  const getRankStyle = (rank: number) => {
    if (rank === 1) return 'text-gold-400';
    if (rank === 2) return 'text-slate-300';
    if (rank === 3) return 'text-amber-600';
    return 'text-slate-500';
  };

  return (
    <div className={`min-h-screen bg-arena-bg ${fullscreen ? 'fixed inset-0 z-50 overflow-auto' : ''}`}>
      <div className="sticky top-0 z-30 bg-arena-bg/95 backdrop-blur-md border-b border-arena-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              {!fullscreen && (
                <Link to={`/tournaments/${id}`} className="text-slate-400 hover:text-white transition-colors">
                  <ArrowLeft size={20} />
                </Link>
              )}
              <div>
                <div className="flex items-center gap-2">
                  <Badge variant={gameConfig.variant} size="sm">{gameConfig.label}</Badge>
                  <span className="live-indicator">LIVE</span>
                </div>
                <h1 className="font-display text-xl font-bold text-white mt-0.5 line-clamp-1">
                  {tournament.title}
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-4 flex-shrink-0">
              <div className="text-center">
                <p className="font-display text-2xl font-bold text-white tabular-nums">{mins}:{secs}</p>
                <p className="text-2xs text-slate-500">Elapsed</p>
              </div>
              <div className="w-px h-10 bg-arena-border" />
              <div className="text-center">
                <p className="font-display text-2xl font-bold text-danger-400">
                  {MATCH_PHASES[phase]}
                </p>
                <p className="text-2xs text-slate-500">Phase</p>
              </div>
              <button
                onClick={() => setFullscreen(!fullscreen)}
                className="p-2 rounded-lg bg-arena-card border border-arena-border text-slate-400 hover:text-white transition-colors"
              >
                <Maximize2 size={16} />
              </button>
            </div>
          </div>

          <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
            {MATCH_PHASES.map((p, i) => (
              <button
                key={p}
                onClick={() => setPhase(i)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex-shrink-0
                  ${phase === i ? 'bg-gold-500/20 text-gold-400 border border-gold-500/30' : 'text-slate-500 hover:text-white hover:bg-arena-hover'}
                `}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          <div className="xl:col-span-3">
            <div className="arena-card overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3 border-b border-arena-border">
                <h2 className="font-display text-lg font-bold text-white">Live Standings</h2>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">{entries.length} teams</span>
                  <RefreshCw size={14} className="text-slate-500 animate-spin-slow" />
                </div>
              </div>

              <table className="w-full">
                <thead>
                  <tr className="border-b border-arena-border bg-arena-surface/50">
                    <th className="text-left text-2xs text-slate-500 uppercase tracking-wider px-5 py-3 w-12">#</th>
                    <th className="text-left text-2xs text-slate-500 uppercase tracking-wider px-3 py-3">Team</th>
                    <th className="text-right text-2xs text-slate-500 uppercase tracking-wider px-3 py-3">
                      <span className="flex items-center gap-1 justify-end">
                        <Skull size={12} />
                        Kills
                      </span>
                    </th>
                    <th className="text-right text-2xs text-slate-500 uppercase tracking-wider px-3 py-3">Place Pts</th>
                    <th className="text-right text-2xs text-slate-500 uppercase tracking-wider px-3 py-3">Kill Pts</th>
                    <th className="text-right text-2xs text-slate-500 uppercase tracking-wider px-5 py-3">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {loading
                    ? Array.from({ length: 8 }).map((_, i) => (
                        <tr key={i} className="border-b border-arena-border/50">
                          <td className="px-5 py-4">
                            <div className="w-6 h-4 bg-arena-border rounded animate-pulse" />
                          </td>
                          <td className="px-3 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-arena-border animate-pulse" />
                              <div className="w-32 h-4 bg-arena-border rounded animate-pulse" />
                            </div>
                          </td>
                          <td colSpan={4} className="px-3 py-4">
                            <div className="w-24 h-4 bg-arena-border rounded animate-pulse ml-auto" />
                          </td>
                        </tr>
                      ))
                    : entries.map((entry, i) => (
                        <tr
                          key={entry.teamId}
                          className={`
                            border-b border-arena-border/50 last:border-0 transition-all duration-300
                            ${entry.flash ? 'score-flash' : ''}
                            ${i === 0 ? 'bg-gold-500/5' : i === 1 ? 'bg-slate-300/3' : ''}
                            hover:bg-arena-hover
                          `}
                        >
                          <td className="px-5 py-3.5">
                            <span className={`text-base font-bold font-display ${getRankStyle(entry.rank)}`}>
                              {entry.rank}
                            </span>
                          </td>
                          <td className="px-3 py-3.5">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-slate-700 to-slate-800 border border-arena-border flex items-center justify-center text-sm font-bold text-slate-300 flex-shrink-0">
                                {entry.teamName[0]}
                              </div>
                              <div className="flex items-center gap-2">
                                <span className={`font-semibold ${i < 3 ? 'text-white' : 'text-slate-300'}`}>
                                  {entry.teamName}
                                </span>
                                {entry.change === 'up' && (
                                  <TrendingUp size={12} className="text-success-400 flex-shrink-0" />
                                )}
                                {entry.change === 'down' && (
                                  <TrendingDown size={12} className="text-danger-400 flex-shrink-0" />
                                )}
                                {entry.change === 'same' && (
                                  <Minus size={12} className="text-slate-600 flex-shrink-0" />
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-3 py-3.5 text-right">
                            <span className="text-sm font-bold text-danger-400">{entry.kills}</span>
                          </td>
                          <td className="px-3 py-3.5 text-right text-sm text-slate-400">
                            {entry.placementPts}
                          </td>
                          <td className="px-3 py-3.5 text-right text-sm text-slate-400">
                            {entry.killPts}
                          </td>
                          <td className="px-5 py-3.5 text-right">
                            <span className={`text-base font-bold font-display ${i === 0 ? 'text-gold-400' : 'text-white'}`}>
                              {entry.total}
                            </span>
                          </td>
                        </tr>
                      ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="xl:col-span-1 space-y-4">
            <div className="arena-card overflow-hidden">
              <div className="px-4 py-3 border-b border-arena-border flex items-center gap-2">
                <Skull size={16} className="text-danger-400" />
                <h3 className="font-display font-bold text-white">Kill Feed</h3>
              </div>
              <div className="p-3 space-y-2 min-h-[200px]">
                {killFeed.length === 0 ? (
                  <p className="text-xs text-slate-600 text-center py-4">No kills yet</p>
                ) : (
                  killFeed.map((feed) => (
                    <div
                      key={feed.id}
                      className="flex items-center gap-2 text-xs p-2 rounded-lg bg-danger-500/10 border border-danger-500/20 animate-slide-in-up"
                    >
                      <Skull size={11} className="text-danger-400 flex-shrink-0" />
                      <span className="text-slate-300">{feed.text}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="arena-card overflow-hidden">
              <div className="px-4 py-3 border-b border-arena-border">
                <h3 className="font-display font-bold text-white">Prize Pool</h3>
              </div>
              <div className="p-4 space-y-3">
                {Object.entries(tournament.prize_distribution ?? {}).slice(0, 5).map(([rank, amount]) => (
                  <div key={rank} className="flex items-center justify-between">
                    <span className={`text-sm font-bold ${rank === '1' ? 'rank-gold' : rank === '2' ? 'rank-silver' : rank === '3' ? 'rank-bronze' : 'text-slate-500'}`}>
                      #{rank}
                    </span>
                    <span className="text-sm font-bold text-white">{formatCurrency(amount as number)}</span>
                  </div>
                ))}
                {tournament.per_kill_prize > 0 && (
                  <div className="flex items-center justify-between border-t border-arena-border pt-3">
                    <span className="text-xs text-cyan-400 font-semibold">Per Kill</span>
                    <span className="text-sm font-bold text-cyan-400">
                      {formatCurrency(tournament.per_kill_prize)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="arena-card p-4">
              <h3 className="font-display font-bold text-white mb-3">Top 3</h3>
              <div className="space-y-2">
                {entries.slice(0, 3).map((entry, i) => (
                  <div key={entry.teamId} className="flex items-center gap-3">
                    <span className={`text-xl font-bold font-display ${getRankStyle(entry.rank)}`}>
                      {entry.rank}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white truncate">{entry.teamName}</p>
                      <p className="text-2xs text-slate-500">{entry.kills} kills</p>
                    </div>
                    <span className="font-display font-bold text-gold-400">{entry.total}pts</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
