import type { User } from '../auth/authTypes';

// ===== Account API types =====

export type UserData = Pick<
   User,
   'firstName' | 'lastName' | 'preferredName' | 'gender' | 'birthday'
>;

// ===== Account Page types =====

export type ContactType = 'email' | 'phone' | 'password' | 'deleteAccount';

export type Step = '' | 'stepOne' | 'stepTwo' | 'stepThree';
export type CurrentForm = 'MainForm' | 'DataEntryPlaceholder';

export interface UserDataState {
   currentValue: string;
   valueStepOne: string;
   valueStepTwo: string;
   valueStepThree: string;
}

export interface ContactInfoConfig {
   type: ContactType;
   icon: string;
   inputTypeStepOne: string;
   inputTypeStepTwo?: string;
   inputTypeStepThree?: string;
   titleStepOne: string;
   titleStepTwo?: string;
   titleStepThree?: string;
   descriptionStepOne: string;
   descriptionStepTwo?: string;
   descriptionStepThree?: string;
}

export interface ContactInformation {
   phone: ContactInfoConfig;
   email: ContactInfoConfig;
   password: ContactInfoConfig;
   deleteAccount: ContactInfoConfig;
}

export interface AccountOutletContext {
   user: User | null;
   setUser: (user: User | null) => void;
   contactInformation: ContactInformation;
   userData: UserDataState;
   currentContactInfo: ContactInfoConfig;
   currentForm: CurrentForm;
   step: Step;
   goToDataEntryPlaceholderForm: (
      currentContactInfo: ContactInfoConfig
   ) => Promise<void> | void;
   manageDataEntryPlaceholderForm: (
      event: React.SubmitEvent<HTMLFormElement> | React.MouseEvent,
      nextStep: Step | 'finish',
      currentContactInfo: ContactInfoConfig
   ) => Promise<void> | void;
   goBack: (nextStep: Step | '') => void;
   handleManageUserData: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface ErrorModalState {
   isOpen: boolean;
   title: string;
   reason: string | null;
   explanation: string | null;
   example: string | null;
}

// ===== Selector options =====

export interface GenderOption {
   label: string;
   id: number;
}

export interface MonthOption {
   label: string;
   id: number; // 0–11
}
