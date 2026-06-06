import HeaderLogo from '@shared/components/header/HeaderLogo';
import HeaderUserAccount from '@shared/components/header/HeaderUserAccount';

import pageStyles from '@account/pages/Account.module.css';
import styles from './Header.module.css';

const Header = () => {
   return (
      <header className={styles.header}>
         <div className={` ${pageStyles.container} ${styles.headerItems}`}>
            <HeaderLogo />
            <HeaderUserAccount />
         </div>
      </header>
   );
};

export default Header;
