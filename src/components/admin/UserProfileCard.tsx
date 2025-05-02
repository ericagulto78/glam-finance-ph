
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { UserRole, UserStatus } from '@/types/auth';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User, CheckCircle, XCircle, Clock } from 'lucide-react';

interface UserProfile {
  id: string;
  user_id: string;
  email: string;
  full_name?: string;
  status: UserStatus;
  role: UserRole;
  created_at: string;
}

interface UserProfileCardProps {
  profile: UserProfile;
  onApprove: (userId: string) => void;
  onReject: (userId: string) => void;
  onRoleChange: (userId: string, role: UserRole) => void;
  currentUserRole: UserRole;
}

const UserProfileCard: React.FC<UserProfileCardProps> = ({
  profile,
  onApprove,
  onReject,
  onRoleChange,
  currentUserRole
}) => {
  const getStatusBadge = (status: UserStatus) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">Rejected</Badge>;
      default:
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">Pending</Badge>;
    }
  };

  const getStatusIcon = (status: UserStatus) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-yellow-500" />;
    }
  };

  // Role hierarchy to determine what roles this user can be assigned
  const roleHierarchy: Record<UserRole, number> = {
    'client': 0,
    'team_member': 1,
    'studio_admin': 2,
    'super_administrator': 3
  };

  const canAssignRole = (userRole: UserRole, targetRole: UserRole): boolean => {
    return roleHierarchy[userRole] > roleHierarchy[targetRole];
  };

  // Format date to be more readable
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const availableRoles = Object.keys(roleHierarchy).filter(role => {
    // Super admins can assign any role, other admins can only assign roles lower than theirs
    return currentUserRole === 'super_administrator' || 
           (canAssignRole(currentUserRole, role as UserRole) && role !== 'super_administrator');
  }) as UserRole[];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center space-x-2">
          <User className="h-5 w-5 text-muted-foreground" />
          <CardTitle className="text-md font-medium">{profile.full_name || profile.email}</CardTitle>
        </div>
        <div className="flex items-center space-x-2">
          {getStatusIcon(profile.status)}
          {getStatusBadge(profile.status)}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Email:</span>
            <span className="text-sm font-medium">{profile.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Role:</span>
            <span className="text-sm font-medium capitalize">{profile.role.replace('_', ' ')}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Joined:</span>
            <span className="text-sm">{formatDate(profile.created_at)}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        <div className="w-full">
          <Select 
            value={profile.role} 
            onValueChange={(value: string) => onRoleChange(profile.user_id, value as UserRole)}
            disabled={currentUserRole !== 'super_administrator' && !canAssignRole(currentUserRole, profile.role)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Role" />
            </SelectTrigger>
            <SelectContent>
              {availableRoles.map((role) => (
                <SelectItem key={role} value={role}>
                  {role.charAt(0).toUpperCase() + role.slice(1).replace('_', ' ')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex w-full justify-between space-x-2">
          <Button 
            variant="outline" 
            className="flex-1 bg-green-50 text-green-700 border-green-200 hover:bg-green-100" 
            onClick={() => onApprove(profile.user_id)}
            disabled={profile.status === 'approved'}
          >
            Approve
          </Button>
          <Button 
            variant="outline" 
            className="flex-1 bg-red-50 text-red-700 border-red-200 hover:bg-red-100" 
            onClick={() => onReject(profile.user_id)}
            disabled={profile.status === 'rejected'}
          >
            Reject
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default UserProfileCard;
