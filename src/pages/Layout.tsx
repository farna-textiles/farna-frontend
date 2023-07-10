import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './navbar/Sidebar';

const Layout: React.FC = () => {
  return (
    <div className="flex">
      <div className="flex-shrink-0">
        <Sidebar />
      </div>
      <div className="flex-grow">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
