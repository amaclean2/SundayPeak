import React from 'react';

import './App.css';
import './variables.css';
import { useUserStateContext } from './Providers/userStateProvider';
import LandingPage from './LandingPage';
import ButtonBar from './Components/ButtonBar';
import ReactMap from './Components/Mapping/ReactMap';

const App = () => {
  const { isLandingPage } = useUserStateContext();

  return (
    <div className="app-container">
      {!isLandingPage && (
        <>
          <ReactMap />
          <ButtonBar />
        </>
      )
      }
      {isLandingPage && <LandingPage />}
    </div>
  );
};

export default App;