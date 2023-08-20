/* eslint-disable prettier/prettier */
/* eslint-disable react/function-component-definition */
import * as React from 'react';
import Box from '@mui/material/Box';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuTwoToneIcon from '@mui/icons-material/MenuTwoTone';
import {
  IconCalendarStats,
  IconGauge,
  IconPresentationAnalytics,
  IconFileAnalytics,
  IconBrandGoogleAnalytics,
  IconAdjustments,
  IconLogout,
  IconLock,
  IconAddressBook,
} from '@tabler/icons-react';

type Anchor = 'top' | 'left' | 'bottom' | 'right';

// Your mockdata
const mockdata = [
  { label: 'Dashboard', Icon: IconGauge, link: '/' },
  { label: 'All Customers', Icon: IconAddressBook, link: '/customers' },
  { label: ' View Products', Icon: IconCalendarStats, link: '/products' },
  {
    label: 'All Orders',
    Icon: IconCalendarStats,
    link: '/recent-order',
  },
  { label: 'Analytics', Icon: IconPresentationAnalytics },
  { label: 'Users', Icon: IconFileAnalytics, link: '/users' },
  { label: 'Security', Icon: IconLock },
  { label: 'Settings', Icon: IconAdjustments },
];

export default function SwipeableTemporaryDrawer() {
  const [state, setState] = React.useState({
    left: false,
  });

  const toggleDrawer =
    (anchor: Anchor, open: boolean) =>
    (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event &&
        event.type === 'keydown' &&
        ((event as React.KeyboardEvent).key === 'Tab' ||
          (event as React.KeyboardEvent).key === 'Shift')
      ) {
        return;
      }

      setState({ ...state, [anchor]: open });
    };

  const list = (anchor: Anchor) => (
    <Box
      sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250 }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        {mockdata.map((link, index) => (
          <ListItemButton component="a" href={link.link} key={index}>
            <ListItemIcon sx={{ color: 'primary.main' }}>
              {link.Icon ? <link.Icon /> : null}
            </ListItemIcon>
            <ListItemText primary={link.label} />
          </ListItemButton>
        ))}
      </List>
      <Divider />
      <List sx={{ marginTop: '200px' }}>
        <ListItemButton>
          <ListItemIcon sx={{ color: 'error.main' }}>
            <IconLogout />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItemButton>
      </List>
    </Box>
  );

  return (
    <div>
      {(['left'] as const).map((anchor) => (
        <React.Fragment key={anchor}>
          <Button onClick={toggleDrawer(anchor, true)}>
            <MenuTwoToneIcon />
          </Button>
          <SwipeableDrawer
            anchor={anchor}
            open={state[anchor]}
            onClose={toggleDrawer(anchor, false)}
            onOpen={toggleDrawer(anchor, true)}
          >
            {list(anchor)}
          </SwipeableDrawer>
        </React.Fragment>
      ))}
    </div>
  );
}
