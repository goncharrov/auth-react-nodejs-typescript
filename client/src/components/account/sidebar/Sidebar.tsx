import { useLocation } from 'react-router-dom';
import styles from './Sidebar.module.css';

import iconAccountMain from '@assets/icon-main-32.svg';
import iconAccountDetails from '@assets/icon-my-data-32.svg';
import iconAccountSecurity from '@assets/icon-shield-32.svg';

interface MenuItem {
   path: string;
   label: string;
   icon: string;
}

function Sidebar(): React.JSX.Element {
   const location = useLocation();

   const menuItems: MenuItem[] = [
      { path: '/account/main/', label: 'Main', icon: iconAccountMain },
      {
         path: '/account/details/',
         label: 'My details',
         icon: iconAccountDetails,
      },
      {
         path: '/account/security/',
         label: 'Security',
         icon: iconAccountSecurity,
      },
   ];

   return (
      <nav className={styles.sidebarMenu}>
         <div className={styles.sidebarMenuItems}>
            {menuItems.map((item) => {
               const isActive = location.pathname === item.path;
               return (
                  <div
                     key={item.path}
                     className={`${styles.sidebarMenuItem} ${isActive ? styles.active : ''}`}
                  >
                     <a href={item.path}>
                        <img src={item.icon} alt="Ulubike" />
                        <span>{item.label}</span>
                     </a>
                  </div>
               );
            })}
         </div>
      </nav>
   );
}

export default Sidebar;
