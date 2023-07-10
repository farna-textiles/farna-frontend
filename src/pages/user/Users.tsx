/* eslint-disable import/no-extraneous-dependencies */
import { Box, Typography } from '@mui/material';

import { TableColumn, UserObject as User } from '../../interfaces';
import GenericTable from '../../components/table/GenericTable';
import { getAllUsers } from '../../api/userApi';

const Users = () => {
  const columns: TableColumn<User>[] = [
    { field: 'id', label: 'ID' },
    { field: 'username', label: 'Username' },
    { field: 'email', label: 'Email' },
    { field: 'role', label: 'Role' },
  ];

  return (
    <Box sx={{ m: 4 }}>
      <Typography variant="h4" component="div" gutterBottom>
        User Management
      </Typography>
      <Typography variant="subtitle1" component="div" gutterBottom>
        Use the search bar to find specific users. Click on a user to edit their
        details.
      </Typography>
      <Box sx={{ my: 2 }}>
        <GenericTable<User> columns={columns} fetchData={getAllUsers} />
      </Box>
    </Box>
  );
};

export default Users;
