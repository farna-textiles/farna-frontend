import React, { useCallback, useState } from 'react';
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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Drawer,
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

import { format } from 'date-fns';

import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import CloseIcon from '@mui/icons-material/Close';
import FullScreenModal from '../FullScreenModal';
import * as XLSX from 'xlsx';
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
  fetchProducts,
  fetchCustomers,
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
  const [rowsPerPage, setRowsPerPage] = useState(100);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchProductQuery, setProductSearchQuery] = useState('');
  const [searchCustomerQuery, setCustomerSearchQuery] = useState('');
  const [searchColumn, setSearchColumn] = useState('businessName');
  const [groupBy, setGroupBy] = useState(null);
  const [start_date, setStartDate] = useState<any>(null);
  const [productSearchKeyword, setProduct] = useState<any>(null)
  const [end_date, setEndDate] = useState<any>(null);
  const [reportPeriod, setReportPeriod] = useState('currentMonth');
  const { data: responseData, isLoading } = useQuery(
    [tableName, page, rowsPerPage, searchQuery, searchColumn, groupBy, reportPeriod, start_date, end_date, productSearchKeyword],
    () => fetchData(page, rowsPerPage, searchQuery, searchColumn, groupBy, reportPeriod, start_date, end_date, productSearchKeyword),
    {
      keepPreviousData: true,
    }
  );

  const { data: productsResponseData } = useQuery(
    ['Products', page, rowsPerPage, searchProductQuery],
    () => searchProductQuery && fetchProducts ? fetchProducts(page, rowsPerPage, searchProductQuery) : Promise.resolve({ data: [], total: 0 }),
    {
      enabled: !!fetchProducts,
      keepPreviousData: true,
    }
  );


  const { data: customersResponseData } = useQuery(
    ['Customers', page, rowsPerPage, searchCustomerQuery],
    () => searchCustomerQuery && fetchCustomers ? fetchCustomers(page, rowsPerPage, 'businessName', searchCustomerQuery) : Promise.resolve({ data: [], total: 0 }),
    {
      enabled: !!fetchCustomers,
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

  const setProductSearchTermThrottled = useCallback(
    throttle((value: string) => {
      if (searchColumn === 'product') {
        setProductSearchQuery(value);
        setCustomerSearchQuery('')
      }
      if (searchColumn === 'businessName') {
        setCustomerSearchQuery(value);
        setProductSearchQuery('');
      }
    }, 300),
    [searchColumn]
  );

  const data: any = responseData?.data;


  const total = responseData?.total;





  let productsData: any = searchColumn == 'product' ? productsResponseData?.data : customersResponseData?.data;

  let productsTotal = searchColumn == 'product' ? productsResponseData?.total : customersResponseData?.total;

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

  const getColumnValue = <T,>(item: any, column: TableColumn<T>): React.ReactNode => {
    if (item) {

      const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        return format(date, 'dd/MM/yyyy');
      };


      if (column.field === 'quantity') {
        return item?.orderProducts[0]?.quantity;
      }

      if (column.field === 'denier' && item.orderProducts) {
        return item?.orderProducts[0]?.product?.denier + ' lot # ' + item?.orderProducts[0]?.product?.lotNo;
      }
      if (column.field === 'denier' && !item.orderProducts) {
        return item?.denier + ' lot # ' + item?.lotNo;
      }

      if (column.field === 'amount') {
        let val: any = parseFloat(item?.orderProducts[0]?.rate) * parseFloat(item?.orderProducts[0]?.quantity)
        let val1: any = parseFloat(val).toFixed(2)
        return '$ ' + val1.toString()
      }

      if (typeof column.field === 'string' && column.field.includes('.')) {
        const [firstKey, secondKey] = (column.field as string).split('.');
        if (column.format) {
          return column.format(
            item[firstKey as keyof T][secondKey as keyof T[keyof T]]
          );
        }

        if (secondKey === 'salesReceiptDate' || secondKey === 'validity') {
          return formatDate(item[firstKey as keyof T][secondKey as keyof T[keyof T]] as unknown as string);
        }



        return item[firstKey as keyof T][
          secondKey as keyof T[keyof T]
        ] as React.ReactNode;
      }

      if (column.format) {
        return column.format(item[column.field]);
      }

      if (column.field === 'salesReceiptDate' || column.field === 'validity') {
        return formatDate(item[column.field] as unknown as string);
      }

      return item[column.field] as React.ReactNode;
    }

  };


  const getTotalQuantity = () => {
    let total_quantity = 0;
    if (data && data.length > 0) {
      data.map((item: any) => {
        if (item.orderProducts) {
          total_quantity = total_quantity + item.orderProducts[0].quantity
        }

      })
    }
    return total_quantity

  }

  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = (open: any) => (event: any) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };


  const reset_filters = () => {
    setSearchColumn('businessName')
    setReportPeriod('currentMonth')
    setGroupBy(null)
    clearProductSearch()
  }


  const [grouped_children, setGroupChildren] = useState<any>([])

  const generate_pdf = (group: any) => {

    setGroupChildren(group.orders);
    handleOpenModal()
  }





  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };


  const formatDate = (dateString: string): string => {
    if (dateString) {
      const date = new Date(dateString);
      return format(date, 'dd/MM/yyyy');
    }
    else {
      return 'N/A'
    }

  };


  const clearProductSearch = () => {
    setProduct(null)
    setCustomerSearchQuery('')
    setProductSearchQuery('')
    productsData = []
    productsTotal = 0
  }
  const getTotalAmount = () => {
    let totalAmount: number = 0;

    if (data && data.length > 0) {
      data.forEach((product: any) => {
        if (product.orderProducts) {
          let totalAmountForOrder = parseFloat(product.orderProducts[0].quantity) * parseFloat(product.orderProducts[0].rate);
          totalAmount += totalAmountForOrder;
        }

      });
    }

    return parseFloat(totalAmount.toFixed(2));
  };

  const exportToXlsx = () => {
    const totalAmount = getTotalAmount();
    const totalQuantity = getTotalQuantity();
    // Create a new workbook and a worksheet
    const workbook = XLSX.utils.book_new();
    const worksheetData: any[] = [];

    // Add column headers
    worksheetData.push([
      { v: 'Transaction No.', s: { alignment: { horizontal: 'left' } } },
      { v: 'Date', s: { alignment: { horizontal: 'left' } } },
      { v: 'Product', s: { alignment: { horizontal: 'left' } } },
      { v: 'Customer', s: { alignment: { horizontal: 'left' } } },
      { v: 'PI #', s: { alignment: { horizontal: 'left' } } },
      { v: 'QTY', s: { alignment: { horizontal: 'left' } } },
      { v: 'Salesprice', s: { alignment: { horizontal: 'left' } } },
      { v: 'Amount', s: { alignment: { horizontal: 'left' } } }
    ]);


    // Add rows data
    data.forEach((product: any) => {
      if (groupBy) {
        product.orders.map((or: any) => {
          worksheetData.push([
            // { v: `Grouped By ${product.}`, s: { alignment: { horizontal: 'left' } } },
            { v: '', s: { alignment: { horizontal: 'left' } } },
            { v: '', s: { alignment: { horizontal: 'left' } } },
            { v: '', s: { alignment: { horizontal: 'left' } } },
            { v: '', s: { alignment: { horizontal: 'left' } } },
            { v: ``, s: { alignment: { horizontal: 'left' } } },
            { v: '', s: { alignment: { horizontal: 'left' } } },
            { v: ``, s: { alignment: { horizontal: 'left' } } }
          ]);
          worksheetData.push([
            { v: or.id, s: { alignment: { horizontal: 'left' } } },
            { v: formatDate(or?.validity), s: { alignment: { horizontal: 'left' } } },
            { v: `${or?.orderProducts[0]?.product?.denier} Lot # ${or?.orderProducts[0]?.product?.lotNo}`, s: { alignment: { horizontal: 'left' } } },
            { v: or?.customer?.businessName, s: { alignment: { horizontal: 'left' } } },
            { v: or?.PI_number, s: { alignment: { horizontal: 'left' } } },
            { v: or?.orderProducts[0]?.quantity, s: { alignment: { horizontal: 'left' } } },
            { v: or?.orderProducts[0]?.rate, s: { alignment: { horizontal: 'left' } } },
            { v: (or?.orderProducts[0]?.quantity * or?.orderProducts[0]?.rate).toFixed(2), s: { alignment: { horizontal: 'left' } } }
          ]);
        })

      }
      if (product.orderProducts) {
        worksheetData.push([
          { v: product.id, s: { alignment: { horizontal: 'left' } } },
          { v: formatDate(product?.validity), s: { alignment: { horizontal: 'left' } } },
          { v: `${product?.orderProducts[0]?.product?.denier} Lot # ${product?.orderProducts[0]?.product?.lotNo}`, s: { alignment: { horizontal: 'left' } } },
          { v: product?.customer?.businessName, s: { alignment: { horizontal: 'left' } } },
          { v: product?.PI_number, s: { alignment: { horizontal: 'left' } } },
          { v: product?.orderProducts[0]?.quantity, s: { alignment: { horizontal: 'left' } } },
          { v: product?.orderProducts[0]?.rate, s: { alignment: { horizontal: 'left' } } },
          { v: (product?.orderProducts[0]?.quantity * product?.orderProducts[0]?.rate).toFixed(2), s: { alignment: { horizontal: 'left' } } }
        ]);
      }
      else {
        worksheetData.push([
          { v: product.id, s: { alignment: { horizontal: 'left' } } },
          { v: formatDate(product?.validity), s: { alignment: { horizontal: 'left' } } },
          { v: `${product?.denier} Lot # ${product?.lotNo}`, s: { alignment: { horizontal: 'left' } } },
          { v: product?.product?.endUses.map((endUse: any) => endUse.name).join(' | '), s: { alignment: { horizontal: 'left' } } },
          { v: product?.PI_number, s: { alignment: { horizontal: 'left' } } },
          { v: product?.quantity, s: { alignment: { horizontal: 'left' } } },
          { v: product?.rate, s: { alignment: { horizontal: 'left' } } },
          { v: (product?.quantity * product?.rate).toFixed(2), s: { alignment: { horizontal: 'left' } } }
        ]);
      }

    });

    // Add total quantity and total amount rows
    worksheetData.push([
      { v: '', s: { alignment: { horizontal: 'left' } } },
      { v: '', s: { alignment: { horizontal: 'left' } } },
      { v: '', s: { alignment: { horizontal: 'left' } } },
      { v: '', s: { alignment: { horizontal: 'left' } } },
      { v: '', s: { alignment: { horizontal: 'left' } } },
      { v: `Total Quantity: ${totalQuantity.toFixed(2)}`, s: { alignment: { horizontal: 'left' } } },
      { v: '', s: { alignment: { horizontal: 'left' } } },
      { v: `Total Amount: ${data[0]?.currencyUnit?.symbol || ''}${totalAmount.toFixed(2)}`, s: { alignment: { horizontal: 'left' } } }
    ]);



    // Create worksheet
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

    // Set column widths
    worksheet['!cols'] = [
      { wpx: 200 }, // Width for Transaction No.
      { wpx: 200 }, // Width for Date
      { wpx: 200 }, // Width for Product
      { wpx: 200 }, // Width for Description
      { wpx: 200 }, // Width for PI #
      { wpx: 200 }, // Width for QTY
      { wpx: 200 }, // Width for Salesprice
      { wpx: 200 }  // Width for Amount
    ];

    // Add worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Orders');

    // Generate XLSX file and trigger download
    XLSX.writeFile(workbook, 'orders.xlsx');
  };


  return (
    <Container>

      <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
        <div className='w-full p-4 bg-blue-500 text-white flex justify-between items-center'>
          <p>Filters</p>
          <button type="button" onClick={toggleDrawer(false)}>
            <CloseIcon />
          </button>
        </div>
        <div
          role="presentation"
          // onClick={toggleDrawer(false)}
          // onKeyDown={toggleDrawer(false)}
          style={{ width: 450, padding: 16 }}
          className='flex w-full flex-col items-start justify-start'
        >
          <FormControl sx={{ m: 1, minWidth: 120 }} className='w-full'>
            <InputLabel id="demo-select-small-label">Sort By</InputLabel>
            <Select
              labelId="demo-select-small-label"
              id="demo-select-small"
              value={searchColumn}
              label="Age"
              onChange={(e) => { setSearchColumn(e.target.value) }}
            >
              <MenuItem value="businessName">
                Customer Name
              </MenuItem>
              <MenuItem value="product">
                Product
              </MenuItem>

            </Select>
          </FormControl>

          {
            searchColumn === 'product' &&
            <>
              <div className='flex justify-center w-full items-center gap-x-2'>
                <div className='w-[70%] basis-[70%] px-2'>
                  {productSearchKeyword ? <div className='w-full border border-gray-400 rounded-md p-2'>{productSearchKeyword}</div> : <SearchBar onSearch={setProductSearchTermThrottled} />}

                </div>
                <div className='w-[30%] basis-[30%]'>
                  {productSearchKeyword ?
                    <button type='button' className='bg-red-600 text-white px-2 py-2 rounded-md' onClick={clearProductSearch}>Clear Product</button>
                    : <></>}
                </div>

              </div>
              {productsData && productsTotal > 0 && !productSearchKeyword && <div className='border-gray-200 mx-2 px-3 py-2 border w-full max-h-[300px] overflow-y-auto'>
                {productsData && productsData.map((product: any, index: number) => (<div key={index} className='border-t-gray-200 py-2 border-t'>
                  <span onClick={() => { setProduct(product.denier + ',' + product.lotNo); setProductSearchQuery(product.denier + ',' + product.lotNo) }}> {product.lotNo} {product.denier}</span>
                </div>))}
              </div>}
            </>
          }


          {
            searchColumn === 'businessName' &&
            <>
              <div className='flex justify-center w-full items-center gap-x-2'>
                <div className='w-[70%] basis-[70%] px-2'>
                  {productSearchKeyword ? <div className='w-full border border-gray-400 rounded-md p-2'>{productSearchKeyword}</div> : <SearchBar onSearch={setProductSearchTermThrottled} />}

                </div>
                <div className='w-[30%] basis-[30%]'>
                  {productSearchKeyword ?
                    <button type='button' className='bg-red-600 text-white px-2 py-2 rounded-md' onClick={clearProductSearch}>Clear Customer</button>
                    : <></>}
                </div>

              </div>
              {productsData && productsTotal > 0 && !productSearchKeyword && <div className='border-gray-200 mx-2 px-3 py-2 border w-full max-h-[300px] overflow-y-auto'>
                {productsData && productsData.map((product: any, index: number) => (<div key={index} className='border-t-gray-200 py-2 border-t'>
                  <span onClick={() => { setProduct(product.businessName); setProductSearchQuery(product.businessName) }}> {product.businessName}</span>
                </div>))}
              </div>}
            </>
          }



          <FormControl sx={{ m: 1, minWidth: 120 }} className='w-full'>
            <InputLabel id="demo-select-small-label">Group By</InputLabel>
            <Select
              labelId="demo-select-small-label"
              id="demo-select-small"
              value={groupBy}
              label="groupBy"
              placeholder='Select Group By'
              onChange={(e: any) => { setGroupBy(e.target.value) }}
            >

              <MenuItem value="name">Customer Name</MenuItem>
              <MenuItem value="denier">Product</MenuItem>
            </Select>
          </FormControl>


          <FormControl sx={{ m: 1, minWidth: 120 }} className='w-full'>
            <InputLabel id="demo-select-small-label">Report Period</InputLabel>
            <Select
              labelId="demo-select-small-label"
              id="demo-select-small"
              value={reportPeriod}
              label="Age"
              onChange={(e) => { setReportPeriod(e.target.value) }}
            >
              <MenuItem value="currentMonth">
                Current Month
              </MenuItem>
              <MenuItem value="previousMonth">Last Month</MenuItem>
              <MenuItem value="customDate">Custom Date</MenuItem>
              <MenuItem value="currentYear">Current Year</MenuItem>
              <MenuItem value="previousYear">Last Year</MenuItem>
            </Select>
          </FormControl>



          {
            reportPeriod && reportPeriod === 'customDate' && (
              <div className='flex  w-full justify-start gap-2  items-start m-1'>
                <LocalizationProvider dateAdapter={AdapterDayjs} >
                  <DemoContainer components={['DatePicker']} >
                    <DatePicker label="Start Date" className="w-full" value={start_date} onChange={(e) => { setStartDate(e) }} />
                  </DemoContainer>
                </LocalizationProvider>

                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer components={['DatePicker']}>
                    <DatePicker label="End Date" className="w-full" value={end_date} onChange={(e) => { setEndDate(e) }} />
                  </DemoContainer>
                </LocalizationProvider>
              </div>
            )
          }

          {/* Add any content you want inside the drawer here */}
        </div>

        {
          (groupBy !== null || searchColumn !== 'businessName' || reportPeriod !== 'currentYear') ?
            <div className='flex items-center justify-end p-4'>
              <button type='button' className='bg-red-500 text-white p-2 rounded-md' onClick={reset_filters}>Clear Filters</button>
            </div> : <></>
        }

      </Drawer>
      <Grid container justifyContent="space-between" spacing={8}>
        <Grid item>
          <div className='flex items-center justify-start gap-x-2'>

            <SearchBar onSearch={setSearchTermThrottled} />

            {
              tableName === 'Orders' && (
                <button type="button" className='bg-blue-500 text-white p-2 rounded-md' onClick={toggleDrawer(true)}>
                  Filters
                </button>
              )
            }




          </div>



        </Grid>


        {addButtonLabel && (

          <Grid item columnSpacing={100} className='flex items-center justify-end gap-x-2'>
            {
              tableName === 'Orders' && (
                <button type="button" className='bg-black capitalize text-white px-2 py-[6px] rounded-md' onClick={exportToXlsx}>
                  Export table To Excel
                </button>
              )
            }
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
        {
          groupBy ?
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
                      <span className='text-[12px]'>  {column.label}</span>
                    </WhiteTextTableCell>
                  ))}
                  {actionButtons && (
                    <WhiteTextTableCell
                      className="w-40 text-[12px]"
                      style={{ textAlign: 'center' }}
                      key={columns.length + 1}
                    >
                      <span className='text-[12px]'>
                        Actions
                      </span>
                    </WhiteTextTableCell>
                  )}
                </StyledTableRow>
              </EnhancedTableHead>
              <TableBody>
                {isLoading ? (
                  <StyledTableRow>
                    <TableCell colSpan={columns.length + 1 + (actionButtons ? 1 : 0)}>
                      Loading...
                    </TableCell>
                  </StyledTableRow>
                ) : (
                  data?.length > 0 && data?.map((group: any) => (
                    <React.Fragment key={group.group_value}>
                      <StyledTableRow>
                        <TableCell colSpan={columns.length + 1 + (actionButtons ? 1 : 0)}>
                          <div className='flex justify-between items-center text-sm'>
                            <span className='text-[14px] fond-bold'>Grouped By: {group.group_value}</span>
                            <button type="button" className='bg-blue-500 text-white p-2 rounded-md' onClick={() => { generate_pdf(group) }}>
                              Create Group Invoice
                            </button>
                          </div>
                        </TableCell>

                      </StyledTableRow>
                      {group.orders?.map((item: any) => (
                        <StyledTableRow key={String(item.id)}>
                          {additionalColumn && (
                            <TableCell>
                              {additionalColumn.type === 'radio' && (
                                <Radio
                                  checked={additionalColumn.valueGetter?.(item)}
                                  onChange={(e) => additionalColumn.onChange?.(item.id, e.target.checked)}
                                />
                              )}
                              {additionalColumn.type === 'checkbox' && (
                                <Checkbox
                                  checked={additionalColumn.valueGetter?.(item)}
                                  onChange={(e) => additionalColumn.onChange?.(item.id, e.target.checked)}
                                />
                              )}
                            </TableCell>
                          )}
                          {columns.map((column: any) => (
                            <TableCell key={column.field}>
                              <span className='text-[10px]'> {getColumnValue(item, column)}</span>
                            </TableCell>
                          ))}
                          {actionButtons && (
                            <TableCell className="w-40" style={{ textAlign: 'center' }}>
                              {actionButtons.map((button, buttonsIndex) => (
                                <StyledIcon
                                  title={button.title}
                                  key={buttonsIndex}
                                  disabled={button.disabled || isLoading}
                                  onClick={() => button.onClick(item.id, item)}
                                >
                                  {button.icon}
                                </StyledIcon>
                              ))}
                            </TableCell>
                          )}
                        </StyledTableRow>
                      ))}
                    </React.Fragment>
                  ))
                )}
              </TableBody>
            </Table> :
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
                      <span className='text-[12px]'>  {column.label}</span>
                    </WhiteTextTableCell>
                  ))}
                  {actionButtons && (
                    <WhiteTextTableCell
                      className="w-40 text-[12px]"
                      style={{ textAlign: 'center' }}
                      key={columns.length + 1}
                    >
                      <span className='text-[12px]'>
                        Actions
                      </span>
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
                  data?.map((item: any) => (
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
                          <span className='text-[10px]'> {getColumnValue(item, column)}</span>

                        </TableCell>
                      ))}
                      {actionButtons && (
                        <TableCell className="w-40" style={{ textAlign: 'center' }}>
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

        }

      </StyledTableContainer>

      <TablePagination
        rowsPerPageOptions={[10, 20, 50, 100, 500, 1000]}
        component="div"
        count={total || 0}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      {
        groupBy ? <></> :
          <p>Total Quantity: {getTotalQuantity()}</p>}


      {groupBy && grouped_children.length > 0 &&
        <FullScreenModal
          open={isModalOpen}
          onClose={handleCloseModal}

          orders={grouped_children}
        >
          {/* Modal content goes here */}
          <p>This is the content inside the modal.</p>
        </FullScreenModal>
      }
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
