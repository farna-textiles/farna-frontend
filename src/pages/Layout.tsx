/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './navbar/Sidebar';

const Layout: React.FC = () => {
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 818);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const mainDivClassName = isMobile ? 'flex-fill' : 'flex';

  const containerStyle = {
    marginTop: isMobile ? '1px' : '0',
    marginBottom: isMobile ? '90px' : '0',
  };

  return (
    <div className={mainDivClassName}>
      <div className="flex-shrink-0">
        <Sidebar />
      </div>
      <div className="flex-auto" style={containerStyle}>
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
