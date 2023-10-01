/* eslint-disable react/jsx-props-no-spreading */

import { Navbar, createStyles, rem } from '@mantine/core';
import {
  IconCalendarStats,
  IconGauge,
  IconPresentationAnalytics,
  IconFileAnalytics,
  IconAdjustments,
  IconLock,
  IconAddressBook,
  IconCreditCard,
} from '@tabler/icons-react';
import { useEffect, useMemo, useState } from 'react';
import SwipeableTemporaryDrawer from './MobileSidebar';
import LinksGroup from './LinksGroup';
import UserButton from './UserButton';
import { User } from '../../interfaces';

const useStyles = createStyles((theme) => ({
  navbar: {
    backgroundColor:
      theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.white,
    padding: '1rem 1rem 0 1rem',
    fontSize: '16px',
  },

  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.md,
    paddingTop: 0,
    color: theme.colorScheme === 'dark' ? theme.white : theme.black,
    borderBottom: `${rem(1)} solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]
    }`,
  },

  logo: {
    display: 'flex',
    alignItems: 'center',
  },
  toggleButton: {
    fontSize: 24,
    cursor: 'pointer',
  },

  linksInner: {
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.xl,
  },

  footer: {
    marginLeft: `calc(${theme.spacing.md} * -1)`,
    marginRight: `calc(${theme.spacing.md} * -1)`,
    borderTop: `${rem(1)} solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]
    }`,
  },
}));

const Sidebar = () => {
  const SideLinks = useMemo(
    () => [
      { label: 'Dashboard', icon: IconGauge, link: '/dashboard' },
      {
        label: 'Customers',
        icon: IconAddressBook,
        initiallyOpened: false,
        links: [
          { label: 'All Customers', link: '/customers' },
          { label: 'Create Customer', link: '/customer' },
        ],
      },
      {
        label: 'Products',
        icon: IconCalendarStats,
        links: [
          { label: 'Create Product', link: '/product/new' },
          { label: 'View Products', link: '/products' },
        ],
      },
      {
        label: 'Product Orders',
        icon: IconCalendarStats,
        links: [
          { label: 'Create Orders', link: '/order/new' },
          { label: 'Recent Orders', link: '/orders' },
        ],
      },
      {
        label: 'Additions',
        icon: IconCreditCard,
        links: [
          { label: 'Payment Methdos', link: '/payment' },
          { label: 'Add Currency ', link: '/currency' },
        ],
      },
      // { label: 'Analytics', icon: IconPresentationAnalytics },
      {
        label: 'Users',
        icon: IconFileAnalytics,
        link: '/users',
        isAdminRoute: true,
      },
      // { label: 'Settings', icon: IconAdjustments },
      // {
      //   label: 'Security',
      //   icon: IconLock,
      //   links: [
      //     { label: 'Enable 2FA', link: '/' },
      //     { label: 'Change password', link: '/' },
      //     { label: 'Recovery codes', link: '/' },
      //   ],
      // },
    ],
    []
  );

  const userInfoString = localStorage.getItem('userInfo');
  const userInfo: User = userInfoString ? JSON.parse(userInfoString) : null;
  const isAdminUser = useMemo(() => userInfo.role === 'admin', [userInfo.role]);

  const [isMobile, setIsMobile] = useState(false);

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

  const { classes } = useStyles();

  return (
    <Navbar
      className={classes.navbar}
      style={{ height: isMobile ? 'fit-content' : '100vh' }}
    >
      <Navbar.Section className={classes.header}>
        {isMobile && <SwipeableTemporaryDrawer />}
        <div
          className={`${classes.logo} md:flex`}
          style={{ justifyContent: isMobile ? 'flex-end' : 'flex-start' }}
        >
          <img
            src="/farna-logo.png"
            alt="farna logo"
            width={isMobile ? '68' : ''}
          />
        </div>
      </Navbar.Section>

      {!isMobile && (
        <Navbar.Section className={`md:block ${classes.linksInner}`}>
          {SideLinks.filter((item) => isAdminUser || !item.isAdminRoute).map(
            (item) => (
              <LinksGroup {...item} key={item.label} />
            )
          )}
        </Navbar.Section>
      )}

      {!isMobile && (
        <Navbar.Section className={`md:block ${classes.footer}`}>
          <UserButton
            image="https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=255&q=80"
            name={userInfo?.username ?? ''}
            email={userInfo?.email ?? ''}
          />
        </Navbar.Section>
      )}
    </Navbar>
  );
};

export default Sidebar;
