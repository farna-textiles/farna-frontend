import React, { useState, ChangeEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GenericTable from '../../components/table/GenericTable';
import { ActionButton, PaginatedResponse, TableColumn } from '../../interfaces';
import { Edit, Delete } from '@mui/icons-material';
import { CustomerObject as Customer} from '../../interfaces';



const CustomerPage: React.FC = () => {
  const navigate = useNavigate();

  const [customers, setCustomers] = useState<Customer[]>([
    { id: 1, name: 'Nishat Group', contact: 'nishat@example.com' },
    { id: 2, name: 'Ahmad Fabrics', contact: 'ahmadfabrics@example.com' },
    { id: 3, name: 'Gul Ahmad', contact: 'gulahmad@example.com' },
    { id: 4, name: 'Khaadi', contact: 'khaadi@example.com' },
  ]);

  const deleteCustomer = (id: number) => {
    const updatedCustomers = customers.filter((customer) => customer.id !== id);
    setCustomers(updatedCustomers);
  };

  const actionButtons: ActionButton[] = [
    {
      icon: <Edit />,
      onClick: (id: number) => {
        console.log(`Edit button clicked for item with ID: ${id}`);
        const clickedCustomer = customers.find((customer) => customer.id === id);
        let name = clickedCustomer?.name;
        let contact = clickedCustomer?.contact;
        navigate(`/addcustomer`, { state: { name, contact } });
        // Perform edit logic
      },
    },
    {
      icon: <Delete />,
      onClick: (id: number) => {
        console.log(`Delete button clicked for item with ID: ${id}`);
        deleteCustomer(id);
        // Perform delete logic
      },
    },
  ];

  const headers: TableColumn<Customer>[] = [
    { field: 'id', label: 'ID' },
    { field: 'name', label: 'Name' },
    { field: 'contact', label: 'Contact' },
  ];
  const fetchData = async (page: number, limit: number, searchQuery: string): Promise<PaginatedResponse<Customer>> => {

    const filteredCustomers = customers.filter((customer) =>
      customer.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const paginatedData: PaginatedResponse<Customer> = {
      
      page,
      limit,
      data: filteredCustomers,
      total: customers.length,
    };
    return paginatedData;
  };


  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-8">All Customers</h1>
      <GenericTable<Customer>
        columns={headers}
        fetchData={fetchData}
        actionButtons={actionButtons}
        addButtonLink="/createcustomer"
        addButtonLabel="Add Customer"
      />
    </div>
  );
};

export default CustomerPage;