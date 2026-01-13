import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { Plus, Users, FileText, TrendingUp, ArrowUpRight, Clock, CheckCircle2, AlertCircle, Calendar, CreditCard, ChevronRight, Activity } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Invoice {
  id: number;
  client_name: string;
  total: string | number;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  due_date: string;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalInvoices: 0,
    totalClients: 0,
    revenue: 0,
    recentInvoices: [] as Invoice[],
    revenueData: [] as { name: string; value: number }[]
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      const isDemo = token?.startsWith('demo-token-');

      if (isDemo) {
        // Mock data for demo mode
        const mockInvoices: Invoice[] = [
          { id: 1, client_name: 'Acme Corp', total: 4500.00, status: 'paid', due_date: new Date().toISOString() },
          { id: 2, client_name: 'Global Tech', total: 1200.50, status: 'sent', due_date: new Date(Date.now() + 86400000 * 5).toISOString() },
          { id: 3, client_name: 'Stark Industries', total: 8900.00, status: 'overdue', due_date: new Date(Date.now() - 86400000 * 2).toISOString() },
          { id: 4, client_name: 'Wayne Ent.', total: 3200.00, status: 'draft', due_date: new Date(Date.now() + 86400000 * 10).toISOString() },
          { id: 5, client_name: 'Oscorp', total: 560.00, status: 'paid', due_date: new Date(Date.now() - 86400000 * 15).toISOString() },
        ];
        
        const mockRevenue = [
          { name: 'Jan', value: 4000 },
          { name: 'Feb', value: 3000 },
          { name: 'Mar', value: 5000 },
          { name: 'Apr', value: 2780 },
          { name: 'May', value: 1890 },
          { name: 'Jun', value: 2390 },
          { name: 'Jul', value: 3490 },
        ];

        setStats({
          totalInvoices: 24,
          totalClients: 8,
          revenue: 18360.50,
          recentInvoices: mockInvoices,
          revenueData: mockRevenue
        });
        return;
      }

      try {
        const invoices: Invoice[] = await api.get('/invoices');
        const clients = await api.get('/clients');
        
        const total = invoices.reduce((acc: number, inv: Invoice) => acc + parseFloat(inv.total.toString()), 0);
        
        setStats({
          totalInvoices: invoices.length,
          totalClients: clients.length,
          revenue: total,
          recentInvoices: invoices.slice(0, 5),
          revenueData: [
            { name: 'Week 1', value: total * 0.2 },
            { name: 'Week 2', value: total * 0.4 },
            { name: 'Week 3', value: total * 0.1 },
            { name: 'Week 4', value: total * 0.3 }
          ]
        });
      } catch (err) {
        console.error('Failed to fetch dashboard data', err);
      }
    };
    fetchData();
  }, []);

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-10 pb-20"
    >
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-white mb-2">
            Welcome back, <span className="premium-gradient-text">Operator</span>
          </h1>
          <p className="text-muted-foreground text-sm font-medium flex items-center gap-2">
            <Activity size={14} className="text-emerald-500" />
            Your business performance is up <span className="text-emerald-500 font-bold">12.5%</span> this month.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/clients" className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm font-bold hover:bg-white/10 transition-all no-underline text-white flex items-center gap-2">
            <Users size={18} />
            <span>Add Client</span>
          </Link>
          <Link to="/invoices/new" className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-sm font-bold transition-all no-underline text-white flex items-center gap-2 shadow-lg shadow-blue-900/20">
            <Plus size={18} />
            <span>New Invoice</span>
          </Link>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { 
            label: 'Aggregated Revenue', 
            value: `$${stats.revenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, 
            icon: TrendingUp, 
            color: 'emerald', 
            colors: {
              text: 'text-emerald-500',
              bg: 'bg-emerald-500/10',
              border: 'border-emerald-500/20',
              accent: 'bg-emerald-500/5',
              glow: 'group-hover:bg-emerald-500/10'
            },
            trend: '+12.5%', 
            sub: 'vs last month' 
          },
          { 
            label: 'Active Mandates', 
            value: stats.totalInvoices.toString(), 
            icon: FileText, 
            color: 'blue', 
            colors: {
              text: 'text-blue-500',
              bg: 'bg-blue-500/10',
              border: 'border-blue-500/20',
              accent: 'bg-blue-500/5',
              glow: 'group-hover:bg-blue-500/10'
            },
            trend: '+3', 
            sub: 'new this week' 
          },
          { 
            label: 'Counterparties', 
            value: stats.totalClients.toString(), 
            icon: Users, 
            color: 'violet', 
            colors: {
              text: 'text-violet-500',
              bg: 'bg-violet-500/10',
              border: 'border-violet-500/20',
              accent: 'bg-violet-500/5',
              glow: 'group-hover:bg-violet-500/10'
            },
            trend: '+1', 
            sub: 'new acquisition' 
          },
        ].map((stat, i) => (
          <motion.div 
            key={i}
            variants={itemVariants}
            className={`glass-card relative overflow-hidden group p-6 hover:translate-y-[-4px] transition-all duration-300`}
          >
            <div className={`absolute top-0 right-0 w-32 h-32 ${stat.colors.accent} rounded-full blur-3xl -mr-16 -mt-16 ${stat.colors.glow} transition-colors`} />
            
            <div className="flex items-center justify-between mb-6">
              <div className={`w-12 h-12 rounded-2xl ${stat.colors.bg} border ${stat.colors.border} flex items-center justify-center ${stat.colors.text} shadow-inner`}>
                <stat.icon size={24} />
              </div>
              <div className="flex flex-col items-end">
                <span className={`text-[10px] font-black uppercase tracking-[0.2em] opacity-40 whitespace-nowrap`}>{stat.label.split(' ')[1] || 'STAT'}</span>
                <span className="text-emerald-500 text-xs font-black flex items-center gap-1">
                  {stat.trend} <ArrowUpRight size={12} />
                </span>
              </div>
            </div>
            
            <p className="text-muted-foreground text-xs font-bold uppercase tracking-widest mb-1 opacity-50">{stat.label}</p>
            <h2 className="text-4xl font-black tracking-tighter text-white mb-2">{stat.value}</h2>
            <p className="text-[10px] text-muted-foreground font-medium">{stat.sub}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <motion.div variants={itemVariants} className="lg:col-span-2 space-y-6">
          <div className="glass-card !p-8 relative overflow-hidden h-[400px] flex flex-col">
            <div className="flex justify-between items-center mb-8 relative z-10">
              <div>
                <h3 className="text-xl font-black tracking-tight text-white flex items-center gap-2">
                  <TrendingUp size={20} className="text-emerald-500" />
                  Growth Trajectory
                </h3>
                <p className="text-xs text-muted-foreground uppercase tracking-[0.2em] font-bold mt-1">Revenue Performance</p>
              </div>
              <select 
                className="bg-white/5 border-white/10 rounded-lg px-3 py-1.5 text-xs font-bold outline-none focus:ring-1 ring-blue-500/30 cursor-pointer"
                onChange={(e) => console.log('Change period:', e.target.value)}
              >
                <option value="6m">Last 6 Months</option>
                <option value="1y">Last Year</option>
              </select>
            </div>
            
            <div className="flex-1 w-full -ml-8">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.revenueData}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#4b5563', fontSize: 10, fontWeight: 700}} 
                    dy={10}
                  />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', backgroundColor: '#000', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                    itemStyle={{ fontSize: '12px', fontWeight: '900', color: '#fff' }}
                    labelStyle={{ fontSize: '10px', color: '#666', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: '900', marginBottom: '4px' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#10b981" 
                    strokeWidth={4}
                    fillOpacity={1} 
                    fill="url(#colorValue)" 
                    animationDuration={2000}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass-card !p-0 overflow-hidden relative group">
            <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500">
                  <CreditCard size={16} />
                </div>
                <div>
                  <h3 className="text-lg font-black tracking-tight text-white">Recent Ledger Ingress</h3>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-bold">Latest Operational History</p>
                </div>
              </div>
              <Link to="/invoices" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-white hover:bg-white/10 transition-all no-underline">
                View Ledger <ChevronRight size={14} />
              </Link>
            </div>
            
            <div className="table-container m-0">
              <table className="w-full">
                <thead>
                  <tr className="bg-white/[0.02]">
                    <th className="pl-8 py-4 text-left text-[10px] uppercase tracking-widest text-muted-foreground font-black">Counterparty</th>
                    <th className="py-4 text-left text-[10px] uppercase tracking-widest text-muted-foreground font-black">Status</th>
                    <th className="py-4 text-left text-[10px] uppercase tracking-widest text-muted-foreground font-black">Timeline</th>
                    <th className="py-4 text-right text-[10px] uppercase tracking-widest text-muted-foreground font-black pr-8">Quantum</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <AnimatePresence>
                    {stats.recentInvoices.map((invoice, idx) => (
                      <motion.tr 
                        key={invoice.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="group hover:bg-white/[0.01] transition-colors cursor-pointer"
                        onClick={() => navigate(`/invoices/${invoice.id}`)}
                      >
                        <td className="pl-8 py-5">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-white/10 to-transparent flex items-center justify-center text-xs font-black ring-1 ring-white/5">
                              {invoice.client_name.charAt(0)}
                            </div>
                            <span className="font-bold text-white tracking-tight">{invoice.client_name}</span>
                          </div>
                        </td>
                        <td className="py-5">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border badge-${invoice.status}`}>
                            {invoice.status === 'paid' && <CheckCircle2 size={10} />}
                            {invoice.status === 'sent' && <Clock size={10} />}
                            {invoice.status === 'overdue' && <AlertCircle size={10} />}
                            {invoice.status}
                          </span>
                        </td>
                        <td className="py-5">
                          <div className="flex flex-col">
                            <span className="text-xs font-bold text-white tracking-tight">
                              {new Date(invoice.due_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                            </span>
                            <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-tighter">Due in 4 days</span>
                          </div>
                        </td>
                        <td className="py-5 text-right pr-8">
                          <span className="text-sm font-black text-white px-3 py-1 rounded-lg bg-white/5 border border-white/5 group-hover:border-white/10 group-hover:bg-white/10 transition-all">
                            ${parseFloat(invoice.total.toString()).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          </span>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-10">
          <div className="glass-card !p-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-blue-500/10 transition-colors duration-500" />
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-white mb-6">Quick Actions</h3>
            <div className="grid grid-cols-1 gap-4">
              <button 
                onClick={() => navigate('/clients?add=true')}
                className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group/btn"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                    <Plus size={18} />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-black text-white uppercase tracking-widest">Rapid Client</p>
                    <p className="text-[10px] text-muted-foreground font-medium">Quick Onboarding</p>
                  </div>
                </div>
                <ChevronRight size={14} className="text-muted-foreground group-hover/btn:translate-x-1 transition-transform" />
              </button>
              <button 
                onClick={() => navigate('/recurring/new')}
                className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group/btn"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                    <Calendar size={18} />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-black text-white uppercase tracking-widest">Auto-Bill</p>
                    <p className="text-[10px] text-muted-foreground font-medium">Configure Schedule</p>
                  </div>
                </div>
                <ChevronRight size={14} className="text-muted-foreground group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          <div className="glass-card !p-8 relative overflow-hidden bg-gradient-to-br from-amber-500/10 via-transparent to-transparent border-amber-500/20">
            <div className="flex items-center gap-3 mb-6 font-black uppercase tracking-[0.2em] text-[10px] text-amber-500">
              <AlertCircle size={14} /> Critical Tasks
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-3 rounded-xl bg-white/5 border border-white/5">
                <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                <div>
                  <p className="text-xs font-bold text-white">Stark Industries</p>
                  <p className="text-[10px] text-muted-foreground">Invoice overdue by 48h</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-3 rounded-xl bg-white/5 border border-white/5 opacity-50">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <div>
                  <p className="text-xs font-bold text-white">Tax Fulfillment</p>
                  <p className="text-[10px] text-muted-foreground">Quarterly preparation due</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
