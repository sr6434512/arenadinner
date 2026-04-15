export type UserRole = 'player' | 'captain' | 'organizer' | 'admin';
export type GameType = 'bgmi' | 'freefire';
export type TournamentStatus = 'draft' | 'open' | 'ongoing' | 'completed' | 'cancelled';
export type MatchStatus = 'scheduled' | 'lobby' | 'in_progress' | 'completed';
export type TeamSize = 'solo' | 'duo' | 'squad';
export type TransactionType = 'entry_fee' | 'prize_payout' | 'refund' | 'deposit';

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: ProfileInsert;
        Update: Partial<ProfileInsert>;
      };
      tenants: {
        Row: Tenant;
        Insert: TenantInsert;
        Update: Partial<TenantInsert>;
      };
      tournaments: {
        Row: Tournament;
        Insert: TournamentInsert;
        Update: Partial<TournamentInsert>;
      };
      teams: {
        Row: Team;
        Insert: TeamInsert;
        Update: Partial<TeamInsert>;
      };
      team_members: {
        Row: TeamMember;
        Insert: TeamMemberInsert;
        Update: Partial<TeamMemberInsert>;
      };
      registrations: {
        Row: Registration;
        Insert: RegistrationInsert;
        Update: Partial<RegistrationInsert>;
      };
      matches: {
        Row: Match;
        Insert: MatchInsert;
        Update: Partial<MatchInsert>;
      };
      match_results: {
        Row: MatchResult;
        Insert: MatchResultInsert;
        Update: Partial<MatchResultInsert>;
      };
      notifications: {
        Row: Notification;
        Insert: NotificationInsert;
        Update: Partial<NotificationInsert>;
      };
      transactions: {
        Row: Transaction;
        Insert: TransactionInsert;
        Update: Partial<TransactionInsert>;
      };
    };
  };
}

export interface Profile {
  id: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  role: UserRole;
  bgmi_uid: string | null;
  ff_uid: string | null;
  wallet_balance: number;
  created_at: string;
  updated_at: string;
}

export interface ProfileInsert {
  id: string;
  username: string;
  display_name?: string | null;
  avatar_url?: string | null;
  role?: UserRole;
  bgmi_uid?: string | null;
  ff_uid?: string | null;
  wallet_balance?: number;
}

export interface Tenant {
  id: string;
  owner_id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  banner_url: string | null;
  primary_color: string;
  description: string | null;
  is_verified: boolean;
  created_at: string;
}

export interface TenantInsert {
  owner_id: string;
  name: string;
  slug: string;
  logo_url?: string | null;
  banner_url?: string | null;
  primary_color?: string;
  description?: string | null;
  is_verified?: boolean;
}

export interface Tournament {
  id: string;
  tenant_id: string | null;
  organizer_id: string;
  title: string;
  description: string | null;
  game: GameType;
  status: TournamentStatus;
  team_size: TeamSize;
  total_slots: number;
  filled_slots: number;
  entry_fee: number;
  prize_pool: number;
  prize_distribution: Record<string, number> | null;
  per_kill_prize: number;
  banner_url: string | null;
  rules: string | null;
  registration_deadline: string | null;
  start_date: string | null;
  end_date: string | null;
  is_private: boolean;
  private_code: string | null;
  approval_mode: 'auto' | 'manual';
  created_at: string;
  updated_at: string;
}

export interface TournamentInsert {
  tenant_id?: string | null;
  organizer_id: string;
  title: string;
  description?: string | null;
  game: GameType;
  status?: TournamentStatus;
  team_size: TeamSize;
  total_slots: number;
  entry_fee?: number;
  prize_pool?: number;
  prize_distribution?: Record<string, number> | null;
  per_kill_prize?: number;
  banner_url?: string | null;
  rules?: string | null;
  registration_deadline?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  is_private?: boolean;
  private_code?: string | null;
  approval_mode?: 'auto' | 'manual';
}

export interface Team {
  id: string;
  name: string;
  tag: string | null;
  logo_url: string | null;
  captain_id: string;
  tournament_id: string | null;
  created_at: string;
}

export interface TeamInsert {
  name: string;
  tag?: string | null;
  logo_url?: string | null;
  captain_id: string;
  tournament_id?: string | null;
}

export interface TeamMember {
  id: string;
  team_id: string;
  user_id: string;
  in_game_name: string;
  joined_at: string;
}

export interface TeamMemberInsert {
  team_id: string;
  user_id: string;
  in_game_name: string;
}

export interface Registration {
  id: string;
  tournament_id: string;
  team_id: string;
  slot_number: number | null;
  payment_status: 'pending' | 'paid' | 'refunded';
  approval_status: 'pending' | 'approved' | 'rejected';
  registered_at: string;
}

export interface RegistrationInsert {
  tournament_id: string;
  team_id: string;
  slot_number?: number | null;
  payment_status?: 'pending' | 'paid' | 'refunded';
  approval_status?: 'pending' | 'approved' | 'rejected';
}

export interface Match {
  id: string;
  tournament_id: string;
  match_number: number;
  round: number;
  status: MatchStatus;
  scheduled_at: string | null;
  started_at: string | null;
  ended_at: string | null;
  map: string | null;
  created_at: string;
}

export interface MatchInsert {
  tournament_id: string;
  match_number: number;
  round: number;
  status?: MatchStatus;
  scheduled_at?: string | null;
  map?: string | null;
}

export interface MatchResult {
  id: string;
  match_id: string;
  team_id: string;
  placement: number | null;
  kills: number;
  placement_points: number;
  kill_points: number;
  total_points: number;
  updated_at: string;
}

export interface MatchResultInsert {
  match_id: string;
  team_id: string;
  placement?: number | null;
  kills?: number;
  placement_points?: number;
  kill_points?: number;
  total_points?: number;
}

export interface Notification {
  id: string;
  user_id: string;
  type: 'info' | 'success' | 'warning' | 'elimination' | 'prize';
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface NotificationInsert {
  user_id: string;
  type: 'info' | 'success' | 'warning' | 'elimination' | 'prize';
  title: string;
  message: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  tournament_id: string | null;
  type: TransactionType;
  amount: number;
  description: string;
  created_at: string;
}

export interface TransactionInsert {
  user_id: string;
  tournament_id?: string | null;
  type: TransactionType;
  amount: number;
  description: string;
}
