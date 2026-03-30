import { Router } from 'express';
import { BookingController } from '../controllers/booking.controller';
import { isAuthenticated, authorizeRoles } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { createBookingSchema } from '../validators/schemas';
import { Role } from '../types';

const router = Router();
const controller = new BookingController();

router.use(isAuthenticated);

router.post('/', authorizeRoles(Role.RESIDENT), validate(createBookingSchema), (req, res) => controller.create(req, res));
router.get('/my', authorizeRoles(Role.RESIDENT), (req, res) => controller.getMyBookings(req, res));
router.delete('/:id', authorizeRoles(Role.RESIDENT), (req, res) => controller.cancel(req, res));
router.get('/community', authorizeRoles(Role.ADMIN), (req, res) => controller.getCommunityBookings(req, res));
router.get('/availability', (req, res) => controller.getSlotAvailability(req, res));

export default router;
