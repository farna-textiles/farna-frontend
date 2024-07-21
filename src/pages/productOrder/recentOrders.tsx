import { useMemo } from 'react';
import Edit from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import { Box } from '@mui/material';
import { useNavigate } from 'react-router';
import { ActionButton, TableColumn, Order } from '../../interfaces';
import GenericTable from '../../components/table/GenericTable';
import { getAllOrders } from '../../api';
import { useDeleteOrder } from '../../hooks/useOrder';
import Heading from '../../components/elements/Heading';

const Products = () => {
  const deleteOrderMutation = useDeleteOrder();

  const navigate = useNavigate();

  const columns: TableColumn<Order>[] = useMemo(
    () => [
      { field: 'id', label: 'Order ID' },
      { field: 'customer.businessName', label: 'Customer Name' },
      { field: 'salesReceiptDate', label: 'Sales Receipt Date' },
      { field: 'validity', label: 'Validity Date' },
      { field: 'shipmentType', label: 'Shipment Type' },
      { field: 'PI_number', label: 'PI Number' },
      { field: 'denier', label: 'Product' },
      { field: 'quantity', label: 'Qty' },
      { field: 'amount', label: 'Amount' },
      { field: 'note', label: 'Customer Notes' },
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
    <Box sx={{ mx: 4 }}>
      <Heading
        title="Order List"
        description="Keep track of your orders with ease"
      />
      <>
        <hr className="mb-6" />
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
