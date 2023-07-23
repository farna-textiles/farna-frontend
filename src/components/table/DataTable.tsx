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
  Button,
} from '@mui/material';
import SearchBar from '../elements/SearchBar';
import { ActionButton, TableColumn, AdditionalColumn } from '../../interfaces';

interface DataTableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  actionButtons: ActionButton[];
  additionalColumn?: AdditionalColumn<T>;
  isLoading?: boolean;
  customButtonLabel?: string;
  onCustomButtonClick?: () => void;
}

const Container = styled('div')(({ theme }) => ({
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
}));

const CustomButton = styled(Button)(({ theme, disabled }) => ({
  textDecoration: 'none',
  color: theme.palette.primary.main,
  padding: theme.spacing(1),
  border: `1px solid ${theme.palette.primary.main}`,
  borderRadius: theme.shape.borderRadius,
  '&:hover': {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
  },
  ...(disabled && {
    backgroundColor: theme.palette.grey[300],
    color: theme.palette.text.primary,
    pointerEvents: 'none',
    '&:hover': {
      backgroundColor: theme.palette.grey[300],
      borderColor: theme.palette.grey[300],
      color: theme.palette.text.primary,
    },
  }),
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

  const handleAdditionalColumnChange = (id: number, checked: boolean) => {
    if (additionalColumn?.onChange) {
      additionalColumn.onChange(id, checked);
    }
  };

  return (
    <Container>
      <Grid container justifyContent="space-between" spacing={8}>
        <Grid item>
          <SearchBar onSearch={setSearchQuery} />
        </Grid>
        {customButtonLabel && onCustomButtonClick && (
          <Grid item>
            <CustomButton onClick={onCustomButtonClick} disabled={isLoading}>
              {customButtonLabel}
            </CustomButton>
          </Grid>
        )}
      </Grid>

      <Table>
        <TableHead>
          <TableRow>
            {additionalColumn && (
              <TableCell>{additionalColumn.columnName}</TableCell>
            )}
            {columns.map((column) => (
              <TableCell key={column.field as string}>{column.label}</TableCell>
            ))}
            {actionButtons.length > 0 && <TableCell>Actions</TableCell>}
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
            .map((item) => (
              <TableRow key={item.id}>
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
                {actionButtons.length > 0 && (
                  <TableCell>
                    {actionButtons.map((button, index) => (
                      <IconButton
                        // eslint-disable-next-line react/no-array-index-key
                        key={index}
                        title={button.title}
                        disabled={isLoading}
                        onClick={() => button.onClick(item.id)}
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
    </Container>
  );
};

DataTable.defaultProps = {
  additionalColumn: null,
  isLoading: false,
  customButtonLabel: '',
  onCustomButtonClick: () => {},
};

export default DataTable;
