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
    <Modal open={isOpen} onClose={onClose} >
      <Box
      
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white shadow-md p-4  md:p-8 min-w-[300px] md:min-w-[400px] max-w-[80%] md:max-w-[600px] rounded-lg"
      >
        <Typography variant="h5" align="center" gutterBottom className="text-2xl font-bold">
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
            <Form className="space-y-4">
              {fields.map((field) => {
                const isNestedField: boolean = (field.name as string).includes('.');
                const [parent, child] = (field.name as string).split('.');
                const fieldName = isNestedField ? child : field.name;

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

              <Box className="flex justify-end mt-3 md:mt-6">
                <Button
                sx={{ mr: 1 }}
                  variant="outlined"
                  color="primary"
                  onClick={onClose}
                  className="mr-2"
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
