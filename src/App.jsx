import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthContext } from "./auth/AuthContext";
import { LoginForm } from "./auth/LoginForm";
import Home from "./home/Home";
import { ForgotPassword } from "./forgot-password/ForgotPassword";
import Dashboard from "./dashboard/Dashboard";

import Usuarios from "./dashboard/modules/usuarios/Usuarios";
import InvoicesPage from "./dashboard/modules/invoices/InvoicesPage";
import { CreateInvoice } from "./dashboard/modules/invoices/CreateInvoice";
import InvoiceDetailPage from "./dashboard/modules/invoices/InvoiceDetailPage";
import Categories from "./dashboard/modules/inventory/Categories";
import Products from "./dashboard/modules/inventory/Products";
import Clients from "./dashboard/modules/clients/Clients";
import { SalesList } from "./dashboard/modules/sales/SalesList";
import { CreateSale } from "./dashboard/modules/sales/CreateSale";
import { SaleDetail } from "./dashboard/modules/sales/SaleDetail";
import Analytics from "./dashboard/modules/analytics/Analytics";
import Soporte from "./dashboard/modules/soporte/Soporte";

function App() {
  const { isAuthenticated, loading } = useAuthContext();

  // Show nothing while checking auth state
  if (loading) {
    return null;
  }

  return (
    <Routes>
      <Route path="/" element={isAuthenticated ? <Navigate to="/home" /> : <Navigate to="/login" />} />
      <Route path="/home" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} >
        <Route index element={<Home />} />
        <Route path="productos" element={<Navigate to="/home/inventario/productos" replace />} />
        <Route path="usuarios" element={<Usuarios />} />
        <Route path="clientes" element={<Clients />} />
        <Route path="facturas" element={<InvoicesPage />} />
        <Route path="facturas/crear" element={<CreateInvoice />} />
        <Route path="facturas/:id" element={<InvoiceDetailPage />} />
        <Route path="inventario/categorias" element={<Categories />} />
        <Route path="inventario/productos" element={<Products />} />
        <Route path="ventas" element={<SalesList />} />
        <Route path="ventas/nueva" element={<CreateSale />} />
        <Route path="ventas/:id" element={<SaleDetail />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="soporte" element={<Soporte />} />
      </Route>
      <Route path="/login" element={<LoginForm />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
    </Routes>
  );
}

export default App;

