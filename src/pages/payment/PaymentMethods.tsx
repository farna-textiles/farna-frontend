import  { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Button,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';

import {
  getPaymentMethods,
  createPaymentMethod,
  updatePaymentMethod,
  deletePaymentMethod,
} from '../../api/paymentMethodApi';

const PaymentMethods: React.FC = () => {
  const [paymentTypes, setPaymentTypes] = useState([]);
  const [selectedPaymentType, setSelectedPaymentType] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newPaymentMethod, setNewPaymentMethod] = useState('');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingPaymentType, setDeletingPaymentType] = useState(null);

 

  const fetchPaymentMethods = () => {
    getPaymentMethods()
      .then((data) => {
        setPaymentTypes(data);
      })
      
  };
  useEffect(() => {
    fetchPaymentMethods();
     
  }, []);
  const handleEdit = (paymentType) => {
    setSelectedPaymentType(paymentType);
    setIsEditing(true);
    setNewPaymentMethod(paymentType.name);
  };

  const handleDelete = (id) => {
    setIsDeleteDialogOpen(true);
    setDeletingPaymentType(id);
  };

  const handleConfirmDelete = () => {
    deletePaymentMethod(deletingPaymentType)
      .then(() => {
        setPaymentTypes((prevPaymentTypes) =>
          prevPaymentTypes.filter((paymentType) => paymentType.id !== deletingPaymentType)
        );
        setIsDeleteDialogOpen(false);
      })
      .catch((error) => {
        setIsDeleteDialogOpen(false);
      });
  };

  const handleCancelDelete = () => {
    setIsDeleteDialogOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing && selectedPaymentType) {
      updatePaymentMethod(selectedPaymentType.id, { name: newPaymentMethod })
        .then(() => {
          setPaymentTypes((prevPaymentTypes) =>
            prevPaymentTypes.map((paymentType) =>
              paymentType.id === selectedPaymentType.id
                ? { ...paymentType, name: newPaymentMethod }
                : paymentType
            )
          );
          setSelectedPaymentType(null);
          setIsEditing(false);
          setNewPaymentMethod('');
        })
        
    } else {
      createPaymentMethod({ name: newPaymentMethod })
        .then((newPaymentType) => {
          setPaymentTypes([...paymentTypes, newPaymentType]);
          setNewPaymentMethod('');
        })
       
    }
  };

  return (
    <div className="container mx-auto mt-12 mr-2 ">
      <h1 className="text-3xl mb-5 p-2">Payment Types</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <Card>
            <CardContent>
              <h2 className="text-xl font-semibold mb-4">
                {isEditing ? 'Edit Payment Type' : 'Add Payment Type'}
              </h2>
              <form onSubmit={handleSubmit}>
                <TextField
                  label="Payment Type"
                  variant="outlined"
                  fullWidth
                  required
                  value={newPaymentMethod}
                  onChange={(e) => setNewPaymentMethod(e.target.value)}
                />
                {isEditing ? (
                  <>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      style={{ marginTop: '20px' }}
                    >
                      Update
                    </Button>
                    <Button
                      variant="contained"
                      color="secondary"
                      style={{ marginTop: '20px', marginLeft: '10px' }}
                      onClick={() => {
                        setSelectedPaymentType(null);
                        setIsEditing(false);
                        setNewPaymentMethod('');
                      }}
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    style={{ marginTop: '20px' }}
                  >
                    Create
                  </Button>
                )}
              </form>
            </CardContent>
          </Card>
        </div>
        <div className="md:col-span-1">
          <Card>
            <CardContent>
              <h2 className="text-xl font-semibold mb-4 ">Payment Type List</h2>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Payment Type Name</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paymentTypes.map((paymentType) => (
                      <TableRow key={paymentType.id}>
                        <TableCell>{paymentType.name}</TableCell>
                        <TableCell>
                        <div className="flex">
                          <Button
                            variant="outlined"
                            sx={{ margin: '7px' }}
                            color="primary"
                            onClick={() => handleEdit(paymentType)}
                          >
                            Edit
                          </Button>

                          <Button
                            variant="outlined"
                            color="secondary"
                            sx={{ margin: '7px' }}
                            onClick={() => handleDelete(paymentType.id)}
                          >
                            Delete
                          </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </div>
      </div>
      <Dialog open={isDeleteDialogOpen}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this payment method?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default PaymentMethods;
