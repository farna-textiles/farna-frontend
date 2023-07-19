import React, { useState, ChangeEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Table from '../components/table/Table';

interface RowData {
  [key: string]: string;
}

const CustomerPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [tableData, setTableData] = useState<RowData[]>([
    { name: 'Nishat Group', contact: 'nishat@example.com' },
    { name: 'Ahmad Fabrics', contact: 'ahmadfabrics@example.com' },
    { name: 'Gul Ahmad', contact: 'gulahmad@example.com' },
    { name: 'Khaadi', contact: 'khaadi@example.com' },
  ]);
  const [filteredData, setFilteredData] = useState<RowData[]>(tableData);

  const navigate = useNavigate();

  const headers = ['Business Name', 'Main Contact'];
  const columns = headers.length;

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleAddClick = () => {
    navigate('/createcustomer');
  };

  useEffect(() => {
    const updatedData = tableData.filter((row) =>
      row.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredData(updatedData);
  }, [searchTerm, tableData]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-8">All Customers</h1>
      <div className="flex items-center justify-between mb-4">
        <input
          type="text"
          placeholder="Search by name"
          className="px-2 py-1 border border-gray-300 rounded-md mr-2 w-64"
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <button
          className="px-4 py-2 bg-green-500 text-white rounded-md"
          onClick={handleAddClick}
        >
          Add
        </button>
      </div>
      <Table data={filteredData} headers={headers} columns={columns} />
    </div>
  );
};

export default CustomerPage;
