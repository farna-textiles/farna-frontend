import React, { useMemo, useState } from 'react';
import * as yup from 'yup';
import CurrencyAndPayment from '../../components/additionals/GenericCRUD';
import { getAllCurrencyUnits } from '../../api/currencyUnitApi';
import { CurrencyUnit, TableColumn } from '../../interfaces';
import {
  useCreateCurrencyUnit,
  useDeleteCurrencyUnit,
  useUpdateCurrencyUnit,
} from '../../hooks/useCurrencyUnits';

const validationSchema = yup.object().shape({
  name: yup.string().required('Currency Name is required'),
  code: yup.string().required('Currency Code is required'),
  symbol: yup
    .string()
    .required('Currency Symbol is required')
    .matches(/[^a-zA-Z0-9]/, 'Symbol must not be alphanumeric'),
});

const CurrencyUnits: React.FC = () => {
  const [newCurrencyName, setNewCurrencyName] = useState('');
  const [newCurrencyCode, setNewCurrencyCode] = useState('');
  const [newCurrencySymbol, setNewCurrencySymbol] = useState('');
  const [isEdit, setIsEdit] = useState<boolean>(false);

  const useCurrencyUnit = useCreateCurrencyUnit();
  const updateCurrencyUnit = useUpdateCurrencyUnit();
  const deleteCurrencyUnit = useDeleteCurrencyUnit();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = (values: any) => {
    if (isEdit && values) {
      updateCurrencyUnit.mutateAsync([
        values.id as number,
        values as CurrencyUnit,
      ]);
    } else {
      useCurrencyUnit.mutateAsync(values as CurrencyUnit);
    }
  };

  const handleEdit = (currencyUnit: CurrencyUnit) => {
    setIsEdit(!!currencyUnit);
  };

  const handleDelete = (currencyId: number) => {
    deleteCurrencyUnit.mutate(currencyId);
  };

  const formConfig = [
    {
      label: 'Name',
      id: 'name',
      value: newCurrencyName,
      required: true,
      onChange: setNewCurrencyName,
    },
    {
      label: 'Code',
      id: 'code',
      value: newCurrencyCode,
      required: true,
      onChange: setNewCurrencyCode,
    },
    {
      label: 'Symbol',
      id: 'symbol',
      value: newCurrencySymbol,
      required: true,
      onChange: setNewCurrencySymbol,
    },
  ];

  const columns: TableColumn<CurrencyUnit>[] = useMemo(
    () => [
      { field: 'id', label: 'ID' },
      { field: 'name', label: 'Name' },
      { field: 'code', label: 'Code' },
      { field: 'symbol', label: 'Symbol' },
    ],
    []
  );

  return (
    <CurrencyAndPayment
      pageTitle="Currency Units"
      pageType="Currency Unit"
      fetchData={getAllCurrencyUnits}
      validationSchema={validationSchema}
      formConfig={formConfig}
      handleFormSubmit={handleSubmit}
      handleConfirmDelete={handleDelete}
      handleEdit={handleEdit}
      tableColumns={columns}
      initialValues={{
        name: 'newCurrencyName',
        code: newCurrencyCode,
        symbol: newCurrencySymbol,
      }}
    />
  );
};

export default CurrencyUnits;
