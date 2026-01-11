const API_URL = 'http://localhost:5000/api';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

// Mock data helpers
const isDemo = () => localStorage.getItem('token')?.startsWith('demo-token-');

const getMockData = (key: string) => {
  const data = localStorage.getItem(`mock_${key}`);
  return data ? JSON.parse(data) : null;
};

const setMockData = (key: string, data: any) => {
  localStorage.setItem(`mock_${key}`, JSON.stringify(data));
};

// Initialize mock data if empty
const initMockData = () => {
  if (!localStorage.getItem('mock_invoices')) {
    setMockData('invoices', [
      { id: 1, client_name: 'Acme Corp', client_email: 'billing@acme.com', total: '1200.00', status: 'paid', due_date: '2024-03-30', items: [{ description: 'Q1 Consulting', quantity: 1, price: 1200 }] },
      { id: 2, client_name: 'Stark Industries', client_email: 'pepper@stark.com', total: '4500.00', status: 'sent', due_date: '2024-04-15', items: [{ description: 'Arc Reactor Maintenance', quantity: 1, price: 4500 }] },
      { id: 3, client_name: 'Wayne Ent.', client_email: 'alfred@wayne.com', total: '850.00', status: 'overdue', due_date: '2024-03-01', items: [{ description: 'Gadget Repair', quantity: 1, price: 850 }] },
    ]);
  }
  if (!localStorage.getItem('mock_clients')) {
    setMockData('clients', [
      { id: 1, name: 'Acme Corp', email: 'billing@acme.com', address: '123 Anvil Way' },
      { id: 2, name: 'Stark Industries', email: 'pepper@stark.com', address: 'Malibu Point 10880' },
      { id: 3, name: 'Wayne Ent.', email: 'alfred@wayne.com', address: 'Wanye Manor' },
    ]);
  }
  if (!localStorage.getItem('mock_products')) {
    setMockData('products', [
      { id: 1, name: 'Consulting', price: 150, description: 'Hourly consulting rate' },
      { id: 2, name: 'Web Design', price: 2000, description: 'Standard website project' },
    ]);
  }
  if (!localStorage.getItem('mock_estimates')) {
    setMockData('estimates', [
      { id: 1, client_name: 'Oscorp', estimate_number: 'EST-2024-001', issue_date: '2024-03-15', expiry_date: '2024-04-15', total: '15000.00', status: 'sent' },
      { id: 2, client_name: 'Pied Piper', estimate_number: 'EST-2024-002', issue_date: '2024-03-20', expiry_date: '2024-04-20', total: '2500.00', status: 'accepted' },
    ]);
  }
  if (!localStorage.getItem('mock_recurring')) {
    setMockData('recurring', [
      { id: 1, client_name: 'Daily Bugle', interval: 'month', interval_count: 1, start_date: '2024-01-01', next_run: '2024-04-01', last_run: '2024-03-01', total: 500, status: 'active', items: [{ description: 'Ad Space', quantity: 1, unit_price: 500 }] },
    ]);
  }
};

initMockData();

export const api = {
  get: async (path: string) => {
    if (isDemo()) {
      const key = path.split('/')[1];
      const items = getMockData(key) || [];
      const match = path.match(/\/\w+\/(\d+)/);
      if (match) {
        return items.find((i: any) => i.id === parseInt(match[1])) || { error: 'Not found' };
      }
      return items;
    }

    try {
      const res = await fetch(`${API_URL}${path}`, {
        headers: getHeaders(),
      });
      if (res.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    } catch (err) {
      console.warn('API connection failed, falling back to mock data', err);
      // Fallback for non-demo mode if backend is down
      const key = path.split('/')[1];
      return getMockData(key) || [];
    }
  },
  post: async (path: string, data: any) => {
    if (isDemo()) {
      const key = path.split('/')[1];
      const items = getMockData(key) || [];
      const newItem = { ...data, id: Date.now() };
      setMockData(key, [...items, newItem]);
      return newItem;
    }

    try {
      const res = await fetch(`${API_URL}${path}`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data),
      });
      if (res.status === 401 && path !== '/auth/login' && path !== '/auth/register') {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    } catch (err) {
      console.warn('API connection failed, falling back to mock data', err);
      if (path === '/auth/login' || path === '/auth/register') {
        return { 
          token: 'demo-token-' + Date.now(), 
          user: { id: 1, email: data.email || 'demo@billio.com' } 
        };
      }
      const key = path.split('/')[1];
      const items = getMockData(key) || [];
      const newItem = { ...data, id: Date.now() };
      setMockData(key, [...items, newItem]);
      return newItem;
    }
  },
  put: async (path: string, data: any) => {
    if (isDemo()) {
      const key = path.split('/')[1];
      const match = path.match(/\/\w+\/(\d+)/);
      if (match) {
        const id = parseInt(match[1]);
        const items = getMockData(key) || [];
        const index = items.findIndex((i: any) => i.id === id);
        if (index !== -1) {
          items[index] = { ...items[index], ...data };
          setMockData(key, items);
          return items[index];
        }
      }
      return { error: 'Not found' };
    }

    const res = await fetch(`${API_URL}${path}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (res.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },
  delete: async (path: string) => {
    if (isDemo()) {
      const key = path.split('/')[1];
      const match = path.match(/\/\w+\/(\d+)/);
      if (match) {
        const id = parseInt(match[1]);
        const items = getMockData(key) || [];
        setMockData(key, items.filter((i: any) => i.id !== id));
        return { success: true };
      }
    }

    const res = await fetch(`${API_URL}${path}`, { 
      method: 'DELETE',
      headers: getHeaders(),
    });
    if (res.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },
  getPdf: async (invoiceId: number) => {
    if (isDemo()) {
      // Return a dummy blob for demo
      return new Blob(['Demo PDF Content'], { type: 'application/pdf' });
    }
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_URL}/invoices/${invoiceId}/pdf`, {
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    });
    if (res.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    if (!res.ok) throw new Error('Failed to download PDF');
    return res.blob();
  }
};
