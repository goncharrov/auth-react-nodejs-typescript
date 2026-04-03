import styles from './Header.module.css';

import HeaderLogo from '@components/main/header/HeaderLogo';
import HeaderUserAuth from '@components/main/header/HeaderUserAuth';
import HeaderUserAccount from '@components/main/header/HeaderUserAccount';

import { useAuth } from '@http/useAuthAPI';

const Header = () => {
   const { isAuthenticated, loading } = useAuth();

   return (
      <header className={styles.header}>
         <div className={styles.headerItems}>
            <div className={styles.headerMain}>
               <HeaderLogo />
            </div>

            {isAuthenticated && !loading && <HeaderUserAccount />}
            {!isAuthenticated && !loading && <HeaderUserAuth />}
         </div>
      </header>
   );
};

export default Header;
