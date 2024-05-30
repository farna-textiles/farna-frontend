import { Modal, TextField, Button, Box, Typography } from '@mui/material';
import { Formik, Form, Field } from 'formik';
import { EditContactModalProps } from '../interfaces';

const CustomeModal = <T extends Record<string, unknown>>({
  data,
  isOpen,
  onClose,
  title,
  onSave,
  fields,
  validationSchema,
  submitButton,
}: EditContactModalProps<T>) => {
  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white shadow-md p-4 h-full max-h-[620px]  md:p-8 min-w-[300px] md:min-w-[400px] max-w-[80%] md:max-w-[600px] rounded-lg">
        <Typography
          variant="h5"
          align="center"
          gutterBottom
          className="text-2xl font-bold"
        >
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
            <Form className="space-y-4">
              <div className='h-[350px] xl:h-[450px] overflow-y-scroll'>
                {fields.map((field) => {
                  const isNestedField: boolean = (field.name as string).includes(
                    '.'
                  );
                  const [parent, child] = (field.name as string).split('.');
                  const fieldName = isNestedField ? child : field.name;

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
              </div>
              <Box className="flex justify-end mt-3 md:mt-6">
                <Button
                  sx={{ marginRight: 2 }}
                  variant="outlined"
                  color="primary"
                  onClick={onClose}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="contained" color="primary">
                  {submitButton}
                </Button>
              </Box>
            </Form>
          )}
        </Formik>
      </Box>
    </Modal>
  );
};

export default CustomeModal;
