import React, { useRef } from 'react';
import { useParams } from 'react-router';
import jsPDF from 'jspdf';
import ReactToPrint from 'react-to-print';
import { useOrder } from '../../hooks/useOrder';
import { Order } from '../../interfaces';
import Invoice from '../../components/Invoice';
import * as XLSX from 'xlsx';
import { format } from 'date-fns';
const ShowOrder: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: orderData } = useOrder(parseInt(id as string, 10)) as {
    data: Order;
  };
  const componentRef = useRef(null);

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


  // Calculate total amount
  const getTotalAmount = () => {
    let totalAmount: number = 0;

    if (orderData && orderData.orderProducts) {
      orderData.orderProducts.forEach((product: any) => {
        let totalAmountForOrder = parseFloat(product.quantity) * parseFloat(product.rate);
        totalAmount += totalAmountForOrder;
      });
    }

    return parseFloat(totalAmount.toFixed(2));
  };


  // Calculate total quantity
  const getTotalQuantity = () => {
    let totalQuantity: number = 0;

    if (orderData && orderData.orderProducts) {
      orderData.orderProducts.forEach((product: any) => {
        let totalQuantityForOrder = parseFloat(product.quantity);
        totalQuantity += totalQuantityForOrder;
      });
    }

    return parseFloat(totalQuantity.toFixed(2));
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
      { v: 'Description', s: { alignment: { horizontal: 'left' } } },
      { v: 'PI #', s: { alignment: { horizontal: 'left' } } },
      { v: 'QTY', s: { alignment: { horizontal: 'left' } } },
      { v: 'Salesprice', s: { alignment: { horizontal: 'left' } } },
      { v: 'Amount', s: { alignment: { horizontal: 'left' } } }
    ]);

    // Add rows data
    orderData.orderProducts.forEach((product: any) => {
      worksheetData.push([
        { v: orderData.id, s: { alignment: { horizontal: 'left' } } },
        { v: formatDate(orderData?.validity), s: { alignment: { horizontal: 'left' } } },
        { v: `${product?.product?.denier} Lot # ${product?.product?.lotNo}`, s: { alignment: { horizontal: 'left' } } },
        { v: product?.product?.endUses.map((endUse: any) => endUse.name).join(' | '), s: { alignment: { horizontal: 'left' } } },
        { v: orderData?.PI_number, s: { alignment: { horizontal: 'left' } } },
        { v: product?.quantity, s: { alignment: { horizontal: 'left' } } },
        { v: product?.rate, s: { alignment: { horizontal: 'left' } } },
        { v: (product?.quantity * product?.rate).toFixed(2), s: { alignment: { horizontal: 'left' } } }
      ]);
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
      { v: `Total Amount: ${orderData?.currencyUnit?.symbol || ''} ${totalAmount.toFixed(2)}`, s: { alignment: { horizontal: 'left' } } }
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




  const formatDate = (dateString: string): string => {
    if (dateString) {
      const date = new Date(dateString);
      return format(date, 'dd/MM/yyyy');
    }
    else {
      return 'N/A'
    }

  };


  return (
    <div className="container mx-auto p-4">
      <div className="bg-white p-8 w-full h-auto font-serif overflow-y-auto">
        <Invoice ref={componentRef} order={orderData} />
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

        <button onClick={() => exportToXlsx()} className="px-4 py-2 bg-blue-500 text-white rounded">
          Export to Excel
        </button>
      </div>
    </div>
  );
};

export default ShowOrder;
