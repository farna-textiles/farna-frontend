import React, { useState } from 'react';
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TablePagination,
  IconButton,
  Radio,
  Checkbox,
  Grid,
  styled,
  TableContainer,
} from '@mui/material';
import SearchBar from '../elements/SearchBar';
import { ActionButton, TableColumn, AdditionalColumn } from '../../interfaces';
import ButtonLoader from '../elements/buttons/ButtonLoader';

interface DataTableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  actionButtons?: ActionButton[];
  additionalColumn?: AdditionalColumn<T>;
  isLoading?: boolean;
  customButtonLabel?: string;
  onCustomButtonClick?: () => void;
}

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  maxHeight: 600,
  [theme.breakpoints.down('sm')]: {
    maxHeight: 400,
  },
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 'bold',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  [theme.breakpoints.down('sm')]: {
    maxWidth: 100,
    whiteSpace: 'normal',
    overflow: 'visible',
    textOverflow: 'clip',
  },
}));

const DataTable = <T extends { id: number }>({
  data,
  columns,
  actionButtons,
  additionalColumn,
  customButtonLabel,
  onCustomButtonClick,
  isLoading,
}: DataTableProps<T>) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');

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

  const handleAdditionalColumnChange = (id: number, checked: boolean) => {
    if (additionalColumn?.onChange) {
      additionalColumn.onChange(id, checked);
    }
  };

  return (
    <StyledTableContainer>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={customButtonLabel && onCustomButtonClick ? 8 : 12}>
          <SearchBar onSearch={setSearchQuery} />
        </Grid>

        {customButtonLabel && onCustomButtonClick && (
          <Grid item xs={4}>
            <ButtonLoader
              isLoading={!!isLoading}
              onClick={onCustomButtonClick}
              disabled={isLoading}
              className="w-full"
            >
              {customButtonLabel}
            </ButtonLoader>
          </Grid>
        )}
      </Grid>

      <Table>
        <TableHead>
          <TableRow>
            {additionalColumn && (
              <StyledTableCell>{additionalColumn.columnName}</StyledTableCell>
            )}
            {columns.map((column) => (
              <StyledTableCell key={column.field as string}>
                {column.label}
              </StyledTableCell>
            ))}
            {actionButtons && actionButtons.length > 0 && (
              <StyledTableCell>Actions</StyledTableCell>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {data
            .filter((item) =>
              Object.values(item).some((value) =>
                String(value).toLowerCase().includes(searchQuery.toLowerCase())
              )
            )
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((item, dataIndex) => (
              <TableRow key={item.id || dataIndex}>
                {additionalColumn && (
                  <TableCell>
                    {additionalColumn.type === 'radio' && (
                      <Radio
                        checked={additionalColumn.valueGetter?.(item)}
                        disabled={isLoading}
                        onChange={(e) =>
                          handleAdditionalColumnChange(
                            item.id,
                            e.target.checked
                          )
                        }
                      />
                    )}
                    {additionalColumn.type === 'checkbox' && (
                      <Checkbox
                        checked={additionalColumn.valueGetter?.(item)}
                        disabled={isLoading}
                        onChange={(e) =>
                          handleAdditionalColumnChange(
                            item.id,
                            e.target.checked
                          )
                        }
                      />
                    )}
                  </TableCell>
                )}
                {columns.map((column) => (
                  <TableCell key={column.field as string}>
                    {column.format
                      ? column.format(item[column.field] as any)
                      : item[column.field]}
                  </TableCell>
                ))}
                {actionButtons && actionButtons.length > 0 && (
                  <TableCell>
                    {actionButtons.map((button, index) => (
                      <IconButton
                        // eslint-disable-next-line react/no-array-index-key
                        key={index}
                        title={button.title}
                        disabled={isLoading}
                        onClick={() => button.onClick(item.id || dataIndex)}
                      >
                        {button.icon}
                      </IconButton>
                    ))}
                  </TableCell>
                )}
              </TableRow>
            ))}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[5, 10, 20]}
        component="div"
        count={data.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      {/* {!isLoading && data.length === 0 && (
        <NoDataMessage message="No data available" /> // Consider creating a NoDataMessage component
      )} */}
    </StyledTableContainer>
  );
};

DataTable.defaultProps = {
  additionalColumn: null,
  isLoading: false,
  customButtonLabel: '',
  onCustomButtonClick: () => {},
  actionButtons: [],
};

export default DataTable;
