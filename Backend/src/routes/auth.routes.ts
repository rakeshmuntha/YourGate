import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { isAuthenticated } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { registerSchema, loginSchema } from '../validators/schemas';

const router = Router();
const controller = new AuthController();

router.post('/register', validate(registerSchema), (req, res) => controller.register(req, res));
router.post('/login', validate(loginSchema), (req, res) => controller.login(req, res));
router.post('/logout', isAuthenticated, (req, res) => controller.logout(req, res));
router.get('/me', isAuthenticated, (req, res) => controller.getMe(req, res));
router.patch('/profile', isAuthenticated, (req, res) => controller.updateProfile(req, res));

export default router;
