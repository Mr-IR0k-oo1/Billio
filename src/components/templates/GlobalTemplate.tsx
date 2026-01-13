import React from 'react';
import type { InvoiceTemplateProps } from './types';
import { Globe2, Landmark, ShieldCheck, MapPin } from 'lucide-react';

export const GlobalTemplate: React.FC<InvoiceTemplateProps> = ({ data, client }) => {
  const symbol = data.currency_symbol || '$';
  const code = data.currency_code || 'USD';
  
  return (
    <div className="bg-white text-slate-800 p-12 w-full h-full font-sans leading-relaxed text-sm print:p-0" style={{ aspectRatio: '1/1.414' }}>
      {/* Global Business Header */}
      <div className="flex justify-between items-start mb-16 border-b border-slate-100 pb-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-slate-900 rounded-full flex items-center justify-center text-white">
            <Globe2 size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900">MicroSystems International</h1>
            <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em] mt-1">Cross-Border Operations</p>
          </div>
        </div>
        <div className="text-right">
          <div className="bg-slate-50 border border-slate-100 px-4 py-2 rounded-lg inline-block">
            <p className="text-[10px] font-black uppercase text-slate-400 mb-1 tracking-widest">Document Registry</p>
            <p className="font-mono font-bold text-slate-900">#{data.id || 'DRAFT'}-{code}</p>
          </div>
        </div>
      </div>

      {/* Jurisdictional Details */}
      <div className="grid grid-cols-2 gap-12 mb-16">
        <div>
          <h3 className="text-[10px] font-black uppercase text-slate-400 mb-4 tracking-widest flex items-center gap-2">
            <MapPin size={12} className="text-slate-300" /> Billed Entity
          </h3>
          <div className="space-y-1">
            <p className="font-black text-slate-900 text-base">{client.name}</p>
            <p className="text-slate-500 whitespace-pre-line leading-relaxed">{client.address}</p>
            <p className="text-blue-600 font-medium mt-2">{client.email}</p>
          </div>
        </div>
        <div className="flex justify-end gap-16">
          <div className="text-right">
            <h3 className="text-[10px] font-black uppercase text-slate-400 mb-4 tracking-widest">Chronology</h3>
            <div className="space-y-4">
              <div>
                <p className="text-[10px] font-bold text-slate-300">Effective Date</p>
                <p className="font-bold text-slate-900">{data.date || new Date().toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-300">Settlement Deadline</p>
                <p className="font-bold text-slate-900 underline decoration-slate-200 underline-offset-4">{data.due_date}</p>
              </div>
            </div>
          </div>
          <div className="text-right">
            <h3 className="text-[10px] font-black uppercase text-slate-400 mb-4 tracking-widest">Settlement Currency</h3>
            <div className="bg-blue-50/50 border border-blue-100 p-3 rounded-xl inline-block text-right">
              <p className="text-[10px] font-black text-blue-400 mb-1">{code}</p>
              <p className="text-lg font-black text-blue-600 leading-none">{symbol}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Itemized Services Table */}
      <div className="mb-16">
        <table className="w-full">
          <thead>
            <tr className="border-y-2 border-slate-900">
              <th className="py-4 text-left text-[10px] font-black uppercase tracking-widest">Description of Services</th>
              <th className="py-4 text-center text-[10px] font-black uppercase tracking-widest w-24">Volume</th>
              <th className="py-4 text-right text-[10px] font-black uppercase tracking-widest w-32">Unit Price ({symbol})</th>
              <th className="py-4 text-right text-[10px] font-black uppercase tracking-widest w-40">Extended Total ({symbol})</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.items.map((item, idx) => (
              <tr key={idx} className="group">
                <td className="py-6 pr-8">
                  <p className="font-bold text-slate-900 text-[15px] mb-1">{item.description}</p>
                  <p className="text-slate-400 text-xs font-medium italic">Intl. Service Code: {idx + 101}-GLB</p>
                </td>
                <td className="py-6 text-center text-slate-500 font-bold">{item.quantity}</td>
                <td className="py-6 text-right text-slate-500 font-bold">{symbol}{item.unit_price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                <td className="py-6 text-right font-black text-slate-900 text-base">
                  {symbol}{(item.quantity * item.unit_price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Financial Summary & Banking */}
      <div className="grid grid-cols-2 gap-16 mb-16">
        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex items-start gap-4">
          <Landmark className="text-slate-400 mt-1" size={20} />
          <div>
            <h4 className="text-[10px] font-black tracking-widest uppercase mb-3 text-slate-900">Remittance Instructions</h4>
            <div className="space-y-2 text-[11px] text-slate-500 font-medium">
              <p>SWIFT/BIC: <span className="text-slate-900 font-bold">MSYTUS33XXX</span></p>
              <p>IBAN: <span className="text-slate-900 font-bold">US44 0000 1234 5678 9012 34</span></p>
              <p>CORRESPONDENT: CHASE MANHATTAN BANK, NY</p>
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex justify-between items-center text-slate-400 font-bold uppercase text-[10px] tracking-widest">
            <span>Aggregated Subtotal</span>
            <span className="text-slate-900">{symbol}{data.subtotal?.toLocaleString(undefined, { minimumFractionDigits: 2 }) || data.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
          </div>
          {data.tax_amount !== undefined && (
            <div className="flex justify-between items-center text-slate-400 font-bold uppercase text-[10px] tracking-widest">
              <span>Jurisdictional Tax/VAT</span>
              <span className="text-slate-900">+{symbol}{data.tax_amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            </div>
          )}
          <div className="pt-6 border-t-[3px] border-slate-900">
            <div className="flex justify-between items-end">
              <div>
                <p className="text-[10px] font-black uppercase text-blue-600 tracking-widest mb-1">Final Payable ({code})</p>
                <div className="flex items-center gap-2">
                  <ShieldCheck size={16} className="text-blue-600" />
                  <span className="text-[9px] font-bold text-slate-400 italic">Secure Settlement Authorized</span>
                </div>
              </div>
              <h2 className="text-4xl font-black text-slate-900 tracking-tighter leading-none">
                <span className="text-sm border-r-2 border-slate-200 pr-3 mr-3 text-slate-300 font-bold uppercase italic">{code}</span>
                {symbol}{data.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </h2>
            </div>
          </div>
        </div>
      </div>

      {/* Global Terms Footer */}
      <div className="mt-auto pt-10 border-t border-slate-100 flex justify-between items-center opacity-70">
        <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Jurisdiction: United States Commercial Law | Global Terms Apply</p>
        <div className="flex items-center gap-6 text-[9px] font-black text-slate-900 uppercase tracking-tighter">
          <span>ISO 9001:2015</span>
          <span>SLA-COMPLIANT</span>
          <span>© MISCROSYSTEMS INT.</span>
        </div>
      </div>
    </div>
  );
};
