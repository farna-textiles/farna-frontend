import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TablePagination,
  Grid,
  styled,
  IconButton,
  Radio,
  Checkbox,
} from '@mui/material';
import { Link } from 'react-router-dom';
import {
  ActionButton,
  AdditionalColumn,
  GenericTableProps,
  TableColumn,
} from '../../interfaces';
import SearchBar from '../elements/SearchBar';

const Container = styled('div')(({ theme }) => ({
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
}));

const AddButtonLink = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  color: theme.palette.primary.main,
  padding: theme.spacing(1),
  border: `1px solid ${theme.palette.primary.main}`,
  borderRadius: theme.shape.borderRadius,
  '&:hover': {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
  },
}));

const GenericTable = <T extends Record<string, unknown>>({
  tableName,
  columns,
  fetchData,
  addButtonLink,
  addButtonLabel,
  actionButtons,
  additionalColumn,
}: GenericTableProps<T> & {
  addButtonLink?: string;
  addButtonLabel?: string;
  actionButtons?: ActionButton[];
  additionalColumn?: AdditionalColumn<T>;
}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');

  const { data: responseData, isLoading } = useQuery(
    [tableName, page, rowsPerPage, searchQuery],
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

  const getColumnValue = (item: T, column: TableColumn<T>): React.ReactNode => {
    if (typeof column.field === 'string' && column.field.includes('.')) {
      const [firstKey, secondKey] = (column.field as string).split('.');
      if (column.format) {
        return column.format(
          item[firstKey as keyof T][secondKey as keyof T[keyof T]]
        );
      }
      return item[firstKey as keyof T][secondKey as keyof T[keyof T]];
    }
    if (column.format) {
      return column.format(item[column.field]);
    }
    return item[column.field] as React.ReactNode;
  };

  return (
    <Container>
      <Grid container justifyContent="space-between" spacing={8}>
        <Grid item>
          <SearchBar onSearch={setSearchQuery} />
        </Grid>
        {addButtonLabel && addButtonLink && (
          <Grid item>
            <AddButtonLink to={addButtonLink}>{addButtonLabel}</AddButtonLink>
          </Grid>
        )}
      </Grid>
      <div className="overflow-x-auto">
      <Table className="overflow-x-auto">
        <TableHead>
          <TableRow>
            {additionalColumn && (
              <TableCell key={columns.length}>
                {additionalColumn.columnName}
              </TableCell>
            )}
            {columns.map((column) => (
              <TableCell key={column.field as string}>{column.label}</TableCell>
            ))}
            {actionButtons && (
              <TableCell key={columns.length + 1}>Actions</TableCell>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={columns.length + 1 + (actionButtons ? 1 : 0)}>
                Loading...
              </TableCell>
            </TableRow>
          ) : (
            data?.map((item) => (
              <TableRow key={String(item.id)}>
                {additionalColumn && (
                  <TableCell>
                    {additionalColumn.type === 'radio' && (
                      <Radio
                        checked={additionalColumn.valueGetter?.(item)}
                        onChange={(e) =>
                          additionalColumn.onChange?.(
                            item.id as number,
                            e.target.checked
                          )
                        }
                      />
                    )}
                    {additionalColumn.type === 'checkbox' && (
                      <Checkbox
                        checked={additionalColumn.valueGetter?.(item)}
                        onChange={(e) =>
                          additionalColumn.onChange?.(
                            item.id as number,
                            e.target.checked
                          )
                        }
                      />
                    )}
                  </TableCell>
                )}
                {columns.map((column) => (
                  <TableCell key={column.field as string}>
                    {getColumnValue(item, column)}
                  </TableCell>
                ))}
                {actionButtons && (
                  <TableCell>
                    {actionButtons?.map((button, index) => (
                      <IconButton
                        // eslint-disable-next-line react/no-array-index-key
                        key={index}
                        onClick={() => button.onClick(item.id as number)}
                      >
                        {button.icon}
                      </IconButton>
                    ))}
                  </TableCell>
                )}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      </div>
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

GenericTable.defaultProps = {
  addButtonLink: '',
  addButtonLabel: '',
  actionButtons: [],
  additionalColumn: null,
};

export default GenericTable;
