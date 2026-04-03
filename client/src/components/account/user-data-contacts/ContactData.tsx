import styles from './ContactData.module.css';

import iconArrow from '@assets/icon-arrow-16.svg';
import type { ContactInformation, ContactInfoConfig } from '@type/accountTypes';
import type { User } from '@type/authTypes';

interface ContactDataProps {
   onNext: (info: ContactInfoConfig) => void;
   typeEditBtn: 'arrow' | 'edit';
   contactInformation: ContactInformation;
   user: User;
}

function ContactData({
   onNext,
   typeEditBtn,
   contactInformation,
   user,
}: ContactDataProps) {
   return (
      <div>
         <div
            className={styles.userContactElement}
            onClick={() => onNext(contactInformation.phone)}
         >
            <div className={styles.userContactCategory}>
               <img src={contactInformation.phone.icon} />
               <div className={styles.userContactContent}>
                  <div className={styles.contactTitle}>Phone</div>
                  <div className={styles.contactValue}>
                     {user.phone !== null ? user.phone : ' - - - - - - '}
                  </div>
               </div>
            </div>
            {typeEditBtn === 'arrow' ? (
               <img src={iconArrow} className={styles.imgArrow} />
            ) : (
               <div className={styles.userContactEdit}>
                  <span>Edit</span>
               </div>
            )}
         </div>

         <div
            className={styles.userContactElement}
            onClick={() => onNext(contactInformation.email)}
         >
            <div className={styles.userContactCategory}>
               <img src={contactInformation.email.icon} />
               <div className={styles.userContactContent}>
                  <div className={styles.contactTitle}>E-mail</div>
                  <div className={styles.contactValue}>{user.email}</div>
               </div>
            </div>
            {typeEditBtn === 'arrow' ? (
               <img src={iconArrow} className={styles.imgArrow} />
            ) : (
               <div className={styles.userContactEdit}>
                  <span>Edit</span>
               </div>
            )}
         </div>
      </div>
   );
}

export default ContactData;
