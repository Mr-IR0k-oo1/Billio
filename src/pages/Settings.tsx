import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { 
  User, 
  Building2, 
  FileText, 
  Settings as SettingsIcon, 
  Save, 
  Lock, 
  Globe, 
  Phone, 
  Mail, 
  MapPin, 
  Hash, 
  CreditCard,
  ChevronRight,
  Loader2
} from 'lucide-react';
import toast from 'react-hot-toast';

interface CompanySettings {
  company_name: string;
  company_email: string;
  company_phone: string;
  company_address: string;
  company_website: string;
  tax_id: string;
  logo_url: string;
  invoice_prefix: string;
  invoice_starting_number: number;
  estimate_prefix: string;
  estimate_starting_number: number;
  default_payment_terms: number;
  default_tax_rate: number;
  default_currency: string;
  default_notes: string;
  default_terms: string;
}

export default function Settings() {
  const [activeTab, setActiveTab] = useState<'profile' | 'company' | 'invoice' | 'preferences'>('profile');
  const [loading, setLoading] = useState(false);
  const [companySettings, setCompanySettings] = useState<Partial<CompanySettings>>({});
  const [passwordForm, setPasswordForm] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });

  useEffect(() => {
    if (activeTab === 'company' || activeTab === 'invoice') {
      fetchCompanySettings();
    }
  }, [activeTab]);

  const fetchCompanySettings = async () => {
    try {
      const data = await api.get('/company');
      setCompanySettings(data);
    } catch (err) {
      console.error('Failed to fetch company settings', err);
    }
  };

  const handleSaveSettings = async () => {
    setLoading(true);
    try {
      await api.put('/company', companySettings);
      toast.success('System preferences updated');
    } catch (err) {
      toast.error('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordForm.new_password !== passwordForm.confirm_password) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await api.post('/auth/change-password', {
        current_password: passwordForm.current_password,
        new_password: passwordForm.new_password
      });
      toast.success('Security credentials updated');
      setPasswordForm({ current_password: '', new_password: '', confirm_password: '' });
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'profile' as const, label: 'Security & Profile', description: 'Account credentials and access', icon: User },
    { id: 'company' as const, label: 'Organization', description: 'Business identity and contact', icon: Building2 },
    { id: 'invoice' as const, label: 'Billing Engine', description: 'Prefixes, taxes and default notes', icon: FileText },
    { id: 'preferences' as const, label: 'Localization', description: 'Currencies and display settings', icon: SettingsIcon }
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="page-header">
        <div>
          <h1>System Configuration</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage your professional identity and workspace preferences</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 mt-8">
        {/* Navigation Sidebar */}
        <div className="w-full lg:w-80 space-y-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full text-left p-4 rounded-2xl transition-all duration-300 border flex items-center justify-between group ${
                  isActive 
                    ? 'bg-blue-600/10 border-blue-500/50 text-white shadow-lg shadow-blue-500/5' 
                    : 'bg-white/[0.02] border-white/5 text-muted-foreground hover:bg-white/5 hover:border-white/10'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-xl border transition-colors ${
                    isActive ? 'bg-blue-500/20 border-blue-500/40 text-blue-400' : 'bg-white/5 border-white/10 text-muted-foreground group-hover:text-white'
                  }`}>
                    <Icon size={20} />
                  </div>
                  <div>
                    <p className={`font-bold text-sm ${isActive ? 'text-white' : 'text-foreground/80'}`}>{tab.label}</p>
                    <p className="text-[10px] uppercase tracking-wider opacity-60 font-semibold">{tab.description}</p>
                  </div>
                </div>
                <ChevronRight size={16} className={`transition-transform duration-300 ${isActive ? 'translate-x-0' : '-translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0'}`} />
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="flex-1 glass-card p-8 min-h-[500px]">
          {activeTab === 'profile' && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500">
                  <User size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Profile Security</h2>
                  <p className="text-muted-foreground text-sm">Update your access credentials and password</p>
                </div>
              </div>
              
              <form onSubmit={handlePasswordChange} className="space-y-6 max-w-md">
                <div className="form-group">
                  <label>Current Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <input
                      type="password"
                      placeholder="Verify current password"
                      className="pl-12"
                      value={passwordForm.current_password}
                      onChange={(e) => setPasswordForm({ ...passwordForm, current_password: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <input
                      type="password"
                      placeholder="Minimum 6 characters"
                      className="pl-12"
                      value={passwordForm.new_password}
                      onChange={(e) => setPasswordForm({ ...passwordForm, new_password: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Confirm Identity</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <input
                      type="password"
                      placeholder="Repeat new password"
                      className="pl-12"
                      value={passwordForm.confirm_password}
                      onChange={(e) => setPasswordForm({ ...passwordForm, confirm_password: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <button type="submit" className="btn-cta px-8 py-3" disabled={loading}>
                  {loading ? <Loader2 className="animate-spin" size={18} /> : 'Update Credentials'}
                </button>
              </form>
            </div>
          )}

          {activeTab === 'company' && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-500">
                  <Building2 size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Organization Identity</h2>
                  <p className="text-muted-foreground text-sm">Details used on your professional documents</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="form-group">
                  <label className="flex items-center gap-2">
                    <Building2 size={14} className="text-blue-400" /> Professional Name
                  </label>
                  <input
                    type="text"
                    value={companySettings.company_name || ''}
                    onChange={(e) => setCompanySettings({ ...companySettings, company_name: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="flex items-center gap-2">
                    <Mail size={14} className="text-blue-400" /> Business Email
                  </label>
                  <input
                    type="email"
                    value={companySettings.company_email || ''}
                    onChange={(e) => setCompanySettings({ ...companySettings, company_email: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="flex items-center gap-2">
                    <Phone size={14} className="text-blue-400" /> Contact Phone
                  </label>
                  <input
                    type="tel"
                    value={companySettings.company_phone || ''}
                    onChange={(e) => setCompanySettings({ ...companySettings, company_phone: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="flex items-center gap-2">
                    <Globe size={14} className="text-blue-400" /> Official Website
                  </label>
                  <input
                    type="url"
                    value={companySettings.company_website || ''}
                    onChange={(e) => setCompanySettings({ ...companySettings, company_website: e.target.value })}
                  />
                </div>
                <div className="form-group md:col-span-2">
                  <label className="flex items-center gap-2">
                    <MapPin size={14} className="text-blue-400" /> Business Address
                  </label>
                  <textarea
                    value={companySettings.company_address || ''}
                    onChange={(e) => setCompanySettings({ ...companySettings, company_address: e.target.value })}
                    rows={3}
                  />
                </div>
                <div className="form-group">
                  <label className="flex items-center gap-2">
                    <Hash size={14} className="text-blue-400" /> Tax Identification
                  </label>
                  <input
                    type="text"
                    value={companySettings.tax_id || ''}
                    onChange={(e) => setCompanySettings({ ...companySettings, tax_id: e.target.value })}
                  />
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-white/5">
                <button onClick={handleSaveSettings} className="btn-cta px-10 py-3 flex items-center gap-2" disabled={loading}>
                  <Save size={18} />
                  Save Organization Details
                </button>
              </div>
            </div>
          )}

          {activeTab === 'invoice' && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
                  <FileText size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Billing Architecture</h2>
                  <p className="text-muted-foreground text-sm">Configure sequences and default document terms</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="form-group">
                  <label>Invoice Identifier Prefix</label>
                  <input
                    type="text"
                    value={companySettings.invoice_prefix || 'INV'}
                    onChange={(e) => setCompanySettings({ ...companySettings, invoice_prefix: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Next Invoice Sequence</label>
                  <input
                    type="number"
                    value={companySettings.invoice_starting_number || 1000}
                    onChange={(e) => setCompanySettings({ ...companySettings, invoice_starting_number: parseInt(e.target.value) })}
                  />
                </div>
                <div className="form-group">
                  <label>Estimate Identifier Prefix</label>
                  <input
                    type="text"
                    value={companySettings.estimate_prefix || 'EST'}
                    onChange={(e) => setCompanySettings({ ...companySettings, estimate_prefix: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Next Estimate Sequence</label>
                  <input
                    type="number"
                    value={companySettings.estimate_starting_number || 1000}
                    onChange={(e) => setCompanySettings({ ...companySettings, estimate_starting_number: parseInt(e.target.value) })}
                  />
                </div>
                <div className="form-group">
                  <label>Payment Terms (Horizon Days)</label>
                  <input
                    type="number"
                    value={companySettings.default_payment_terms || 30}
                    onChange={(e) => setCompanySettings({ ...companySettings, default_payment_terms: parseInt(e.target.value) })}
                  />
                </div>
                <div className="form-group">
                  <label>Standard Tax Magnitude (%)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={companySettings.default_tax_rate || 0}
                    onChange={(e) => setCompanySettings({ ...companySettings, default_tax_rate: parseFloat(e.target.value) })}
                  />
                </div>
                <div className="form-group md:col-span-2">
                  <label>Global Document Appendix</label>
                  <textarea
                    value={companySettings.default_notes || ''}
                    onChange={(e) => setCompanySettings({ ...companySettings, default_notes: e.target.value })}
                    rows={3}
                    placeholder="Standard footnotes for all generated documents"
                  />
                </div>
                <div className="form-group md:col-span-2">
                  <label>Terms of Engagement</label>
                  <textarea
                    value={companySettings.default_terms || ''}
                    onChange={(e) => setCompanySettings({ ...companySettings, default_terms: e.target.value })}
                    rows={3}
                    placeholder="Standard legal clauses and conditions"
                  />
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-white/5">
                <button onClick={handleSaveSettings} className="btn-cta px-10 py-3 flex items-center gap-2" disabled={loading}>
                  <Save size={18} />
                  Save Billing Logic
                </button>
              </div>
            </div>
          )}

          {activeTab === 'preferences' && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
                  <SettingsIcon size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Regional Localization</h2>
                  <p className="text-muted-foreground text-sm">Currency and regional preferences</p>
                </div>
              </div>
              
              <div className="max-w-md space-y-6">
                <div className="form-group">
                  <label className="flex items-center gap-2">
                    <CreditCard size={14} className="text-amber-400" /> Operational Currency
                  </label>
                  <select
                    value={companySettings.default_currency || 'USD'}
                    onChange={(e) => setCompanySettings({ ...companySettings, default_currency: e.target.value })}
                  >
                    <option value="USD">USD - United States Dollar</option>
                    <option value="EUR">EUR - European Euro</option>
                    <option value="GBP">GBP - British Pound Sterling</option>
                    <option value="INR">INR - Indian Rupee</option>
                    <option value="CAD">CAD - Canadian Dollar</option>
                    <option value="AUD">AUD - Australian Dollar</option>
                    <option value="JPY">JPY - Japanese Yen</option>
                    <option value="SGD">SGD - Singapore Dollar</option>
                  </select>
                </div>

                <div className="mt-8 pt-8 border-t border-white/5">
                  <button onClick={handleSaveSettings} className="btn-cta px-10 py-3 flex items-center gap-2" disabled={loading}>
                    <Save size={18} />
                    Sync Preferences
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
