import { Router } from 'express';
import { VisitorController } from '../controllers/visitor.controller';
import { isAuthenticated, authorizeRoles } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { visitorEntrySchema, visitorExitSchema } from '../validators/schemas';
import { Role } from '../types';

const router = Router();
const controller = new VisitorController();

router.use(isAuthenticated);

router.post('/entry', authorizeRoles(Role.SECURITY), validate(visitorEntrySchema), (req, res) => controller.entry(req, res));
router.post('/exit', authorizeRoles(Role.SECURITY), validate(visitorExitSchema), (req, res) => controller.exit(req, res));
router.get('/logs', authorizeRoles(Role.ADMIN, Role.SECURITY), (req, res) => controller.getLogs(req, res));
router.get('/active', authorizeRoles(Role.SECURITY), (req, res) => controller.getActive(req, res));

export default router;
