import { VisitorLog } from '../models/VisitorLog';
import { AccessCodeService } from './accessCode.service';
import { AppError } from '../utils/errors';

const accessCodeService = new AccessCodeService();

export class VisitorService {
  async recordEntry(data: {
    visitorName: string;
    code: string;
    communityId: string;
    verifiedBy: string;
  }) {
    const accessCode = await accessCodeService.validate(data.code, data.communityId);
    await accessCodeService.markUsed((accessCode._id as unknown as string));

    const log = await VisitorLog.create({
      visitorName: data.visitorName,
      visitorType: accessCode.type,
      codeUsed: data.code,
      entryTime: new Date(),
      communityId: data.communityId,
      verifiedBy: data.verifiedBy,
    });

    return log;
  }

  async recordExit(logId: string, communityId: string) {
    const log = await VisitorLog.findOne({ _id: logId, communityId });
    if (!log) throw new AppError('Visitor log not found', 404);
    if (log.exitTime) throw new AppError('Exit already recorded', 400);

    log.exitTime = new Date();
    await log.save();
    return log;
  }

  async getLogs(communityId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [logs, total] = await Promise.all([
      VisitorLog.find({ communityId })
        .populate('verifiedBy', 'name')
        .sort({ entryTime: -1 })
        .skip(skip)
        .limit(limit),
      VisitorLog.countDocuments({ communityId }),
    ]);

    return { logs, total, page, totalPages: Math.ceil(total / limit) };
  }

  async getActiveVisitors(communityId: string) {
    return VisitorLog.find({ communityId, exitTime: { $exists: false } })
      .populate('verifiedBy', 'name')
      .sort({ entryTime: -1 });
  }
}
