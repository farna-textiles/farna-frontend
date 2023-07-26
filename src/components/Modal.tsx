/* eslint-disable import/no-extraneous-dependencies */
import { Modal, TextField, Button, Box, Typography } from '@mui/material';
import { Formik, Form, Field, FormikTouched, FormikErrors } from 'formik';
import { EditContactModalProps } from '../interfaces';

const EditModal = <T extends Record<string, unknown>>({
  contact,
  isOpen,
  onClose,
  onSave,
  fields,
  validationSchema,
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
          Edit Contact
        </Typography>

        <Formik
          initialValues={contact}
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

                // Assert the type of the touched and errors objects
                const touchedWithShape = touched as FormikTouched<T>;
                const errorsWithShape = errors as FormikErrors<T>;

                const touch = isNestedField
                  ? touchedWithShape[parent]?.[child]
                  : touchedWithShape[fieldName];
                const error = isNestedField
                  ? errorsWithShape[parent]?.[child]
                  : errorsWithShape[fieldName];

                return (
                  <Field
                    key={field.name}
                    type={field.type === 'number' ? 'number' : 'text'}
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

export default EditModal;
