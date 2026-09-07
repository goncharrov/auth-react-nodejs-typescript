import { Fragment } from 'react';

import { contactInformation } from '../userData';
import { useDataEntryFlow } from '@account/hooks/useDataEntryFlow';

import DataEntryPlaceholder from '@account/components/data-entry-step/DataEntryStep';
import ErrorModal from '@shared/components/error-modal/ErrorModal';

import iconArrow from '@shared/assets/icon-arrow-16.svg';
import iconKey from '@account/assets/icon-key-32.svg';

import userDataStyles from '@account/components/ui/user-data-item/UserDataItem.module.css';
import styles from './Account.module.css';

function AccountSecurity() {
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

   return (
      <Fragment>
         {currentForm === 'MainForm' && (
            <div className={styles.sectionGroup}>
               <div className={styles.title}>
                  <span>Password</span>
               </div>
               <div
                  className={userDataStyles.userDataElement}
                  onClick={() =>
                     void openDataEntryForm(contactInformation.password)
                  }
               >
                  <div className={userDataStyles.userDataValue}>
                     <img src={iconKey} />
                     <span>Change password</span>
                  </div>
                  <img src={iconArrow} className={userDataStyles.imgArrow} />
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

export default AccountSecurity;
