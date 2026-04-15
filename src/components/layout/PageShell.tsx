import React from 'react';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';

interface PageShellProps {
  children: React.ReactNode;
  variant?: 'public' | 'dashboard';
}

export function PageShell({ children, variant = 'public' }: PageShellProps) {
  if (variant === 'dashboard') {
    return (
      <div className="min-h-screen bg-arena-bg flex flex-col">
        <Navbar />
        <div className="flex flex-1 pt-16 overflow-hidden" style={{ height: 'calc(100vh - 0px)' }}>
          <div className="hidden lg:flex">
            <Sidebar />
          </div>
          <main className="flex-1 overflow-y-auto bg-arena-bg">
            <div className="p-6 max-w-7xl mx-auto">{children}</div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-arena-bg">
      <Navbar />
      <main className="pt-16">{children}</main>
    </div>
  );
}
