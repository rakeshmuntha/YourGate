import mongoose, { Schema, Document } from 'mongoose';
import { VisitorType, AccessCodeStatus } from '../types';

export interface IAccessCode extends Document {
  code: string;
  type: VisitorType;
  generatedBy: mongoose.Types.ObjectId;
  communityId: mongoose.Types.ObjectId;
  expiresAt: Date;
  usageLimit: number;
  usedCount: number;
  status: AccessCodeStatus;
  createdAt: Date;
  updatedAt: Date;
}

const accessCodeSchema = new Schema<IAccessCode>(
  {
    code: { type: String, required: true, unique: true },
    type: { type: String, enum: Object.values(VisitorType), required: true },
    generatedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    communityId: { type: Schema.Types.ObjectId, ref: 'Community', required: true, index: true },
    expiresAt: { type: Date, required: true },
    usageLimit: { type: Number, required: true, default: 1 },
    usedCount: { type: Number, default: 0 },
    status: { type: String, enum: Object.values(AccessCodeStatus), default: AccessCodeStatus.ACTIVE },
  },
  { timestamps: true }
);

accessCodeSchema.index({ code: 1 });
accessCodeSchema.index({ generatedBy: 1 });

export const AccessCode = mongoose.model<IAccessCode>('AccessCode', accessCodeSchema);
