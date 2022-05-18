import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App';
import reportWebVitals from './reportWebVitals';
import { CardStateProvider } from './Providers/cardStateProvider';
import { LineEditProvider } from './Providers/lineEditProvider';
import { UserStateProvider } from './Providers/userStateProvider';
import { TickListProvider } from './Providers/tickListProvider';

import 'mapbox-gl/dist/mapbox-gl.css';

const ProvidersWrapper = () => {
  return (
    <UserStateProvider>
      <LineEditProvider>
        <CardStateProvider>
          <TickListProvider>
            <App />
          </TickListProvider>
        </CardStateProvider>
      </LineEditProvider>
    </UserStateProvider>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ProvidersWrapper />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
