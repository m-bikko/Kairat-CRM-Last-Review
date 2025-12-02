import mongoose, { Schema, models } from 'mongoose';

export interface ITransaction {
  _id?: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category?: string;
  date: Date;
  status: 'completed' | 'pending' | 'cancelled';
  reference?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const transactionSchema = new Schema<ITransaction>(
  {
    description: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      enum: ['income', 'expense'],
      required: true,
    },
    category: {
      type: String,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ['completed', 'pending', 'cancelled'],
      default: 'pending',
    },
    reference: {
      type: String,
    },
    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Transaction = models.Transaction || mongoose.model<ITransaction>('Transaction', transactionSchema);

export default Transaction;
