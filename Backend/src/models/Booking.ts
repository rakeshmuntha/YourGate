import mongoose, { Schema, Document } from 'mongoose';
import { BookingStatus } from '../types';

export interface IBooking extends Document {
  userId: mongoose.Types.ObjectId;
  amenityId: mongoose.Types.ObjectId;
  communityId: mongoose.Types.ObjectId;
  slotTime: string;
  date: string;
  status: BookingStatus;
  createdAt: Date;
  updatedAt: Date;
}

const bookingSchema = new Schema<IBooking>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    amenityId: { type: Schema.Types.ObjectId, ref: 'Amenity', required: true },
    communityId: { type: Schema.Types.ObjectId, ref: 'Community', required: true, index: true },
    slotTime: { type: String, required: true },
    date: { type: String, required: true },
    status: { type: String, enum: Object.values(BookingStatus), default: BookingStatus.CONFIRMED },
  },
  { timestamps: true }
);

bookingSchema.index({ amenityId: 1, date: 1, slotTime: 1 });
bookingSchema.index({ userId: 1, amenityId: 1 });

export const Booking = mongoose.model<IBooking>('Booking', bookingSchema);
