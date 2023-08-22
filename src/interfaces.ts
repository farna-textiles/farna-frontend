/* eslint-disable import/no-extraneous-dependencies */
import { InputHTMLAttributes, ReactNode } from 'react';
import { Schema } from 'yup';

export interface FormInputProps {
  id: string;
  label: string;
  type: string;
}
export interface FormButtonProps {
  text: string;
}

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  type: string;
  name: string;
}

export type UserFormInput = {
  label: string;
  type: string;
  name: string;
  placeholder: string;
  value: string;
};

export type FormProps = {
  inputList: UserFormInput[];
  handleFormSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onChangeHandler: (event: React.ChangeEvent<HTMLInputElement>) => void;
  buttonLabel: string;
  isLoading: boolean;
};

export type AuthBannerProp = {
  animate: boolean;
};

export interface ChangeEvent {
  target: {
    name: string;
    value: any;
  };
}

export interface AuthRouteProps {
  path: string;
  children: ReactNode;
  redirect?: boolean;
}

export interface ErrorBoundaryRouteProps {
  component: React.ReactNode;
  redirect?: boolean;
}

export interface ErrorResponse {
  statusCode: number;
  message: string;
  error: string | string[];
}

export type ApiFunction<T> = (url: string, config?: any) => Promise<any>;

export interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  isActive: boolean;
  confirmedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id?: string;
  lotNo: string;
  denier: string;
  type: string;
  noOfFilaments: string;
  luster: string;
  userId: string;
}

export type ProductOrderType = Omit<Product, 'id'> & {
  id: number;
  quantity: number;
  rate: number;
  endUses: EndUse[];
  [key: string]: any;
};

export interface ProductData extends Product {
  endUses: EndUse[];
}

export interface ProductUpdateData extends Product {
  endUses: number[];
}
export interface Address {
  id?: number;
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}

export interface EndUse {
  id?: number;
  name: string;
  description?: string;
}

export interface EndUsesListProps {
  endUses: EndUse[];
}

export interface Contact {
  id: number;
  name: string;
  designation: string;
  contactNumber: string;
  address?: Address;
  isMainContact?: boolean;
}

export interface Customer {
  id: number;
  businessName: string;
  contacts: Contact[];
  mainContact?: Contact;
}

export type UserObject = User & Record<string, any>;
export type CustomerObject = Customer & Record<string, any>;
export type ProductObject = Product & Record<string, any>;

export interface RowData {
  [key: string]: string;
}

export interface Customerdata {
  name: string;
  contact: string;
  designation: string;
  house: string;
  city: string;
  country: string;
}
export type RowObject = RowData & Record<string, any>;

export interface TableSortProps<T extends RowData> {
  data: T[];
}

export interface ThProps<T extends RowData> {
  children: React.ReactNode;
  field: keyof T;
  reversed: boolean;
  sorted: boolean;
  onSort(field: keyof T): void;
}

export interface TableColumn<T> {
  field: keyof T;
  label: string;
  format?:
    | ((item: T[keyof T][keyof T[keyof T]]) => React.ReactNode)
    | ((item: T[keyof T]) => React.ReactNode);
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface GenericTableProps<T> {
  tableName: string;
  columns: TableColumn<T>[];
  fetchData: (
    page: number,
    pageSize: number,
    searchQuery: string
  ) => Promise<PaginatedResponse<T>>;
}

export interface ActionButton {
  icon: React.ReactNode;
  onClick: (id: number) => void;
  title?: string;
  disabled?: boolean;
}

export interface SearchBarProps {
  onSearch: (value: string) => void;
}

export interface AdditionalColumn<T> {
  type: 'radio' | 'checkbox';
  onChange: (itemId: number, checked: boolean) => void;
  valueGetter: (item: T) => boolean;
  columnName: string;
}

export interface ModalFormProps {
  labels: string[];
  buttonText: string;
  onConfirmClick: () => void;
  onCancelClick: () => void;
  onModalDataSubmit: (data: string[]) => void;
}

export interface FieldConfig<T> {
  label: string;
  name: keyof T | string;
  type?: string;
}

export interface EditContactModalProps<T> {
  contact: T;
  isOpen: boolean;
  onClose: () => void;
  onSave: (editedContact: T) => void;
  fields: FieldConfig<T>[];
  validationSchema: Schema<Omit<T, 'id'>>;
}

export interface Option<T = string> {
  value: T;
  label: string;
}

export interface EndUseOption {
  name: string;
  value: number;
}

export interface MultiSelectProps<T = string> {
  options: Option<T>[];
  title: string;
  newOptions?: Option<T>[];
  trigger: (event: T[]) => void;
}

export interface InfiniteSearchDropdownProps<T> {
  items: T[];
  hasNextPage: boolean;
  fetchNextPage: () => void;
  onSelect: (item: T) => void;
  itemToString: (item: T) => string;
  selectedItem?: T;
  height?: number;
  width?: string | number;
  itemSize?: number;
}

export type CurrencyUnit = {
  id: number;
  name: string;
  code: string;
  symbol: string;
};

export type PaymentMethod = {
  id: number;
  name: string;
};
