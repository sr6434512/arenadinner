import { useState, useEffect, useReducer, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { DEMO_LEADERBOARD } from '../lib/demoData';

export interface LeaderboardEntry {
  teamId: string;
  teamName: string;
  kills: number;
  placement: number | null;
  placementPts: number;
  killPts: number;
  total: number;
  rank: number;
  flash?: boolean;
  change: 'up' | 'down' | 'same';
}

type Action =
  | { type: 'SET_ENTRIES'; payload: LeaderboardEntry[] }
  | { type: 'UPDATE_ENTRY'; payload: { teamId: string; kills: number; placementPts: number; killPts: number; total: number } }
  | { type: 'CLEAR_FLASH'; payload: string };

function sortAndRank(entries: LeaderboardEntry[]): LeaderboardEntry[] {
  return [...entries]
    .sort((a, b) => b.total - a.total)
    .map((e, i) => ({ ...e, rank: i + 1 }));
}

function reducer(state: LeaderboardEntry[], action: Action): LeaderboardEntry[] {
  switch (action.type) {
    case 'SET_ENTRIES':
      return sortAndRank(action.payload);
    case 'UPDATE_ENTRY': {
      const prevRanks = new Map(state.map((e) => [e.teamId, e.rank]));
      const updated = state.map((e) =>
        e.teamId === action.payload.teamId
          ? { ...e, ...action.payload, flash: true }
          : e
      );
      const ranked = sortAndRank(updated);
      return ranked.map((e) => {
        const prev = prevRanks.get(e.teamId) ?? e.rank;
        return {
          ...e,
          change: e.rank < prev ? 'up' : e.rank > prev ? 'down' : 'same',
        };
      });
    }
    case 'CLEAR_FLASH':
      return state.map((e) => (e.teamId === action.payload ? { ...e, flash: false } : e));
    default:
      return state;
  }
}

export function useRealtimeLeaderboard(tournamentId: string) {
  const [entries, dispatch] = useReducer(reducer, []);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const demoEntries: LeaderboardEntry[] = DEMO_LEADERBOARD.map((row) => ({
      teamId: `team-${row.rank}`,
      teamName: row.teamName,
      kills: row.kills,
      placement: row.placement,
      placementPts: row.placementPts,
      killPts: row.killPts,
      total: row.total,
      rank: row.rank,
      flash: false,
      change: row.change,
    }));
    dispatch({ type: 'SET_ENTRIES', payload: demoEntries });
    setLoading(false);
  }, [tournamentId]);

  useEffect(() => {
    const channel = supabase
      .channel(`leaderboard-${tournamentId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'match_results' },
        (payload) => {
          if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
            const row = payload.new as {
              team_id: string;
              kills: number;
              placement_points: number;
              kill_points: number;
              total_points: number;
            };
            dispatch({
              type: 'UPDATE_ENTRY',
              payload: {
                teamId: row.team_id,
                kills: row.kills,
                placementPts: row.placement_points,
                killPts: row.kill_points,
                total: row.total_points,
              },
            });
            setTimeout(() => {
              dispatch({ type: 'CLEAR_FLASH', payload: row.team_id });
            }, 600);
          }
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [tournamentId]);

  return { entries, loading };
}
