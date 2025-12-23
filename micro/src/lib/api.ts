const API_URL = 'http://localhost:5000/api';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

export const api = {
  get: async (path: string) => {
    const res = await fetch(`${API_URL}${path}`, {
      headers: getHeaders(),
    });
    if (res.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },
  post: async (path: string, data: any) => {
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
  },
  put: async (path: string, data: any) => {
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
