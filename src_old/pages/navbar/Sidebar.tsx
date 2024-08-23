/* eslint-disable react/jsx-props-no-spreading */
import { Navbar, createStyles, rem } from '@mantine/core';
import { useEffect, useMemo, useState } from 'react';
import {
  IconDashboard,
  IconUser,
  IconPackage,
  IconShoppingCart,
  IconWallet,
} from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();

  const SideLinks = useMemo(
    () => [
      { label: 'Dashboard', icon: IconDashboard, link: '/dashboard' },
      {
        label: 'Customers',
        icon: IconUser,
        initiallyOpened: false,
        links: [
          { label: 'Customer Records', link: '/customers' },
          { label: 'New Customer', link: '/customer' },
        ],
      },
      {
        label: 'Products',
        icon: IconPackage,
        links: [
          { label: 'Product Inventory', link: '/products' },
          { label: 'Add Product', link: '/product/new' },
        ],
      },
      {
        label: 'Product Orders',
        icon: IconShoppingCart,
        links: [
          { label: 'Recent Orders', link: '/orders' },
          { label: 'Create Order', link: '/order/new' },
        ],
      },
      {
        label: 'Additions',
        icon: IconWallet,
        links: [
          { label: 'Payment Methods', link: '/payment' },
          { label: 'Currency Units', link: '/currency' },
        ],
      },
      {
        label: 'Users',
        icon: IconUser,
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
  const userInfo: User =
    userInfoString && userInfoString !== 'undefine'
      ? JSON.parse(userInfoString)
      : null;
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
      style={{
        height: isMobile ? 'fit-content' : '100vh',
      }}
    >
      <Navbar.Section className={classes.header}>
        {isMobile && <SwipeableTemporaryDrawer />}
        <div
          className={`${classes.logo} md:flex`}
          style={{ justifyContent: isMobile ? 'flex-end' : 'flex-start' }}
        >
          <button type="button" onClick={() => navigate('/dashboard')}>
            <img
              src="/farna-logo.png"
              alt="farna logo"
              width={isMobile ? '68' : ''}
            />
          </button>
        </div>
      </Navbar.Section>

      {!isMobile && (
        <Navbar.Section className={`md:block ${classes.linksInner} flex-1`}>
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
