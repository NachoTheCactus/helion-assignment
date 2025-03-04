import mongoose, { Document, Schema } from 'mongoose';

export enum ContractStatus {
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
  TERMINATED = 'terminated',
  COMPLETED = 'completed'
}

export interface IContract extends Document {
  title: string;
  description: string;
  clientId: mongoose.Types.ObjectId;
  offerId?: mongoose.Types.ObjectId;
  responsiblePerson: string;
  startDate: Date;
  endDate: Date;
  paymentTerms: string;
  amount: number;
  status: ContractStatus;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

const ContractSchema = new Schema<IContract>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    clientId: { type: Schema.Types.ObjectId, ref: 'Client', required: true },
    offerId: { type: Schema.Types.ObjectId, ref: 'Offer' },
    responsiblePerson: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    paymentTerms: { type: String, required: true },
    amount: { type: Number, required: true },
    status: { 
      type: String, 
      enum: Object.values(ContractStatus), 
      default: ContractStatus.ACTIVE 
    },
    notes: { type: String },
  },
  { timestamps: true }
);

export const Contract = mongoose.models.Contract || mongoose.model<IContract>('Contract', ContractSchema);