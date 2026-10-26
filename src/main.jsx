import React from 'react';
import {createRoot} from 'react-dom/client';
import Auth from './components/Auth';
import App from './App';
import './styles.css';
createRoot(document.getElementById('root')).render(<Auth><App/></Auth>);
if('serviceWorker' in navigator && import.meta.env.PROD) navigator.serviceWorker.register('/sw.js?v=4',{updateViaCache:'none'}).then(reg=>reg.update()).catch(()=>{});
