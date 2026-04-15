import React from 'react';
import { Link } from 'react-router-dom';
import {
  Swords, Trophy, Users, Zap, Shield, ChevronRight,
  Star, BarChart3, Gamepad2, ArrowRight, Activity
} from 'lucide-react';
import { TournamentCard } from '../components/tournament/TournamentCard';
import { DEMO_TOURNAMENTS } from '../lib/demoData';

const STATS = [
  { value: '50K+', label: 'Active Players', icon: <Users size={20} /> },
  { value: '₹2Cr+', label: 'Prize Distributed', icon: <Trophy size={20} /> },
  { value: '500+', label: 'Tournaments Hosted', icon: <Swords size={20} /> },
  { value: '98%', label: 'Payout Success Rate', icon: <Shield size={20} /> },
];

const FEATURES = [
  {
    icon: <Zap size={24} />,
    title: 'Instant Registration',
    desc: 'Register your team in under 60 seconds. Slot confirmation is instant.',
    color: 'text-gold-400',
    bg: 'bg-gold-500/10 border-gold-500/20',
  },
  {
    icon: <BarChart3 size={24} />,
    title: 'Live Leaderboards',
    desc: 'Real-time kill feeds and point updates as matches happen.',
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10 border-cyan-500/20',
  },
  {
    icon: <Shield size={24} />,
    title: 'Verified Payouts',
    desc: 'Prize money disbursed within 24 hours. Fully transparent transactions.',
    color: 'text-success-400',
    bg: 'bg-success-500/10 border-success-500/20',
  },
  {
    icon: <Users size={24} />,
    title: 'Team Management',
    desc: 'Build and manage your roster. Invite players with a single link.',
    color: 'text-gold-400',
    bg: 'bg-gold-500/10 border-gold-500/20',
  },
];

const TESTIMONIALS = [
  {
    name: 'Arjun "ProBot" Sharma',
    role: 'BGMI Player • Conqueror Rank',
    avatar: 'A',
    text: 'ArenaDinner has the smoothest registration flow. Won my first tournament here and got paid within 12 hours.',
  },
  {
    name: 'Riya Kapoor',
    role: 'Tournament Organizer',
    avatar: 'R',
    text: 'Managing 64-team tournaments used to be a nightmare. The platform handles everything — slots, results, payouts.',
  },
  {
    name: 'Team ShadowStrike',
    role: 'Free Fire Squad',
    avatar: 'T',
    text: 'The live leaderboard during matches gives us real-time updates. Our fans love following along.',
  },
];

export function LandingPage() {
  const featuredTournaments = DEMO_TOURNAMENTS.filter((t) => t.status === 'open').slice(0, 3);

  return (
    <div className="bg-arena-bg">
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/7915509/pexels-photo-7915509.jpeg"
            alt="Hero"
            className="w-full h-full object-cover opacity-10"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-arena-bg/50 via-arena-bg/70 to-arena-bg" />
          <div className="absolute inset-0 bg-hero-grid opacity-100" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-24">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-sm font-semibold mb-6">
              <Star size={14} className="fill-gold-400" />
              India's Premier Esports Tournament Platform
            </div>

            <h1 className="font-display text-6xl md:text-7xl font-bold text-white leading-none mb-6">
              COMPETE.
              <br />
              <span className="text-gold-400">WIN.</span>
              <br />
              DOMINATE.
            </h1>

            <p className="text-xl text-slate-400 leading-relaxed mb-10 max-w-xl">
              Join thousands of BGMI and Free Fire players competing in verified tournaments
              with real prize pools and instant payouts.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                to="/tournaments"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gold-500 hover:bg-gold-400 text-arena-bg font-bold text-base rounded-xl transition-all shadow-glow-gold hover:shadow-glow-gold"
              >
                Browse Tournaments
                <ArrowRight size={18} />
              </Link>
              <Link
                to="/register?role=organizer"
                className="inline-flex items-center gap-2 px-8 py-4 bg-transparent border border-slate-600 hover:border-gold-500/50 text-white font-semibold text-base rounded-xl transition-all hover:bg-gold-500/5"
              >
                Host a Tournament
              </Link>
            </div>

            <div className="mt-14 flex items-center gap-4">
              <div className="flex -space-x-3">
                {['A', 'B', 'C', 'D'].map((l, i) => (
                  <div
                    key={i}
                    className="w-9 h-9 rounded-full bg-gradient-to-br from-gold-600 to-gold-800 border-2 border-arena-bg flex items-center justify-center text-xs font-bold text-white"
                  >
                    {l}
                  </div>
                ))}
              </div>
              <p className="text-sm text-slate-400">
                <span className="text-white font-semibold">50,000+</span> players already competing
              </p>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 border-b border-arena-border">
          <div className="max-w-7xl mx-auto px-6 py-6 grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="font-display text-3xl font-bold text-gold-400">{stat.value}</p>
                <p className="text-xs text-slate-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="section-heading mb-2">Featured Tournaments</h2>
          <p className="text-slate-400">Registration is open now. Secure your slot before it fills up.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {featuredTournaments.map((t) => (
            <TournamentCard key={t.id} tournament={t} />
          ))}
        </div>

        <div className="text-center">
          <Link
            to="/tournaments"
            className="inline-flex items-center gap-2 px-6 py-3 border border-gold-500/40 text-gold-400 hover:bg-gold-500/10 rounded-xl font-semibold transition-all"
          >
            View All Tournaments
            <ChevronRight size={16} />
          </Link>
        </div>
      </section>

      <section className="py-24 bg-arena-surface border-y border-arena-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="section-heading mb-2">Built for Champions</h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              Everything you need to compete, organize, and win — in one place.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((f) => (
              <div key={f.title} className={`arena-card p-6 border ${f.bg}`}>
                <div className={`w-12 h-12 rounded-xl ${f.bg} flex items-center justify-center mb-4 ${f.color}`}>
                  {f.icon}
                </div>
                <h3 className="font-display text-lg font-bold text-white mb-2">{f.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="section-heading mb-4">
              Support Both <span className="text-gold-400">BGMI</span> &<br />
              <span className="text-orange-400">Free Fire</span>
            </h2>
            <p className="text-slate-400 leading-relaxed mb-6">
              ArenaDinner is purpose-built for India's two biggest mobile battle royale titles.
              All tournament formats, point systems, and scoring rules are tailored for each game.
            </p>
            <div className="grid grid-cols-2 gap-4">
              {[
                { game: 'BGMI', modes: ['Solo', 'Duo', 'Squad'], color: 'gold' },
                { game: 'Free Fire', modes: ['Solo', 'Duo', 'Squad'], color: 'orange' },
              ].map((g) => (
                <div
                  key={g.game}
                  className="arena-card p-4"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Gamepad2 size={16} className={`text-${g.color}-400`} />
                    <span className={`font-display font-bold text-${g.color}-400`}>{g.game}</span>
                  </div>
                  <div className="space-y-1">
                    {g.modes.map((m) => (
                      <div key={m} className="flex items-center gap-2 text-sm text-slate-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                        {m}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="arena-card overflow-hidden">
              <div className="bg-gradient-to-br from-cyan-500/10 via-arena-surface to-arena-surface px-6 pt-6 pb-4 border-b border-arena-border">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="live-indicator">MATCH 2 LIVE</span>
                  </div>
                  <Link
                    to="/leaderboard"
                    className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 transition-colors"
                  >
                    Full board <ArrowRight size={12} />
                  </Link>
                </div>
                <h3 className="font-display text-lg font-bold text-white mt-2">BGMI Pro League — Match 2</h3>
                <p className="text-xs text-slate-500 mt-0.5">Erangel · 18 teams remaining</p>
              </div>

              <div className="px-6 py-3 border-b border-arena-border grid grid-cols-4 text-2xs text-slate-500 uppercase tracking-wider">
                <span>#</span>
                <span className="col-span-2">Team</span>
                <span className="text-right">Pts</span>
              </div>

              <div className="divide-y divide-arena-border">
                {[
                  { rank: 1, team: 'Godlike', kills: 14, pts: 62, trend: 'up' },
                  { rank: 2, team: 'SouL', kills: 11, pts: 50, trend: 'up' },
                  { rank: 3, team: 'Team XO', kills: 9, pts: 45, trend: 'same' },
                  { rank: 4, team: 'OR Esports', kills: 8, pts: 37, trend: 'down' },
                  { rank: 5, team: 'S8UL', kills: 6, pts: 29, trend: 'up' },
                ].map((row, i) => (
                  <div key={row.rank} className="px-6 py-3 grid grid-cols-4 items-center group hover:bg-arena-hover transition-colors">
                    <span className={
                      i === 0 ? 'rank-gold font-bold' :
                      i === 1 ? 'rank-silver font-bold' :
                      i === 2 ? 'rank-bronze font-bold' :
                      'text-slate-500 text-sm'
                    }>
                      {row.rank}
                    </span>
                    <div className="col-span-2 flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-xs font-bold text-slate-300 flex-shrink-0">
                        {row.team[0]}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white leading-tight">{row.team}</p>
                        <p className="text-2xs text-slate-500">{row.kills} kills</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-bold font-display text-gold-400">{row.pts}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="px-6 py-4 border-t border-arena-border">
                <Link to="/leaderboard">
                  <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-semibold hover:bg-cyan-500/20 hover:border-cyan-500/30 transition-all">
                    <Activity size={15} />
                    Watch Live Leaderboard
                  </button>
                </Link>
              </div>
            </div>

            <div className="absolute -top-3 -right-3 w-6 h-6 rounded-full bg-danger-500 animate-ping opacity-40 pointer-events-none" />
            <div className="absolute -top-3 -right-3 w-6 h-6 rounded-full bg-danger-500 opacity-70 pointer-events-none" />
          </div>
        </div>
      </section>

      <section className="py-24 bg-arena-surface border-t border-arena-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="section-heading mb-2">Trusted by Players</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="arena-card p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-500 to-gold-700 flex items-center justify-center text-arena-bg font-bold">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{t.name}</p>
                    <p className="text-2xs text-slate-500">{t.role}</p>
                  </div>
                </div>
                <p className="text-sm text-slate-400 leading-relaxed">"{t.text}"</p>
                <div className="flex gap-1 mt-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={12} className="fill-gold-400 text-gold-400" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="relative overflow-hidden arena-card p-12 text-center border-gold-500/20">
          <div className="absolute inset-0 bg-gradient-radial from-gold-500/5 via-transparent to-transparent" />
          <div className="relative z-10">
            <h2 className="font-display text-5xl font-bold text-white mb-4">
              Ready to <span className="text-gold-400">Compete?</span>
            </h2>
            <p className="text-slate-400 text-lg mb-8 max-w-md mx-auto">
              Create your account in 60 seconds and register for your first tournament today.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gold-500 hover:bg-gold-400 text-arena-bg font-bold text-base rounded-xl transition-all shadow-glow-gold"
              >
                Start Competing Free
                <ArrowRight size={18} />
              </Link>
              <Link
                to="/tournaments"
                className="inline-flex items-center gap-2 px-8 py-4 border border-slate-600 hover:border-slate-500 text-slate-300 font-semibold text-base rounded-xl transition-all"
              >
                View Tournaments
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-arena-border py-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gold-500 flex items-center justify-center">
              <Swords size={14} className="text-arena-bg" />
            </div>
            <span className="font-display font-bold text-white">
              Arena<span className="text-gold-400">Dinner</span>
            </span>
          </div>
          <p className="text-sm text-slate-600">
            © 2025 ArenaDinner. All rights reserved. Built for esports.
          </p>
          <div className="flex gap-4 text-sm text-slate-500">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
