import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Delete } from '@mui/icons-material';
import Modal from '../../components/Modal';
import GenericTable from '../../components/table/GenericTable';
import {
  ActionButton,
  AdditionalColumn,
  RowObject,
  TableColumn,
  RowObject as RowData,
  PaginatedResponse,
} from '../../interfaces';

const AddCustomer: React.FC = () => {
  const location = useLocation();
  const rowData: RowData | undefined = location.state;
  const labels = [
    'Name',
    'Contact No.',
    'Designation',
    'House No',
    'City',
    'Country',
  ];

  const initialName = rowData?.name || '';
  const initialContact = rowData?.contact || '';

  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);

  const [name, setName] = useState(initialName);
  const [contact, setContact] = useState(initialContact);
  const [updatedName, setUpdatedName] = useState(name);
  const [updatedContact, setUpdatedContact] = useState(contact);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalName, setModalName] = useState('');
  const [modalContact, setModalContact] = useState('');
  const [tableData, setTableData] = useState<RowData[]>([]);

  const handleDeleteClick = (id: number) => {
    const updatedData = tableData.filter((item) => item.id !== id);
    setTableData(updatedData);
  };

  const additionalColumn: AdditionalColumn<RowData> = {
    type: 'radio', // Set 'type' to 'radio' for radio buttons
    valueGetter: (item: RowData) => item.id === selectedItemId,
    onChange: (id: number, checked: boolean) => {
      if (checked) {
        setSelectedItemId(id);
      } else {
        setSelectedItemId(null);
      }
    },
  };

  const handleModalDataSubmit = (data: string[]) => {
    const newData: RowData[] = [
      {
        id: '5',
        name: data[0],
        contact: data[1],
        designation: data[2],
        house: data[3],
        city: data[4],
        country: data[5],
      },
    ];
  };

  const fetchData = async (
    page: number,
    pageSize: number,
    searchQuery: string
  ): Promise<PaginatedResponse<RowObject>> => {
    const dummyData: RowData[] = [
      {
        id: '1',
        name: 'John Doe',
        contact: '1234567890',
        designation: 'Engineer',
        house: '123',
        city: 'New York',
        country: 'USA',
      },
      {
        id: '2',
        name: 'Jane Smith',
        contact: '9876543210',
        designation: 'Manager',
        house: '456',
        city: 'Los Angeles',
        country: 'USA',
      },
      // Add more dummy data as needed.
    ];
    const filteredData = searchQuery
      ? dummyData.filter((item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : dummyData;

    const startIndex = page * pageSize;
    const pagedData = filteredData.slice(startIndex, startIndex + pageSize);

    return {
      data: pagedData,
      total: filteredData.length,
      page,
      limit: pageSize,
    };
  };
  const handleConfirmClick = () => {
    setName(updatedName);
    setContact(updatedContact);
  };

  const handleModalConfirmClick = () => {
    setIsModalOpen(false);
    const newData = [
      ...tableData,
      {
        name: modalName,
        contact: modalContact,
      },
    ];
    setModalName('');
    setModalContact('');
    console.log(modalName);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  const actionButtons: ActionButton[] = [
    {
      icon: <Delete />,
      onClick: (id: number) => {
        console.log(`Delete button clicked for item with ID: ${id}`);
        handleDeleteClick(id);
        // Perform delete logic
      },
    },
  ];

  const handleAddButtonClick = () => {
    setIsModalOpen(true);
  };
  const columns: TableColumn<RowObject>[] = [
    { field: 'name', label: 'Name' },
    { field: 'contact', label: 'Contact No.' },
    { field: 'designation', label: 'Designation' },
    { field: 'house', label: 'House No' },
    { field: 'city', label: 'City' },
    { field: 'country', label: 'Country' },
  ];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Customer Information</h1>
      {rowData && (
        <div className="border border-gray-300 p-4 rounded-md">
          <p className="mb-2">
            <span className="font-semibold">Business Name:</span> {name}
          </p>
          <p>
            <span className="font-semibold">Main Contact:</span> {contact}
          </p>
        </div>
      )}
      <div className="flex mt-4">
        <div className="mr-4">
          <label htmlFor="name" className="mr-2">
            Name:
          </label>
          <input
            type="text"
            id="name"
            value={updatedName}
            className="px-2 py-1 border border-gray-300 rounded-md"
            disabled={!rowData}
            onChange={(e) => setUpdatedName(e.target.value)}
          />
        </div>
        <div className="mr-4">
          <label htmlFor="contact" className="mr-2">
            Contact:
          </label>
          <input
            type="text"
            id="contact"
            value={updatedContact}
            className="px-2 py-1 border border-gray-300 rounded-md"
            disabled={!rowData}
            onChange={(e) => setUpdatedContact(e.target.value)}
          />
        </div>
        {rowData && (
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-md"
            onClick={handleConfirmClick}
          >
            Confirm
          </button>
        )}
        {rowData && (
          <button
            className="ml-auto px-4 py-2 bg-blue-500 text-white rounded-md"
            onClick={handleAddButtonClick}
          >
            Add Information
          </button>
        )}
      </div>

      {isModalOpen && (
        <Modal
          labels={labels}
          buttonText="Confirm"
          onConfirmClick={handleModalConfirmClick}
          onCancelClick={closeModal}
          onModalDataSubmit={handleModalDataSubmit}
        />
      )}
      <div>
        <GenericTable<RowData>
          columns={columns}
          fetchData={fetchData}
          actionButtons={actionButtons}
          additionalColumn={additionalColumn}
        />
      </div>
    </div>
  );
};
export default AddCustomer;
