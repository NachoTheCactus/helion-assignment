// models/schemas/Offer.ts
import mongoose, { Document, Schema } from 'mongoose';

export enum OfferStatus {
  DRAFT = 'draft',
  SENT = 'sent',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected'
}

export interface IOffer extends Document {
  title: string;
  description: string;
  clientId: mongoose.Types.ObjectId;
  salesRepresentative: string;
  validFrom: Date;
  validUntil: Date;
  amount: number;
  status: OfferStatus;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

export const OfferSchema = new Schema<IOffer>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    clientId: { type: Schema.Types.ObjectId, ref: 'Client', required: true },
    salesRepresentative: { type: String, required: true },
    validFrom: { type: Date, required: true },
    validUntil: { type: Date, required: true },
    amount: { type: Number, required: true },
    status: { 
      type: String, 
      enum: Object.values(OfferStatus), 
      default: OfferStatus.DRAFT
    },
    notes: { type: String },
  },
  { timestamps: true }
);

export const Offer = mongoose.models.Offer || mongoose.model<IOffer>('Offer', OfferSchema);