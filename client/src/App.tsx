import { Fragment, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { initCsrf } from './shared/http/axiosInstance';

import NotFoundPage from '@shared/pages/NotFoundPage';

import Home from '@home/pages/Home';
import Auth from '@auth/pages/Auth';
import Reg from '@auth/pages/Reg';

import Account from '@account/pages/Account';
import AccountMain from '@account/pages/AccountMain';
import AccountDetails from '@account/pages/AccountDetails';
import AccountSecurity from '@account/pages/AccountSecurity';

function App() {

   useEffect(() => {
      initCsrf();
   }, []);

   return (
      <Fragment>
         <Router>
            <Routes>
               <Route path="/" element={<Home />} />
               <Route path="/auth/" element={<Auth />} />
               <Route path="/auth/reg/" element={<Reg />} />

               <Route path="/account/*" element={<Account />}>
                  <Route path="main/" element={<AccountMain />} />
                  <Route path="details/" element={<AccountDetails />} />
                  <Route path="security/" element={<AccountSecurity />} />
                  <Route
                     path="*"
                     element={<Navigate to="/account/main/" replace />}
                  />
               </Route>

               <Route path="*" element={<NotFoundPage />} />
            </Routes>
         </Router>
      </Fragment>
   );
}

export default App;
