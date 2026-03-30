import { Amenity } from '../models/Amenity';
import { AppError } from '../utils/errors';

export class AmenityService {
  async create(data: {
    name: string;
    description: string;
    bookingLimitPerUser: number;
    timeSlots: { start: string; end: string }[];
    communityId: string;
  }) {
    const amenity = await Amenity.create(data);
    return amenity;
  }

  async getByCommunity(communityId: string) {
    return Amenity.find({ communityId }).sort({ name: 1 });
  }

  async getById(amenityId: string, communityId: string) {
    const amenity = await Amenity.findOne({ _id: amenityId, communityId });
    if (!amenity) throw new AppError('Amenity not found', 404);
    return amenity;
  }

  async update(amenityId: string, communityId: string, data: Partial<{
    name: string;
    description: string;
    bookingLimitPerUser: number;
    timeSlots: { start: string; end: string }[];
  }>) {
    const amenity = await Amenity.findOneAndUpdate(
      { _id: amenityId, communityId },
      data,
      { new: true }
    );
    if (!amenity) throw new AppError('Amenity not found', 404);
    return amenity;
  }

  async delete(amenityId: string, communityId: string) {
    const amenity = await Amenity.findOneAndDelete({ _id: amenityId, communityId });
    if (!amenity) throw new AppError('Amenity not found', 404);
    return amenity;
  }
}
