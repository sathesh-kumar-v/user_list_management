import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Your base CSS file, if any
import App from './App';
import reportWebVitals from './reportWebVitals';
// Correct the import path for the Redux store
import store from './redux/store'; // THIS IS THE CRUCIAL CORRECTION
import { Provider } from 'react-redux';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);

reportWebVitals();