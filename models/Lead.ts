import mongoose, { Schema, models } from 'mongoose';

export interface ILead {
  _id?: string;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  value?: number;
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'won' | 'lost';
  priority: 'low' | 'medium' | 'high';
  notes?: string;
  assignedTo?: string;
  position?: number;
  createdAt: Date;
  updatedAt: Date;
}

const leadSchema = new Schema<ILead>(
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
    value: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['new', 'contacted', 'qualified', 'proposal', 'won', 'lost'],
      default: 'new',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    notes: {
      type: String,
    },
    assignedTo: {
      type: String,
    },
    position: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Lead = models.Lead || mongoose.model<ILead>('Lead', leadSchema);

export default Lead;
