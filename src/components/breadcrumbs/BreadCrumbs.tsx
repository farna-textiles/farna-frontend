import { emphasize, styled } from '@mui/material/styles';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Chip from '@mui/material/Chip';
import HomeIcon from '@mui/icons-material/Home';
import * as _ from 'lodash';
import { useLocation } from 'react-router';
import { Link } from 'react-router-dom';

const StyledBreadcrumb = styled(Chip)(({ theme }) => {
  const backgroundColor =
    theme.palette.mode === 'light'
      ? theme.palette.grey[100]
      : theme.palette.grey[800];
  return {
    backgroundColor,
    height: theme.spacing(3),
    color: theme.palette.text.primary,
    fontWeight: theme.typography.fontWeightRegular,
    '&:hover, &:focus': {
      backgroundColor: emphasize(backgroundColor, 0.06),
    },
    '&:active': {
      boxShadow: theme.shadows[1],
      backgroundColor: emphasize(backgroundColor, 0.12),
    },
  };
}) as typeof Chip; // TypeScript only: need a type cast here because https://github.com/Microsoft/TypeScript/issues/26591

const CustomizedBreadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  return (
    <Breadcrumbs aria-label="breadcrumb">
      {pathnames.length > 0 && (
        <StyledBreadcrumb
          component={Link}
          to="/dashboard"
          label="Dashboard"
          icon={<HomeIcon fontSize="small" />}
        />
      )}

      {pathnames.map((value, index) => {
        const last = index === pathnames.length - 1;
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;

        if (to === '/dashboard') return null;

        return last ? (
          <StyledBreadcrumb key={to} label={_.capitalize(value)} />
        ) : (
          <StyledBreadcrumb
            key={to}
            component={Link}
            to={to}
            label={_.capitalize(value)}
          />
        );
      })}
    </Breadcrumbs>
  );
};

export default CustomizedBreadcrumbs;
