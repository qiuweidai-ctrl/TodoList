import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
// 必须引入bootstrap样式，否则Modal、Card、ListGroup样式失效
import 'bootstrap/dist/css/bootstrap.min.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);