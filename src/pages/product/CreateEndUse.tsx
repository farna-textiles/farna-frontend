import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { TextField, Button, Grid } from '@mui/material';

interface CreateUserEndProps {
  trigger: (name: string, description?: string) => void;
}

const CreateUserEnd: React.FC<CreateUserEndProps> = ({ trigger }) => {
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
      <Form>
        <h1 className="font-semibold text-2xl pb-4">Create End Use</h1>
        <Grid container spacing={2}>
          <div className="flex flex-col flex-1 py-4 pl-4 space-y-4">
            <div>
              <Field
                as={TextField}
                id="name"
                name="name"
                fullWidth
                label="Name *"
                variant="outlined"
              />
              <ErrorMessage
                name="name"
                component="div"
                style={{ color: 'red', fontSize: '12px' }}
              />
            </div>

            <div>
              <Field
                as={TextField}
                id="description"
                name="description"
                fullWidth
                label="Description"
                variant="outlined"
              />
              <ErrorMessage
                name="description"
                component="div"
                style={{ color: 'red', fontSize: '12px' }}
              />
            </div>
          </div>
        </Grid>
        <Grid item xs={12} style={{ textAlign: 'right' }}>
          <Button
            variant="outlined"
            type="reset"
            style={{ marginRight: '10px' }}
          >
            Reset
          </Button>
          <Button type="submit" variant="contained" color="primary">
            Create
          </Button>
        </Grid>
      </Form>
    </Formik>
  );
};

export default CreateUserEnd;
