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
} from '@auth/auth.logic.js';

import { asyncHandler } from '@middleware/asyncHandler.js';

export const authController = {

   // Checking the existence of an email

   checkEmail: asyncHandler(async (req, res) => {
      try {
         const { email } = req.body;

         if (!email || typeof email !== 'string') {
            res.status(400).json({
               success: false,
               message: 'Email is required',
            });
            return;
         }

         const userRepo = AppDataSource.getRepository(User);
         const user = await userRepo.findOne({
            where: { email: email.trim().toLowerCase() },
         });

         let codeIsWritten = false;
         if (user) {
            codeIsWritten = await writeUserVerificationCode(user.id);
         }

         res.status(200).json({
            success: true,
            exists: !!user,
            message: user ? 'User found' : 'User not found',
            authorizationType: codeIsWritten ? 'code' : 'password',
         });
      } catch (error) {
         console.error('Error checking email:', error);
         res.status(500).json({
            success: false,
            message: 'Error checking email',
         });
      }
   }),

   // User login with password

   loginWithPassword: asyncHandler(async (req, res) => {
      try {
         const { email, password } = req.body;

         // Validation
         if (!email || !password) {
            res.status(400).json({
               success: false,
               message: 'Email and password are required',
            });
            return;
         }

         // Search for a user
         const userRepo = AppDataSource.getRepository(User);
         const user = await userRepo.findOne({
            where: { email: email.trim().toLowerCase() },
         });

         if (!user) {
            res.status(401).json({
               success: false,
               message: 'Incorrect email',
            });
            return;
         }

         // Check password
         const isPasswordValid = await bcrypt.compare(password, user.password);

         if (!isPasswordValid) {
            res.status(401).json({
               success: false,
               message: 'Incorrect password',
            });
            return;
         }

         const userData = getUserData(user);

         // Create session
         req.session.userId = user.id;
         req.session.isAuthenticated = true;

         await deleteVerificationCode(user.id);

         res.status(200).json({
            success: true,
            user: userData,
         });
      } catch (error) {
         console.error('Error during login:', error);
         res.status(500).json({
            success: false,
            message: 'Error during login',
         });
      }
   }),

   // User login with code

   loginWithCode: asyncHandler(async (req, res) => {
      try {
         const { email, code } = req.body;

         // Validation
         if (!email || !code) {
            res.status(400).json({
               success: false,
               message: 'Email and code are required',
            });
            return;
         }

         // Search for a user
         const userRepo = AppDataSource.getRepository(User);
         const user = await userRepo.findOne({
            where: { email: email.trim().toLowerCase() },
         });

         if (!user) {
            res.status(401).json({
               success: false,
               message: 'Incorrect email',
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

         const userData = getUserData(user);

         // Create session
         req.session.userId = user.id;
         req.session.isAuthenticated = true;

         await deleteVerificationCode(user.id);

         res.status(200).json({
            success: true,
            user: userData,
         });
      } catch (error) {
         console.error('Error during login:', error);
         res.status(500).json({
            success: false,
            message: 'Error during login',
         });
      }
   }),

   // Send new login code

   sendNewLoginCode: asyncHandler(async (req, res) => {
      try {
         const { email } = req.body;

         if (!email || typeof email !== 'string') {
            res.status(400).json({
               success: false,
               message: 'Email is required',
            });
            return;
         }

         const userRepo = AppDataSource.getRepository(User);
         const user = await userRepo.findOne({
            where: { email: email.trim().toLowerCase() },
         });

         if (!user) {
            res.status(401).json({
               success: false,
               message: 'Incorrect email',
            });
            return;
         }

         const codeIsWritten = await writeUserVerificationCode(user.id);

         res.status(200).json({
            success: true,
            codeIsWritten,
         });
      } catch {
         res.status(500).json({
            success: false,
            message: 'Error sending code. Login with email.',
         });
      }
   }),

   // User registration

   registration: asyncHandler(async (req, res) => {
      const { firstName, lastName, email, password } = req.body;

      // Validation
      if (!firstName || !lastName || !email || !password) {
         res.status(400).json({
            success: false,
            message: 'All fields are required',
         });
         return;
      }

      if (password.length < 8) {
         res.status(400).json({
            success: false,
            message: 'Password must contains at least 8 characters',
         });
         return;
      }

      try {
         // Checking email uniqueness
         const userRepo = AppDataSource.getRepository(User);
         const existingUser = await userRepo.findOne({
            where: { email: email.trim().toLowerCase() },
         });

         if (existingUser) {
            res.status(400).json({
               success: false,
               message: 'There is already user with this e-mail address',
            });
            return;
         }

         const userFirstName = makeStringCapitalized(firstName);
         const userLastName = makeStringCapitalized(lastName);
         const hashedPassword = await bcrypt.hash(password, 10);

         // Create user
         const user = await userRepo.save(
            userRepo.create({
               email: email.trim().toLowerCase(),
               firstName: userFirstName,
               lastName: userLastName,
               preferredName: `${userFirstName} ${userLastName}`,
               password: hashedPassword,
               createdAt: new Date(),
            })
         );

         const userData = getUserData(user);

         // Create session
         req.session.userId = user.id;
         req.session.isAuthenticated = true;

         res.status(201).json({
            success: true,
            message: 'The user has been successfully registered',
            user: userData,
         });
      } catch (error: unknown) {
         console.error('Error during registration:', error);

         // Обработка ошибок TypeORM
         const pgCode =
            typeof error === 'object' &&
            error !== null &&
            'code' in error &&
            typeof (error as { code: unknown }).code === 'string'
               ? (error as { code: string }).code
               : undefined;

         if (pgCode === '23505') {
            // Unique constraint violation
            res.status(400).json({
               success: false,
               message: 'There is already user with this e-mail address',
            });
            return;
         }

         res.status(500).json({
            success: false,
            message: `Server error: ${error}`,
         });
      }
   }),

   // Get current user
   getCurrentUser: asyncHandler(async (req, res) => {
      try {
         if (!req.session.isAuthenticated || !req.session.userId) {
            res.json({
               success: true,
               user: null,
            });
            return;
         }

         const userRepo = AppDataSource.getRepository(User);
         const user = await userRepo.findOne({
            where: { id: req.session.userId },
            select: {
               id: true,
               email: true,
               phone: true,
               firstName: true,
               lastName: true,
               preferredName: true,
               birthday: true,
               gender: true,
               role: true,
            },
         });

         // Clear session if user not found
         if (!user) {
            req.session.destroy(() => {});
            res.json({
               success: true,
               user: null,
            });
            return;
         }

         res.status(200).json({
            success: true,
            user,
         });
      } catch (error) {
         console.error('Error getting current user:', error);
         res.status(500).json({
            success: false,
            message: 'Error getting current user',
         });
      }
   }),

   // User logout

   logout: asyncHandler(async (req, res) => {
      try {
         req.session.destroy((err) => {
            if (err) {
               console.error('Error destroying session:', err);
               return res.status(500).json({
                  success: false,
                  message: 'Error destroying session',
               });
            }

            res.clearCookie('connect.sid');
            res.json({
               success: true,
            });
         });
      } catch (error) {
         console.error('Error during logout:', error);
         res.status(500).json({
            success: false,
            message: 'Error during logout',
         });
      }
   }),

};
