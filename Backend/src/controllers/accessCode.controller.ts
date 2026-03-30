import { Response } from 'express';
import { AccessCodeService } from '../services/accessCode.service';
import { AuthRequest } from '../types';

const accessCodeService = new AccessCodeService();

export class AccessCodeController {
  async generate(req: AuthRequest, res: Response): Promise<void> {
    try {
      const code = await accessCodeService.generate({
        ...req.body,
        generatedBy: req.user!.userId,
        communityId: req.user!.communityId!,
      });
      res.status(201).json({ message: 'Access code generated', accessCode: code });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({ message: error.message });
    }
  }

  async validate(req: AuthRequest, res: Response): Promise<void> {
    try {
      const accessCode = await accessCodeService.validate(
        req.body.code,
        req.user!.communityId!
      );
      res.json({ message: 'Code is valid', accessCode });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({ message: error.message });
    }
  }

  async getMyCodes(req: AuthRequest, res: Response): Promise<void> {
    try {
      const codes = await accessCodeService.getByResident(req.user!.userId);
      res.json({ codes });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({ message: error.message });
    }
  }
}
