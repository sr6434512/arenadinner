import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Calendar, Users, Zap, Trophy, Clock, ChevronRight,
  Shield, ArrowLeft, ExternalLink
} from 'lucide-react';
import { PageShell } from '../components/layout/PageShell';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardBody } from '../components/ui/Card';
import { DEMO_TOURNAMENTS, DEMO_LEADERBOARD } from '../lib/demoData';
import { formatCurrency, formatDate, formatTimeLeft, getStatusConfig, getGameConfig, getTeamSizeLabel } from '../lib/utils';
import { useAuth } from '../context/AuthContext';

type Tab = 'overview' | 'teams' | 'leaderboard';

const DEMO_TEAMS = [
  'Godlike Esports', 'SouL Official', 'Team XO', 'OR Esports',
  'S8UL Esports', 'Blind Esports', 'Global Esports', 'Team IND',
  'Team Insidious', 'Marcos Gaming', 'Revenge Esports', 'Hydra Official',
];

export function TournamentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('overview');

  const tournament = DEMO_TOURNAMENTS.find((t) => t.id === id) ?? DEMO_TOURNAMENTS[0];
  const statusConfig = getStatusConfig(tournament.status);
  const gameConfig = getGameConfig(tournament.game);

  const prizeRows = tournament.prize_distribution
    ? Object.entries(tournament.prize_distribution).map(([rank, amount]) => ({
        rank: parseInt(rank),
        amount: amount as number,
      })).sort((a, b) => a.rank - b.rank)
    : [];

  const tabs: { key: Tab; label: string }[] = [
    { key: 'overview', label: 'Overview' },
    { key: 'teams', label: `Teams (${tournament.filled_slots})` },
    { key: 'leaderboard', label: 'Leaderboard' },
  ];

  return (
    <PageShell variant="public">
      <div className="relative h-72 overflow-hidden">
        <img
          src={tournament.banner_url ?? ''}
          alt={tournament.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-arena-bg via-arena-bg/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 max-w-7xl mx-auto px-6 pb-6">
          <Link
            to="/tournaments"
            className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Tournaments
          </Link>
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant={gameConfig.variant}>{gameConfig.label}</Badge>
                <Badge variant={statusConfig.variant} dot={statusConfig.dot}>
                  {statusConfig.label}
                </Badge>
                {tournament.status === 'ongoing' && (
                  <Badge variant="cyan">Match In Progress</Badge>
                )}
              </div>
              <h1 className="font-display text-4xl md:text-5xl font-bold text-white">
                {tournament.title}
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        <div className="flex gap-8 flex-col lg:flex-row">
          <div className="flex-1 min-w-0">
            <div className="flex gap-0 border-b border-arena-border mb-6 -mt-px overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-5 py-3 text-sm font-semibold whitespace-nowrap transition-colors
                    ${activeTab === tab.key ? 'tab-active' : 'tab-inactive'}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {activeTab === 'overview' && (
              <div className="space-y-6 animate-fade-in">
                <Card>
                  <CardHeader>
                    <h2 className="font-display text-lg font-bold text-white">About This Tournament</h2>
                  </CardHeader>
                  <CardBody>
                    <p className="text-slate-300 leading-relaxed">{tournament.description}</p>
                  </CardBody>
                </Card>

                <Card>
                  <CardHeader>
                    <h2 className="font-display text-lg font-bold text-white">Prize Distribution</h2>
                  </CardHeader>
                  <CardBody className="p-0">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-arena-border">
                          <th className="text-left text-2xs text-slate-500 uppercase tracking-wider px-5 py-3">Rank</th>
                          <th className="text-right text-2xs text-slate-500 uppercase tracking-wider px-5 py-3">Prize</th>
                        </tr>
                      </thead>
                      <tbody>
                        {prizeRows.map(({ rank, amount }, i) => (
                          <tr key={rank} className="border-b border-arena-border/50 last:border-0">
                            <td className="px-5 py-3 text-sm">
                              <span className={i === 0 ? 'rank-gold text-base' : i === 1 ? 'rank-silver' : i === 2 ? 'rank-bronze' : 'text-slate-400'}>
                                #{rank}
                              </span>
                            </td>
                            <td className="px-5 py-3 text-right">
                              <span className="font-bold text-white">{formatCurrency(amount)}</span>
                            </td>
                          </tr>
                        ))}
                        {tournament.per_kill_prize > 0 && (
                          <tr className="border-t border-arena-border/50 bg-cyan-500/5">
                            <td className="px-5 py-3 text-sm text-cyan-400 font-semibold">Per Kill Bonus</td>
                            <td className="px-5 py-3 text-right font-bold text-cyan-400">
                              {formatCurrency(tournament.per_kill_prize)}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </CardBody>
                </Card>

                {tournament.rules && (
                  <Card>
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <Shield size={18} className="text-gold-400" />
                        <h2 className="font-display text-lg font-bold text-white">Rules & Guidelines</h2>
                      </div>
                    </CardHeader>
                    <CardBody>
                      <p className="text-slate-300 leading-relaxed whitespace-pre-wrap text-sm">
                        {tournament.rules}
                      </p>
                    </CardBody>
                  </Card>
                )}
              </div>
            )}

            {activeTab === 'teams' && (
              <div className="animate-fade-in">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {DEMO_TEAMS.slice(0, tournament.filled_slots).map((name, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 arena-card">
                      <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-sm font-bold text-slate-300 flex-shrink-0">
                        {name[0]}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-white truncate">{name}</p>
                        <p className="text-2xs text-slate-500">Slot #{i + 1} • Confirmed</p>
                      </div>
                      <Badge variant="success" size="sm">Ready</Badge>
                    </div>
                  ))}
                  {Array.from({ length: tournament.total_slots - tournament.filled_slots }).map((_, i) => (
                    <div key={`empty-${i}`} className="flex items-center gap-3 p-3 border border-dashed border-arena-border rounded-xl opacity-40">
                      <div className="w-9 h-9 rounded-lg bg-arena-border flex items-center justify-center">
                        <Users size={14} className="text-slate-600" />
                      </div>
                      <p className="text-sm text-slate-600">Slot available</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'leaderboard' && (
              <div className="animate-fade-in">
                {tournament.status === 'open' ? (
                  <div className="text-center py-16 arena-card">
                    <Trophy size={40} className="text-slate-600 mx-auto mb-3" />
                    <p className="text-slate-500 font-medium">Leaderboard will be live during the tournament</p>
                  </div>
                ) : (
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <h2 className="font-display text-lg font-bold text-white">Overall Standings</h2>
                        {tournament.status === 'ongoing' && <span className="live-indicator">LIVE</span>}
                      </div>
                    </CardHeader>
                    <CardBody className="p-0">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-arena-border">
                            <th className="text-left text-2xs text-slate-500 uppercase tracking-wider px-5 py-3">#</th>
                            <th className="text-left text-2xs text-slate-500 uppercase tracking-wider px-5 py-3">Team</th>
                            <th className="text-right text-2xs text-slate-500 uppercase tracking-wider px-5 py-3">Kills</th>
                            <th className="text-right text-2xs text-slate-500 uppercase tracking-wider px-5 py-3">Pts</th>
                          </tr>
                        </thead>
                        <tbody>
                          {DEMO_LEADERBOARD.map((row, i) => (
                            <tr
                              key={row.rank}
                              className={`border-b border-arena-border/50 last:border-0 transition-colors hover:bg-arena-hover
                                ${i === 0 ? 'bg-gold-500/5' : ''}
                              `}
                            >
                              <td className="px-5 py-3">
                                <span className={`text-sm font-bold ${i === 0 ? 'rank-gold' : i === 1 ? 'rank-silver' : i === 2 ? 'rank-bronze' : 'text-slate-500'}`}>
                                  {row.rank}
                                </span>
                              </td>
                              <td className="px-5 py-3">
                                <span className={`text-sm font-semibold ${i < 3 ? 'text-white' : 'text-slate-300'}`}>{row.teamName}</span>
                              </td>
                              <td className="px-5 py-3 text-right text-sm text-slate-400">{row.kills}</td>
                              <td className="px-5 py-3 text-right">
                                <span className="text-sm font-bold text-gold-400">{row.total}</span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </CardBody>
                  </Card>
                )}
              </div>
            )}
          </div>

          <div className="lg:w-80 flex-shrink-0 space-y-4">
            <Card glow={tournament.status === 'open' ? 'gold' : 'none'}>
              <CardBody>
                <div className="text-center mb-5">
                  <p className="text-2xs text-slate-500 uppercase tracking-wider mb-1">Total Prize Pool</p>
                  <p className="font-display text-4xl font-bold text-gold-400">
                    {formatCurrency(tournament.prize_pool)}
                  </p>
                </div>

                {tournament.status === 'open' ? (
                  user ? (
                    <Button fullWidth size="lg" icon={<ChevronRight size={18} />} iconPosition="right">
                      Register Team — {tournament.entry_fee === 0 ? 'FREE' : formatCurrency(tournament.entry_fee)}
                    </Button>
                  ) : (
                    <Link to="/register">
                      <Button fullWidth size="lg">
                        Sign Up to Register
                      </Button>
                    </Link>
                  )
                ) : tournament.status === 'ongoing' ? (
                  <Link to={`/live/${tournament.id}`}>
                    <Button fullWidth size="lg" variant="cyan" icon={<ExternalLink size={16} />} iconPosition="right">
                      Watch Live
                    </Button>
                  </Link>
                ) : (
                  <Button fullWidth variant="secondary" disabled>
                    Tournament Ended
                  </Button>
                )}
              </CardBody>
            </Card>

            <Card>
              <CardHeader>
                <h3 className="font-display font-bold text-white">Tournament Info</h3>
              </CardHeader>
              <CardBody className="space-y-3 pt-0">
                {[
                  { icon: <Users size={16} />, label: 'Format', value: getTeamSizeLabel(tournament.team_size) },
                  { icon: <Trophy size={16} />, label: 'Total Slots', value: `${tournament.total_slots} teams` },
                  {
                    icon: <Users size={16} />,
                    label: 'Slots Left',
                    value: `${tournament.total_slots - tournament.filled_slots} remaining`,
                  },
                  { icon: <Calendar size={16} />, label: 'Start Date', value: formatDate(tournament.start_date) },
                  {
                    icon: <Clock size={16} />,
                    label: 'Registration',
                    value: formatTimeLeft(tournament.registration_deadline),
                  },
                  { icon: <Zap size={16} />, label: 'Per Kill', value: tournament.per_kill_prize > 0 ? formatCurrency(tournament.per_kill_prize) : 'None' },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-slate-500">
                      {item.icon}
                      <span className="text-sm">{item.label}</span>
                    </div>
                    <span className="text-sm font-semibold text-white">{item.value}</span>
                  </div>
                ))}
              </CardBody>
            </Card>

            <div className="arena-card p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-400">Slots Filled</span>
                <span className="text-xs font-bold text-white">{tournament.filled_slots}/{tournament.total_slots}</span>
              </div>
              <div className="h-2 bg-arena-border rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-gold-600 to-gold-400 rounded-full"
                  style={{ width: `${(tournament.filled_slots / tournament.total_slots) * 100}%` }}
                />
              </div>
              <p className="text-xs text-slate-500 mt-2">
                {tournament.total_slots - tournament.filled_slots} slots remaining
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
