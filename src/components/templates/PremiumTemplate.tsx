import React from 'react';
import type { InvoiceTemplateProps } from './types';

export const PremiumTemplate: React.FC<InvoiceTemplateProps> = ({ data, client }) => {
  const symbol = data.currency_symbol || '$';
  
  return (
    <div className="bg-[#fdfdfc] text-[#1c1c1c] p-24 w-full h-full font-sans leading-relaxed text-[13px] print:p-0" style={{ aspectRatio: '1/1.414' }}>
      {/* Refined Minimal Header */}
      <div className="flex justify-between items-baseline mb-32">
        <div>
          <h1 className="text-3xl font-light tracking-[0.15em] text-[#1c1c1c] uppercase">Statement</h1>
          <p className="text-[#a1a1a1] mt-2 font-medium tracking-widest text-[10px]">NO. {data.id || 'DRAFT'}</p>
        </div>
        <div className="text-right">
          <h2 className="text-sm font-bold tracking-tight">Micro Private.</h2>
          <p className="text-[#a1a1a1] text-[11px] mt-1">Advisory & Engineering</p>
        </div>
      </div>

      {/* Asymmetric Info Section */}
      <div className="flex justify-between mb-32">
        <div className="max-w-xs">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#d1d1d1] mb-6">Prepared For</h3>
          <p className="text-xl font-medium tracking-tight mb-2">{client.name}</p>
          <p className="text-[#717171] leading-loose whitespace-pre-line">{client.address}</p>
        </div>
        <div className="text-right space-y-8">
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#d1d1d1] mb-2">Schedule</h3>
            <p className="font-medium text-[#1c1c1c]">{data.date || new Date().toLocaleDateString()}</p>
          </div>
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#d1d1d1] mb-2">Settlement By</h3>
            <p className="font-medium text-[#1c1c1c]">{data.due_date}</p>
          </div>
        </div>
      </div>

      {/* Elegant Line Items */}
      <div className="mb-32">
        <div className="flex border-b border-[#f1f1f1] pb-6 mb-10">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#d1d1d1] flex-1">Description</span>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#d1d1d1] w-32 text-right">Amount</span>
        </div>
        <div className="space-y-12">
          {data.items.map((item, idx) => (
            <div key={idx} className="flex justify-between items-baseline">
              <div className="flex-1 pr-20">
                <p className="text-base font-medium text-[#1c1c1c] mb-2">{item.description}</p>
                <p className="text-[#a1a1a1] text-xs">Quantity: {item.quantity}</p>
              </div>
              <p className="text-base font-medium text-[#1c1c1c] tabular-nums">
                {symbol}{item.unit_price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Total & Payment Summary */}
      <div className="mt-auto border-t border-[#f1f1f1] pt-16 flex justify-between items-end">
        <div className="max-w-xs">
          <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#d1d1d1] mb-4">Payment Direction</h4>
          <p className="text-[11px] text-[#717171] leading-relaxed mb-6">
            Please direct all settlements to the primary offshore account. 
            Wire transfers only. Reference {data.id || 'DRAFT'} required for verification.
          </p>
          <div className="space-y-1 text-[10px] font-medium text-[#a1a1a1]">
            <p>SWIFT/BIC: MSYT P 33</p>
            <p>ROUTING: 021 000 021</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#d1d1d1] mb-4">Total Value</p>
          <h2 className="text-7xl font-light tracking-tighter leading-none text-[#1c1c1c]">
            {symbol}{data.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </h2>
          <div className="mt-6 flex justify-end gap-3 grayscale opacity-30">
            <div className="w-8 h-[1px] bg-[#1c1c1c]" />
            <div className="w-4 h-[1px] bg-[#1c1c1c]" />
          </div>
        </div>
      </div>
      
      {/* Subtle Footer */}
      <div className="mt-20 pt-10 text-center">
        <p className="text-[9px] font-bold uppercase tracking-[0.4em] text-[#e1e1e1]">Confidential | Micro Private Solutions</p>
      </div>
    </div>
  );
};
