import React from 'react';

import './App.css';
import './variables.css';
import ButtonBar from "./ButtonBar";
import ReactMap from "./Mapping/ReactMap";
import { useUserStateContext } from './Providers/userStateProvider';
import LandingPage from './LandingPage';

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