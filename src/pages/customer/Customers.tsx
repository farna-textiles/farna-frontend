/* eslint-disable prettier/prettier */
import  { useMemo } from 'react';
import { Box, Typography, Grid } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import Edit from '@mui/icons-material/Edit';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import { useNavigate } from 'react-router';
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
  const navigate = useNavigate();
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
        icon: <FullscreenIcon />,
        onClick: (id: number) => {
          navigate(`/customers/${id}`);
        },
        title: 'View',
      },
      {
        icon: <Edit />,
        onClick: (id: number) => navigate(`/customers/${id}/edit`),
      },
      {
        icon: <DeleteIcon />,
        onClick: (id: number) => {
          deleteCustomerMutation.mutate(id);
        },
      },
    ],
    [deleteCustomerMutation, navigate]
  );

  return (
    <Box className="m-4">
      <Typography variant="h4" component="div" className="mb-4">
        Customers
      </Typography>
      <hr className="mb-4" />
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <div className="overflow-x-auto">
            <div className="min-w-full">
              <GenericTable<User>
                tableName="Customers"
                columns={columns}
                fetchData={getAllCustomers}
                actionButtons={actionButtons}
                addButtonLink="/customer"
                addButtonLabel="Create Customer"
              />
            </div>
          </div>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Customers;
