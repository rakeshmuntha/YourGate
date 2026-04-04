import bcrypt from 'bcryptjs';
import { User } from '../models/User';
import { Role, UserStatus, TokenPayload } from '../types';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/token';
import { AppError } from '../utils/errors';

export class AuthService {
  async register(data: {
    name: string;
    email: string;
    password: string;
    role: Role;
    flatNumber?: string;
    communityId: string;
  }) {
    const existing = await User.findOne({ email: data.email });
    if (existing) throw new AppError('Email already registered', 400);

    const hashedPassword = await bcrypt.hash(data.password, 12);

    const user = await User.create({
      ...data,
      password: hashedPassword,
      status: UserStatus.PENDING,
    });

    return {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
    };
  }

  async login(email: string, password: string) {
    const user = await User.findOne({ email });
    if (!user) throw new AppError('Invalid email or password', 401);

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new AppError('Invalid email or password', 401);

    if (user.status !== UserStatus.APPROVED && user.role !== Role.SUPER_ADMIN) {
      if (user.status === UserStatus.PENDING) {
        throw new AppError('Your account is pending approval', 403);
      }
      throw new AppError('Your account has been rejected', 403);
    }

    const payload: TokenPayload = {
      userId: (user._id as unknown as string),
      role: user.role,
      communityId: user.communityId?.toString(),
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    user.refreshToken = refreshToken;
    await user.save();

    return {
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        communityId: user.communityId,
        status: user.status,
        flatNumber: user.flatNumber,
      },
    };
  }

  async logout(userId: string) {
    await User.findByIdAndUpdate(userId, { refreshToken: undefined });
  }

  async refresh(refreshToken: string) {
    const decoded = verifyRefreshToken(refreshToken);
    const user = await User.findById(decoded.userId);

    if (!user || user.refreshToken !== refreshToken) {
      throw new AppError('Invalid refresh token', 401);
    }

    const payload: TokenPayload = {
      userId: (user._id as unknown as string),
      role: user.role,
      communityId: user.communityId?.toString(),
    };

    const newAccessToken = generateAccessToken(payload);
    const newRefreshToken = generateRefreshToken(payload);

    user.refreshToken = newRefreshToken;
    await user.save();

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }

  async getMe(userId: string) {
    const user = await User.findById(userId).select('-password -refreshToken').populate('communityId', 'communityName');
    if (!user) throw new AppError('User not found', 404);
    return user;
  }

  async updateProfile(userId: string, data: { name?: string; flatNumber?: string }) {
    const user = await User.findById(userId);
    if (!user) throw new AppError('User not found', 404);

    if (data.name) user.name = data.name;
    if (data.flatNumber !== undefined) user.flatNumber = data.flatNumber;

    await user.save();

    const updated = await User.findById(userId).select('-password -refreshToken').populate('communityId', 'communityName');
    return updated;
  }
}
