import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Trophy, Users, Wallet, Settings,
  Plus, BarChart3, ShieldCheck, Building2, Swords, ChevronRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  badge?: string;
}

export function Sidebar() {
  const { profile } = useAuth();
  const location = useLocation();
  const role = profile?.role ?? 'player';

  const playerNav: NavItem[] = [
    { label: 'Overview', path: '/dashboard', icon: <LayoutDashboard size={18} /> },
    { label: 'My Tournaments', path: '/dashboard/tournaments', icon: <Trophy size={18} /> },
    { label: 'My Team', path: '/dashboard/team', icon: <Users size={18} /> },
    { label: 'Wallet', path: '/dashboard/wallet', icon: <Wallet size={18} /> },
    { label: 'Profile', path: '/dashboard/profile', icon: <Settings size={18} /> },
  ];

  const organizerNav: NavItem[] = [
    { label: 'Overview', path: '/org/dashboard', icon: <LayoutDashboard size={18} /> },
    { label: 'Tournaments', path: '/org/tournaments', icon: <Trophy size={18} /> },
    { label: 'Create Tournament', path: '/org/tournaments/create', icon: <Plus size={18} /> },
    { label: 'Payouts', path: '/org/payouts', icon: <Wallet size={18} /> },
    { label: 'Org Settings', path: '/org/settings', icon: <Building2 size={18} /> },
  ];

  const adminNav: NavItem[] = [
    { label: 'Overview', path: '/admin', icon: <LayoutDashboard size={18} /> },
    { label: 'Tournaments', path: '/admin/tournaments', icon: <Trophy size={18} /> },
    { label: 'Organizers', path: '/admin/tenants', icon: <Building2 size={18} /> },
    { label: 'Users', path: '/admin/users', icon: <Users size={18} /> },
    { label: 'Finance', path: '/admin/finance', icon: <BarChart3 size={18} /> },
    { label: 'Settings', path: '/admin/settings', icon: <ShieldCheck size={18} /> },
  ];

  const navItems = role === 'admin' ? adminNav : role === 'organizer' ? organizerNav : playerNav;

  const isActive = (path: string) => {
    if (path === '/dashboard' || path === '/org/dashboard' || path === '/admin') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <aside className="w-60 flex-shrink-0 bg-arena-surface border-r border-arena-border flex flex-col min-h-0">
      <div className="p-4 border-b border-arena-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-500 to-gold-700 flex items-center justify-center text-arena-bg font-bold">
            {profile?.username?.[0]?.toUpperCase() ?? 'U'}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-white truncate">{profile?.username ?? 'Player'}</p>
            <p className="text-2xs text-slate-500 capitalize flex items-center gap-1">
              <Swords size={10} />
              {role}
            </p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-3 overflow-y-auto">
        <div className="space-y-0.5">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                transition-all duration-150 group
                ${isActive(item.path)
                  ? 'bg-gold-500/15 text-gold-400 border border-gold-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-arena-hover'
                }
              `}
            >
              <span className={isActive(item.path) ? 'text-gold-400' : 'text-slate-500 group-hover:text-slate-300'}>
                {item.icon}
              </span>
              <span className="flex-1">{item.label}</span>
              {isActive(item.path) && (
                <ChevronRight size={14} className="text-gold-500" />
              )}
            </Link>
          ))}
        </div>
      </nav>

      <div className="p-4 border-t border-arena-border">
        <div className="bg-arena-card rounded-xl p-3 border border-arena-border">
          <p className="text-xs text-slate-500 font-medium">Wallet Balance</p>
          <p className="text-lg font-bold text-white mt-0.5">
            ₹{((profile?.wallet_balance ?? 0) / 100).toLocaleString()}
          </p>
          <Link
            to="/dashboard/wallet"
            className="text-xs text-gold-400 hover:text-gold-300 font-medium mt-1 block"
          >
            Add funds →
          </Link>
        </div>
      </div>
    </aside>
  );
}
