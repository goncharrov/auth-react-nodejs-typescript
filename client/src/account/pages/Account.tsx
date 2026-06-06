import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

import { useAuth } from '@auth/authContext';

import LoadingPage from '@shared/pages/LoadingPage';

import Header from '@account/components/header/Header';
import Sidebar from '@account/components/sidebar/Sidebar';

import '../../main.css';
import styles from './Account.module.css';

function Account() {
   const { isAuthenticated, loading } = useAuth();
   const navigate = useNavigate();

   useEffect(() => {
      if (!loading && isAuthenticated === false) {
         void navigate('/');
      }
   }, [isAuthenticated, loading, navigate]);

   if (loading || isAuthenticated === undefined) {
      return <LoadingPage />;
   }

   return (
      <div className={styles.page}>
         <Header />
         <main className={styles.main}>
            <div className={styles.container}>
               <div className={styles.layout}>
                  <Sidebar />
                  <main className={styles.content}>
                     <div className={styles.contentSection}>
                        <Outlet />
                     </div>
                  </main>
               </div>
            </div>
         </main>
      </div>
   );
}

export default Account;
