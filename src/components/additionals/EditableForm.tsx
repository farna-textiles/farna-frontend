/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { useFormik } from 'formik';
import { Card, CardContent, Button, TextField } from '@mui/material';
import * as yup from 'yup';
import { FormFieldConfig } from '../../interfaces';

interface EditableFormProps {
  pageType: string;
  handleSubmit: (values: any) => void;
  fields: FormFieldConfig[];
  primaryButtonLabel: string;
  initialValues: Record<string, string>;
  validationSchema: yup.ObjectSchema<any>;
}

const EditableForm: React.FC<EditableFormProps> = ({
  pageType,
  handleSubmit,
  fields,
  primaryButtonLabel,
  initialValues,
  validationSchema,
}) => {
  const formik = useFormik({
    enableReinitialize: true,
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      handleSubmit(values);
    },
  });

  return (
    <Card>
      <CardContent>
        <h2 className="text-xl font-semibold mb-4 text-secondary">
          {pageType} List
        </h2>
        <form onSubmit={formik.handleSubmit}>
          {fields.map((field) => (
            <TextField
              key={field.id}
              label={field.label}
              variant="outlined"
              fullWidth
              name={field.id}
              value={formik.values[field.id] ?? ''}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={Boolean(formik.errors[field.id])}
              helperText={formik.errors[field.id]}
              InputLabelProps={{ shrink: true }}
              style={{ marginBottom: '10px' }}
            />
          ))}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            style={{ marginTop: '20px' }}
          >
            {primaryButtonLabel}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default EditableForm;
