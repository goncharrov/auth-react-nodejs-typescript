import { Fragment } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '@auth/useAuth';
import { contactInformation } from '@account/userData';
import { useDataEntryFlow } from '@account/hooks/useDataEntryFlow';

import { UserTitle } from '@account/components/ui/user-title/UserTitle';
import ContactData from '@account/components/ui/user-data-contacts/ContactData';
import DataEntryPlaceholder from '@account/components/data-entry-step/DataEntryStep';
import ErrorModal from '@shared/components/error-modal/ErrorModal';

import styles from './Account.module.css';

function AccountMain() {
   const { user } = useAuth();
   const navigate = useNavigate();

   const {
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
   } = useDataEntryFlow();

   if (!user) return null;

   return (
      <Fragment>
         {currentForm === 'MainForm' && (
            <div className={styles.section}>
               <div className={styles.sectionGroup}>
                  <UserTitle
                     name={user.preferredName ?? ''}
                     onClick={() => void navigate('/account/details/')}
                  />
               </div>

               <div className={styles.sectionGroup}>
                  <div className={styles.title}>
                     <span>Contact details</span>
                  </div>
                  <ContactData
                     onNext={(info) => void openDataEntryForm(info)}
                     typeEditBtn="arrow"
                     contactInformation={contactInformation}
                     user={user}
                  />
               </div>
            </div>
         )}

         {currentForm === 'DataEntryStep' && currentContactInfo && (
            <DataEntryPlaceholder
               onBack={goBack}
               onNext={(event, nextStep, info) =>
                  void submitDataEntryStep(event, nextStep, info)
               }
               onManageUserData={handleManageUserData}
               currentContactInfo={currentContactInfo}
               newContactData={userData}
               step={step}
            />
         )}

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

export default AccountMain;
