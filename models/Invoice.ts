import mongoose, { Schema, models } from 'mongoose';

export interface IInvoice {
  _id?: string;
  invoiceNumber: string;
  clientName: string;
  clientEmail?: string;
  service: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue' | 'cancelled';
  dueDate: Date;
  issueDate: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const invoiceSchema = new Schema<IInvoice>(
  {
    invoiceNumber: {
      type: String,
      required: true,
      unique: true,
    },
    clientName: {
      type: String,
      required: true,
    },
    clientEmail: {
      type: String,
    },
    service: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['paid', 'pending', 'overdue', 'cancelled'],
      default: 'pending',
    },
    dueDate: {
      type: Date,
      required: true,
    },
    issueDate: {
      type: Date,
      default: Date.now,
    },
    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Invoice = models.Invoice || mongoose.model<IInvoice>('Invoice', invoiceSchema);

export default Invoice;
