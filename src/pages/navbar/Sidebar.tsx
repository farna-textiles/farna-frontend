/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/no-extraneous-dependencies */
import { Navbar, Group, ScrollArea, createStyles, rem } from '@mantine/core';
import {
  IconCalendarStats,
  IconGauge,
  IconPresentationAnalytics,
  IconFileAnalytics,
  IconAdjustments,
  IconLock,
  IconAddressBook,
} from '@tabler/icons-react';
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
      { label: 'All Products', link: '/products' },
      { label: 'Create Product', link: '/product/new' },
    ],
  },
  {
    label: 'Product Orders',
    icon: IconCalendarStats,
    links: [
      { label: 'Create Orders', link: '/order' },
      { label: 'Recent Orders', link: '/recent-order' },
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
    paddingBottom: 0,
  },

  header: {
    padding: theme.spacing.md,
    paddingTop: 0,
    marginLeft: `calc(${theme.spacing.md} * -1)`,
    marginRight: `calc(${theme.spacing.md} * -1)`,
    color: theme.colorScheme === 'dark' ? theme.white : theme.black,
    borderBottom: `${rem(1)} solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]
    }`,
  },

  links: {
    marginLeft: `calc(${theme.spacing.md} * -1)`,
    marginRight: `calc(${theme.spacing.md} * -1)`,
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

  const { classes } = useStyles();
  const links = mockdata.map((item) => (
    <LinksGroup {...item} key={item.label} />
  ));

  return (
    <Navbar height={800} width={{ sm: 300 }} p="md" className={classes.navbar}>
      <Navbar.Section className={classes.header}>
        <Group position="apart">
          <img src={logo} alt="farna logo" />
        </Group>
      </Navbar.Section>

      <Navbar.Section grow className={classes.links} component={ScrollArea}>
        <div className={classes.linksInner}>{links}</div>
      </Navbar.Section>

      <Navbar.Section className={classes.footer}>
        <UserButton
          image="https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=255&q=80"
          name={userInfo?.username ?? ''}
          email={userInfo?.email ?? ''}
        />
      </Navbar.Section>
    </Navbar>
  );
};

export default Sidebar;
