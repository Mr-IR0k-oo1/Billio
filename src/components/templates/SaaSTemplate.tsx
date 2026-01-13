import React from 'react';
import type { InvoiceTemplateProps } from './types';
import { Layers, Globe, Activity } from 'lucide-react';

export const SaaSTemplate: React.FC<InvoiceTemplateProps> = ({ data, client }) => {
  return (
    <div className="bg-[#fcfdf2] text-[#1a1a1a] p-10 w-full h-full font-sans leading-relaxed text-[13px] print:p-0" style={{ aspectRatio: '1/1.414' }}>
      {/* SaaS Branding Header */}
      <div className="flex justify-between items-start mb-12">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
            <Layers size={22} />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">MicroCloud</h1>
            <p className="text-indigo-600/60 font-medium text-[10px] uppercase tracking-widest">Platform Services</p>
          </div>
        </div>
        <div className="text-right">
          <div className="inline-block px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-[10px] font-bold uppercase tracking-wider mb-2">
            Invoice {data.id || 'DRAFT'}
          </div>
          <p className="text-gray-400 font-medium">{data.date || new Date().toLocaleDateString()}</p>
        </div>
      </div>

      {/* Subscription Context Card */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-indigo-50/50 mb-10 flex justify-between items-center">
        <div className="flex gap-10">
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Subscription Period</p>
            <p className="font-semibold text-gray-900 flex items-center gap-2">
              <Globe size={14} className="text-indigo-400" />
              {data.subscription_period || 'Oct 01, 2025 – Oct 31, 2025'}
            </p>
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Billed To</p>
            <p className="font-semibold text-gray-900">{client.name}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Payment Method</p>
          <p className="font-semibold text-gray-900 italic">Visa ending in •••• 4242</p>
        </div>
      </div>

      {/* Itemized Line Items */}
      <div className="mb-10">
        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4 ml-2">Services & Tiers</h3>
        <div className="space-y-4">
          {data.items.map((item, idx) => (
            <div key={idx} className="flex justify-between items-center p-5 bg-white rounded-2xl border border-slate-100 hover:border-indigo-100 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 rounded-full bg-indigo-500" />
                <div>
                  <p className="font-bold text-slate-900">{item.description}</p>
                  <p className="text-slate-400 text-[11px] font-medium">Standard License x {item.quantity}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-slate-900">${(item.quantity * item.unit_price).toFixed(2)}</p>
                <p className="text-slate-300 text-[10px] font-medium">${item.unit_price.toFixed(2)} / unit</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Usage Analytics Summary */}
      <div className="grid grid-cols-3 gap-4 mb-12">
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100/50">
          <div className="flex items-center gap-2 mb-2">
            <Activity size={12} className="text-indigo-500" />
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">API Requests</span>
          </div>
          <p className="text-xl font-bold text-slate-900">124.5k<span className="text-[10px] text-slate-400 font-medium ml-1">Included</span></p>
        </div>
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100/50">
          <div className="flex items-center gap-2 mb-2 underline decoration-indigo-200">
            <Activity size={12} className="text-indigo-500" />
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">SLA Uptime</span>
          </div>
          <p className="text-xl font-bold text-slate-900">99.98%</p>
        </div>
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100/50">
          <div className="flex items-center gap-2 mb-2">
            <Activity size={12} className="text-indigo-500" />
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Compute Hr</span>
          </div>
          <p className="text-xl font-bold text-slate-900">720.0</p>
        </div>
      </div>

      {/* Financial Breakdown */}
      <div className="flex justify-end pt-10 border-t border-slate-100">
        <div className="w-64 space-y-4">
          <div className="flex justify-between items-center text-slate-400 font-medium">
            <span>Platform Subtotal</span>
            <span className="text-slate-900">${data.subtotal?.toFixed(2) || data.total.toFixed(2)}</span>
          </div>
          {data.tax_amount !== undefined && (
            <div className="flex justify-between items-center text-slate-400 font-medium">
              <span>VAT (0%)</span>
              <span className="text-slate-900">${data.tax_amount.toFixed(2)}</span>
            </div>
          )}
          <div className="pt-4 border-t-2 border-slate-900">
            <div className="flex justify-between items-center">
              <span className="text-slate-900 font-black uppercase text-[10px] tracking-widest">Grand Total</span>
              <span className="text-2xl font-black text-indigo-600">${data.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* SaaS Minimal Footer */}
      <div className="mt-auto pt-10 text-center text-[10px] text-slate-300 font-medium">
        <p>Managed via MicroCloud Auto-Billing • Manage your subscription at <span className="text-indigo-400">billing.microcloud.io</span></p>
      </div>
    </div>
  );
};
