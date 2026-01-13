import React from 'react';
import type { InvoiceTemplateProps } from './types';

export const CompactTemplate: React.FC<InvoiceTemplateProps> = ({ data, client }) => {
  return (
    <div className="bg-white text-slate-900 p-6 w-full h-full font-sans leading-tight text-[11px] print:p-0" style={{ aspectRatio: '1/1.414' }}>
      {/* Ultra-Compact Header */}
      <div className="flex justify-between items-center border-b border-slate-200 pb-4 mb-4">
        <div>
          <h1 className="text-lg font-bold tracking-tight text-slate-900">INVOICE</h1>
          <p className="text-slate-400 font-medium">#{data.id || 'DRAFT'}</p>
        </div>
        <div className="text-right">
          <p className="font-bold">Micro Inc.</p>
          <p className="text-slate-500 text-[10px]">billing@micro.so</p>
        </div>
      </div>

      {/* Bill To & Dates Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-slate-50 p-3 rounded-md border border-slate-100">
          <h3 className="text-[9px] font-bold uppercase text-slate-400 mb-1">Bill To</h3>
          <p className="font-bold">{client.name}</p>
          <p className="text-slate-500 text-[10px] leading-snug whitespace-pre-line">{client.address}</p>
        </div>
        <div className="grid grid-cols-2 gap-2 text-right">
          <div>
            <h3 className="text-[9px] font-bold uppercase text-slate-400 mb-1">Issued</h3>
            <p className="font-medium">{data.date || new Date().toLocaleDateString()}</p>
          </div>
          <div>
            <h3 className="text-[9px] font-bold uppercase text-slate-400 mb-1">Due</h3>
            <p className="font-bold underline">{data.due_date}</p>
          </div>
        </div>
      </div>

      {/* Structured Item Table - Optimized for space */}
      <div className="mb-4">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-slate-900 text-white">
              <th className="p-2 text-left text-[9px] font-bold uppercase tracking-wider">Description</th>
              <th className="p-2 text-center text-[9px] font-bold uppercase tracking-wider w-12">Qty</th>
              <th className="p-2 text-right text-[9px] font-bold uppercase tracking-wider w-20">Rate</th>
              <th className="p-2 text-right text-[9px] font-bold uppercase tracking-wider w-24">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 border border-slate-100">
            {data.items.map((item, idx) => (
              <tr key={idx}>
                <td className="p-2 font-medium text-slate-800">{item.description}</td>
                <td className="p-2 text-center text-slate-500">{item.quantity}</td>
                <td className="p-2 text-right text-slate-500">${item.unit_price.toFixed(2)}</td>
                <td className="p-2 text-right font-bold text-slate-900">
                  ${(item.quantity * item.unit_price).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Financial Summary */}
      <div className="flex justify-end mb-6">
        <div className="w-48 space-y-1 py-2 border-t border-slate-200">
          <div className="flex justify-between text-slate-500 text-[10px]">
            <span>Subtotal</span>
            <span>${data.subtotal?.toFixed(2) || data.total.toFixed(2)}</span>
          </div>
          {data.tax_amount !== undefined && data.tax_amount > 0 && (
            <div className="flex justify-between text-slate-500 text-[10px]">
              <span>Tax/VAT</span>
              <span>+${data.tax_amount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between pt-2 mt-1 border-t border-slate-900 font-bold text-sm">
            <span>Total</span>
            <span>${data.total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Payment & Notes - Bottom Fixed */}
      <div className="mt-auto border-t border-slate-100 pt-4 flex justify-between gap-8">
        <div className="w-1/2">
          <h4 className="text-[9px] font-bold text-slate-900 uppercase tracking-widest mb-1">Payment Instructions</h4>
          <p className="text-[10px] text-slate-500 leading-snug">Transfer to Bank Account: 1234-5678-90. SWIFT: MSYTUS33. Please include invoice number in reference.</p>
        </div>
        <div className="w-1/2 text-right">
          <h4 className="text-[9px] font-bold text-slate-900 uppercase tracking-widest mb-1">Notes</h4>
          <p className="text-[10px] text-slate-500 italic">{data.notes || 'Thank you for your business.'}</p>
        </div>
      </div>
    </div>
  );
};
