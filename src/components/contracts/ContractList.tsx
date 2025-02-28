import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { deleteContract, closeContract } from '../../store/slices/contractSlice';
import { Contract, ContractStatus } from '../../types';
import { Button } from '../../components/ui/button';
import { formatPriceWithCurrency, formatDateRomanian } from '../../utils/formatting';
import type { RootState } from '../../store';

const ContractList = () => {
  const dispatch = useAppDispatch();
  const contracts = useAppSelector((state: RootState) => state.contracts.contracts);
  
  const [filteredContracts, setFilteredContracts] = useState<Contract[]>(contracts);
  const [statusFilter, setStatusFilter] = useState<ContractStatus | 'All'>('All');
  const [clientFilter, setClientFilter] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const contractsPerPage = 10;

  useEffect(() => {
    let result = [...contracts];
    
    if (statusFilter !== 'All') {
      result = result.filter((contract) => contract.status === statusFilter);
    }
    
    if (clientFilter) {
      result = result.filter((contract) => 
        contract.client.name.toLowerCase().includes(clientFilter.toLowerCase()) ||
        contract.client.company.toLowerCase().includes(clientFilter.toLowerCase())
      );
    }
    
    setFilteredContracts(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [contracts, statusFilter, clientFilter]);

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this contract?')) {
      dispatch(deleteContract(id));
    }
  };

  const handleCloseContract = (id: string) => {
    if (window.confirm('Are you sure you want to close this contract?')) {
      dispatch(closeContract(id));
      alert('Contract successfully closed!');
    }
  };

  // Pagination
  const indexOfLastContract = currentPage * contractsPerPage;
  const indexOfFirstContract = indexOfLastContract - contractsPerPage;
  const currentContracts = filteredContracts.slice(indexOfFirstContract, indexOfLastContract);
  const totalPages = Math.ceil(filteredContracts.length / contractsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Contract Management</h1>
        <Link to="/contracts/create">
          <Button>Create New Contract</Button>
        </Link>
      </div>
      
      {/* Filters */}
      <div className="bg-muted p-4 rounded-md grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="statusFilter" className="block text-sm font-medium mb-1">
            Filter by Status
          </label>
          <select
            id="statusFilter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as ContractStatus | 'All')}
            className="w-full p-2 border rounded-md"
          >
            <option value="All">All Statuses</option>
            <option value="Draft">Draft</option>
            <option value="Active">Active</option>
            <option value="Suspended">Suspended</option>
            <option value="Terminated">Terminated</option>
            <option value="Completed">Completed</option>
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
      
      {/* Contracts Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="bg-muted">
            <tr>
              <th className="text-left p-2 border">Title</th>
              <th className="text-left p-2 border">Client</th>
              <th className="text-left p-2 border">Duration</th>
              <th className="text-left p-2 border">Value</th>
              <th className="text-left p-2 border">Status</th>
              <th className="text-left p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentContracts.length > 0 ? (
              currentContracts.map((contract) => (
                <tr key={contract.id} className="hover:bg-muted/50">
                  <td className="p-2 border">{contract.title}</td>
                  <td className="p-2 border">{contract.client.name} ({contract.client.company})</td>
                  <td className="p-2 border">
                    {formatDateRomanian(contract.startDate)} - {formatDateRomanian(contract.endDate)}
                  </td>
                  <td className="p-2 border">{formatPriceWithCurrency(contract.totalValue)}</td>
                  <td className="p-2 border">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      contract.status === 'Draft' ? 'bg-gray-200' :
                      contract.status === 'Active' ? 'bg-green-100 text-green-800' :
                      contract.status === 'Suspended' ? 'bg-yellow-100 text-yellow-800' :
                      contract.status === 'Terminated' ? 'bg-red-100 text-red-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {contract.status}
                    </span>
                  </td>
                  <td className="p-2 border">
                    <div className="flex space-x-2">
                      <Link to={`/contracts/${contract.id}`}>
                        <Button variant="outline" size="sm">Edit</Button>
                      </Link>
                      {contract.status !== 'Completed' && contract.status !== 'Terminated' && (
                        <Button 
                          variant="secondary" 
                          size="sm" 
                          onClick={() => handleCloseContract(contract.id)}
                        >
                          Close
                        </Button>
                      )}
                      {(contract.status === 'Draft' || contract.status === 'Completed' || contract.status === 'Terminated') && (
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          onClick={() => handleDelete(contract.id)}
                        >
                          Delete
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="p-4 text-center">
                  No contracts found. Create a new contract to get started.
                </td>
              </tr>
            )}
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

export default ContractList;