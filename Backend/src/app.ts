import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { connectDB } from './config/db';
import { env } from './config/env';

import authRoutes from './routes/auth.routes';
import adminRoutes from './routes/admin.routes';
import communityRoutes from './routes/community.routes';
import accessCodeRoutes from './routes/accessCode.routes';
import visitorRoutes from './routes/visitor.routes';
import amenityRoutes from './routes/amenity.routes';
import bookingRoutes from './routes/booking.routes';

const app = express();

// Middleware
app.use(cors({
  origin: env.CLIENT_URL,
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/access-code', accessCodeRoutes);
app.use('/api/visitor', visitorRoutes);
app.use('/api/amenities', amenityRoutes);
app.use('/api/bookings', bookingRoutes);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Start server
const startServer = async () => {
  await connectDB();
  app.listen(env.PORT, () => {
    console.log(`Server running on port ${env.PORT}`);
  });
};

startServer();

export default app;
