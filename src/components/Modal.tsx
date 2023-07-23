/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-props-no-spreading */
import { Modal, TextField, Button, Box, Typography } from '@mui/material';
import { ChangeEvent, useState } from 'react';
import { EditContactModalProps } from '../interfaces';

const EditModal = <T extends Record<string, unknown>>({
  contact,
  isOpen,
  onClose,
  onSave,
  fields,
}: EditContactModalProps<T>) => {
  const [editedContact, setEditedContact] = useState<T>(contact);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      // Handle nested property updates
      const [fieldName, nestedFieldName] = name.split('.');
      setEditedContact((prevContact) => ({
        ...prevContact,
        [fieldName]: {
          ...(prevContact[fieldName] as T),
          [nestedFieldName]: value,
        },
      }));
    } else {
      setEditedContact((prevContact) => ({
        ...prevContact,
        [name]: value,
      }));
    }
  };

  const handleSaveClick = () => {
    onSave(editedContact);
    onClose();
  };

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
        {fields.map((field) => {
          const nestedValue =
            (field.name as string).indexOf('.') !== -1
              ? (field.name as string)
                  .split('.')
                  .reduce((obj, key) => (obj as any)?.[key], editedContact)
              : editedContact[field.name as keyof typeof editedContact];

          return (
            <TextField
              key={field.name.toString()}
              label={field.label}
              name={field.name.toString()}
              value={nestedValue}
              onChange={handleInputChange}
              variant="outlined"
              fullWidth
              margin="normal"
              {...(field.type === 'number' && { type: 'number' })}
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
          <Button variant="contained" color="primary" onClick={handleSaveClick}>
            Save
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default EditModal;
