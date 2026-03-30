import mongoose, { Schema, Document } from 'mongoose';
import { CommunityStatus } from '../types';

export interface ICommunity extends Document {
  communityName: string;
  address: string;
  adminId: mongoose.Types.ObjectId;
  status: CommunityStatus;
  paymentCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const communitySchema = new Schema<ICommunity>(
  {
    communityName: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    adminId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: Object.values(CommunityStatus), default: CommunityStatus.PENDING },
    paymentCompleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

communitySchema.index({ adminId: 1 });

export const Community = mongoose.model<ICommunity>('Community', communitySchema);
