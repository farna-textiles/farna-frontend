/* eslint-disable import/no-extraneous-dependencies */
import { Box, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import Edit from '@mui/icons-material/Edit';
import { useMemo } from 'react';
import {
  ActionButton,
  TableColumn,
  UserObject as User,
} from '../../interfaces';
import GenericTable from '../../components/table/GenericTable';
import { getAllUsers } from '../../api/userApi';

const Users = () => {
  const columns: TableColumn<User>[] = useMemo(
    () => [
      { field: 'id', label: 'ID' },
      { field: 'username', label: 'Username' },
      { field: 'email', label: 'Email' },
      { field: 'role', label: 'Role' },
    ],
    []
  );

  const actionButtons: ActionButton[] = useMemo(
    () => [
      {
        icon: <Edit />,
        onClick: (id: number) => {
          console.log(`Edit button clicked for item with ID: ${id}`);
          // Perform edit logic
        },
      },
      {
        icon: <DeleteIcon />,
        onClick: (id: number) => {
          console.log(`Delete button clicked for item with ID: ${id}`);
          // Perform delete logic
        },
      },
    ],
    []
  );

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
        <GenericTable<User>
          columns={columns}
          fetchData={getAllUsers}
          actionButtons={actionButtons}
          addButtonLink="/add"
          addButtonLabel="Add User"
        />
      </Box>
    </Box>
  );
};

export default Users;
