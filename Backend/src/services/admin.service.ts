import { User } from '../models/User';
import { UserStatus } from '../types';
import { AppError } from '../utils/errors';

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
}
