import { parsePhoneNumberFromString } from 'libphonenumber-js';

export function isEmpty(value: unknown): boolean {
   if (value === null || value === undefined) {
      return true;
   }

   if (typeof value === 'string') {
      return value.trim().length === 0;
   }

   if (Array.isArray(value)) {
      return value.length === 0;
   }

   if (typeof value === 'object') {
      return Object.keys(value).length === 0;
   }

   return false;
}

export function isEmailValid(email: string): boolean {
   const SIMPLE_EMAIL_REGEXP = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
   return SIMPLE_EMAIL_REGEXP.test(email);
}

type CheckContactDataResult = {
   isValid: boolean;
   reason: string;
   explanation: string;
   example: string;
   value: string;
};

export function checkContactData(
   userDataType: 'email' | 'phone',
   userDataValue: string
): CheckContactDataResult {
   const result: CheckContactDataResult = {
      isValid: true,
      reason: '',
      explanation: '',
      example: '',
      value: userDataValue,
   };

   if (userDataType === 'email') {
      if (isEmpty(userDataValue)) {
         result.isValid = false;
         result.reason = 'E-mail is not specified';
      } else if (!isEmailValid(userDataValue)) {
         result.isValid = false;
         result.reason = 'Invalid e-mail';
      }

      if (!result.isValid) {
         result.explanation = 'Please enter the e-mail in correct format';
         result.example = 'Example: name@mail.com';
      }
   } else if (userDataType === 'phone') {
      const phone = parsePhoneNumberFromString(userDataValue);

      if (!phone || !phone.isValid()) {
         result.isValid = false;
         result.reason = 'Phone is not specified';
         result.explanation = 'Please enter the number in international format';
         result.example = 'Example: +77 (XXX) XXX-XX-XX';
      } else {
         result.value = phone.formatInternational();
      }
   }

   return result;
}
