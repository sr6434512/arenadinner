import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Swords, Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useNotification } from '../../context/NotificationContext';

export function LoginPage() {
  const navigate = useNavigate();
  const { notify } = useNotification();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    if (data.user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .maybeSingle();

      notify('success', 'Welcome back!', 'Successfully signed in.');

      if (profile?.role === 'admin') navigate('/admin');
      else if (profile?.role === 'organizer') navigate('/org/dashboard');
      else navigate('/dashboard');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-arena-bg flex">
      <div className="hidden lg:flex flex-1 bg-arena-surface relative overflow-hidden">
        <img
          src="https://images.pexels.com/photos/7915509/pexels-photo-7915509.jpeg"
          alt="Esports"
          className="absolute inset-0 w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-arena-surface via-arena-surface/80 to-transparent" />
        <div className="relative z-10 flex flex-col justify-center px-16 max-w-xl">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-gold-500 flex items-center justify-center">
              <Swords size={24} className="text-arena-bg" />
            </div>
            <span className="font-display text-3xl font-bold text-white">
              Arena<span className="text-gold-400">Dinner</span>
            </span>
          </div>
          <h2 className="font-display text-4xl font-bold text-white mb-4 leading-tight">
            Your Gateway to<br />
            <span className="text-gold-400">Esports Glory</span>
          </h2>
          <p className="text-slate-400 text-lg leading-relaxed">
            Join thousands of BGMI and Free Fire players competing in premium tournaments with real prize pools.
          </p>
          <div className="mt-10 grid grid-cols-3 gap-6">
            {[
              { label: 'Active Players', value: '50K+' },
              { label: 'Prize Distributed', value: '₹2Cr+' },
              { label: 'Tournaments', value: '500+' },
            ].map((stat) => (
              <div key={stat.label} className="bg-arena-card/60 rounded-xl p-4 border border-arena-border">
                <p className="font-display text-2xl font-bold text-gold-400">{stat.value}</p>
                <p className="text-xs text-slate-500 mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-2.5 mb-8 justify-center">
            <div className="w-9 h-9 rounded-lg bg-gold-500 flex items-center justify-center">
              <Swords size={18} className="text-arena-bg" />
            </div>
            <span className="font-display text-2xl font-bold text-white">
              Arena<span className="text-gold-400">Dinner</span>
            </span>
          </div>

          <h1 className="font-display text-3xl font-bold text-white mb-1">Welcome back</h1>
          <p className="text-slate-400 text-sm mb-8">Sign in to your account to continue</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail size={16} />}
              required
            />
            <div>
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon={<Lock size={16} />}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
              />
            </div>

            {error && (
              <div className="bg-danger-500/10 border border-danger-500/30 rounded-lg p-3">
                <p className="text-sm text-danger-400">{error}</p>
              </div>
            )}

            <Button type="submit" fullWidth loading={loading} size="lg">
              Sign In
            </Button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-gold-400 hover:text-gold-300 font-semibold">
              Create one
            </Link>
          </p>

          <div className="mt-8 p-4 bg-arena-card rounded-xl border border-arena-border">
            <p className="text-xs text-slate-500 font-medium mb-2">Demo Accounts</p>
            <div className="space-y-1.5">
              {[
                { label: 'Player', email: 'player@demo.com' },
                { label: 'Organizer', email: 'org@demo.com' },
                { label: 'Admin', email: 'admin@demo.com' },
              ].map((demo) => (
                <button
                  key={demo.label}
                  onClick={() => { setEmail(demo.email); setPassword('demo1234'); }}
                  className="w-full flex items-center justify-between px-3 py-2 bg-arena-surface rounded-lg text-xs hover:bg-arena-hover transition-colors group"
                >
                  <span className="text-slate-400">{demo.label}</span>
                  <span className="text-gold-500 group-hover:text-gold-400 font-mono">{demo.email}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
