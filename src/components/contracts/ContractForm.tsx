import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../store/hooks';
import { createContract, updateContract } from '../../store/slices/contractSlice';
import { Contract, ContractStatus, Client, SalesRepresentative } from '../../types';
import { Button } from '../../components/ui/button';
import { format } from 'date-fns';

interface ContractFormProps {
  initialData?: Contract;
  isEditing?: boolean;
}

// Mock data for clients and responsible persons
const MOCK_CLIENTS: Client[] = [
  { id: '1', name: 'Acme Corp', email: 'info@acme.com', phone: '123-456-7890', company: 'Acme Corporation' },
  { id: '2', name: 'Globex', email: 'contact@globex.com', phone: '987-654-3210', company: 'Globex International' },
  { id: '3', name: 'Initech', email: 'sales@initech.com', phone: '555-123-4567', company: 'Initech Industries' },
];

const MOCK_RESPONSIBLE_PERSONS: SalesRepresentative[] = [
  { id: '1', name: 'John Doe', email: 'john.doe@helion.com' },
  { id: '2', name: 'Jane Smith', email: 'jane.smith@helion.com' },
  { id: '3', name: 'Bob Johnson', email: 'bob.johnson@helion.com' },
];

// Helper function to format date for input field (YYYY-MM-DD)
const formatDateForInput = (dateString: string): string => {
  const date = new Date(dateString);
  return format(date, 'yyyy-MM-dd');
};

const ContractForm: React.FC<ContractFormProps> = ({ initialData, isEditing = false }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<Partial<Contract>>({
    title: '',
    description: '',
    client: MOCK_CLIENTS[0],
    responsiblePerson: MOCK_RESPONSIBLE_PERSONS[0],
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 1 year from now
    paymentTerms: 'Net 30',
    totalValue: 0,
    status: 'Draft' as ContractStatus,
    notes: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        startDate: formatDateForInput(initialData.startDate),
        endDate: formatDateForInput(initialData.endDate),
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remove any leading zeros and convert to number
    const rawValue = e.target.value;
    const numericValue = rawValue ? Number(rawValue) : 0;
    
    setFormData((prev) => ({
      ...prev,
      totalValue: numericValue,
    }));
  };

  const handleClientChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const clientId = e.target.value;
    const selectedClient = MOCK_CLIENTS.find((client) => client.id === clientId);
    if (selectedClient) {
      setFormData((prev) => ({
        ...prev,
        client: selectedClient,
      }));
    }
  };

  const handleResponsiblePersonChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const personId = e.target.value;
    const selectedPerson = MOCK_RESPONSIBLE_PERSONS.find((person) => person.id === personId);
    if (selectedPerson) {
      setFormData((prev) => ({
        ...prev,
        responsiblePerson: selectedPerson,
      }));
    }
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const status = e.target.value as ContractStatus;
    setFormData((prev) => ({
      ...prev,
      status,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isEditing && initialData) {
      dispatch(updateContract({
        id: initialData.id,
        contract: formData,
      }));
    } else {
      dispatch(createContract(formData as Omit<Contract, 'id' | 'createdAt' | 'updatedAt'>));
    }
    
    navigate('/contracts');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="title" className="block text-sm font-medium">
            Contract Title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            value={formData.title}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="client" className="block text-sm font-medium">
            Client
          </label>
          <select
            id="client"
            name="client"
            required
            value={formData.client?.id}
            onChange={handleClientChange}
            className="w-full p-2 border rounded-md"
          >
            {MOCK_CLIENTS.map((client) => (
              <option key={client.id} value={client.id}>
                {client.name} - {client.company}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="responsiblePerson" className="block text-sm font-medium">
            Responsible Person
          </label>
          <select
            id="responsiblePerson"
            name="responsiblePerson"
            required
            value={formData.responsiblePerson?.id}
            onChange={handleResponsiblePersonChange}
            className="w-full p-2 border rounded-md"
          >
            {MOCK_RESPONSIBLE_PERSONS.map((person) => (
              <option key={person.id} value={person.id}>
                {person.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="status" className="block text-sm font-medium">
            Status
          </label>
          <select
            id="status"
            name="status"
            required
            value={formData.status}
            onChange={handleStatusChange}
            className="w-full p-2 border rounded-md"
          >
            <option value="Draft">Draft</option>
            <option value="Active">Active</option>
            <option value="Suspended">Suspended</option>
            <option value="Terminated">Terminated</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="startDate" className="block text-sm font-medium">
            Start Date
          </label>
          <input
            id="startDate"
            name="startDate"
            type="date"
            required
            value={formData.startDate}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="endDate" className="block text-sm font-medium">
            End Date
          </label>
          <input
            id="endDate"
            name="endDate"
            type="date"
            required
            value={formData.endDate}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="paymentTerms" className="block text-sm font-medium">
            Payment Terms
          </label>
          <select
            id="paymentTerms"
            name="paymentTerms"
            required
            value={formData.paymentTerms}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
          >
            <option value="Net 15">Net 15</option>
            <option value="Net 30">Net 30</option>
            <option value="Net 60">Net 60</option>
            <option value="Upon Receipt">Upon Receipt</option>
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="totalValue" className="block text-sm font-medium">
            Total Value (RON)
          </label>
          <input
            id="totalValue"
            name="totalValue"
            type="number"
            required
            min="0"
            step="0.01"
            value={formData.totalValue}
            onChange={handleValueChange}
            className="w-full p-2 border rounded-md"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="description" className="block text-sm font-medium">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          required
          value={formData.description}
          onChange={handleChange}
          className="w-full p-2 border rounded-md"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="notes" className="block text-sm font-medium">
          Notes
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={3}
          value={formData.notes}
          onChange={handleChange}
          className="w-full p-2 border rounded-md"
        />
      </div>

      <div className="flex space-x-4">
        <Button type="submit">
          {isEditing ? 'Update Contract' : 'Create Contract'}
        </Button>
        <Button type="button" variant="outline" onClick={() => navigate('/contracts')}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default ContractForm;