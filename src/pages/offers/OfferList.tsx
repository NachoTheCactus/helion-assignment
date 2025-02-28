import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { 
  fetchOffers, 
  fetchOffersByStatus,
  deleteOfferAsync, 
  updateOfferStatusAsync 
} from '../../store/slices/offerSlice';
import { createContractFromOfferAsync } from '../../store/slices/contractSlice';
import { Offer, OfferStatus } from '../../types';
import { Button } from '../../components/ui/button';
import { formatPriceWithCurrency, formatDateRomanian } from '../../utils/formatting';
import type { RootState } from '../../store';

const OfferList = () => {
  const dispatch = useAppDispatch();
  const { offers, loading, error } = useAppSelector((state: RootState) => state.offers);
  
  const [filteredOffers, setFilteredOffers] = useState<Offer[]>(offers);
  const [statusFilter, setStatusFilter] = useState<OfferStatus | 'All'>('All');
  const [clientFilter, setClientFilter] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const offersPerPage = 10;

  // Fetch offers on component mount
  useEffect(() => {
    if (statusFilter === 'All') {
      dispatch(fetchOffers());
    } else {
      dispatch(fetchOffersByStatus(statusFilter as OfferStatus));
    }
  }, [dispatch, statusFilter]);

  // Filter offers when data changes
  useEffect(() => {
    let result = [...offers];
    
    // Status filtering is now handled by the API, but we still need to filter by client locally
    if (clientFilter) {
      result = result.filter((offer) => 
        offer.client.name.toLowerCase().includes(clientFilter.toLowerCase()) ||
        offer.client.company.toLowerCase().includes(clientFilter.toLowerCase())
      );
    }
    
    setFilteredOffers(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [offers, clientFilter]);

  // Handle status filter change
  const handleStatusFilterChange = (status: OfferStatus | 'All') => {
    setStatusFilter(status);
    if (status === 'All') {
      dispatch(fetchOffers());
    } else {
      dispatch(fetchOffersByStatus(status));
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this offer?')) {
      dispatch(deleteOfferAsync(id));
    }
  };

  const handleConvertToContract = (offer: Offer) => {
    if (window.confirm('Are you sure you want to convert this offer to a contract?')) {
      // Mark the offer as accepted using updateOfferStatusAsync
      dispatch(updateOfferStatusAsync({ id: offer.id, status: 'Accepted' }));
      
      // Create a new contract from the offer
      dispatch(createContractFromOfferAsync({
        offer: {
          title: offer.title,
          description: offer.description,
          client: offer.client,
          responsiblePerson: offer.salesRepresentative,
          startDate: offer.validFrom,
          endDate: offer.validTo,
          paymentTerms: 'Net 30', // Default payment terms
          totalValue: offer.price,
          status: 'Active',
          notes: `Created from Offer #${offer.id}. ${offer.notes}`,
        },
        offerId: offer.id,
      }));
      
      alert('Offer successfully converted to a contract!');
    }
  };

  // Pagination
  const indexOfLastOffer = currentPage * offersPerPage;
  const indexOfFirstOffer = indexOfLastOffer - offersPerPage;
  const currentOffers = filteredOffers.slice(indexOfFirstOffer, indexOfLastOffer);
  const totalPages = Math.ceil(filteredOffers.length / offersPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Offer Management</h1>
        <Link to="/offers/create">
          <Button>Create New Offer</Button>
        </Link>
      </div>
      
      {/* Error message */}
      {error && (
        <div className="bg-red-100 text-red-800 p-4 rounded-md">
          Error: {error}
        </div>
      )}
      
      {/* Loading indicator */}
      {loading && (
        <div className="text-center py-4">
          Loading offers...
        </div>
      )}
      
      {/* Filters */}
      <div className="bg-muted p-4 rounded-md grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="statusFilter" className="block text-sm font-medium mb-1">
            Filter by Status
          </label>
          <select
            id="statusFilter"
            value={statusFilter}
            onChange={(e) => handleStatusFilterChange(e.target.value as OfferStatus | 'All')}
            className="w-full p-2 border rounded-md"
          >
            <option value="All">All Statuses</option>
            <option value="Draft">Draft</option>
            <option value="Sent">Sent</option>
            <option value="Accepted">Accepted</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
        <div>
          <label htmlFor="clientFilter" className="block text-sm font-medium mb-1">
            Search by Client
          </label>
          <input
            id="clientFilter"
            type="text"
            value={clientFilter}
            onChange={(e) => setClientFilter(e.target.value)}
            placeholder="Client name or company"
            className="w-full p-2 border rounded-md"
          />
        </div>
      </div>
      
      {/* Offers Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="bg-muted">
            <tr>
              <th className="text-left p-2 border">Title</th>
              <th className="text-left p-2 border">Client</th>
              <th className="text-left p-2 border">Valid Until</th>
              <th className="text-left p-2 border">Price</th>
              <th className="text-left p-2 border">Status</th>
              <th className="text-left p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {!loading && currentOffers.length > 0 ? (
              currentOffers.map((offer) => (
                <tr key={offer.id} className="hover:bg-muted/50">
                  <td className="p-2 border">{offer.title}</td>
                  <td className="p-2 border">{offer.client.name} ({offer.client.company})</td>
                  <td className="p-2 border">{formatDateRomanian(offer.validTo)}</td>
                  <td className="p-2 border">{formatPriceWithCurrency(offer.price)}</td>
                  <td className="p-2 border">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      offer.status === 'Draft' ? 'bg-gray-200' :
                      offer.status === 'Sent' ? 'bg-blue-100 text-blue-800' :
                      offer.status === 'Accepted' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {offer.status}
                    </span>
                  </td>
                  <td className="p-2 border">
                    <div className="flex space-x-2">
                      <Link to={`/offers/${offer.id}`}>
                        <Button variant="outline" size="sm">Edit</Button>
                      </Link>
                      {offer.status !== 'Accepted' && (
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          onClick={() => handleDelete(offer.id)}
                        >
                          Delete
                        </Button>
                      )}
                      {offer.status === 'Sent' && (
                        <Button 
                          variant="secondary" 
                          size="sm" 
                          onClick={() => handleConvertToContract(offer)}
                        >
                          Convert to Contract
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : !loading && currentOffers.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-4 text-center">
                  No offers found. Create a new offer to get started.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-4">
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? 'default' : 'outline'}
                size="sm"
                onClick={() => paginate(page)}
              >
                {page}
              </Button>
            ))}
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OfferList;