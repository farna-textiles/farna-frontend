/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useMemo, useState } from 'react';
import { Card, CardContent, TableContainer } from '@mui/material';
import * as yup from 'yup';
import Edit from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DeleteConfirmationDialog from '../modals/DeleteConfirmationDialog';
import EditableForm from './EditableForm';
import {
  ActionButton,
  FormFieldConfig,
  PaginatedResponse,
  PaymentType,
  TableColumn,
} from '../../interfaces';
import GenericTable from '../table/GenericTable';

interface CurrencyAndPaymentProps<T> {
  pageTitle: string;
  pageType: string;
  tableColumns: TableColumn<T>[];
  fetchData: (
    page: number,
    pageSize: number,
    searchQuery: string
  ) => Promise<PaginatedResponse<T>>;
  handleConfirmDelete: (id: number) => void;
  validationSchema: yup.ObjectSchema<any>;
  formConfig: FormFieldConfig[];
  handleFormSubmit: (values: any) => void;
  handleEdit: (selectedItem: T) => void;
  initialValues: Record<string, any>;
}

const CurrencyAndPayment: React.FC<CurrencyAndPaymentProps<any>> = ({
  pageTitle,
  pageType,
  fetchData,
  handleConfirmDelete,
  validationSchema,
  formConfig,
  handleFormSubmit,
  handleEdit,
  initialValues,
  tableColumns,
}) => {
  const [selectedItem, setSelectedItem] = useState<typeof initialValues>();
  const [itemId, setItemId] = useState<number>();

  const actionButtons: ActionButton[] = useMemo(
    () => [
      {
        icon: <Edit />,
        onClick: (_id: number, item: any) => {
          setSelectedItem(item);
          handleEdit(item);
        },
      },
      {
        icon: <DeleteIcon />,
        onClick: (id: number) => {
          setItemId(id);
        },
      },
    ],
    [handleEdit]
  );

  return (
    <div className="container mx-auto mt-12 mr-2">
      <h1 className="text-3xl mb-5 p-2 text-primary">{pageTitle}</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span">
          <EditableForm
            pageType={pageType}
            fields={formConfig}
            primaryButtonLabel={selectedItem ? 'Update' : 'Create'}
            validationSchema={validationSchema}
            initialValues={{ ...selectedItem } || initialValues}
            handleSubmit={(values) => {
              handleFormSubmit(values);
            }}
          />
        </div>
        <div className="md:col-span-2">
          <Card>
            <CardContent>
              <h2 className="text-xl font-semibold mb-4">{pageType} List</h2>
              <TableContainer>
                <GenericTable<PaymentType>
                  tableName={pageTitle}
                  columns={tableColumns}
                  fetchData={fetchData}
                  actionButtons={actionButtons}
                  addButtonLabel={selectedItem ? 'Create' : undefined}
                  loadInProgress={false}
                  onAddBtnClick={() => {
                    setSelectedItem(undefined);
                  }}
                />
              </TableContainer>
            </CardContent>
          </Card>
        </div>
      </div>
      <DeleteConfirmationDialog
        isDeleteDialogOpen={!!itemId}
        pageType={pageType}
        handleConfirmDelete={() => {
          if (itemId) {
            handleConfirmDelete(itemId);
            setItemId(0);
          }
        }}
        handleCancelDelete={() => setItemId(0)}
      />
    </div>
  );
};

export default CurrencyAndPayment;
