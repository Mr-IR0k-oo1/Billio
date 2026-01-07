import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Layout } from './components/Layout';
import Dashboard from './pages/Dashboard';
import Invoices from './pages/Invoices';
import InvoiceEditor from './pages/InvoiceEditor';
import InvoiceView from './pages/InvoiceView';
import Clients from './pages/Clients';
import Products from './pages/Products';
import Login from './pages/Login';
import Register from './pages/Register';
import HomePage from './pages/HomePage';
import Settings from './pages/Settings';
import Reports from './pages/Reports';
import Estimates from './pages/Estimates';
import RecurringInvoices from './pages/RecurringInvoices';
import RecurringInvoiceEditor from './pages/RecurringInvoiceEditor';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('token');
  return token ? <Layout>{children}</Layout> : <Navigate to="/login" />;
};

const PublicRoute = ({ children, redirectTo = "/" }: { children: React.ReactNode, redirectTo?: string }) => {
  const token = localStorage.getItem('token');
  return token ? <Navigate to={redirectTo} /> : <>{children}</>;
};

export function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <PublicRoute>
            <HomePage />
          </PublicRoute>
        } />

        <Route path="/login" element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } />

        <Route path="/register" element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        } />
        
        <Route path="/dashboard" element={
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
            <InvoiceView />
          </PrivateRoute>
        } />

        <Route path="/invoices/:id/edit" element={
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

        <Route path="/estimates" element={
          <PrivateRoute>
            <Estimates />
          </PrivateRoute>
        } />

        <Route path="/estimates/new" element={
          <PrivateRoute>
            <InvoiceEditor isEstimate />
          </PrivateRoute>
        } />

        <Route path="/estimates/:id" element={
          <PrivateRoute>
            <InvoiceEditor isEstimate />
          </PrivateRoute>
        } />

        <Route path="/recurring" element={
          <PrivateRoute>
            <RecurringInvoices />
          </PrivateRoute>
        } />

        <Route path="/recurring/new" element={
          <PrivateRoute>
            <RecurringInvoiceEditor />
          </PrivateRoute>
        } />

        <Route path="/recurring/:id" element={
          <PrivateRoute>
            <RecurringInvoiceEditor />
          </PrivateRoute>
        } />

        <Route path="/reports" element={
          <PrivateRoute>
            <Reports />
          </PrivateRoute>
        } />

        <Route path="/settings" element={
          <PrivateRoute>
            <Settings />
          </PrivateRoute>
        } />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <Toaster position="top-right" />
    </Router>
  );
}
