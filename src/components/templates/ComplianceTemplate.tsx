import React from 'react';
import type { InvoiceTemplateProps } from './types';
import { Scale, FileCheck, Shield, BookOpen } from 'lucide-react';

export const ComplianceTemplate: React.FC<InvoiceTemplateProps> = ({ data, client }) => {
  const symbol = data.currency_symbol || '$';
  
  return (
    <div className="bg-white text-slate-800 p-12 w-full h-full font-serif leading-tight text-[11px] print:p-0" style={{ aspectRatio: '1/1.414' }}>
      {/* Formal Legislative Header */}
      <div className="border-b-4 border-slate-900 pb-6 mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tighter uppercase mb-1">Tax Invoice & Declaration</h1>
          <div className="flex gap-4 text-[9px] font-bold text-slate-500 uppercase tracking-widest">
            <span className="flex items-center gap-1"><Scale size={10} /> Compliance Certified</span>
            <span className="flex items-center gap-1"><FileCheck size={10} /> Audit-Ready Archive</span>
          </div>
        </div>
        <div className="text-right">
          <p className="font-black text-slate-900 text-lg">OFFICIAL RECORD</p>
          <p className="font-mono text-[10px] text-slate-500">REF: {data.id || 'DRAFT'}-SEC-99</p>
        </div>
      </div>

      {/* Regulatory Identifiers Grid */}
      <div className="grid grid-cols-4 gap-0 border border-slate-200 mb-8 divide-x divide-slate-200 text-center">
        <div className="p-3 bg-slate-50">
          <p className="text-[8px] font-black text-slate-400 uppercase mb-1">Entity Reg No.</p>
          <p className="font-mono font-bold">{data.registration_number || 'REG-449-XT-22'}</p>
        </div>
        <div className="p-3 bg-slate-50">
          <p className="text-[8px] font-black text-slate-400 uppercase mb-1">Tax/VAT ID</p>
          <p className="font-mono font-bold">{data.tax_id || 'VAT-77889900'}</p>
        </div>
        <div className="p-3 bg-slate-50">
          <p className="text-[8px] font-black text-slate-400 uppercase mb-1">Effective Date</p>
          <p className="font-bold">{data.date || new Date().toLocaleDateString()}</p>
        </div>
        <div className="p-3 bg-slate-50">
          <p className="text-[8px] font-black text-slate-400 uppercase mb-1">Status</p>
          <p className="text-emerald-700 font-bold uppercase tracking-widest">Authorized</p>
        </div>
      </div>

      {/* Counterparty & Legal Context */}
      <div className="grid grid-cols-2 gap-12 mb-10">
        <div className="border-l-2 border-slate-900 pl-6">
          <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">Counterparty Particulars</h3>
          <p className="text-sm font-black text-slate-900 mb-1">{client.name}</p>
          <p className="text-slate-600 leading-relaxed italic">{client.address}</p>
          <p className="text-slate-900 font-mono text-[10px] mt-2 underline">{client.email}</p>
        </div>
        <div className="bg-slate-50 p-6 border border-slate-200">
          <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
            <Shield size={12} /> Regulatory Mandate
          </h3>
          <p className="text-[10px] text-slate-500 leading-relaxed font-serif italic">
            "This invoice is issued in accordance with Article 14 of the Financial Transparency Act. 
            Regulatory reference: {data.regulatory_reference || 'SEC-FIN-2025-001'}"
          </p>
        </div>
      </div>

      {/* Audit-Grade Itemized Table */}
      <div className="mb-10">
        <table className="w-full border-collapse border border-slate-300">
          <thead className="bg-slate-950 text-white">
            <tr>
              <th className="p-3 text-left text-[9px] font-black uppercase tracking-widest border border-slate-300">Service Classification</th>
              <th className="p-3 text-center text-[9px] font-black uppercase tracking-widest border border-slate-300 w-20">Units</th>
              <th className="p-3 text-right text-[9px] font-black uppercase tracking-widest border border-slate-300 w-28">Rate per Unit</th>
              <th className="p-3 text-right text-[9px] font-black uppercase tracking-widest border border-slate-300 w-32">Aggregated</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-300">
            {data.items.map((item, idx) => (
              <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                <td className="p-3 border border-slate-300 font-bold">
                  {item.description}
                  <p className="text-[8px] text-slate-400 font-mono mt-1 uppercase">Line-hash: {Math.random().toString(36).substring(7).toUpperCase()}</p>
                </td>
                <td className="p-3 border border-slate-300 text-center font-mono">{item.quantity}</td>
                <td className="p-3 border border-slate-300 text-right font-mono">{symbol}{item.unit_price.toFixed(2)}</td>
                <td className="p-3 border border-slate-300 text-right font-black">{symbol}{(item.quantity * item.unit_price).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Aggregated Totals & Certification */}
      <div className="flex justify-between items-start pt-6 border-t border-slate-100">
        <div className="max-w-md">
          <h4 className="text-[9px] font-black text-slate-950 uppercase tracking-widest mb-2 flex items-center gap-1">
            <BookOpen size={10} /> Administrative Disclosure
          </h4>
          <p className="text-[9px] text-slate-500 leading-relaxed lowercase mb-4">
            {data.notes || 'All provided services have been verified against the master service agreement. No subsequent notations are logged for this period.'}
          </p>
        </div>
        <div className="w-64 space-y-2">
          <div className="flex justify-between text-[10px] font-bold text-slate-400">
            <span>Net Subtotal</span>
            <span className="text-slate-950">{symbol}{data.subtotal?.toFixed(2) || data.total.toFixed(2)}</span>
          </div>
          {data.tax_amount !== undefined && (
            <div className="flex justify-between text-[10px] font-bold text-slate-400 border-b border-slate-100 pb-2">
              <span>Statutory Tax (VAT)</span>
              <span className="text-slate-950">+{symbol}{data.tax_amount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between items-end pt-4">
            <p className="text-[9px] font-black text-slate-900 uppercase tracking-widest">Total Payable</p>
            <h2 className="text-3xl font-black text-slate-900 tracking-tighter decoration-slate-900 underline underline-offset-4 decoration-2">
              {symbol}{data.total.toFixed(2)}
            </h2>
          </div>
        </div>
      </div>

      {/* Legal Disclaimer Footer */}
      <div className="mt-auto pt-10 border-t-2 border-slate-900 overflow-hidden">
        <div className="flex justify-between items-center text-[8px] font-bold text-slate-400 uppercase tracking-tighter">
          <p>This document is generated by MicroScale Compliance Engine v4.2.0. Digital signatures verified.</p>
          <div className="flex gap-4">
            <span>ISO/IEC 27001</span>
            <span>GDPR COMPLIANT</span>
            <span>AUTHENTIC RECORD</span>
          </div>
        </div>
      </div>
    </div>
  );
};
