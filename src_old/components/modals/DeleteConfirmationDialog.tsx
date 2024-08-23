import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';

interface DeleteConfirmationDialogProps {
  pageType: string;
  isDeleteDialogOpen: boolean;
  handleCancelDelete: () => void;
  handleConfirmDelete: () => void;
}

const DeleteConfirmationDialog: React.FC<DeleteConfirmationDialogProps> = ({
  pageType,
  isDeleteDialogOpen,
  handleCancelDelete,
  handleConfirmDelete,
}) => {
  return (
    <Dialog open={isDeleteDialogOpen}>
      <DialogTitle>Confirm Delete</DialogTitle>
      <DialogContent>
        Are you sure you want to delete this {pageType}?
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancelDelete} color="primary">
          Cancel
        </Button>
        <Button onClick={handleConfirmDelete} color="error">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmationDialog;
