
// Update only the ServiceTypes route in App.tsx

import React from 'react';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import AppSidebar from '@/components/AppSidebar';
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import Bookings from '@/pages/Bookings';
import Expenses from '@/pages/Expenses';
import Invoices from '@/pages/Invoices';
import BankAccounts from '@/pages/BankAccounts';
import BankAccount from '@/pages/BankAccount';
import ServiceTypes from '@/pages/ServiceTypes';
import ProtectedRoute from '@/components/ProtectedRoute';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from '@/components/ui/toaster';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <div className="flex h-screen bg-background">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<ProtectedRoute><AppSidebar /></ProtectedRoute>}>
              <Route index element={<Dashboard />} />
              <Route path="bookings" element={<Bookings />} />
              <Route path="expenses" element={<Expenses />} />
              <Route path="invoices" element={<Invoices />} />
              <Route path="bank-accounts" element={<BankAccounts />} />
              <Route path="bank-account" element={<BankAccount />} />
              <Route path="service-types" element={<ServiceTypes />} />
            </Route>
          </Routes>
          <Toaster />
        </div>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
