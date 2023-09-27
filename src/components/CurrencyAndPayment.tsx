












import React, { useState, useEffect } from 'react';
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

const CurrencyAndPayment = ({
  pageTitle,
  pageType,
  fetchData,
  data,
  handleEdit,
  handleDelete,
  handleSubmit,
  newItem,
  setNewItem,
  isEditing,
  setIsEditing,
  isDeleteDialogOpen,
  isCurrency,
  handleConfirmDelete,
  handleCancelDelete,

}) => {
  const initialNewItem = {
    name: '',
    code: '',
    symbol: '',
  };

  const [editedItem, setEditedItem] = useState(initialNewItem);
 
  useEffect(() => {
    if (isEditing) {
      setEditedItem(newItem);
    } else {
      setEditedItem(initialNewItem);
    }
  }, [isEditing, newItem]);

  const handleNameChange = (e) => {
    setEditedItem({ ...editedItem, name: e.target.value });
  };
  const handleCodeChange = (e) => {
    setEditedItem({ ...editedItem, code: e.target.value });
  };
  const handleSymbolChange = (e) => {
    const symbol = e.target.value.code;
    setEditedItem({ ...editedItem, symbol });
  };

  return (
    <div className="container mx-auto mt-12 mr-2">
    <h1 className="text-3xl mb-5 p-2">{pageTitle}</h1>
    <div className="grid grid-cols-1  md:grid-cols-3 gap-4 ">
      <div className="md:col-span">
          <Card>
            <CardContent>
              <h2 className="text-xl font-semibold mb-4">
                {isEditing ? `Edit ${pageType}` : `Add ${pageType}`}
              </h2>
              <form onSubmit={handleSubmit}>
                <TextField
                  label={`${pageType}`}
                  variant="outlined"
                  fullWidth
                  required
                  value={newItem}
                  onChange={(e) => setNewItem(e.target.value)}
                  style={{ marginBottom: '10px' }}
                />
                  {isCurrency && (
                  <>
                    <TextField
                      label="Code"
                      variant="outlined"
                      fullWidth
                      required
                      value={editedItem.code}
                      onChange={handleCodeChange}
                      style={{ marginBottom: '10px' }}
                    />

                    <TextField
                      label="Symbol"
                      variant="outlined"
                      fullWidth
                      required
                      value={editedItem.symbol}
                      onChange={handleSymbolChange}
                    />
                  </>
                )}
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
                        setIsEditing(false);
                        setNewItem('');
                       

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
        <div className="md:col-span-2">
          <Card>
            <CardContent>
              <h2 className="text-xl font-semibold mb-4">{pageType} List</h2>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>{`${pageType} Name`}</TableCell>
                      {isCurrency && (
                        <>
                          <TableCell>Code</TableCell>
                          <TableCell>Symbol</TableCell>
                        </>
                      )}
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.name}</TableCell>
                        {isCurrency && (
                          <>
                            <TableCell>{item.code}</TableCell>
                            <TableCell>{item.symbol}</TableCell>
                          </>
                        )}
                        <TableCell>
                          <div className="flex">
                            <Button
                              variant="outlined"
                              sx={{ margin: '7px' }}
                              color="primary"
                              onClick={() => handleEdit(item)}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="outlined"
                              color="secondary"
                              sx={{ margin: '7px' }}
                              onClick={() => handleDelete(item.id)}
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
          Are you sure you want to delete this {pageType}?
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

export default CurrencyAndPayment;