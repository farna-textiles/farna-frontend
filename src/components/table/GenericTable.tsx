/* eslint-disable react/no-array-index-key */
/* eslint-disable import/no-extraneous-dependencies */
import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TablePagination,
  TextField,
  Grid,
  styled,
} from '@mui/material';
import { GenericTableProps } from '../../interfaces';

const SearchBar: React.FC<{ onSearch: (value: string) => void }> = ({
  onSearch,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    onSearch(searchQuery);
  }, [searchQuery, onSearch]);

  return (
    <TextField
      label="Search"
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      variant="outlined"
      size="small"
    />
  );
};

const Container = styled('div')(({ theme }) => ({
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
}));

const GenericTable = <T extends Record<string, unknown>>({
  columns,
  fetchData,
}: GenericTableProps<T>) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');

  const { data: responseData, isLoading } = useQuery(
    ['tableData', page, rowsPerPage, searchQuery],
    () => fetchData(page, rowsPerPage, searchQuery),
    {
      keepPreviousData: true,
    }
  );

  const data = responseData?.data;
  const total = responseData?.total;

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Container>
      <Grid container spacing={2}>
        <Grid item>
          <SearchBar onSearch={setSearchQuery} />
        </Grid>
      </Grid>
      <Table>
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell key={column.field as string}>{column.label}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={columns.length}>Loading...</TableCell>
            </TableRow>
          ) : (
            data?.map((item) => (
              <TableRow key={String(item.id)}>
                {columns.map((column) => (
                  <TableCell key={column.field as string}>
                    {String(item[column.field])}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[5, 10, 20]}
        component="div"
        count={total || 0}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Container>
  );
};

export default GenericTable;
