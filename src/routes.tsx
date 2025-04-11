
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "@/components/ProtectedRoute";
import MainLayout from "./components/layout/MainLayout";
import Dashboard from "./pages/Dashboard";
import Bookings from "./pages/Bookings";
import Expenses from "./pages/Expenses";
import Invoices from "./pages/Invoices";
import BankAccounts from "./pages/BankAccounts";
import BankAccount from "./pages/BankAccount";
import ServiceTypes from "./pages/ServiceTypes";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

const AppRoutes = () => (
  <Routes>
    {/* Public routes */}
    <Route path="/login" element={<Login />} />
    
    {/* Protected routes */}
    <Route path="/" element={
      <ProtectedRoute>
        <MainLayout>
          <Dashboard />
        </MainLayout>
      </ProtectedRoute>
    } />
    <Route path="/bookings" element={
      <ProtectedRoute>
        <MainLayout>
          <Bookings />
        </MainLayout>
      </ProtectedRoute>
    } />
    <Route path="/expenses" element={
      <ProtectedRoute>
        <MainLayout>
          <Expenses />
        </MainLayout>
      </ProtectedRoute>
    } />
    <Route path="/invoices" element={
      <ProtectedRoute>
        <MainLayout>
          <Invoices />
        </MainLayout>
      </ProtectedRoute>
    } />
    <Route path="/bank-accounts" element={
      <ProtectedRoute>
        <MainLayout>
          <BankAccounts />
        </MainLayout>
      </ProtectedRoute>
    } />
    <Route path="/bank-account" element={
      <ProtectedRoute>
        <MainLayout>
          <BankAccount />
        </MainLayout>
      </ProtectedRoute>
    } />
    <Route path="/service-types" element={
      <ProtectedRoute>
        <MainLayout>
          <ServiceTypes />
        </MainLayout>
      </ProtectedRoute>
    } />
    <Route path="/settings" element={
      <ProtectedRoute>
        <MainLayout>
          <Settings />
        </MainLayout>
      </ProtectedRoute>
    } />
    <Route path="/admin/users" element={
      <ProtectedRoute requireAdmin={true}>
        <MainLayout>
          <h1>User Management (Coming Soon)</h1>
        </MainLayout>
      </ProtectedRoute>
    } />
    
    {/* Catch-all route */}
    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default AppRoutes;
