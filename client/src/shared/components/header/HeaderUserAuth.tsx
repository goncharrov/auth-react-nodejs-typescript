import { useNavigate } from 'react-router-dom';

import styles from './HeaderUserAuth.module.css';
import iconUserEmpty from '@shared/assets/header/icon-user-24.svg';

const HeaderUserAuth = () => {
   const navigate = useNavigate();

   const handleAuth = () => {
      void navigate('/auth/');
   };

   return ( 
      <div className={styles.headerLoginWrapper}>
         <button onClick={handleAuth}>
            <img src={iconUserEmpty} className={styles.headerLoginImg} alt="Login" />
         </button>
      </div>
   );
}
 
export default HeaderUserAuth;