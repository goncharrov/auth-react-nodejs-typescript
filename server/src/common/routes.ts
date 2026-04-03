import { Router } from 'express';
import authRoutes from '../app_auth/authRoutes.js';
import userAccountRoutes from '../app_user_account/userAccountRoutes.js';

const router = Router();

router.use('/', authRoutes);
router.use('/', userAccountRoutes);

export default router;
