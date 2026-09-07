import { Fragment } from 'react';

import { useAuth } from '@auth/useAuth';
import { contactInformation } from '@account/userData';
import { useDataEntryFlow } from '@account/hooks/useDataEntryFlow';

import { UserTitleLarge } from '@account/components/ui/user-title/UserTitle';
import ContactData from '@account/components/ui/user-data-contacts/ContactData';
import PersonalData from '@account/components/personal-data/PersonalData';
import DataEntryPlaceholder from '@account/components/data-entry-step/DataEntryStep';
import ErrorModal from '@shared/components/error-modal/ErrorModal';

import iconBasket from '@account/assets/icon-basket-32.svg';

import userDataStyles from '@account/components/ui/user-data-item/UserDataItem.module.css';
import styles from './Account.module.css';

function AccountDetails() {
   const { user, setUser } = useAuth();

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
                  <UserTitleLarge name={user.preferredName ?? ''} />
                  <PersonalData user={user} setUser={setUser} />
               </div>

               <div className={styles.sectionGroup}>
                  <div className={styles.title}>
                     <span>Contact details</span>
                  </div>
                  <ContactData
                     onNext={(info) => void openDataEntryForm(info)}
                     typeEditBtn="edit"
                     contactInformation={contactInformation}
                     user={user}
                  />
               </div>

               <div className={styles.sectionGroup}>
                  <div className={styles.title}>
                     <span>Deleting an account</span>
                  </div>
                  <div
                     className={userDataStyles.userDataElement}
                     onClick={() =>
                        void openDataEntryForm(contactInformation.deleteAccount)
                     }
                  >
                     <div className={userDataStyles.userDataValue}>
                        <img src={iconBasket} />
                        <span>Delete account</span>
                     </div>
                  </div>
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

export default AccountDetails;
