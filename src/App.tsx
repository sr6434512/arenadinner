import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';

const LandingPage = lazy(() => import('./pages/LandingPage').then((m) => ({ default: m.LandingPage })));
const TournamentsPage = lazy(() => import('./pages/TournamentsPage').then((m) => ({ default: m.TournamentsPage })));
const TournamentDetailPage = lazy(() => import('./pages/TournamentDetailPage').then((m) => ({ default: m.TournamentDetailPage })));
const LeaderboardPage = lazy(() => import('./pages/LeaderboardPage').then((m) => ({ default: m.LeaderboardPage })));
const LiveLeaderboardPage = lazy(() => import('./pages/LiveLeaderboardPage').then((m) => ({ default: m.LiveLeaderboardPage })));
const LoginPage = lazy(() => import('./pages/auth/LoginPage').then((m) => ({ default: m.LoginPage })));
const RegisterPage = lazy(() => import('./pages/auth/RegisterPage').then((m) => ({ default: m.RegisterPage })));
const PlayerDashboard = lazy(() => import('./pages/dashboard/PlayerDashboard').then((m) => ({ default: m.PlayerDashboard })));
const OrgDashboard = lazy(() => import('./pages/organizer/OrgDashboard').then((m) => ({ default: m.OrgDashboard })));
const OrgTournamentsPage = lazy(() => import('./pages/organizer/OrgTournamentsPage').then((m) => ({ default: m.OrgTournamentsPage })));
const CreateTournamentPage = lazy(() => import('./pages/organizer/CreateTournamentPage').then((m) => ({ default: m.CreateTournamentPage })));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard').then((m) => ({ default: m.AdminDashboard })));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage })));

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-arena-bg flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-gold-500/20 border border-gold-500/30 flex items-center justify-center">
          <div className="w-6 h-6 rounded-full border-2 border-gold-500 border-t-transparent animate-spin" />
        </div>
        <p className="text-sm text-slate-500 font-medium">Loading ArenaDinner...</p>
      </div>
    </div>
  );
}

function ProtectedRoute({ children, allowedRoles }: { children: React.ReactNode; allowedRoles?: string[] }) {
  const { user, profile, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && profile && !allowedRoles.includes(profile.role)) {
    return <Navigate to="/dashboard" replace />;
  }
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/tournaments" element={<TournamentsPage />} />
        <Route path="/tournaments/:id" element={<TournamentDetailPage />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
        <Route path="/live/:matchId" element={<LiveLeaderboardPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route path="/dashboard" element={
          <ProtectedRoute>
            <PlayerDashboard />
          </ProtectedRoute>
        } />
        <Route path="/dashboard/*" element={
          <ProtectedRoute>
            <PlayerDashboard />
          </ProtectedRoute>
        } />

        <Route path="/org/dashboard" element={
          <ProtectedRoute allowedRoles={['organizer', 'admin']}>
            <OrgDashboard />
          </ProtectedRoute>
        } />
        <Route path="/org/tournaments" element={
          <ProtectedRoute allowedRoles={['organizer', 'admin']}>
            <OrgTournamentsPage />
          </ProtectedRoute>
        } />
        <Route path="/org/tournaments/create" element={
          <ProtectedRoute allowedRoles={['organizer', 'admin']}>
            <CreateTournamentPage />
          </ProtectedRoute>
        } />

        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin/*" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        } />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <NotificationProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </NotificationProvider>
    </BrowserRouter>
  );
}
