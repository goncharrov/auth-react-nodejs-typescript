import { useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import { useAuth } from '@auth/useAuth';
import useClickOutside from '@shared/hooks/useClickOutside';

import imgUser from '@shared/assets/header/user-photo.jpg';
import iconGear from '@shared/assets/header/icon-gear.svg';
import iconExit from '@shared/assets/header/icon-exit.svg';

import styles from './HeaderUserAccount.module.css';

const HeaderUserAccount = (): React.JSX.Element => {
   const [isOpen, setIsOpen] = useState<boolean>(false);

   const navigate = useNavigate();
   const location = useLocation();
   const isUserAccount = location.pathname.includes('account');

   const selectorRef = useRef<HTMLDivElement | null>(null);

   const { user, logout } = useAuth();

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
               ? `${styles.headerUserWrapper} ${styles.active}`
               : styles.headerUserWrapper
         }
      >
         <button
            onClick={toggleOpen}
            className={isOpen ? styles.active : undefined}
         >
            <img src={imgUser} className={styles.headerUserImg} alt="Login" />
         </button>

         <div
            className={
               isOpen
                  ? `${styles.headerUserDropdownMenu} ${styles.active}`
                  : styles.headerUserDropdownMenu
            }
         >
            <div className={styles.headerUserDropdownMenuData}>
               <img src={imgUser} className={styles.userImg} alt="User photo" />
               <span>{user?.preferredName}</span>
            </div>
            <ul>
               {!isUserAccount && (
                  <li className={styles.headerUserDropdownMenuList}>
                     <button type="button" onClick={handleAccount}>
                        <img src={iconGear} alt="" />
                        Managing user profile
                     </button>
                  </li>
               )}

               <li className={styles.headerUserDropdownMenuList}>
                  <button
                     type="button"
                     className={styles.logout}
                     onClick={() => void handleLogout()}
                  >
                     <img src={iconExit} alt="" />
                     Logout
                  </button>
               </li>
            </ul>
         </div>
      </div>
   );
};

export default HeaderUserAccount;
