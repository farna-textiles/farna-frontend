import { Box, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import Edit from '@mui/icons-material/Edit';
import './responsiveStyles.css';
import { useMemo } from 'react';
import {
  ActionButton,
  AdditionalColumn,
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

  const additionalColumn: AdditionalColumn<User> = {
    type: 'radio',
    onChange: (itemId: number, checked: boolean) => {
      console.log(`Item with ID ${itemId} has been checked: ${checked}`);
    },
    valueGetter: (item: User) => {
      return item.isActive;
    },
    columnName: '',
  };

  return (
    <Box sx={{ m: 2 }}>
      <Typography variant="h4" component="div" gutterBottom>
        User Management
      </Typography>
      <Typography variant="subtitle1" component="div" gutterBottom>
        Use the search bar to find specific users. Click on a user to edit their
        details.
      </Typography>
      <Box sx={{ my: 2 }}>
      <div className="responsive-font">
  <GenericTable<User>
    tableName="Users"
    columns={columns}
    fetchData={getAllUsers}
    actionButtons={actionButtons}
    addButtonLink="/add"
    addButtonLabel="Add User"
    additionalColumn={additionalColumn}
  />
</div>
      </Box>
    </Box>
  );
};

export default Users;
