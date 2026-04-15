import React from 'react';
import { Link } from 'react-router-dom';
import {
  Users, Trophy, Building2, DollarSign, TrendingUp, ArrowUpRight,
  ShieldCheck, BarChart3, Eye, CheckCircle, XCircle, Clock
} from 'lucide-react';
import { PageShell } from '../../components/layout/PageShell';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { DEMO_TOURNAMENTS } from '../../lib/demoData';
import { formatCurrency, getStatusConfig, getGameConfig } from '../../lib/utils';

const PLATFORM_STATS = [
  { label: 'Total Users', value: '52,841', change: '+1,240 this week', icon: <Users size={20} />, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
  { label: 'Active Tournaments', value: '23', change: '4 live now', icon: <Trophy size={20} />, color: 'text-gold-400', bg: 'bg-gold-500/10' },
  { label: 'Verified Organizers', value: '184', change: '+12 pending', icon: <Building2 size={20} />, color: 'text-success-400', bg: 'bg-success-500/10' },
  { label: 'Platform Revenue', value: '₹2.4L', change: '+18% MTD', icon: <DollarSign size={20} />, color: 'text-gold-400', bg: 'bg-gold-500/10' },
];

const PENDING_ACTIONS = [
  { type: 'organizer', label: 'GamingZone India', desc: 'New organizer verification request', time: '10 min ago' },
  { type: 'report', label: 'Cheating Report', desc: 'Tournament: FF Masters Cup - Team "HackPro"', time: '25 min ago' },
  { type: 'payout', label: 'Prize Payout', desc: 'BGMI Duo Warfare - ₹1,00,000 pending', time: '1 hr ago' },
  { type: 'organizer', label: 'EsportsHub', desc: 'New organizer verification request', time: '3 hrs ago' },
];

const SYSTEM_STATUS = [
  { label: 'Auth Service', status: 'operational' },
  { label: 'Database', status: 'operational' },
  { label: 'Realtime', status: 'operational' },
  { label: 'Payment Gateway', status: 'degraded' },
  { label: 'CDN', status: 'operational' },
];

const MOCK_TENANTS = [
  { name: 'ProGaming League', slug: 'progaming', tournaments: 12, revenue: '₹84,000', verified: true },
  { name: 'EsportsHub', slug: 'esportshub', tournaments: 7, revenue: '₹32,000', verified: true },
  { name: 'GamingZone India', slug: 'gamingzone', tournaments: 3, revenue: '₹14,000', verified: false },
  { name: 'TurboTournaments', slug: 'turbogg', tournaments: 21, revenue: '₹1,52,000', verified: true },
];

export function AdminDashboard() {
  return (
    <PageShell variant="dashboard">
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck size={20} className="text-gold-400" />
              <h1 className="font-display text-3xl font-bold text-white">Admin Dashboard</h1>
            </div>
            <p className="text-slate-400 text-sm">Platform-wide oversight and management</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-success-500/10 border border-success-500/30 rounded-lg">
            <span className="w-2 h-2 rounded-full bg-success-400 animate-pulse" />
            <span className="text-xs font-semibold text-success-400">All Systems Operational</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {PLATFORM_STATS.map((stat) => (
            <Card key={stat.label}>
              <CardBody className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center ${stat.color} flex-shrink-0`}>
                  {stat.icon}
                </div>
                <div>
                  <p className="text-2xl font-bold font-display text-white">{stat.value}</p>
                  <p className="text-2xs text-slate-500 uppercase tracking-wider">{stat.label}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{stat.change}</p>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-lg font-bold text-white">All Tournaments</h2>
                  <Link to="/admin/tournaments" className="text-sm text-gold-400 hover:text-gold-300">
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
                      <th className="text-right text-2xs text-slate-500 uppercase tracking-wider px-5 py-3">Prize</th>
                      <th className="text-right text-2xs text-slate-500 uppercase tracking-wider px-5 py-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {DEMO_TOURNAMENTS.map((t) => {
                      const statusConfig = getStatusConfig(t.status);
                      const gameConfig = getGameConfig(t.game);
                      return (
                        <tr key={t.id} className="border-b border-arena-border/50 last:border-0 hover:bg-arena-hover transition-colors">
                          <td className="px-5 py-3">
                            <div className="flex items-center gap-3">
                              <img src={t.banner_url ?? ''} alt="" className="w-8 h-8 rounded-lg object-cover" />
                              <div>
                                <p className="text-sm font-semibold text-white truncate max-w-[160px]">{t.title}</p>
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
                          <td className="px-5 py-3 text-right text-sm font-bold text-gold-400">
                            {formatCurrency(t.prize_pool)}
                          </td>
                          <td className="px-5 py-3 text-right">
                            <Link to={`/tournaments/${t.id}`} className="p-1.5 rounded-lg hover:bg-arena-border text-slate-500 hover:text-white transition-colors inline-flex">
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

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-lg font-bold text-white">Organizer Tenants</h2>
                  <Link to="/admin/tenants" className="text-sm text-gold-400 hover:text-gold-300">View all</Link>
                </div>
              </CardHeader>
              <CardBody className="p-0">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-arena-border">
                      <th className="text-left text-2xs text-slate-500 uppercase tracking-wider px-5 py-3">Organizer</th>
                      <th className="text-right text-2xs text-slate-500 uppercase tracking-wider px-5 py-3">Tournaments</th>
                      <th className="text-right text-2xs text-slate-500 uppercase tracking-wider px-5 py-3">Revenue</th>
                      <th className="text-right text-2xs text-slate-500 uppercase tracking-wider px-5 py-3">Verified</th>
                    </tr>
                  </thead>
                  <tbody>
                    {MOCK_TENANTS.map((tenant) => (
                      <tr key={tenant.slug} className="border-b border-arena-border/50 last:border-0 hover:bg-arena-hover transition-colors">
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gold-600 to-gold-800 flex items-center justify-center text-sm font-bold text-white">
                              {tenant.name[0]}
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-white">{tenant.name}</p>
                              <p className="text-2xs text-slate-600">@{tenant.slug}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3 text-right text-sm text-slate-400">{tenant.tournaments}</td>
                        <td className="px-5 py-3 text-right text-sm font-bold text-white">{tenant.revenue}</td>
                        <td className="px-5 py-3 text-right">
                          {tenant.verified ? (
                            <CheckCircle size={16} className="text-success-400 ml-auto" />
                          ) : (
                            <Clock size={16} className="text-warning-400 ml-auto" />
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardBody>
            </Card>
          </div>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Clock size={18} className="text-warning-400" />
                  <h3 className="font-display font-bold text-white">Pending Actions</h3>
                  <span className="ml-auto w-5 h-5 rounded-full bg-danger-500 text-white text-2xs font-bold flex items-center justify-center">
                    {PENDING_ACTIONS.length}
                  </span>
                </div>
              </CardHeader>
              <CardBody className="space-y-3 pt-0">
                {PENDING_ACTIONS.map((action, i) => (
                  <div key={i} className="p-3 bg-arena-surface rounded-xl border border-arena-border hover:border-gold-500/30 cursor-pointer transition-colors">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-semibold text-white">{action.label}</p>
                      <p className="text-2xs text-slate-600 flex-shrink-0">{action.time}</p>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{action.desc}</p>
                    <div className="flex gap-2 mt-2">
                      <button className="flex items-center gap-1 text-2xs text-success-400 hover:text-success-300 font-semibold">
                        <CheckCircle size={10} />
                        Approve
                      </button>
                      <button className="flex items-center gap-1 text-2xs text-danger-400 hover:text-danger-300 font-semibold">
                        <XCircle size={10} />
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </CardBody>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <BarChart3 size={18} className="text-cyan-400" />
                  <h3 className="font-display font-bold text-white">System Status</h3>
                </div>
              </CardHeader>
              <CardBody className="space-y-2.5 pt-0">
                {SYSTEM_STATUS.map((sys) => (
                  <div key={sys.label} className="flex items-center justify-between">
                    <span className="text-sm text-slate-300">{sys.label}</span>
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          sys.status === 'operational'
                            ? 'bg-success-400 animate-pulse'
                            : 'bg-warning-400 animate-pulse'
                        }`}
                      />
                      <span
                        className={`text-xs font-semibold capitalize ${
                          sys.status === 'operational' ? 'text-success-400' : 'text-warning-400'
                        }`}
                      >
                        {sys.status}
                      </span>
                    </div>
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
