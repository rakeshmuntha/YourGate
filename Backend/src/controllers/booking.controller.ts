import { Request, Response } from 'express';
import { BookingService } from '../services/booking.service';
import { AuthRequest } from '../types';

const bookingService = new BookingService();

export class BookingController {
  async create(req: AuthRequest, res: Response): Promise<void> {
    try {
      const booking = await bookingService.create({
        ...req.body,
        userId: req.user!.userId,
        communityId: req.user!.communityId!,
      });
      res.status(201).json({ message: 'Booking confirmed', booking });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({ message: error.message });
    }
  }

  async getMyBookings(req: AuthRequest, res: Response): Promise<void> {
    try {
      const bookings = await bookingService.getMyBookings(req.user!.userId);
      res.json({ bookings });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({ message: error.message });
    }
  }

  async cancel(req: AuthRequest, res: Response): Promise<void> {
    try {
      const booking = await bookingService.cancel(req.params.id, req.user!.userId);
      res.json({ message: 'Booking cancelled', booking });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({ message: error.message });
    }
  }

  async getCommunityBookings(req: AuthRequest, res: Response): Promise<void> {
    try {
      const bookings = await bookingService.getCommunityBookings(req.user!.communityId!);
      res.json({ bookings });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({ message: error.message });
    }
  }

  async getSlotAvailability(req: Request, res: Response): Promise<void> {
    try {
      const { amenityId, date } = req.query;
      const slots = await bookingService.getSlotAvailability(
        amenityId as string,
        date as string
      );
      res.json({ slots });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({ message: error.message });
    }
  }
}
