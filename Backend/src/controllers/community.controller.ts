import { Request, Response } from 'express';
import { CommunityService } from '../services/community.service';
import { AuthRequest } from '../types';

const communityService = new CommunityService();

export class CommunityController {
  async register(req: Request, res: Response): Promise<void> {
    try {
      const result = await communityService.register(req.body);
      res.status(201).json({
        message: 'Community registered. Pending super admin approval.',
        ...result,
      });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({ message: error.message });
    }
  }

  async getAll(req: AuthRequest, res: Response): Promise<void> {
    try {
      const communities = await communityService.getAll();
      res.json({ communities });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({ message: error.message });
    }
  }

  async approve(req: AuthRequest, res: Response): Promise<void> {
    try {
      const community = await communityService.approve(req.params.id);
      res.json({ message: 'Community approved', community });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({ message: error.message });
    }
  }

  async reject(req: AuthRequest, res: Response): Promise<void> {
    try {
      const community = await communityService.reject(req.params.id);
      res.json({ message: 'Community rejected', community });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({ message: error.message });
    }
  }

  async getApproved(req: Request, res: Response): Promise<void> {
    try {
      const communities = await communityService.getApprovedCommunities();
      res.json({ communities });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({ message: error.message });
    }
  }
}
