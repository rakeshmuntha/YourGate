import { Response } from 'express';
import { AdminService } from '../services/admin.service';
import { AuthRequest } from '../types';

const adminService = new AdminService();

export class AdminController {
  async getPendingUsers(req: AuthRequest, res: Response): Promise<void> {
    try {
      const users = await adminService.getPendingUsers(req.user!.communityId!);
      res.json({ users });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({ message: error.message });
    }
  }

  async approveUser(req: AuthRequest, res: Response): Promise<void> {
    try {
      const user = await adminService.approveUser(req.params.id, req.user!.communityId!);
      res.json({ message: 'User approved successfully', user });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({ message: error.message });
    }
  }

  async rejectUser(req: AuthRequest, res: Response): Promise<void> {
    try {
      const user = await adminService.rejectUser(req.params.id, req.user!.communityId!);
      res.json({ message: 'User rejected', user });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({ message: error.message });
    }
  }

  async getCommunityUsers(req: AuthRequest, res: Response): Promise<void> {
    try {
      const users = await adminService.getCommunityUsers(req.user!.communityId!);
      res.json({ users });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({ message: error.message });
    }
  }
}
