import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App.jsx';

import { ThirdwebWeb3Provider } from '@3rdweb/hooks'; // this provider holds the user's authenticated wallet data and passes it to <App>

// Include what chains you wanna support.
// 4 = Rinkeby.
const supportedChainIds = [4];

// Include what type of wallet you want to support.
// In this case, we support Metamask which is an "injected wallet" (i.e. browser-based wallet).
const connectors = {
  injected: {},
};

// Render the App component to the DOM
ReactDOM.render(
  <React.StrictMode>
    <ThirdwebWeb3Provider
      connectors={connectors}
      supportedChainIds={supportedChainIds}
    >
      <App />
    </ThirdwebWeb3Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
