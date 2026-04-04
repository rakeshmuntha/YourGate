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

    const validRoles = ['SECURITY', 'CLEANER', 'MAINTENANCE', 'GARDENER', 'ELECTRICIAN', 'PLUMBER', 'WATCHMAN', 'COOK', 'DRIVER', 'OTHER'];
    if (!validRoles.includes(data.role)) throw new AppError('Invalid worker role', 400);

    const hashedPassword = await bcrypt.hash('password123', 12);

    const user = await User.create({
      name: data.name,
      email: data.email,
      role: data.role === 'SECURITY' ? Role.SECURITY : Role.RESIDENT,
      communityId: data.communityId,
      status: UserStatus.APPROVED,
      password: hashedPassword,
    });

    return {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
    };
  }
}
