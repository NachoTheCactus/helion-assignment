import React from 'react';
import { OfferStatus } from '@/types/offer';
import { ContractStatus } from '@/types/contract';

interface StatusBadgeProps {
  status: OfferStatus | ContractStatus;
  type: 'offer' | 'contract';
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, type }) => {
  let color = '';
  
  if (type === 'offer') {
    switch (status) {
      case OfferStatus.DRAFT:
        color = 'bg-gray-100 text-gray-800';
        break;
      case OfferStatus.SENT:
        color = 'bg-blue-100 text-blue-800';
        break;
      case OfferStatus.ACCEPTED:
        color = 'bg-green-100 text-green-800';
        break;
      case OfferStatus.REJECTED:
        color = 'bg-red-100 text-red-800';
        break;
    }
  } else {
    switch (status) {
      case ContractStatus.ACTIVE:
        color = 'bg-green-100 text-green-800';
        break;
      case ContractStatus.SUSPENDED:
        color = 'bg-yellow-100 text-yellow-800';
        break;
      case ContractStatus.TERMINATED:
        color = 'bg-red-100 text-red-800';
        break;
      case ContractStatus.COMPLETED:
        color = 'bg-purple-100 text-purple-800';
        break;
    }
  }
  
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${color}`}>
      {status}
    </span>
  );
};

export default StatusBadge;