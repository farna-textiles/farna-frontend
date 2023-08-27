import { useMemo } from 'react';
import Edit from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import { Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router';
import { ActionButton, TableColumn, Order } from '../../interfaces';
import GenericTable from '../../components/table/GenericTable';
import { getAllOrders } from '../../api';
import { useDeleteOrder } from '../../hooks/useOrder';

const Products = () => {
  const deleteOrderMutation = useDeleteOrder();

  const navigate = useNavigate();

  const columns: TableColumn<Order>[] = useMemo(
    () => [
      { field: 'id', label: 'Order ID' },
      { field: 'salesReceiptDate', label: 'Sales Receipt Date' },
      { field: 'validity', label: 'Validity Date' },
      { field: 'shipmentType', label: 'Shipment Type' },
      { field: 'PI_number', label: 'PI Number' },
      // ... You can continue this pattern for other fields if needed
    ],
    []
  );

  const actionButtons: ActionButton[] = useMemo(
    () => [
      {
        icon: <FullscreenIcon />,
        onClick: (id: number) => {
          navigate(`/orders/${id}/invoice`);
        },
        title: 'View',
        disabled: deleteOrderMutation.isLoading,
      },
      {
        icon: <Edit />,
        title: 'Edit',
        onClick: (id: number) => navigate(`/orders/${id}/edit`),
        disabled: deleteOrderMutation.isLoading,
      },
      {
        icon: <DeleteIcon />,
        onClick: (id: number) => {
          deleteOrderMutation.mutateAsync(id);
        },
        title: 'Delete',
        disabled: deleteOrderMutation.isLoading,
      },
    ],
    [deleteOrderMutation, navigate]
  );

  return (
    <Box sx={{ m: 4 }}>
      <Typography variant="h4" component="div" gutterBottom>
        Recent Order
      </Typography>
      <>
        <hr className="mb-12" />
        <Box sx={{ my: 2 }}>
          <GenericTable<Order>
            tableName="Orders"
            columns={columns}
            fetchData={getAllOrders}
            actionButtons={actionButtons}
            addButtonLink="/order/new"
            addButtonLabel="Create Product Order"
            loadInProgress={deleteOrderMutation.isLoading}
          />
        </Box>
      </>
    </Box>
  );
};

export default Products;
