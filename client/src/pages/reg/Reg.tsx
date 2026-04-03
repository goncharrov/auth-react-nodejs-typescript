import { Fragment, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '@http/useAuthAPI';

import '../../main.css';
import styles from './Reg.module.css';

import LoadingPage from '@pages/LoadingPage';

import RegForm from '@components/auth/RegForm';
import Footer from '@components/auth/footer/Footer';

const Reg = () => {
   const { isAuthenticated, loading } = useAuth();
   const navigate = useNavigate();

   useEffect(() => {
      if (!loading && isAuthenticated === true) {
         void navigate('/');
      }
   }, [isAuthenticated, loading, navigate]);

   if (loading || isAuthenticated === undefined) {
      return <LoadingPage />;
   }

   return (
      <Fragment>
         <div className={styles.container} style={{ height: '93vh' }}>
            <RegForm />
         </div>
         <Footer />
      </Fragment>
   );
};

export default Reg;
