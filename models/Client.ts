import mongoose, { Schema, models } from 'mongoose';

export interface IClient {
  _id?: string;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  website?: string;
  address?: string;
  group?: string;
  status: 'active' | 'inactive' | 'prospect';
  totalValue?: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const clientSchema = new Schema<IClient>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    company: {
      type: String,
    },
    website: {
      type: String,
    },
    address: {
      type: String,
    },
    group: {
      type: String,
      default: 'ungrouped',
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'prospect'],
      default: 'prospect',
    },
    totalValue: {
      type: Number,
      default: 0,
    },
    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Client = models.Client || mongoose.model<IClient>('Client', clientSchema);

export default Client;
