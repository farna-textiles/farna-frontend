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
import { getAllCustomers } from '../../api/customerApi';
import { useDeleteCustomer } from '../../hooks/useCustomer';

const Customers = () => {
  const deleteCustomerMutation = useDeleteCustomer();

  const columns: TableColumn<User>[] = useMemo(
    () => [
      { field: 'id', label: 'ID' },
      { field: 'businessName', label: 'Business' },
      { field: 'mainContact.name', label: 'Name' },
      { field: 'mainContact.contactNumber', label: 'Contact #' },
      {
        field: 'mainContact.address',
        label: 'Address',
        format: (address) => {
          const { street, city, postalCode } = address;
          return `${street}, ${city} - ${postalCode}`;
        },
      },
    ],
    []
  );

  const actionButtons: ActionButton[] = useMemo(
    () => [
      {
        icon: <Edit />,
        onClick: (id: number) => {},
      },
      {
        icon: <DeleteIcon />,
        onClick: (id: number) => {
          deleteCustomerMutation.mutate(id);
        },
      },
    ],
    [deleteCustomerMutation]
  );

  return (
    <Box sx={{ m: 4 }}>
      <Typography variant="h4" component="div" gutterBottom>
        Customers
      </Typography>
      <hr className="mb-12" />
      <Box sx={{ my: 2 }}>
        <GenericTable<User>
          tableName="Customers"
          columns={columns}
          fetchData={getAllCustomers}
          actionButtons={actionButtons}
          addButtonLink="/create-customer"
          addButtonLabel="Create Customer"
        />
      </Box>
    </Box>
  );
};

export default Customers;
