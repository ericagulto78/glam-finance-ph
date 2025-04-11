
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ServiceType } from '@/hooks/useServiceTypes';
import { 
  Briefcase, Scissors, Camera, Users, User, 
  Paintbrush, Palette, Heart, Crown, Sparkles,
  Check
} from 'lucide-react';

interface ServiceTypeFormProps {
  formData: Partial<ServiceType>;
  isLoading: boolean;
  onFormChange: (field: string, value: any) => void;
  onCancel: () => void;
  onSubmit: () => void;
  submitLabel: string;
}

const icons = [
  { name: 'Briefcase', icon: <Briefcase size={24} /> },
  { name: 'Scissors', icon: <Scissors size={24} /> },
  { name: 'Camera', icon: <Camera size={24} /> },
  { name: 'Users', icon: <Users size={24} /> },
  { name: 'User', icon: <User size={24} /> },
  { name: 'Paintbrush', icon: <Paintbrush size={24} /> },
  { name: 'Palette', icon: <Palette size={24} /> },
  { name: 'Heart', icon: <Heart size={24} /> },
  { name: 'Crown', icon: <Crown size={24} /> },
  { name: 'Sparkles', icon: <Sparkles size={24} /> },
];

const ServiceTypeForm: React.FC<ServiceTypeFormProps> = ({
  formData,
  isLoading,
  onFormChange,
  onCancel,
  onSubmit,
  submitLabel,
}) => {
  const [selectedIcon, setSelectedIcon] = useState(formData.icon || 'Paintbrush');

  // Update selectedIcon if formData.icon changes
  useEffect(() => {
    if (formData.icon) {
      setSelectedIcon(formData.icon);
    }
  }, [formData.icon]);

  const handleIconSelect = (iconName: string) => {
    setSelectedIcon(iconName);
    onFormChange('icon', iconName);
  };

  return (
    <div className="grid gap-4 py-4">
      <div className="space-y-2">
        <Label htmlFor="name">Service Type Name</Label>
        <Input 
          id="name" 
          value={formData.name || ''}
          onChange={(e) => onFormChange('name', e.target.value)}
        />
      </div>
      
      <div className="space-y-2">
        <Label>Select Icon</Label>
        <div className="grid grid-cols-5 gap-2 mt-1">
          {icons.map((icon) => (
            <Button
              key={icon.name}
              type="button"
              variant={selectedIcon === icon.name ? "default" : "outline"}
              className="flex flex-col items-center justify-center p-3 h-auto"
              onClick={() => handleIconSelect(icon.name)}
            >
              <div className="relative">
                {icon.icon}
                {selectedIcon === icon.name && (
                  <Check className="absolute -top-1 -right-1 h-4 w-4 text-white bg-primary rounded-full" />
                )}
              </div>
              <span className="text-xs mt-2">{icon.name}</span>
            </Button>
          ))}
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="default_price">Default Price (₱)</Label>
        <Input 
          id="default_price" 
          type="number" 
          value={formData.default_price || ''}
          onChange={(e) => onFormChange('default_price', parseFloat(e.target.value) || 0)}
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
