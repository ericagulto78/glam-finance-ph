
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { BookingStatus } from '@/integrations/supabase/client';

export interface BookingFormData {
  id?: string;
  client: string;
  service: string;
  date: string;
  time: string;
  location: string;
  amount: number;
  status: BookingStatus;
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
  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="client">Client Name</Label>
          <Input 
            id="client" 
            value={formData.client}
            onChange={(e) => onFormChange('client', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="service">Service</Label>
          <Input 
            id="service" 
            value={formData.service}
            onChange={(e) => onFormChange('service', e.target.value)}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
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
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="amount">Amount (₱)</Label>
          <Input 
            id="amount" 
            type="number" 
            value={formData.amount.toString()}
            onChange={(e) => onFormChange('amount', parseInt(e.target.value) || 0)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select 
            value={formData.status}
            onValueChange={(value) => onFormChange('status', value as BookingStatus)}
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
