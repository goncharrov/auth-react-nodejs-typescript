import { useAuth } from '@auth/authContext';

import HeaderLogo from '@shared/components/header/HeaderLogo';
import HeaderUserAuth from '@shared/components/header/HeaderUserAuth';
import HeaderUserAccount from '@shared/components/header/HeaderUserAccount';

import pageStyles from '@home/pages/Home.module.css';
import styles from './Header.module.css';

const Header = () => {

   const {  isAuthenticated, loading } = useAuth();

   return ( 
      <header className={styles.header}>
         <div className={` ${pageStyles.container} ${styles.headerItems}`}>
            
            <HeaderLogo />

            {isAuthenticated && !loading && <HeaderUserAccount />}
            {!isAuthenticated && !loading && <HeaderUserAuth />}

         </div>
      </header>
   );
}
 
export default Header;