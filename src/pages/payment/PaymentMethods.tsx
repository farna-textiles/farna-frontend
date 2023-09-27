import React, { useState, useEffect } from 'react';
import CurrencyAndPayment from '../../components/CurrencyAndPayment';
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
      });
  };

  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  const handleEdit = (paymentType) => {
    setSelectedPaymentType(paymentType);
    setIsEditing(true);
    setNewPaymentMethod(paymentType.name);
  };
  const handleCancelEdit = () => {
    setSelectedPaymentType(null);
    setIsEditing(false);
    setNewPaymentMethod('');
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
    setSelectedPaymentType(null);
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
        });
    } else {
      createPaymentMethod({ name: newPaymentMethod })
        .then((newPaymentType) => {
          setPaymentTypes([...paymentTypes, newPaymentType]);
          setNewPaymentMethod('');
        });
    }
  };

  return (
    <CurrencyAndPayment
    pageTitle="Payment Types"
    pageType="Payment Type"
    data={paymentTypes}
    fetchData={fetchPaymentMethods}
    handleEdit={handleEdit}
    handleDelete={handleDelete}
    handleSubmit={handleSubmit}
    newItem={newPaymentMethod}
    setNewItem={setNewPaymentMethod}
    isEditing={isEditing}
    setIsEditing={setIsEditing}
    isDeleteDialogOpen={isDeleteDialogOpen}
    setIsDeleteDialogOpen={setIsDeleteDialogOpen}
    deletingItem={deletingPaymentType}
    setDeletingItem={setDeletingPaymentType}
    handleCancelDelete={handleCancelDelete} 
    handleConfirmDelete={handleConfirmDelete}
    isCurrency={false}
    // fieldsToDisplay={{ code: false, symbol: false ,name:false}}
    
  />
  );
};

export default PaymentMethods;
