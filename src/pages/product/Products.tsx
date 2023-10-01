import { useCallback, useMemo } from 'react';
import Edit from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router';
import {
  ActionButton,
  TableColumn,
  ProductObject as Product,
  EndUseWithColor,
} from '../../interfaces';
import GenericTable from '../../components/table/GenericTable';
import { getAllProducts } from '../../api/productApi';
import { useDeleteProduct } from '../../hooks/useProduct';
import EndUsesList from './component/EndUsesList';

const Products = () => {
  const deleteProductMutation = useDeleteProduct();

  const endUsesList = useCallback(
    (endUses: EndUseWithColor[]) => <EndUsesList endUses={endUses} />,
    []
  );
  const navigate = useNavigate();

  const columns: TableColumn<Product>[] = useMemo(
    () => [
      { field: 'id', label: 'ID' },
      { field: 'lotNo', label: 'Lot No' },
      { field: 'denier', label: 'Denier' },
      { field: 'type', label: 'Type' },
      { field: 'noOfFilaments', label: 'No Of Filaments' },
      { field: 'luster', label: 'Luster' },
      {
        field: 'endUses',
        label: 'End Uses',
        format: endUsesList,
      },
    ],
    [endUsesList]
  );

  const actionButtons: ActionButton[] = useMemo(
    () => [
      {
        icon: <Edit />,
        title: 'Edit',
        onClick: (id: number) => navigate(`/products/${id}/edit`),
        disabled: deleteProductMutation.isLoading,
      },
      {
        icon: <DeleteIcon />,
        onClick: (id: number) => {
          deleteProductMutation.mutateAsync(id);
        },
        title: 'Delete',
        disabled: deleteProductMutation.isLoading,
      },
    ],
    [deleteProductMutation, navigate]
  );

  return (
    <Box sx={{ m: 4 }}>
      <Typography variant="h4" component="div" gutterBottom>
        Products
      </Typography>
      <>
        <hr className="mb-12" />
        <Box sx={{ my: 2 }}>
          <GenericTable<Product>
            tableName="Products"
            columns={columns}
            fetchData={getAllProducts}
            actionButtons={actionButtons}
            addButtonLink="/product/new"
            addButtonLabel="Create Product"
            loadInProgress={deleteProductMutation.isLoading}
          />
        </Box>
      </>
    </Box>
  );
};

export default Products;
