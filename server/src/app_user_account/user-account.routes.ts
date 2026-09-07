import { Router } from 'express';
import { userAccountController } from './user-account.controller.js';

const router = Router();

// POST - Запись данных пользователя
router.post('/account/save-user-data', userAccountController.saveUserData);

// POST - Получение кода проверки пользователя
router.post('/account/get-user-verification-code', userAccountController.getUserVerificationCode);

// POST - сопоставление кода проверки пользователя
router.post('/account/check-user-verification-code', userAccountController.checkUserVerificationCode);

// POST - Проверка контактной информации на уникальность
router.post('/account/check-user-contact-data', userAccountController.checkUserContactData);

// POST - Запись новых контактных данных пользователя
router.post('/account/write-new-user-contact-data', userAccountController.writeNewUserContactData);

// POST - Проверка пароля пользователя
router.post('/account/check-user-password', userAccountController.checkUserPassword);

// POST - Запись нового пароля пользователя
router.post('/account/write-new-user-password', userAccountController.writeNewUserPassword);

// POST - Удаление аккаунта пользователя
router.post('/account/delete-user-account', userAccountController.deleteUserAccount);

export default router;
