import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { User, Building2, FileText, Settings as SettingsIcon, Save } from 'lucide-react';
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

  const handleSaveCompany = async () => {
    setLoading(true);
    try {
      await api.put('/company', companySettings);
      toast.success('Company settings saved successfully');
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
      toast.success('Password changed successfully');
      setPasswordForm({ current_password: '', new_password: '', confirm_password: '' });
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'profile' as const, label: 'Profile', icon: User },
    { id: 'company' as const, label: 'Company', icon: Building2 },
    { id: 'invoice' as const, label: 'Invoice Settings', icon: FileText },
    { id: 'preferences' as const, label: 'Preferences', icon: SettingsIcon }
  ];

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div className="page-header">
        <h1>Settings</h1>
      </div>

      <div style={{ display: 'flex', gap: '24px' }}>
        {/* Sidebar with tabs */}
        <div className="glass-card" style={{ width: '250px', height: 'fit-content' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`btn-ghost ${activeTab === tab.id ? 'active' : ''}`}
                  style={{
                    justifyContent: 'flex-start',
                    border: activeTab === tab.id ? '1px solid var(--accent-color)' : '1px solid transparent',
                    background: activeTab === tab.id ? 'rgba(124, 58, 237, 0.1)' : 'transparent'
                  }}
                >
                  <Icon size={18} style={{ marginRight: '12px' }} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content area */}
        <div className="glass-card" style={{ flex: 1 }}>
          {activeTab === 'profile' && (
            <div>
              <h2 style={{ marginBottom: '24px' }}>Profile Settings</h2>
              
              {/* Password Change */}
              <div style={{ marginBottom: '32px' }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '16px' }}>Change Password</h3>
                <form onSubmit={handlePasswordChange}>
                  <div className="form-group">
                    <label>Current Password</label>
                    <input
                      type="password"
                      value={passwordForm.current_password}
                      onChange={(e) => setPasswordForm({ ...passwordForm, current_password: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>New Password</label>
                    <input
                      type="password"
                      value={passwordForm.new_password}
                      onChange={(e) => setPasswordForm({ ...passwordForm, new_password: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Confirm New Password</label>
                    <input
                      type="password"
                      value={passwordForm.confirm_password}
                      onChange={(e) => setPasswordForm({ ...passwordForm, confirm_password: e.target.value })}
                      required
                    />
                  </div>
                  <button type="submit" className="btn-primary" disabled={loading}>
                    Change Password
                  </button>
                </form>
              </div>
            </div>
          )}

          {activeTab === 'company' && (
            <div>
              <h2 style={{ marginBottom: '24px' }}>Company Information</h2>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label>Company Name</label>
                  <input
                    type="text"
                    value={companySettings.company_name || ''}
                    onChange={(e) => setCompanySettings({ ...companySettings, company_name: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Company Email</label>
                  <input
                    type="email"
                    value={companySettings.company_email || ''}
                    onChange={(e) => setCompanySettings({ ...companySettings, company_email: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="tel"
                    value={companySettings.company_phone || ''}
                    onChange={(e) => setCompanySettings({ ...companySettings, company_phone: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Website</label>
                  <input
                    type="url"
                    value={companySettings.company_website || ''}
                    onChange={(e) => setCompanySettings({ ...companySettings, company_website: e.target.value })}
                  />
                </div>
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label>Address</label>
                  <textarea
                    value={companySettings.company_address || ''}
                    onChange={(e) => setCompanySettings({ ...companySettings, company_address: e.target.value })}
                    rows={3}
                  />
                </div>
                <div className="form-group">
                  <label>Tax ID</label>
                  <input
                    type="text"
                    value={companySettings.tax_id || ''}
                    onChange={(e) => setCompanySettings({ ...companySettings, tax_id: e.target.value })}
                  />
                </div>
              </div>

              <button onClick={handleSaveCompany} className="btn-primary" disabled={loading} style={{ marginTop: '20px' }}>
                <Save size={18} style={{ marginRight: '8px' }} />
                Save Company Settings
              </button>
            </div>
          )}

          {activeTab === 'invoice' && (
            <div>
              <h2 style={{ marginBottom: '24px' }}>Invoice Settings</h2>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label>Invoice Prefix</label>
                  <input
                    type="text"
                    value={companySettings.invoice_prefix || 'INV'}
                    onChange={(e) => setCompanySettings({ ...companySettings, invoice_prefix: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Starting Number</label>
                  <input
                    type="number"
                    value={companySettings.invoice_starting_number || 1000}
                    onChange={(e) => setCompanySettings({ ...companySettings, invoice_starting_number: parseInt(e.target.value) })}
                  />
                </div>
                <div className="form-group">
                  <label>Estimate Prefix</label>
                  <input
                    type="text"
                    value={companySettings.estimate_prefix || 'EST'}
                    onChange={(e) => setCompanySettings({ ...companySettings, estimate_prefix: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Estimate Starting Number</label>
                  <input
                    type="number"
                    value={companySettings.estimate_starting_number || 1000}
                    onChange={(e) => setCompanySettings({ ...companySettings, estimate_starting_number: parseInt(e.target.value) })}
                  />
                </div>
                <div className="form-group">
                  <label>Default Payment Terms (days)</label>
                  <input
                    type="number"
                    value={companySettings.default_payment_terms || 30}
                    onChange={(e) => setCompanySettings({ ...companySettings, default_payment_terms: parseInt(e.target.value) })}
                  />
                </div>
                <div className="form-group">
                  <label>Default Tax Rate (%)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={companySettings.default_tax_rate || 0}
                    onChange={(e) => setCompanySettings({ ...companySettings, default_tax_rate: parseFloat(e.target.value) })}
                  />
                </div>
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label>Default Notes</label>
                  <textarea
                    value={companySettings.default_notes || ''}
                    onChange={(e) => setCompanySettings({ ...companySettings, default_notes: e.target.value })}
                    rows={3}
                    placeholder="These notes will appear on all new invoices"
                  />
                </div>
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label>Default Terms</label>
                  <textarea
                    value={companySettings.default_terms || ''}
                    onChange={(e) => setCompanySettings({ ...companySettings, default_terms: e.target.value })}
                    rows={3}
                    placeholder="Payment terms and conditions"
                  />
                </div>
              </div>

              <button onClick={handleSaveCompany} className="btn-primary" disabled={loading} style={{ marginTop: '20px' }}>
                <Save size={18} style={{ marginRight: '8px' }} />
                Save Invoice Settings
              </button>
            </div>
          )}

          {activeTab === 'preferences' && (
            <div>
              <h2 style={{ marginBottom: '24px' }}>Preferences</h2>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label>Default Currency</label>
                  <select
                    value={companySettings.default_currency || 'USD'}
                    onChange={(e) => setCompanySettings({ ...companySettings, default_currency: e.target.value })}
                  >
                    <option value="USD">USD - US Dollar</option>
                    <option value="EUR">EUR - Euro</option>
                    <option value="GBP">GBP - British Pound</option>
                    <option value="INR">INR - Indian Rupee</option>
                    <option value="CAD">CAD - Canadian Dollar</option>
                    <option value="AUD">AUD - Australian Dollar</option>
                  </select>
                </div>
              </div>

              <button onClick={handleSaveCompany} className="btn-primary" disabled={loading} style={{ marginTop: '20px' }}>
                <Save size={18} style={{ marginRight: '8px' }} />
                Save Preferences
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
