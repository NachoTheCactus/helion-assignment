import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import StatusBadge from '@/components/ui/StatusBadge';
import { ContractStatus } from '@/types/contract';
import { format } from 'date-fns';

interface ContractDetailProps {
  contract: any;
  onStatusChange: (status: ContractStatus) => void;
}

const ContractDetail: React.FC<ContractDetailProps> = ({ contract, onStatusChange }) => {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [selectedStatus, setSelectedStatus] = React.useState<ContractStatus | null>(null);
  
  if (!contract) return null;
  
  const handleStatusChange = (status: ContractStatus) => {
    setSelectedStatus(status);
    setDialogOpen(true);
  };
  
  const confirmStatusChange = () => {
    if (selectedStatus) {
      onStatusChange(selectedStatus);
      setDialogOpen(false);
    }
  };
  
  return (
    <>
      <Card className="w-full">
        <CardHeader className="flex flex-row items-start justify-between space-y-0">
          <div>
            <CardTitle className="text-2xl">{contract.title}</CardTitle>
            <div className="mt-1">
              <StatusBadge status={contract.status} type="contract" />
            </div>
          </div>
          <div className="space-x-2">
            <Button variant="outline" onClick={() => router.push(`/contracts/${contract._id}/edit`)}>
              Edit
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Client</h3>
              <p className="mt-1">{contract.clientId?.name || 'Unknown Client'}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Responsible Person</h3>
              <p className="mt-1">{contract.responsiblePerson}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Amount</h3>
              <p className="mt-1">${contract.amount.toFixed(2)}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Duration</h3>
              <p className="mt-1">
                {format(new Date(contract.startDate), 'MMM d, yyyy')} to{' '}
                {format(new Date(contract.endDate), 'MMM d, yyyy')}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Payment Terms</h3>
              <p className="mt-1">{contract.paymentTerms}</p>
            </div>
            {contract.offerId && (
              <div>
                <h3 className="text-sm font-medium text-gray-500">Created from Offer</h3>
                <p className="mt-1">
                  <Button
                    variant="link"
                    className="p-0 h-auto"
                    onClick={() => router.push(`/offers/${contract.offerId._id}`)}
                  >
                    View Original Offer
                  </Button>
                </p>
              </div>
            )}
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500">Description</h3>
            <p className="mt-1 whitespace-pre-line">{contract.description}</p>
          </div>
          
          {contract.notes && (
            <div>
              <h3 className="text-sm font-medium text-gray-500">Notes</h3>
              <p className="mt-1 whitespace-pre-line">{contract.notes}</p>
            </div>
          )}
        </CardContent>
        
        {contract.status === ContractStatus.ACTIVE && (
          <CardFooter className="flex justify-end space-x-2">
            <Button 
              variant="outline" 
              onClick={() => handleStatusChange(ContractStatus.SUSPENDED)}
            >
              Suspend
            </Button>
            <Button 
              variant="outline"
              onClick={() => handleStatusChange(ContractStatus.TERMINATED)}
            >
              Terminate
            </Button>
            <Button 
              onClick={() => handleStatusChange(ContractStatus.COMPLETED)}
            >
              Complete
            </Button>
          </CardFooter>
        )}
        
        {contract.status === ContractStatus.SUSPENDED && (
          <CardFooter className="flex justify-end space-x-2">
            <Button 
              variant="outline"
              onClick={() => handleStatusChange(ContractStatus.TERMINATED)}
            >
              Terminate
            </Button>
            <Button 
              onClick={() => handleStatusChange(ContractStatus.ACTIVE)}
            >
              Reactivate
            </Button>
          </CardFooter>
        )}
      </Card>
      
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Status Change</DialogTitle>
            <DialogDescription>
              Are you sure you want to change the contract status to <strong>{selectedStatus}</strong>?
              This action will update the contract and may trigger workflow changes.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmStatusChange}>
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ContractDetail;