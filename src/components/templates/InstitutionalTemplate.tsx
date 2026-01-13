import React from 'react';
import type { InvoiceTemplateProps } from './types';

export const InstitutionalTemplate: React.FC<InvoiceTemplateProps> = ({ data, client }) => {
  return (
    <div className="bg-white text-slate-900 w-full h-full font-sans leading-tight text-[11px] print:p-0 border border-slate-200" style={{ aspectRatio: '1/1.414' }}>
      {/* Authoritative Header */}
      <div className="bg-slate-950 text-white p-10 flex justify-between items-center border-b-4 border-blue-600">
        <div>
          <h1 className="text-xl font-bold tracking-[0.3em] uppercase mb-1">Financial Statement</h1>
          <p className="text-slate-400 font-mono text-[10px]">RECORD REF: INV-{data.id || 'DRAFT'}</p>
        </div>
        <div className="text-right">
          <h2 className="text-lg font-black tracking-tighter">MICRO CORP</h2>
          <p className="text-slate-400 text-[10px] uppercase font-bold tracking-widest">Treasury Operations</p>
        </div>
      </div>

      <div className="p-10 space-y-10">
        {/* Verification & Metadata Section */}
        <div className="grid grid-cols-3 gap-0 border border-slate-200 divide-x divide-slate-200">
          <div className="p-4 bg-slate-50">
            <h3 className="text-[9px] font-black uppercase text-slate-400 mb-2 tracking-widest">Issuance Date</h3>
            <p className="font-bold text-slate-900">{data.date || new Date().toLocaleDateString()}</p>
          </div>
          <div className="p-4 bg-slate-50">
            <h3 className="text-[9px] font-black uppercase text-slate-400 mb-2 tracking-widest">Settlement Due</h3>
            <p className="font-bold text-blue-700 underline decoration-2 underline-offset-4">{data.due_date}</p>
          </div>
          <div className="p-4 bg-slate-50 text-right">
            <h3 className="text-[9px] font-black uppercase text-slate-400 mb-2 tracking-widest">Reference Protocol</h3>
            <p className="font-mono text-slate-600">AUTH-{Math.random().toString(36).substring(7).toUpperCase()}</p>
          </div>
        </div>

        {/* Counterparty Relations */}
        <div className="grid grid-cols-2 gap-10">
          <div className="bg-slate-50/50 p-6 border-l-2 border-slate-950">
            <h3 className="text-[9px] font-black uppercase text-slate-500 mb-3 tracking-widest">Registered Counterparty</h3>
            <p className="text-sm font-black text-slate-950 mb-1">{client.name}</p>
            <p className="text-slate-600 leading-relaxed font-medium whitespace-pre-line">{client.address}</p>
            <p className="text-blue-600 mt-2 font-mono">{client.email}</p>
          </div>
          <div className="text-right space-y-1">
            <h3 className="text-[9px] font-black uppercase text-slate-500 mb-3 tracking-widest">Remittance Authority</h3>
            <p className="font-bold">Micro Systems International</p>
            <p className="text-slate-500">Global Financial Services Division</p>
            <p className="text-slate-500 italic">101 Treasury Plaza, London, EC2V</p>
          </div>
        </div>

        {/* Audit-Ready Table */}
        <div className="mt-8">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-900 text-white">
                <th className="p-3 text-left text-[9px] font-black uppercase tracking-widest border border-slate-900">Classification of Service</th>
                <th className="p-3 text-center text-[9px] font-black uppercase tracking-widest border border-slate-900 w-16">Units</th>
                <th className="p-3 text-right text-[9px] font-black uppercase tracking-widest border border-slate-900 w-24">Unit Rate</th>
                <th className="p-3 text-right text-[9px] font-black uppercase tracking-widest border border-slate-900 w-28">Total Amount</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((item, idx) => (
                <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                  <td className="p-3 border border-slate-100 font-bold text-slate-900">{item.description}</td>
                  <td className="p-3 border border-slate-100 text-center font-mono text-slate-600">{item.quantity}</td>
                  <td className="p-3 border border-slate-100 text-right font-mono text-slate-600">${item.unit_price.toFixed(2)}</td>
                  <td className="p-3 border border-slate-100 text-right font-bold text-slate-900">
                    ${(item.quantity * item.unit_price).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Calculation Summary */}
        <div className="flex justify-end pt-6">
          <div className="w-64 border-t-4 border-slate-950 pt-4 space-y-2">
            <div className="flex justify-between text-slate-500 font-bold uppercase text-[9px] tracking-widest">
              <span>Gross Subtotal</span>
              <span className="text-slate-900 font-mono">${data.subtotal?.toFixed(2) || data.total.toFixed(2)}</span>
            </div>
            {data.discount !== undefined && data.discount > 0 && (
              <div className="flex justify-between text-red-700 font-bold uppercase text-[9px] tracking-widest">
                <span>Deductions Applied</span>
                <span className="font-mono">-${data.discount.toFixed(2)}</span>
              </div>
            )}
            {data.tax_amount !== undefined && data.tax_amount > 0 && (
              <div className="flex justify-between text-slate-500 font-bold uppercase text-[9px] tracking-widest">
                <span>Regulatory Tax Recovery</span>
                <span className="text-slate-900 font-mono">+${data.tax_amount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between py-2 bg-blue-50 border border-blue-100 px-3 text-blue-900 font-black text-sm mt-4">
              <span className="uppercase tracking-widest text-[10px]">Net Payable</span>
              <span className="font-mono text-base">${data.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Legal & Compliance Footer */}
        <div className="mt-auto border-t-2 border-slate-200 pt-8 opacity-60">
          <div className="grid grid-cols-2 gap-12 text-[9px] uppercase tracking-tighter leading-relaxed">
            <div>
              <h4 className="font-black text-slate-950 mb-1">Regulatory Notice</h4>
              <p>This document constitutes a formal demand for payment under standard corporate governance protocols. Late settlement may incur processing fees as per Article 4.2 of current service agreements.</p>
            </div>
            <div className="text-right">
              <h4 className="font-black text-slate-950 mb-1">Administrative Notes</h4>
              <p className="whitespace-pre-line lowercase">{data.notes || 'no additional notations provided for this cycle.'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
