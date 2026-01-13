import React from 'react';
import type { InvoiceTemplateProps } from './types';

export const ModernMinimalTemplate: React.FC<InvoiceTemplateProps> = ({ data, client }) => {
  return (
    <div className="bg-white text-black p-12 w-full h-full font-sans leading-relaxed text-sm print:p-0" style={{ aspectRatio: '1/1.414' }}>
      {/* Header Section */}
      <div className="flex justify-between items-start mb-16">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tighter uppercase">Invoice</h1>
          <p className="text-gray-500 font-medium">#{data.id || 'DRAFT'}</p>
        </div>
        <div className="text-right">
          <h2 className="font-bold text-lg">Micro SaaS Inc.</h2>
          <p className="text-gray-500">billing@micro.so</p>
          <p className="text-gray-500">101 Modern Way, Suite 500</p>
          <p className="text-gray-500">Austin, TX 78701</p>
        </div>
      </div>

      {/* Bill To & Date Section */}
      <div className="flex justify-between mb-20">
        <div className="max-w-[240px]">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4">Bill To</h3>
          <p className="font-bold text-base mb-1">{client.name}</p>
          <p className="text-gray-500 leading-relaxed whitespace-pre-line">{client.address}</p>
          <p className="text-gray-500 mt-2">{client.email}</p>
        </div>
        <div className="text-right space-y-6">
          <div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1">Issue Date</h3>
            <p className="font-medium">{data.date || new Date().toLocaleDateString()}</p>
          </div>
          <div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1">Due Date</h3>
            <p className="font-medium underline underline-offset-4">{data.due_date}</p>
          </div>
        </div>
      </div>

      {/* Item Table */}
      <div className="mb-20">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b-2 border-black">
              <th className="py-4 text-left text-[10px] font-black uppercase tracking-[0.2em]">Item Description</th>
              <th className="py-4 text-center text-[10px] font-black uppercase tracking-[0.2em] w-20">Qty</th>
              <th className="py-4 text-right text-[10px] font-black uppercase tracking-[0.2em] w-32">Rate</th>
              <th className="py-4 text-right text-[10px] font-black uppercase tracking-[0.2em] w-32">Amount</th>
            </tr>
          </thead>
          <tbody>
            {data.items.map((item, idx) => (
              <tr key={idx} className="border-b border-gray-100">
                <td className="py-6 font-medium text-black">{item.description}</td>
                <td className="py-6 text-center text-gray-500 font-mono">{item.quantity}</td>
                <td className="py-6 text-right text-gray-500 font-mono">${item.unit_price.toFixed(2)}</td>
                <td className="py-6 text-right font-bold text-black font-mono">
                  ${(item.quantity * item.unit_price).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary Footer */}
      <div className="flex justify-end mb-20">
        <div className="w-72 space-y-3">
          <div className="flex justify-between text-gray-500">
            <span>Subtotal</span>
            <span>${data.subtotal?.toFixed(2) || data.total.toFixed(2)}</span>
          </div>
          {data.discount !== undefined && data.discount > 0 && (
            <div className="flex justify-between text-gray-500">
              <span>Discount</span>
              <span>-${data.discount.toFixed(2)}</span>
            </div>
          )}
          {data.tax_amount !== undefined && data.tax_amount > 0 && (
            <div className="flex justify-between text-gray-500">
              <span>Tax</span>
              <span>+${data.tax_amount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between py-4 border-t-2 border-black font-black text-lg">
            <span>Total</span>
            <span>${data.total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Payment Terms */}
      <div className="mt-auto pt-16 border-t border-gray-100">
        <div className="grid grid-cols-2 gap-12 text-[11px] leading-relaxed text-gray-400">
          <div>
            <h4 className="font-black text-black uppercase tracking-widest mb-2">Payment Terms</h4>
            <p>Please pay within 15 days of receiving this invoice. Bank transfers and major credit cards accepted. For queries, contact billing@micro.so</p>
          </div>
          <div className="text-right">
            <h4 className="font-black text-black uppercase tracking-widest mb-2">Notes</h4>
            <p className="whitespace-pre-line">{data.notes || 'Thank you for choosing Micro SaaS.'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
