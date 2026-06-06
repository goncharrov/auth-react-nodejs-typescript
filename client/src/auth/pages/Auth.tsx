import axios from 'axios';
import { Fragment, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { ChangeEvent, MouseEvent } from 'react';

type AuthFormName = 'LoginForm' | 'PassForm' | 'CodeForm';

import { useAuth } from '@auth/authContext';
import { authApi } from '@auth/authApi';

import LoadingPage from '@shared/pages/LoadingPage';

import LoginForm from '@auth/components/LoginForm';
import CodeForm from '@auth/components/CodeForm';
import PassForm from '@auth/components/PassForm';
import Footer from '@auth/components/ui/footer/Footer';

import '../../main.css';
import styles from './Auth.module.css';

const Auth = () => {
   const [currentForm, setCurrentForm] = useState<AuthFormName>('LoginForm');
   const [formHistory, setFormHistory] = useState<AuthFormName[]>([]);

   const [email, setEmail] = useState<string>('');
   const [code, setCode] = useState<string>('');
   const [password, setPassword] = useState<string>('');

   const [error, setError] = useState<string>('');
   const [loading, setLoading] = useState<boolean>(false);

   // Timer to receive code
   const [timerActive, setTimerActive] = useState<boolean>(false);
   const [secondsLeft, setSecondsLeft] = useState<number>(0);

   const { setUser, isAuthenticated, loading: authLoading } = useAuth();

   const navigate = useNavigate();

   useEffect(() => {
      if (!authLoading && isAuthenticated === true) {
         void navigate('/');
      }
   }, [isAuthenticated, authLoading, navigate]);

   useEffect(() => {
      if (!timerActive || secondsLeft <= 0) return;

      const intervalId = window.setInterval(() => {
         setSecondsLeft((prev) => prev - 1);
      }, 1000);

      return () => window.clearInterval(intervalId);
   }, [timerActive, secondsLeft]);

   const handleStartTimer = () => {
      setSecondsLeft(59);
      setTimerActive(true);
   };

   const handleRestart = async () => {
      setError('');

      if (email.trim() === '') {
         setError('Enter the e-mail address');
         return;
      }

      try {
         const result = await authApi.sendNewLoginCode(email.trim());
         if (result.data.codeIsWritten) {
            setSecondsLeft(59);
         } else {
            setError('Error sending code. Login with email.');
         }
      } catch {
         setError('Error sending code. Login with email.');
      }
   };

   // Form manage
   const goToForm = (
      event: MouseEvent<HTMLButtonElement>,
      nameForm: AuthFormName
   ) => {
      event.preventDefault();
      setFormHistory((prev) => [...prev, currentForm]);
      setCurrentForm(nameForm);
   };

   const goBack = () => {
      if (formHistory.length > 0) {
         setError('');

         if (currentForm === 'PassForm') {
            setPassword('');
         } else if (currentForm === 'CodeForm') {
            setCode('');
            setTimerActive(false);
            setSecondsLeft(0);
         }

         const lastForm = formHistory[formHistory.length - 1];
         const newHistory = formHistory.slice(0, -1);
         setFormHistory(newHistory);
         setCurrentForm(lastForm);
      }
   };

   // Email manage
   const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;

      setEmail(value);

      if (value.trim() !== '') {
         setError('');
      }
   };

   const handleEmailSubmit = async (event: MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();

      setError('');

      if (email.trim() === '') {
         setError('Enter the e-mail address');
         return;
      }

      setLoading(true);
      try {
         const result = await authApi.checkEmail(email.trim());
         if (result.data.exists) {
            setFormHistory((prev) => [...prev, currentForm]);
            if (result.data.authorizationType === 'code') {
               handleStartTimer();
               setCurrentForm('CodeForm');
            } else {
               setCurrentForm('PassForm');
            }
         } else {
            setError('User with this email not found');
         }
      } catch (err: unknown) {
         if (axios.isAxiosError(err) && err.response) {
            setError(err.response.data.message);
         }
      } finally {
         setLoading(false);
      }
   };

   // Code manage
   const handleCodeChange = (event: ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;

      setCode(value);

      if (value.trim() !== '') {
         setError('');
      }
   };

   const handleCodeSubmit = async (event: MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();

      setError('');

      if (code.trim() === '') {
         setError('Enter code from e-mail');
         return;
      }

      setLoading(true);
      try {
         const result = await authApi.loginWithCode(email.trim(), code.trim());         
         if (result.data.success) {
            setUser(result.data.user);
            setTimerActive(false);
            setSecondsLeft(0);
            void navigate('/');
         }
      } catch (err: unknown) {
         if (axios.isAxiosError(err) && err.response) {
            setError(err.response.data.message);
         }
      } finally {
         setLoading(false);
      }
   };

   // Password manage
   const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;

      setPassword(value);

      if (value.trim() !== '') {
         setError('');
      }
   };

   const handlePasswordSubmit = async (
      event: MouseEvent<HTMLButtonElement>
   ) => {
      event.preventDefault();

      setError('');

      if (password.trim() === '') {
         setError('Enter password');
         return;
      }

      setLoading(true);
      try {
         const result = await authApi.loginWithPassword(email.trim(), password);
         if (result.data.success) {
            setUser(result.data.user);
            setTimerActive(false);
            setSecondsLeft(0);
            void navigate('/');
         }
      } catch (err) {
         if (axios.isAxiosError(err) && err.response) {
            setError(err.response.data.message);
         }
      } finally {
         setLoading(false);
      }
   };

   if (authLoading || isAuthenticated === undefined) {
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
