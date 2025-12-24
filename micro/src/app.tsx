import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import Dashboard from './pages/Dashboard';
import Invoices from './pages/Invoices';
import InvoiceEditor from './pages/InvoiceEditor';
import Clients from './pages/Clients';
import Products from './pages/Products';
import Login from './pages/Login';
import Register from './pages/Register';
import HomePage from './pages/HomePage';

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
