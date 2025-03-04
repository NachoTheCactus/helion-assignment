import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import StatusBadge from '@/components/ui/StatusBadge';
import { OfferStatus } from '@/types/offer';
import { format } from 'date-fns';

interface OfferDetailProps {
    offer: any;
    onStatusChange: (status: OfferStatus) => void;
    onConvertToContract: () => void;
  }
  
  const OfferDetail: React.FC<OfferDetailProps> = ({ offer, onStatusChange, onConvertToContract }) => {
    const router = useRouter();
    
    if (!offer) return null;
    
    return (
      <Card className="w-full">
        <CardHeader className="flex flex-row items-start justify-between space-y-0">
          <div>
            <CardTitle className="text-2xl">{offer.title}</CardTitle>
            <div className="mt-1">
              <StatusBadge status={offer.status} type="offer" />
            </div>
          </div>
          <div className="space-x-2">
            <Button variant="outline" onClick={() => router.push(`/offers/${offer._id}/edit`)}>
              Edit
            </Button>
            {offer.status === OfferStatus.ACCEPTED && (
              <Button onClick={onConvertToContract}>
                Convert to Contract
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Client</h3>
              <p className="mt-1">{offer.clientId?.name || 'Unknown Client'}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Sales Representative</h3>
              <p className="mt-1">{offer.salesRepresentative}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Amount</h3>
              <p className="mt-1">${offer.amount.toFixed(2)}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Validity</h3>
              <p className="mt-1">
                {format(new Date(offer.validFrom), 'MMM d, yyyy')} to{' '}
                {format(new Date(offer.validUntil), 'MMM d, yyyy')}
              </p>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500">Description</h3>
            <p className="mt-1 whitespace-pre-line">{offer.description}</p>
          </div>
          
          {offer.notes && (
            <div>
              <h3 className="text-sm font-medium text-gray-500">Notes</h3>
              <p className="mt-1 whitespace-pre-line">{offer.notes}</p>
            </div>
          )}
        </CardContent>
        
        {offer.status !== OfferStatus.ACCEPTED && offer.status !== OfferStatus.REJECTED && (
          <CardFooter className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => onStatusChange(OfferStatus.REJECTED)}>
              Reject
            </Button>
            <Button onClick={() => onStatusChange(OfferStatus.ACCEPTED)}>
              Accept
            </Button>
          </CardFooter>
        )}
      </Card>
    );
  };
  
  export default OfferDetail;