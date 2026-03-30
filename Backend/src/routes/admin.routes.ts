import { Router } from 'express';
import { AdminController } from '../controllers/admin.controller';
import { isAuthenticated, authorizeRoles } from '../middlewares/auth.middleware';
import { Role } from '../types';

const router = Router();
const controller = new AdminController();

router.use(isAuthenticated, authorizeRoles(Role.ADMIN));

router.get('/pending-users', (req, res) => controller.getPendingUsers(req, res));
router.patch('/approve-user/:id', (req, res) => controller.approveUser(req, res));
router.patch('/reject-user/:id', (req, res) => controller.rejectUser(req, res));
router.get('/users', (req, res) => controller.getCommunityUsers(req, res));

export default router;
