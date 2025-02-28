import { Link } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';
import { Button } from '../components/ui/button';
import { formatPriceWithCurrency, formatDateRomanian } from '../utils/formatting';
import type { RootState } from '../store';

const Dashboard = () => {
  const offers = useAppSelector((state: RootState) => state.offers.offers);
  const contracts = useAppSelector((state: RootState) => state.contracts.contracts);
  
  // Calculate statistics
  const totalOffers = offers.length;
  const pendingOffers = offers.filter(offer => offer.status === 'Sent').length;
  const acceptedOffers = offers.filter(offer => offer.status === 'Accepted').length;
  
  const totalContracts = contracts.length;
  const activeContracts = contracts.filter(contract => contract.status === 'Active').length;
  const completedContracts = contracts.filter(contract => contract.status === 'Completed').length;
  
  const totalContractValue = contracts
    .filter(contract => contract.status !== 'Terminated')
    .reduce((sum, contract) => sum + contract.totalValue, 0);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Offer Stats */}
        <div className="bg-card rounded-lg shadow-sm p-6 border border-border">
          <h2 className="text-lg font-medium mb-4">Offers</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Total Offers:</span>
              <span className="font-semibold">{totalOffers}</span>
            </div>
            <div className="flex justify-between">
              <span>Pending:</span>
              <span className="font-semibold">{pendingOffers}</span>
            </div>
            <div className="flex justify-between">
              <span>Accepted:</span>
              <span className="font-semibold">{acceptedOffers}</span>
            </div>
          </div>
          <div className="mt-4">
            <Link to="/offers">
              <Button variant="outline" className="w-full">View Offers</Button>
            </Link>
          </div>
        </div>
        
        {/* Contract Stats */}
        <div className="bg-card rounded-lg shadow-sm p-6 border border-border">
          <h2 className="text-lg font-medium mb-4">Contracts</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Total Contracts:</span>
              <span className="font-semibold">{totalContracts}</span>
            </div>
            <div className="flex justify-between">
              <span>Active:</span>
              <span className="font-semibold">{activeContracts}</span>
            </div>
            <div className="flex justify-between">
              <span>Completed:</span>
              <span className="font-semibold">{completedContracts}</span>
            </div>
          </div>
          <div className="mt-4">
            <Link to="/contracts">
              <Button variant="outline" className="w-full">View Contracts</Button>
            </Link>
          </div>
        </div>
        
        {/* Value Stats */}
        <div className="bg-card rounded-lg shadow-sm p-6 border border-border">
          <h2 className="text-lg font-medium mb-4">Contract Value</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Total Value:</span>
              <span className="font-semibold">{formatPriceWithCurrency(totalContractValue)}</span>
            </div>
            <div className="flex justify-between">
              <span>Avg. per Contract:</span>
              <span className="font-semibold">
                {totalContracts ? formatPriceWithCurrency(Math.round(totalContractValue / totalContracts)) : '0 RON'}
              </span>
            </div>
          </div>
        </div>
        
        {/* Quick Actions */}
        <div className="bg-card rounded-lg shadow-sm p-6 border border-border">
          <h2 className="text-lg font-medium mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link to="/offers/create">
              <Button variant="default" className="w-full">Create New Offer</Button>
            </Link>
            <Link to="/contracts/create">
              <Button variant="outline" className="w-full">Create New Contract</Button>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Recent Activity Section */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <div className="bg-card rounded-lg shadow-sm overflow-hidden border border-border">
          {offers.length > 0 || contracts.length > 0 ? (
            <div className="divide-y">
              {/* Display the 5 most recent offers and contracts combined */}
              {[...offers, ...contracts]
                .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
                .slice(0, 5)
                .map((item) => {
                  const isOffer = 'salesRepresentative' in item;
                  return (
                    <div key={item.id} className="p-4 hover:bg-muted/50">
                      <div className="flex justify-between">
                        <div>
                          <div className="font-medium">{item.title}</div>
                          <div className="text-sm text-muted-foreground">
                            {isOffer ? 'Offer' : 'Contract'} - {item.client.name}
                          </div>
                        </div>
                        <div className="text-right">
                          <div>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              isOffer 
                                ? item.status === 'Draft' ? 'bg-gray-200' :
                                  item.status === 'Sent' ? 'bg-blue-100 text-blue-800' :
                                  item.status === 'Accepted' ? 'bg-green-100 text-green-800' : 
                                  'bg-red-100 text-red-800'
                                : item.status === 'Draft' ? 'bg-gray-200' :
                                  item.status === 'Active' ? 'bg-green-100 text-green-800' :
                                  item.status === 'Suspended' ? 'bg-yellow-100 text-yellow-800' :
                                  item.status === 'Completed' ? 'bg-blue-100 text-blue-800' :
                                  'bg-red-100 text-red-800'
                            }`}>
                              {item.status}
                            </span>
                          </div>
                          <div className="text-sm text-muted-foreground mt-1">
                            Updated: {formatDateRomanian(item.updatedAt)}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          ) : (
            <div className="p-6 text-center text-muted-foreground">
              No recent activity. Create offers or contracts to get started.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;