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
import { ContractStatus } from '@/types/contract';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface ContractFormProps {
  initialData?: any;
  onSubmit: (data: any) => void;
  isSubmitting: boolean;
  fromOffer?: boolean;
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

const ContractForm: React.FC<ContractFormProps> = ({ 
  initialData, 
  onSubmit, 
  isSubmitting,
  fromOffer = false
}) => {
  const [startDate, setStartDate] = useState<Date | undefined>(
    initialData?.startDate ? new Date(initialData.startDate) : new Date()
  );
  const [endDate, setEndDate] = useState<Date | undefined>(
    initialData?.endDate 
      ? new Date(initialData.endDate) 
      : new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) // 90 days from now
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
      responsiblePerson: '',
      paymentTerms: 'Net 30',
      amount: '',
      status: ContractStatus.ACTIVE,
      notes: '',
    },
  });
  
  useEffect(() => {
    // Set dates in the form whenever they change
    if (startDate) {
      setValue('startDate', startDate);
    }
    
    if (endDate) {
      setValue('endDate', endDate);
    }
  }, [startDate, endDate, setValue]);
  
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
        
        // Set default values if no initial data is provided and not from offer
        if (!initialData && !fromOffer && clientsData.length > 0 && salesRepsData.length > 0) {
          setValue('clientId', clientsData[0]._id);
          setValue('responsiblePerson', salesRepsData[0].name);
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
  }, [initialData, fromOffer, setValue]);
  
  const handleFormSubmit = (data: any) => {
    const formattedData = {
      ...data,
      amount: parseFloat(data.amount),
      startDate,
      endDate,
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
        <CardTitle>
          {initialData ? 'Update Contract' : fromOffer ? 'Convert Offer to Contract' : 'Create New Contract'}
        </CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Contract Title</label>
              <Input
                {...register('title', { required: 'Title is required' })}
                placeholder="Enter contract title"
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
                disabled={fromOffer}
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
              <label className="text-sm font-medium">Responsible Person <span className="text-red-500">*</span></label>
              <Select
                onValueChange={(value) => setValue('responsiblePerson', value)}
                defaultValue={initialData?.responsiblePerson || (salesReps.length > 0 ? salesReps[0].name : undefined)}
                required
              >
                <SelectTrigger className={errors.responsiblePerson ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select a responsible person" />
                </SelectTrigger>
                <SelectContent>
                  {salesReps.map((rep) => (
                    <SelectItem key={rep.id} value={rep.name}>
                      {rep.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.responsiblePerson && (
                <p className="text-xs text-red-500">{errors.responsiblePerson.message as string}</p>
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
              <label className="text-sm font-medium">Start Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={`w-full justify-start text-left font-normal ${
                      errors.startDate ? 'border-red-500' : ''
                    }`}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, 'PPP') : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={startDate} onSelect={setStartDate} />
                </PopoverContent>
              </Popover>
              {errors.startDate && (
                <p className="text-xs text-red-500">{errors.startDate.message as string}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">End Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={`w-full justify-start text-left font-normal ${
                      errors.endDate ? 'border-red-500' : ''
                    }`}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, 'PPP') : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={endDate} onSelect={setEndDate} />
                </PopoverContent>
              </Popover>
              {errors.endDate && (
                <p className="text-xs text-red-500">{errors.endDate.message as string}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Payment Terms</label>
              <Select
                onValueChange={(value) => setValue('paymentTerms', value)}
                defaultValue={initialData?.paymentTerms || 'Net 30'}
              >
                <SelectTrigger className={errors.paymentTerms ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select payment terms" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Net 15">Net 15</SelectItem>
                  <SelectItem value="Net 30">Net 30</SelectItem>
                  <SelectItem value="Net 45">Net 45</SelectItem>
                  <SelectItem value="Net 60">Net 60</SelectItem>
                  <SelectItem value="Payment in advance">Payment in advance</SelectItem>
                </SelectContent>
              </Select>
              {errors.paymentTerms && (
                <p className="text-xs text-red-500">{errors.paymentTerms.message as string}</p>
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
                    {Object.values(ContractStatus).map((status) => (
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
              placeholder="Enter contract description"
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
            {isSubmitting ? 'Saving...' : initialData ? 'Update Contract' : 'Create Contract'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default ContractForm;