
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export interface ServiceType {
  id: string;
  name: string;
  default_price: number;
  user_id: string;
  created_at: string;
  updated_at: string;
  icon?: string;
}

export interface ServiceTypeFormData {
  id?: string;
  name: string;
  default_price: number;
  icon?: string;
}

export function useServiceTypes() {
  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedServiceType, setSelectedServiceType] = useState<ServiceType | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  
  // Initial form state
  const initialServiceTypeState: ServiceTypeFormData = {
    name: '',
    default_price: 0,
    icon: 'Paintbrush' // Set a default icon
  };
  
  const [newServiceType, setNewServiceType] = useState<ServiceTypeFormData>(initialServiceTypeState);

  // Fetch service types
  const fetchServiceTypes = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('service_types')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      
      setServiceTypes(data as ServiceType[]);
    } catch (error: any) {
      console.error('Error fetching service types:', error);
      toast({
        title: "Error fetching service types",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchServiceTypes();
  }, [user]);

  // Add a new service type
  const addServiceType = async () => {
    if (!user) return;
    
    if (!newServiceType.name) {
      toast({
        title: "Missing information",
        description: "Please provide a name for the service type",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const serviceTypeToInsert = {
        name: newServiceType.name,
        default_price: newServiceType.default_price || 0,
        icon: newServiceType.icon || 'Paintbrush', // Include the icon property
        user_id: user.id
      };

      const { data, error } = await supabase
        .from('service_types')
        .insert([serviceTypeToInsert])
        .select();

      if (error) throw error;
      
      setIsAddDialogOpen(false);
      await fetchServiceTypes();
      setNewServiceType(initialServiceTypeState);
      toast({
        title: "Service type added",
        description: "The service type has been successfully added",
      });
    } catch (error: any) {
      console.error('Error adding service type:', error);
      toast({
        title: "Error adding service type",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Update an existing service type
  const updateServiceType = async () => {
    if (!selectedServiceType || !user) return;
    
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('service_types')
        .update({
          name: selectedServiceType.name,
          default_price: selectedServiceType.default_price,
          icon: selectedServiceType.icon // Include the icon in the update
        })
        .eq('id', selectedServiceType.id);

      if (error) throw error;
      
      setIsEditDialogOpen(false);
      await fetchServiceTypes();
      toast({
        title: "Service type updated",
        description: "The service type has been successfully updated",
      });
    } catch (error: any) {
      console.error('Error updating service type:', error);
      toast({
        title: "Error updating service type",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Delete a service type
  const deleteServiceType = async () => {
    if (!selectedServiceType || !user) return;
    
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('service_types')
        .delete()
        .eq('id', selectedServiceType.id);

      if (error) throw error;
      
      setIsDeleteDialogOpen(false);
      await fetchServiceTypes();
      toast({
        title: "Service type deleted",
        description: `Service type "${selectedServiceType.name}" has been deleted.`,
      });
    } catch (error: any) {
      console.error('Error deleting service type:', error);
      toast({
        title: "Error deleting service type",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle form input changes for new service type
  const handleNewServiceTypeChange = (field: string, value: any) => {
    setNewServiceType((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle form input changes for edit service type
  const handleSelectedServiceTypeChange = (field: string, value: any) => {
    if (!selectedServiceType) return;
    
    setSelectedServiceType((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        [field]: value,
      };
    });
  };

  return {
    serviceTypes,
    newServiceType,
    selectedServiceType,
    isAddDialogOpen,
    isEditDialogOpen,
    isDeleteDialogOpen,
    isLoading,
    setSelectedServiceType,
    setIsAddDialogOpen,
    setIsEditDialogOpen,
    setIsDeleteDialogOpen,
    handleNewServiceTypeChange,
    handleSelectedServiceTypeChange,
    addServiceType,
    updateServiceType,
    deleteServiceType,
    fetchServiceTypes
  };
}
