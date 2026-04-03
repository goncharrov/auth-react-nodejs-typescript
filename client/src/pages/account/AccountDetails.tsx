import { Fragment } from 'react';
import { useOutletContext } from 'react-router-dom';

import styles from './Account.module.css';
import stylesUserData from '@components/account/user-data-elements/UserDataElements.module.css';

import { UserPhotoNameLarge } from '@components/account/user-photo-name/UserPhotoName';
import ContactData from '@components/account/user-data-contacts/ContactData';
import UserData from '@components/account/user-data/UserData';

import DataEntryPlaceholder from '@components/account/user-data-entry-placeholder/DataEntryPlaceholder';

import iconBasket from '@assets/icon-basket-32.svg';

import type { AccountOutletContext } from '@type/accountTypes';

function useAccountOutletContext() {
   return useOutletContext<AccountOutletContext>();
}

function AccountDetails() {
   const {
      user,
      setUser,
      contactInformation,
      userData,
      currentContactInfo,
      currentForm,
      step,
      goToDataEntryPlaceholderForm,
      manageDataEntryPlaceholderForm,
      goBack,
      handleManageUserData,
   } = useAccountOutletContext();

   if (!user) {
      return null;
   }

   return (
      <Fragment>
         {currentForm === 'MainForm' && (
            <Fragment>
               <div className={styles.sectionGroup}>
                  <UserPhotoNameLarge name={user.preferredName} />
                  <UserData user={user} setUser={setUser} />
               </div>

               <div className={styles.sectionGroup}>
                  <div className={styles.title}>
                     <span>Contact details</span>
                  </div>

                  <ContactData
                     onNext={(info) => {
                        void goToDataEntryPlaceholderForm(info);
                     }}
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
                     className={stylesUserData.userDataElement}
                     onClick={() => {
                        void goToDataEntryPlaceholderForm(
                           contactInformation.deleteAccount
                        );
                     }}
                  >
                     <div className={stylesUserData.userDataValue}>
                        <img src={iconBasket} />
                        <span>Delete account</span>
                     </div>
                  </div>
               </div>
            </Fragment>
         )}

         {currentForm === 'DataEntryPlaceholder' && (
            <DataEntryPlaceholder
               onBack={goBack}
               onNext={(event, nextStep, info) => {
                  void manageDataEntryPlaceholderForm(event, nextStep, info);
               }}
               onManageUserData={handleManageUserData}
               currentContactInfo={currentContactInfo}
               newContactData={userData}
               step={step}
            />
         )}
      </Fragment>
   );
}

export default AccountDetails;
