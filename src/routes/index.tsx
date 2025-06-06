
import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import ProtectedRoute from '@/components/ProtectedRoute';
import MainLayout from '@/components/layout/MainLayout';
import Dashboard from '@/pages/Dashboard';
import Invoices from '@/pages/Invoices';
import Bookings from '@/pages/Bookings';
import Expenses from '@/pages/Expenses';
import BankAccounts from '@/pages/BankAccounts';
import BankAccount from '@/pages/BankAccount';
import ServiceTypes from '@/pages/ServiceTypes';
import UserManagement from '@/pages/UserManagement';
import Login from '@/pages/Login';
import NotFound from '@/pages/NotFound';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Login register={true} />} />
      
      <Route path="/" element={
        <ProtectedRoute>
          <MainLayout>
            <Outlet />
          </MainLayout>
        </ProtectedRoute>
      }>
        <Route index element={<Dashboard />} />
        <Route path="invoices" element={<Invoices />} />
        <Route path="bookings" element={<Bookings />} />
        <Route path="expenses" element={<Expenses />} />
        <Route path="bank-accounts" element={<BankAccounts />} />
        <Route path="bank-account" element={<BankAccount />} />
        <Route path="service-types" element={<ServiceTypes />} />
        <Route path="admin/users" element={
          <ProtectedRoute requiredRole="studio_admin">
            <UserManagement />
          </ProtectedRoute>
        } />
      </Route>
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
