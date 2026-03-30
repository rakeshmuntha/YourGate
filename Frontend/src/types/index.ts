export enum Role {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  RESIDENT = 'RESIDENT',
  SECURITY = 'SECURITY',
}

export interface User {
  id: string;
  _id?: string;
  name: string;
  email: string;
  role: Role;
  flatNumber?: string;
  communityId?: string | { _id: string; communityName: string };
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

export interface Community {
  _id: string;
  communityName: string;
  address: string;
  adminId: { _id: string; name: string; email: string } | string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  paymentCompleted: boolean;
  createdAt: string;
}

export interface AccessCode {
  _id: string;
  code: string;
  type: 'DELIVERY' | 'GUEST';
  generatedBy: string | { _id: string; name: string; flatNumber?: string };
  communityId: string;
  expiresAt: string;
  usageLimit: number;
  usedCount: number;
  status: 'ACTIVE' | 'EXPIRED';
  createdAt: string;
}

export interface VisitorLog {
  _id: string;
  visitorName: string;
  visitorType: 'DELIVERY' | 'GUEST';
  codeUsed: string;
  entryTime: string;
  exitTime?: string;
  communityId: string;
  verifiedBy: { _id: string; name: string } | string;
  createdAt: string;
}

export interface Amenity {
  _id: string;
  name: string;
  description: string;
  communityId: string;
  bookingLimitPerUser: number;
  timeSlots: { start: string; end: string }[];
}

export interface Booking {
  _id: string;
  userId: string | { _id: string; name: string; flatNumber?: string };
  amenityId: string | { _id: string; name: string; description?: string };
  communityId: string;
  slotTime: string;
  date: string;
  status: 'CONFIRMED' | 'CANCELLED';
  createdAt: string;
}

export interface SlotAvailability {
  start: string;
  end: string;
  available: boolean;
}
