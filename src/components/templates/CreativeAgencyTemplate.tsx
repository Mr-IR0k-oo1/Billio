import React from 'react';
import type { InvoiceTemplateProps } from './types';

export const CreativeAgencyTemplate: React.FC<InvoiceTemplateProps> = ({ data, client }) => {
  return (
    <div className="bg-[#ffffff] text-[#111111] p-16 w-full h-full font-sans leading-none selection:bg-rose-500 selection:text-white" style={{ aspectRatio: '1/1.414' }}>
      {/* Branding & Identitiy Header */}
      <div className="flex justify-between items-start mb-24 border-b-2 border-[#111111] pb-12">
        <div className="space-y-4">
          <div className="w-16 h-4 bg-rose-600 mb-6" /> {/* Brand Accent Block */}
          <h1 className="text-7xl font-black tracking-tighter leading-[0.8] uppercase">Studio<br/>Creative.</h1>
        </div>
        <div className="text-right space-y-2 mt-4">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] mb-4">Origin</p>
          <div className="text-sm font-medium leading-relaxed">
            <p>12 Loft District</p>
            <p>Brooklyn, New York</p>
            <p>hello@studio.design</p>
          </div>
        </div>
      </div>

      {/* Metadata Grid */}
      <div className="grid grid-cols-4 gap-4 mb-24">
        <div className="col-span-2">
          <h3 className="text-[9px] font-black uppercase tracking-[0.3em] text-rose-600 mb-6">Subject Counterparty</h3>
          <div className="space-y-1">
            <p className="text-2xl font-black tracking-tight">{client.name}</p>
            <p className="text-gray-400 font-medium text-sm whitespace-pre-line leading-relaxed">{client.address}</p>
          </div>
        </div>
        <div className="border-l border-gray-100 pl-8">
          <h3 className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-300 mb-6">Chronology</h3>
          <div className="space-y-4">
            <div>
              <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mb-1">Issue</p>
              <p className="text-sm font-black">{data.date || new Date().toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mb-1">Due</p>
              <p className="text-sm font-black text-rose-600 underline underline-offset-4">{data.due_date}</p>
            </div>
          </div>
        </div>
        <div className="border-l border-gray-100 pl-8">
          <h3 className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-300 mb-6">Identification</h3>
          <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mb-1">Ref No.</p>
          <p className="text-sm font-black">ST-{data.id || 'DRAFT'}</p>
        </div>
      </div>

      {/* Expressive Table */}
      <div className="mb-24">
        <div className="flex border-b-2 border-slate-900 pb-4 mb-8">
          <span className="text-[10px] font-black uppercase tracking-[0.4em] w-1/2">Project Deliverables</span>
          <span className="text-[10px] font-black uppercase tracking-[0.4em] w-1/6 text-center">Qty</span>
          <span className="text-[10px] font-black uppercase tracking-[0.4em] w-1/6 text-right">Rate</span>
          <span className="text-[10px] font-black uppercase tracking-[0.4em] w-1/6 text-right">Value</span>
        </div>
        <div className="space-y-8">
          {data.items.map((item, idx) => (
            <div key={idx} className="flex items-start">
              <div className="w-1/2 pr-12">
                <p className="text-xl font-black tracking-tight mb-2 uppercase">{item.description}</p>
                <div className="w-8 h-[2px] bg-rose-500 opacity-30" />
              </div>
              <p className="w-1/6 text-center font-mono font-bold text-gray-400 text-sm mt-1">{item.quantity.toString().padStart(2, '0')}</p>
              <p className="w-1/6 text-right font-mono font-bold text-gray-400 text-sm mt-1">${item.unit_price.toFixed(0)}</p>
              <p className="w-1/6 text-right text-lg font-black mt-1">${(item.quantity * item.unit_price).toFixed(2)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Financial Summary Overlay */}
      <div className="mt-auto border-t-[8px] border-[#111111] pt-12">
        <div className="flex justify-between items-end">
          <div className="max-w-xs space-y-6">
            <div>
              <h4 className="text-[9px] font-black uppercase tracking-[0.4em] mb-4 text-rose-600">Executive Notes</h4>
              <p className="text-sm font-medium leading-relaxed italic text-gray-500">{data.notes || 'No subsequent notations for this phase.'}</p>
            </div>
            <div className="text-[8px] font-bold text-gray-400 tracking-[0.2em] leading-loose">
              <p>ALL CREATIVE IP REMAINS PROPERTY OF THE STUDIO UNTIL FINAL SETTLEMENT.</p>
              <p>STUDIO.DESIGN | GLOBAL CREATIVE OPERATIONS</p>
            </div>
          </div>
          <div className="text-right">
            <div className="space-y-2 mb-8">
              <div className="flex justify-end gap-12 text-sm font-bold text-gray-300">
                <span>Subtotal</span>
                <span className="text-black">${data.subtotal?.toFixed(2) || data.total.toFixed(2)}</span>
              </div>
              {data.tax_amount !== undefined && (
                <div className="flex justify-end gap-12 text-sm font-bold text-gray-300">
                  <span>VAT / Tax</span>
                  <span className="text-black">${data.tax_amount.toFixed(2)}</span>
                </div>
              )}
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase tracking-[0.5em] text-rose-600">Total Investment</p>
              <h2 className="text-8xl font-black tracking-tighter leading-none">${data.total.toFixed(0)}<span className="text-2xl opacity-20 ml-2">.00</span></h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
