import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useStore } from './context/StoreContext';
import { Layout } from './components/Layout';
import { Landing } from './pages/Landing';
import { FactoryDashboard } from './pages/FactoryDashboard';
import { TruckerDashboard } from './pages/TruckerDashboard';
import { Marketplace } from './pages/Marketplace';
import { BookingDetail } from './pages/BookingDetail';
import { History } from './pages/History';

// Protected Route Wrapper
const ProtectedRoute = ({ children, role }: { children?: React.ReactNode, role?: string }) => {
  const { currentUser } = useStore();
  
  if (!currentUser) {
    return <Navigate to="/" replace />;
  }

  if (role && currentUser.role !== role) {
    return <Navigate to="/" replace />;
  }

  return <Layout>{children}</Layout>;
};

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      
      <Route path="/factory-dashboard" element={
        <ProtectedRoute role="FactoryOwner">
          <FactoryDashboard />
        </ProtectedRoute>
      } />
      
      <Route path="/trucker-dashboard" element={
        <ProtectedRoute role="Trucker">
          <TruckerDashboard />
        </ProtectedRoute>
      } />

      <Route path="/market" element={
        <ProtectedRoute role="FactoryOwner">
          <Marketplace />
        </ProtectedRoute>
      } />

      <Route path="/booking/:id" element={
        <ProtectedRoute>
          <BookingDetail />
        </ProtectedRoute>
      } />

      <Route path="/history" element={
        <ProtectedRoute>
          <History />
        </ProtectedRoute>
      } />
    </Routes>
  );
}