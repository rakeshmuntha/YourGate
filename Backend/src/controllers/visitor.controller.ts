import { Response } from 'express';
import { VisitorService } from '../services/visitor.service';
import { AuthRequest } from '../types';

const visitorService = new VisitorService();

export class VisitorController {
  async entry(req: AuthRequest, res: Response): Promise<void> {
    try {
      const log = await visitorService.recordEntry({
        visitorName: req.body.visitorName,
        code: req.body.code,
        communityId: req.user!.communityId!,
        verifiedBy: req.user!.userId,
      });
      res.status(201).json({ message: 'Visitor entry recorded', log });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({ message: error.message });
    }
  }

  async exit(req: AuthRequest, res: Response): Promise<void> {
    try {
      const log = await visitorService.recordExit(req.body.logId, req.user!.communityId!);
      res.json({ message: 'Visitor exit recorded', log });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({ message: error.message });
    }
  }

  async getLogs(req: AuthRequest, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const result = await visitorService.getLogs(req.user!.communityId!, page, limit);
      res.json(result);
    } catch (error: any) {
      res.status(error.statusCode || 500).json({ message: error.message });
    }
  }

  async getActive(req: AuthRequest, res: Response): Promise<void> {
    try {
      const visitors = await visitorService.getActiveVisitors(req.user!.communityId!);
      res.json({ visitors });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({ message: error.message });
    }
  }
}
