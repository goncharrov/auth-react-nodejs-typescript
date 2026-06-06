import { Fragment, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '@auth/authContext';

import LoadingPage from '@shared/pages/LoadingPage';

import RegForm from '@auth/components/RegForm';
import Footer from '@auth/components/ui/footer/Footer';

import '../../main.css';
import styles from './Reg.module.css';

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
