import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['RESIDENT', 'SECURITY']),
  flatNumber: z.string().optional(),
  communityId: z.string().min(1, 'Community ID is required'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const communityRegisterSchema = z.object({
  communityName: z.string().min(2, 'Community name must be at least 2 characters'),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  adminName: z.string().min(2, 'Admin name is required'),
  adminEmail: z.string().email('Invalid email address'),
  adminPassword: z.string().min(6, 'Password must be at least 6 characters'),
});

export const generateCodeSchema = z.object({
  type: z.enum(['DELIVERY', 'GUEST']),
  expiresInHours: z.number().min(1).max(72).default(24),
  usageLimit: z.number().min(1).max(10).default(1),
});

export const validateCodeSchema = z.object({
  code: z.string().min(1, 'Code is required'),
});

export const visitorEntrySchema = z.object({
  visitorName: z.string().min(1, 'Visitor name is required'),
  code: z.string().min(1, 'Access code is required'),
});

export const visitorExitSchema = z.object({
  logId: z.string().min(1, 'Log ID is required'),
});

export const createAmenitySchema = z.object({
  name: z.string().min(2, 'Amenity name is required'),
  description: z.string().min(5, 'Description is required'),
  bookingLimitPerUser: z.number().min(1).max(10).default(2),
  timeSlots: z
    .array(
      z.object({
        start: z.string(),
        end: z.string(),
      })
    )
    .min(1, 'At least one time slot is required'),
});

export const createBookingSchema = z.object({
  amenityId: z.string().min(1, 'Amenity ID is required'),
  slotTime: z.string().min(1, 'Slot time is required'),
  date: z.string().min(1, 'Date is required'),
});
