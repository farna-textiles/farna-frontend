import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { TextField, Button, Grid, styled } from '@mui/material';
import { Loader } from '@mantine/core';

interface CreateUserEndProps {
  trigger: (name: string, description?: string) => void;
  closeModel: () => void;
  isLoading: boolean;
}

// const CustomButton = styled(Button)(({ theme, disabled }) => ({
//   position: 'relative',
//   textDecoration: 'none',
//   color: theme.palette.primary.main,
//   padding: theme.spacing(1),
//   border: `1px solid ${theme.palette.primary.main}`,
//   borderRadius: theme.shape.borderRadius,
//   '&:hover': {
//     backgroundColor: theme.palette.primary.main,
//     color: theme.palette.common.white,
//   },
//   ...(disabled && {
//     backgroundColor: theme.palette.grey[300],
//     color: theme.palette.text.primary,
//     pointerEvents: 'none',
//     '&:hover': {
//       backgroundColor: theme.palette.grey[300],
//       borderColor: theme.palette.grey[300],
//       color: theme.palette.text.primary,
//     },
//   }),
//   ...(disabled && {
//     pointerEvents: 'none',
//     '&::after': {
//       content: '""',
//       position: 'absolute',
//       top: 0,
//       left: 0,
//       width: '100%',
//       height: '100%',
//       background: 'rgba(255, 255, 255, 0.7)',
//       display: 'flex',
//       justifyContent: 'center',
//       alignItems: 'center',
//       borderRadius: theme.shape.borderRadius,
//     },
//   }),
// }));

const CreateUserEnd: React.FC<CreateUserEndProps> = ({
  trigger,
  isLoading,
  closeModel,
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
            onClick={closeModel}
            style={{ marginRight: '10px' }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
            variant="outlined"
            style={{ marginRight: '10px' }}
          >
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader color="white" />
              </div>
            )}
            Create
          </Button>
        </Grid>
      </Form>
    </Formik>
  );
};

export default CreateUserEnd;
