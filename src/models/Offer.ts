import mongoose, { Schema, Document } from 'mongoose';
import { IClient } from './Client';
import { ISalesRepresentative } from './SalesRepresentative';

export type OfferStatus = 'Draft' | 'Sent' | 'Accepted' | 'Rejected';

export interface IOffer extends Document {
  title: string;
  description: string;
  client: mongoose.Types.ObjectId | IClient;
  salesRepresentative: mongoose.Types.ObjectId | ISalesRepresentative;
  validFrom: Date;
  validTo: Date;
  price: number;
  status: OfferStatus;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

const OfferSchema: Schema = new Schema(
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
    salesRepresentative: { 
      type: Schema.Types.ObjectId, 
      ref: 'SalesRepresentative',
      required: true
    },
    validFrom: { 
      type: Date, 
      required: true 
    },
    validTo: { 
      type: Date, 
      required: true 
    },
    price: { 
      type: Number, 
      required: true,
      min: 0
    },
    status: { 
      type: String, 
      required: true,
      enum: ['Draft', 'Sent', 'Accepted', 'Rejected'],
      default: 'Draft'
    },
    notes: { 
      type: String, 
      default: '' 
    }
  },
  { 
    timestamps: true 
  }
);

export default mongoose.model<IOffer>('Offer', OfferSchema);