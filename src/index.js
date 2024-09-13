import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import CandlestickChart from './components/candlestick';
import Msdi from './components/msdi';
import ModCandlestickChart from './components/mod_candlestick';
import Register from './components/register';
import Login from './components/login';
import Fibonacci from './components/fibonacci';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
    children: [
      {
        path: "/register",
        element: <Register />
      },
      {
        path: "/login",
        element: <Login />
      },
      {
        path: "/chart",
        element: <ModCandlestickChart />
      },
      {
        path: "/msdi",
        element: <Msdi />
      },
      {
        path: "/modchart",
        element: <ModCandlestickChart />
      },
      {
        path:"/fibonacci",
        element: <Fibonacci />
      }
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
