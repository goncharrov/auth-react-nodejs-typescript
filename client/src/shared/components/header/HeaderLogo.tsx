import iconLogo from '@shared/assets/header/logo-dark.svg';
import styles from './HeaderLogo.module.css';

const HeaderLogo = () => {
   return (
      <a className= {styles.headerLogo} href='/'><img src={iconLogo} alt="Ulubike" /></a>      
   );
}
 
export default HeaderLogo;