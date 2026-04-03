import styles from './Header.module.css';
import HeaderUserAccount from '@components/main/header/HeaderUserAccount';

import HeaderLogo from '@components/main/header/HeaderLogo';

const Header = () => {
   return (
      <header className={styles.header}>
         <div className={styles.headerWrapper}>
            <div className={styles.headerItems}>
               <HeaderLogo />
               <HeaderUserAccount />
            </div>
         </div>
      </header>
   );
};

export default Header;
