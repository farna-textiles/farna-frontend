import { Box, Button, TextField, Typography, styled } from '@mui/material';
import { ChangeEvent, useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import Edit from '@mui/icons-material/Edit';
import {
  ActionButton,
  AdditionalColumn,
  Address,
  Contact,
  Customer,
  FieldConfig,
  TableColumn,
} from '../../interfaces';
import DataTable from '../../components/table/DataTable';
import EditModal from '../../components/Modal';
import { useCreateCustomer } from '../../hooks/useCustomer';

const CustomButton = styled(Button)(({ theme, disabled }) => ({
  textDecoration: 'none',
  color: theme.palette.primary.main,
  padding: theme.spacing(1),
  border: `1px solid ${theme.palette.primary.main}`,
  borderRadius: theme.shape.borderRadius,
  '&:hover': {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
  },
  ...(disabled && {
    backgroundColor: theme.palette.grey[300],
    color: theme.palette.text.primary,
    pointerEvents: 'none',
    '&:hover': {
      backgroundColor: theme.palette.grey[300],
      borderColor: theme.palette.grey[300],
      color: theme.palette.text.primary,
    },
  }),
}));

const CreateCustomer = () => {
  const [newCustomer, setNewCustomer] = useState<Omit<Customer, 'id'>>({
    businessName: '',
    contacts: [],
  });
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [selectedContactIndex, setSelectedContactIndex] = useState<
    number | null
  >(null);
  const craeteCustomerMutation = useCreateCustomer();

  const navigate = useNavigate();

  const mainContactRadioColumn: AdditionalColumn<Contact> = useMemo(
    () => ({
      columnName: 'Main Contact',
      type: 'radio',
      valueGetter: (item) => !!item.isMainContact,
      onChange: (contactIndex) => {
        const updatedContacts = newCustomer.contacts.map((contact, index) =>
          index === contactIndex
            ? { ...contact, isMainContact: true }
            : { ...contact, isMainContact: false }
        );

        setNewCustomer({ ...newCustomer, contacts: updatedContacts });
      },
    }),
    [newCustomer]
  );

  const initialContactState: Omit<Contact, 'id'> & { id?: number } = useMemo(
    () => ({
      name: '',
      designation: '',
      contactNumber: '',
      address: {
        street: '',
        city: '',
        state: '',
        country: '',
        postalCode: '',
      },
    }),
    []
  );

  const contactFields: FieldConfig<Contact>[] = useMemo(
    () => [
      { label: 'Name', name: 'name' },
      { label: 'Designation', name: 'designation' },
      { label: 'Contact#', name: 'contactNumber' },
      { label: 'Street', name: 'address.street' },
      { label: 'City', name: 'address.city' },
      { label: 'State', name: 'address.state' },
      { label: 'Country', name: 'address.country' },
      { label: 'Postal Code', name: 'address.postalCode' },
    ],
    []
  );

  const columns: TableColumn<Contact>[] = useMemo(
    () => [
      { field: 'name', label: 'Name' },
      { field: 'designation', label: 'Designation' },
      { field: 'contactNumber', label: 'Contact #' },
      {
        field: 'address',
        label: 'Address',
        format: (address: Address) => {
          const { street, city, postalCode } = address;
          return `${street}, ${city} - ${postalCode}`;
        },
      },
    ],
    []
  );

  const actionButtons: ActionButton[] = useMemo(
    () => [
      {
        icon: <Edit />,
        title: 'Edit',
        onClick: (contactIndex: number) => {
          const contact = newCustomer.contacts[contactIndex];
          if (contact) {
            setSelectedContactIndex(contactIndex);
            setSelectedContact(contact);
            setModalOpen(true);
          }
        },
      },
    ],
    [newCustomer.contacts]
  );

  const handleBusinessNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewCustomer({
      ...newCustomer,
      businessName: e.target.value,
    });
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedContact(null);
  };

  const handleContactSave = (newContact: Contact) => {
    if (selectedContactIndex !== null) {
      const updatedContacts = newCustomer.contacts.map((contact, index) =>
        index === selectedContactIndex ? newContact : contact
      );
      setNewCustomer({ ...newCustomer, contacts: updatedContacts });
    } else {
      setNewCustomer((prevCustomer) => ({
        ...prevCustomer,
        contacts: [...prevCustomer.contacts, newContact],
      }));
    }

    setSelectedContact(initialContactState as Contact);
    setSelectedContactIndex(null);
    handleModalClose();
  };

  const handleAddContact = () => {
    setSelectedContact(initialContactState as Contact);
    setSelectedContactIndex(null);
    setModalOpen(true);
  };

  const handleSaveButtonClick = async () => {
    await craeteCustomerMutation.mutateAsync(newCustomer);
  };

  return (
    <Box sx={{ m: 4 }}>
      <Typography variant="h4" component="div" gutterBottom>
        Create Customer
      </Typography>
      <TextField
        label="Business Name"
        value={newCustomer.businessName}
        onChange={handleBusinessNameChange}
        variant="outlined"
        size="small"
      />

      <hr className="my-12" />
      {(selectedContact || selectedContactIndex) && (
        <EditModal<Contact & Record<string, any>>
          contact={selectedContact as Contact}
          isOpen={isModalOpen}
          onClose={handleModalClose}
          onSave={handleContactSave}
          fields={contactFields}
        />
      )}
      <Box sx={{ my: 2 }}>
        <DataTable<Contact>
          data={newCustomer.contacts}
          columns={columns}
          customButtonLabel="Add New Contact"
          actionButtons={actionButtons}
          additionalColumn={mainContactRadioColumn}
          onCustomButtonClick={handleAddContact}
        />
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
        <CustomButton onClick={handleSaveButtonClick}>Save</CustomButton>
      </Box>
    </Box>
  );
};

export default CreateCustomer;
