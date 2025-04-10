
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ServiceTypeFormData } from '@/hooks/useServiceTypes';

interface ServiceTypeFormProps {
  formData: ServiceTypeFormData;
  isLoading: boolean;
  onFormChange: (field: string, value: any) => void;
  onCancel: () => void;
  onSubmit: () => void;
  submitLabel: string;
}

const ServiceTypeForm: React.FC<ServiceTypeFormProps> = ({
  formData,
  isLoading,
  onFormChange,
  onCancel,
  onSubmit,
  submitLabel,
}) => {
  return (
    <div className="grid gap-4 py-4">
      <div className="space-y-2">
        <Label htmlFor="name">Service Name</Label>
        <Input 
          id="name" 
          value={formData.name}
          onChange={(e) => onFormChange('name', e.target.value)}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="default_price">Default Price (₱)</Label>
        <Input 
          id="default_price" 
          type="number" 
          value={formData.default_price}
          onChange={(e) => onFormChange('default_price', parseInt(e.target.value) || 0)}
        />
      </div>
      
      <div className="flex justify-end gap-2 mt-4">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button 
          type="submit" 
          onClick={onSubmit}
          disabled={isLoading}
        >
          {isLoading ? 'Processing...' : submitLabel}
        </Button>
      </div>
    </div>
  );
};

export default ServiceTypeForm;
