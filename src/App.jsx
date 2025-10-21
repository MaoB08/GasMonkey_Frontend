import { Routes, Route, Navigate } from "react-router-dom";
import { LoginForm } from "./auth/LoginForm";
import Home from "./home/Home";
import ForgotPassword from "./forgot-password/ForgotPassword";
import Dashboard from "./dashboard/Dashboard";

import Productos from "./dashboard/modules/productos/Productos";

function App() {
  const isAuthenticated = !!localStorage.getItem("accessToken");

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" />} />
      <Route path="/home" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}>
        <Route index element={<Home />} />
        <Route path="productos" element={<Productos />} />
        {/* <Route path="usuarios" element={<Usuarios />} /> */}
        {/* <Route path="ventas" element={<Ventas />} /> */}
        {/* <Route path="soporte" element={<Soporte />} /> */}
      </Route>
      <Route path="/login" element={<LoginForm />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
    </Routes>
  );
}

export default App;

