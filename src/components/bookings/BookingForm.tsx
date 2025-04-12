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
import { Switch } from '@/components/ui/switch';
import { CheckCircle2, Plus, Trash } from 'lucide-react';
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
  persons?: number;
  transportation_fee?: number;
  early_morning_fee?: number;
}

interface ServiceLineItem {
  serviceId: string;
  serviceName: string;
  persons: number;
  price: number;
  customPrice?: boolean;
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
  const [lineItems, setLineItems] = useState<ServiceLineItem[]>([]);
  const [baseAmount, setBaseAmount] = useState<number>(0);

  useEffect(() => {
    fetchServiceTypes();
  }, []);

  useEffect(() => {
    // Initialize with at least one line item when serviceTypes are available
    if (serviceTypes.length > 0 && lineItems.length === 0) {
      setLineItems([{
        serviceId: '',
        serviceName: '',
        persons: 1,
        price: 0,
        customPrice: false
      }]);
    }
  }, [serviceTypes]);

  useEffect(() => {
    calculateTotalAmount();
  }, [lineItems, formData.transportation_fee, formData.early_morning_fee]);

  const handleServiceTypeChange = (serviceTypeId: string, index: number) => {
    const selectedType = serviceTypes.find(type => type.id === serviceTypeId);
    if (selectedType) {
      const updatedLineItems = [...lineItems];
      updatedLineItems[index] = {
        ...updatedLineItems[index],
        serviceId: selectedType.id,
        serviceName: selectedType.name,
        price: selectedType.default_price,
        customPrice: false
      };
      setLineItems(updatedLineItems);
      
      // Update the service name in formData to a concatenated string of all services
      updateServiceNameInFormData(updatedLineItems);
      
      // Calculate total amount
      calculateTotalAmount(updatedLineItems);
    }
  };

  const handlePersonsChange = (persons: number, index: number) => {
    const updatedLineItems = [...lineItems];
    updatedLineItems[index] = {
      ...updatedLineItems[index],
      persons: persons
    };
    setLineItems(updatedLineItems);
    calculateTotalAmount(updatedLineItems);
  };

  const handlePriceChange = (price: number, index: number) => {
    const updatedLineItems = [...lineItems];
    updatedLineItems[index] = {
      ...updatedLineItems[index],
      price: price,
      customPrice: true
    };
    setLineItems(updatedLineItems);
    calculateTotalAmount(updatedLineItems);
  };

  const addLineItem = () => {
    setLineItems([...lineItems, {
      serviceId: '',
      serviceName: '',
      persons: 1,
      price: 0,
      customPrice: false
    }]);
  };

  const removeLineItem = (index: number) => {
    if (lineItems.length > 1) {
      const updatedLineItems = lineItems.filter((_, i) => i !== index);
      setLineItems(updatedLineItems);
      updateServiceNameInFormData(updatedLineItems);
      calculateTotalAmount(updatedLineItems);
    }
  };

  const updateServiceNameInFormData = (items: ServiceLineItem[]) => {
    const serviceDescription = items
      .filter(item => item.serviceName)
      .map(item => `${item.persons} pax ${item.serviceName}`)
      .join('\n');
    
    onFormChange('service', serviceDescription);
  };

  const calculateTotalAmount = (items = lineItems) => {
    // Calculate subtotal from line items
    const subtotal = items.reduce((sum, item) => {
      return sum + (item.price * item.persons);
    }, 0);
    
    // Add fees
    const transportationFee = formData.transportation_fee || 0;
    const earlyMorningFee = formData.early_morning_fee || 0;
    
    // Total amount
    const total = subtotal + transportationFee + earlyMorningFee;
    
    onFormChange('amount', total);
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
          <Label htmlFor="date">Date</Label>
          <Input 
            id="date" 
            type="date" 
            value={formData.date}
            onChange={(e) => onFormChange('date', e.target.value)}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="time">Time</Label>
          <Input 
            id="time" 
            value={formData.time}
            onChange={(e) => onFormChange('time', e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input 
            id="location" 
            value={formData.location}
            onChange={(e) => onFormChange('location', e.target.value)}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Services</Label>
          <Button 
            type="button" 
            variant="outline" 
            size="sm"
            onClick={addLineItem}
            className="flex items-center gap-1"
          >
            <Plus size={16} /> Add Service
          </Button>
        </div>
        
        <div className="space-y-3 mt-2">
          {lineItems.map((item, index) => (
            <div key={index} className="grid grid-cols-12 gap-2 items-end border p-3 rounded-md">
              <div className="col-span-5">
                <Label htmlFor={`serviceType-${index}`}>Service Type</Label>
                <Select
                  value={item.serviceId}
                  onValueChange={(value) => handleServiceTypeChange(value, index)}
                >
                  <SelectTrigger id={`serviceType-${index}`}>
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
              
              <div className="col-span-2">
                <Label htmlFor={`persons-${index}`}>Persons</Label>
                <Input 
                  id={`persons-${index}`} 
                  type="number" 
                  min="1"
                  value={item.persons}
                  onChange={(e) => handlePersonsChange(parseInt(e.target.value) || 1, index)}
                />
              </div>
              
              <div className="col-span-3">
                <Label htmlFor={`price-${index}`}>Unit Price (₱)</Label>
                <Input 
                  id={`price-${index}`} 
                  type="number" 
                  min="0"
                  value={item.price}
                  onChange={(e) => handlePriceChange(parseFloat(e.target.value) || 0, index)}
                  className={item.customPrice ? "border-primary" : ""}
                />
              </div>
              
              <div className="col-span-1">
                <Label htmlFor={`subtotal-${index}`}>Subtotal</Label>
                <Input 
                  id={`subtotal-${index}`} 
                  value={`₱${(item.price * item.persons).toLocaleString()}`}
                  className="bg-muted"
                  readOnly
                />
              </div>
              
              <div className="col-span-1 flex justify-end">
                <Button 
                  type="button" 
                  variant="ghost"
                  size="icon"
                  onClick={() => removeLineItem(index)}
                  disabled={lineItems.length <= 1}
                >
                  <Trash size={16} className="text-destructive" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="service_details">Additional Service Details</Label>
        <Textarea 
          id="service_details" 
          value={formData.service_details || ''}
          onChange={(e) => onFormChange('service_details', e.target.value)}
          placeholder="Enter any additional details about the service"
          className="h-20"
        />
      </div>
      
      <div className="border-t pt-4 mt-2">
        <h3 className="font-medium mb-3">Other Fees (Not Added to Income/Sales)</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="transportation_fee">Transportation Fee (₱)</Label>
            <Input 
              id="transportation_fee" 
              type="number" 
              value={formData.transportation_fee || 0}
              onChange={(e) => onFormChange('transportation_fee', parseFloat(e.target.value) || 0)}
            />
            <p className="text-xs text-muted-foreground">
              Out of town fee (not included in income)
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="early_morning_fee">Early Morning Fee (₱)</Label>
            <Input 
              id="early_morning_fee" 
              type="number" 
              value={formData.early_morning_fee || 0}
              onChange={(e) => onFormChange('early_morning_fee', parseFloat(e.target.value) || 0)}
            />
            <p className="text-xs text-muted-foreground">
              Additional fee for early service (not included in income)
            </p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 border-t pt-4 mt-2">
        <div className="space-y-2">
          <Label htmlFor="amount">Total Amount (₱)</Label>
          <Input 
            id="amount" 
            type="number" 
            value={formData.amount}
            onChange={(e) => onFormChange('amount', parseFloat(e.target.value) || 0)}
            className="bg-muted"
            readOnly
          />
          <p className="text-xs text-muted-foreground">
            Calculated based on services and fees
          </p>
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
