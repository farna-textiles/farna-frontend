import React, { ReactNode, useCallback, useState } from 'react';
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
  CircularProgress,
  Button,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { throttle } from 'lodash';

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

const StyledTableRow = styled(TableRow)(() => ({
  '&:nth-child(even)': {
    backgroundColor: 'white',
  },
  '&:nth-child(odd)': {
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
  },
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
  },
}));

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
  onAddBtnClick,
  loadInProgress = false,
}: GenericTableProps<T> & {
  addButtonLink?: string;
  addButtonLabel?: string;
  onAddBtnClick?: () => void;
  actionButtons?: ActionButton[];
  additionalColumn?: AdditionalColumn<T>;
  loadInProgress: boolean;
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

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const setSearchTermThrottled = useCallback(
    throttle((value: string) => {
      setSearchQuery(value);
    }, 300),
    []
  );

  const data = responseData?.data;
  const total = responseData?.total;

  const handleChangePage = (
    _event: React.MouseEvent<HTMLButtonElement> | null,
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
      return item[firstKey as keyof T][
        secondKey as keyof T[keyof T]
      ] as ReactNode;
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
          <SearchBar onSearch={setSearchTermThrottled} />
        </Grid>
        {addButtonLabel && (
          <Grid item>
            {addButtonLink && (
              <Link to={addButtonLink} style={{ textDecoration: 'none' }}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={
                    isLoading || loadInProgress ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : null
                  }
                >
                  {addButtonLabel}
                </Button>
              </Link>
            )}
            {onAddBtnClick && (
              <Button
                variant="contained"
                color="primary"
                onClick={onAddBtnClick}
                disabled={isLoading || loadInProgress}
                startIcon={
                  isLoading || loadInProgress ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : null
                }
              >
                {addButtonLabel}
              </Button>
            )}
          </Grid>
        )}
      </Grid>
      <StyledTableContainer className="mt-10">
        <Table style={{ minWidth: '50rem' }}>
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
                      {actionButtons?.map((button, buttonsIndex) => (
                        <StyledIcon
                          title={button.title}
                          // eslint-disable-next-line react/no-array-index-key
                          key={buttonsIndex}
                          disabled={button.disabled || isLoading}
                          onClick={() =>
                            button.onClick(item.id as number, item)
                          }
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
  onAddBtnClick: null,
};

export default GenericTable;
