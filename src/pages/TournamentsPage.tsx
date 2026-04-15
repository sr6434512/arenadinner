import React, { useState } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { PageShell } from '../components/layout/PageShell';
import { TournamentCard } from '../components/tournament/TournamentCard';
import { DEMO_TOURNAMENTS } from '../lib/demoData';
import type { GameType, TournamentStatus } from '../types/database';

type Filter = {
  search: string;
  game: GameType | 'all';
  status: TournamentStatus | 'all';
  entryType: 'all' | 'free' | 'paid';
};

const GAME_OPTIONS = [
  { value: 'all', label: 'All Games' },
  { value: 'bgmi', label: 'BGMI' },
  { value: 'freefire', label: 'Free Fire' },
];

const STATUS_OPTIONS = [
  { value: 'all', label: 'All Status' },
  { value: 'open', label: 'Registration Open' },
  { value: 'ongoing', label: 'Live Now' },
  { value: 'completed', label: 'Completed' },
];

const ENTRY_OPTIONS = [
  { value: 'all', label: 'All Entry' },
  { value: 'free', label: 'Free Entry' },
  { value: 'paid', label: 'Paid Entry' },
];

export function TournamentsPage() {
  const [filters, setFilters] = useState<Filter>({
    search: '',
    game: 'all',
    status: 'all',
    entryType: 'all',
  });

  const updateFilter = <K extends keyof Filter>(key: K, value: Filter[K]) => {
    setFilters((f) => ({ ...f, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({ search: '', game: 'all', status: 'all', entryType: 'all' });
  };

  const hasActiveFilters = filters.game !== 'all' || filters.status !== 'all' || filters.entryType !== 'all' || filters.search;

  const filtered = DEMO_TOURNAMENTS.filter((t) => {
    if (filters.search && !t.title.toLowerCase().includes(filters.search.toLowerCase())) return false;
    if (filters.game !== 'all' && t.game !== filters.game) return false;
    if (filters.status !== 'all' && t.status !== filters.status) return false;
    if (filters.entryType === 'free' && t.entry_fee > 0) return false;
    if (filters.entryType === 'paid' && t.entry_fee === 0) return false;
    return true;
  });

  const liveCount = DEMO_TOURNAMENTS.filter((t) => t.status === 'ongoing').length;
  const openCount = DEMO_TOURNAMENTS.filter((t) => t.status === 'open').length;

  return (
    <PageShell variant="public">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="section-heading mb-1">Tournaments</h1>
          <div className="flex items-center gap-3 text-sm text-slate-400">
            {liveCount > 0 && (
              <span className="flex items-center gap-1.5 text-danger-400 font-semibold">
                <span className="w-2 h-2 rounded-full bg-danger-400 animate-pulse" />
                {liveCount} Live Now
              </span>
            )}
            <span>{openCount} Open Registrations</span>
            <span>{DEMO_TOURNAMENTS.length} Total</span>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search tournaments..."
              value={filters.search}
              onChange={(e) => updateFilter('search', e.target.value)}
              className="arena-input pl-9 w-full"
            />
          </div>

          <div className="flex gap-3 flex-wrap">
            {[
              { key: 'game' as const, opts: GAME_OPTIONS },
              { key: 'status' as const, opts: STATUS_OPTIONS },
              { key: 'entryType' as const, opts: ENTRY_OPTIONS },
            ].map(({ key, opts }) => (
              <select
                key={key}
                value={filters[key]}
                onChange={(e) => updateFilter(key, e.target.value as never)}
                className="arena-input w-auto appearance-none cursor-pointer"
              >
                {opts.map((o) => (
                  <option key={o.value} value={o.value} className="bg-arena-surface">
                    {o.label}
                  </option>
                ))}
              </select>
            ))}

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1.5 px-3 py-2 text-sm text-slate-400 hover:text-white bg-arena-card border border-arena-border rounded-lg transition-colors"
              >
                <X size={14} />
                Clear
              </button>
            )}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-24">
            <SlidersHorizontal size={40} className="text-slate-600 mx-auto mb-4" />
            <h3 className="font-display text-xl font-bold text-slate-500 mb-2">No tournaments found</h3>
            <p className="text-slate-600 text-sm">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((t) => (
              <TournamentCard key={t.id} tournament={t} />
            ))}
          </div>
        )}
      </div>
    </PageShell>
  );
}
