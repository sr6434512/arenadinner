import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Swords, Bell, ChevronDown, LogOut, User, LayoutDashboard,
  Settings, Wallet, Menu, X, Trophy
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Badge } from '../ui/Badge';

export function Navbar() {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const getDashboardPath = () => {
    if (!profile) return '/dashboard';
    if (profile.role === 'admin') return '/admin';
    if (profile.role === 'organizer') return '/org/dashboard';
    return '/dashboard';
  };

  const navLinks = [
    { label: 'Tournaments', path: '/tournaments' },
    { label: 'Leaderboards', path: '/leaderboard' },
  ];

  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-arena-bg/90 backdrop-blur-md border-b border-arena-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5 flex-shrink-0">
              <div className="w-8 h-8 rounded-lg bg-gold-500 flex items-center justify-center">
                <Swords size={18} className="text-arena-bg" />
              </div>
              <span className="font-display text-xl font-bold text-white tracking-wide">
                Arena<span className="text-gold-400">Dinner</span>
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`
                    px-4 py-2 rounded-lg text-sm font-medium transition-colors
                    ${isActive(link.path)
                      ? 'text-gold-400 bg-gold-500/10'
                      : 'text-slate-400 hover:text-white hover:bg-arena-hover'
                    }
                  `}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <>
                <button className="hidden sm:flex relative p-2 rounded-lg text-slate-400 hover:text-white hover:bg-arena-hover transition-colors">
                  <Bell size={20} />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger-500 rounded-full" />
                </button>

                <div className="relative">
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg hover:bg-arena-hover transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gold-500 to-gold-700 flex items-center justify-center text-arena-bg font-bold text-sm">
                      {profile?.username?.[0]?.toUpperCase() ?? 'U'}
                    </div>
                    <div className="hidden sm:block text-left">
                      <p className="text-sm font-semibold text-white leading-none">
                        {profile?.username ?? 'Player'}
                      </p>
                      <p className="text-2xs text-slate-500 capitalize">{profile?.role ?? 'player'}</p>
                    </div>
                    <ChevronDown size={14} className="text-slate-500 hidden sm:block" />
                  </button>

                  {profileOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setProfileOpen(false)} />
                      <div className="absolute right-0 top-full mt-2 w-56 bg-arena-card border border-arena-border rounded-xl shadow-modal z-20 overflow-hidden animate-slide-in-up">
                        <div className="px-4 py-3 border-b border-arena-border">
                          <p className="text-sm font-semibold text-white">{profile?.username}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant={profile?.role === 'organizer' ? 'cyan' : 'gold'} size="sm">
                              {profile?.role ?? 'player'}
                            </Badge>
                            <span className="text-xs text-slate-500">
                              ₹{((profile?.wallet_balance ?? 0) / 100).toLocaleString()}
                            </span>
                          </div>
                        </div>
                        <div className="py-1">
                          <Link
                            to={getDashboardPath()}
                            onClick={() => setProfileOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-arena-hover transition-colors"
                          >
                            <LayoutDashboard size={16} />
                            Dashboard
                          </Link>
                          <Link
                            to="/dashboard/wallet"
                            onClick={() => setProfileOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-arena-hover transition-colors"
                          >
                            <Wallet size={16} />
                            Wallet
                          </Link>
                          <Link
                            to="/dashboard/profile"
                            onClick={() => setProfileOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-arena-hover transition-colors"
                          >
                            <Settings size={16} />
                            Settings
                          </Link>
                          <div className="border-t border-arena-border mt-1 pt-1">
                            <button
                              onClick={handleSignOut}
                              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-danger-400 hover:bg-danger-500/10 transition-colors"
                            >
                              <LogOut size={16} />
                              Sign Out
                            </button>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="hidden sm:block px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-bold bg-gold-500 hover:bg-gold-400 text-arena-bg rounded-lg transition-colors shadow-glow-gold"
                >
                  Join Now
                </Link>
              </div>
            )}

            <button
              className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-arena-hover transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden border-t border-arena-border py-3 animate-slide-in-up">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-arena-hover transition-colors"
              >
                <Trophy size={16} />
                {link.label}
              </Link>
            ))}
            {user && (
              <Link
                to={getDashboardPath()}
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-arena-hover transition-colors"
              >
                <LayoutDashboard size={16} />
                Dashboard
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
