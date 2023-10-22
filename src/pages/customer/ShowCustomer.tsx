import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  Divider,
  CircularProgress,
} from '@mui/material';
import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Address, Contact, TableColumn } from '../../interfaces';
import { useCustomer } from '../../hooks/useCustomer';
import DataTable from '../../components/table/DataTable';
import ButtonLoader from '../../components/elements/buttons/ButtonLoader';

const MainContactCard = ({ mainContact }: { mainContact: Contact }) => {
  return (
    <Card elevation={3} sx={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}>
      <CardContent>
        <Box display="flex" alignItems="center" mb={2}>
          <Avatar sx={{ width: 60, height: 60, fontSize: 28, marginRight: 2 }}>
            {mainContact.name[0].toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="h5" gutterBottom>
              {mainContact.name}
            </Typography>
            <Typography variant="body1" gutterBottom>
              {mainContact.designation}
            </Typography>
          </Box>
        </Box>
        <Divider sx={{ my: 2 }} />
        {mainContact.contactNumber && (
          <Typography variant="body2" gutterBottom>
            Contact #: {mainContact.contactNumber}
          </Typography>
        )}
        {mainContact.address && (
          <Typography variant="body2" sx={{ display: 'block' }}>
            Address:{' '}
            {`${mainContact.address.street}, ${mainContact.address.city} - ${mainContact.address.postalCode}`}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

const ShowCustomer = () => {
  const { id } = useParams<{ id: string }>();
  const { data: customerData, isLoading } = useCustomer(
    parseInt(id as string, 10) as number
  );
  const otherContacts = useMemo(
    () =>
      customerData.contacts.filter(
        (contact: Contact) => contact.id !== customerData.mainContact.id
      ),
    [customerData]
  );
  const navigate = useNavigate();
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

  return (
    <Box sx={{ mx: 4 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Typography
          variant="h3"
          component="div"
          gutterBottom
          sx={{ color: 'primary.main' }}
        >
          {isLoading ? (
            <CircularProgress size={24} />
          ) : (
            customerData.businessName
          )}
        </Typography>
        <ButtonLoader
          onClick={() => navigate(`/customers/${id}/edit`)}
          disabled={isLoading}
          isLoading={isLoading}
        >
          Edit
        </ButtonLoader>
      </Box>
      {customerData.mainContact && (
        <Box sx={{ mt: 2 }}>
          <MainContactCard mainContact={customerData.mainContact} />
        </Box>
      )}

      {!!otherContacts.length && (
        <Box sx={{ my: 2 }}>
          <Typography variant="h5" component="div" gutterBottom>
            Other Contacts
          </Typography>
          <hr className="mb-12" />

          <DataTable<Contact>
            data={otherContacts}
            columns={columns}
            isLoading={isLoading}
          />
        </Box>
      )}
    </Box>
  );
};

export default ShowCustomer;
