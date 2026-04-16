import React from 'react';
import { Link } from 'react-router-dom';
import {
  Swords, Trophy, Users, Zap, Shield, ChevronRight,
  Star, BarChart3, Gamepad2, ArrowRight, Activity, Flame,
  Sparkles, Target, Clock, Gem, Bolt
} from 'lucide-react';
import { TournamentCard } from '../components/tournament/TournamentCard';
import { DEMO_TOURNAMENTS } from '../lib/demoData';

const STATS = [
  { value: '50K+', label: 'Active Players', icon: <Users size={20} />, color: 'cyan' },
  { value: '₹2Cr+', label: 'Prize Pool', icon: <Trophy size={20} />, color: 'gold' },
  { value: '500+', label: 'Tournaments', icon: <Swords size={20} />, color: 'danger' },
  { value: '98%', label: 'Satisfaction', icon: <Star size={20} />, color: 'success' },
];

const FEATURES = [
  {
    icon: <Zap size={24} />,
    title: 'Lightning Fast Setup',
    desc: 'Register in 60 seconds. Instant slot confirmation. Start competing today.',
    color: 'text-gold-400',
    bg: 'bg-gold-500/10 border-gold-500/20',
    highlight: 'gold'
  },
  {
    icon: <Activity size={24} />,
    title: 'Live Leaderboards',
    desc: 'Real-time kill feeds, point updates, and competitive rankings as matches unfold.',
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10 border-cyan-500/20',
    highlight: 'cyan'
  },
  {
    icon: <Shield size={24} />,
    title: 'Verified Payouts',
    desc: 'Prize money within 24 hours. Fully transparent, no hidden charges.',
    color: 'text-success-400',
    bg: 'bg-success-500/10 border-success-500/20',
    highlight: 'success'
  },
  {
    icon: <Users size={24} />,
    title: 'Team Management',
    desc: 'Build your roster, invite players, and manage everything from one dashboard.',
    color: 'text-danger-400',
    bg: 'bg-danger-500/10 border-danger-500/20',
    highlight: 'danger'
  },
];

const TESTIMONIALS = [
  {
    name: 'Arjun "ProBot" Sharma',
    role: 'BGMI Player • Conqueror',
    avatar: 'A',
    text: 'Smoothest registration I\'ve ever seen. Won my first tournament and got paid in 12 hours.',
    rating: 5,
  },
  {
    name: 'Riya Kapoor',
    role: 'Tournament Organizer',
    avatar: 'R',
    text: 'Managing tournaments is now effortless. The platform handles everything perfectly.',
    rating: 5,
  },
  {
    name: 'Team ShadowStrike',
    role: 'Free Fire Squad',
    avatar: 'T',
    text: 'Real-time updates during matches. Our fans love following the live leaderboard.',
    rating: 5,
  },
];

export function LandingPage() {
  const featuredTournaments = DEMO_TOURNAMENTS.filter((t) => t.status === 'open').slice(0, 3);

  return (
    <div className="bg-arena-bg overflow-hidden">
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/7915509/pexels-photo-7915509.jpeg"
            alt="Hero"
            className="w-full h-full object-cover opacity-5"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-arena-bg via-transparent to-arena-bg" />
          <div className="absolute inset-0 bg-hero-grid opacity-40" />

          <div className="absolute top-1/3 -left-1/2 w-full h-full bg-gradient-radial from-gold-500/20 to-transparent blur-3xl" />
          <div className="absolute bottom-1/4 -right-1/3 w-full h-full bg-gradient-radial from-cyan-500/10 to-transparent blur-3xl" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-gold-500/20 to-cyan-500/20 border border-gold-500/30 text-gold-400 text-xs font-bold uppercase tracking-wider mb-6">
              <Flame size={14} className="fill-gold-400" />
              India's Premier Esports Platform
            </div>

            <h1 className="font-display text-7xl md:text-8xl font-bold text-white leading-tight mb-6">
              <span className="block">DOMINATE</span>
              <span className="block bg-gradient-to-r from-gold-400 via-cyan-400 to-gold-400 bg-clip-text text-transparent">THE ARENA</span>
            </h1>

            <p className="text-xl md:text-2xl text-slate-300 leading-relaxed mb-12 max-w-3xl mx-auto font-light">
              Compete in verified tournaments with massive prize pools. Real payouts, zero delays,
              <br className="hidden md:block" />
              24/7 live leaderboards, and thousands of players worldwide.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link
                to="/tournaments"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-arena-bg font-bold text-lg rounded-xl transition-all shadow-glow-gold hover:shadow-glow-gold transform hover:scale-105 duration-200"
              >
                <Swords size={20} />
                Find Tournaments
              </Link>
              <Link
                to="/register?role=organizer"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-transparent border-2 border-cyan-500/50 hover:border-cyan-400 text-cyan-400 font-bold text-lg rounded-xl transition-all hover:bg-cyan-500/5"
              >
                <Target size={20} />
                Host a Tournament
              </Link>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-8">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {['👤', '👥', '🎮', '⭐'].map((emoji, i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full bg-gradient-to-br from-gold-600 to-gold-800 border-2 border-arena-bg flex items-center justify-center text-lg"
                    >
                      {emoji}
                    </div>
                  ))}
                </div>
                <div>
                  <p className="text-white font-bold text-base">50,000+</p>
                  <p className="text-xs text-slate-400">active players</p>
                </div>
              </div>

              <div className="h-10 w-px bg-gradient-to-b from-transparent via-slate-700 to-transparent" />

              <div>
                <p className="text-gold-400 font-bold text-lg">₹2 Crore+</p>
                <p className="text-xs text-slate-400">total winnings</p>
              </div>

              <div className="h-10 w-px bg-gradient-to-b from-transparent via-slate-700 to-transparent" />

              <div>
                <p className="text-cyan-400 font-bold text-lg">500+</p>
                <p className="text-xs text-slate-400">tournaments</p>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-gold-500 rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-2 bg-gold-500 rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-danger-500/10 border border-danger-500/30 text-danger-400 text-xs font-bold uppercase tracking-wider mb-4">
            <Flame size={12} />
            Live & Open
          </div>
          <h2 className="section-heading mb-3">Featured Tournaments</h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Register now for the biggest tournaments with the highest prize pools. Thousands of teams competing right now.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {featuredTournaments.map((t) => (
            <TournamentCard key={t.id} tournament={t} />
          ))}
        </div>

        <div className="text-center">
          <Link
            to="/tournaments"
            className="inline-flex items-center gap-2 px-8 py-3 border-2 border-gold-500/50 hover:border-gold-400 text-gold-400 hover:bg-gold-500/10 rounded-xl font-bold transition-all"
          >
            Explore All Tournaments
            <ChevronRight size={18} />
          </Link>
        </div>
      </section>

      <section className="py-24 bg-gradient-to-b from-transparent via-arena-surface/50 to-arena-surface border-y border-arena-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="section-heading mb-4">Built for Champions</h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Powerful tools designed to make you unstoppable. From registration to payouts, we handle everything.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((f, idx) => (
              <div
                key={f.title}
                className={`arena-card p-6 border ${f.bg} group hover:border-${f.highlight}-400/50 transition-all duration-300 hover:shadow-lg relative overflow-hidden`}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10">
                  <div className={`w-14 h-14 rounded-xl ${f.bg} flex items-center justify-center mb-5 ${f.color} group-hover:scale-110 transition-transform`}>
                    {f.icon}
                  </div>
                  <h3 className="font-display text-lg font-bold text-white mb-3">{f.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">
          <div className="flex flex-col justify-center">
            <h2 className="section-heading mb-4">
              Built for <span className="text-gold-400">BGMI</span> &<br />
              <span className="text-orange-400">Free Fire</span>
            </h2>
            <p className="text-slate-300 text-lg leading-relaxed mb-8">
              Purpose-built for India's biggest battle royale titles. Game-specific formats, scoring rules, and point systems optimized for each title.
            </p>
            <div className="grid grid-cols-2 gap-4">
              {[
                { game: 'BGMI', modes: ['Solo', 'Duo', 'Squad'], color: 'gold' },
                { game: 'Free Fire', modes: ['Solo', 'Duo', 'Squad'], color: 'orange' },
              ].map((g) => (
                <div
                  key={g.game}
                  className="arena-card p-5 border border-slate-700 hover:border-slate-600 transition-all group"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <div className={`w-10 h-10 rounded-lg bg-${g.color}-500/20 flex items-center justify-center group-hover:bg-${g.color}-500/30 transition-colors`}>
                      <Gamepad2 size={18} className={`text-${g.color}-400`} />
                    </div>
                    <span className={`font-display font-bold text-${g.color}-400 text-lg`}>{g.game}</span>
                  </div>
                  <div className="space-y-2">
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
            <div className="arena-card overflow-hidden border-2 border-gold-500/30 shadow-glow-gold">
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

      <section className="py-24 bg-gradient-to-b from-arena-bg to-arena-surface border-t border-arena-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="section-heading mb-4">Loved by Champions</h2>
            <p className="text-slate-400 text-lg">Players, organizers, and teams trust ArenaDinner for transparent tournaments and instant payouts.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="arena-card p-6 border border-slate-700 hover:border-gold-500/40 transition-all duration-300 group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-gold-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10">
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} className="fill-gold-400 text-gold-400" />
                    ))}
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed mb-5 italic">"{t.text}"</p>
                  <div className="flex items-center gap-3 pt-4 border-t border-slate-700">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gold-500 to-gold-700 flex items-center justify-center text-arena-bg font-bold flex-shrink-0">
                      {t.avatar}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">{t.name}</p>
                      <p className="text-xs text-slate-500">{t.role}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="relative overflow-hidden arena-card p-16 text-center border-2 border-gold-500/30">
          <div className="absolute inset-0">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-radial from-gold-500/10 to-transparent blur-3xl" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-radial from-cyan-500/5 to-transparent blur-3xl" />
          </div>
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-bold uppercase tracking-wider mb-6">
              <Gem size={14} />
              Limited Time Offer
            </div>
            <h2 className="font-display text-6xl font-bold text-white mb-4">
              Ready to <span className="text-gold-400">Dominate?</span>
            </h2>
            <p className="text-slate-300 text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
              Join 50,000+ players competing right now. Register in 60 seconds and secure your first tournament entry today. No fees, guaranteed payouts.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2 px-10 py-4 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-arena-bg font-bold text-lg rounded-xl transition-all shadow-glow-gold transform hover:scale-105 duration-200"
              >
                <Sparkles size={20} />
                Start Competing Free
              </Link>
              <Link
                to="/tournaments"
                className="inline-flex items-center justify-center gap-2 px-10 py-4 border-2 border-slate-600 hover:border-gold-500/50 text-slate-300 hover:text-white font-semibold text-lg rounded-xl transition-all hover:bg-gold-500/5"
              >
                <BarChart3 size={20} />
                Browse Tournaments
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
