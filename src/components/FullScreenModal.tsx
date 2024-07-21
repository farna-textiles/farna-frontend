import React, { useRef } from 'react';
import { Dialog, DialogTitle, DialogContent, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/material/styles';
import { format } from 'date-fns';
import ReactToPrint from 'react-to-print';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';

const FullScreenDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialog-paper': {
        width: '100vw',
        height: '100vh',
        margin: 0,
        borderRadius: 0,
    },
}));

interface FullScreenModalProps {
    open: boolean;
    onClose: () => void;

    orders: any[];
    children: React.ReactNode;
}

const FullScreenModal: React.FC<FullScreenModalProps> = ({ open, onClose, orders }) => {
    const componentRef = useRef(null);

    const formatDate = (dateString: string): string => {
        if (dateString) {
            const date = new Date(dateString);
            return format(date, 'dd/MM/yyyy');
        }
        else {
            return 'N/A'
        }

    };


    const generatePDF = () => {
        const invoiceDiv = document.getElementById('pdf-invoice');
        const originalStyle = invoiceDiv?.getAttribute('style');

        invoiceDiv?.setAttribute(
            'style',
            'background-color: white; padding: 4px; width: 575pt; height: auto; font-family: serif; overflow-y: auto;'
        );

        // Prompt the user to enter a file name
        const fileName = prompt('Enter the file name', 'report');
        if (!fileName) {
            // If user cancels the prompt, exit the function
            invoiceDiv?.setAttribute('style', originalStyle || '');
            return;
        }

        // Inform the user about browser settings
        alert('If you are not prompted to save the file, please adjust your browser settings to ask where to save each file before downloading.');

        // eslint-disable-next-line new-cap
        const report = new jsPDF('portrait', 'pt', 'a4');
        const invoice = document.querySelector('#pdf-invoice');
        if (!invoice) return;
        report.html(invoice as HTMLElement, {
            callback(pdf) {
                pdf.save(`${fileName}.pdf`);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                invoiceDiv?.setAttribute('style', originalStyle!);
            },
            x: 10,
            y: 10,
            margin: [0, 0, 0, 0],
            html2canvas: { scale: 0.75 },
        });
    };

    const getTotalAmount = () => {
        let totalAmount: number = 0;

        orders.forEach((obj) => {
            // Calculate total amount for the current order
            let totalAmountForOrder = parseFloat(obj.orderProducts[0].quantity) * parseFloat(obj.orderProducts[0].rate);

            // Accumulate the total amount
            totalAmount += totalAmountForOrder;
        });

        // Return the total amount rounded to 2 decimal places
        return parseFloat(totalAmount.toFixed(2));
    };
    const getTotalQuantity = () => {
        let totalQuantity: number = 0;

        orders.forEach((obj) => {
            // Calculate total amount for the current order
            let totalQuantityForOrder = parseFloat(obj.orderProducts[0].quantity)

            // Accumulate the total amount
            totalQuantity += totalQuantityForOrder;
        });

        // Return the total amount rounded to 2 decimal places
        return parseFloat(totalQuantity.toFixed(2));
    };



    const exportToXlsx = (orders: any[]) => {
        const totalAmount = getTotalAmount();
        const totalQuantity = getTotalQuantity();
        // Create a new workbook and a worksheet
        const workbook = XLSX.utils.book_new();
        const worksheetData = [];

        // Add column headers
        worksheetData.push([
            { v: 'Transaction No.', s: { alignment: { horizontal: 'left' } } },
            { v: 'Date', s: { alignment: { horizontal: 'left' } } },
            { v: 'Product', s: { alignment: { horizontal: 'left' } } },
            { v: 'Description', s: { alignment: { horizontal: 'left' } } },
            { v: 'PI #', s: { alignment: { horizontal: 'left' } } },
            { v: 'QTY', s: { alignment: { horizontal: 'left' } } },
            { v: 'Salesprice', s: { alignment: { horizontal: 'left' } } },
            { v: 'Amount', s: { alignment: { horizontal: 'left' } } }
        ]);

        // Add rows data
        orders.forEach((product: any) => {
            worksheetData.push([
                { v: product.id, s: { alignment: { horizontal: 'left' } } },
                { v: formatDate(product?.validity), s: { alignment: { horizontal: 'left' } } },
                { v: `${product?.orderProducts[0]?.product?.denier} Lot # ${product?.orderProducts[0]?.product?.lotNo}`, s: { alignment: { horizontal: 'left' } } },
                { v: product?.orderProducts[0]?.product?.endUses.map((endUse: any) => endUse.name).join(' | '), s: { alignment: { horizontal: 'left' } } },
                { v: product?.PI_number, s: { alignment: { horizontal: 'left' } } },
                { v: product?.orderProducts[0]?.quantity, s: { alignment: { horizontal: 'left' } } },
                { v: product?.orderProducts[0]?.rate, s: { alignment: { horizontal: 'left' } } },
                { v: (product?.orderProducts[0]?.quantity * product?.orderProducts[0]?.rate).toFixed(2), s: { alignment: { horizontal: 'left' } } }
            ]);
        });


        worksheetData.push([
            '', '', '', '', '', `Total Quantity: ${totalQuantity.toFixed(2)}`, '',
            `Total Amount: ${orders[0]?.currencyUnit?.symbol || ''} ${totalAmount.toFixed(2)}`
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
        <FullScreenDialog
            fullScreen
            open={open}
            onClose={onClose}
        >
            <DialogTitle>

                <IconButton
                    edge="end"
                    color="inherit"
                    onClick={onClose}
                    aria-label="close"
                    sx={{ position: 'absolute', right: 8, top: 8 }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <div
                    ref={componentRef}
                    className="bg-white w-full h-auto font-serif overflow-y-auto p-4"
                    id="pdf-invoice"
                >
                    <div className="flex items-center mb-12 leading-[1.2]">
                        <div className="text-3xl font-bold mb-[6rem] text-[32pt]">
                            FARNA TEXTILES
                        </div>
                        <img
                            src="/farna-logo.png"
                            alt="Farna Textiles Logo"
                            className="h-15 w-auto ml-[12rem]"
                        />
                    </div>
                    <div className="text-2xl text-green-600 mb-8">REQUEST FOR P.I</div>
                    <div className="flex justify-between mb-8">
                        <div>
                            <div className="text-2xs text-gray-400">Bill TO </div>
                            <div className="text-base">{orders[0].customer.businessName}</div>
                        </div>
                        <div>
                            <div className="text-left mb-6 flex">
                                <div className="text-2xs text-gray-400">DATE</div>
                                <div className="text-base ml-3">{formatDate(new Date().toString())}</div>
                            </div>
                            <div className="text-2xs text-gray-400">PAYMENT METHOD</div>
                            <div className="text-base">{orders[0].paymentType.name}</div>
                        </div>
                    </div>
                    <div className="flex justify-between mb-8">
                        <div>
                            <div className="text-2xs text-gray-400">VALIDITY</div>
                            <div className="text-base uppercase text-black-500">{formatDate(new Date().toString())}</div>
                        </div>
                        <div>
                            <div className="text-2xs text-gray-400">SHIPMENT</div>
                            <div className="text-base uppercase text-black-500">
                                {orders[0].shipmentType}
                            </div>
                        </div>
                        <div>
                            <div className="text-2xs text-gray-400">P.I NUMBER</div>
                            <div className="text-base uppercase text-black-500">
                                {orders[0].PI_number}
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className='flex flex-col mb-8 justify-start items-start'>
                            <div className="text-2xs text-gray-400">Customer Notes</div>
                            <div className="text-base uppercase text-black-500">
                                {orders[0].note ? orders[0].note : 'No Customer Notes Available'}
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center justify-between  mb-2 text-green-600 bg-gray-200 p-2 ">
                        <div className="w-1/6 text-[12px]  font-medium">Transaction No.</div>
                        <div className="w-1/6  text-[12px] font-medium">Date</div>
                        <div className="w-1/3  text-[12px] font-medium">Product</div>

                        <div className="w-1/6 text-[12px] font-medium">Description</div>
                        <div className="w-1/6 text-[12px] font-medium">PI #</div>
                        <div className="w-1/6 text-[12px] font-medium">QTY</div>
                        <div className="w-1/6 text-[12px] font-medium">Salesprice</div>
                        <div className="w-1/6 text-[12px] font-medium">Amount</div>
                    </div>
                    {orders.map((product, index) => (
                        <div key={index} className="flex justify-between mb-4">
                            <div className="w-1/6 text-[12px] ml-1">{product.id}</div>
                            <div className="w-1/6 text-[12px]">
                                {formatDate(product?.validity)}

                            </div>
                            <div className="w-1/3 text-[12px]">
                                {`${product?.orderProducts[0]?.product?.denier} `}
                                Lot #  {`${product?.orderProducts[0]?.product?.lotNo}`}
                            </div>

                            <div className="w-1/6">
                                {product?.orderProducts[0]?.product?.endUses.map((endUse: any, index: number) => (
                                    <span key={endUse.name} className='text-[12px]'>
                                        {endUse.name}
                                        {index !== product?.orderProducts[0]?.product?.endUses.length - 1 && ' | '}
                                    </span>
                                ))}
                            </div>
                            <div className="w-1/6 text-[12px]">{product?.PI_number}</div>
                            <div className="w-1/6 text-[12px]">{product?.orderProducts[0]?.quantity}</div>
                            <div className="w-1/6 text-[12px]">{product?.orderProducts[0]?.rate}</div>
                            <div className="w-1/6 text-[12px]">{(product?.orderProducts[0]?.quantity * product?.orderProducts[0]?.rate).toFixed(2)}</div>
                        </div>
                    ))}

                    <hr className="mt-6 border-t border-dashed border-gray-400 w-full" />

                    <div className="mt-4 flex flex-col justify-end">
                        <div className='flex justify-end gap-x-4'>
                            <div className="text-lg text-gray-400 ">Total Quantity</div>
                            <div className="text-1xl w-[200px]">
                                {getTotalQuantity()}
                            </div>
                        </div>
                        <div className='flex justify-end gap-x-4'>
                            <div className="text-lg text-gray-400 ">Total Amount</div>
                            <div className="text-1xl w-[200px]">
                                {orders[0].currencyUnit.symbol} {getTotalAmount()}
                            </div>
                        </div>
                    </div>
                    <hr className="mt-2 border-t border-dashed border-gray-400 w-[25rem] ml-auto" />

                    <div className="text-xs text-gray-400 text-center mt-4 pb-4">
                        Page 1 of 1
                    </div>
                </div>
                <div className="flex justify-end mt-6  space-x-4">
                    <ReactToPrint
                        // eslint-disable-next-line react/no-unstable-nested-components
                        trigger={() => (
                            <button
                                type="button"
                                className="px-4 py-2 bg-blue-500 text-white rounded-md"
                            >
                                Print PDF
                            </button>
                        )}
                        content={() => componentRef.current}
                    />
                    <button
                        type="button"
                        onClick={generatePDF}
                        className="px-4 py-2 bg-red-500 text-white rounded-md"
                    >
                        Download PDF
                    </button>

                    <button onClick={() => exportToXlsx(orders)} className="px-4 py-2 bg-blue-500 text-white rounded">
                        Export to Excel
                    </button>
                </div>
            </DialogContent>
        </FullScreenDialog >
    );
};

export default FullScreenModal;
