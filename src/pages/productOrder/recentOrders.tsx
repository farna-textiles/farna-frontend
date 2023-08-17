import {
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
} from '@mui/material';

const RecentOrders = () => {
  const recentOrdersData = [
    {
      lotNo: '123',
      diner: 'Medium',
      type: 'Type A',
      noOfFlament: 5,
      luster: 'High',
      endUse: 'Clothing',
      quantity: 10,
      rate: 25,
    },
    {
      lotNo: '124',
      diner: 'Thick',
      type: 'Type B',
      noOfFlament: 8,
      luster: 'Medium',
      endUse: 'Furniture',
      quantity: 20,
      rate: 30,
    },
  ];

  const fieldMappings = [
    { key: 'lotNo', label: 'Lot No.' },
    { key: 'diner', label: 'Diner' },
    { key: 'type', label: 'Type' },
    { key: 'noOfFlament', label: 'No of Flament' },
    { key: 'luster', label: 'Luster' },
    { key: 'endUse', label: 'End Use' },
    { key: 'quantity', label: 'Quantity' },
    { key: 'rate', label: 'Rate' },
    { key: 'amount', label: 'Amount' },
  ];

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-2 sm:text-2xl">Recent orders</h1>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {fieldMappings.map((field) => (
                <TableCell key={field.key} sx={{ fontWeight: 'bold' }}>
                  {field.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {recentOrdersData.map((order) => (
              <TableRow key={order.lotNo}>
                {fieldMappings.map((field) => (
                  <TableCell
                    key={field.key}
                    sx={{ borderBottom: 'none', fontSize: '14px' }}
                  >
                    {order[field.key]}
                    {field.key === 'amount' && (
                      <div>{order.quantity * order.rate}</div>
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default RecentOrders;
