/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { Box } from '@mui/material';
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
import CustomModal from '../../components/Modal';
import { useInvite } from '../../hooks/useAuth';
import Heading from '../../components/elements/Heading';
import { useDeleteUser, useUpdateUser } from '../../hooks/useUser';
import DeleteIcon from '@mui/icons-material/Delete';
import DeleteConfirmationDialog from '../../components/modals/DeleteConfirmationDialog';
import React from 'react';

const Users = () => {
  const navigate = useNavigate();
  const updateUserMutation = useUpdateUser();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalData] = useState<InviteUser>({
    email: '',
  });
  const [userId, setUserId] = useState<number | null>(null);

  const useUserInvite = useInvite();
  const useUserDelete = useDeleteUser();
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
        title: 'Delete',
        onClick: (userId: number) => {
          setUserId(userId);
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
    <Box sx={{ mx: 4 }}>
      <Heading
        title="User Management"
        description="Manage and review user resgistrations (Admins only)"
      />
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
          loadInProgress={
            updateUserMutation.isLoading ||
            useUserInvite.isLoading ||
            useUserDelete.isLoading
          }
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
        submitButton="Invite"
      />
      <DeleteConfirmationDialog
        isDeleteDialogOpen={!!userId}
        pageType="User"
        handleConfirmDelete={() => {
          if (userId) {
            useUserDelete.mutate(userId);

            setUserId(null);
          }
        }}
        handleCancelDelete={() => setUserId(null)}
      />
    </Box>
  );
};

export default Users;
