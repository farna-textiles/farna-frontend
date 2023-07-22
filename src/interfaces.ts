import { InputHTMLAttributes, ReactNode } from 'react';

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
  error: string;
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

export interface Customer {
  id: number;
  name: string;
  contact: string;
}
export type UserObject = User & Record<string, any>;
export type CustomerObject = Customer & Record<string, any>;

export interface RowData {
  [key: string]: string;
}

export interface Customerdata {
  name: string;
  contact: string;
  designation: string;
  house: string;
  city: string;
  country: string
}
export type RowObject = Customerdata & Record<string, any>;

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
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface GenericTableProps<T> {
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
}

export interface SearchBarProps {
  onSearch: (value: string) => void;
}

export interface AdditionalColumn<T> {
  type: 'radio' | 'checkbox';
  onChange: (itemId: number, checked: boolean) => void;
  valueGetter: (item: T) => boolean;
}
