import { Fragment } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navigate } from 'react-router-dom';

import NotFoundPage from '@pages/NotFoundPage';

import Home from '@pages/home/Home';
import Auth from '@pages/auth/Auth';
import Reg from '@pages/reg/Reg';

import Account from '@pages/account/Account';

import AccountMain from '@pages/account/AccountMain';
import AccountDetails from '@pages/account/AccountDetails';
import AccountSecurity from '@pages/account/AccountSecurity';

function App() {
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
