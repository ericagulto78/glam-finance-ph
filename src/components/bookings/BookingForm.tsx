
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CheckCircle2 } from 'lucide-react';
import { useServiceTypes, ServiceType } from '@/hooks/useServiceTypes';

export interface BookingFormData {
  id?: string;
  client: string;
  service: string;
  date: string;
  time: string;
  location: string;
  amount: number;
  status: 'upcoming' | 'completed' | 'cancelled';
  reservation_fee?: number;
  service_details?: string;
}

interface BookingFormProps {
  formData: BookingFormData;
  isLoading: boolean;
  onFormChange: (field: string, value: any) => void;
  onCancel: () => void;
  onSubmit: () => void;
  submitLabel: string;
}

const BookingForm: React.FC<BookingFormProps> = ({
  formData,
  isLoading,
  onFormChange,
  onCancel,
  onSubmit,
  submitLabel,
}) => {
  const { serviceTypes, fetchServiceTypes } = useServiceTypes();
  const [selectedServiceType, setSelectedServiceType] = useState<ServiceType | null>(null);

  useEffect(() => {
    fetchServiceTypes();
  }, []);

  const handleServiceTypeChange = (serviceTypeId: string) => {
    const selectedType = serviceTypes.find(type => type.id === serviceTypeId);
    if (selectedType) {
      setSelectedServiceType(selectedType);
      onFormChange('service', selectedType.name);
      onFormChange('amount', selectedType.default_price);
    }
  };

  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="client">Client Name</Label>
          <Input 
            id="client" 
            value={formData.client}
            onChange={(e) => onFormChange('client', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="serviceType">Service Type</Label>
          <Select
            value={selectedServiceType?.id || ""}
            onValueChange={handleServiceTypeChange}
          >
            <SelectTrigger id="serviceType">
              <SelectValue placeholder="Select a service type" />
            </SelectTrigger>
            <SelectContent>
              {serviceTypes.map(type => (
                <SelectItem key={type.id} value={type.id}>
                  {type.name} - ₱{type.default_price}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="service">Service Name</Label>
        <Input 
          id="service" 
          value={formData.service}
          onChange={(e) => onFormChange('service', e.target.value)}
        />
        <p className="text-sm text-muted-foreground">
          You can customize the service name or use the one from the selected service type
        </p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="service_details">Service Details</Label>
        <Textarea 
          id="service_details" 
          value={formData.service_details || ''}
          onChange={(e) => onFormChange('service_details', e.target.value)}
          placeholder="Enter any additional details about the service"
          className="h-20"
        />
      </div>
      
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="date">Date</Label>
          <Input 
            id="date" 
            type="date" 
            value={formData.date}
            onChange={(e) => onFormChange('date', e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="time">Time</Label>
          <Input 
            id="time" 
            value={formData.time}
            onChange={(e) => onFormChange('time', e.target.value)}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <Input 
          id="location" 
          value={formData.location}
          onChange={(e) => onFormChange('location', e.target.value)}
        />
      </div>
      
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="amount">Amount (₱)</Label>
          <Input 
            id="amount" 
            type="number" 
            value={formData.amount}
            onChange={(e) => onFormChange('amount', parseFloat(e.target.value) || 0)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="reservation_fee">Reservation Fee (₱)</Label>
          <Input 
            id="reservation_fee" 
            type="number" 
            value={formData.reservation_fee || 0}
            onChange={(e) => onFormChange('reservation_fee', parseFloat(e.target.value) || 0)}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <Select
          value={formData.status}
          onValueChange={(value) => onFormChange('status', value)}
        >
          <SelectTrigger id="status">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="upcoming">Upcoming</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
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

export default BookingForm;
