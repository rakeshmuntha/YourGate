import { Booking } from '../models/Booking';
import { Amenity } from '../models/Amenity';
import { BookingStatus } from '../types';
import { AppError } from '../utils/errors';

export class BookingService {
  async create(data: {
    userId: string;
    amenityId: string;
    communityId: string;
    slotTime: string;
    date: string;
  }) {
    const amenity = await Amenity.findOne({ _id: data.amenityId, communityId: data.communityId });
    if (!amenity) throw new AppError('Amenity not found in your community', 404);

    // Check double booking
    const existingSlot = await Booking.findOne({
      amenityId: data.amenityId,
      date: data.date,
      slotTime: data.slotTime,
      status: BookingStatus.CONFIRMED,
    });
    if (existingSlot) throw new AppError('This slot is already booked', 409);

    // Check user booking limit
    const userBookingCount = await Booking.countDocuments({
      userId: data.userId,
      amenityId: data.amenityId,
      status: BookingStatus.CONFIRMED,
      date: { $gte: new Date().toISOString().split('T')[0] },
    });
    if (userBookingCount >= amenity.bookingLimitPerUser) {
      throw new AppError(`Booking limit of ${amenity.bookingLimitPerUser} reached for this amenity`, 400);
    }

    const booking = await Booking.create({
      ...data,
      status: BookingStatus.CONFIRMED,
    });

    return booking;
  }

  async getMyBookings(userId: string) {
    return Booking.find({ userId })
      .populate('amenityId', 'name description')
      .sort({ date: -1, slotTime: 1 });
  }

  async cancel(bookingId: string, userId: string) {
    const booking = await Booking.findOne({ _id: bookingId, userId });
    if (!booking) throw new AppError('Booking not found', 404);
    if (booking.status === BookingStatus.CANCELLED) throw new AppError('Booking already cancelled', 400);

    booking.status = BookingStatus.CANCELLED;
    await booking.save();
    return booking;
  }

  async getCommunityBookings(communityId: string) {
    return Booking.find({ communityId })
      .populate('userId', 'name flatNumber')
      .populate('amenityId', 'name')
      .sort({ date: -1, slotTime: 1 });
  }

  async getSlotAvailability(amenityId: string, date: string) {
    const amenity = await Amenity.findById(amenityId);
    if (!amenity) throw new AppError('Amenity not found', 404);

    const bookedSlots = await Booking.find({
      amenityId,
      date,
      status: BookingStatus.CONFIRMED,
    }).select('slotTime');

    const bookedSlotTimes = new Set(bookedSlots.map((b) => b.slotTime));

    return amenity.timeSlots.map((slot) => ({
      start: slot.start,
      end: slot.end,
      available: !bookedSlotTimes.has(`${slot.start}-${slot.end}`),
    }));
  }
}
