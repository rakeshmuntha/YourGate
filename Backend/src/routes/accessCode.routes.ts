import { Router } from 'express';
import { AccessCodeController } from '../controllers/accessCode.controller';
import { isAuthenticated, authorizeRoles } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { generateCodeSchema, validateCodeSchema } from '../validators/schemas';
import { Role } from '../types';

const router = Router();
const controller = new AccessCodeController();

router.use(isAuthenticated);

router.post('/generate', authorizeRoles(Role.RESIDENT), validate(generateCodeSchema), (req, res) => controller.generate(req, res));
router.post('/validate', authorizeRoles(Role.SECURITY), validate(validateCodeSchema), (req, res) => controller.validate(req, res));
router.get('/my', authorizeRoles(Role.RESIDENT), (req, res) => controller.getMyCodes(req, res));

export default router;
