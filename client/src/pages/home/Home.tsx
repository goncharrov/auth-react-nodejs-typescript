import { Fragment } from 'react';

import '../../main.css';

import Header from '@components/main/header/Header';

// sfc
const Home = () => {
   return (
      <Fragment>
         <div className="container">
            <Header />
         </div>
      </Fragment>
   );
};

export default Home;
