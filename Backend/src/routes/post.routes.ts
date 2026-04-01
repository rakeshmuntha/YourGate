import { Router } from 'express';
import { PostController } from '../controllers/post.controller';
import { isAuthenticated, authorizeRoles } from '../middlewares/auth.middleware';
import { Role } from '../types';

const router = Router();
const controller = new PostController();

router.use(isAuthenticated);
router.use(authorizeRoles(Role.ADMIN, Role.RESIDENT));

router.get('/',        (req, res) => controller.getAll(req, res));
router.post('/',       (req, res) => controller.create(req, res));
router.put('/:id',     (req, res) => controller.update(req, res));
router.delete('/:id',  (req, res) => controller.remove(req, res));

export default router;
