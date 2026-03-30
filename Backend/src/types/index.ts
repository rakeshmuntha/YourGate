import { Request } from 'express';

export enum Role {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  RESIDENT = 'RESIDENT',
  SECURITY = 'SECURITY',
}

export enum UserStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export enum CommunityStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export enum VisitorType {
  DELIVERY = 'DELIVERY',
  GUEST = 'GUEST',
}

export enum AccessCodeStatus {
  ACTIVE = 'ACTIVE',
  EXPIRED = 'EXPIRED',
}

export enum BookingStatus {
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
}

export interface TokenPayload {
  userId: string;
  role: Role;
  communityId?: string;
}

export interface AuthRequest extends Request {
  user?: TokenPayload;
}
