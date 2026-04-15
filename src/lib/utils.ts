import type { TournamentStatus, GameType } from '../types/database';

export function formatCurrency(paise: number): string {
  const rupees = paise / 100;
  if (rupees >= 100000) return `₹${(rupees / 100000).toFixed(1)}L`;
  if (rupees >= 1000) return `₹${(rupees / 1000).toFixed(0)}K`;
  return `₹${rupees.toLocaleString()}`;
}

export function formatTimeLeft(deadline: string | null): string {
  if (!deadline) return 'No deadline';
  const diff = new Date(deadline).getTime() - Date.now();
  if (diff <= 0) return 'Closed';
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  if (days > 0) return `${days}d ${hours}h left`;
  if (hours > 0) return `${hours}h ${mins}m left`;
  return `${mins}m left`;
}

export function formatDate(dateStr: string | null): string {
  if (!dateStr) return 'TBD';
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function getStatusConfig(status: TournamentStatus) {
  const configs = {
    draft: { label: 'Draft', variant: 'neutral' as const, dot: false },
    open: { label: 'Registration Open', variant: 'success' as const, dot: true },
    ongoing: { label: 'Live', variant: 'danger' as const, dot: true },
    completed: { label: 'Completed', variant: 'neutral' as const, dot: false },
    cancelled: { label: 'Cancelled', variant: 'danger' as const, dot: false },
  };
  return configs[status] ?? configs.draft;
}

export function getGameConfig(game: GameType) {
  return {
    bgmi: { label: 'BGMI', variant: 'bgmi' as const, color: 'text-gold-300' },
    freefire: { label: 'Free Fire', variant: 'freefire' as const, color: 'text-orange-300' },
  }[game];
}

export function getTeamSizeLabel(size: string): string {
  return { solo: 'Solo', duo: 'Duo', squad: 'Squad (4)' }[size] ?? size;
}
