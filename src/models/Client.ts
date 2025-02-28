import mongoose, { Schema, Document } from 'mongoose';

export interface IClient extends Document {
  name: string;
  email: string;
  phone: string;
  company: string;
  createdAt: Date;
  updatedAt: Date;
}

const ClientSchema: Schema = new Schema(
  {
    name: { 
      type: String, 
      required: true 
    },
    email: { 
      type: String, 
      required: true,
      unique: true
    },
    phone: { 
      type: String 
    },
    company: { 
      type: String, 
      required: true 
    }
  },
  { 
    timestamps: true 
  }
);

export default mongoose.model<IClient>('Client', ClientSchema);