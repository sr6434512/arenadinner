import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, ChevronRight, ChevronLeft, Trophy, Settings, DollarSign, Shield, Eye } from 'lucide-react';
import { PageShell } from '../../components/layout/PageShell';
import { Button } from '../../components/ui/Button';
import { Input, Select, Textarea } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { formatCurrency } from '../../lib/utils';

const STEPS = [
  { id: 1, label: 'Basics', icon: <Trophy size={16} /> },
  { id: 2, label: 'Format', icon: <Settings size={16} /> },
  { id: 3, label: 'Prizing', icon: <DollarSign size={16} /> },
  { id: 4, label: 'Rules', icon: <Shield size={16} /> },
  { id: 5, label: 'Review', icon: <Eye size={16} /> },
];

interface FormData {
  title: string;
  game: 'bgmi' | 'freefire';
  description: string;
  banner_url: string;
  team_size: 'solo' | 'duo' | 'squad';
  total_slots: string;
  approval_mode: 'auto' | 'manual';
  entry_fee: string;
  prize_pool: string;
  prize_1st: string;
  prize_2nd: string;
  prize_3rd: string;
  per_kill_prize: string;
  rules: string;
  registration_deadline: string;
  start_date: string;
}

const INITIAL: FormData = {
  title: '',
  game: 'bgmi',
  description: '',
  banner_url: '',
  team_size: 'squad',
  total_slots: '32',
  approval_mode: 'auto',
  entry_fee: '0',
  prize_pool: '0',
  prize_1st: '0',
  prize_2nd: '0',
  prize_3rd: '0',
  per_kill_prize: '0',
  rules: '',
  registration_deadline: '',
  start_date: '',
};

export function CreateTournamentPage() {
  const { user } = useAuth();
  const { notify } = useNotification();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>(INITIAL);
  const [saving, setSaving] = useState(false);

  const update = (key: keyof FormData, val: string) => setForm((f) => ({ ...f, [key]: val }));

  const handlePublish = async (asDraft = false) => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase.from('tournaments').insert({
      organizer_id: user.id,
      title: form.title,
      description: form.description,
      game: form.game,
      status: asDraft ? 'draft' : 'open',
      team_size: form.team_size,
      total_slots: parseInt(form.total_slots),
      entry_fee: Math.round(parseFloat(form.entry_fee || '0') * 100),
      prize_pool: Math.round(parseFloat(form.prize_pool || '0') * 100),
      prize_distribution: {
        '1': Math.round(parseFloat(form.prize_1st || '0') * 100),
        '2': Math.round(parseFloat(form.prize_2nd || '0') * 100),
        '3': Math.round(parseFloat(form.prize_3rd || '0') * 100),
      },
      per_kill_prize: Math.round(parseFloat(form.per_kill_prize || '0') * 100),
      rules: form.rules,
      registration_deadline: form.registration_deadline || null,
      start_date: form.start_date || null,
      approval_mode: form.approval_mode,
    });

    if (error) {
      notify('warning', 'Error', error.message);
    } else {
      notify('success', asDraft ? 'Draft saved!' : 'Tournament published!', form.title);
      navigate('/org/tournaments');
    }
    setSaving(false);
  };

  return (
    <PageShell variant="dashboard">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-white mb-1">Create Tournament</h1>
          <p className="text-slate-400 text-sm">Set up your tournament in 5 simple steps</p>
        </div>

        <div className="flex items-center gap-0 mb-8 overflow-x-auto">
          {STEPS.map((s, i) => (
            <React.Fragment key={s.id}>
              <button
                onClick={() => step > s.id && setStep(s.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-colors flex-shrink-0
                  ${step === s.id ? 'bg-gold-500/15 text-gold-400' : step > s.id ? 'text-success-400 cursor-pointer' : 'text-slate-500 cursor-default'}
                `}
              >
                {step > s.id ? <CheckCircle size={16} /> : s.icon}
                {s.label}
              </button>
              {i < STEPS.length - 1 && (
                <ChevronRight size={14} className={`text-arena-border flex-shrink-0 ${step > s.id ? 'text-success-500/30' : ''}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="arena-card p-6 space-y-5">
          {step === 1 && (
            <>
              <h2 className="font-display text-xl font-bold text-white">Tournament Basics</h2>
              <Input
                label="Tournament Title"
                placeholder="e.g. BGMI Pro League Season 5"
                value={form.title}
                onChange={(e) => update('title', e.target.value)}
                required
              />
              <Select
                label="Game"
                value={form.game}
                onChange={(e) => update('game', e.target.value)}
                options={[
                  { value: 'bgmi', label: 'BGMI (Battlegrounds Mobile India)' },
                  { value: 'freefire', label: 'Free Fire' },
                ]}
              />
              <Input
                label="Banner Image URL"
                placeholder="https://images.pexels.com/..."
                value={form.banner_url}
                onChange={(e) => update('banner_url', e.target.value)}
                hint="Use a 16:9 landscape image for best results"
              />
              <Textarea
                label="Description"
                placeholder="Describe your tournament..."
                value={form.description}
                onChange={(e) => update('description', e.target.value)}
                rows={4}
              />
            </>
          )}

          {step === 2 && (
            <>
              <h2 className="font-display text-xl font-bold text-white">Format & Slots</h2>
              <div className="grid grid-cols-2 gap-4">
                <Select
                  label="Team Format"
                  value={form.team_size}
                  onChange={(e) => update('team_size', e.target.value)}
                  options={[
                    { value: 'solo', label: 'Solo (1 player)' },
                    { value: 'duo', label: 'Duo (2 players)' },
                    { value: 'squad', label: 'Squad (4 players)' },
                  ]}
                />
                <Select
                  label="Total Slots"
                  value={form.total_slots}
                  onChange={(e) => update('total_slots', e.target.value)}
                  options={[
                    { value: '16', label: '16 Teams' },
                    { value: '32', label: '32 Teams' },
                    { value: '64', label: '64 Teams' },
                    { value: '128', label: '128 Teams' },
                  ]}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Registration Deadline"
                  type="datetime-local"
                  value={form.registration_deadline}
                  onChange={(e) => update('registration_deadline', e.target.value)}
                />
                <Input
                  label="Start Date"
                  type="datetime-local"
                  value={form.start_date}
                  onChange={(e) => update('start_date', e.target.value)}
                />
              </div>
              <Select
                label="Team Approval Mode"
                value={form.approval_mode}
                onChange={(e) => update('approval_mode', e.target.value)}
                options={[
                  { value: 'auto', label: 'Auto — Approve all registrations instantly' },
                  { value: 'manual', label: 'Manual — Review and approve each team' },
                ]}
              />
            </>
          )}

          {step === 3 && (
            <>
              <h2 className="font-display text-xl font-bold text-white">Entry Fee & Prizes</h2>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Entry Fee (₹)"
                  type="number"
                  min="0"
                  placeholder="0 for free"
                  value={form.entry_fee}
                  onChange={(e) => update('entry_fee', e.target.value)}
                  hint="Set to 0 for free entry"
                />
                <Input
                  label="Total Prize Pool (₹)"
                  type="number"
                  min="0"
                  placeholder="100000"
                  value={form.prize_pool}
                  onChange={(e) => update('prize_pool', e.target.value)}
                />
              </div>
              <div className="border-t border-arena-border pt-4">
                <p className="arena-label mb-3">Prize Distribution</p>
                <div className="space-y-3">
                  {[
                    { key: 'prize_1st' as const, label: '1st Place 🥇' },
                    { key: 'prize_2nd' as const, label: '2nd Place 🥈' },
                    { key: 'prize_3rd' as const, label: '3rd Place 🥉' },
                  ].map(({ key, label }) => (
                    <div key={key} className="flex items-center gap-4">
                      <span className="text-sm font-semibold text-slate-300 w-28">{label}</span>
                      <Input
                        type="number"
                        min="0"
                        placeholder="0"
                        value={form[key]}
                        onChange={(e) => update(key, e.target.value)}
                      />
                    </div>
                  ))}
                </div>
              </div>
              <Input
                label="Per Kill Prize (₹)"
                type="number"
                min="0"
                placeholder="0"
                value={form.per_kill_prize}
                onChange={(e) => update('per_kill_prize', e.target.value)}
                hint="Extra prize per kill. Set to 0 to disable."
              />
            </>
          )}

          {step === 4 && (
            <>
              <h2 className="font-display text-xl font-bold text-white">Rules & Guidelines</h2>
              <Textarea
                label="Tournament Rules"
                placeholder="1. No hacking or use of mods
2. No teaming with other squads
3. Custom room password will be shared 30 mins before match
4. Organizer decisions are final..."
                value={form.rules}
                onChange={(e) => update('rules', e.target.value)}
                rows={10}
              />
              <p className="text-xs text-slate-500">
                Be clear and specific. Players will see these rules before registering.
              </p>
            </>
          )}

          {step === 5 && (
            <>
              <h2 className="font-display text-xl font-bold text-white">Review & Publish</h2>
              <div className="space-y-4">
                {[
                  {
                    section: 'Basics',
                    items: [
                      { label: 'Title', value: form.title || 'Not set' },
                      { label: 'Game', value: form.game === 'bgmi' ? 'BGMI' : 'Free Fire' },
                    ],
                  },
                  {
                    section: 'Format',
                    items: [
                      { label: 'Team Size', value: form.team_size },
                      { label: 'Total Slots', value: form.total_slots },
                      { label: 'Approval', value: form.approval_mode },
                    ],
                  },
                  {
                    section: 'Prizing',
                    items: [
                      { label: 'Entry Fee', value: form.entry_fee === '0' ? 'FREE' : `₹${parseInt(form.entry_fee).toLocaleString()}` },
                      { label: 'Prize Pool', value: `₹${parseInt(form.prize_pool || '0').toLocaleString()}` },
                      { label: '1st Place', value: `₹${parseInt(form.prize_1st || '0').toLocaleString()}` },
                      { label: 'Per Kill', value: form.per_kill_prize === '0' ? 'None' : `₹${form.per_kill_prize}` },
                    ],
                  },
                ].map((section) => (
                  <div key={section.section} className="bg-arena-surface rounded-xl p-4 border border-arena-border">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">{section.section}</p>
                    <div className="grid grid-cols-2 gap-2">
                      {section.items.map((item) => (
                        <div key={item.label}>
                          <p className="text-2xs text-slate-600">{item.label}</p>
                          <p className="text-sm font-semibold text-white">{item.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="flex items-center justify-between mt-6">
          <Button
            variant="secondary"
            icon={<ChevronLeft size={16} />}
            onClick={() => setStep((s) => Math.max(1, s - 1))}
            disabled={step === 1}
          >
            Previous
          </Button>

          {step < 5 ? (
            <Button
              icon={<ChevronRight size={16} />}
              iconPosition="right"
              onClick={() => setStep((s) => Math.min(5, s + 1))}
              disabled={step === 1 && !form.title}
            >
              Continue
            </Button>
          ) : (
            <div className="flex gap-3">
              <Button variant="secondary" onClick={() => handlePublish(true)} loading={saving}>
                Save as Draft
              </Button>
              <Button onClick={() => handlePublish(false)} loading={saving}>
                Publish Tournament
              </Button>
            </div>
          )}
        </div>
      </div>
    </PageShell>
  );
}
