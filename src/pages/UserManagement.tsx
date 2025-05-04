
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole, UserStatus } from '@/types/auth';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import PageHeader from '@/components/layout/PageHeader';
import UserProfileCard from '@/components/admin/UserProfileCard';
import { Search, Users } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface UserProfile {
  id: string;
  user_id: string;
  email: string;
  full_name?: string;
  status: UserStatus;
  role: UserRole;
  created_at: string;
}

const UserManagement: React.FC = () => {
  const [userProfiles, setUserProfiles] = useState<UserProfile[]>([]);
  const [filteredProfiles, setFilteredProfiles] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const { toast } = useToast();

  const { approveUser, rejectUser, updateUserRole, userRole } = useAuth();

  useEffect(() => {
    fetchUserProfiles();
  }, []);

  useEffect(() => {
    filterProfiles();
  }, [searchTerm, statusFilter, roleFilter, userProfiles]);

  const fetchUserProfiles = async () => {
    setIsLoading(true);
    try {
      // Use the select query with a simple column selection to avoid RLS recursion
      const { data, error } = await supabase
        .from('user_profiles')
        .select('id, user_id, email, full_name, status, role, created_at')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching user profiles:', error);
        toast({
          title: "Error loading users",
          description: error.message,
          variant: "destructive"
        });
        throw error;
      }

      console.log('User profiles loaded:', data?.length || 0);
      setUserProfiles(data || []);
    } catch (error) {
      console.error('Exception fetching user profiles:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterProfiles = () => {
    let filtered = [...userProfiles];

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        profile => 
          profile.email?.toLowerCase().includes(term) || 
          profile.full_name?.toLowerCase().includes(term)
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(profile => profile.status === statusFilter);
    }

    // Apply role filter
    if (roleFilter !== 'all') {
      filtered = filtered.filter(profile => profile.role === roleFilter);
    }

    setFilteredProfiles(filtered);
  };

  const handleApproveUser = async (userId: string) => {
    await approveUser(userId);
    fetchUserProfiles();
  };

  const handleRejectUser = async (userId: string) => {
    await rejectUser(userId);
    fetchUserProfiles();
  };

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    await updateUserRole(userId, newRole);
    fetchUserProfiles();
  };

  return (
    <div className="h-full">
      <PageHeader 
        title="User Management" 
        subtitle="Manage user accounts, roles and permissions" 
        icon={<Users className="h-6 w-6" />}
      />

      <div className="p-6 space-y-6">
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search by name or email..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="client">Client</SelectItem>
              <SelectItem value="team_member">Team Member</SelectItem>
              <SelectItem value="studio_admin">Studio Admin</SelectItem>
              <SelectItem value="super_administrator">Super Administrator</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={fetchUserProfiles}>
            Refresh
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : filteredProfiles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProfiles.map((profile) => (
              <UserProfileCard 
                key={profile.id} 
                profile={profile}
                onApprove={handleApproveUser}
                onReject={handleRejectUser}
                onRoleChange={handleRoleChange}
                currentUserRole={userRole}
              />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-8">
              <Users className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No users found matching your filters.</p>
              {(searchTerm || statusFilter !== 'all' || roleFilter !== 'all') && (
                <Button 
                  variant="link" 
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('all');
                    setRoleFilter('all');
                  }}
                >
                  Clear filters
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default UserManagement;
