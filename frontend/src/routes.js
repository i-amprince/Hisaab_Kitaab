import React from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import App from './App';      // import your components properly
import Dashboard from './Dashboard';
import Login from './Login';
import Mainn from './Mainn';

function Routes() {
  const routees = createBrowserRouter([
    {
      path: '/',
      element: <App />,
    },
    {
      path: '/login',
      element: <Login />,
    },
    {
      path: '/dashboard',
      element: <Dashboard/>
    },
    {
      path: '/mainn',
      element: <Mainn/>
    }
  ]);

  return <RouterProvider router={routees} />;
}

export default Routes;
