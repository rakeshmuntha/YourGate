import { Response } from 'express';
import { AmenityService } from '../services/amenity.service';
import { AuthRequest } from '../types';

const amenityService = new AmenityService();

export class AmenityController {
  async create(req: AuthRequest, res: Response): Promise<void> {
    try {
      const amenity = await amenityService.create({
        ...req.body,
        communityId: req.user!.communityId!,
      });
      res.status(201).json({ message: 'Amenity created', amenity });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({ message: error.message });
    }
  }

  async getAll(req: AuthRequest, res: Response): Promise<void> {
    try {
      const amenities = await amenityService.getByCommunity(req.user!.communityId!);
      res.json({ amenities });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({ message: error.message });
    }
  }

  async update(req: AuthRequest, res: Response): Promise<void> {
    try {
      const amenity = await amenityService.update(
        req.params.id,
        req.user!.communityId!,
        req.body
      );
      res.json({ message: 'Amenity updated', amenity });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({ message: error.message });
    }
  }

  async delete(req: AuthRequest, res: Response): Promise<void> {
    try {
      await amenityService.delete(req.params.id, req.user!.communityId!);
      res.json({ message: 'Amenity deleted' });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({ message: error.message });
    }
  }
}
