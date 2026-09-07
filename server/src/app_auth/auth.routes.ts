import { Router } from 'express';
import { authController } from './auth.controller.js';

const router = Router();

router.post('/auth/check-email', authController.checkEmail);
router.post('/auth/login-with-password', authController.loginWithPassword);
router.post('/auth/login-with-code', authController.loginWithCode);
router.post('/auth/send-new-login-code', authController.sendNewLoginCode);

router.post('/auth/registration', authController.registration);

router.get('/auth/user', authController.getCurrentUser);
router.post('/auth/logout', authController.logout);

export default router;
