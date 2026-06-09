import { Router } from 'express';
import { csrfTokenHandler } from '../middleware/csrf.js';
import authRoutes from '@auth/auth.routes.js';
import userAccountRoutes from '@user_account/user-account.routes.js';

const router = Router();

router.get('/csrf-token', csrfTokenHandler);
router.use('/', authRoutes);
router.use('/', userAccountRoutes);

export default router;
