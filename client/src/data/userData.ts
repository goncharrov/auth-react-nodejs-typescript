import iconPhone from '@assets/icon-phone-32.svg';
import iconMail from '@assets/icon-mail-32.svg';
import iconKey from '@assets/icon-key-32.svg';
import iconBasket from '@assets/icon-basket-32.svg';

export type ContactType = 'phone' | 'email' | 'password' | 'deleteAccount';

export type ContactInfoBase = {
   type: ContactType;
   titleStepOne: string;
   descriptionStepOne: string;
   inputTypeStepOne: string;
   value: string | null;
   icon: string;
};

export type ContactInfoWithThreeSteps = ContactInfoBase & {
   // есть три шага
   titleStepTwo: string;
   titleStepThree: string;
   descriptionStepTwo: string;
   descriptionStepThree: string;
   inputTypeStepTwo: string;
   inputTypeStepThree: string;
};

export type ContactInformation = {
   phone: ContactInfoWithThreeSteps & { type: 'phone' };
   email: ContactInfoWithThreeSteps & { type: 'email' };
   password: ContactInfoWithThreeSteps & { type: 'password' };
   deleteAccount: ContactInfoBase & {
      type: 'deleteAccount';
   };
};

export const contactInformation: ContactInformation = {
   phone: {
      type: 'phone',
      titleStepOne: 'Enter code from the message',
      titleStepTwo: 'Enter new phone number',
      titleStepThree: 'Enter code from the message',
      descriptionStepOne: 'Sent to ',
      descriptionStepTwo:
         'Enter a new phone number that will be linked to your account',
      descriptionStepThree: 'Sent to ',
      inputTypeStepOne: 'text',
      inputTypeStepTwo: 'tel',
      inputTypeStepThree: 'text',
      value: null,
      icon: iconPhone,
   },
   email: {
      type: 'email',
      titleStepOne: 'Enter code from the message',
      titleStepTwo: 'Enter new e-mail',
      titleStepThree: 'Enter code from the message',
      descriptionStepOne: 'Sent to ',
      descriptionStepTwo:
         'Enter a new e-mail that will be linked to your account',
      descriptionStepThree: 'Sent to ',
      inputTypeStepOne: 'text',
      inputTypeStepTwo: 'email',
      inputTypeStepThree: 'text',
      value: null,
      icon: iconMail,
   },
   password: {
      type: 'password',
      titleStepOne: 'Change password',
      titleStepTwo: 'Enter code from the message',
      titleStepThree: 'Change password',
      descriptionStepOne: 'Enter your current password',
      descriptionStepTwo: 'Sent to ',
      descriptionStepThree: 'Enter your new password',
      inputTypeStepOne: 'password',
      inputTypeStepTwo: 'text',
      inputTypeStepThree: 'password',
      value: null,
      icon: iconKey,
   },
   deleteAccount: {
      type: 'deleteAccount',
      titleStepOne: 'Delete account',
      descriptionStepOne: 'Enter your current password',
      inputTypeStepOne: 'password',
      value: null,
      icon: iconBasket,
   },
};

///////////////////////////////////////
// gender

export type GenderOption = {
   label: string;
   id: number;
};

export const genders: GenderOption[] = [
   { label: 'Male', id: 1 },
   { label: 'Female', id: 2 },
];

///////////////////////////////////////
// months

export type MonthOption = {
   label: string;
   id: number; // 0–11
};

export const months: MonthOption[] = [
   { label: 'Jan.', id: 0 },
   { label: 'Feb.', id: 1 },
   { label: 'Mar.', id: 2 },
   { label: 'Apr.', id: 3 },
   { label: 'May', id: 4 },
   { label: 'June', id: 5 },
   { label: 'July', id: 6 },
   { label: 'Aug.', id: 7 },
   { label: 'Sep.', id: 8 },
   { label: 'Oct.', id: 9 },
   { label: 'Nov.', id: 10 },
   { label: 'Dec.', id: 11 },
];
