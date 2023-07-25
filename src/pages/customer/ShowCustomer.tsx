import {
  Box,
  Button,
  Typography,
  styled,
  Card,
  CardContent,
  Avatar,
  Divider,
} from '@mui/material';
import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Address, Contact, TableColumn } from '../../interfaces';
import { useCustomer } from '../../hooks/useCustomer';
import DataTable from '../../components/table/DataTable';

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

const MainContactCard = ({ mainContact }: { mainContact: Contact }) => {
  return (
    <Card elevation={3}>
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
  const navigate = useNavigate();
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

  return (
    <Box sx={{ m: 4 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant="h4" component="div" gutterBottom>
          {customerData.businessName}
        </Typography>
        <CustomButton
          onClick={() => navigate(`/customers/${id}/edit`)}
          disabled={isLoading}
        >
          Edit
        </CustomButton>
      </Box>

      {customerData.mainContact && (
        <Box sx={{ mt: 2 }}>
          <MainContactCard mainContact={customerData.mainContact} />
        </Box>
      )}

      <Box sx={{ my: 2 }}>
        <Typography variant="h5" component="div" gutterBottom>
          Other Contacts
        </Typography>
        <hr className="mb-12" />

        <DataTable<Contact>
          data={customerData.contacts.filter(
            (contact: Contact) => contact.id !== customerData.mainContact.id
          )}
          columns={columns}
          isLoading={isLoading}
        />
      </Box>
    </Box>
  );
};

export default ShowCustomer;
