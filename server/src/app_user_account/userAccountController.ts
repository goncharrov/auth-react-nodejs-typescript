import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { AppDataSource } from '../config/database.js';
import { Users } from '../app_auth/authEntities.js';

import {
   makeStringCapitalized,
   getUserDataForSession,
   writeUserVerificationCode,
   verifyUserVerificationCode,
   deleteVerificationCode,
   getUserFromSession,
} from '../app_auth/authLogic.js';

const userRepo = AppDataSource.getRepository(Users);

// -------------------------- saveUserData --------------------------

export async function saveUserData(req: Request, res: Response) {
   try {
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
         return res.status(400).json({
            success: false,
            error: 'Fields "First name" and "Last name" are required',
         });
      }

      firstName = makeStringCapitalized(firstName);
      lastName = makeStringCapitalized(lastName);

      if (!preferredName) {
         preferredName = `${firstName} ${lastName}`;
      }

      const resultUserFromSession = await getUserFromSession(
         req.session.userId
      );

      if (!resultUserFromSession.success) {
         return res.status(401).json({
            success: false,
            error: resultUserFromSession.error,
         });
      }

      const { user } = resultUserFromSession;

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

      await userRepo.save(user);

      const userData = getUserDataForSession(user);

      req.session.userId = user.id;
      req.session.user = userData;
      req.session.isAuthenticated = true;

      return res.status(201).json({
         success: true,
         message: 'User data has been successfully saved',
         user: userData,
         csrfToken: res.locals.csrfToken,
      });
   } catch (error) {
      console.error('Error during saving user data:', error);
      return res.status(500).json({
         success: false,
         error: 'Server error',
      });
   }
}

// --------------------- getUserVerificationCode --------------------

export async function getUserVerificationCode(req: Request, res: Response) {
   try {
      const { type, isNewValue, newValue } = req.body as {
         type: 'email' | 'phone';
         isNewValue?: boolean;
         newValue?: string;
      };

      const resultUserFromSession = await getUserFromSession(
         req.session.userId
      );

      if (!resultUserFromSession.success) {
         return res.status(401).json({
            success: false,
            error: resultUserFromSession.error,
         });
      }

      const { user } = resultUserFromSession;

      const contactDataValue = isNewValue
         ? newValue
         : type === 'email'
           ? user.email
           : user.phone;

      let isCodeWritten = false;
      if (contactDataValue) {
         isCodeWritten = await writeUserVerificationCode(user.id);
      }

      return res.json({
         success: true,
         isCodeWritten,
         isContactDataEmpty: contactDataValue ? false : true,
         csrfToken: res.locals.csrfToken,
      });
   } catch (error) {
      console.error('Error writing verification code:', error);
      return res.status(500).json({
         success: false,
         error: 'Error writing verification code',
      });
   }
}

// ------------------- checkUserVerificationCode --------------------

export async function checkUserVerificationCode(req: Request, res: Response) {
   try {
      const { code } = req.body as { code: string };

      const resultUserFromSession = await getUserFromSession(
         req.session.userId
      );

      if (!resultUserFromSession.success) {
         return res.status(401).json({
            success: false,
            error: resultUserFromSession.error,
         });
      }

      const { user } = resultUserFromSession;

      const result = await verifyUserVerificationCode(user.id, code);

      if (!result.success) {
         return res.status(401).json({
            success: false,
            error: result.error,
         });
      }

      return res.status(201).json({
         success: true,
         csrfToken: res.locals.csrfToken,
      });
   } catch (error) {
      console.error('Error receiving verification code:', error);
      return res.status(500).json({
         success: false,
         error: 'Error receiving verification code',
      });
   }
}

// ---------------------- checkUserContactData ----------------------

export async function checkUserContactData(req: Request, res: Response) {
   try {
      const { type, value } = req.body as {
         type: 'email' | 'phone';
         value?: string;
      };

      if (!value || typeof value !== 'string') {
         return res.status(400).json({
            success: false,
            error: `An ${type} is required`,
         });
      }

      const existingUser = await userRepo.findOne({
         where:
            type === 'email'
               ? { email: value.trim().toLowerCase() }
               : { phone: value.trim().toLowerCase() },
      });

      if (existingUser) {
         return res.status(400).json({
            success: false,
            error: `This ${type} is already in use`,
         });
      }

      const resultUserFromSession = await getUserFromSession(
         req.session.userId
      );

      if (!resultUserFromSession.success) {
         return res.status(401).json({
            success: false,
            error: resultUserFromSession.error,
         });
      }

      const { user } = resultUserFromSession;

      const isCodeWritten = await writeUserVerificationCode(user.id);
      if (!isCodeWritten) {
         return res.status(401).json({
            success: false,
            error: 'Error writing verification code',
         });
      }

      return res.json({
         success: true,
         csrfToken: res.locals.csrfToken,
      });
   } catch (error) {
      // type тут доступен только в блоке try, поэтому используем более общий текст
      console.error('Error checking contact data:', error);
      return res.status(500).json({
         success: false,
         error: 'Error checking contact data',
      });
   }
}

// ------------------- writeNewUserContactData ----------------------

export async function writeNewUserContactData(req: Request, res: Response) {
   try {
      const { type, value, code } = req.body as {
         type: 'email' | 'phone';
         value?: string;
         code: string;
      };

      if (!value || typeof value !== 'string') {
         return res.status(400).json({
            success: false,
            error: `An ${type} is required`,
         });
      }

      const existingUser = await userRepo.findOne({
         where:
            type === 'email'
               ? { email: value.trim().toLowerCase() }
               : { phone: value.trim().toLowerCase() },
      });

      if (existingUser) {
         return res.status(400).json({
            success: false,
            error: `This ${type} is already in use`,
         });
      }

      const resultUserFromSession = await getUserFromSession(
         req.session.userId
      );

      if (!resultUserFromSession.success) {
         return res.status(401).json({
            success: false,
            error: resultUserFromSession.error,
         });
      }

      const { user } = resultUserFromSession;

      const result = await verifyUserVerificationCode(user.id, code);

      if (!result.success) {
         return res.status(401).json({
            success: false,
            error: result.error,
         });
      }

      const normalizedValue = value.trim().toLowerCase();

      if (type === 'email') {
         user.email = normalizedValue;
      } else if (type === 'phone') {
         user.phone = normalizedValue;
      }

      await userRepo.save(user);

      const userData = getUserDataForSession(user);

      req.session.user = userData;

      return res.status(201).json({
         success: true,
         message: 'New user contact data has been successfully saved',
         user: userData,
         csrfToken: res.locals.csrfToken,
      });
   } catch (error) {
      console.error('Error writing user contact data:', error);
      return res.status(500).json({
         success: false,
         error: 'Error writing user contact data',
      });
   }
}

// ------------------------ checkUserPassword -----------------------

export async function checkUserPassword(req: Request, res: Response) {
   try {
      const { password } = req.body as { password: string };

      const resultUserFromSession = await getUserFromSession(
         req.session.userId
      );

      if (!resultUserFromSession.success) {
         return res.status(401).json({
            success: false,
            error: resultUserFromSession.error,
         });
      }

      const { user } = resultUserFromSession;

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
         return res.status(401).json({
            success: false,
            error: 'Incorrect password',
         });
      }

      return res.status(201).json({
         success: true,
         csrfToken: res.locals.csrfToken,
      });
   } catch (error) {
      console.error('Error during check user password:', error);
      return res.status(500).json({
         success: false,
         error: 'Error during check user password',
      });
   }
}

// ----------------------- writeNewUserPassword ---------------------

export async function writeNewUserPassword(req: Request, res: Response) {
   try {
      const { password } = req.body as { password?: string };

      if (!password || typeof password !== 'string') {
         return res.status(400).json({
            success: false,
            error: 'Password is required',
         });
      }

      const resultUserFromSession = await getUserFromSession(
         req.session.userId
      );

      if (!resultUserFromSession.success) {
         return res.status(401).json({
            success: false,
            error: resultUserFromSession.error,
         });
      }

      const { user } = resultUserFromSession;

      const hashedPassword = await bcrypt.hash(password, 10);

      user.password = hashedPassword;
      await userRepo.save(user);

      return res.status(201).json({
         success: true,
         csrfToken: res.locals.csrfToken,
      });
   } catch (error) {
      console.error('Error during writing new user password:', error);
      return res.status(500).json({
         success: false,
         error: 'Error during writing new user password',
      });
   }
}

// -------------------------- deleteUserAccount ---------------------

export async function deleteUserAccount(req: Request, res: Response) {
   try {
      const { password } = req.body as { password: string };

      const resultUserFromSession = await getUserFromSession(
         req.session.userId
      );

      if (!resultUserFromSession.success) {
         return res.status(401).json({
            success: false,
            error: resultUserFromSession.error,
         });
      }

      const { user } = resultUserFromSession;

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
         return res.status(401).json({
            success: false,
            error: 'Incorrect password',
         });
      }

      await deleteVerificationCode(user.id);
      await userRepo.remove(user);

      req.session.destroy((err) => {
         if (err) {
            console.error('Error destroying session:', err);
            return res.status(500).json({
               success: false,
               error: 'Error destroying session',
            });
         }

         res.clearCookie('auth.sid');

         return res.status(201).json({
            success: true,
         });
      });
   } catch (error) {
      console.error('Error during deleting user account:', error);
      return res.status(500).json({
         success: false,
         error: 'Error during deleting user account',
      });
   }
}
