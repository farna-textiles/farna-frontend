/* eslint-disable prettier/prettier */
import React, { useEffect, useMemo, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './navbar/Sidebar';
import CustomizedBreadcrumbs from '../components/breadcrumbs/BreadCrumbs';

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

  const mainDivClassName = useMemo(() => {
    return isMobile ? 'flex-fill' : 'flex';
  }, [isMobile]);

  const containerStyle = useMemo(() => {
    return {
      marginTop: isMobile ? '1px' : '0',
      marginBottom: isMobile ? '90px' : '0',
    };
  }, [isMobile]);

  return (
    <div className={`h-screen ${mainDivClassName}`}>
      <div className="flex-shrink-0 overflow-y-auto">
        <Sidebar />
      </div>
      <div className="flex-1 overflow-y-auto" style={containerStyle}>
        <div className="p-2 bg-none mx-5 my-5">
          <CustomizedBreadcrumbs />
        </div>
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
