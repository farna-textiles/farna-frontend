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

export type ApiFunction<T> = (url: string, data: T) => Promise<any>;
