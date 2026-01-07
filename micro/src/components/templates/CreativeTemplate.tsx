import React from 'react';
import type { InvoiceTemplateProps } from './types';

export const CreativeTemplate: React.FC<InvoiceTemplateProps> = ({ data, client }) => {
  // Generate a random gradient based on id for "uniqueness" or just use a nice preset
  const gradient = "linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%)";

  return (
    <div className="bg-slate-900 text-white p-0 w-full h-full font-sans relative overflow-hidden" style={{ aspectRatio: '1/1.414' }}>
      {/* Decorative Background Elements */}
      <div 
        className="absolute top-0 left-0 w-full h-64 opacity-20"
        style={{ background: gradient, filter: 'blur(60px)', transform: 'translateY(-50%)' }}
      ></div>
       <div 
        className="absolute bottom-0 right-0 w-96 h-96 opacity-10 rounded-full"
        style={{ background: '#ec4899', filter: 'blur(80px)', transform: 'translate(30%, 30%)' }}
      ></div>

      <div className="relative z-10 p-12 h-full flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-end mb-16">
          <div>
            <div className="w-12 h-12 rounded-xl mb-6 flex items-center justify-center shadow-lg" style={{ background: gradient }}>
               <span className="text-2xl font-bold text-white">M</span>
            </div>
            <h1 className="text-4xl font-black tracking-tight mb-2">INVOICE</h1>
            <div className="inline-block px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-sm font-medium">
              #{data.id || 'DRAFT'}
            </div>
          </div>
          <div className="text-right">
             <h2 className="text-xl font-bold mb-1">Micro Inc.</h2>
             <p className="text-slate-400 text-sm">Design & Development</p>
          </div>
        </div>

        {/* Client & Dates */}
        <div className="grid grid-cols-2 gap-12 mb-16">
           <div className="bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-white/10">
             <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-3 block">Billed To</span>
             <h3 className="text-xl font-bold mb-1">{client.name}</h3>
             <p className="text-slate-400 text-sm mb-2">{client.email}</p>
             <p className="text-slate-400 text-sm opacity-80">{client.address}</p>
           </div>
           
           <div className="flex flex-col justify-center space-y-4">
             <div className="flex justify-between items-center border-b border-white/10 pb-2">
               <span className="text-slate-400 font-medium">Date Issued</span>
               <span className="font-bold">{data.date || 'Today'}</span>
             </div>
             <div className="flex justify-between items-center border-b border-white/10 pb-2">
               <span className="text-slate-400 font-medium">Due Date</span>
               <span className="font-bold text-pink-400">{data.due_date}</span>
             </div>
           </div>
        </div>

        {/* Line Items */}
        <div className="flex-grow">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/20">
                <th className="text-left py-4 text-sm font-bold text-indigo-300">ITEM DESCRIPTION</th>
                <th className="text-center py-4 text-sm font-bold text-indigo-300 w-20">QTY</th>
                <th className="text-right py-4 text-sm font-bold text-indigo-300 w-32">PRICE</th>
                <th className="text-right py-4 text-sm font-bold text-indigo-300 w-32">TOTAL</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {data.items.map((item, idx) => (
                <tr key={idx}>
                  <td className="py-5 font-medium">{item.description}</td>
                  <td className="py-5 text-center text-slate-400">{item.quantity}</td>
                  <td className="py-5 text-right text-slate-400">${item.unit_price.toFixed(2)}</td>
                  <td className="py-5 text-right font-bold text-white text-lg">
                    ${(item.quantity * item.unit_price).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Total Bubble */}
        <div className="mt-8 flex justify-end">
           <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-8 rounded-2xl shadow-2xl flex items-center gap-8 transform translate-x-4">
              <span className="text-indigo-200 font-medium text-lg">Total Due</span>
              <span className="text-4xl font-bold text-white">${data.total.toFixed(2)}</span>
           </div>
        </div>
      </div>
    </div>
  );
};
