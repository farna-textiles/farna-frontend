import React, { useMemo, useState } from 'react';
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
  FormHelperText,
} from '@mui/material';
import * as yup from 'yup';
import { useFormik } from 'formik';
import CustomButton from '../../components/elements/CustomButton';
import {
  CurrencyUnit,
  Customer,
  PaymentMethod,
  ProductOrderType,
} from '../../interfaces';
import SearchDropdown from '../../components/elements/SearchableDropdown';
import { getCustomers } from '../../api';
import { getProducts } from '../../api/productApi';
import ProductRow from '../../components/table/productRow';
import useCurrencyUnits from '../../hooks/useCurrencyUnits';
import usePaymentMethods from '../../hooks/usePaymentMethods';
import { notifyError } from '../../lib/utils';
import { useCraeteOrder } from '../../hooks/useOrder';

const headerCellStyle = {
  backgroundColor: '#3F9FEB',
  color: 'white',
  fontWeight: 'bold',
};

const validationSchema = yup.object({
  salesReceiptDate: yup.date().required('Sales Receipt Date is required'),
  validity: yup
    .date()
    .required('Validity Date is required')
    .min(
      yup.ref('salesReceiptDate'),
      'Validity date should be after or the same as sales receipt date.'
    ),
  shipmentType: yup.string().required('Shipment Type is required'),
  PI_number: yup.string().required('PI Number is required'),
  paymentTypeId: yup.number().required('Payment Method is required'),
  currencyUnitId: yup.number().required('Currency is required'),
  customerId: yup.number().required('Customer is required'),
});

const CreateOrder: React.FC = () => {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [selectedProducts, setSelectedProducts] = useState<ProductOrderType[]>(
    []
  );
  const handleSelectCustomer = (customer: Customer | null) => {
    setSelectedCustomer(customer);
  };

  const { data: currencyUnits } = useCurrencyUnits();
  const { data: paymentMethods } = usePaymentMethods();
  const useCreateOrderMutation = useCraeteOrder();

  const formik = useFormik({
    initialValues: {
      salesReceiptDate: new Date().toISOString().split('T')[0],
      validity: new Date().toISOString().split('T')[0],
      shipmentType: '',
      PI_number: '',
      paymentTypeId: null,
      currencyUnitId: null,
      customerId: null,
    },
    validationSchema,
    onSubmit: (values) => {
      if (selectedProducts.length === 0) {
        notifyError('There must be at least one product in the order.');
      } else {
        useCreateOrderMutation.mutateAsync({
          ...values,
          salesReceiptDate: new Date(values.salesReceiptDate).toISOString(),
          validity: new Date(values.validity).toISOString(),
          orderProducts: selectedProducts.map((product: ProductOrderType) => {
            return {
              productId: product.id,
              quantity: product.quantity,
              rate: product.rate,
            };
          }),
        });
      }
    },
  });

  const handleProductRemove = (lotNo: string) => {
    const updatedProducts = selectedProducts.filter(
      (product) => product.lotNo !== lotNo
    );
    setSelectedProducts(updatedProducts);
  };

  const selectedCurrencySymbol = useMemo(() => {
    return currencyUnits.find(
      (currency: CurrencyUnit) => currency.id === formik.values.currencyUnitId
    )?.symbol;
  }, [currencyUnits, formik.values.currencyUnitId]);

  const handleSelectProduct = (product: ProductOrderType | null) => {
    if (
      product &&
      !selectedProducts.find(
        (selectedProduct) => selectedProduct.lotNo === product.lotNo
      )
    ) {
      const productWithDefaults = {
        ...product,
        quantity: 1,
        rate: 0,
      };
      setSelectedProducts([...selectedProducts, productWithDefaults]);
    }
  };

  const fields = [
    { key: 'lotNo', label: 'Lot No.' },
    { key: 'denier', label: 'Denier' },
    { key: 'type', label: 'Type' },
    { key: 'noOfFilaments', label: 'No of Filaments' },
    { key: 'luster', label: 'Luster' },
    { key: 'endUse', label: 'End Use' },
    { key: 'quantity', label: 'Quantity' },
    { key: 'rate', label: 'Rate' },
    { key: 'amount', label: 'Amount' },
  ];

  const totalAmount = selectedProducts?.reduce(
    (total, product) => total + product.quantity * product.rate,
    0
  );

  const handleProductUpdate = (updatedProduct: ProductOrderType) => {
    const updatedProducts = selectedProducts.map((product) =>
      product.id === updatedProduct.id ? updatedProduct : product
    );
    setSelectedProducts(updatedProducts);
  };

  return (
    <form
      onSubmit={formik.handleSubmit}
      className="bg-gray-100 min-h-screen flex flex-col justify-center items-center p-4 md:p-8"
    >
      <div className="bg-white shadow-md p-4 md:p-8 rounded-lg w-full max-w">
        <div className="flex justify-end">
          <CustomButton to="/product/new">Add New Product</CustomButton>
        </div>

        <h2 className="text-xl font-semibold mb-4">Sales Receipt</h2>
        <div className="grid md:grid-cols-2 gap-4 md:gap-8">
          <div>
            <FormControl fullWidth variant="outlined" margin="dense">
              <SearchDropdown<Customer>
                type="Customer"
                queryFn={getCustomers}
                onSelect={(customer: Customer | null) => {
                  handleSelectCustomer(customer);
                  formik.setFieldValue('customerId', customer?.id || 0);
                }}
                handleOnChange={() => formik.setFieldValue('customerId', null)}
                placeholder="Search for a customer..."
                itemToString={(customer: Customer) => customer.businessName}
              />
              {formik.touched.customerId && formik.errors.customerId && (
                <FormHelperText error>
                  {formik.errors.customerId}
                </FormHelperText>
              )}
            </FormControl>
            {selectedCustomer && (
              <TextField
                label="Billing Address"
                variant="outlined"
                fullWidth
                multiline
                rows={4}
                margin="dense"
                value={
                  selectedCustomer?.mainContact?.address
                    ? `${selectedCustomer.mainContact.address.street}, ${selectedCustomer.mainContact.address.city}, ${selectedCustomer.mainContact.address.state}, ${selectedCustomer.mainContact.address.country}, ${selectedCustomer.mainContact.address.postalCode}`
                    : ''
                }
                disabled={!!selectedCustomer}
                autoComplete="off"
              />
            )}
          </div>
          <div>
            <TextField
              name="salesReceiptDate"
              label="Sales Receipt Date"
              variant="outlined"
              fullWidth
              type="date"
              margin="dense"
              onChange={formik.handleChange}
              value={formik.values.salesReceiptDate}
              error={
                formik.touched.salesReceiptDate &&
                Boolean(formik.errors.salesReceiptDate)
              }
              helperText={
                formik.touched.salesReceiptDate &&
                formik.errors.salesReceiptDate
              }
              autoComplete="off"
            />
            <TextField
              name="validity"
              label="Validity"
              variant="outlined"
              fullWidth
              type="date"
              margin="dense"
              onChange={formik.handleChange}
              value={formik.values.validity}
              error={formik.touched.validity && Boolean(formik.errors.validity)}
              helperText={formik.touched.validity && formik.errors.validity}
              autoComplete="off"
            />
            <TextField
              label="Shipment"
              variant="outlined"
              fullWidth
              margin="dense"
              name="shipmentType"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.shipmentType}
              error={
                formik.touched.shipmentType &&
                Boolean(formik.errors.shipmentType)
              }
              helperText={
                formik.touched.shipmentType && formik.errors.shipmentType
              }
            />
            <TextField
              name="PI_number"
              label="Pi Number"
              variant="outlined"
              fullWidth
              margin="dense"
              autoComplete="off"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.PI_number}
              error={
                formik.touched.PI_number && Boolean(formik.errors.PI_number)
              }
              helperText={formik.touched.PI_number && formik.errors.PI_number}
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4 md:gap-8 mt-4 md:mt-6">
          <div>
            <FormControl variant="outlined" fullWidth margin="dense">
              <InputLabel>Payment Method</InputLabel>
              <Select
                name="paymentTypeId"
                label="Payment Method"
                value={formik.values.paymentTypeId}
                onChange={formik.handleChange}
                error={
                  formik.touched.paymentTypeId &&
                  Boolean(formik.errors.paymentTypeId)
                }
              >
                {paymentMethods.map((method: PaymentMethod) => (
                  <MenuItem key={method.id} value={method.id}>
                    {method.name}
                  </MenuItem>
                ))}
              </Select>
              {formik.touched.paymentTypeId && formik.errors.paymentTypeId && (
                <FormHelperText error>
                  {formik.errors.paymentTypeId}
                </FormHelperText>
              )}
            </FormControl>
          </div>
          <div>
            <FormControl
              variant="outlined"
              fullWidth
              margin="dense"
              className="mb-4 md:mb-8"
            >
              <InputLabel>Currency</InputLabel>
              <Select
                name="currencyUnitId"
                label="Currency"
                value={formik.values.currencyUnitId}
                onChange={formik.handleChange}
                error={
                  formik.touched.currencyUnitId &&
                  Boolean(formik.errors.currencyUnitId)
                }
              >
                {currencyUnits.map((currency: CurrencyUnit) => (
                  <MenuItem key={currency.id} value={currency.id}>
                    {currency.symbol}
                  </MenuItem>
                ))}
              </Select>
              {formik.touched.currencyUnitId &&
                formik.errors.currencyUnitId && (
                  <FormHelperText error>
                    {formik.errors.currencyUnitId}
                  </FormHelperText>
                )}
            </FormControl>
          </div>
        </div>
        <div className="mb-4 md:mb-8 mt-4 md:mt-5">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <SearchDropdown<ProductOrderType>
              type="Product"
              queryFn={getProducts}
              onSelect={handleSelectProduct}
              placeholder="Search for a customer..."
              itemToString={(customer: ProductOrderType) => customer.lotNo}
            />
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
                <TableCell align="center" sx={headerCellStyle}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {selectedProducts.map((product) => (
                <ProductRow
                  fields={fields}
                  key={product.lotNo}
                  product={product}
                  currency={selectedCurrencySymbol}
                  onProductUpdate={handleProductUpdate}
                  onProductRemove={handleProductRemove}
                />
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
              {selectedCurrencySymbol}{' '}
              {parseFloat(totalAmount.toFixed(2)).toString()}
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
            <CustomButton
              isLoading={useCreateOrderMutation.isLoading}
              onClick={formik.handleSubmit}
            >
              Save
            </CustomButton>
          </Grid>
        </Grid>
      </div>
    </form>
  );
};

export default CreateOrder;
