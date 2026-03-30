import { Response, NextFunction } from 'express';
import { AuthRequest, Role, TokenPayload } from '../types';
import { verifyAccessToken, verifyRefreshToken, generateAccessToken } from '../utils/token';
import { setTokenCookies } from '../utils/cookies';
import { User } from '../models/User';

export const isAuthenticated = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const accessToken = req.cookies?.accessToken;
    const refreshToken = req.cookies?.refreshToken;

    if (accessToken) {
      try {
        const decoded = verifyAccessToken(accessToken);
        req.user = decoded;
        return next();
      } catch {
        // Access token expired, try refresh
      }
    }

    if (!refreshToken) {
      res.status(401).json({ message: 'Authentication required' });
      return;
    }

    try {
      const decoded = verifyRefreshToken(refreshToken);
      const user = await User.findById(decoded.userId);

      if (!user || user.refreshToken !== refreshToken) {
        res.status(401).json({ message: 'Invalid refresh token' });
        return;
      }

      const payload: TokenPayload = {
        userId: (user._id as unknown as string),
        role: user.role,
        communityId: user.communityId?.toString(),
      };

      const newAccessToken = generateAccessToken(payload);
      setTokenCookies(res, newAccessToken, refreshToken);
      req.user = payload;
      next();
    } catch {
      res.status(401).json({ message: 'Session expired, please login again' });
    }
  } catch {
    res.status(500).json({ message: 'Authentication error' });
  }
};

export const authorizeRoles = (...roles: Role[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({ message: 'Access denied' });
      return;
    }
    next();
  };
};
