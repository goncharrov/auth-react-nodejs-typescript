import { Router } from 'express';
import * as authController from '@auth/auth.controller.js';

const router = Router();

// POST /auth/check-email - проверка существования email
router.post('/auth/check-email', authController.checkEmail);

// POST /auth/login-with-password - вход по паролю
router.post('/auth/login-with-password', authController.loginWithPassword);

// POST /auth/login-with-code - вход по коду
router.post('/auth/login-with-code', authController.loginWithCode);

// POST /auth/send-new-login-code - отправка нового кода
router.post('/auth/send-new-login-code', authController.sendNewLoginCode);

// POST /auth/registration - регистрация пользователя
router.post('/auth/registration', authController.registration);

// GET /auth/user - получение текущего пользователя
router.get('/auth/user', authController.getCurrentUser);

// POST /auth/logout - выход пользователя
router.post('/auth/logout', authController.logout);

export default router;
