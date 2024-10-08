import React, { useState } from 'react';
import { TableRow, TableCell, TextField, Box, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { ProductOrderType } from '../../interfaces';
import EndUsesList from '../../pages/product/component/EndUsesList';

type ProductRowProps = {
  product: ProductOrderType;
  onProductUpdate: (updatedProduct: ProductOrderType) => void;
  fields: { key: string; label: string }[];
  currency: string;
  onProductRemove: (lotNumber: string) => void;
};

type EditableFields = 'quantity' | 'rate';

const ProductRow: React.FC<ProductRowProps> = ({
  product,
  onProductUpdate,
  fields,
  currency,
  onProductRemove,
}) => {
  const [localProduct, setLocalProduct] = useState(product);

  const handleValueChange = (key: EditableFields, value: any) => {

    const sanitizedValue = value;

    const updatedProduct = { ...localProduct, [key]: sanitizedValue };

    setLocalProduct(updatedProduct);
    onProductUpdate(updatedProduct);
  };

  const handleRemoveClick = () => {
    onProductRemove(localProduct.lotNo);
  };

  return (
    <TableRow
      key={product.lotNo}
      sx={{
        '&:hover': {
          backgroundColor: 'rgba(0, 0, 0, 0.03)',
          cursor: 'pointer',
        },
      }}
    >
      {fields.map((field) => {
        if (field.key === 'quantity' || field.key === 'rate') {
          const min = 0.00000001;
          return (
            <TableCell key={field.key} align="center">
              <TextField
                variant="outlined"
                size="small"
                type="number" // Change this to "number"

                value={localProduct[field.key]}
                onChange={(e) =>
                  handleValueChange(
                    field.key as EditableFields,
                    parseFloat(e.target.value) // Parse the value to float
                  )
                }
                inputProps={{
                  style: { width: '80px', padding: '5px' },
                  min,
                  step: "0.001" // Add step attribute
                }}
              />
            </TableCell>
          );
        }


        if (field.key === 'amount') {
          return (
            <TableCell key={field.key} align="center">
              <Box fontWeight="bold">
                {currency}
                {
                  (localProduct.quantity * localProduct.rate).toFixed(2)
                    .toString()}
              </Box>
            </TableCell>
          );
        }

        if (field.key === 'endUse') {
          return (
            <TableCell key={field.key} align="center">
              <EndUsesList endUses={localProduct.endUses} />
            </TableCell>
          );
        }

        return (
          <TableCell key={field.key} align="center">
            {field.key === 'rate'
              ? `${currency}${product[field.key]}`
              : product[field.key]}
          </TableCell>
        );
      })}
      <TableCell align="center">
        <IconButton
          onClick={handleRemoveClick}
          aria-label="Remove Product"
          color="secondary"
          sx={{
            padding: 0,
            '&:hover': {
              background: 'none',
              color: 'red',
            },
          }}
        >
          <DeleteIcon sx={{ fontSize: '1.2rem' }} />
        </IconButton>
      </TableCell>
    </TableRow>
  );
};

export default ProductRow;
