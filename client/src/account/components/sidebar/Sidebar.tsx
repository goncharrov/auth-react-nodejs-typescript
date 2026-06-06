import { Link, useLocation } from 'react-router-dom';

import iconAccountMain from '@account/assets/icon-main-32.svg';
import iconAccountDetails from '@account/assets/icon-my-data-32.svg';
import iconAccountSecurity from '@account/assets/icon-shield-32.svg';

import styles from './Sidebar.module.css';

interface MenuItem {
   path: string;
   label: string;
   icon: string;
}

const menuItems: MenuItem[] = [
   { path: '/account/main/', label: 'Main', icon: iconAccountMain },
   { path: '/account/details/', label: 'My details', icon: iconAccountDetails },
   { path: '/account/security/', label: 'Security', icon: iconAccountSecurity },
];

function Sidebar(): React.JSX.Element {
   const location = useLocation();

   return (
      <nav className={styles.menu}>
         <div className={styles.menuItems}>
            {menuItems.map((item) => (
               <div
                  key={item.path}
                  className={`${styles.menuItem} ${location.pathname === item.path ? styles.active : ''}`}
               >
                  <Link to={item.path}>
                     <img src={item.icon} alt="Ulubike" />
                     <span>{item.label}</span>
                  </Link>
               </div>
            ))}
         </div>
      </nav>
   );
}

export default Sidebar;
