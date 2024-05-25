import { Box, Grid, TextField } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import Edit from '@mui/icons-material/Edit';
import { ChangeEvent, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import * as Yup from 'yup';

import {
  ActionButton,
  AdditionalColumn,
  Address,
  Contact,
  Customer,
  FieldConfig,
  TableColumn,
} from '../../interfaces';
import { useCustomer, useUpdateCustomer } from '../../hooks/useCustomer';
import DataTable from '../../components/table/DataTable';
import CustomModal from '../../components/Modal';
import Heading from '../../components/elements/Heading';
import ButtonLoader from '../../components/elements/buttons/ButtonLoader';

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

const EditCustomer = () => {
  const { id } = useParams<{ id: string }>();
  const { data: customerData } = useCustomer(
    parseInt(id as string, 10) as number
  );
  const updateCustomerMutation = useUpdateCustomer();
  const navigate = useNavigate();

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
      { field: 'name', label: 'Name' },
      { field: 'designation', label: 'Designation' },
      { field: 'contactNumber', label: 'Contact #' },
      {
        field: 'address',
        label: 'Address',
        format: (address) => {
          const { street, city, postalCode } = address as Address;
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
            editedCustomer.contacts.find((contact, index) =>
              contact.id ? contact.id !== contactId : index !== contactId
            )!
          );
        },
      },
      {
        icon: <DeleteIcon />,
        title: 'Delete',
        onClick: (contactId: number) => {
          const updatedContacts = editedCustomer.contacts.filter(
            (contact) => contact.id !== contactId || contact.id !== undefined
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
    onChange: (contactId, checked) => {
      const updatedContacts = editedCustomer.contacts.map((contact) =>
        contact.id === contactId || (contactId === undefined && !checked)
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

  const handleSaveButtonClick = async () => {
    if (id) {
      await updateCustomerMutation.mutateAsync([+id, editedCustomer]);
      navigate(`/customers/${id}`);
    }
  };

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

  return (
    <Box sx={{ mx: 4 }}>
      <Heading
        title="Customer and Contacts Update"
        description="Update the information for a customer and their contacts"
      />
      <hr className="my-6" />
      <Box marginBottom={4}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={!editedCustomer.contacts.length ? 8 : 12}>
            <TextField
              label="Business Name"
              value={editedCustomer.businessName}
              onChange={handleBusinessNameChange}
              variant="outlined"
              size="small"
              fullWidth
              placeholder="Enter the business name"
            />
          </Grid>
          {!editedCustomer?.contacts?.length && (
            <Grid item xs={4}>
              <ButtonLoader
                isLoading={updateCustomerMutation.isLoading}
                disabled={updateCustomerMutation.isLoading}
                onClick={handleAddContact}
                className="w-full"
              >
                ADD CONTACT
              </ButtonLoader>
            </Grid>
          )}
        </Grid>
      </Box>
      {(selectedContact || isAddingContact) && (
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        <CustomModal<Contact & Record<string, any>>
          data={selectedContact as Contact}
          isOpen={isModalOpen}
          onClose={handleModalClose}
          onSave={handleContactSave}
          fields={contactFields}
          validationSchema={contactValidationSchema}
          title="Add Contact"
          submitButton="Submit"
        />
      )}
      {!!editedCustomer.contacts.length && (
        <DataTable<Contact>
          data={editedCustomer.contacts}
          columns={columns}
          actionButtons={actionButtons}
          additionalColumn={mainContactRadioColumn}
          customButtonLabel="Add New Contact"
          onCustomButtonClick={handleAddContact}
          isLoading={updateCustomerMutation.isLoading}
        />
      )}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
        <ButtonLoader
          isLoading={updateCustomerMutation.isLoading}
          onClick={handleSaveButtonClick}
          disabled={updateCustomerMutation.isLoading}
          className="w-full"
        >
          Save and Exit
        </ButtonLoader>
      </Box>
    </Box>
  );
};

export default EditCustomer;
