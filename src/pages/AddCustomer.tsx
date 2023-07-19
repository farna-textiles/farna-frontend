import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

interface RowData {
  name: string;
  contact: string;
  designation: string;
  houseNo: string;
  city: string;
  country: string;
  id: string;
}

const AddCustomer: React.FC = () => {
  const location = useLocation();
  const rowData: RowData = location.state && location.state.rowData;

  const initialName = rowData ? rowData.name : '';
  const initialContact = rowData ? rowData.contact : '';

  const [name, setName] = useState(initialName);
  const [contact, setContact] = useState(initialContact);
  const [updatedName, setUpdatedName] = useState(name);
  const [updatedContact, setUpdatedContact] = useState(contact);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalName, setModalName] = useState('');
  const [modalContact, setModalContact] = useState('');
  const [modalDesignation, setModalDesignation] = useState('');
  const [modalHouseNo, setModalHouseNo] = useState('');
  const [modalCity, setModalCity] = useState('');
  const [modalCountry, setModalCountry] = useState('');
  const [tableData, setTableData] = useState<RowData[]>([]);

  const handleConfirmClick = () => {
    if (rowData) {
      setName(updatedName);
      setContact(updatedContact);
    }
  };

  const handleModalConfirmClick = () => {
    setIsModalOpen(false);
    const newData = [
      ...tableData,
      {
        name: modalName,
        contact: modalContact,
        designation: modalDesignation,
        houseNo: modalHouseNo,
        city: modalCity,
        country: modalCountry,
        id: Date.now().toString(),
      },
    ];
    setTableData(newData);
    setModalName('');
    setModalContact('');
    setModalDesignation('');
    setModalHouseNo('');
    setModalCity('');
    setModalCountry('');
  };

  const handleAddClick = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleDeleteClick = (rowData: RowData) => {
    const updatedData = tableData.filter((row) => row.id !== rowData.id);
    setTableData(updatedData);
  };

  const handleRadioChange = (rowData: RowData) => {
    setContact(rowData.contact);
    setUpdatedContact(rowData.contact);
    console.log('Selected row:', rowData);
  };

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
      </div>
      <div className="mt-4">
        <button
          className="px-4 py-2 bg-green-500 text-white rounded-md"
          onClick={handleAddClick}
        >
          Add
        </button>
      </div>
      {isModalOpen && (
        <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded-md shadow-lg transform transition-all max-h-[53vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">Enter Information</h2>
            <div className="mb-4">
              <label htmlFor="modalName" className="mr-2 block">
                Name:
              </label>
              <input
                type="text"
                id="modalName"
                value={modalName}
                className="px-4 py-2 w-full border border-gray-300 rounded-md"
                onChange={(e) => setModalName(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="modalContact" className="mr-2 block">
                Contact No.:
              </label>
              <input
                type="text"
                id="modalContact"
                value={modalContact}
                className="px-4 py-2 w-full border border-gray-300 rounded-md"
                onChange={(e) => setModalContact(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="modalDesignation" className="mr-2 block">
                Designation:
              </label>
              <input
                type="text"
                id="modalDesignation"
                value={modalDesignation}
                className="px-4 py-2 w-full border border-gray-300 rounded-md"
                onChange={(e) => setModalDesignation(e.target.value)}
              />
            </div>
            {/* The following container will be scrollable */}
            <div className="max-h-[50vh] overflow-y-auto">
              <div className="mb-4">
                <label htmlFor="modalHouseNo" className="mr-2 block">
                  House Number:
                </label>
                <input
                  type="text"
                  id="modalHouseNo"
                  value={modalHouseNo}
                  className="px-4 py-2 w-full border border-gray-300 rounded-md"
                  onChange={(e) => setModalHouseNo(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <label htmlFor="modalCity" className="mr-2 block">
                  City:
                </label>
                <input
                  type="text"
                  id="modalCity"
                  value={modalCity}
                  className="px-4 py-2 w-full border border-gray-300 rounded-md"
                  onChange={(e) => setModalCity(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="modalCountry" className="mr-2 block">
                  Country:
                </label>
                <input
                  type="text"
                  id="modalCountry"
                  value={modalCountry}
                  className="px-4 py-2 w-full border border-gray-300 rounded-md"
                  onChange={(e) => setModalCountry(e.target.value)}
                />
              </div>
            </div>
            {/* End of scrollable container */}
          </div>
          {/* Fixed footer for buttons */}
          <div className="fixed bottom-20 left-0 right-0 flex justify-center">
            <button
              className="px-4 py-2 bg-gray-500 text-white rounded-md mr-2"
              onClick={closeModal}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded-md"
              onClick={handleModalConfirmClick}
            >
              Confirm
            </button>
          </div>
        </div>
      )}

      {tableData.length > 0 && (
        <div className="mt-4">
          <h2 className="text-lg font-semibold">Information:</h2>
          <table className="mt-2 w-full border border-gray-300">
            <thead>
              <tr>
                <th className="px-4 py-2 border-b">Main Contact</th>
                <th className="px-4 py-2 border-b">Name</th>
                <th className="px-4 py-2 border-b">Contact</th>
                <th className="px-4 py-2 border-b">Designation</th>
                <th className="px-4 py-2 border-b">House No</th> {/* New column: House No */}
                <th className="px-4 py-2 border-b">City</th> {/* New column: City */}
                <th className="px-4 py-2 border-b">Country</th> {/* New column: Country */}
                <th className="px-4 py-2 border-b"></th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((row) => (
                <tr key={row.id}>
                  <td className="px-4 py-2 border-b text-center">
                    <input
                      type="radio"
                      name="selectRow"
                      value={row.id}
                      onChange={() => handleRadioChange(row)}
                    />
                  </td>
                  <td className="px-4 py-2 border-b text-center">{row.name}</td>
                  <td className="px-4 py-2 border-b text-center">{row.contact}</td>
                  <td className="px-4 py-2 border-b text-center">{row.designation}</td>
                  <td className="px-4 py-2 border-b text-center">{row.houseNo}</td> {/* Display House No */}
                  <td className="px-4 py-2 border-b text-center">{row.city}</td> {/* Display City */}
                  <td className="px-4 py-2 border-b text-center">{row.country}</td> {/* Display Country */}
                  <td className="px-4 py-2 border-b text-center">
                    <button
                      className="px-2 py-1 bg-red-500 text-white rounded-md"
                      onClick={() => handleDeleteClick(row)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AddCustomer;
