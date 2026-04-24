import { Router } from 'express';
import { firebaseAuth } from '../middleware/firebaseAuth';
import authRoutes from './auth';
import { appRoutes, scanRoutes } from './apps';
import { breachRoutes, alertRoutes, legalRoutes } from './misc';

const apiRouter = Router();

// Public routes
apiRouter.use('/legal', legalRoutes);

// Protected routes
apiRouter.use(firebaseAuth); // all following routes require valid Firebase token
apiRouter.use('/auth', authRoutes);
apiRouter.use('/apps', appRoutes);
apiRouter.use('/scan', scanRoutes);
apiRouter.use('/alerts', alertRoutes);
apiRouter.use('/breaches', breachRoutes);

export default apiRouter;
