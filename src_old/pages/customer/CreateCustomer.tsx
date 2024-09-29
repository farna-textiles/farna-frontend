import { Box, Grid, TextField, Typography } from '@mui/material';
import { ChangeEvent, useMemo, useState } from 'react';
import * as Yup from 'yup';
import Edit from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

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
import CustomModal from '../../components/Modal';
import { useCreateCustomer } from '../../hooks/useCustomer';
import Heading from '../../components/elements/Heading';
import ButtonLoader from '../../components/elements/buttons/ButtonLoader';
import React from 'react';

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
  const createCustomerMutation = useCreateCustomer();

  const mainContactRadioColumn: AdditionalColumn<Contact> = useMemo(
    () => ({
      columnName: 'Main Contact',
      type: 'radio',
      valueGetter: (item) => !!item.isMainContact,
      onChange: (contactIndex) => {
        const updatedContacts = newCustomer.contacts.map(
          (contact: Contact, index: number) =>
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
      billingAddress: ''
    }),
    []
  );

  // const contactValidationSchema = Yup.object().shape({
  //   name: Yup.string().required('Name is required.'),
  //   designation: Yup.string().required('Designation is required.'),
  //   contactNumber: Yup.string()
  //     .required('Contact number is required.')
  //     .matches(/^(\+\d{1,3}[-\s]?)?\d{6,14}$/, 'Contact number is not valid'),
  //   address: Yup.object().shape({
  //     street: Yup.string().required('Street is required.'),
  //     city: Yup.string().required('City is required.'),
  //     state: Yup.string().required('State is required.'),
  //     country: Yup.string().required('Country is required.'),
  //     postalCode: Yup.string()
  //       .required('Postal code is required.')
  //       .matches(/^\d{5}$/, 'Invalid postal code. Must be 5 digits.'),
  //   }),
  // });

  const contactValidationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required.'),

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
      { label: 'Full Billing Address', name: 'billingAddress' },
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
        format: (address) => {
          const { street, city, postalCode } = address as Address;
          return `${street}, ${city} - ${postalCode}`;
        },
      },
      {
        field: 'billingAddress', label: 'Billing Address'
      }
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
      {
        icon: <DeleteIcon />,
        title: 'Delete',
        onClick: (contactIndex: number) => {
          const updatedContacts = newCustomer.contacts.filter(
            (_contact: Contact, index: number) => index !== contactIndex
          );
          const updatedSampleObject = {
            ...newCustomer,
            contacts: updatedContacts,
          };
          setNewCustomer(updatedSampleObject);
        },
      },
    ],
    [newCustomer]
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
      const updatedContacts = newCustomer.contacts.map(
        (contact: Contact, index: number) =>
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
    await createCustomerMutation.mutateAsync(newCustomer);
  };

  return (
    <Box sx={{ mx: 4 }}>
      <Heading
        title="New Customer with Contacts"
        description="Begin the process of adding a customer and their contact information."
      />
      <hr className="my-6" />
      <Box marginBottom={4}>
        <Typography variant="h6" gutterBottom>
          Business Information
        </Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={!newCustomer.contacts.length ? 8 : 12}>
            <TextField
              label="Business Name"
              value={newCustomer.businessName}
              onChange={handleBusinessNameChange}
              variant="outlined"
              size="small"
              fullWidth
              placeholder="Enter the business name"
            />
          </Grid>
          {!newCustomer?.contacts?.length && (
            <Grid item xs={4}>
              <ButtonLoader
                isLoading={createCustomerMutation.isLoading}
                disabled={createCustomerMutation.isLoading}
                onClick={handleAddContact}
                className="w-full"
              >
                ADD CONTACT
              </ButtonLoader>
            </Grid>
          )}
        </Grid>
      </Box>

      {(selectedContact || selectedContactIndex) && (
        <CustomModal<Contact & Record<string, any>>
          data={selectedContact as Contact}
          isOpen={isModalOpen}
          onClose={handleModalClose}
          submitButton="Save"
          onSave={handleContactSave}
          fields={contactFields}
          validationSchema={contactValidationSchema}
          title="Manage Contact"
        />
      )}
      {!!newCustomer.contacts.length && (
        <Box marginBottom={4}>
          <Typography variant="h6" gutterBottom>
            Contacts
          </Typography>
          <DataTable<Contact>
            data={newCustomer.contacts}
            columns={columns}
            customButtonLabel="Add New Contact"
            actionButtons={actionButtons}
            additionalColumn={mainContactRadioColumn}
            onCustomButtonClick={handleAddContact}
            isLoading={createCustomerMutation.isLoading}
          />
        </Box>
      )}
      <Box className="flex justify-end mt-4">
        <ButtonLoader
          isLoading={createCustomerMutation.isLoading}
          onClick={handleSaveButtonClick}
          disabled={createCustomerMutation.isLoading}
          className="w-full"
        >
          Save and Exit
        </ButtonLoader>
      </Box>
    </Box>
  );
};

export default CreateCustomer;
