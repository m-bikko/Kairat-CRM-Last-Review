import mongoose, { Schema, models } from 'mongoose';

export interface IEvent {
  _id?: string;
  title: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  allDay?: boolean;
  color?: string;
  location?: string;
  attendees?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const eventSchema = new Schema<IEvent>(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    allDay: {
      type: Boolean,
      default: false,
    },
    color: {
      type: String,
      default: 'indigo',
    },
    location: {
      type: String,
    },
    attendees: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const Event = models.Event || mongoose.model<IEvent>('Event', eventSchema);

export default Event;
