import { User } from '../models/User';
import { Role, UserStatus } from '../types';
import { AppError } from '../utils/errors';
import bcrypt from 'bcryptjs';

export class AdminService {
  async getPendingUsers(communityId: string) {
    return User.find({ communityId, status: UserStatus.PENDING })
      .select('-password -refreshToken')
      .sort({ createdAt: -1 });
  }

  async approveUser(userId: string, communityId: string) {
    const user = await User.findOne({ _id: userId, communityId });
    if (!user) throw new AppError('User not found in your community', 404);
    if (user.status !== UserStatus.PENDING) throw new AppError('User is not in pending status', 400);

    user.status = UserStatus.APPROVED;
    await user.save();
    return { id: user._id, name: user.name, email: user.email, status: user.status };
  }

  async rejectUser(userId: string, communityId: string) {
    const user = await User.findOne({ _id: userId, communityId });
    if (!user) throw new AppError('User not found in your community', 404);
    if (user.status !== UserStatus.PENDING) throw new AppError('User is not in pending status', 400);

    user.status = UserStatus.REJECTED;
    await user.save();
    return { id: user._id, name: user.name, email: user.email, status: user.status };
  }

  async getCommunityUsers(communityId: string) {
    return User.find({ communityId })
      .select('-password -refreshToken')
      .sort({ createdAt: -1 });
  }

  async addFaculty(data: { name: string; email: string; role: string; communityId: string }) {
    const existing = await User.findOne({ email: data.email });
    if (existing) throw new AppError('Email already registered', 400);

    const validRoles = [Role.SECURITY, 'CLEANER', 'MAINTENANCE', 'GARDENER', 'OTHER'];
    if (!validRoles.includes(data.role as any)) throw new AppError('Invalid faculty role', 400);

    const userData: any = {
      name: data.name,
      email: data.email,
      role: data.role === Role.SECURITY ? Role.SECURITY : Role.RESIDENT,
      communityId: data.communityId,
      status: UserStatus.APPROVED,
      facultyRole: data.role !== Role.SECURITY ? data.role : undefined,
    };

    // Security accounts are auto-created with a default password
    if (data.role === Role.SECURITY) {
      userData.password = await bcrypt.hash('password123', 12);
    } else {
      userData.password = await bcrypt.hash('password123', 12);
    }

    const user = await User.create(userData);

    return {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
    };
  }
}
