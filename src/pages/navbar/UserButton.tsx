import {
  UnstyledButton,
  UnstyledButtonProps,
  Group,
  Avatar,
  Text,
  createStyles,
} from '@mantine/core';

import { IconChevronRight } from '@tabler/icons-react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import LogoutIcon from '@mui/icons-material/Logout';
import { IconButton, ListItemIcon } from '@mui/material';

const useStyles = createStyles((theme) => ({
  user: {
    display: 'block',
    width: '100%',
    padding: theme.spacing.md,
    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,

    '&:hover': {
      backgroundColor:
        theme.colorScheme === 'dark'
          ? theme.colors.dark[8]
          : theme.colors.gray[0],
    },
  },
  dropdown: {
    position: 'absolute',
    top: '100%',
    right: 0,
    zIndex: 1000,
    width: '200px',
    backgroundColor: 'white',
    border: `1px solid ${theme.colors.gray[3]}`,
    borderRadius: theme.radius.sm,
    boxShadow: theme.shadows.md,
    display: 'none',
  },
  dropdownVisible: {
    display: 'block',
  },
}));

interface UserButtonProps extends UnstyledButtonProps {
  image: string;
  name: string;
  email: string;
  icon?: React.ReactNode;
}

const UserButton = ({
  image,
  name,
  email,
  icon,
  ...others
}: UserButtonProps) => {
  const { classes } = useStyles();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleLogout = async () => {
    try {
      localStorage.clear();
      document.cookie =
        'access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      document.cookie =
        'refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      window.location.href = '/signin';
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className="relative">
      <UnstyledButton
        className={classes.user}
        {...others}
        onClick={handleClick}
      >
        <Group>
          <IconButton
            size="small"
            sx={{ ml: 2 }}
            aria-controls={open ? 'account-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
          >
            <Avatar
              sx={{ width: 32, height: 32, borderRadius: '50%' }}
              src={image}
            ></Avatar>
          </IconButton>
          <div style={{ flex: 1 }}>
            <Text sx={{ fontSize: '14px', fontWeight: 500 }}>{name}</Text>
            <Text sx={{ color: 'dimmed', fontSize: '12px' }}>{email}</Text>
          </div>
          {icon || <IconChevronRight size="0.9rem" stroke={1.5} />}
        </Group>
      </UnstyledButton>

      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </div>
  );
};

export default UserButton;
