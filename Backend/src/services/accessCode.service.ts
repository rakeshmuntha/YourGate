import { AccessCode } from '../models/AccessCode';
import { AccessCodeStatus, VisitorType } from '../types';
import { generateShortCode } from '../utils/token';
import { AppError } from '../utils/errors';

export class AccessCodeService {
  async generate(data: {
    type: VisitorType;
    expiresInHours: number;
    usageLimit: number;
    generatedBy: string;
    communityId: string;
  }) {
    let code: string;
    let attempts = 0;
    do {
      code = generateShortCode();
      const existing = await AccessCode.findOne({ code });
      if (!existing) break;
      attempts++;
    } while (attempts < 10);

    if (attempts >= 10) throw new AppError('Failed to generate unique code', 500);

    const expiresAt = new Date(Date.now() + data.expiresInHours * 60 * 60 * 1000);

    const accessCode = await AccessCode.create({
      code: code!,
      type: data.type,
      generatedBy: data.generatedBy,
      communityId: data.communityId,
      expiresAt,
      usageLimit: data.usageLimit,
      usedCount: 0,
      status: AccessCodeStatus.ACTIVE,
    });

    return accessCode;
  }

  async validate(code: string, communityId: string) {
    const accessCode = await AccessCode.findOne({ code, communityId })
      .populate('generatedBy', 'name flatNumber');

    if (!accessCode) throw new AppError('Invalid access code', 404);

    if (accessCode.status === AccessCodeStatus.EXPIRED) {
      throw new AppError('Access code has expired', 400);
    }

    if (new Date() > accessCode.expiresAt) {
      accessCode.status = AccessCodeStatus.EXPIRED;
      await accessCode.save();
      throw new AppError('Access code has expired', 400);
    }

    if (accessCode.usedCount >= accessCode.usageLimit) {
      accessCode.status = AccessCodeStatus.EXPIRED;
      await accessCode.save();
      throw new AppError('Access code usage limit reached', 400);
    }

    return accessCode;
  }

  async markUsed(codeId: string) {
    const accessCode = await AccessCode.findById(codeId);
    if (!accessCode) throw new AppError('Access code not found', 404);

    accessCode.usedCount += 1;
    if (accessCode.usedCount >= accessCode.usageLimit) {
      accessCode.status = AccessCodeStatus.EXPIRED;
    }
    await accessCode.save();
    return accessCode;
  }

  async getByResident(residentId: string) {
    return AccessCode.find({ generatedBy: residentId })
      .sort({ createdAt: -1 })
      .limit(20);
  }
}
