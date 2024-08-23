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
  Autocomplete,
  Tooltip,
  IconButton,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { useNavigate, useParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import {
  CurrencyUnit,
  Customer,
  Order,
  OrderUpdateData,
  PaymentMethod,
  ProductOrderType,
} from '../../interfaces';
import SearchDropdown from '../../components/elements/SearchableDropdown';
import { getCustomers } from '../../api';
import { getProducts } from '../../api/productApi';
import ProductRow from '../../components/table/productRow';
import { notifyError } from '../../lib/utils';
import { useOrder, useUpdateOrder } from '../../hooks/useOrder';
import { getAllCurrencyUnits } from '../../api/currencyUnitApi';
import { getAllPaymentTypes } from '../../api/paymentMethodApi';
import Heading from '../../components/elements/Heading';
import ButtonLoader from '../../components/elements/buttons/ButtonLoader';

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
  note: yup.string(),
  paymentTypeId: yup.number().required('Payment Method is required'),
  currencyUnitId: yup.number().required('Currency is required'),
  customerId: yup.number().required('Customer is required'),
});

const EditOrder: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: orderData } = useOrder(
    parseInt(id as string, 10) as number
  ) as { data: Order };

  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    orderData.customer
  );
  const [selectedProducts, setSelectedProducts] = useState<ProductOrderType[]>(
    orderData.orderProducts.map((orderProduct) => {
      const { id: productOrderId, quantity, rate, product } = orderProduct;
      return {
        id: productOrderId,
        quantity,
        rate,
        ...product,
      } as ProductOrderType;
    })
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
  const useUpdateProductMutation = useUpdateOrder();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      salesReceiptDate: orderData.salesReceiptDate,
      validity: orderData.validity,
      shipmentType: orderData.shipmentType,
      PI_number: orderData.PI_number,
      note: orderData.note,
      paymentTypeId: orderData.paymentType.id,
      currencyUnitId: orderData.currencyUnit.id,
      customerId: orderData.customer.id,
    },
    validationSchema,
    onSubmit: (values) => {
      if (selectedProducts.length === 0) {
        notifyError('There must be at least one product in the order.');
      } else {
        if (!id) return;
        useUpdateProductMutation.mutateAsync([
          +id,
          {
            id,
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
          } as OrderUpdateData,
        ]);
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
          title="Sales Receipt Modification"
          description="Make changes to an existing sales receipt"
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
                defaultValue={orderData.customer.businessName}
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
          <div>
            <TextField
              label="Note"
              placeholder='Type the note regarding booking.'
              variant="outlined"
              fullWidth
              multiline
              rows={7}
              margin="dense"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.note}
              autoComplete="off"
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
            placeholder="Search for a customer..."
            itemToString={(customer: ProductOrderType) => customer.lotNo}
          />
          <Tooltip title="Create new Product">
            <IconButton
              type="button"
              onClick={() => navigate('/product/new')}
              className=""
            >
              <AddIcon />
            </IconButton>
          </Tooltip>{' '}
        </div>
        {!!selectedProducts.length && (
          <div className="mb-4 md:mb-8 mt-4 md:mt-5">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <hr className="border-t border-gray-300 w-full md:w-2/3 mt-2 md:ml-4" />
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
                isLoading={useUpdateProductMutation.isLoading}
                disabled={useUpdateProductMutation.isLoading}
                onClick={formik.handleSubmit}
              >
                Update
              </ButtonLoader>
            </footer>
          </div>
        )}
      </div>
    </form>
  );
};

export default EditOrder;
