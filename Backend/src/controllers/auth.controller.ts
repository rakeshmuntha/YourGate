import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { AuthRequest } from '../types';
import { setTokenCookies, clearTokenCookies } from '../utils/cookies';

const authService = new AuthService();

export class AuthController {
  async register(req: Request, res: Response): Promise<void> {
    try {
      const result = await authService.register(req.body);
      res.status(201).json({
        message: 'Registration successful. Pending admin approval.',
        user: result,
      });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({ message: error.message });
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);
      setTokenCookies(res, result.accessToken, result.refreshToken);
      res.json({ message: 'Login successful', user: result.user });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({ message: error.message });
    }
  }

  async logout(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (req.user?.userId) {
        await authService.logout(req.user.userId);
      }
      clearTokenCookies(res);
      res.json({ message: 'Logged out successfully' });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({ message: error.message });
    }
  }

  async getMe(req: AuthRequest, res: Response): Promise<void> {
    try {
      const user = await authService.getMe(req.user!.userId);
      res.json({ user });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({ message: error.message });
    }
  }

  async updateProfile(req: AuthRequest, res: Response): Promise<void> {
    try {
      const user = await authService.updateProfile(req.user!.userId, req.body);
      res.json({ message: 'Profile updated', user });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({ message: error.message });
    }
  }
}
