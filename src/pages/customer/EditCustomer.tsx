/* eslint-disable import/no-extraneous-dependencies */
import { Box, Button, TextField, Typography, styled } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import Edit from '@mui/icons-material/Edit';
import { ChangeEvent, useMemo, useState } from 'react';
import { useParams } from 'react-router';
import {
  ActionButton,
  AdditionalColumn,
  Contact,
  Customer,
  FieldConfig,
  TableColumn,
} from '../../interfaces';
import { useCustomer, useUpdateCustomer } from '../../hooks/useCustomer';
import DataTable from '../../components/table/DataTable';
import EditModal from '../../components/Modal';

const initialContactState: Omit<Contact, 'id'> & { id?: number } = {
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
};

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

const EditCustomer = () => {
  const { id } = useParams<{ id: string }>();
  const { data: customerData } = useCustomer(
    parseInt(id as string, 10) as number
  );
  const updateCustomerMutation = useUpdateCustomer();
  const initializeEditedCustomer = (data: {
    contacts: Contact[];
    mainContact: Contact;
  }): Customer => {
    const editedContacts = data.contacts.map((contact) => {
      return {
        ...contact,
        isMainContact: contact.id === data.mainContact.id,
      };
    });

    const { mainContact, ...editedCustomerData } = data;
    editedCustomerData.contacts = editedContacts;

    return editedCustomerData as Customer;
  };

  const [editedCustomer, setEditedCustomer] = useState<Customer>(
    initializeEditedCustomer(customerData)
  );
  const [isAddingContact, setIsAddingContact] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  const handleEditClick = (contact: Contact) => {
    if (contact) {
      setSelectedContact(contact);
      setIsAddingContact(false);
      setModalOpen(true);
    }
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedContact(null);
  };

  const handleContactSave = (editedContact: Contact) => {
    if (isAddingContact) {
      setEditedCustomer((prevCustomer) => ({
        ...prevCustomer,
        contacts: [...prevCustomer.contacts, editedContact],
      }));
    } else {
      const updatedContacts = editedCustomer.contacts.map((contact) =>
        contact.id === editedContact.id ? editedContact : contact
      );
      setEditedCustomer({ ...editedCustomer, contacts: updatedContacts });
    }
    handleModalClose();
  };

  const handleAddContact = () => {
    setSelectedContact(initialContactState as Contact);
    setIsAddingContact(true);
    setModalOpen(true);
  };

  const contactFields: FieldConfig<Contact>[] = [
    { label: 'Name', name: 'name' },
    { label: 'Designation', name: 'designation' },
    { label: 'Contact#', name: 'contactNumber' },
    { label: 'Street', name: 'address.street' },
    { label: 'City', name: 'address.city' },
    { label: 'State', name: 'address.state' },
    { label: 'Country', name: 'address.country' },
    { label: 'Postal Code', name: 'address.postalCode' },
  ];

  const columns: TableColumn<Contact>[] = useMemo(
    () => [
      { field: 'name', label: 'Business' },
      { field: 'designation', label: 'Name' },
      { field: 'contactNumber', label: 'Contact #' },
      {
        field: 'address',
        label: 'Address',
        format: (address) => {
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
        onClick: (contactId: number) => {
          handleEditClick(
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            editedCustomer.contacts.find((contact) => contact.id === contactId)!
          );
        },
      },
      {
        icon: <DeleteIcon />,
        title: 'Delete',
        onClick: (contactId: number) => {
          const updatedContacts = editedCustomer.contacts.filter(
            (contact) => contact.id !== contactId
          );
          const updatedSampleObject = {
            ...editedCustomer,
            contacts: updatedContacts,
          };
          setEditedCustomer(updatedSampleObject);
        },
      },
    ],
    [editedCustomer]
  );

  const mainContactRadioColumn: AdditionalColumn<Contact> = {
    columnName: 'Main Contact',
    type: 'radio',
    valueGetter: (item) => !!item.isMainContact,
    onChange: (contactId) => {
      const updatedContacts = editedCustomer.contacts.map((contact) =>
        contact.id === contactId
          ? { ...contact, isMainContact: true }
          : { ...contact, isMainContact: false }
      );

      setEditedCustomer({ ...editedCustomer, contacts: updatedContacts });
    },
  };

  const handleBusinessNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEditedCustomer({
      ...editedCustomer,
      businessName: e.target.value,
    });
  };

  const handleSaveButtonClick = () => {
    if (id) updateCustomerMutation.mutate([+id, editedCustomer]);
  };

  return (
    <Box sx={{ m: 4 }}>
      <Typography variant="h4" component="div" gutterBottom>
        Edit Customer
      </Typography>
      <TextField
        label="Business Name"
        value={editedCustomer.businessName}
        onChange={handleBusinessNameChange}
        variant="outlined"
        size="small"
      />

      <hr className="my-12" />
      {(selectedContact || isAddingContact) && (
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
          data={editedCustomer.contacts}
          columns={columns}
          actionButtons={actionButtons}
          additionalColumn={mainContactRadioColumn}
          customButtonLabel="Add New Contact"
          onCustomButtonClick={handleAddContact}
          isLoading={updateCustomerMutation.isLoading}
        />
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
        <CustomButton
          onClick={handleSaveButtonClick}
          disabled={updateCustomerMutation.isLoading}
        >
          Save
        </CustomButton>
      </Box>
    </Box>
  );
};

export default EditCustomer;
