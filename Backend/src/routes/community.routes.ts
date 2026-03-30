import { Router } from 'express';
import { CommunityController } from '../controllers/community.controller';
import { isAuthenticated, authorizeRoles } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { communityRegisterSchema } from '../validators/schemas';
import { Role } from '../types';

const router = Router();
const controller = new CommunityController();

router.post('/register', validate(communityRegisterSchema), (req, res) => controller.register(req, res));
router.get('/approved', (req, res) => controller.getApproved(req, res));
router.get('/all', isAuthenticated, authorizeRoles(Role.SUPER_ADMIN), (req, res) => controller.getAll(req, res));
router.patch('/approve/:id', isAuthenticated, authorizeRoles(Role.SUPER_ADMIN), (req, res) => controller.approve(req, res));
router.patch('/reject/:id', isAuthenticated, authorizeRoles(Role.SUPER_ADMIN), (req, res) => controller.reject(req, res));

export default router;
