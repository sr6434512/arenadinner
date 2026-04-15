import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, Eye, Settings, BarChart3 } from 'lucide-react';
import { PageShell } from '../../components/layout/PageShell';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { DEMO_TOURNAMENTS } from '../../lib/demoData';
import { formatCurrency, getStatusConfig, getGameConfig } from '../../lib/utils';

export function OrgTournamentsPage() {
  return (
    <PageShell variant="dashboard">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold text-white">My Tournaments</h1>
            <p className="text-slate-400 text-sm">Manage and monitor your tournaments</p>
          </div>
          <Link to="/org/tournaments/create">
            <Button icon={<Plus size={16} />}>Create Tournament</Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {DEMO_TOURNAMENTS.map((t) => {
            const statusConfig = getStatusConfig(t.status);
            const gameConfig = getGameConfig(t.game);
            const fillPercent = Math.round((t.filled_slots / t.total_slots) * 100);
            const revenue = t.filled_slots * t.entry_fee;

            return (
              <Card key={t.id} hover>
                <CardBody className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                  <img
                    src={t.banner_url ?? ''}
                    alt={t.title}
                    className="w-full sm:w-24 h-24 rounded-xl object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <Badge variant={gameConfig.variant} size="sm">{gameConfig.label}</Badge>
                      <Badge variant={statusConfig.variant} dot={statusConfig.dot} size="sm">
                        {statusConfig.label}
                      </Badge>
                    </div>
                    <h3 className="font-display text-lg font-bold text-white">{t.title}</h3>
                    <div className="mt-2">
                      <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                        <span>Slots: {t.filled_slots}/{t.total_slots}</span>
                        <span>{fillPercent}%</span>
                      </div>
                      <div className="h-1.5 bg-arena-border rounded-full overflow-hidden w-full max-w-xs">
                        <div
                          className="h-full bg-gradient-to-r from-gold-600 to-gold-400 rounded-full"
                          style={{ width: `${fillPercent}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 flex-shrink-0">
                    <div className="text-center">
                      <p className="text-2xs text-slate-500 uppercase tracking-wider">Prize Pool</p>
                      <p className="font-display font-bold text-gold-400">{formatCurrency(t.prize_pool)}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xs text-slate-500 uppercase tracking-wider">Revenue</p>
                      <p className="font-display font-bold text-white">{formatCurrency(revenue)}</p>
                    </div>
                    <div className="flex gap-2">
                      <Link to={`/tournaments/${t.id}`}>
                        <button className="p-2 rounded-lg bg-arena-surface border border-arena-border text-slate-400 hover:text-white hover:border-gold-500/40 transition-colors">
                          <Eye size={16} />
                        </button>
                      </Link>
                      <Link to={`/org/tournaments/${t.id}`}>
                        <button className="p-2 rounded-lg bg-arena-surface border border-arena-border text-slate-400 hover:text-white hover:border-gold-500/40 transition-colors">
                          <Settings size={16} />
                        </button>
                      </Link>
                      <Link to={`/live/${t.id}`}>
                        <button className="p-2 rounded-lg bg-arena-surface border border-arena-border text-slate-400 hover:text-white hover:border-cyan-500/40 transition-colors">
                          <BarChart3 size={16} />
                        </button>
                      </Link>
                    </div>
                  </div>
                </CardBody>
              </Card>
            );
          })}
        </div>
      </div>
    </PageShell>
  );
}
