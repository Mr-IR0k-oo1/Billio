import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import Dashboard from './pages/Dashboard';
import Invoices from './pages/Invoices';
import InvoiceEditor from './pages/InvoiceEditor';
import Clients from './pages/Clients';
import Products from './pages/Products';
import Login from './pages/Login';

// Simple Auth Guard (Mock)
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = true; // In a real app, check token
  return isAuthenticated ? <Layout>{children}</Layout> : <Navigate to="/login" />;
};

export function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route path="/" element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        } />

        <Route path="/invoices" element={
          <PrivateRoute>
            <Invoices />
          </PrivateRoute>
        } />

        <Route path="/invoices/new" element={
          <PrivateRoute>
            <InvoiceEditor />
          </PrivateRoute>
        } />

        <Route path="/invoices/:id" element={
          <PrivateRoute>
            <InvoiceEditor />
          </PrivateRoute>
        } />

        <Route path="/clients" element={
          <PrivateRoute>
            <Clients />
          </PrivateRoute>
        } />

        <Route path="/products" element={
          <PrivateRoute>
            <Products />
          </PrivateRoute>
        } />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}
