import React from 'react';
import type { InvoiceTemplateProps } from './types';

export const ProfessionalTemplate: React.FC<InvoiceTemplateProps> = ({ data, client }) => {
  return (
    <div className="bg-white text-slate-800 p-0 w-full h-full font-serif" style={{ aspectRatio: '1/1.414' }}>
      {/* Header Band */}
      <div className="bg-slate-800 text-white p-10 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">INVOICE</h1>
          <p className="text-slate-300 opacity-80 mt-1">#{data.id || 'UNKNOWN'}</p>
        </div>
        <div className="text-right">
          <p className="text-xl font-bold">Micro Inc.</p>
        </div>
      </div>

      <div className="p-10">
        {/* Info Grid */}
        <div className="flex justify-between mb-12">
          <div>
            <h3 className="text-sm font-bold text-slate-500 uppercase mb-2">Bill To</h3>
            <p className="font-bold text-lg text-slate-900">{client.name}</p>
            <p className="text-slate-600">{client.email}</p>
            <p className="text-slate-600 whitespace-pre-line max-w-xs">{client.address}</p>
          </div>
          <div className="text-right">
             <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
               <div className="mb-2">
                  <span className="text-slate-500 text-sm font-medium mr-4">Date Issued:</span>
                  <span className="font-semibold">{data.date || new Date().toLocaleDateString()}</span>
               </div>
               <div>
                  <span className="text-slate-500 text-sm font-medium mr-4">Due Date:</span>
                  <span className="font-semibold text-red-600">{data.due_date}</span>
               </div>
             </div>
          </div>
        </div>

        {/* Table */}
        <table className="w-full mb-8">
          <thead className="bg-slate-100">
            <tr>
              <th className="py-3 px-4 text-left text-sm font-semibold text-slate-700 border-b border-slate-200">Description</th>
              <th className="py-3 px-4 text-center text-sm font-semibold text-slate-700 border-b border-slate-200 w-20">Qty</th>
              <th className="py-3 px-4 text-right text-sm font-semibold text-slate-700 border-b border-slate-200 w-32">Rate</th>
              <th className="py-3 px-4 text-right text-sm font-semibold text-slate-700 border-b border-slate-200 w-32">Amount</th>
            </tr>
          </thead>
          <tbody>
            {data.items.map((item, idx) => (
              <tr key={idx} className="border-b border-slate-100">
                <td className="py-4 px-4 text-slate-700">{item.description}</td>
                <td className="py-4 px-4 text-center text-slate-600 font-mono">{item.quantity}</td>
                <td className="py-4 px-4 text-right text-slate-600 font-mono">${item.unit_price.toFixed(2)}</td>
                <td className="py-4 px-4 text-right font-bold text-slate-800 font-mono">
                  ${(item.quantity * item.unit_price).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Summaries */}
        <div className="flex justify-end">
          <div className="w-1/2 lg:w-1/3">
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-600">Subtotal</span>
              <span className="font-mono font-medium">${data.total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-600">Tax (0%)</span>
              <span className="font-mono font-medium">$0.00</span>
            </div>
            <div className="flex justify-between py-3">
              <span className="text-lg font-bold text-slate-900">Total</span>
              <span className="text-xl font-bold text-slate-800 font-mono">${data.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="mt-16 text-center text-slate-500 text-sm">
          <p>Payment is due within 30 days.</p>
          <p>Please make checks payable to Micro Inc.</p>
        </div>
      </div>
    </div>
  );
};
