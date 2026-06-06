import { Router } from 'express';
import { csrfTokenHandler } from '../middleware/csrf.js';
import authRoutes from '../app_auth/authRoutes.js';
import userAccountRoutes from '../app_user_account/userAccountRoutes.js';

const router = Router();

router.get('/csrf-token', csrfTokenHandler);
router.use('/', authRoutes);
router.use('/', userAccountRoutes);

export default router;
