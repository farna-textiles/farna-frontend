import React from 'react';
import { Order } from '../interfaces';
import { format } from 'date-fns';

const Invoice = React.forwardRef<HTMLDivElement, { order: Order }>(
  (
    {
      order: {
        id,
        orderProducts,
        customer,
        salesReceiptDate,
        paymentType,
        validity,
        shipmentType,
        currencyUnit,
        PI_number,
        note
      },
    },
    ref
  ) => {
    const totalAmount = orderProducts.reduce(
      (total, product) => total + product.quantity * product.rate,
      0
    );

    const formatDate = (dateString: string): string => {
      const date = new Date(dateString);
      return format(date, 'dd/MM/yyyy');
    };

    return (
      <div
        ref={ref}
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
            <div className="text-base">{customer.businessName}</div>
          </div>
          <div>
            <div className="text-left mb-6 flex">
              <div className="text-2xs text-gray-400">DATE</div>
              <div className="text-base ml-3">{formatDate(salesReceiptDate)}</div>
            </div>
            <div className="text-2xs text-gray-400">PAYMENT METHOD</div>
            <div className="text-base">{paymentType.name}</div>
          </div>
        </div>
        <div className="flex justify-between mb-8">
          <div>
            <div className="text-2xs text-gray-400">VALIDITY</div>
            <div className="text-base uppercase text-black-500">{formatDate(validity)}</div>
          </div>
          <div>
            <div className="text-2xs text-gray-400">SHIPMENT</div>
            <div className="text-base uppercase text-black-500">
              {shipmentType}
            </div>
          </div>
          <div>
            <div className="text-2xs text-gray-400">P.I NUMBER</div>
            <div className="text-base uppercase text-black-500">
              {PI_number}
            </div>
          </div>
        </div>
        <div>
          {note &&
            <div className='flex flex-col mb-8 justify-start items-start'>
              <div className="text-2xs text-gray-400">Customer Notes</div>
              <div className="text-base uppercase text-black-500">
                {note}
              </div>
            </div>
          }
        </div>
        <div className="flex items-center justify-between  mb-2 text-green-600 bg-gray-200 p-2 ">
          <div className="w-1/6 text-[12px]  font-medium">Order ID.</div>
          <div className="w-1/6  text-[12px] font-medium">Date</div>
          <div className="w-1/6  text-[12px] font-medium">Product</div>
          <div className="w-1/6 text-[12px] font-medium">Lot #</div>
          <div className="w-1/6 text-[12px] font-medium">Description</div>
          <div className="w-1/6 text-[12px] font-medium">PI #</div>
          <div className="w-1/6 text-[12px] font-medium">QTY</div>
          <div className="w-1/6 text-[12px] font-medium">Salesprice</div>
          <div className="w-1/6 text-[12px] font-medium">Amount</div>
        </div>
        {orderProducts.map(({ product, quantity, rate }, index) => (
          <div key={index} className="flex justify-between mb-4">
            <div className="w-1/6 text-[12px] ml-1">{id}</div>
            <div className="w-1/6 text-[12px]">
              {formatDate(validity)}

            </div>
            <div className="w-1/6 text-[12px]">
              {`${product.denier}`}
            </div>
            <div className="w-1/6 text-[12px]">
              {`${product.lotNo}`}
            </div>
            <div className="w-1/6">
              {product.endUses.map((endUse, index) => (
                <span key={endUse.name} className='text-[12px]'>
                  {endUse.name}
                  {index !== product.endUses.length - 1 && ' | '}
                </span>
              ))}
            </div>
            <div className="w-1/6 text-[12px]">{PI_number}</div>
            <div className="w-1/6 text-[12px]">{quantity}</div>
            <div className="w-1/6 text-[12px]">{rate}</div>
            <div className="w-1/6 text-[12px]">{(quantity * rate).toFixed(2)}</div>
          </div>
        ))}

        <hr className="mt-6 border-t border-dashed border-gray-400 w-full" />
        <div className="mt-4 flex justify-end">
          <div className="text-lg text-gray-400 pr-[16rem]">TOTAL</div>
          <div className="text-1xl">
            {currencyUnit.symbol} {totalAmount.toFixed(2)}
          </div>
        </div>
        <hr className="mt-2 border-t border-dashed border-gray-400 w-[25rem] ml-auto" />

        <div className="text-xs text-gray-400 text-center mt-4 pb-4">
          Page 1 of 1
        </div>
      </div>
    );
  }
);
Invoice.displayName = 'Invoice';

export default Invoice;
