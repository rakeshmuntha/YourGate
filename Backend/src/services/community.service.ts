import bcrypt from 'bcryptjs';
import { Community } from '../models/Community';
import { User } from '../models/User';
import { Role, UserStatus, CommunityStatus } from '../types';
import { AppError } from '../utils/errors';

export class CommunityService {
  async register(data: {
    communityName: string;
    address: string;
    adminName: string;
    adminEmail: string;
    adminPassword: string;
  }) {
    const existingUser = await User.findOne({ email: data.adminEmail });
    if (existingUser) throw new AppError('Admin email already registered', 400);

    const hashedPassword = await bcrypt.hash(data.adminPassword, 12);

    const admin = await User.create({
      name: data.adminName,
      email: data.adminEmail,
      password: hashedPassword,
      role: Role.ADMIN,
      status: UserStatus.APPROVED,
    });

    const community = await Community.create({
      communityName: data.communityName,
      address: data.address,
      adminId: admin._id,
      paymentCompleted: true, // simulated
      status: CommunityStatus.PENDING,
    });

    admin.communityId = community._id as any;
    await admin.save();

    return {
      community: {
        id: community._id,
        communityName: community.communityName,
        status: community.status,
      },
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
      },
    };
  }

  async getAll() {
    return Community.find()
      .populate('adminId', 'name email')
      .sort({ createdAt: -1 });
  }

  async approve(communityId: string) {
    const community = await Community.findById(communityId);
    if (!community) throw new AppError('Community not found', 404);
    if (community.status !== CommunityStatus.PENDING) {
      throw new AppError('Community is not in pending status', 400);
    }

    community.status = CommunityStatus.APPROVED;
    await community.save();
    return community;
  }

  async reject(communityId: string) {
    const community = await Community.findById(communityId);
    if (!community) throw new AppError('Community not found', 404);

    community.status = CommunityStatus.REJECTED;
    await community.save();
    return community;
  }

  async getApprovedCommunities() {
    return Community.find({ status: CommunityStatus.APPROVED })
      .select('communityName address')
      .sort({ communityName: 1 });
  }
}
