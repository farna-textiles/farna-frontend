/* eslint-disable prettier/prettier */
/* eslint-disable import/no-extraneous-dependencies */
import { Box, Button, TextField, Typography, styled } from '@mui/material';
import { ChangeEvent, useMemo, useState } from 'react';
import * as Yup from 'yup';
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
  position: 'relative',
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
  ...(disabled && {
    pointerEvents: 'none',
    '&::after': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'rgba(255, 255, 255, 0.7)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: theme.shape.borderRadius,
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

  const contactValidationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required.'),
    designation: Yup.string().required('Designation is required.'),
    contactNumber: Yup.string()
      .required('Contact number is required.')
      .matches(/^(0\d{6,7}|0\d{10})$/, 'Contact number is not valid'),
    address: Yup.object().shape({
      street: Yup.string().required('Street is required.'),
      city: Yup.string().required('City is required.'),
      state: Yup.string().required('State is required.'),
      country: Yup.string().required('Country is required.'),
      postalCode: Yup.string()
        .required('Postal code is required.')
        .matches(/^\d{5}$/, 'Invalid postal code. Must be 5 digits.'),
    }),
  });

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
    <Box sx={{ m: 0, p: 2 }}>
      <Typography variant="h4" component="div" gutterBottom>
        Create Customer
      </Typography>
      <TextField
        label="Business Name"
        value={newCustomer.businessName}
        onChange={handleBusinessNameChange}
        variant="outlined"
        size="small"
        sx={{ width: '100%', marginBottom: 2 }}
      />

      <hr className="my-12" />


      <Box sx={{ overflowX: 'auto' }}>
        {(selectedContact || selectedContactIndex) && (
          <EditModal<Contact & Record<string, any>>
            contact={selectedContact as Contact}
            isOpen={isModalOpen}
            onClose={handleModalClose}
            onSave={handleContactSave}
            fields={contactFields}
            validationSchema={contactValidationSchema}
          />
        )}
        <DataTable<Contact>
          data={newCustomer.contacts}
          columns={columns}
          customButtonLabel="Add New Contact"
          actionButtons={actionButtons}
          additionalColumn={mainContactRadioColumn}
          onCustomButtonClick={handleAddContact}
          isLoading={craeteCustomerMutation.isLoading}
        />
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
        <CustomButton
          onClick={handleSaveButtonClick}
          disabled={craeteCustomerMutation.isLoading}
        >
          Save and Exit
        </CustomButton>
      </Box>
    </Box>
  );
};
export default CreateCustomer;
