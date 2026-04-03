import { useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import useClickOutside from '@hooks/useClickOutside';

import { useAuth } from '@http/useAuthAPI';

import styles from './HeaderUserAccount.module.css';

import imgUser from '@assets/user-photo.jpg';
import iconGear from '@assets/icon-gear.svg';
import iconExit from '@assets/icon-exit.svg';

const HeaderUserAccount = (): React.JSX.Element => {
   const [isOpen, setIsOpen] = useState<boolean>(false);
   const { user, logout } = useAuth();

   const navigate = useNavigate();
   const location = useLocation();
   const isUserAccount = location.pathname.includes('account');

   const selectorRef = useRef<HTMLDivElement | null>(null);

   function toggleOpen(): void {
      setIsOpen((prev) => !prev);
   }

   useClickOutside(selectorRef, () => {
      if (isOpen) {
         toggleOpen();
      }
   });

   const handleAccount = (): void => {
      void navigate('/account/main/');
   };

   const handleLogout = async (): Promise<void> => {
      await logout();
      void navigate('/auth/');
   };

   return (
      <div
         ref={selectorRef}
         className={
            isOpen
               ? `${styles.userAccountButtonWrapper} ${styles.active}`
               : styles.userAccountButtonWrapper
         }
      >
         <div className={styles.userAccountButton}>
            <button
               style={{ border: 'none' }}
               className={isOpen ? styles.active : undefined}
               onClick={toggleOpen}
            >
               <img
                  src={imgUser}
                  className={styles.userAccountButtonImg}
                  alt="Login"
               />
            </button>

            <div
               className={
                  isOpen
                     ? `${styles.userAccountDropdownMenu} ${styles.active}`
                     : styles.userAccountDropdownMenu
               }
            >
               <div className={styles.userAccountDropdownMenuUserData}>
                  <img src={imgUser} className={styles.userImg} alt="User" />
                  <span className={styles.userNameLarge}>
                     {user?.preferredName}
                  </span>
               </div>
               <ul>
                  {!isUserAccount && (
                     <li>
                        <div
                           onClick={handleAccount}
                           className={styles.userAccountDropdownMenulistItem}
                        >
                           <img
                              src={iconGear}
                              className={styles.userAccountDropdownMenuListImg}
                              alt="Settings"
                           />
                           <span>Managing user profile</span>
                        </div>
                     </li>
                  )}
                  <li>
                     <div
                        onClick={() => {
                           void handleLogout();
                        }}
                        className={styles.userAccountDropdownMenulistItem}
                     >
                        <img
                           src={iconExit}
                           className={styles.userAccountDropdownMenuListImg}
                           alt="Logout"
                        />
                        <span className={styles.logout}>Logout</span>
                     </div>
                  </li>
               </ul>
            </div>
         </div>
      </div>
   );
};

export default HeaderUserAccount;
