/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import Edit from '@mui/icons-material/Edit';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ActionButton,
  AdditionalColumn,
  TableColumn,
  UserObject as User,
} from '../../interfaces';
import GenericTable from '../../components/table/GenericTable';
import { getAllUsers } from '../../api/userApi';
import useUpdateUser from '../../hooks/useUser';

const Users = () => {
  const navigate = useNavigate();
  const updateUserMutation = useUpdateUser();

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
          navigate(`/edit/${id}`);
        },
      },
      {
        icon: <DeleteIcon />,
        onClick: (id: number) => {
          console.log(`Delete button clicked for item with ID: ${id}`);
        },
      },
    ],
    []
  );

  const additionalColumn: AdditionalColumn<User> = {
    type: 'checkbox',
    onChange: (itemId: number, checked: boolean) => {
      updateUserMutation.mutateAsync([itemId, { isActive: checked }]);
    },
    valueGetter: (item: User) => {
      return item.isActive;
    },
    columnName: '',
  };

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
          tableName="Users"
          columns={columns}
          fetchData={getAllUsers}
          actionButtons={actionButtons}
          addButtonLink="/add"
          addButtonLabel="Add User"
          additionalColumn={additionalColumn}
          loadInProgress={false}
        />
      </Box>
    </Box>
  );
};

export default Users;
