import { Router } from 'express';
import { AmenityController } from '../controllers/amenity.controller';
import { isAuthenticated, authorizeRoles } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { createAmenitySchema } from '../validators/schemas';
import { Role } from '../types';

const router = Router();
const controller = new AmenityController();

router.use(isAuthenticated);

router.post('/', authorizeRoles(Role.ADMIN), validate(createAmenitySchema), (req, res) => controller.create(req, res));
router.get('/', authorizeRoles(Role.ADMIN, Role.RESIDENT), (req, res) => controller.getAll(req, res));
router.put('/:id', authorizeRoles(Role.ADMIN), (req, res) => controller.update(req, res));
router.delete('/:id', authorizeRoles(Role.ADMIN), (req, res) => controller.delete(req, res));

export default router;
