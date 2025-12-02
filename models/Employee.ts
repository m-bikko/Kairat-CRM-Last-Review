import mongoose, { Schema, models } from 'mongoose';

export interface IEmployee {
  _id?: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  department?: string;
  location?: string;
  status: 'active' | 'on_leave' | 'terminated';
  salary?: number;
  hireDate?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const employeeSchema = new Schema<IEmployee>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
    },
    role: {
      type: String,
      required: true,
    },
    department: {
      type: String,
    },
    location: {
      type: String,
    },
    status: {
      type: String,
      enum: ['active', 'on_leave', 'terminated'],
      default: 'active',
    },
    salary: {
      type: Number,
    },
    hireDate: {
      type: Date,
    },
    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Employee = models.Employee || mongoose.model<IEmployee>('Employee', employeeSchema);

export default Employee;
