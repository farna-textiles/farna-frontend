import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { TextField, Grid } from '@mui/material';
import ButtonLoader from '../../components/elements/buttons/ButtonLoader';

interface CreateUserEndProps {
  trigger: (name: string, description?: string) => void;
  isLoading: boolean;
}

const CreateUserEnd: React.FC<CreateUserEndProps> = ({
  trigger,
  isLoading,
}) => {
  return (
    <Formik
      initialValues={{ name: '', description: '' }}
      validate={(values) => {
        const errors: Record<string, string> = {};
        if (!values.name.trim()) {
          errors.name = 'Name is required';
        }
        return errors;
      }}
      onSubmit={(values) => {
        trigger(values.name, values.description);
      }}
    >
      {({ errors }) => (
        <Form>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Field
                as={TextField}
                id="name"
                name="name"
                fullWidth
                label="Name *"
                variant="outlined"
                helperText={<ErrorMessage name="name" />}
                error={Boolean(errors.name)}
              />
            </Grid>

            <Grid item xs={12}>
              <Field
                as={TextField}
                id="description"
                name="description"
                fullWidth
                label="Description"
                variant="outlined"
              />
            </Grid>

            <Grid item xs={12} container justifyContent="space-between">
              <Grid item>
                <ButtonLoader type="reset" disabled={isLoading}>
                  Reset
                </ButtonLoader>
              </Grid>
              <Grid item>
                <ButtonLoader type="submit" disabled={isLoading}>
                  Create
                </ButtonLoader>
              </Grid>
            </Grid>
          </Grid>
        </Form>
      )}
    </Formik>
  );
};

export default CreateUserEnd;
