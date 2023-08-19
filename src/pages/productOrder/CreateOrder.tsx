/* eslint-disable react/button-has-type */
/* eslint-disable prettier/prettier */
import React from 'react';
import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TableContainer,
  Table,
  TableHead,
  Grid,
  Typography,
  TableBody,
  Paper,
  TableRow,
  TableCell,
} from '@mui/material';
import CustomButton from '../../components/elements/CustomButton';

const headerCellStyle = {
  backgroundColor: '#3F9FEB',
  color: 'white',
  fontWeight: 'bold',
};

const inputLabelProps = {
  shrink: true,
  style: {
    fontSize: '22px',
  },
};
const AllOrder: React.FC = () => {
  const dummyProductData = [
    {
      lotNo: '123',
      diner: 'Medium',
      type: 'Type A',
      noOfFlament: 5,
      luster: 'High',
      endUse: 'Clothing',
      quantity: 10,
      rate: 25,
    },
    {
      lotNo: '124',
      diner: 'Thick',
      type: 'Type B',
      noOfFlament: 8,
      luster: 'Medium',
      endUse: 'Furniture',
      quantity: 20,
      rate: 30,
    },
  ];
  const fields = [
    { key: 'lotNo', label: 'Lot No.' },
    { key: 'diner', label: 'Diner' },
    { key: 'type', label: 'Type' },
    { key: 'noOfFlament', label: 'No of Flament' },
    { key: 'luster', label: 'Luster' },
    { key: 'endUse', label: 'End Use' },
    { key: 'quantity', label: 'Quantity' },
    { key: 'rate', label: 'Rate' },
    { key: 'amount', label: 'Amount' },
  ];
  const customers = [
    { value: 'customer1', label: 'Customer 1' },
    { value: 'customer2', label: 'Customer 2' },
    { value: 'customer3', label: 'Customer 3' },
  ];
  const paymentMethods = [
    { value: 'Credit Card', label: 'Credit Card' },
    { value: 'Bank Transfer', label: 'Bank Transfer' },
    { value: 'PayPal', label: 'PayPal' },
  ];

  const totalAmount = dummyProductData.reduce(
    (total, product) => total + product.quantity * product.rate,
    0
  );
  return (
    <div className="bg-gray-100 min-h-screen flex flex-col justify-center items-center p-4 md:p-8">
      <div className="bg-white shadow-md p-4 md:p-8 rounded-lg w-full max-w">
        <div className="flex justify-end">
          <CustomButton>Add New Product</CustomButton>
        </div>

        <h2 className="text-xl font-semibold mb-4">Sales Receipt no. 1823</h2>
        <div className="grid md:grid-cols-2 gap-4 md:gap-8">
          <div>
            <FormControl fullWidth variant="outlined" margin="dense">
              <InputLabel id="customer-label">Customer</InputLabel>
              <Select labelId="customer-label" id="customer" label="Customer">
                {customers.map((customer) => (
                  <MenuItem key={customer.value} value={customer.value}>
                    {customer.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Billing Address"
              variant="outlined"
              fullWidth
              multiline
              rows={4}
              margin="dense"
            />
          </div>
          <div>
            <TextField
              label="Sales Receipt Date"
              variant="outlined"
              fullWidth
              type="date"
              margin="dense"
              InputLabelProps={inputLabelProps}
            />
            <TextField
              label="Validity"
              variant="outlined"
              fullWidth
              type="date"
              margin="dense"
              InputLabelProps={inputLabelProps}
            />

            <TextField
              label="Shipment"
              variant="outlined"
              fullWidth
              margin="dense"
            />
            <TextField
              label="Pi Number"
              variant="outlined"
              fullWidth
              margin="dense"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4 md:gap-8 mt-4 md:mt-6">
          <div>
            <FormControl variant="outlined" fullWidth margin="dense">
              <InputLabel>Payment Method</InputLabel>
              <Select label="Payment Method">
                {paymentMethods.map((method) => (
                  <MenuItem key={method.value} value={method.value}>
                    {method.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        </div>
        <div className="mb-4 md:mb-8 mt-4 md:mt-5">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <TextField
              label="Search Product"
              variant="outlined"
              size="small"
              className="w-1/3"
            />{' '}
            <hr className="border-t border-gray-300 w-full md:w-2/3 mt-2 md:ml-4" />
          </div>
        </div>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                {fields.map((field) => (
                  <TableCell
                    key={field.key}
                    align="center"
                    sx={headerCellStyle}
                  >
                    {field.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {dummyProductData.map((order) => (
                <TableRow key={order.lotNo}>
                  {fields.map((field) => (
                    <TableCell key={field.key} align="center">
                      {field.key === 'amount'
                        ? order.quantity * order.rate
                        : order[field.key]}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Grid container justifyContent="flex-end" mt={4}>
          <Grid item xs={1}>
            <Typography variant="subtitle1" fontWeight="bold">
              Total Amount:
            </Typography>
          </Grid>
          <Grid>
            <Typography variant="subtitle1" ml={5}>
              {totalAmount}
            </Typography>
          </Grid>
        </Grid>

        <Grid
          container
          justifyContent="flex-end"
          alignItems="center"
          mt={2}
          spacing={2}
        >
          <Grid item>
            <CustomButton>Save</CustomButton>
          </Grid>
          <Grid item>
            <CustomButton>Save and Email</CustomButton>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default AllOrder;
