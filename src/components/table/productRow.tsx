import React, { useState } from 'react';
import { TableRow, TableCell, TextField, Box } from '@mui/material';
import { ProductOrderType } from '../../interfaces';
import EndUsesList from '../../pages/product/component/EndUsesList';

type ProductRowProps = {
  product: ProductOrderType;
  onProductUpdate: (updatedProduct: ProductOrderType) => void;
  fields: { key: string; label: string }[];
  currency: string;
};

type EditableFields = 'quantity' | 'rate';

const ProductRow: React.FC<ProductRowProps> = ({
  product,
  onProductUpdate,
  fields,
  currency,
}) => {
  const [localProduct, setLocalProduct] = useState(product);

  const handleValueChange = (key: EditableFields, value: number) => {
    const updatedProduct = { ...localProduct, [key]: value };
    setLocalProduct(updatedProduct);
    onProductUpdate(updatedProduct);
  };

  return (
    <TableRow
      key={product.lotNo}
      sx={{ '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.03)' } }}
    >
      {fields.map((field) => {
        if (field.key === 'quantity' || field.key === 'rate') {
          return (
            <TableCell key={field.key} align="center">
              <TextField
                variant="outlined"
                size="small"
                type="number"
                value={localProduct[field.key]}
                onChange={(e) =>
                  handleValueChange(
                    field.key as EditableFields,
                    +e.target.value
                  )
                }
                InputProps={{
                  style: { width: '80px', padding: '5px' }, // Adjust width as needed
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
                {localProduct.quantity * localProduct.rate}
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
    </TableRow>
  );
};

export default ProductRow;
