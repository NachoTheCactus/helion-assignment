import mongoose, { Schema, Document } from 'mongoose';
import { IClient } from './Client';
import { ISalesRepresentative } from './SalesRepresentative';
import { IOffer } from './Offer';

export type ContractStatus = 'Draft' | 'Active' | 'Suspended' | 'Terminated' | 'Completed';

export interface IContract extends Document {
  title: string;
  description: string;
  client: mongoose.Types.ObjectId | IClient;
  responsiblePerson: mongoose.Types.ObjectId | ISalesRepresentative;
  startDate: Date;
  endDate: Date;
  paymentTerms: string;
  totalValue: number;
  status: ContractStatus;
  notes: string;
  relatedOffer?: mongoose.Types.ObjectId | IOffer;
  createdAt: Date;
  updatedAt: Date;
}

const ContractSchema: Schema = new Schema(
  {
    title: { 
      type: String, 
      required: true 
    },
    description: { 
      type: String, 
      required: true 
    },
    client: { 
      type: Schema.Types.ObjectId, 
      ref: 'Client',
      required: true
    },
    responsiblePerson: { 
      type: Schema.Types.ObjectId, 
      ref: 'SalesRepresentative',
      required: true
    },
    startDate: { 
      type: Date, 
      required: true 
    },
    endDate: { 
      type: Date, 
      required: true 
    },
    paymentTerms: { 
      type: String, 
      required: true 
    },
    totalValue: { 
      type: Number, 
      required: true,
      min: 0
    },
    status: { 
      type: String, 
      required: true,
      enum: ['Draft', 'Active', 'Suspended', 'Terminated', 'Completed'],
      default: 'Draft'
    },
    notes: { 
      type: String, 
      default: '' 
    },
    relatedOffer: { 
      type: Schema.Types.ObjectId, 
      ref: 'Offer' 
    }
  },
  { 
    timestamps: true 
  }
);

export default mongoose.model<IContract>('Contract', ContractSchema);