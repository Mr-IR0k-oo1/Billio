import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { Users, FileText, DollarSign, Download, PieChart as PieChartIcon, BarChart3, ArrowUpRight, Activity, Zap } from 'lucide-react';
import { PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

interface DashboardStats {
  invoice_stats: Array<{ status: string; count: number; total_amount: string }>;
  revenue_stats: Array<{ month: string; revenue: string; collected: string }>;
  client_stats: { total_clients: number; active_clients: number };
  overdue_stats: { overdue_count: number; overdue_amount: string };
}

interface RevenueData {
  period: string;
  revenue: number;
  collected: number;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#6b7280'];

const STATUS_STYLE: Record<string, { color: string; bg: string; border: string; glow: string }> = {
  paid: { color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', glow: 'bg-emerald-500/5' },
  sent: { color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20', glow: 'bg-blue-500/5' },
  draft: { color: 'text-slate-500', bg: 'bg-slate-500/10', border: 'border-slate-500/20', glow: 'bg-slate-500/5' },
  overdue: { color: 'text-rose-500', bg: 'bg-rose-500/10', border: 'border-rose-500/20', glow: 'bg-rose-500/5' },
  partially_paid: { color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/20', glow: 'bg-amber-500/5' },
  cancelled: { color: 'text-slate-400', bg: 'bg-slate-400/10', border: 'border-slate-400/20', glow: 'bg-slate-400/5' }
};

const STATUS_COLORS: Record<string, string> = {
  paid: '#10b981',
  sent: '#3b82f6',
  draft: '#6b7280',
  overdue: '#ef4444',
  partially_paid: '#f59e0b',
  cancelled: '#9ca3af'
};

export default function Reports() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [period, setPeriod] = useState('6months');
  const [loading, setLoading] = useState(true);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  useEffect(() => {
    fetchRevenueData();
  }, [period]);

  const fetchDashboardStats = async () => {
    const token = localStorage.getItem('token');
    if (token?.startsWith('demo-token-')) {
      setStats({
        invoice_stats: [
          { status: 'paid', count: 12, total_amount: '12450.00' },
          { status: 'sent', count: 5, total_amount: '3200.50' },
          { status: 'overdue', count: 3, total_amount: '2100.00' },
          { status: 'draft', count: 4, total_amount: '610.00' }
        ],
        revenue_stats: [], // Handled by fetchRevenueData
        client_stats: { total_clients: 12, active_clients: 8 },
        overdue_stats: { overdue_count: 3, overdue_amount: '2100.00' }
      });
      setLoading(false);
      return;
    }

    try {
      const data = await api.get('/reports/dashboard-stats');
      setStats(data);
    } catch (err) {
      console.error('Failed to fetch dashboard stats', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRevenueData = async () => {
    const token = localStorage.getItem('token');
    if (token?.startsWith('demo-token-')) {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const currentMonth = new Date().getMonth();
      const mockData = [];
      
      const count = period === '12months' ? 12 : period === '6months' ? 6 : period === '3months' ? 3 : 1;
      
      for (let _ = count - 1; _ >= 0; _--) {
        const monthIdx = (currentMonth - _ + 12) % 12;
        mockData.push({
          period: months[monthIdx] + ' 2024',
          revenue: 2000 + Math.random() * 3000,
          collected: 1500 + Math.random() * 2500
        });
      }
      setRevenueData(mockData);
      return;
    }

    try {
      const data = await api.get(`/reports/revenue?period=${period}`);
      const formatted = data.map((item: any) => ({
        period: format(new Date(item.period), 'MMM yyyy'),
        revenue: parseFloat(item.revenue || 0),
        collected: parseFloat(item.collected || 0)
      }));
      setRevenueData(formatted);
    } catch (err) {
      console.error('Failed to fetch revenue data', err);
    }
  };

  const handleExport = async (type: 'invoices' | 'clients' | 'products') => {
    try {
      const apiUrl = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/reports/export?type=${type}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${type}_export.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      console.error('Failed to export data', err);
    }
  };

  if (loading || !stats) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
          <p className="text-muted-foreground animate-pulse">Analyzing financial data...</p>
        </div>
      </div>
    );
  }

  // Prepare pie chart data
  const invoiceStatusData = stats.invoice_stats.map(item => ({
    name: item.status,
    value: parseInt(item.count.toString()),
    amount: parseFloat(item.total_amount)
  }));

  // Calculate totals
  const totalRevenue = stats.invoice_stats.reduce((sum, item) => sum + parseFloat(item.total_amount), 0);
  const overdueAmount = parseFloat(stats.overdue_stats.overdue_amount || '0');

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-7xl mx-auto space-y-12 pb-24"
    >
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-white/5 pb-10">
        <div>
          <h1 className="text-5xl font-black tracking-tight text-white mb-3">
            Financial <span className="premium-gradient-text">Intelligence</span>
          </h1>
          <p className="text-muted-foreground text-sm font-medium flex items-center gap-2 max-w-xl leading-relaxed">
            <Activity size={14} className="text-blue-500" />
            Quantifying operational velocity across global mandates. High-fidelity performance tracking and liquidity analysis.
          </p>
        </div>
        <div className="flex flex-wrap gap-4">
          <button 
            onClick={() => handleExport('invoices')} 
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-white hover:bg-white/10 transition-all"
          >
            <Download size={16} />
            <span>Ledger.csv</span>
          </button>
          <button 
            onClick={() => handleExport('clients')} 
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-white hover:bg-white/10 transition-all"
          >
            <Download size={16} />
            <span>Clients.csv</span>
          </button>
        </div>
      </motion.div>

      {/* Primary Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { 
            label: 'Aggregated Revenue', 
            value: `$${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, 
            icon: DollarSign, 
            color: 'emerald', 
            colors: {
              text: 'text-emerald-500',
              bg: 'bg-emerald-500/10',
              border: 'border-emerald-500/20',
              glow: 'bg-emerald-500/5'
            },
            trend: '+14% Velo', 
            sub: 'Gross Volume' 
          },
          { 
            label: 'Mandate Volume', 
            value: stats.invoice_stats.reduce((sum, item) => sum + parseInt(item.count.toString()), 0).toString(), 
            icon: FileText, 
            color: 'blue', 
            colors: {
              text: 'text-blue-500',
              bg: 'bg-blue-500/10',
              border: 'border-blue-500/20',
              glow: 'bg-blue-500/5'
            },
            trend: 'Active', 
            sub: 'Document Registry' 
          },
          { 
            label: 'Counterparty Retention', 
            value: stats.client_stats.active_clients.toString(), 
            icon: Users, 
            color: 'violet', 
            colors: {
              text: 'text-violet-500',
              bg: 'bg-violet-500/10',
              border: 'border-violet-500/20',
              glow: 'bg-violet-500/5'
            },
            trend: `${stats.client_stats.total_clients} Total`, 
            sub: 'Operational Base' 
          },
          { 
            label: 'Liquidity Latency', 
            value: `$${overdueAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, 
            icon: Zap, 
            color: overdueAmount > 0 ? 'rose' : 'emerald', 
            colors: overdueAmount > 0 ? {
              text: 'text-rose-500',
              bg: 'bg-rose-500/10',
              border: 'border-rose-500/20',
              glow: 'bg-rose-500/5'
            } : {
              text: 'text-emerald-500',
              bg: 'bg-emerald-500/10',
              border: 'border-emerald-500/20',
              glow: 'bg-emerald-500/5'
            },
            trend: `${stats.overdue_stats.overdue_count || 0} items`, 
            sub: 'Pending Collection' 
          },
        ].map((stat) => (
          <motion.div 
            key={stat.label}
            variants={itemVariants}
            className="glass-card relative overflow-hidden group p-6 hover:translate-y-[-4px] transition-all duration-300"
          >
            <div className={`absolute top-0 right-0 w-32 h-32 ${stat.colors.glow} rounded-full blur-3xl -mr-16 -mt-16 group-hover:opacity-100 opacity-50 transition-opacity`} />
            
            <div className="flex items-center justify-between mb-6">
              <div className={`w-12 h-12 rounded-2xl ${stat.colors.bg} border ${stat.colors.border} flex items-center justify-center ${stat.colors.text} shadow-inner`}>
                <stat.icon size={24} />
              </div>
              <div className="flex flex-col items-end">
                <span className={`text-[10px] font-black uppercase tracking-[0.2em] opacity-40 whitespace-nowrap`}>Metrics</span>
                <span className={`${stat.colors.text} text-xs font-black flex items-center gap-1`}>
                  {stat.trend} <ArrowUpRight size={12} />
                </span>
              </div>
            </div>
            
            <p className="text-muted-foreground text-[10px] font-black uppercase tracking-[0.15em] mb-1 opacity-60 leading-none">{stat.label}</p>
            <h2 className="text-3xl font-black tracking-tighter text-white mb-2">{stat.value}</h2>
            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-tighter italic">{stat.sub}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <motion.div variants={itemVariants} className="lg:col-span-2 space-y-10">
          <div className="glass-card !p-10 relative overflow-hidden flex flex-col min-h-[500px]">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12 relative z-10">
              <div>
                <h3 className="text-2xl font-black tracking-tight text-white flex items-center gap-3">
                  <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
                    <BarChart3 size={20} className="text-blue-500" />
                  </div>
                  Revenue Velocity
                </h3>
                <p className="text-[10px] text-muted-foreground uppercase tracking-[0.3em] font-black mt-2">Capital Performance Flow</p>
              </div>
              <div className="flex items-center gap-4 bg-white/5 p-1 rounded-2xl border border-white/10">
                {['3months', '6months', '12months'].map((p) => (
                  <button
                    key={p}
                    onClick={() => setPeriod(p)}
                    className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                      period === p 
                        ? 'bg-blue-600 text-white shadow-lg' 
                        : 'text-muted-foreground hover:text-white'
                    }`}
                  >
                    {p.replace('months', 'M')}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex-1 w-full -ml-8">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorCol" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
                  <XAxis 
                    dataKey="period" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#4b5563', fontSize: 10, fontWeight: 900}} 
                    dy={15}
                  />
                  <YAxis 
                    hide 
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      borderRadius: '20px', 
                      backgroundColor: '#000', 
                      border: '1px solid rgba(255,255,255,0.1)', 
                      boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.5)',
                      padding: '16px'
                    }}
                    itemStyle={{ fontSize: '13px', fontWeight: '900' }}
                    labelStyle={{ fontSize: '10px', color: '#666', textTransform: 'uppercase', letterSpacing: '3px', fontWeight: '900', marginBottom: '8px' }}
                    formatter={(val: number) => [`$${val.toLocaleString()}`, '']}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#3b82f6" 
                    strokeWidth={4} 
                    fillOpacity={1} 
                    fill="url(#colorRev)" 
                    animationDuration={2500}
                    name="Gross Vol."
                  />
                  <Area 
                    type="monotone" 
                    dataKey="collected" 
                    stroke="#10b981" 
                    strokeWidth={3} 
                    strokeDasharray="8 6"
                    fillOpacity={1} 
                    fill="url(#colorCol)" 
                    animationDuration={3000}
                    name="Liquidity"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="glass-card !p-8 border-l-4 border-l-emerald-500/50">
              <h4 className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em] mb-4">Capital Efficiency</h4>
              <p className="text-2xl font-black text-white mb-2">92.4%</p>
              <div className="w-full bg-emerald-500/10 rounded-full h-1.5 overflow-hidden ring-1 ring-emerald-500/20">
                <div className="bg-emerald-500 h-full w-[92.4%] shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
              </div>
              <p className="text-[10px] text-muted-foreground mt-4 font-medium italic">Liquidity conversion rate exceeds baseline by 4.2%</p>
            </div>
            <div className="glass-card !p-8 border-l-4 border-l-blue-500/50">
              <h4 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em] mb-4">Pipeline Health</h4>
              <p className="text-2xl font-black text-white mb-2">Stable</p>
              <div className="flex gap-1.5">
                {[...Array(8)].map((_, idx) => (
                  <div key={idx} className={`flex-1 h-1.5 rounded-full ${idx < 6 ? 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]' : 'bg-white/5'}`} />
                ))}
              </div>
              <p className="text-[10px] text-muted-foreground mt-4 font-medium italic">Active mandates projected at $14.2k monthly velocity</p>
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-10">
          <div className="glass-card !p-10 relative overflow-hidden group min-h-[600px] flex flex-col">
            <div className="absolute top-0 right-0 w-48 h-48 bg-purple-500/5 rounded-full blur-[100px] -mr-24 -mt-24 pointer-events-none" />
            
            <div className="flex items-center gap-3 mb-12 relative z-10">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-500">
                <PieChartIcon size={20} />
              </div>
              <div>
                <h3 className="text-xl font-black tracking-tight text-white">Status Profile</h3>
                <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-black mt-1">Portfolio Balance</p>
              </div>
            </div>

            <div className="h-[280px] w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <circle cx="50%" cy="50%" r="65" fill="rgba(255,255,255,0.02)" />
                  <Pie
                    data={invoiceStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={95}
                    paddingAngle={8}
                    dataKey="value"
                    animationBegin={500}
                    animationDuration={1500}
                  >
                    {invoiceStatusData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={STATUS_COLORS[entry.name] || COLORS[index % COLORS.length]} 
                        stroke="rgba(0,0,0,0.5)"
                        strokeWidth={2}
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                     contentStyle={{ 
                      background: '#000', 
                      border: '1px solid rgba(255,255,255,0.1)', 
                      borderRadius: '16px',
                      padding: '12px'
                    }}
                    itemStyle={{ fontSize: '11px', fontWeight: '900' }}
                    formatter={(value: number, name: string, props: any) => [
                      `${value} items • $${props.payload.amount.toLocaleString()}`,
                      name.toUpperCase()
                    ]} 
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Universe</span>
                <span className="text-2xl font-black text-white">{invoiceStatusData.reduce((a, b) => a + b.value, 0)}</span>
              </div>
            </div>

            <div className="space-y-4 mt-12 flex-1">
              {stats.invoice_stats.map((item, index) => {
                const style = STATUS_STYLE[item.status] || { color: 'text-slate-500', bg: 'bg-slate-500/10', border: 'border-slate-500/20' };
                return (
                  <div key={index} className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all cursor-default group/item">
                    <div className="flex items-center gap-4">
                      <div className={`w-2.5 h-2.5 rounded-full ${style.bg} ${style.border} border-2`} style={{backgroundColor: STATUS_COLORS[item.status]}} />
                      <div>
                        <span className="text-xs font-black uppercase tracking-widest text-white block">{item.status}</span>
                        <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-tighter opacity-50">{item.count} mandates recorded</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black text-white tracking-tight">${parseFloat(item.total_amount).toLocaleString()}</p>
                      <div className="flex items-center justify-end gap-1 mt-1">
                        <div className="w-12 h-1 bg-white/5 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-white/20" 
                            style={{width: `${Math.min(100, (parseFloat(item.total_amount) / totalRevenue) * 100)}%`}} 
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
