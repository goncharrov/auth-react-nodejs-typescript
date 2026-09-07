import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '@auth/useAuth';
import { accountApi } from '@account/accountApi';
import { checkContactData } from '@shared/utils/formValidation';
import { useErrorModal } from '@shared/hooks/useErrorModal';

import type {
   Step,
   CurrentForm,
   UserDataState,
   ContactInfoConfig,
} from '@account/accountTypes';

const EMPTY_USER_DATA: UserDataState = {
   currentValue: '',
   valueStepOne: '',
   valueStepTwo: '',
   valueStepThree: '',
};

export function useDataEntryFlow() {
   const { user, setUser, logout } = useAuth();
   const navigate = useNavigate();

   const { errorModal, showError, showAxiosError, closeError } =
      useErrorModal();

   const [currentForm, setCurrentForm] = useState<CurrentForm>('MainForm');
   const [formHistory, setFormHistory] = useState<CurrentForm[]>([]);
   const [step, setStep] = useState<Step>('');
   const [currentContactInfo, setCurrentContactInfo] =
      useState<ContactInfoConfig | null>(null);
   const [userData, setUserData] = useState<UserDataState>(EMPTY_USER_DATA);

   const backToMainForm = () => {
      setUserData(EMPTY_USER_DATA);
      setStep('');
      setFormHistory([]);
      setCurrentForm('MainForm');
      setCurrentContactInfo(null);
   };

   const handleManageUserData = (
      event: React.ChangeEvent<HTMLInputElement>
   ) => {
      const value = event.target.value;
      if (step === 'stepOne')
         setUserData((prev) => ({ ...prev, valueStepOne: value }));
      else if (step === 'stepTwo')
         setUserData((prev) => ({ ...prev, valueStepTwo: value }));
      else if (step === 'stepThree')
         setUserData((prev) => ({ ...prev, valueStepThree: value }));
   };

   const openDataEntryForm = async (info: ContactInfoConfig): Promise<void> => {
      setUserData(EMPTY_USER_DATA);

      if (info.type === 'email' || info.type === 'phone') {
         if (!user) return;

         const currentValue = user[info.type] ?? '';
         setUserData((prev) => ({ ...prev, currentValue }));

         try {
            const result = await accountApi.getUserVerificationCode({
               type: info.type,
               isNewValue: false,
               newValue: null,
            });

            if (result.data.isContactDataEmpty) {
               setStep('stepTwo');
            } else if (result.data.isCodeWritten) {
               setStep('stepOne');
            } else {
               return;
            }
         } catch (error: unknown) {
            showAxiosError(error);
            return;
         }
      } else if (info.type === 'password') {
         setStep('stepOne');
         if (user)
            setUserData((prev) => ({ ...prev, currentValue: user.email }));
      } else if (info.type === 'deleteAccount') {
         setStep('stepOne');
      }

      setCurrentContactInfo(info);
      setFormHistory((prev) => [...prev, currentForm]);
      setCurrentForm('DataEntryStep');
   };

   const submitDataEntryStep = async (
      event: React.SubmitEvent<HTMLFormElement> | React.MouseEvent,
      nextStep: Step | 'finish',
      info: ContactInfoConfig
   ): Promise<void> => {
      event.preventDefault();

      if (info.type === 'email' || info.type === 'phone') {
         if (step === 'stepOne') {
            if (userData.valueStepOne.trim() === '') {
               showError(
                  'Enter verification code',
                  `Sent to ${userData.currentValue}`,
                  null
               );
               return;
            }
            try {
               const result = await accountApi.checkUserVerificationCode(
                  userData.valueStepOne.trim()
               );
               if (!result.data.success) {
                  if (result.data.message)
                     showError(null, result.data.message, null);
                  return;
               }
            } catch (error: unknown) {
               showAxiosError(error);
               return;
            }
         } else if (step === 'stepTwo') {
            const validation = checkContactData(
               info.type,
               userData.valueStepTwo.trim()
            );
            if (!validation.isValid) {
               showError(
                  validation.reason,
                  validation.explanation,
                  validation.example
               );
               return;
            }
            try {
               const result = await accountApi.checkUserContactData({
                  type: info.type,
                  value: validation.value,
               });
               if (!result.data.success) {
                  if (result.data.message)
                     showError(null, result.data.message, null);
                  return;
               }
            } catch (error: unknown) {
               showAxiosError(error);
               return;
            }
         } else if (step === 'stepThree') {
            if (userData.valueStepThree.trim() === '') {
               showError(
                  'Enter verification code',
                  `Sent to ${userData.valueStepTwo}`,
                  null
               );
               return;
            }
            try {
               const result = await accountApi.writeNewUserContactData({
                  type: info.type,
                  value: userData.valueStepTwo.trim(),
                  code: userData.valueStepThree.trim(),
               });
               if (!result.data.success) {
                  if (result.data.message)
                     showError(null, result.data.message, null);
                  return;
               }
               if (result.data.user) setUser(result.data.user);
               backToMainForm();
               return;
            } catch (error: unknown) {
               showAxiosError(error);
               return;
            }
         }
      } else if (info.type === 'password') {
         if (step === 'stepOne') {
            if (nextStep === 'stepThree') {
               if (userData.valueStepOne === '') {
                  showError(null, 'Please enter your password', null);
                  return;
               }
               try {
                  const result = await accountApi.checkUserPassword(
                     userData.valueStepOne
                  );
                  if (!result.data.success) {
                     if (result.data.message)
                        showError(null, result.data.message, null);
                     return;
                  }
               } catch (error: unknown) {
                  showAxiosError(error);
                  return;
               }
            } else if (nextStep === 'stepTwo') {
               try {
                  const result = await accountApi.getUserVerificationCode({
                     type: 'email',
                     isNewValue: false,
                     newValue: null,
                  });
                  if (result.data.success) {
                     setStep('stepTwo');
                  } else {
                     if (result.data.message)
                        showError(null, result.data.message, null);
                     return;
                  }
               } catch (error: unknown) {
                  showAxiosError(error);
                  return;
               }
            }
         } else if (step === 'stepTwo') {
            if (userData.valueStepTwo.trim() === '') {
               showError(
                  'Enter verification code',
                  `Sent to ${userData.currentValue}`,
                  null
               );
               return;
            }
            try {
               const result = await accountApi.checkUserVerificationCode(
                  userData.valueStepTwo.trim()
               );
               if (!result.data.success) {
                  if (result.data.message)
                     showError(null, result.data.message, null);
                  return;
               }
            } catch (error: unknown) {
               showAxiosError(error);
               return;
            }
         } else if (step === 'stepThree') {
            if (userData.valueStepThree === '') {
               showError(null, 'Please enter new password', null);
               return;
            }
            try {
               const result = await accountApi.writeNewUserPassword(
                  userData.valueStepThree
               );
               if (!result.data.success) {
                  if (result.data.message)
                     showError(null, result.data.message, null);
                  return;
               }
               backToMainForm();
               return;
            } catch (error: unknown) {
               showAxiosError(error);
               return;
            }
         }
      } else if (info.type === 'deleteAccount') {
         if (step === 'stepOne') {
            if (userData.valueStepOne === '') {
               showError(null, 'Please enter your password', null);
               return;
            }
            try {
               const result = await accountApi.deleteUserAccount(
                  userData.valueStepOne
               );
               if (result && !result.data.success) {
                  if (result.data.message)
                     showError(null, result.data.message, null);
                  return;
               }
               await logout();
               void navigate('/');
               return;
            } catch (error: unknown) {
               showAxiosError(error);
               return;
            }
         } else {
            backToMainForm();
            return;
         }
      }

      if (nextStep !== 'finish') {
         setStep(nextStep);
         setFormHistory((prev) => [...prev, currentForm]);
         setCurrentForm('DataEntryStep');
      }
   };

   const goBack = (nextStep: Step | '') => {
      if (!currentContactInfo) {
         backToMainForm();
         return;
      }

      if (
         currentContactInfo.type === 'email' ||
         currentContactInfo.type === 'phone'
      ) {
         if (
            nextStep === 'stepOne' ||
            nextStep === 'stepThree' ||
            nextStep === ''
         ) {
            backToMainForm();
            return;
         } else if (nextStep === 'stepTwo') {
            setUserData((prev) => ({
               ...prev,
               valueStepTwo: '',
               valueStepThree: '',
            }));
            setStep(nextStep);
         }
      } else if (
         currentContactInfo.type === 'password' ||
         currentContactInfo.type === 'deleteAccount'
      ) {
         backToMainForm();
         return;
      }

      if (formHistory.length > 0) {
         const lastForm = formHistory[formHistory.length - 1];
         setFormHistory(formHistory.slice(0, -1));
         setCurrentForm(lastForm);
      }
   };

   return {
      errorModal,
      closeError,
      currentForm,
      step,
      userData,
      currentContactInfo,
      openDataEntryForm,
      submitDataEntryStep,
      goBack,
      handleManageUserData,
   };
}
