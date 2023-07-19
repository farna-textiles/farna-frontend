import React, { useState } from 'react';

const CreateCustomer: React.FC = () => {
  const [businessName, setBusinessName] = useState('');
  const [mainContact, setMainContact] = useState('');

  const handleClearClick = () => {
    setBusinessName('');
    setMainContact('');
  };

  const handleAddClick = () => {
    console.log('Business Name:', businessName);
    console.log('Main Contact:', mainContact);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Create Customer Page</h1>
      <div className="mb-4">
        <label htmlFor="businessName" className="mr-2">
          Business Name:
        </label>
        <input
          type="text"
          id="businessName"
          value={businessName}
          onChange={(e) => setBusinessName(e.target.value)}
          className="px-2 py-1 border border-gray-300 rounded-md"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="mainContact" className="mr-5">
          Main Contact:
        </label>
        <input
          type="text"
          id="mainContact"
          value={mainContact}
          onChange={(e) => setMainContact(e.target.value)}
          className="px-2 py-1 border border-gray-300 rounded-md"
        />
      </div>
      <div>
        <button
          onClick={handleClearClick}
          className="px-4 py-2 bg-gray-300 text-white rounded-md mr-2"
        >
          Clear
        </button>
        <button
          onClick={handleAddClick}
          className="px-4 py-2 bg-green-500 text-white rounded-md"
        >
          Add
        </button>
      </div>
    </div>
  );
};

export default CreateCustomer;
