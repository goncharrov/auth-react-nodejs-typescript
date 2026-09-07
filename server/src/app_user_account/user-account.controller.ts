import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { AppDataSource } from '@config/database.js';
import { User } from '@auth/auth.entity.js';

import {
   makeStringCapitalized,
   getUserData,
   writeUserVerificationCode,
   verifyUserVerificationCode,
   deleteVerificationCode,
   getUserFromSession,
} from '@auth/auth.logic.js';

import { asyncHandler } from '@middleware/asyncHandler.js';

export const userAccountController = {

   saveUserData: asyncHandler(async (req, res) => {
      try {
         // Let's check if the user is authenticated.
         const resultUserFromSession = await getUserFromSession(
            req.session.userId
         );

         if (!resultUserFromSession.success) {
            res.status(401).json({
               success: false,
               message: resultUserFromSession.error,
            });
            return;
         }

         const { user } = resultUserFromSession;

         // -------------------------------------

         const body = req.body as {
            firstName?: string;
            lastName?: string;
            preferredName?: string;
            gender?: { label: string } | string;
            birthday?: string;
         };
         let { firstName, lastName, preferredName } = body;
         const { gender, birthday } = body;

         if (!firstName || !lastName) {
            res.status(400).json({
               success: false,
               message: 'Fields "First name" and "Last name" are required',
            });
            return;
         }

         firstName = makeStringCapitalized(firstName);
         lastName = makeStringCapitalized(lastName);

         if (!preferredName) {
            preferredName = `${firstName} ${lastName}`;
         }

         const userBirthday = birthday ? new Date(birthday) : null;

         user.firstName = firstName;
         user.lastName = lastName;
         user.preferredName = preferredName;
         user.gender =
            typeof gender === 'string'
               ? gender
               : gender && typeof gender === 'object'
               ? gender.label
               : user.gender;

         if (userBirthday && !isNaN(userBirthday.getTime())) {
            user.birthday = userBirthday;
         }

         const userRepo = AppDataSource.getRepository(User);
         await userRepo.save(user);

         const userData = getUserData(user);

         req.session.userId = user.id;
         req.session.isAuthenticated = true;

         res.status(200).json({
            success: true,
            message: 'User data has been successfully saved',
            user: userData,
         });
      } catch (error) {
         console.error('Error during saving user data:', error);
         res.status(500).json({
            success: false,
            message: 'Server error',
         });
      }
   }),

   getUserVerificationCode: asyncHandler(async (req, res) => {
      try {
         // Let's check if the user is authenticated.
         const resultUserFromSession = await getUserFromSession(
            req.session.userId
         );

         if (!resultUserFromSession.success) {
            res.status(401).json({
               success: false,
               message: resultUserFromSession.error,
            });
            return;
         }

         const { user } = resultUserFromSession;

         // ---------------------------------------------

         const { type, isNewValue, newValue } = req.body as {
            type: 'email' | 'phone';
            isNewValue?: boolean;
            newValue?: string;
         };

         const contactDataValue = isNewValue
            ? newValue
            : type === 'email'
            ? user.email
            : user.phone;

         let isCodeWritten = false;
         if (contactDataValue) {
            isCodeWritten = await writeUserVerificationCode(user.id);
         }

         res.json({
            success: true,
            isCodeWritten,
            isContactDataEmpty: contactDataValue ? false : true,
         });
      } catch (error) {
         console.error('Error writing verification code:', error);
         res.status(500).json({
            success: false,
            message: 'Error writing verification code',
         });
      }
   }),

   checkUserVerificationCode: asyncHandler(async (req, res) => {
      try {
         // Let's check if the user is authenticated.
         const resultUserFromSession = await getUserFromSession(
            req.session.userId
         );

         if (!resultUserFromSession.success) {
            res.status(401).json({
               success: false,
               message: resultUserFromSession.error,
            });
            return;
         }

         const { user } = resultUserFromSession;

         // -----------------------------------

         const { code } = req.body as { code: string };

         const result = await verifyUserVerificationCode(user.id, code);

         if (!result.success) {
            res.status(401).json({
               success: false,
               message: result.error,
            });
            return;
         }

         await deleteVerificationCode(user.id);

         res.status(200).json({
            success: true,
         });
      } catch (error) {
         console.error('Error receiving verification code:', error);
         res.status(500).json({
            success: false,
            message: 'Error receiving verification code',
         });
      }
   }),

   checkUserContactData: asyncHandler(async (req, res) => {
      try {
         // Let's check if the user is authenticated.
         const resultUserFromSession = await getUserFromSession(
            req.session.userId
         );

         if (!resultUserFromSession.success) {
            res.status(401).json({
               success: false,
               message: resultUserFromSession.error,
            });
            return;
         }

         const { user } = resultUserFromSession;

         // ------------------------------------

         const { type, value } = req.body as {
            type: 'email' | 'phone';
            value?: string;
         };

         if (!value || typeof value !== 'string') {
            res.status(400).json({
               success: false,
               message: `An ${type} is required`,
            });
            return;
         }

         const userRepo = AppDataSource.getRepository(User);
         const existingUser = await userRepo.findOne({
            where:
               type === 'email'
                  ? { email: value.trim().toLowerCase() }
                  : { phone: value.trim().toLowerCase() },
         });

         if (existingUser) {
            res.status(400).json({
               success: false,
               message: `This ${type} is already in use`,
            });
            return;
         }

         const isCodeWritten = await writeUserVerificationCode(user.id);
         if (!isCodeWritten) {
            res.status(401).json({
               success: false,
               message: 'Error writing verification code',
            });
            return;
         }

         res.json({
            success: true,
         });
      } catch (error) {
         // type тут доступен только в блоке try, поэтому используем более общий текст
         console.error('Error checking contact data:', error);
         res.status(500).json({
            success: false,
            message: 'Error checking contact data',
         });
      }
   }),

   writeNewUserContactData: asyncHandler(async (req, res) => {
      try {
         // Let's check if the user is authenticated.
         const resultUserFromSession = await getUserFromSession(
            req.session.userId
         );

         if (!resultUserFromSession.success) {
            res.status(401).json({
               success: false,
               message: resultUserFromSession.error,
            });
            return;
         }

         const { user } = resultUserFromSession;

         //---------------------------------------

         const { type, value, code } = req.body as {
            type: 'email' | 'phone';
            value?: string;
            code: string;
         };

         if (!value || typeof value !== 'string') {
            res.status(400).json({
               success: false,
               message: `An ${type} is required`,
            });
            return;
         }

         const userRepo = AppDataSource.getRepository(User);
         const existingUser = await userRepo.findOne({
            where:
               type === 'email'
                  ? { email: value.trim().toLowerCase() }
                  : { phone: value.trim().toLowerCase() },
         });

         if (existingUser) {
            res.status(400).json({
               success: false,
               message: `This ${type} is already in use`,
            });
            return;
         }

         const result = await verifyUserVerificationCode(user.id, code);

         if (!result.success) {
            res.status(401).json({
               success: false,
               message: result.error,
            });
            return;
         }

         await deleteVerificationCode(user.id);

         const normalizedValue = value.trim().toLowerCase();

         if (type === 'email') {
            user.email = normalizedValue;
         } else if (type === 'phone') {
            user.phone = normalizedValue;
         }

         await userRepo.save(user);

         const userData = getUserData(user);

         res.status(201).json({
            success: true,
            message: 'New user contact data has been successfully saved',
            user: userData,
         });
      } catch (error) {
         console.error('Error writing user contact data:', error);
         res.status(500).json({
            success: false,
            message: 'Error writing user contact data',
         });
      }
   }),

   checkUserPassword: asyncHandler(async (req, res) => {
      try {
         // Let's check if the user is authenticated.
         const resultUserFromSession = await getUserFromSession(
            req.session.userId
         );

         if (!resultUserFromSession.success) {
            res.status(401).json({
               success: false,
               message: resultUserFromSession.error,
            });
            return;
         }

         const { user } = resultUserFromSession;

         // ------------------------------------

         const { password } = req.body as { password: string };

         const isPasswordValid = await bcrypt.compare(password, user.password);

         if (!isPasswordValid) {
            res.status(401).json({
               success: false,
               message: 'Incorrect password',
            });
            return;
         }

         res.status(200).json({
            success: true,
         });
      } catch (error) {
         console.error('Error during check user password:', error);
         res.status(500).json({
            success: false,
            message: 'Error during check user password',
         });
      }
   }),

   writeNewUserPassword: asyncHandler(async (req, res) => {
      try {
         // Let's check if the user is authenticated.
         const resultUserFromSession = await getUserFromSession(
            req.session.userId
         );

         if (!resultUserFromSession.success) {
            res.status(401).json({
               success: false,
               message: resultUserFromSession.error,
            });
            return;
         }

         const { user } = resultUserFromSession;

         // ---------------------------

         const { password } = req.body as { password?: string };

         if (!password || typeof password !== 'string') {
            res.status(400).json({
               success: false,
               message: 'Password is required',
            });
            return;
         }

         const hashedPassword = await bcrypt.hash(password, 10);

         user.password = hashedPassword;

         const userRepo = AppDataSource.getRepository(User);
         await userRepo.save(user);

         res.status(200).json({
            success: true,
         });
      } catch (error) {
         console.error('Error during writing new user password:', error);
         res.status(500).json({
            success: false,
            message: 'Error during writing new user password',
         });
      }
   }),

   deleteUserAccount: asyncHandler(async (req, res) => {
      try {
         // Let's check if the user is authenticated.
         const resultUserFromSession = await getUserFromSession(
            req.session.userId
         );

         if (!resultUserFromSession.success) {
            res.status(401).json({
               success: false,
               message: resultUserFromSession.error,
            });
            return;
         }

         const { user } = resultUserFromSession;

         // ---------------------------------------

         const { password } = req.body as { password: string };

         const isPasswordValid = await bcrypt.compare(password, user.password);

         if (!isPasswordValid) {
            res.status(401).json({
               success: false,
               message: 'Incorrect password',
            });
            return;
         }

         await deleteVerificationCode(user.id);

         const userRepo = AppDataSource.getRepository(User);
         await userRepo.remove(user);

         req.session.destroy((err) => {
            if (err) {
               console.error('Error destroying session:', err);
               return res.status(500).json({
                  success: false,
                  message: 'Error destroying session',
               });
            }

            res.clearCookie('auth.sid');

            res.status(200).json({
               success: true,
            });
         });
      } catch (error) {
         console.error('Error during deleting user account:', error);
         res.status(500).json({
            success: false,
            message: 'Error during deleting user account',
         });
      }
   }),

}
