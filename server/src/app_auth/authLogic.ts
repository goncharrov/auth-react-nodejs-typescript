import { createHash } from 'crypto';
import { AppDataSource } from '../config/database.js';
import { Users, UsersVerificationCode } from '@auth/authEntities.js';

export function makeStringCapitalized(str: string): string {
   const normalized = str.trim().toLowerCase();
   return normalized.charAt(0).toUpperCase() + normalized.slice(1);
}

export function getUserData(
   { email, phone, firstName, lastName, preferredName, birthday, gender, role }: Users
) {
   return { email, phone, firstName, lastName, preferredName, birthday, gender, role };
}

function hashCode(code: string): string {
   return createHash('sha256').update(code).digest('hex');
}

export async function writeUserVerificationCode( userId: number ): Promise<boolean> {
   const currentDate = new Date();
   const expireDate = new Date(currentDate.getTime() + 5 * 60 * 1000);

   // let code = Math.floor(Math.random() * 10000)
   //    .toString()
   //    .padStart(4, '0');
   let code = '5555';
   code = hashCode(code);

   try {
      const verificationRepo = AppDataSource.getRepository(
         UsersVerificationCode
      );

      const loginEmailCode = await verificationRepo.findOne({
         where: { userId },
      });

      if (loginEmailCode) {
         loginEmailCode.code = code;
         loginEmailCode.expire = expireDate;
         await verificationRepo.save(loginEmailCode);
      } else {
         await verificationRepo.save(
            verificationRepo.create({
               userId,
               code,
               expire: expireDate,
            })
         );
      }

      // Next, you need to send the code to the user's email or phone number.

      return true;
   } catch (error) {
      console.error('Error during writing login email code:', error);
      return false;
   }
}

export async function deleteVerificationCode(userId: number): Promise<void> {
   const verificationRepo = AppDataSource.getRepository(UsersVerificationCode);
   await verificationRepo.delete({ userId });
}

export async function verifyUserVerificationCode(
   userId: number,
   code: string
): Promise<{ success: true } | { success: false; error: string }> {
   const verificationRepo = AppDataSource.getRepository(UsersVerificationCode);

   // Search verification code
   const verificationCode = await verificationRepo.findOne({
      where: { userId },
   });

   if (!verificationCode) {
      return {
         success: false,
         error: 'Error receiving verification code.',
      };
   }

   // Check verification code
   if (hashCode(code) !== verificationCode.code) {
      return {
         success: false,
         error: 'The code you entered is incorrect',
      };
   }

   if (new Date() > verificationCode.expire) {
      return {
         success: false,
         error: 'The current verification code is out of date. Get new code.',
      };
   }

   return { success: true };
}

export async function getUserFromSession( userId: number | undefined ): 
   Promise<{ success: true; user: Users } | { success: false; error: string }> {
   
   if (!userId) {
      return {
         success: false,
         error: 'Error getting session user',
      };
   }

   const userRepo = AppDataSource.getRepository(Users);
   const user = await userRepo.findOne({ where: { id: userId } });

   if (!user) {
      return {
         success: false,
         error: 'Incorrect session user id',
      };
   }

   return { success: true, user };
}