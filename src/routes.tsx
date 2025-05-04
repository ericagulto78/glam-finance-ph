
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "@/components/ProtectedRoute";
import MainLayout from "./components/layout/MainLayout";
import Dashboard from "./pages/Dashboard";
import Landing from "./pages/Landing";
import Profile from "./pages/Profile";
import Bookings from "./pages/Bookings";
import Expenses from "./pages/Expenses";
import Invoices from "./pages/Invoices";
import BankAccounts from "./pages/BankAccounts";
import BankAccount from "./pages/BankAccount";
import ServiceTypes from "./pages/ServiceTypes";
import Settings from "./pages/Settings";
import UserManagement from "./pages/UserManagement";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import { UserRole } from "./types/auth";

const AppRoutes = () => (
  <Routes>
    {/* Public routes */}
    <Route path="/" element={<Landing />} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Login register={true} />} />
    
    {/* Protected routes */}
    <Route path="/dashboard" element={
      <ProtectedRoute>
        <MainLayout>
          <Dashboard />
        </MainLayout>
      </ProtectedRoute>
    } />
    <Route path="/profile" element={
      <ProtectedRoute>
        <MainLayout>
          <Profile />
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
      <ProtectedRoute requiredRole="team_member">
        <MainLayout>
          <Expenses />
        </MainLayout>
      </ProtectedRoute>
    } />
    <Route path="/invoices" element={
      <ProtectedRoute requiredRole="team_member">
        <MainLayout>
          <Invoices />
        </MainLayout>
      </ProtectedRoute>
    } />
    <Route path="/bank-accounts" element={
      <ProtectedRoute requiredRole="studio_admin">
        <MainLayout>
          <BankAccounts />
        </MainLayout>
      </ProtectedRoute>
    } />
    <Route path="/bank-account" element={
      <ProtectedRoute requiredRole="studio_admin">
        <MainLayout>
          <BankAccount />
        </MainLayout>
      </ProtectedRoute>
    } />
    <Route path="/service-types" element={
      <ProtectedRoute requiredRole="team_member">
        <MainLayout>
          <ServiceTypes />
        </MainLayout>
      </ProtectedRoute>
    } />
    <Route path="/settings" element={
      <ProtectedRoute requiredRole="studio_admin">
        <MainLayout>
          <Settings />
        </MainLayout>
      </ProtectedRoute>
    } />
    <Route path="/admin/users" element={
      <ProtectedRoute requiredRole="studio_admin">
        <MainLayout>
          <UserManagement />
        </MainLayout>
      </ProtectedRoute>
    } />
    
    {/* Catch-all route */}
    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default AppRoutes;
