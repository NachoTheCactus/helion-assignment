import { Types } from 'mongoose';
import { IClientClient } from './client';

export enum OfferStatus {
  DRAFT = 'draft',
  SENT = 'sent',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected'
}

export interface IOfferClient {
  _id: string;
  title: string;
  description: string;
  clientId: string | IClientClient;
  salesRepresentative: string;
  validFrom: string | Date;
  validUntil: string | Date;
  amount: number;
  status: OfferStatus;
  notes?: string;
  createdAt: string | Date;
  updatedAt: string | Date;
}
