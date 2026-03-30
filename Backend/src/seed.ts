import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { connectDB } from './config/db';
import { User } from './models/User';
import { Community } from './models/Community';
import { Amenity } from './models/Amenity';
import { Role, UserStatus, CommunityStatus } from './types';

const seed = async () => {
  await connectDB();

  // Clear existing data
  await User.deleteMany({});
  await Community.deleteMany({});
  await Amenity.deleteMany({});

  const password = await bcrypt.hash('password123', 12);

  // 1. Create Super Admin
  const superAdmin = await User.create({
    name: 'Super Admin',
    email: 'superadmin@yourgate.com',
    password,
    role: Role.SUPER_ADMIN,
    status: UserStatus.APPROVED,
  });
  console.log('Super Admin created: superadmin@yourgate.com / password123');

  // 2. Create Admin
  const admin = await User.create({
    name: 'Rajesh Kumar',
    email: 'admin@greenvalley.com',
    password,
    role: Role.ADMIN,
    status: UserStatus.APPROVED,
  });

  // 3. Create Community
  const community = await Community.create({
    communityName: 'Green Valley Residency',
    address: '123, MG Road, Hyderabad, Telangana 500032',
    adminId: admin._id,
    status: CommunityStatus.APPROVED,
    paymentCompleted: true,
  });

  admin.communityId = community._id as any;
  await admin.save();
  console.log('Community created: Green Valley Residency');
  console.log('Admin created: admin@greenvalley.com / password123');

  // 4. Create approved Resident
  const resident = await User.create({
    name: 'Priya Sharma',
    email: 'resident@greenvalley.com',
    password,
    role: Role.RESIDENT,
    status: UserStatus.APPROVED,
    flatNumber: 'A-101',
    communityId: community._id,
  });
  console.log('Resident created: resident@greenvalley.com / password123');

  // 5. Create Security Guard
  const security = await User.create({
    name: 'Ramu Singh',
    email: 'security@greenvalley.com',
    password,
    role: Role.SECURITY,
    status: UserStatus.APPROVED,
    communityId: community._id,
  });
  console.log('Security created: security@greenvalley.com / password123');

  // 6. Create a pending resident
  await User.create({
    name: 'Vikram Patel',
    email: 'pending@greenvalley.com',
    password,
    role: Role.RESIDENT,
    status: UserStatus.PENDING,
    flatNumber: 'B-202',
    communityId: community._id,
  });
  console.log('Pending Resident created: pending@greenvalley.com / password123');

  // 7. Create Amenities
  await Amenity.create([
    {
      name: 'Cricket Ground',
      description: 'Full-size cricket ground with floodlights and well-maintained pitch.',
      communityId: community._id,
      bookingLimitPerUser: 2,
      timeSlots: [
        { start: '06:00', end: '08:00' },
        { start: '08:00', end: '10:00' },
        { start: '16:00', end: '18:00' },
        { start: '18:00', end: '20:00' },
      ],
    },
    {
      name: 'Shuttle Court',
      description: 'Indoor badminton court with professional flooring and lighting.',
      communityId: community._id,
      bookingLimitPerUser: 3,
      timeSlots: [
        { start: '06:00', end: '07:00' },
        { start: '07:00', end: '08:00' },
        { start: '08:00', end: '09:00' },
        { start: '17:00', end: '18:00' },
        { start: '18:00', end: '19:00' },
        { start: '19:00', end: '20:00' },
      ],
    },
    {
      name: 'Swimming Pool',
      description: 'Olympic-size swimming pool with trained lifeguards.',
      communityId: community._id,
      bookingLimitPerUser: 1,
      timeSlots: [
        { start: '06:00', end: '07:30' },
        { start: '07:30', end: '09:00' },
        { start: '16:00', end: '17:30' },
        { start: '17:30', end: '19:00' },
      ],
    },
    {
      name: 'Community Hall',
      description: 'Spacious hall for events and gatherings with 200 person capacity.',
      communityId: community._id,
      bookingLimitPerUser: 1,
      timeSlots: [
        { start: '09:00', end: '13:00' },
        { start: '14:00', end: '18:00' },
        { start: '18:00', end: '22:00' },
      ],
    },
  ]);
  console.log('Amenities created');

  // 8. Create a second pending community
  const admin2 = await User.create({
    name: 'Anita Desai',
    email: 'admin@sunrisepark.com',
    password,
    role: Role.ADMIN,
    status: UserStatus.APPROVED,
  });

  const community2 = await Community.create({
    communityName: 'Sunrise Park Villas',
    address: '45, Jubilee Hills, Hyderabad, Telangana 500033',
    adminId: admin2._id,
    status: CommunityStatus.PENDING,
    paymentCompleted: true,
  });

  admin2.communityId = community2._id as any;
  await admin2.save();
  console.log('Pending Community created: Sunrise Park Villas');

  console.log('\n--- Seed Complete ---');
  console.log('Community ID:', community._id);
  process.exit(0);
};

seed().catch((err) => {
  console.error('Seed error:', err);
  process.exit(1);
});
