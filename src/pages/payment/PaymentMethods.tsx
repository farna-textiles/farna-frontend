import React, { useMemo, useState } from 'react';
import * as yup from 'yup';
import CurrencyAndPayment from '../../components/additionals/GenericCRUD';
import { getAllPaymentTypes } from '../../api/paymentMethodApi';
import { PaymentMethod, PaymentType, TableColumn } from '../../interfaces';
import {
  useCreatePaymentMethod,
  useDeletePaymentMethod,
  useUpdatePaymentMethod,
} from '../../hooks/usePaymentMethods';

const validationSchema = yup.object().shape({
  name: yup.string().required('Payment Method is required'),
});

const PaymentMethods: React.FC = () => {
  const [newPaymentMethod, setNewPaymentMethod] = useState('');
  const [isEdit, setIsEdit] = useState<boolean>(false);

  const usePaymentMethod = useCreatePaymentMethod();
  const updatePaymentMethod = useUpdatePaymentMethod();
  const deletePaymentMethod = useDeletePaymentMethod();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = (values: any) => {
    if (isEdit && values) {
      updatePaymentMethod.mutateAsync([
        values.id as number,
        values as PaymentMethod,
      ]);
    } else {
      usePaymentMethod.mutateAsync(values as PaymentMethod);
    }
  };

  const handleEdit = (paymentMethod: PaymentMethod) => {
    setIsEdit(!!paymentMethod);
  };

  const handleDelete = (paymentMethodId: number) => {
    deletePaymentMethod.mutate(paymentMethodId);
  };

  const formConfig = [
    {
      label: 'Payment Method',
      id: 'name',
      value: newPaymentMethod,
      required: true,
      onChange: setNewPaymentMethod,
    },
  ];

  const columns: TableColumn<PaymentType>[] = useMemo(
    () => [
      { field: 'id', label: 'ID' },
      { field: 'name', label: 'Name' },
    ],
    []
  );

  return (
    <CurrencyAndPayment
      pageTitle="Payment Methods"
      pageType="Payment Method"
      fetchData={getAllPaymentTypes}
      tableColumns={columns}
      validationSchema={validationSchema}
      formConfig={formConfig}
      handleFormSubmit={handleSubmit}
      handleConfirmDelete={handleDelete}
      handleEdit={handleEdit}
      initialValues={{
        paymentMethod: newPaymentMethod,
      }}
    />
  );
};

export default PaymentMethods;
