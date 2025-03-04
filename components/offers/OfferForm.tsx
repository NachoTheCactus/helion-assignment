// components/offers/OfferForm.tsx
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { OfferStatus } from '@/types/offer';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface OfferFormProps {
  initialData?: any;
  onSubmit: (data: any) => void;
  isSubmitting: boolean;
}

interface Client {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
}

interface SalesRep {
  id: string;
  name: string;
}

const OfferForm: React.FC<OfferFormProps> = ({ initialData, onSubmit, isSubmitting }) => {
  const [validFrom, setValidFrom] = useState<Date | undefined>(
    initialData?.validFrom ? new Date(initialData.validFrom) : new Date()
  );
  const [validUntil, setValidUntil] = useState<Date | undefined>(
    initialData?.validUntil ? new Date(initialData.validUntil) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
  );
  
  const [clients, setClients] = useState<Client[]>([]);
  const [salesReps, setSalesReps] = useState<SalesRep[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formReady, setFormReady] = useState(false);
  
  const { register, handleSubmit, formState: { errors }, setValue } = useForm({
    defaultValues: initialData || {
      title: '',
      description: '',
      clientId: '',
      salesRepresentative: '',
      amount: '',
      status: OfferStatus.DRAFT,
      notes: '',
    },
  });
  
  useEffect(() => {
    // Set dates in the form whenever they change
    if (validFrom) {
      setValue('validFrom', validFrom);
    }
    
    if (validUntil) {
      setValue('validUntil', validUntil);
    }
  }, [validFrom, validUntil, setValue]);
  
  useEffect(() => {
    // Fetch clients and sales reps
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Fetch clients from API
        const clientsResponse = await fetch('/api/data/clients');
        if (!clientsResponse.ok) {
          throw new Error(`Failed to fetch clients: ${clientsResponse.statusText}`);
        }
        const clientsData = await clientsResponse.json();
        setClients(clientsData);
        
        // Fetch sales reps from API
        const salesRepsResponse = await fetch('/api/data/sales-reps');
        if (!salesRepsResponse.ok) {
          throw new Error(`Failed to fetch sales representatives: ${salesRepsResponse.statusText}`);
        }
        const salesRepsData = await salesRepsResponse.json();
        setSalesReps(salesRepsData);

        // Set default values if data is available and no initial data is provided
        if (!initialData && clientsData.length > 0 && salesRepsData.length > 0) {
          setValue('clientId', clientsData[0]._id);
          setValue('salesRepresentative', salesRepsData[0].name);
        }
        
        setFormReady(true);
      } catch (err: any) {
        console.error('Error fetching form data:', err);
        setError(err.message || 'Failed to fetch data');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [initialData, setValue]);
  
  const handleFormSubmit = (data: any) => {
    const formattedData = {
      ...data,
      amount: parseFloat(data.amount),
      validFrom,
      validUntil,
    };
    
    console.log('Form data to be submitted:', formattedData);
    onSubmit(formattedData);
  };
  
  if (isLoading) {
    return <LoadingSpinner />;
  }
  
  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-500 rounded-md">
        <h3 className="font-bold">Error Loading Form Data</h3>
        <p>{error}</p>
        <Button className="mt-2" onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    );
  }
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{initialData ? 'Update Offer' : 'Create New Offer'}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Offer Title</label>
              <Input
                {...register('title', { required: 'Title is required' })}
                placeholder="Enter offer title"
                className={errors.title ? 'border-red-500' : ''}
              />
              {errors.title && (
                <p className="text-xs text-red-500">{errors.title.message as string}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Client <span className="text-red-500">*</span></label>
              <Select
                onValueChange={(value) => setValue('clientId', value)}
                defaultValue={initialData?.clientId?._id || initialData?.clientId || (clients.length > 0 ? clients[0]._id : undefined)}
                required
              >
                <SelectTrigger className={errors.clientId ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select a client" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((client) => (
                    <SelectItem key={client._id} value={client._id}>
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.clientId && (
                <p className="text-xs text-red-500">{errors.clientId.message as string}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Sales Representative <span className="text-red-500">*</span></label>
              <Select
                onValueChange={(value) => setValue('salesRepresentative', value)}
                defaultValue={initialData?.salesRepresentative || (salesReps.length > 0 ? salesReps[0].name : undefined)}
                required
              >
                <SelectTrigger className={errors.salesRepresentative ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select a sales rep" />
                </SelectTrigger>
                <SelectContent>
                  {salesReps.map((rep) => (
                    <SelectItem key={rep.id} value={rep.name}>
                      {rep.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.salesRepresentative && (
                <p className="text-xs text-red-500">{errors.salesRepresentative.message as string}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Amount ($)</label>
              <Input
                {...register('amount', { 
                  required: 'Amount is required',
                  pattern: {
                    value: /^[0-9]+(\.[0-9]{1,2})?$/,
                    message: 'Please enter a valid amount'
                  }
                })}
                type="number"
                step="0.01"
                placeholder="0.00"
                className={errors.amount ? 'border-red-500' : ''}
              />
              {errors.amount && (
                <p className="text-xs text-red-500">{errors.amount.message as string}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Valid From</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={`w-full justify-start text-left font-normal ${
                      errors.validFrom ? 'border-red-500' : ''
                    }`}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {validFrom ? format(validFrom, 'PPP') : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={validFrom} onSelect={setValidFrom} />
                </PopoverContent>
              </Popover>
              {errors.validFrom && (
                <p className="text-xs text-red-500">{errors.validFrom.message as string}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Valid Until</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={`w-full justify-start text-left font-normal ${
                      errors.validUntil ? 'border-red-500' : ''
                    }`}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {validUntil ? format(validUntil, 'PPP') : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={validUntil} onSelect={setValidUntil} />
                </PopoverContent>
              </Popover>
              {errors.validUntil && (
                <p className="text-xs text-red-500">{errors.validUntil.message as string}</p>
              )}
            </div>
            
            {initialData && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select
                  onValueChange={(value) => setValue('status', value)}
                  defaultValue={initialData?.status}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(OfferStatus).map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <Textarea
              {...register('description', { required: 'Description is required' })}
              placeholder="Enter offer description"
              className={`min-h-[100px] ${errors.description ? 'border-red-500' : ''}`}
            />
            {errors.description && (
              <p className="text-xs text-red-500">{errors.description.message as string}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Notes</label>
            <Textarea
              {...register('notes')}
              placeholder="Enter additional notes (optional)"
              className="min-h-[100px]"
            />
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button variant="outline" type="button" onClick={() => window.history.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting || !formReady}>
            {isSubmitting ? 'Saving...' : initialData ? 'Update Offer' : 'Create Offer'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default OfferForm;