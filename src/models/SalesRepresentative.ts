import mongoose, { Schema, Document } from 'mongoose';

export interface ISalesRepresentative extends Document {
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

const SalesRepresentativeSchema: Schema = new Schema(
  {
    name: { 
      type: String, 
      required: true 
    },
    email: { 
      type: String, 
      required: true,
      unique: true
    }
  },
  { 
    timestamps: true 
  }
);

export default mongoose.model<ISalesRepresentative>('SalesRepresentative', SalesRepresentativeSchema);