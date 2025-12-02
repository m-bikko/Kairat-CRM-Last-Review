import mongoose, { Schema, models } from 'mongoose';

export interface ITask {
  _id?: string;
  title: string;
  description?: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in_progress' | 'completed';
  dueDate?: Date;
  assignee?: string;
  createdAt: Date;
  updatedAt: Date;
}

const taskSchema = new Schema<ITask>(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    priority: {
      type: String,
      enum: ['high', 'medium', 'low'],
      default: 'medium',
    },
    status: {
      type: String,
      enum: ['pending', 'in_progress', 'completed'],
      default: 'pending',
    },
    dueDate: {
      type: Date,
    },
    assignee: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Task = models.Task || mongoose.model<ITask>('Task', taskSchema);

export default Task;
