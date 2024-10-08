import React from "react";
import './index.css'
import App from "./App";
import ReactDOM  from 'react-dom/client';
import { BrowserRouter } from "react-router-dom";
import { persistor, store } from './redux/store.js';
import { Provider } from 'react-redux'
import { PersistGate } from "redux-persist/integration/react";


const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
   <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
         <BrowserRouter>
            <App/>
         </BrowserRouter>
      </PersistGate>
   </Provider>
);

