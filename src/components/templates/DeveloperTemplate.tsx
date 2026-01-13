import React from 'react';
import type { InvoiceTemplateProps } from './types';
import { Terminal, Cpu, Hash, Clock } from 'lucide-react';

export const DeveloperTemplate: React.FC<InvoiceTemplateProps> = ({ data, client }) => {
  return (
    <div className="bg-[#0d1117] text-[#c9d1d9] p-12 w-full h-full font-mono leading-relaxed text-[12px] selection:bg-emerald-500/30 selection:text-emerald-400 border border-[#30363d]" style={{ aspectRatio: '1/1.414' }}>
      {/* System Header */}
      <div className="flex justify-between items-start mb-12 border-b border-[#30363d] pb-8">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-emerald-500 mb-2">
            <Terminal size={18} />
            <span className="font-bold tracking-tighter uppercase">ROOT@INVOICE_CLI:~$</span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tighter uppercase italic">PAYMENT_REQUEST.SH</h1>
          <p className="text-[#8b949e]">VERSION_ID: {data.id || 'DRAFT'}</p>
        </div>
        <div className="text-right space-y-1 text-[#8b949e]">
          <p className="text-white font-bold opacity-80">PROVIDER_ID: MICRO_SYSTEMS_LLC</p>
          <p>LOC_ID: SF_01_CALIFORNIA</p>
          <p>NET_ID: DEV_OPERATIONS</p>
          <p>UPTIME: 99.99%</p>
        </div>
      </div>

      {/* Metadata & Environment Section */}
      <div className="grid grid-cols-2 gap-8 mb-12">
        <div className="border border-[#30363d] p-6 bg-[#161b22] relative overflow-hidden">
          <div className="absolute top-0 right-0 p-2 opacity-5">
            <Hash size={48} />
          </div>
          <h3 className="text-emerald-500 text-[10px] font-bold uppercase mb-4 tracking-widest flex items-center gap-2">
            <Cpu size={12} /> TARGET_COUNTERPARTY
          </h3>
          <div className="space-y-1">
            <p className="text-white font-bold text-sm tracking-tight">{client.name}</p>
            <p className="text-[#8b949e] whitespace-pre-line leading-relaxed">{client.address}</p>
            <p className="text-emerald-500/80 mt-2">{client.email}</p>
          </div>
        </div>
        <div className="border border-[#30363d] p-6 bg-[#161b22]">
          <h3 className="text-emerald-500 text-[10px] font-bold uppercase mb-4 tracking-widest flex items-center gap-2">
            <Clock size={12} /> TIMESTAMP_DATA
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[#8b949e] text-[9px] mb-1">STAMP_INIT</p>
              <p className="text-white font-bold">{data.date || new Date().toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-[#8b949e] text-[9px] mb-1">STAMP_EXPIRY</p>
              <p className="text-emerald-500 font-bold underline decoration-emerald-900">{data.due_date}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Structured Logs (Line Items) */}
      <div className="mb-12 border border-[#30363d] overflow-hidden">
        <div className="bg-[#161b22] border-b border-[#30363d] p-3 flex justify-between items-center px-6">
          <span className="text-emerald-500 text-[9px] font-bold tracking-widest">EXECUTABLE_TASKS_LOG</span>
          <span className="text-[#8b949e] text-[9px]">FILE_DESCR: JSON_STREAM</span>
        </div>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#0d1117] text-[#8b949e] border-b border-[#30363d]">
              <th className="p-4 text-left font-bold text-[9px] uppercase tracking-widest px-8">TASK_ID & DESCRIPTION</th>
              <th className="p-4 text-center font-bold text-[9px] uppercase tracking-widest w-24">OPS_QTY</th>
              <th className="p-4 text-right font-bold text-[9px] uppercase tracking-widest w-32">UNIT_RATE</th>
              <th className="p-4 text-right font-bold text-[9px] uppercase tracking-widest w-32 pr-8">SUBTOTAL_VAL</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#30363d]">
            {data.items.map((item, idx) => (
              <tr key={idx} className="hover:bg-emerald-500/5 transition-colors group">
                <td className="p-4 px-8">
                  <span className="text-[#8b949e] mr-2">[{idx.toString().padStart(2, '0')}]</span>
                  <span className="text-white font-bold tracking-tight">{item.description}</span>
                </td>
                <td className="p-4 text-center text-[#8b949e]">{item.quantity}</td>
                <td className="p-4 text-right text-[#8b949e] font-mono">${item.unit_price.toFixed(2)}</td>
                <td className="p-4 text-right text-emerald-400 font-bold pr-8 font-mono">
                  ${(item.quantity * item.unit_price).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Final Calculation Stream */}
      <div className="flex justify-end pt-8 border-t border-[#30363d]">
        <div className="w-72 space-y-3 bg-[#161b22] p-6 border border-[#30363d] rounded-sm group">
          <div className="flex justify-between items-center text-[#8b949e]">
            <span className="text-[9px] font-bold uppercase tracking-widest">SUBTOTAL_NET</span>
            <span className="font-mono text-white">${data.subtotal?.toFixed(2) || data.total.toFixed(2)}</span>
          </div>
          {data.tax_amount !== undefined && data.tax_amount > 0 && (
            <div className="flex justify-between items-center text-[#8b949e]">
              <span className="text-[9px] font-bold uppercase tracking-widest">SVC_TAX_RECOVERY</span>
              <span className="font-mono text-white">+${data.tax_amount.toFixed(2)}</span>
            </div>
          )}
          {data.discount !== undefined && data.discount > 0 && (
            <div className="flex justify-between items-center text-rose-400">
              <span className="text-[9px] font-bold uppercase tracking-widest">CRED_ADJUSTMENT</span>
              <span className="font-mono">-${data.discount.toFixed(2)}</span>
            </div>
          )}
          <div className="pt-4 mt-2 border-t border-[#30363d] flex justify-between items-end">
            <span className="text-emerald-500 font-black text-[10px] tracking-[0.2em] mb-1">TOTAL_BAL.EXE</span>
            <span className="text-3xl font-black text-white leading-none tracking-tighter decoration-emerald-500 underline decoration-2 underline-offset-8">
              ${data.total.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* System Footer & Logs */}
      <div className="mt-auto pt-16 grid grid-cols-2 gap-8 text-[#484f58] text-[9px] font-medium leading-loose">
        <div>
          <h4 className="text-emerald-500/50 font-black uppercase mb-2 tracking-widest tracking-tighter">PROTOCOL.TXT</h4>
          <p>EXECUTION STATUS: SUCCESSful_pending_payment. PLEASE INITIATE TRANSFER TO THE SPECIFIED GATEWAY WITHIN 14 EPOCHS. ALL DELIVERABLES ARE SIGNED AND SECURED UNDER REPOSITORY LICENSE.</p>
        </div>
        <div className="text-right flex flex-col justify-end">
          <p>BUILD_HASH: {Math.random().toString(16).substring(2, 10).toUpperCase()}</p>
          <p>COMPILED_BY: MICRO_SaaS_GEN_6</p>
          <p>SYSTEM_TIME: {new Date().toISOString()}</p>
        </div>
      </div>
    </div>
  );
};
