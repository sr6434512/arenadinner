import React from 'react';
import { Link } from 'react-router-dom';
import {
  Trophy, Users, Wallet, Bell, Clock, ArrowRight,
  TrendingUp, Swords, Calendar, ChevronRight, Star, Gift, Sparkles
} from 'lucide-react';
import { PageShell } from '../../components/layout/PageShell';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import { DEMO_TOURNAMENTS } from '../../lib/demoData';
import { formatCurrency, formatTimeLeft, getStatusConfig, getGameConfig } from '../../lib/utils';

const RECENT_ACTIVITY = [
  { type: 'registration', text: 'Registered for BGMI Pro League Season 4', time: '2 hours ago', icon: <Trophy size={14} /> },
  { type: 'prize', text: 'Prize ₹5,000 received for 3rd place finish', time: '1 day ago', icon: <Star size={14} /> },
  { type: 'team', text: 'Player "ShadowKill" joined your team', time: '3 days ago', icon: <Users size={14} /> },
];

export function PlayerDashboard() {
  const { profile } = useAuth();
  const activeTournaments = DEMO_TOURNAMENTS.filter((t) => t.status === 'open' || t.status === 'ongoing');
  const upcomingTournament = DEMO_TOURNAMENTS.find((t) => t.status === 'ongoing') ?? DEMO_TOURNAMENTS[0];

  return (
    <PageShell variant="dashboard">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold text-white">
              Welcome back, <span className="text-gold-400">{profile?.username ?? 'Player'}</span>
            </h1>
            <p className="text-slate-400 text-sm mt-0.5">Here's your tournament overview</p>
          </div>
          <Link to="/tournaments">
            <Button icon={<Swords size={16} />} size="sm">
              Browse Tournaments
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              label: 'Active Registrations',
              value: '3',
              sub: 'in 2 tournaments',
              icon: <Trophy size={20} />,
              color: 'text-gold-400',
              bg: 'bg-gold-500/10',
            },
            {
              label: 'Team Members',
              value: '4',
              sub: 'full squad',
              icon: <Users size={20} />,
              color: 'text-cyan-400',
              bg: 'bg-cyan-500/10',
            },
            {
              label: 'Wallet Balance',
              value: `₹${((profile?.wallet_balance ?? 0) / 100).toLocaleString()}`,
              sub: 'available',
              icon: <Wallet size={20} />,
              color: 'text-success-400',
              bg: 'bg-success-500/10',
            },
            {
              label: 'Total Earnings',
              value: '₹12,500',
              sub: 'lifetime',
              icon: <TrendingUp size={20} />,
              color: 'text-gold-400',
              bg: 'bg-gold-500/10',
            },
          ].map((stat) => (
            <Card key={stat.label}>
              <CardBody className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center ${stat.color} flex-shrink-0`}>
                  {stat.icon}
                </div>
                <div>
                  <p className="text-2xl font-bold font-display text-white">{stat.value}</p>
                  <p className="text-2xs text-slate-500 uppercase tracking-wider">{stat.label}</p>
                  <p className="text-xs text-slate-500">{stat.sub}</p>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-bold text-white">Your Next Match</h2>
            </div>

            {upcomingTournament.status === 'ongoing' ? (
              <div className="arena-card border-danger-500/30 bg-danger-500/5 p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg overflow-hidden">
                      <img src={upcomingTournament.banner_url ?? ''} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="font-bold text-white">{upcomingTournament.title}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <Badge variant={getGameConfig(upcomingTournament.game).variant} size="sm">
                          {getGameConfig(upcomingTournament.game).label}
                        </Badge>
                        <span className="live-indicator">MATCH 2 IN PROGRESS</span>
                      </div>
                    </div>
                  </div>
                </div>
                <Link to={`/live/${upcomingTournament.id}`}>
                  <Button fullWidth variant="cyan" icon={<ArrowRight size={16} />} iconPosition="right">
                    Watch Live Leaderboard
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="arena-card p-5">
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src={upcomingTournament.banner_url ?? ''}
                    alt=""
                    className="w-12 h-12 rounded-xl object-cover"
                  />
                  <div>
                    <p className="font-bold text-white">{upcomingTournament.title}</p>
                    <div className="flex items-center gap-1.5 text-sm text-slate-400 mt-0.5">
                      <Clock size={14} />
                      {formatTimeLeft(upcomingTournament.start_date)}
                    </div>
                  </div>
                </div>
                <div className="h-1.5 bg-arena-border rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-gold-600 to-gold-400 rounded-full"
                    style={{ width: `${(upcomingTournament.filled_slots / upcomingTournament.total_slots) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  {upcomingTournament.filled_slots}/{upcomingTournament.total_slots} teams registered
                </p>
              </div>
            )}

            <h2 className="font-display text-xl font-bold text-white mt-2">Open Tournaments</h2>
            <div className="space-y-3">
              {activeTournaments.slice(0, 3).map((t) => {
                const statusConfig = getStatusConfig(t.status);
                const gameConfig = getGameConfig(t.game);
                return (
                  <Link key={t.id} to={`/tournaments/${t.id}`}>
                    <div className="arena-card p-4 hover:border-gold-500/30 hover:bg-arena-hover transition-all cursor-pointer flex items-center gap-4">
                      <img src={t.banner_url ?? ''} alt="" className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-white truncate">{t.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant={gameConfig.variant} size="sm">{gameConfig.label}</Badge>
                          <Badge variant={statusConfig.variant} dot={statusConfig.dot} size="sm">{statusConfig.label}</Badge>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="font-display font-bold text-gold-400">{formatCurrency(t.prize_pool)}</p>
                        <p className="text-2xs text-slate-500 mt-0.5">
                          {t.entry_fee === 0 ? 'FREE' : formatCurrency(t.entry_fee)} entry
                        </p>
                      </div>
                      <ChevronRight size={16} className="text-slate-600" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Users size={18} className="text-cyan-400" />
                  <h3 className="font-display font-bold text-white">My Team</h3>
                </div>
              </CardHeader>
              <CardBody className="space-y-2 pt-0">
                {['ShadowStrike', 'HeadShotKing', 'NinjaPlayer', profile?.username ?? 'You'].map((name, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-xs font-bold text-slate-300">
                      {name[0]}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-white">{name}</p>
                    </div>
                    {i === 3 && <Badge variant="gold" size="sm">Captain</Badge>}
                  </div>
                ))}
                <Link to="/dashboard/team">
                  <Button fullWidth variant="secondary" size="sm" className="mt-2">
                    Manage Team
                  </Button>
                </Link>
              </CardBody>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Bell size={18} className="text-gold-400" />
                  <h3 className="font-display font-bold text-white">Recent Activity</h3>
                </div>
              </CardHeader>
              <CardBody className="space-y-3 pt-0">
                {RECENT_ACTIVITY.map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-lg bg-arena-surface flex items-center justify-center text-gold-400 flex-shrink-0 mt-0.5">
                      {item.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-300 leading-snug">{item.text}</p>
                      <p className="text-2xs text-slate-600 mt-0.5">{item.time}</p>
                    </div>
                  </div>
                ))}
              </CardBody>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Calendar size={18} className="text-cyan-400" />
                  <h3 className="font-display font-bold text-white">Upcoming Schedule</h3>
                </div>
              </CardHeader>
              <CardBody className="space-y-3 pt-0">
                {DEMO_TOURNAMENTS.slice(0, 3).map((t) => (
                  <div key={t.id} className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-gold-500 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{t.title}</p>
                      <p className="text-2xs text-slate-500">{formatTimeLeft(t.start_date)}</p>
                    </div>
                  </div>
                ))}
              </CardBody>
            </Card>

            <Link to="/dashboard/referrals">
              <div className="arena-card p-4 border-gold-500/20 bg-gradient-to-br from-gold-500/10 to-gold-700/5 hover:border-gold-500/40 hover:bg-gold-500/15 transition-all cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gold-500/20 border border-gold-500/30 flex items-center justify-center flex-shrink-0">
                    <Gift size={18} className="text-gold-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="font-bold text-white text-sm">Referral Rewards</p>
                      <Sparkles size={12} className="text-gold-400" />
                    </div>
                    <p className="text-2xs text-slate-400 mt-0.5">Invite friends, earn wallet credits</p>
                  </div>
                  <ChevronRight size={16} className="text-gold-500 flex-shrink-0" />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
