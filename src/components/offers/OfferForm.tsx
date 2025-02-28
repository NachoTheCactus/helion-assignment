import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../store/hooks';
import { createOffer, updateOffer } from '../../store/slices/offerSlice';
import { Offer, OfferStatus, Client, SalesRepresentative } from '../../types';
import { Button } from '../../components/ui/button';
import { format} from 'date-fns';

interface OfferFormProps {
  initialData?: Offer;
  isEditing?: boolean;
}

// Mock data for clients and sales representatives
const MOCK_CLIENTS: Client[] = [
  { id: '1', name: 'Acme Corp', email: 'info@acme.com', phone: '123-456-7890', company: 'Acme Corporation' },
  { id: '2', name: 'Globex', email: 'contact@globex.com', phone: '987-654-3210', company: 'Globex International' },
  { id: '3', name: 'Initech', email: 'sales@initech.com', phone: '555-123-4567', company: 'Initech Industries' },
];

const MOCK_SALES_REPS: SalesRepresentative[] = [
  { id: '1', name: 'John Doe', email: 'john.doe@helion.com' },
  { id: '2', name: 'Jane Smith', email: 'jane.smith@helion.com' },
  { id: '3', name: 'Bob Johnson', email: 'bob.johnson@helion.com' },
];

// Helper function to format date for input field (YYYY-MM-DD)
const formatDateForInput = (dateString: string): string => {
  const date = new Date(dateString);
  return format(date, 'yyyy-MM-dd');
};

const OfferForm: React.FC<OfferFormProps> = ({ initialData, isEditing = false }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<Partial<Offer>>({
    title: '',
    description: '',
    client: MOCK_CLIENTS[0],
    salesRepresentative: MOCK_SALES_REPS[0],
    validFrom: new Date().toISOString().split('T')[0],
    validTo: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    price: 0,
    status: 'Draft' as OfferStatus,
    notes: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        validFrom: formatDateForInput(initialData.validFrom),
        validTo: formatDateForInput(initialData.validTo),
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

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remove any leading zeros and convert to number
    const rawValue = e.target.value;
    const numericValue = rawValue ? Number(rawValue) : 0;
    
    setFormData((prev) => ({
      ...prev,
      price: numericValue,
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

  const handleSalesRepChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const repId = e.target.value;
    const selectedRep = MOCK_SALES_REPS.find((rep) => rep.id === repId);
    if (selectedRep) {
      setFormData((prev) => ({
        ...prev,
        salesRepresentative: selectedRep,
      }));
    }
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const status = e.target.value as OfferStatus;
    setFormData((prev) => ({
      ...prev,
      status,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isEditing && initialData) {
      dispatch(updateOffer({
        id: initialData.id,
        offer: formData,
      }));
    } else {
      dispatch(createOffer(formData as Omit<Offer, 'id' | 'createdAt' | 'updatedAt'>));
    }
    
    navigate('/offers');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="title" className="block text-sm font-medium">
            Offer Title
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
          <label htmlFor="salesRepresentative" className="block text-sm font-medium">
            Sales Representative
          </label>
          <select
            id="salesRepresentative"
            name="salesRepresentative"
            required
            value={formData.salesRepresentative?.id}
            onChange={handleSalesRepChange}
            className="w-full p-2 border rounded-md"
          >
            {MOCK_SALES_REPS.map((rep) => (
              <option key={rep.id} value={rep.id}>
                {rep.name}
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
            <option value="Sent">Sent</option>
            <option value="Accepted">Accepted</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="validFrom" className="block text-sm font-medium">
            Valid From
          </label>
          <input
            id="validFrom"
            name="validFrom"
            type="date"
            required
            value={formData.validFrom}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="validTo" className="block text-sm font-medium">
            Valid To
          </label>
          <input
            id="validTo"
            name="validTo"
            type="date"
            required
            value={formData.validTo}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="price" className="block text-sm font-medium">
            Price (RON)
          </label>
          <input
            id="price"
            name="price"
            type="number"
            required
            min="0"
            step="0.01"
            value={formData.price}
            onChange={handlePriceChange}
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
          {isEditing ? 'Update Offer' : 'Create Offer'}
        </Button>
        <Button type="button" variant="outline" onClick={() => navigate('/offers')}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default OfferForm;