
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { UserRole } from '@/types/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  requiredRole?: UserRole;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAdmin = false,
  requiredRole = 'client'
}) => {
  const { user, loading, userStatus, userRole, isAdmin, signOut } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-500"></div>
      </div>
    );
  }

  // Not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Admin access check
  if (requireAdmin && !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full space-y-4">
          <Alert variant="destructive">
            <AlertTitle>Access Denied</AlertTitle>
            <AlertDescription>
              You need administrator privileges to access this page.
            </AlertDescription>
          </Alert>
          <Button onClick={() => signOut()} variant="outline" className="w-full">
            Return to Login
          </Button>
        </div>
      </div>
    );
  }

  // Role-based access check
  const roleHierarchy: Record<UserRole, number> = {
    'client': 0,
    'team_member': 1,
    'studio_admin': 2,
    'super_administrator': 3
  };

  if (roleHierarchy[userRole] < roleHierarchy[requiredRole]) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full space-y-4">
          <Alert variant="destructive">
            <AlertTitle>Access Denied</AlertTitle>
            <AlertDescription>
              You need {requiredRole} privileges to access this page.
            </AlertDescription>
          </Alert>
          <Button onClick={() => signOut()} variant="outline" className="w-full">
            Return to Login
          </Button>
        </div>
      </div>
    );
  }

  // Account pending approval
  if (userStatus === 'pending' && !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full space-y-4">
          <Alert>
            <AlertTitle>Account Pending Approval</AlertTitle>
            <AlertDescription>
              Your account is waiting for administrator approval. 
              You will be notified when your account is approved.
            </AlertDescription>
          </Alert>
          <Button onClick={() => signOut()} variant="outline" className="w-full">
            Sign Out
          </Button>
        </div>
      </div>
    );
  }

  // Account rejected
  if (userStatus === 'rejected' && !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full space-y-4">
          <Alert variant="destructive">
            <AlertTitle>Account Access Denied</AlertTitle>
            <AlertDescription>
              Your account access has been denied by the administrator.
              Please contact support for more information.
            </AlertDescription>
          </Alert>
          <Button onClick={() => signOut()} variant="outline" className="w-full">
            Sign Out
          </Button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
