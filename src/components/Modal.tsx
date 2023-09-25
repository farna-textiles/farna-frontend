/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/no-extraneous-dependencies */
import { Modal, TextField, Button, Box, Typography } from '@mui/material';
import { Formik, Form, Field } from 'formik';
import { EditContactModalProps } from '../interfaces';

const CustomModal = <T extends Record<string, unknown>>({
  data,
  isOpen,
  onClose,
  onSave,
  fields,
  validationSchema,
  title,
}: EditContactModalProps<T>) => {
  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: 'white',
          boxShadow: 24,
          p: 4,
          minWidth: 400,
          maxWidth: 600,
          borderRadius: 8,
        }}
      >
        <Typography variant="h5" align="center" gutterBottom>
          {title}
        </Typography>

        <Formik
          initialValues={data}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            onSave(values);
            onClose();
          }}
        >
          {({ errors, touched }) => (
            <Form>
              {fields.map((field) => {
                const isNestedField: boolean = (field.name as string).includes(
                  '.'
                );
                const [parent, child] = (field.name as string).split('.');
                const fieldName = isNestedField ? child : field.name;

                // Use type assertion to assert that touchedWithShape and errorsWithShape
                // are objects of type 'any' temporarily
                const touchedWithShape = touched as any;
                const errorsWithShape = errors as any;

                const touch = isNestedField
                  ? touchedWithShape[parent]?.[child]
                  : touchedWithShape[fieldName];
                const error = isNestedField
                  ? errorsWithShape[parent]?.[child]
                  : errorsWithShape[fieldName];
                return (
                  <Field
                    key={field.name}
                    type={field.type ?? 'text'}
                    name={field.name}
                    as={TextField}
                    label={field.label}
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    error={touch && !!error}
                    helperText={touch && error}
                  />
                );
              })}

              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={onClose}
                  sx={{ marginRight: 2 }}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="contained" color="primary">
                  Save
                </Button>
              </Box>
            </Form>
          )}
        </Formik>
      </Box>
    </Modal>
  );
};

export default CustomModal;
