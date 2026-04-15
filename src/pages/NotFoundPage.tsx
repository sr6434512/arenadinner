import React from 'react';
import { Link } from 'react-router-dom';
import { Swords, ArrowLeft } from 'lucide-react';

export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-arena-bg flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 rounded-2xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center mx-auto mb-6">
          <Swords size={36} className="text-gold-500" />
        </div>
        <h1 className="font-display text-8xl font-bold text-gold-500 mb-4">404</h1>
        <h2 className="font-display text-2xl font-bold text-white mb-3">Page Not Found</h2>
        <p className="text-slate-400 mb-8">This zone doesn't exist. Head back to the arena.</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gold-500 hover:bg-gold-400 text-arena-bg font-bold rounded-xl transition-colors"
        >
          <ArrowLeft size={18} />
          Back to Home
        </Link>
      </div>
    </div>
  );
}
