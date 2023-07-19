import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface RowData {
  name: string;
  contact: string;
}

const Table: React.FC<{ data: RowData[] }> = ({ data }) => {
  const navigate = useNavigate();
  const [tableData, setTableData] = useState(data);

  const handleAddClick = (rowData: RowData) => {
    console.log('Row Data:', rowData);
    navigate('/addcustomer', { state: { rowData } });
  };

  const handleDeleteClick = (rowData: RowData) => {
    const updatedData = tableData.filter((row) => row !== rowData);
    setTableData(updatedData);
  };

  useEffect(() => {
    setTableData(data);
  }, [data]);

  if (!tableData || tableData.length === 0) {
    return <p>No data found</p>;
  }

  return (
    <table className="w-full border border-gray-300">
      <thead>
        <tr>
          <th className="px-4 py-2 border-b">Business Name</th>
          <th className="px-4 py-2 border-b">Contact</th>
          <th className="px-4 py-2 border-b"></th> {/* Empty header for the buttons */}
        </tr>
      </thead>
      <tbody>
        {tableData.map((row, index) => (
          <tr key={index}>
            <td className="px-4 py-2 border-b text-center">{row.name}</td>
            <td className="px-4 py-2 border-b text-center">{row.contact}</td>
            <td className="px-4 py-2 border-b text-center">
              <button
                className="px-2 py-1 bg-blue-500 text-white rounded-md mr-2"
                onClick={() => handleAddClick(row)}
              >
                Edit
              </button>
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
  );
};

export default Table;
