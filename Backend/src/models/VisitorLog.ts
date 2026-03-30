import mongoose, { Schema, Document } from 'mongoose';
import { VisitorType } from '../types';

export interface IVisitorLog extends Document {
  visitorName: string;
  visitorType: VisitorType;
  codeUsed: string;
  entryTime: Date;
  exitTime?: Date;
  communityId: mongoose.Types.ObjectId;
  verifiedBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const visitorLogSchema = new Schema<IVisitorLog>(
  {
    visitorName: { type: String, required: true, trim: true },
    visitorType: { type: String, enum: Object.values(VisitorType), required: true },
    codeUsed: { type: String, required: true },
    entryTime: { type: Date, required: true, default: Date.now },
    exitTime: { type: Date },
    communityId: { type: Schema.Types.ObjectId, ref: 'Community', required: true, index: true },
    verifiedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

visitorLogSchema.index({ communityId: 1, entryTime: -1 });

export const VisitorLog = mongoose.model<IVisitorLog>('VisitorLog', visitorLogSchema);
