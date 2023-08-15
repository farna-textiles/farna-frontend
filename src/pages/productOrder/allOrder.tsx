/* eslint-disable react/button-has-type */
/* eslint-disable prettier/prettier */
import React from 'react';
import './style.css';
import {
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Table,
  TableHead,
  Grid,
  Typography,
  TableBody,
  TableRow,
  TableCell,
} from '@mui/material';

const headerCellStyle = {
  backgroundColor: '#3F9FEB',
  color: 'white',
  fontWeight: 'bold',
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

  const totalAmount = dummyProductData.reduce(
    (total, product) => total + product.quantity * product.rate,
    0
  );

  return (
    <div className="bg-gray-100 min-h-screen flex justify-center items-center p-8">
      <div className="bg-white shadow-md p-8 rounded-lg w-full">
        <div className="flex justify-end">
          <Button variant="outlined" color="primary" className="mt-4">
            Add New Product
          </Button>
        </div>

        <h2 className="text-xl font-semibold mb-4">Sales Receipt no. 1823</h2>
        <div className="grid grid-cols-2 gap-8">
          <div>
            <FormControl fullWidth variant="outlined" margin="dense">
              <InputLabel id="customer-label">Customer</InputLabel>
              <Select labelId="customer-label" id="customer" label="Customer">
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value="customer1">Customer 1</MenuItem>
                <MenuItem value="customer2">Customer 2</MenuItem>
                <MenuItem value="customer3">Customer 3</MenuItem>
                {/* Add more MenuItem elements for other customers */}
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
              InputLabelProps={{
                shrink: true,
                style: {
                  fontSize: '22px',
                },
              }}
            />
            <TextField
              label="Validity"
              variant="outlined"
              fullWidth
              type="date"
              margin="dense"
              InputLabelProps={{
                shrink: true,
                style: {
                  fontSize: '22px',
                },
              }}
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

        <div className="grid grid-cols-2 gap-8 mt-6">
          <div>
            <FormControl variant="outlined" fullWidth margin="dense">
              <InputLabel>Payment Method</InputLabel>
              <Select label="Payment Method">
                <MenuItem value="Credit Card">Credit Card</MenuItem>
                <MenuItem value="Bank Transfer">Bank Transfer</MenuItem>
                <MenuItem value="PayPal">PayPal</MenuItem>
              </Select>
            </FormControl>
          </div>
        </div>
        <div className="mb-8 mt-5">
          <div className="flex justify-between items-center">
            <TextField
              label="Search Product"
              variant="outlined"
              size="small"
              className="w-1/3"
            />
            <hr className="border-t border-gray-300 w-2/3 ml-4" />
          </div>
        </div>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center" sx={headerCellStyle}>
                Lot No.
              </TableCell>
              <TableCell align="center" sx={headerCellStyle}>
                Diner
              </TableCell>
              <TableCell align="center" sx={headerCellStyle}>
                Type
              </TableCell>
              <TableCell align="center" sx={headerCellStyle}>
                No of Flament
              </TableCell>

              <TableCell align="center" sx={headerCellStyle}>
                Luster
              </TableCell>
              <TableCell align="center" sx={headerCellStyle}>
                End Use
              </TableCell>
              <TableCell align="center" sx={headerCellStyle}>
                Quantity
              </TableCell>
              <TableCell align="center" sx={headerCellStyle}>
                Rate
              </TableCell>
              <TableCell align="center" sx={headerCellStyle}>
                Amount
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dummyProductData.map((product) => (
              <TableRow key={product.lotNo}>
                <TableCell align="center">{product.lotNo}</TableCell>
                <TableCell align="center">{product.diner}</TableCell>
                <TableCell align="center">{product.type}</TableCell>
                <TableCell align="center">{product.noOfFlament}</TableCell>
                <TableCell align="center">{product.luster}</TableCell>
                <TableCell align="center">{product.endUse}</TableCell>
                <TableCell align="center">{product.quantity}</TableCell>
                <TableCell align="center">{product.rate}</TableCell>
                <TableCell align="center">
                  {product.quantity * product.rate}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

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
            <Button variant="contained" color="secondary">
              Save
            </Button>
          </Grid>
          <Grid item>
            <Button variant="contained" color="primary">
              Save and Email
            </Button>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default AllOrder;
