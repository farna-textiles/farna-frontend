import * as React from 'react';
import { Box } from '@mui/material';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import { Link } from 'react-router-dom';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuTwoToneIcon from '@mui/icons-material/MenuTwoTone';
import { useNavigate } from 'react-router';

import {
  IconWallet,
  IconDashboard,
  IconUser,
  IconPackage,
  IconShoppingCart,
  IconLogout,
  IconSettings,
} from '@tabler/icons-react';
import { useMemo, useState } from 'react';
import { logout } from '../../services/authService';

type Anchor = 'top' | 'left' | 'bottom' | 'right';

const SwipeableTemporaryDrawer = () => {
  const menuLinks = useMemo(
    () => [
      { label: 'Dashboard', Icon: IconDashboard, link: '/dashboard' },
      { label: 'All Customers', Icon: IconUser, link: '/customers' },
      { label: 'Product Inventory', Icon: IconPackage, link: '/products' },
      { label: 'Order List', Icon: IconShoppingCart, link: '/orders' },
      { label: 'Add Currency ', Icon: IconWallet, link: '/currency' },
      { label: 'Payment Methods', Icon: IconWallet, link: '/payment' },
      { label: 'Users', Icon: IconUser, link: '/users' },
    ],
    []
  );
  const [state, setState] = useState({
    left: false,
  });

  const navigate = useNavigate();
  const handleLogout = async () => {
    logout();
    navigate('/signin');
  };
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
        {menuLinks.map((link) => (
          <ListItemButton key={link.label}>
            <ListItemIcon sx={{ color: 'primary.main' }}>
              {link.Icon ? <link.Icon /> : null}
            </ListItemIcon>
            <ListItemText
              primary={
                <Link to={link.link} style={{ textDecoration: 'none' }}>
                  {link.label}
                </Link>
              }
            />
          </ListItemButton>
        ))}
      </List>
      <Divider />
      <List sx={{ marginTop: '200px' }}>
        <ListItemButton component={Link} to="/change-password">
          <ListItemIcon sx={{ color: 'error.main' }}>
            <IconSettings />
          </ListItemIcon>
          <ListItemText primary="Change Password" />
        </ListItemButton>
        <ListItemButton onClick={handleLogout}>
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
};

export default SwipeableTemporaryDrawer;
