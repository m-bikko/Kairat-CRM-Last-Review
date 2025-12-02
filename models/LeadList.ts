import mongoose, { Schema, models } from 'mongoose';

export interface ILeadList {
  _id?: string;
  name: string;
  description?: string;
  leadIds: string[];
  tags?: string[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

const leadListSchema = new Schema<ILeadList>(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    leadIds: [{
      type: String,
    }],
    tags: [{
      type: String,
    }],
    createdBy: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const LeadList = models.LeadList || mongoose.model<ILeadList>('LeadList', leadListSchema);

export default LeadList;
