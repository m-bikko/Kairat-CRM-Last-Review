import mongoose, { Document, Model, Schema } from 'mongoose';

export interface ISettings extends Document {
  userId: string;
  profile: {
    firstName: string;
    lastName: string;
    email: string;
    bio: string;
    avatar?: string;
  };
  notifications: {
    emailNotifications: boolean;
    pushNotifications: boolean;
    leadUpdates: boolean;
    teamMentions: boolean;
  };
  appearance: {
    theme: 'light' | 'dark' | 'system';
    accentColor: string;
  };
  language: string;
  createdAt: Date;
  updatedAt: Date;
}

const SettingsSchema = new Schema<ISettings>(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
    },
    profile: {
      firstName: { type: String, default: '' },
      lastName: { type: String, default: '' },
      email: { type: String, default: '' },
      bio: { type: String, default: '' },
      avatar: { type: String },
    },
    notifications: {
      emailNotifications: { type: Boolean, default: true },
      pushNotifications: { type: Boolean, default: true },
      leadUpdates: { type: Boolean, default: true },
      teamMentions: { type: Boolean, default: true },
    },
    appearance: {
      theme: { type: String, enum: ['light', 'dark', 'system'], default: 'light' },
      accentColor: { type: String, default: '#6366f1' },
    },
    language: { type: String, default: 'en' },
  },
  {
    timestamps: true,
  }
);

const Settings: Model<ISettings> =
  mongoose.models.Settings || mongoose.model<ISettings>('Settings', SettingsSchema);

export default Settings;
