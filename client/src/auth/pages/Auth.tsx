import { Fragment } from 'react';

import LoadingPage from '@shared/pages/LoadingPage';

import LoginForm from '@auth/components/LoginForm';
import CodeForm from '@auth/components/CodeForm';
import PassForm from '@auth/components/PassForm';
import Footer from '@auth/components/ui/footer/Footer';

import { useAuthPage } from '@auth/hooks/useAuthPage';

import '../../main.css';
import styles from './Auth.module.css';

const Auth = () => {
   const {
      currentForm, email, code, password, error, loading, timerActive, secondsLeft,
      isReady, goBack, goToForm, handleEmailChange, handleEmailSubmit, handleCodeChange,
      handleCodeSubmit, handlePasswordChange, handlePasswordSubmit, handleRestart,
   } = useAuthPage();

   if (!isReady) {
      return <LoadingPage />;
   }

   return (
      <Fragment>
         <div className={styles.container}>
            {currentForm == 'LoginForm' && (
               <LoginForm
                  onNext={(event) => {
                     void handleEmailSubmit(event);
                  }}
                  email={email}
                  onEmailChange={handleEmailChange}
                  validationText={error}
                  loading={loading}
               />
            )}

            {currentForm == 'CodeForm' && (
               <CodeForm
                  onBack={goBack}
                  onNext={(event) => goToForm(event, 'PassForm')}
                  email={email}
                  code={code}
                  onCodeChange={handleCodeChange}
                  onCodeSubmit={(e) => {
                     void handleCodeSubmit(e);
                  }}
                  validationText={error}
                  timerActive={timerActive}
                  secondsLeft={secondsLeft}
                  onRestart={handleRestart}
                  loading={loading}
               />
            )}

            {currentForm == 'PassForm' && (
               <PassForm
                  onBack={goBack}
                  email={email}
                  password={password}
                  onPasswordChange={handlePasswordChange}
                  onPasswordSubmit={(e) => {
                     void handlePasswordSubmit(e);
                  }}
                  validationText={error}
                  loading={loading}
               />
            )}
         </div>

         <Footer />
      </Fragment>
   );
};

export default Auth;
