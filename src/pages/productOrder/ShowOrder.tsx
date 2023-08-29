import React, { useRef, useState } from 'react';
import { useParams } from 'react-router';
import jsPDF from 'jspdf';
// eslint-disable-next-line import/no-extraneous-dependencies
import ReactToPrint from 'react-to-print';
import { useOrder } from '../../hooks/useOrder';
import { Order } from '../../interfaces';
import Invoice from '../../components/Invoice';

const ShowOrder: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: orderData } = useOrder(parseInt(id as string, 10)) as {
    data: Order;
  };
  const componentRef = useRef(null);

  const [email, setEmail] = useState<string>('');

  const sendEmail = () => {
    // Send the PDF data to the backend here
    console.log('Sending PDF to backend to be emailed to:', email);
  };

  const generatePDF = () => {
    const invoiceDiv = document.getElementById('pdf-invoice');
    const originalStyle = invoiceDiv?.getAttribute('style');

    invoiceDiv?.setAttribute(
      'style',
      'background-color: white; padding: 4px; width: 575pt; height: auto; font-family: serif; overflow-y: auto;'
    );

    // eslint-disable-next-line new-cap
    const report = new jsPDF('portrait', 'pt', 'a4');
    const invoice = document.querySelector('#pdf-invoice');
    if (!invoice) return;
    report.html(invoice as HTMLElement, {
      callback(pdf) {
        pdf.save('report.pdf');
        invoiceDiv?.setAttribute('style', originalStyle!);
      },
      x: 10,
      y: 10,
      margin: [0, 0, 0, 0],
      html2canvas: { scale: 0.75 },
    });
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

        {/* <button
            type="button"
            onClick={() => {
              const emailPrompt = prompt('Enter email to send the invoice');
              if (emailPrompt) {
                setEmail(emailPrompt);
                sendEmail();
              }
            }}
            className="px-4 py-2 bg-green-500 text-white rounded-md"
          >
            Send as Email
          </button> */}
        <button
          type="button"
          onClick={generatePDF}
          className="px-4 py-2 bg-red-500 text-white rounded-md"
        >
          Download PDF
        </button>
      </div>
    </div>
  );
};

export default ShowOrder;
