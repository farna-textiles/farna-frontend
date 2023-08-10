
import { Navbar, Group, ScrollArea, createStyles, rem } from '@mantine/core';
import { IoCloseOutline, IoMenuOutline } from 'react-icons/io5';
import { CSSTransition } from 'react-transition-group';
import {
  IconCalendarStats,
  IconGauge,
  IconPresentationAnalytics,
  IconFileAnalytics,
  IconAdjustments,
  IconLock,
  IconAddressBook,
} from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import logo from '../../../public/farna-logo.png';
import LinksGroup from './LinksGroup';
import UserButton from './UserButton';
import { User } from '../../interfaces';

const mockdata = [
  { label: 'Dashboard', icon: IconGauge, link: '/' },
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
  { label: 'Analytics', icon: IconPresentationAnalytics },
  { label: 'Users', icon: IconFileAnalytics, link: '/users' },
  { label: 'Settings', icon: IconAdjustments },
  {
    label: 'Security',
    icon: IconLock,
    links: [
      { label: 'Enable 2FA', link: '/' },
      { label: 'Change password', link: '/' },
      { label: 'Recovery codes', link: '/' },
    ],
  },
];

const useStyles = createStyles((theme) => ({
  navbar: {
    height: '100vh',

    backgroundColor:
      theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.white,
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
  mobileNavbar: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 999,
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
  },
  toggleButton: {
    fontSize: 24,
    cursor: 'pointer',
  },
  links: {
    marginLeft: `calc(${theme.spacing.md} * -1)`,
    marginRight: `calc(${theme.spacing.md} * -1)`,
    '@media (max-width: 768px)': {
      display: 'none', // Hide the links on mobile screens
    },
  },

  transition: {
    '&-enter': {
      opacity: 0,
      transform: 'translateX(-100%)',
    },
    '&-enter-active': {
      opacity: 1,
      transform: 'translateX(0)',
      transition: 'opacity 300ms, transform 300ms',
    },
    '&-exit': {
      opacity: 1,
      transform: 'translateX(0)',
    },
    '&-exit-active': {
      opacity: 0,
      transform: 'translateX(-100%)',
      transition: 'opacity 300ms, transform 300ms',
    },
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
  const userInfoString = localStorage.getItem('userInfo');
  const userInfo: User = userInfoString ? JSON.parse(userInfoString) : null;
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  useEffect(() => {
    const handleResize = () => {
      const screen = 676;
      setIsMobile(window.innerWidth <= screen);
    };


    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);




  const { classes } = useStyles();
  const links = mockdata.map((item) => (
    <LinksGroup {...item} key={item.label}     />
  ));
  return (
    <Navbar p="md" className={classes.navbar}>
    <Navbar.Section className={classes.header}>
      <div
        className={classes.toggleButton}
        onClick={toggleSidebar}
        style={{ display: isMobile ? 'block' : 'none' }}
      >
        {sidebarVisible ? (
          <IoCloseOutline size={30} />
        ) : (
          <IoMenuOutline size={30} />
        )}
      </div>
      {!isMobile && (
        <div className={classes.logo}>
          <img
            src={logo}
            alt="farna logo"
            className={`w-${isMobile ? '10' : '20'} h-auto mr-${isMobile ? '2' : '0'} ml-${isMobile ? '0' : '2'}`}
          />
        </div>
      )}
    </Navbar.Section>

      {isMobile && (
        <CSSTransition
          in={sidebarVisible}
          timeout={400}
          classNames={classes.transition}
          unmountOnExit
        >
          <Navbar.Section
            className={`${classes.linksInner} ${
              sidebarVisible ? '' : 'hidden'
            }`}
          >
            {links}
          </Navbar.Section>
        </CSSTransition>
      )}

      {!isMobile && (
        <Navbar.Section className={classes.linksInner}>{links}</Navbar.Section>
      )}

      {(!isMobile || sidebarVisible) && (
        <Navbar.Section className={classes.footer}>
          <UserButton
            image="https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=255&q=80"
            name={userInfo!.username ?? ''}
            email={userInfo!.email ?? ''}
          />
        </Navbar.Section>
      )}
    </Navbar>
  );
};
export default Sidebar;
