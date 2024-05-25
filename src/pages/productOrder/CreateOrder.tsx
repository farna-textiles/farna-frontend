/* eslint-disable react/jsx-props-no-spreading */
import React, { useMemo, useState } from 'react';
import {
  TextField,
  FormControl,
  TableContainer,
  Table,
  TableHead,
  Typography,
  TableBody,
  Paper,
  TableRow,
  TableCell,
  FormHelperText,
  Tooltip,
  IconButton,
  Autocomplete,
} from '@mui/material';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { useQuery } from '@tanstack/react-query';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router';
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
import { useCraeteOrder } from '../../hooks/useOrder';
import { getAllCurrencyUnits } from '../../api/currencyUnitApi';
import { getAllPaymentTypes } from '../../api/paymentMethodApi';
import { notifyError } from '../../lib/utils';
import Heading from '../../components/elements/Heading';
import ButtonLoader from '../../components/elements/buttons/ButtonLoader';
import EndUsesList from '../product/component/EndUsesList';

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
  PI_number: yup.string(),
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
  const { data: currencyUnits } = useQuery(['currencyUnits'], async () =>
    getAllCurrencyUnits()
  );
  const { data: paymentMethods } = useQuery(['paymentMethods'], async () =>
    getAllPaymentTypes()
  );
  const useCreateOrderMutation = useCraeteOrder();
  const navigate = useNavigate();

  const defaultCurrencyUnitId = useMemo(() => {
    const data = currencyUnits?.data;

    const defaultCurrency = data?.find((currency) => currency.symbol === '$');

    const defaultId = defaultCurrency?.id ?? data?.[0]?.id ?? null;

    return defaultId;
  }, [currencyUnits]);

  const formik = useFormik({
    initialValues: {
      salesReceiptDate: new Date().toISOString().split('T')[0],
      validity: new Date().toISOString().split('T')[0],
      shipmentType: '',
      PI_number: '',
      paymentTypeId: null,
      currencyUnitId: defaultCurrencyUnitId,
      customerId: null,
    },
    enableReinitialize: true,
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
              quantity: parseInt(product.quantity.toString(), 10),
              rate: parseFloat(product.rate.toString()),
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
    return currencyUnits?.data?.find(
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
      className="bg-gray-100 min-h-[90vh] flex flex-col justify-center items-center p-4 md:p-8"
    >
      <div className="bg-white shadow-lg p-4 md:p-8 rounded-xl w-full max-w">
        <Heading
          title="Sales Receipt Generation"
          description="Enter the details for a new sales receipt."
        />

        <section className="grid md:grid-cols-2 gap-6 mb-6">
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
                itemToShow={(customer: Customer) => customer.businessName}
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
                rows={7}
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
        </section>

        <section className="grid md:grid-cols-2 gap-6 mb-6">
          <FormControl variant="outlined" fullWidth margin="dense">
            <Autocomplete
              options={paymentMethods?.data || []}
              getOptionLabel={(option: PaymentMethod) => option.name}
              value={
                paymentMethods?.data.find(
                  (method) => method.id === formik.values.paymentTypeId
                ) || null
              }
              onChange={(_event, newValue) => {
                formik.setFieldValue('paymentTypeId', newValue?.id || '');
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  name="paymentTypeId"
                  label="Payment Method"
                  error={
                    formik.touched.paymentTypeId &&
                    Boolean(formik.errors.paymentTypeId)
                  }
                  helperText={
                    formik.touched.paymentTypeId && formik.errors.paymentTypeId
                  }
                />
              )}
            />
          </FormControl>
          <FormControl
            variant="outlined"
            fullWidth
            margin="dense"
            className="mb-4 md:mb-8"
          >
            <Autocomplete
              options={currencyUnits?.data || []}
              getOptionLabel={(option: CurrencyUnit) =>
                `${option.name}: ${option.code} - ${option.symbol}`
              }
              value={
                currencyUnits?.data.find(
                  (currency) => currency.id === formik.values.currencyUnitId
                ) || null
              }
              onChange={(_event, newValue) => {
                formik.setFieldValue('currencyUnitId', newValue?.id || '');
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  name="currencyUnitId"
                  label="Currency"
                  error={
                    formik.touched.currencyUnitId &&
                    Boolean(formik.errors.currencyUnitId)
                  }
                  helperText={
                    formik.touched.currencyUnitId &&
                    formik.errors.currencyUnitId
                  }
                />
              )}
            />
          </FormControl>
        </section>

        <h3 className="text-xl font-semibold mb-3">Product Details</h3>
        <div className="flex justify-between items-center mb-5 space-x-4">
          <SearchDropdown<ProductOrderType>
            type="Product"
            queryFn={getProducts}
            onSelect={handleSelectProduct}
            placeholder="Search for a product..."
            itemToShow={(productOrder: ProductOrderType) => (
              <div className="px-5 w-full border-gray-300 transition duration-300 ease-in-out transform hover:scale-105">
                <div className="flex justify-between items-center">
                  <div className="text-lg text-gray-800">
                    {productOrder.denier} &bull; {productOrder.lotNo} &bull;{' '}
                    {productOrder.noOfFilaments}
                  </div>
                  <div className="text-gray-500">
                    <EndUsesList endUses={productOrder.endUses} />
                  </div>
                </div>
              </div>
            )}
            itemToString={(productOrder: ProductOrderType) =>
              productOrder.lotNo
            }
          />
          <Tooltip title="Create new Product">
            <IconButton
              type="button"
              onClick={() => navigate('/product/new')}
              className=""
            >
              <AddIcon />
            </IconButton>
          </Tooltip>
        </div>

        {!!selectedProducts.length && (
          <div className="mb-4 md:mb-8 mt-4 md:mt-5">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <hr className="border-t border-gray-300 w-full md:w-2/3 mt-2 md:ml-4" />
            </div>
            <TableContainer component={Paper} className="mb-6">
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
                      currency={selectedCurrencySymbol ?? ''}
                      onProductUpdate={handleProductUpdate}
                      onProductRemove={handleProductRemove}
                    />
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <footer className="flex justify-between items-center mt-6">
              <Typography variant="h6">
                Total: {selectedCurrencySymbol}{' '}
                {parseFloat(totalAmount.toFixed(2))}
              </Typography>
              <ButtonLoader
                isLoading={useCreateOrderMutation.isLoading}
                disabled={useCreateOrderMutation.isLoading}
                onClick={formik.handleSubmit}
              >
                Save Order
              </ButtonLoader>
            </footer>
          </div>
        )}
      </div>
    </form>
  );
};

export default CreateOrder;
