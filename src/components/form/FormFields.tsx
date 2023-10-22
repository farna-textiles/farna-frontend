import React from 'react';
import { Field, ErrorMessage } from 'formik';
import { TextField } from '@mui/material';

interface FormFieldProps {
  name: string;
  label: string;
  type: string;
}

const FormFields: React.FC<FormFieldProps> = ({ name, label, type }) => (
  <>
    <Field
      as={TextField}
      id={name}
      name={name}
      fullWidth
      type={type}
      label={label}
      variant="outlined"
      helperText={`Please enter ${label.toLowerCase()}`}
    />
    <ErrorMessage name={name}>
      {(errorMessage: string) => (
        <div className="text-red-500 text-sm mt-1">{errorMessage}</div>
      )}
    </ErrorMessage>
  </>
);

export default FormFields;
