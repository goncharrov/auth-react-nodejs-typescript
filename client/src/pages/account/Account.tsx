import { Fragment, useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

import { useAuth } from '@http/useAuthAPI';
import { useAccount } from '@http/useAccountAPI';

import styles from './Account.module.css';

import LoadingPage from '@pages/LoadingPage';

import Header from '@components/account/header/Header';
import Sidebar from '@components/account/sidebar/Sidebar';

import ErrorModal from '@components/account/error-modal/ErrorModal';

import { checkContactData } from '@utils/formValidation';
import { contactInformation } from '@data/userData';

import type {
   Step,
   CurrentForm,
   UserDataState,
   ErrorModalState,
   ContactInfoConfig,
   AccountOutletContext,
} from '@type/accountTypes';

const VALID_SUBROUTES: string[] = ['main', 'details', 'security'];

function getErrorMessage(err: unknown): string {
   return err instanceof Error ? err.message : String(err);
}

function Account() {
   const [errorModal, setErrorModal] = useState<ErrorModalState>({
      isOpen: false,
      title: 'Error',
      reason: '',
      explanation: '',
      example: '',
   });

   const showError = (
      reason: string | null,
      explanation: string | null,
      example: string | null
   ) => {
      setErrorModal({
         isOpen: true,
         title: 'Error',
         reason: reason ?? '',
         explanation: explanation ?? '',
         example: example ?? '',
      });
   };

   const {
      getUserVerificationCode,
      checkUserVerificationCode,
      checkUserContactData,
      writeNewUserContactData,
      checkUserPassword,
      writeNewUserPassword,
      deleteUserAccount,
   } = useAccount();

   const closeError = () => {
      setErrorModal((prev) => ({ ...prev, isOpen: false }));
   };

   const [currentForm, setCurrentForm] = useState<CurrentForm>('MainForm');
   const [formHistory, setFormHistory] = useState<CurrentForm[]>([]);

   const [step, setStep] = useState<Step>('');

   const [currentContactInfo, setCurrentContactInfo] =
      useState<ContactInfoConfig | null>(null);

   const [userData, setUserData] = useState<UserDataState>({
      currentValue: '',
      valueStepOne: '',
      valueStepTwo: '',
      valueStepThree: '',
   });

   const { user, setUser, isAuthenticated, loading } = useAuth();

   const navigate = useNavigate();
   const location = useLocation();

   useEffect(() => {
      const subpath = location.pathname.replace('/account/', '').split('/')[0];
      if (subpath && !VALID_SUBROUTES.includes(subpath)) {
         void navigate('/account/main/', { replace: true });
      }
   }, [location.pathname, navigate]);

   useEffect(() => {
      if (!loading && isAuthenticated === false) {
         void navigate('/');
      }
   }, [isAuthenticated, loading, navigate]);

   const handleManageUserData = (
      event: React.ChangeEvent<HTMLInputElement>
   ) => {
      const value = event.target.value;

      if (step === 'stepOne') {
         setUserData((prev) => ({ ...prev, valueStepOne: value }));
      } else if (step === 'stepTwo') {
         setUserData((prev) => ({ ...prev, valueStepTwo: value }));
      } else if (step === 'stepThree') {
         setUserData((prev) => ({ ...prev, valueStepThree: value }));
      }
   };

   const goToDataEntryPlaceholderForm = async (
      info: ContactInfoConfig
   ): Promise<void> => {
      setUserData({
         currentValue: '',
         valueStepOne: '',
         valueStepTwo: '',
         valueStepThree: '',
      });

      if (info.type === 'email' || info.type === 'phone') {
         if (!user) {
            return;
         }
         const currentContactValue = user[info.type];

         setUserData((prev) => ({
            ...prev,
            currentValue: currentContactValue ?? '',
         }));

         const context = {
            type: info.type,
            isNewValue: false,
            newValue: null as string | null,
         };

         try {
            const result = await getUserVerificationCode(context);

            if (result.isContactDataEmpty) {
               setStep('stepTwo');
            } else {
               if (result.isCodeWritten) {
                  setStep('stepOne');
               } else {
                  return;
               }
            }
         } catch (error: unknown) {
            console.log('Error:', error);
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
      setCurrentForm('DataEntryPlaceholder');
   };

   const manageDataEntryPlaceholderForm = async (
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
               const result = await checkUserVerificationCode(
                  userData.valueStepOne.trim()
               );
               if (!result.success) {
                  if (result.error) showError(null, result.error, null);
                  return;
               }
            } catch (error: unknown) {
               showError(null, getErrorMessage(error), null);
               return;
            }
         } else if (step === 'stepTwo') {
            const isContactDataValid = checkContactData(
               info.type,
               userData.valueStepTwo.trim()
            );
            if (!isContactDataValid.isValid) {
               showError(
                  isContactDataValid.reason,
                  isContactDataValid.explanation,
                  isContactDataValid.example
               );
               return;
            }

            const context = {
               type: info.type,
               value: isContactDataValid.value,
            };

            try {
               const result = await checkUserContactData(context);
               if (!result.success) {
                  if (result.error) showError(null, result.error, null);
                  return;
               }
            } catch (error: unknown) {
               showError(null, getErrorMessage(error), null);
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

            const context = {
               type: info.type,
               value: userData.valueStepTwo.trim(),
               code: userData.valueStepThree.trim(),
            };

            try {
               const result = await writeNewUserContactData(context);
               if (!result.success) {
                  if (result.error) showError(null, result.error, null);
                  return;
               }
               if (result.user) setUser(result.user);
               backToMainPage();
               return;
            } catch (error: unknown) {
               showError(null, getErrorMessage(error), null);
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
                  const result = await checkUserPassword(userData.valueStepOne);

                  if (result.success) {
                     // остаёмся в stepOne, но nextStep пойдёт дальше
                  } else {
                     if (result.error) showError(null, result.error, null);
                     return;
                  }
               } catch (error: unknown) {
                  showError(null, getErrorMessage(error), null);
                  return;
               }
            } else if (nextStep === 'stepTwo') {
               const context = {
                  type: 'email' as const,
                  isNewValue: false,
                  newValue: null as string | null,
               };

               try {
                  const result = await getUserVerificationCode(context);
                  if (result.success) {
                     setStep('stepTwo');
                  } else {
                     if (result.error) showError(null, result.error, null);
                     return;
                  }
               } catch (error: unknown) {
                  console.log('Error:', error);
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
               const result = await checkUserVerificationCode(
                  userData.valueStepTwo.trim()
               );
               if (!result.success) {
                  if (result.error) showError(null, result.error, null);
                  return;
               }
            } catch (error: unknown) {
               showError(null, getErrorMessage(error), null);
               return;
            }
         } else if (step === 'stepThree') {
            if (userData.valueStepThree === '') {
               showError(null, 'Please enter new password', null);
               return;
            }
            try {
               const result = await writeNewUserPassword(
                  userData.valueStepThree
               );
               if (!result.success) {
                  if (result.error) showError(null, result.error, null);
                  return;
               }
               backToMainPage();
               return;
            } catch (error: unknown) {
               showError(null, getErrorMessage(error), null);
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
               const result = await deleteUserAccount(userData.valueStepOne);
               if (result && !result.success) {
                  if (result.error) showError(null, result.error, null);
                  return;
               }
               void navigate('/');
               return;
            } catch (error: unknown) {
               showError(null, getErrorMessage(error), null);
               return;
            }
         } else {
            backToMainPage();
            return;
         }
      }

      if (nextStep !== 'finish') {
         setStep(nextStep);
         setFormHistory((prev) => [...prev, currentForm]);
         setCurrentForm('DataEntryPlaceholder');
      }
   };

   const backToMainPage = () => {
      setUserData({
         currentValue: '',
         valueStepOne: '',
         valueStepTwo: '',
         valueStepThree: '',
      });
      setStep('');
      setFormHistory([]);
      setCurrentForm('MainForm');
      setCurrentContactInfo(null);
   };

   const goBack = (nextStep: Step | '') => {
      if (!currentContactInfo) {
         backToMainPage();
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
            backToMainPage();
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
         backToMainPage();
         return;
      }

      if (formHistory.length > 0) {
         const lastForm = formHistory[formHistory.length - 1];
         const newHistory = formHistory.slice(0, -1);
         setFormHistory(newHistory);
         setCurrentForm(lastForm);
      }
   };

   if (loading || isAuthenticated === undefined) {
      return <LoadingPage />;
   }

   const outletContext: AccountOutletContext = {
      user,
      setUser,
      contactInformation,
      userData,
      currentContactInfo: currentContactInfo ?? contactInformation.email, // заглушка, чтобы не было null
      currentForm,
      step,
      goToDataEntryPlaceholderForm,
      manageDataEntryPlaceholderForm,
      goBack,
      handleManageUserData,
   };

   return (
      <Fragment>
         <Header />

         <div className={styles.mainWrapper}>
            <div className={styles.formContainer}>
               <div className={styles.formContent}>
                  <Sidebar />

                  <main className={styles.mainContent}>
                     <div className={styles.contentSection}>
                        <Outlet context={outletContext} />
                     </div>
                  </main>
               </div>
            </div>
         </div>

         <ErrorModal
            isOpen={errorModal.isOpen}
            onClose={closeError}
            title={errorModal.title}
            reason={errorModal.reason ?? undefined}
            explanation={errorModal.explanation ?? undefined}
            example={errorModal.example ?? undefined}
         />
      </Fragment>
   );
}

export default Account;
