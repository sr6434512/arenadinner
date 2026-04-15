import React from 'react';
import { Link } from 'react-router-dom';
import {
  Trophy, Users, Wallet, TrendingUp, Plus, Eye,
  Settings, ChevronRight, ArrowUpRight, BarChart3
} from 'lucide-react';
import { PageShell } from '../../components/layout/PageShell';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import { DEMO_TOURNAMENTS } from '../../lib/demoData';
import { formatCurrency, getStatusConfig, getGameConfig } from '../../lib/utils';

const REVENUE_STATS = [
  { label: 'Total Entries Collected', value: '₹3,24,000', change: '+12%', up: true },
  { label: 'Prizes Distributed', value: '₹2,80,000', change: '-', up: true },
  { label: 'Net Revenue', value: '₹44,000', change: '+8%', up: true },
  { label: 'Active Tournaments', value: '3', change: '', up: true },
];

export function OrgDashboard() {
  const { profile } = useAuth();

  return (
    <PageShell variant="dashboard">
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold text-white">
              Organizer Dashboard
            </h1>
            <p className="text-slate-400 text-sm mt-0.5">
              Welcome back, <span className="text-gold-400">{profile?.username}</span>
            </p>
          </div>
          <Link to="/org/tournaments/create">
            <Button icon={<Plus size={16} />}>Create Tournament</Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {REVENUE_STATS.map((stat) => (
            <Card key={stat.label}>
              <CardBody className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-2xl font-bold font-display text-white">{stat.value}</p>
                  <p className="text-2xs text-slate-500 uppercase tracking-wider mt-1">{stat.label}</p>
                </div>
                {stat.change && (
                  <span className="flex items-center gap-1 text-xs font-bold text-success-400 flex-shrink-0">
                    <ArrowUpRight size={12} />
                    {stat.change}
                  </span>
                )}
              </CardBody>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-lg font-bold text-white">Tournament Pipeline</h2>
                  <Link to="/org/tournaments" className="text-sm text-gold-400 hover:text-gold-300">
                    View all
                  </Link>
                </div>
              </CardHeader>
              <CardBody className="p-0">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-arena-border">
                      <th className="text-left text-2xs text-slate-500 uppercase tracking-wider px-5 py-3">Tournament</th>
                      <th className="text-left text-2xs text-slate-500 uppercase tracking-wider px-5 py-3">Status</th>
                      <th className="text-right text-2xs text-slate-500 uppercase tracking-wider px-5 py-3">Teams</th>
                      <th className="text-right text-2xs text-slate-500 uppercase tracking-wider px-5 py-3">Revenue</th>
                      <th className="text-right text-2xs text-slate-500 uppercase tracking-wider px-5 py-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {DEMO_TOURNAMENTS.slice(0, 5).map((t) => {
                      const statusConfig = getStatusConfig(t.status);
                      const gameConfig = getGameConfig(t.game);
                      const revenue = (t.filled_slots * t.entry_fee) / 100;
                      return (
                        <tr key={t.id} className="border-b border-arena-border/50 last:border-0 hover:bg-arena-hover transition-colors">
                          <td className="px-5 py-3">
                            <div className="flex items-center gap-3">
                              <img src={t.banner_url ?? ''} alt="" className="w-8 h-8 rounded-lg object-cover" />
                              <div>
                                <p className="text-sm font-semibold text-white truncate max-w-[180px]">{t.title}</p>
                                <Badge variant={gameConfig.variant} size="sm">{gameConfig.label}</Badge>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-3">
                            <Badge variant={statusConfig.variant} dot={statusConfig.dot} size="sm">
                              {statusConfig.label}
                            </Badge>
                          </td>
                          <td className="px-5 py-3 text-right text-sm text-slate-400">
                            {t.filled_slots}/{t.total_slots}
                          </td>
                          <td className="px-5 py-3 text-right text-sm font-bold text-white">
                            ₹{revenue.toLocaleString()}
                          </td>
                          <td className="px-5 py-3 text-right">
                            <Link
                              to={`/org/tournaments/${t.id}`}
                              className="p-1.5 rounded-lg hover:bg-arena-border text-slate-500 hover:text-white transition-colors inline-flex"
                            >
                              <Eye size={14} />
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </CardBody>
            </Card>
          </div>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <BarChart3 size={18} className="text-cyan-400" />
                  <h3 className="font-display font-bold text-white">Quick Actions</h3>
                </div>
              </CardHeader>
              <CardBody className="space-y-2 pt-0">
                {[
                  { icon: <Plus size={16} />, label: 'Create Tournament', path: '/org/tournaments/create', variant: 'primary' as const },
                  { icon: <Trophy size={16} />, label: 'Manage Tournaments', path: '/org/tournaments', variant: 'secondary' as const },
                  { icon: <Wallet size={16} />, label: 'Process Payouts', path: '/org/payouts', variant: 'secondary' as const },
                  { icon: <Settings size={16} />, label: 'Org Settings', path: '/org/settings', variant: 'secondary' as const },
                ].map((action) => (
                  <Link key={action.path} to={action.path}>
                    <Button fullWidth variant={action.variant} icon={action.icon} size="sm">
                      {action.label}
                    </Button>
                  </Link>
                ))}
              </CardBody>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Users size={18} className="text-gold-400" />
                  <h3 className="font-display font-bold text-white">Recent Registrations</h3>
                </div>
              </CardHeader>
              <CardBody className="space-y-3 pt-0">
                {[
                  { team: 'Godlike Esports', tournament: 'BGMI Pro League', time: '5 min ago' },
                  { team: 'SouL Official', tournament: 'BGMI Pro League', time: '12 min ago' },
                  { team: 'Team XO', tournament: 'FF Masters Cup', time: '25 min ago' },
                  { team: 'OR Esports', tournament: 'FF Masters Cup', time: '1 hr ago' },
                ].map((reg, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-gold-500/10 flex items-center justify-center text-gold-400 flex-shrink-0">
                      <Users size={12} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white">{reg.team}</p>
                      <p className="text-2xs text-slate-500 truncate">{reg.tournament}</p>
                    </div>
                    <p className="text-2xs text-slate-600 flex-shrink-0">{reg.time}</p>
                  </div>
                ))}
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
