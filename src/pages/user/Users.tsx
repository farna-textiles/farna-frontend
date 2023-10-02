/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Typography } from '@mui/material';
import Edit from '@mui/icons-material/Edit';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import {
  ActionButton,
  AdditionalColumn,
  FieldConfig,
  InviteUser,
  TableColumn,
  UserObject as User,
} from '../../interfaces';
import GenericTable from '../../components/table/GenericTable';
import { getAllUsers } from '../../api/userApi';
import useUpdateUser from '../../hooks/useUser';
import CustomModal from '../../components/Modal';
import { useInvite } from '../../hooks/useAuth';

const Users = () => {
  const navigate = useNavigate();
  const updateUserMutation = useUpdateUser();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalData] = useState<InviteUser>({
    email: '',
  });

  const useUserInvite = useInvite();

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
    columnName: 'Status',
  };

  const userFields: FieldConfig<InviteUser>[] = useMemo(
    () => [{ label: 'Email', name: 'email', type: 'email' }],
    []
  );

  const userValidationSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Email is required.'),
  });

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleModalSave = (data: InviteUser) => {
    useUserInvite.mutateAsync(data);
    handleModalClose();
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
          onAddBtnClick={() => {
            setIsModalOpen(true);
          }}
          addButtonLabel="Invite User"
          additionalColumn={additionalColumn}
          loadInProgress={false}
        />
      </Box>
      <CustomModal<InviteUser & Record<string, any>>
        data={modalData}
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSave={handleModalSave}
        fields={userFields}
        validationSchema={userValidationSchema}
        title="Invite User"
      />
    </Box>
  );
};

export default Users;
