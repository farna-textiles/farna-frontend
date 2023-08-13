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
  TableContainer,
  Paper,
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

const StyledTableRow = styled(TableRow)({
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
  },
});

const EnhancedTableHead = styled(TableHead)(({ theme }) => ({
  boxShadow: '0px 3px 10px rgba(0, 0, 0, 0.1)',
  backgroundColor: theme.palette.primary.light,
}));

const StyledIcon = styled(IconButton)(({ theme }) => ({
  color: theme.palette.primary.main,
  '&:hover': {
    color: theme.palette.secondary.dark,
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
  },
}));

const WhiteTextTableCell = styled(TableCell)({
  color: 'white',
  fontWeight: 'bold',
});

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  maxWidth: '100%',
  overflowX: 'auto',
  background: theme.palette.background.paper,
  boxShadow: theme.shadows[1],
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
  const [rowsPerPage, setRowsPerPage] = useState(5);
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
      <StyledTableContainer className="mt-10">
        <Table style={{ minWidth: '1000px' }}>
          <EnhancedTableHead>
            <StyledTableRow>
              {additionalColumn && (
                <WhiteTextTableCell key={columns.length}>
                  {additionalColumn.columnName}
                </WhiteTextTableCell>
              )}
              {columns.map((column) => (
                <WhiteTextTableCell key={column.field as string}>
                  {column.label}
                </WhiteTextTableCell>
              ))}
              {actionButtons && (
                <WhiteTextTableCell key={columns.length + 1}>
                  Actions
                </WhiteTextTableCell>
              )}
            </StyledTableRow>
          </EnhancedTableHead>
          <TableBody>
            {isLoading ? (
              <StyledTableRow>
                <TableCell
                  colSpan={columns.length + 1 + (actionButtons ? 1 : 0)}
                >
                  Loading...
                </TableCell>
              </StyledTableRow>
            ) : (
              data?.map((item) => (
                <StyledTableRow key={String(item.id)}>
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
                        <StyledIcon
                          // eslint-disable-next-line react/no-array-index-key
                          key={index}
                          onClick={() => button.onClick(item.id as number)}
                        >
                          {button.icon}
                        </StyledIcon>
                      ))}
                    </TableCell>
                  )}
                </StyledTableRow>
              ))
            )}
          </TableBody>
        </Table>
      </StyledTableContainer>

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
