import mongoose, { Schema, Document } from 'mongoose';

export interface ITimeSlot {
  start: string;
  end: string;
}

export interface IAmenity extends Document {
  name: string;
  description: string;
  communityId: mongoose.Types.ObjectId;
  bookingLimitPerUser: number;
  timeSlots: ITimeSlot[];
  createdAt: Date;
  updatedAt: Date;
}

const amenitySchema = new Schema<IAmenity>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    communityId: { type: Schema.Types.ObjectId, ref: 'Community', required: true, index: true },
    bookingLimitPerUser: { type: Number, required: true, default: 2 },
    timeSlots: [
      {
        start: { type: String, required: true },
        end: { type: String, required: true },
      },
    ],
  },
  { timestamps: true }
);

export const Amenity = mongoose.model<IAmenity>('Amenity', amenitySchema);
