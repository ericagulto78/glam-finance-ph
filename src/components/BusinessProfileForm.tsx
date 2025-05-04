
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface BusinessProfileFormProps {
  onSave?: () => void;
}

const BusinessProfileForm: React.FC<BusinessProfileFormProps> = ({ onSave }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    website: '',
    address: '',
    taxNumber: '',
    logoUrl: ''
  });

  useEffect(() => {
    if (user) {
      fetchBusinessProfile();
    }
  }, [user]);

  const fetchBusinessProfile = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('business_profiles')
        .select('*')
        .eq('user_id', user?.id)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        throw error;
      }
      
      if (data) {
        setFormData({
          name: data.name || '',
          email: data.email || '',
          phone: data.phone || '',
          website: data.website || '',
          address: data.address || '',
          taxNumber: data.tax_number || '',
          logoUrl: data.logo_url || ''
        });
      }
    } catch (error) {
      console.error('Error fetching business profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      
      // Call the RPC function to update the business profile
      const { data, error } = await supabase.rpc('update_business_profile', {
        p_name: formData.name,
        p_address: formData.address,
        p_email: formData.email,
        p_phone: formData.phone,
        p_website: formData.website,
        p_tax_number: formData.taxNumber,
        p_logo_url: formData.logoUrl
      });
      
      if (error) throw error;
      
      toast({
        title: "Business profile updated",
        description: "Your business information has been updated successfully."
      });
      
      if (onSave) {
        onSave();
      }
    } catch (error) {
      console.error('Error updating business profile:', error);
      toast({
        title: "Error updating business profile",
        description: "There was an error updating your business information. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Business Name</Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Your business name"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="email">Business Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="contact@yourbusiness.com"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="phone">Business Phone</Label>
          <Input
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+1 (555) 123-4567"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="website">Website</Label>
        <Input
          id="website"
          name="website"
          value={formData.website}
          onChange={handleChange}
          placeholder="https://yourbusiness.com"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="address">Business Address</Label>
        <Textarea
          id="address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="123 Main St, City, Country"
          rows={3}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="taxNumber">Tax ID / Registration Number</Label>
        <Input
          id="taxNumber"
          name="taxNumber"
          value={formData.taxNumber}
          onChange={handleChange}
          placeholder="Your business tax ID"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="logoUrl">Logo URL</Label>
        <Input
          id="logoUrl"
          name="logoUrl"
          value={formData.logoUrl}
          onChange={handleChange}
          placeholder="https://example.com/your-logo.png"
        />
        <p className="text-xs text-muted-foreground mt-1">
          Enter the URL to your business logo image
        </p>
      </div>
      
      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? "Saving..." : "Save Business Information"}
      </Button>
    </form>
  );
};

export default BusinessProfileForm;
