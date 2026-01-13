import React from 'react';
import type { InvoiceTemplateProps } from './types';
import { Calendar, RefreshCw, Box, Zap, Repeat } from 'lucide-react';

export const SubscriptionTemplate: React.FC<InvoiceTemplateProps> = ({ data, client }) => {
  const symbol = data.currency_symbol || '$';
  
  return (
    <div className="bg-slate-50 text-slate-900 p-10 w-full h-full font-sans leading-relaxed text-sm print:p-0" style={{ aspectRatio: '1/1.414' }}>
      {/* SaaS Style Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white">
            <Repeat size={24} />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900 leading-tight">MicroScale</h1>
            <p className="text-blue-600 text-[10px] font-bold uppercase tracking-widest">Subscription Service</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Receipt No.</p>
          <p className="font-mono font-bold text-slate-900">#REC-{data.id || 'DRAFT'}</p>
        </div>
      </div>

      {/* Main Subscription Card */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <RefreshCw size={80} />
        </div>
        <div className="grid grid-cols-2 gap-8 relative z-10">
          <div>
            <h3 className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mb-2">Current Plan</h3>
            <div className="flex items-baseline gap-2">
              <h2 className="text-3xl font-black text-slate-900">{data.plan_name || 'Business Pro'}</h2>
              <span className="text-slate-400 text-xs font-medium">/ Monthly</span>
            </div>
            <div className="mt-4 flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 rounded-full text-[10px] font-bold border border-green-100">
                <Zap size={10} /> Active
              </div>
              <p className="text-slate-400 text-[11px] font-medium">Renewing on {data.renewal_date || 'Nov 01, 2025'}</p>
            </div>
          </div>
          <div className="text-right">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Billing Cycle</h3>
            <p className="text-slate-900 font-bold flex items-center justify-end gap-2">
              <Calendar size={14} className="text-slate-300" />
              {data.subscription_period || 'Oct 01, 2025 – Oct 31, 2025'}
            </p>
            <p className="text-slate-400 text-[11px] mt-2">Next payment scheduled automatically</p>
          </div>
        </div>
      </div>

      {/* Breakdown Section */}
      <div className="grid grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-2xl p-6 border border-slate-200">
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
            <Box size={14} className="text-blue-500" /> Subscription Details
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="font-medium text-slate-600">Base Premium Plan</span>
              <span className="font-bold text-slate-900">{symbol}49.00</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium text-slate-600">Advanced Analytics Add-on</span>
              <span className="font-bold text-slate-900">{symbol}10.00</span>
            </div>
            <div className="flex justify-between items-center text-blue-600">
              <span className="font-medium">Credits Applied</span>
              <span className="font-bold">-{symbol}5.00</span>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-slate-200">
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Customer Info</h3>
          <p className="font-bold text-slate-900 text-base mb-1">{client.name}</p>
          <p className="text-slate-500 text-xs leading-relaxed whitespace-pre-line">{client.address}</p>
          <p className="text-blue-600 text-xs font-medium mt-2">{client.email}</p>
        </div>
      </div>

      {/* Usage summary if applicable */}
      {data.usage_summary && data.usage_summary.length > 0 && (
        <div className="mb-8 bg-slate-900 text-white rounded-2xl p-6 flex justify-around">
          {data.usage_summary.map((stat, i) => (
            <div key={i} className="text-center">
              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">{stat.label}</p>
              <p className="text-xl font-black">{stat.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Total Section */}
      <div className="flex justify-end pt-8 border-t border-slate-200">
        <div className="w-64 space-y-3">
          <div className="flex justify-between items-center text-slate-500 font-bold uppercase text-[9px] tracking-widest">
            <span>Subtotal</span>
            <span>{symbol}{data.subtotal?.toFixed(2) || data.total.toFixed(2)}</span>
          </div>
          {data.tax_amount !== undefined && (
            <div className="flex justify-between items-center text-slate-500 font-bold uppercase text-[9px] tracking-widest">
              <span>VAT / Tax</span>
              <span>+{symbol}{data.tax_amount.toFixed(2)}</span>
            </div>
          )}
          <div className="pt-4 border-t-2 border-slate-900 flex justify-between items-end">
            <div>
              <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-1">Charged to Card</p>
              <p className="text-slate-400 text-[9px] font-medium italic">Ending in 4242</p>
            </div>
            <h2 className="text-4xl font-black text-blue-600 tracking-tighter leading-none">
              {symbol}{data.total.toFixed(2)}
            </h2>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-auto pt-10 text-center text-[10px] text-slate-400 font-medium">
        <p>Managed via MicroScale Auto-Billing. Your next renewal is on {data.renewal_date || 'Nov 01, 2025'}.</p>
        <p className="mt-1">Questions? Contact <span className="text-blue-500">support@microscale.com</span> or visit your dashboard.</p>
      </div>
    </div>
  );
};
