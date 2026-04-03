import { Router } from 'express';
import { generateCsrfToken, validateCsrfToken } from '../middleware/csrf.js';
import * as authController from './authController.js';

const router = Router();

// GET /csrf-token - получение CSRF токена
router.get('/csrf-token', generateCsrfToken, (req, res) => {
   res.json({
      success: true,
      csrfToken: res.locals.csrfToken,
   });
});

// POST /auth/check-email - проверка существования email
router.post(
   '/auth/check-email',
   validateCsrfToken,
   generateCsrfToken,
   authController.checkEmail
);

// POST /auth/login-with-password - вход по паролю
router.post(
   '/auth/login-with-password',
   validateCsrfToken,
   generateCsrfToken,
   authController.loginWithPassword
);

// POST /auth/login-with-code - вход по коду
router.post(
   '/auth/login-with-code',
   validateCsrfToken,
   generateCsrfToken,
   authController.loginWithCode
);

// POST /auth/send-new-login-code - отправка нового кода
router.post(
   '/auth/send-new-login-code',
   validateCsrfToken,
   generateCsrfToken,
   authController.sendNewLoginCode
);

// POST /auth/registration - регистрация пользователя
router.post(
   '/auth/registration',
   generateCsrfToken,
   authController.registration
);

// GET /auth/user - получение текущего пользователя
router.get('/auth/user', authController.getCurrentUser);

// POST /auth/logout - выход пользователя
router.post('/auth/logout', validateCsrfToken, authController.logout);

export default router;
