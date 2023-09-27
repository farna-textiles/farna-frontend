import React, { useState, useEffect } from 'react';
import CurrencyAndPayment from '../../components/CurrencyAndPayment';
import {
  getCurrencyUnits,
  createCurrencyUnit,
  updateCurrencyUnit,
  deleteCurrencyUnit,
} from '../../api/currencyUnitApi'; 

const CurrencyUnits: React.FC = () => {
  const [currencyUnits, setCurrencyUnits] = useState([]);
  const [selectedCurrencyUnit, setSelectedCurrencyUnit] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newCurrencyUnit, setNewCurrencyUnit] = useState('');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingCurrencyUnit, setDeletingCurrencyUnit] = useState(null);

  const fetchCurrencyUnits = () => {
    getCurrencyUnits()
      .then((data) => {
        setCurrencyUnits(data);
      })
      .catch((error) => {
      });
  };

  useEffect(() => {
    fetchCurrencyUnits();
  }, []);

  const handleEdit = (currencyUnit) => {
    setSelectedCurrencyUnit(currencyUnit);
    setIsEditing(true);
    setNewCurrencyUnit(currencyUnit.name);
  };

  const handleDelete = (id) => {
    setIsDeleteDialogOpen(true);
    setDeletingCurrencyUnit(id);
  };

  const handleConfirmDelete = () => {
    deleteCurrencyUnit(deletingCurrencyUnit)
      .then(() => {
        setCurrencyUnits((prevCurrencyUnits) =>
          prevCurrencyUnits.filter((currencyUnit) => currencyUnit.id !== deletingCurrencyUnit)
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
    if (isEditing && selectedCurrencyUnit) {
      updateCurrencyUnit(selectedCurrencyUnit.id, { name: newCurrencyUnit })
        .then(() => {
          setCurrencyUnits((prevCurrencyUnits) =>
            prevCurrencyUnits.map((currencyUnit) =>
              currencyUnit.id === selectedCurrencyUnit.id
                ? { ...currencyUnit, name: newCurrencyUnit }
                : currencyUnit
            )
          );
          setSelectedCurrencyUnit(null);
          setIsEditing(false);
          setNewCurrencyUnit('');
        })
        .catch((error) => {
         
        });
    } else {
      createCurrencyUnit({ name: newCurrencyUnit })
        .then((newCurrencyUnit) => {
          setCurrencyUnits([...currencyUnits, newCurrencyUnit]);
          setNewCurrencyUnit('');
        })
        .catch((error) => {
        });
    }
  };

  return (
    <CurrencyAndPayment
      pageTitle="Currency Units"
      pageType="Currency Unit"
      data={currencyUnits}
      fetchData={fetchCurrencyUnits}
      handleEdit={handleEdit}
      handleDelete={handleDelete}
      handleSubmit={handleSubmit}
      newItem={newCurrencyUnit}
      setNewItem={setNewCurrencyUnit}
      isEditing={isEditing}
      setIsEditing={setIsEditing}
      isDeleteDialogOpen={isDeleteDialogOpen}
      setIsDeleteDialogOpen={setIsDeleteDialogOpen}
      deletingItem={deletingCurrencyUnit}
      setDeletingItem={handleConfirmDelete}
      handleCancelDelete={handleCancelDelete} 
      handleConfirmDelete={handleConfirmDelete}
      isCurrency={true}
    />
  );
  
};

export default CurrencyUnits;
