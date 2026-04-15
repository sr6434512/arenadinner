import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Swords, Mail, Lock, User, Gamepad2, Gift } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Button } from '../../components/ui/Button';
import { Input, Select } from '../../components/ui/Input';
import { useNotification } from '../../context/NotificationContext';
import type { UserRole } from '../../types/database';

export function RegisterPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { notify } = useNotification();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [refCode, setRefCode] = useState('');
  const [form, setForm] = useState({
    email: '',
    password: '',
    username: '',
    role: 'player' as UserRole,
    bgmi_uid: '',
    ff_uid: '',
  });

  useEffect(() => {
    const ref = searchParams.get('ref');
    if (ref) setRefCode(ref.toUpperCase());
  }, [searchParams]);

  const updateForm = (key: string, value: string) => setForm((f) => ({ ...f, [key]: value }));

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (form.password.length < 8) {
      setError('Password must be at least 8 characters.');
      setLoading(false);
      return;
    }

    const { data, error: authError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    if (data.user) {
      const { error: profileError } = await supabase.from('profiles').insert({
        id: data.user.id,
        username: form.username,
        role: form.role,
        bgmi_uid: form.bgmi_uid || null,
        ff_uid: form.ff_uid || null,
        wallet_balance: 0,
      });

      if (profileError) {
        setError(profileError.message);
        setLoading(false);
        return;
      }

      if (refCode.trim()) {
        await supabase.rpc('fn_use_referral_code', {
          p_code: refCode.trim().toUpperCase(),
          p_referee_id: data.user.id,
        });
      }

      notify('success', 'Account created!', 'Welcome to ArenaDinner.');
      if (form.role === 'organizer') navigate('/org/dashboard');
      else navigate('/dashboard');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-arena-bg flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="flex items-center gap-2.5 mb-8 justify-center">
          <div className="w-9 h-9 rounded-lg bg-gold-500 flex items-center justify-center">
            <Swords size={18} className="text-arena-bg" />
          </div>
          <span className="font-display text-2xl font-bold text-white">
            Arena<span className="text-gold-400">Dinner</span>
          </span>
        </div>

        <div className="arena-card p-8">
          <h1 className="font-display text-3xl font-bold text-white mb-1">Create account</h1>
          <p className="text-slate-400 text-sm mb-6">Join the platform and start competing</p>

          {refCode && (
            <div className="flex items-center gap-3 bg-gold-500/10 border border-gold-500/20 rounded-xl px-4 py-3 mb-5">
              <Gift size={16} className="text-gold-400 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gold-300">You were invited!</p>
                <p className="text-xs text-slate-400 mt-0.5">
                  Referral code <span className="font-mono font-bold text-gold-400">{refCode}</span> will be applied on registration.
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Username"
                placeholder="ProPlayer99"
                value={form.username}
                onChange={(e) => updateForm('username', e.target.value)}
                icon={<User size={16} />}
                required
              />
              <Select
                label="Account Type"
                value={form.role}
                onChange={(e) => updateForm('role', e.target.value)}
                options={[
                  { value: 'player', label: 'Player' },
                  { value: 'organizer', label: 'Organizer' },
                ]}
              />
            </div>

            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => updateForm('email', e.target.value)}
              icon={<Mail size={16} />}
              required
            />

            <Input
              label="Password"
              type="password"
              placeholder="Min. 8 characters"
              value={form.password}
              onChange={(e) => updateForm('password', e.target.value)}
              icon={<Lock size={16} />}
              required
            />

            <div className="border-t border-arena-border pt-4">
              <p className="arena-label mb-3">Game UIDs (optional)</p>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="BGMI UID"
                  placeholder="5123456789"
                  value={form.bgmi_uid}
                  onChange={(e) => updateForm('bgmi_uid', e.target.value)}
                  icon={<Gamepad2 size={16} />}
                  fullWidth
                />
                <Input
                  label="Free Fire UID"
                  placeholder="123456789"
                  value={form.ff_uid}
                  onChange={(e) => updateForm('ff_uid', e.target.value)}
                  icon={<Gamepad2 size={16} />}
                  fullWidth
                />
              </div>
            </div>

            <div className="border-t border-arena-border pt-4">
              <Input
                label="Invite Code (optional)"
                placeholder="XXXXXXXX"
                value={refCode}
                onChange={(e) => setRefCode(e.target.value.toUpperCase())}
                icon={<Gift size={16} />}
                fullWidth
              />
            </div>

            {error && (
              <div className="bg-danger-500/10 border border-danger-500/30 rounded-lg p-3">
                <p className="text-sm text-danger-400">{error}</p>
              </div>
            )}

            <Button type="submit" fullWidth loading={loading} size="lg">
              Create Account
            </Button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-gold-400 hover:text-gold-300 font-semibold">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
