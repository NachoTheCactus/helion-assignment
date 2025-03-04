import { IClientClient } from './client';
import { IOfferClient } from './offer';

export enum ContractStatus {
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
  TERMINATED = 'terminated',
  COMPLETED = 'completed'
}

export interface IContractClient {
  _id: string;
  title: string;
  description: string;
  clientId: string | IClientClient;
  offerId?: string | IOfferClient;
  responsiblePerson: string;
  startDate: string | Date;
  endDate: string | Date;
  paymentTerms: string;
  amount: number;
  status: ContractStatus;
  notes?: string;
  createdAt: string | Date;
  updatedAt: string | Date;
}