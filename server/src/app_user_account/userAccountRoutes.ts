import { Router } from 'express';

import { generateCsrfToken, validateCsrfToken } from '../middleware/csrf.js';
import * as userAccountController from './userAccountController.js';

const router = Router();

// POST /account/save-user-data - запись данных пользователя
router.post(
   '/account/save-user-data',
   validateCsrfToken,
   generateCsrfToken,
   userAccountController.saveUserData
);

// POST /account/set-user-verification-code - получение кода проверки пользователя
router.post(
   '/account/get-user-verification-code',
   validateCsrfToken,
   generateCsrfToken,
   userAccountController.getUserVerificationCode
);

// POST /account/check-user-verification-code - сопоставление кода проверки пользователя
router.post(
   '/account/check-user-verification-code',
   validateCsrfToken,
   generateCsrfToken,
   userAccountController.checkUserVerificationCode
);

// POST /account/check-user-contact-data - проверка контактной информации на уникальность
router.post(
   '/account/check-user-contact-data',
   validateCsrfToken,
   generateCsrfToken,
   userAccountController.checkUserContactData
);

// POST /account/write-new-user-contact-data - запись новых контактных данных пользователя
router.post(
   '/account/write-new-user-contact-data',
   validateCsrfToken,
   generateCsrfToken,
   userAccountController.writeNewUserContactData
);

// POST /account/check-user-password - проверка пароля пользователя
router.post(
   '/account/check-user-password',
   validateCsrfToken,
   generateCsrfToken,
   userAccountController.checkUserPassword
);

// POST /account/write-new-user-password - запись нового пароля пользователя
router.post(
   '/account/write-new-user-password',
   validateCsrfToken,
   generateCsrfToken,
   userAccountController.writeNewUserPassword
);

// POST /account/delete-user-account - удаление эккаунта пользователя
router.post(
   '/account/delete-user-account',
   validateCsrfToken,
   userAccountController.deleteUserAccount
);

export default router;
