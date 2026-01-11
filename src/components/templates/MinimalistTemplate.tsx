import React from 'react';
import type { InvoiceTemplateProps } from './types';

export const MinimalistTemplate: React.FC<InvoiceTemplateProps> = ({ data, client }) => {
  return (
    <div className="bg-white text-gray-900 p-8 w-full h-full font-sans text-sm" style={{ aspectRatio: '1/1.414' }}>
      {/* Header */}
      <div className="flex justify-between items-start border-b border-gray-100 pb-8 mb-8">
        <div>
          <h1 className="text-2xl font-light tracking-wide text-gray-900 mb-1">INVOICE</h1>
          <p className="text-gray-400">#{data.id || 'DRAFT'}</p>
        </div>
        <div className="text-right text-gray-500">
          <p className="font-medium text-gray-900">Micro Inc.</p>
          <p>123 Tech Blvd</p>
          <p>San Francisco, CA 94107</p>
        </div>
      </div>

      {/* Details */}
      <div className="grid grid-cols-2 gap-8 mb-12">
        <div>
          <p className="text-xs uppercase tracking-wider text-gray-400 mb-2">Billed To</p>
          <p className="font-medium text-gray-900">{client.name}</p>
          <p className="text-gray-500">{client.email}</p>
          <p className="text-gray-500 whitespace-pre-line">{client.address}</p>
        </div>
        <div className="text-right">
          <div className="mb-4">
            <p className="text-xs uppercase tracking-wider text-gray-400 mb-1">Due Date</p>
            <p className="font-medium">{data.due_date}</p>
          </div>
          {data.date && (
            <div>
              <p className="text-xs uppercase tracking-wider text-gray-400 mb-1">Issued</p>
              <p className="font-medium">{data.date}</p>
            </div>
          )}
        </div>
      </div>

      {/* Items */}
      <div className="mb-8">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 text-left">
              <th className="py-2 text-xs uppercase tracking-wider text-gray-400 font-medium">Description</th>
              <th className="py-2 text-xs uppercase tracking-wider text-gray-400 font-medium text-right">Qty</th>
              <th className="py-2 text-xs uppercase tracking-wider text-gray-400 font-medium text-right">Price</th>
              <th className="py-2 text-xs uppercase tracking-wider text-gray-400 font-medium text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {data.items.map((item, idx) => (
              <tr key={idx}>
                <td className="py-4 text-gray-700">{item.description}</td>
                <td className="py-4 text-right text-gray-700">{item.quantity}</td>
                <td className="py-4 text-right text-gray-700">${item.unit_price.toFixed(2)}</td>
                <td className="py-4 text-right font-medium text-gray-900">
                  ${(item.quantity * item.unit_price).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Total */}
      <div className="flex justify-end pt-4 border-t border-gray-100">
        <div className="w-48">
          <div className="flex justify-between items-center py-2">
            <span className="text-gray-500">Total</span>
            <span className="text-2xl font-light text-gray-900">${data.total.toFixed(2)}</span>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <div className="mt-12 pt-8 border-t border-gray-50 text-center text-xs text-gray-400">
        <p>Thank you for your business.</p>
      </div>
    </div>
  );
};
