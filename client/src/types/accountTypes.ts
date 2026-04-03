export type Step = '' | 'stepOne' | 'stepTwo' | 'stepThree';

export type CurrentForm = 'MainForm' | 'DataEntryPlaceholder';

export type ContactType = 'email' | 'phone' | 'password' | 'deleteAccount';

export type Gender = 'male' | 'female' | 'unspecified';

import type { User } from '@type/authTypes';

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

export interface UserDataState {
   currentValue: string;
   valueStepOne: string;
   valueStepTwo: string;
   valueStepThree: string;
}

export interface ErrorModalState {
   isOpen: boolean;
   title: string;
   reason: string | null;
   explanation: string | null;
   example: string | null;
}

export interface AccountOutletContext {
   user: User | null;
   setUser: React.Dispatch<React.SetStateAction<User | null>>;
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

// ===== Account API types =====

// General format for a successful response with a user
export interface ApiBaseResponse {
   success: boolean;
   csrfToken?: string;
}

// General format for a failed response
export interface ErrorResponse {
   success: false;
   error?: string;
   csrfToken?: string;
}
