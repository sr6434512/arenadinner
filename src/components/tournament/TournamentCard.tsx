import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Clock, Zap, Trophy } from 'lucide-react';
import type { Tournament } from '../../types/database';
import { Badge } from '../ui/Badge';
import { formatCurrency, formatTimeLeft, getStatusConfig, getGameConfig, getTeamSizeLabel } from '../../lib/utils';

interface TournamentCardProps {
  tournament: Tournament;
}

export function TournamentCard({ tournament }: TournamentCardProps) {
  const statusConfig = getStatusConfig(tournament.status);
  const gameConfig = getGameConfig(tournament.game);
  const fillPercent = Math.round((tournament.filled_slots / tournament.total_slots) * 100);

  return (
    <Link to={`/tournaments/${tournament.id}`}>
      <div className="arena-card overflow-hidden hover:border-gold-500/40 hover:shadow-glow-gold transition-all duration-300 group cursor-pointer">
        <div className="relative h-40 overflow-hidden">
          <img
            src={tournament.banner_url ?? 'https://images.pexels.com/photos/7915509/pexels-photo-7915509.jpeg'}
            alt={tournament.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-arena-card via-arena-card/30 to-transparent" />

          <div className="absolute top-3 left-3 flex items-center gap-2">
            <Badge variant={gameConfig.variant} size="sm">{gameConfig.label}</Badge>
            {tournament.status === 'ongoing' && (
              <span className="live-indicator">LIVE</span>
            )}
          </div>

          <div className="absolute bottom-3 left-3 right-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-slate-400">{tournament.filled_slots}/{tournament.total_slots} teams</span>
              <span className="text-xs text-slate-400">{fillPercent}%</span>
            </div>
            <div className="h-1 bg-arena-border rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-gold-600 to-gold-400 rounded-full transition-all duration-500"
                style={{ width: `${fillPercent}%` }}
              />
            </div>
          </div>
        </div>

        <div className="p-4">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-display text-base font-bold text-white leading-tight group-hover:text-gold-300 transition-colors line-clamp-1">
              {tournament.title}
            </h3>
            <Badge variant={statusConfig.variant} dot={statusConfig.dot} size="sm">
              {statusConfig.label}
            </Badge>
          </div>

          <div className="flex items-center gap-3 mb-3 flex-wrap">
            <span className="flex items-center gap-1 text-xs text-slate-400">
              <Users size={12} />
              {getTeamSizeLabel(tournament.team_size)}
            </span>
            {tournament.registration_deadline && tournament.status === 'open' && (
              <span className="flex items-center gap-1 text-xs text-slate-400">
                <Clock size={12} />
                {formatTimeLeft(tournament.registration_deadline)}
              </span>
            )}
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-arena-border">
            <div>
              <p className="text-2xs text-slate-500 uppercase tracking-wider">Prize Pool</p>
              <p className="font-display text-lg font-bold text-gold-400">
                {formatCurrency(tournament.prize_pool)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xs text-slate-500 uppercase tracking-wider">Entry Fee</p>
              <p className="font-semibold text-sm text-white">
                {tournament.entry_fee === 0 ? (
                  <span className="text-success-400">FREE</span>
                ) : (
                  formatCurrency(tournament.entry_fee)
                )}
              </p>
            </div>
          </div>

          {tournament.per_kill_prize > 0 && (
            <div className="mt-2 flex items-center gap-1.5 text-xs text-cyan-400">
              <Zap size={12} />
              <span>{formatCurrency(tournament.per_kill_prize)} per kill</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
