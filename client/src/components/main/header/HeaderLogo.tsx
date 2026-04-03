import styles from './HeaderLogo.module.css';

import iconLogo from '@assets/logo-dark.svg';

const HeaderLogo = () => {
   return (
      <div className={styles.headerLogo}>
         <a href="/">
            <img src={iconLogo} alt="Ulubike" />
         </a>
      </div>
   );
};

export default HeaderLogo;
