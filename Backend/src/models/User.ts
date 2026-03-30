import mongoose, { Schema, Document } from 'mongoose';
import { Role, UserStatus } from '../types';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: Role;
  flatNumber?: string;
  communityId?: mongoose.Types.ObjectId;
  status: UserStatus;
  refreshToken?: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, enum: Object.values(Role), required: true },
    flatNumber: { type: String, trim: true },
    communityId: { type: Schema.Types.ObjectId, ref: 'Community', index: true },
    status: { type: String, enum: Object.values(UserStatus), default: UserStatus.PENDING },
    refreshToken: { type: String },
  },
  { timestamps: true }
);

userSchema.index({ communityId: 1, status: 1 });

export const User = mongoose.model<IUser>('User', userSchema);
