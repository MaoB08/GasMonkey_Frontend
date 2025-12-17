# 🎨 GasMonkey Frontend - React Application

![React](https://img.shields.io/badge/React-19.1-blue.svg)
![Vite](https://img.shields.io/badge/Vite-7.0-purple.svg)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.1-cyan.svg)

Frontend del sistema GasMonkey - Aplicación web moderna construida con React, Vite y TailwindCSS.

---

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Tecnologías](#-tecnologías)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Uso](#-uso)
- [Módulos](#-módulos)
- [Componentes](#-componentes)
- [Servicios](#-servicios)
- [Estilos](#-estilos)

---

## ✨ Características

- ✅ **React 19** con hooks modernos
- ✅ **Vite** para desarrollo rápido
- ✅ **TailwindCSS 4** para estilos
- ✅ **React Router 7** para navegación
- ✅ **Recharts** para gráficos y analytics
- ✅ **SweetAlert2** para alertas elegantes
- ✅ **Axios** para peticiones HTTP
- ✅ **Lucide & Heroicons** para iconografía
- ✅ **Responsive Design** para todos los dispositivos
- ✅ **Dark Mode** ready
- ✅ **ESLint** para calidad de código

---

## 🛠️ Tecnologías

### Core
- **React** ^19.1.0 - Librería UI
- **React DOM** ^19.1.0 - Renderizado
- **Vite** ^7.0.4 - Build tool y dev server

### Routing & State
- **React Router DOM** ^7.7.0 - Enrutamiento SPA

### UI & Styling
- **TailwindCSS** ^4.1.11 - Framework CSS
- **@tailwindcss/vite** ^4.1.11 - Plugin de Vite
- **@tailwindcss/postcss** ^4.1.11 - PostCSS
- **Lucide React** ^0.535.0 - Iconos
- **@heroicons/react** ^2.2.0 - Iconos de Heroicons

### Data & Charts
- **Recharts** ^3.5.1 - Gráficos y visualización
- **date-fns** ^4.1.0 - Manejo de fechas

### HTTP & API
- **Axios** ^1.13.2 - Cliente HTTP

### UI Components
- **SweetAlert2** ^11.22.2 - Alertas y modales

### Development
- **ESLint** ^9.30.1 - Linter
- **@vitejs/plugin-react** ^4.6.0 - Plugin React para Vite
- **PostCSS** ^8.5.6 - Procesador CSS
- **Autoprefixer** ^10.4.21 - Prefijos CSS

---

## 📁 Estructura del Proyecto

```
GasMonkey-project/
├── public/                        # Archivos estáticos
│   └── favicon.ico
│
├── src/
│   ├── assets/                    # Recursos (imágenes, logos)
│   │   └── logo.png
│   │
│   ├── auth/                      # Módulo de autenticación
│   │   ├── Login.jsx              # Página de login
│   │   ├── Register.jsx           # Página de registro
│   │   ├── authService.js         # Servicio de autenticación
│   │   ├── authStyles.css         # Estilos de auth
│   │   └── VerifyCode.jsx         # Verificación 2FA
│   │
│   ├── forgot-password/           # Recuperación de contraseña
│   │   ├── ForgotPassword.jsx
│   │   ├── ResetPassword.jsx
│   │   ├── VerifyToken.jsx
│   │   └── forgotPasswordStyles.css
│   │
│   ├── components/                # Componentes reutilizables
│   │   ├── DeleteModal.jsx
│   │   ├── LoadingSpinner.jsx
│   │   ├── Modal.jsx
│   │   ├── Pagination.jsx
│   │   └── SearchBar.jsx
│   │
│   ├── dashboard/                 # Dashboard principal
│   │   ├── modules/               # Módulos de la aplicación
│   │   │   │
│   │   │   ├── analytics/         # Analytics y reportes
│   │   │   │   ├── Analytics.jsx
│   │   │   │   ├── DashboardCards.jsx
│   │   │   │   ├── ProductsChart.jsx
│   │   │   │   ├── RecentSales.jsx
│   │   │   │   ├── SalesChart.jsx
│   │   │   │   ├── TopProducts.jsx
│   │   │   │   └── analyticsService.js
│   │   │   │
│   │   │   ├── clients/           # Gestión de clientes
│   │   │   │   ├── Clients.jsx
│   │   │   │   └── clientsService.js
│   │   │   │
│   │   │   ├── inventory/         # Inventario
│   │   │   │   ├── Categories.jsx
│   │   │   │   ├── CategoryForm.jsx
│   │   │   │   ├── CategoryList.jsx
│   │   │   │   ├── Products.jsx
│   │   │   │   ├── ProductForm.jsx
│   │   │   │   ├── ProductList.jsx
│   │   │   │   ├── inventory.css
│   │   │   │   └── inventoryApi.js
│   │   │   │
│   │   │   ├── invoices/          # Facturación
│   │   │   │   ├── CreateInvoice.jsx
│   │   │   │   ├── InvoiceDetail.jsx
│   │   │   │   ├── InvoiceList.jsx
│   │   │   │   ├── InvoicePreview.jsx
│   │   │   │   ├── invoiceService.js
│   │   │   │   ├── invoiceStyles.css
│   │   │   │   └── formatters.js
│   │   │   │
│   │   │   ├── sales/             # Ventas
│   │   │   │   ├── Sales.jsx
│   │   │   │   ├── SaleDetail.jsx
│   │   │   │   ├── PaymentModal.jsx
│   │   │   │   ├── salesService.js
│   │   │   │   └── salesStyles.css
│   │   │   │
│   │   │   ├── soporte/           # Soporte
│   │   │   │   ├── Soporte.jsx
│   │   │   │   └── soporteStyles.css
│   │   │   │
│   │   │   └── usuarios/          # Usuarios
│   │   │       ├── Usuarios.jsx
│   │   │       └── usuariosStyles.css
│   │   │
│   │   ├── Dashboard.jsx          # Layout del dashboard
│   │   ├── Navbar.jsx             # Barra de navegación
│   │   └── Sidebar.jsx            # Menú lateral
│   │
│   ├── home/                      # Página de inicio
│   │   └── Home.jsx
│   │
│   ├── services/                  # Servicios globales
│   │   └── api.js                 # Configuración de Axios
│   │
│   ├── utils/                     # Utilidades
│   │   ├── formatters.js          # Formateadores
│   │   └── validators.js          # Validadores
│   │
│   ├── App.jsx                    # Componente principal
│   ├── App.css                    # Estilos globales
│   ├── main.jsx                   # Punto de entrada
│   └── index.css                  # Estilos base
│
├── index.html                     # HTML principal
├── vite.config.js                 # Configuración de Vite
├── tailwind.config.js             # Configuración de Tailwind
├── postcss.config.js              # Configuración de PostCSS
├── eslint.config.js               # Configuración de ESLint
├── package.json
└── .env.example                   # Ejemplo de variables de entorno
```

---

## 🚀 Instalación

### 1. Requisitos Previos

- Node.js >= 18.0.0
- npm >= 9.0.0

### 2. Instalar Dependencias

```bash
cd GasMonkey-project
npm install
```

### 3. Configurar Variables de Entorno

Crea un archivo `.env` en la raíz:

```env
VITE_API_URL=http://localhost:3000/api
```

---

## ⚙️ Configuración

### Variables de Entorno

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `VITE_API_URL` | URL base de la API | `http://localhost:3000/api` |

### Configuración de Vite

El proyecto usa Vite con las siguientes configuraciones:

```javascript
// vite.config.js
export default {
  plugins: [react()],
  server: {
    port: 5173,
    open: true
  }
}
```

### Configuración de TailwindCSS

TailwindCSS 4 está configurado con el plugin de Vite:

```javascript
// tailwind.config.js
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {}
  }
}
```

---

## 🎯 Uso

### Modo Desarrollo

```bash
npm run dev
```

Abre automáticamente `http://localhost:5173`

### Build para Producción

```bash
npm run build
```

Los archivos se generan en `dist/`

### Preview de Producción

```bash
npm run preview
```

### Linting

```bash
npm run lint
```

---

## 📦 Módulos

### 1. Analytics 📊

**Ubicación**: `src/dashboard/modules/analytics/`

Módulo de análisis y reportes con:
- Dashboard con métricas en tiempo real
- Gráficos de ventas (Recharts)
- Top productos vendidos
- Ventas recientes
- Tarjetas de resumen

**Componentes**:
- `Analytics.jsx` - Página principal
- `DashboardCards.jsx` - Tarjetas de métricas
- `SalesChart.jsx` - Gráfico de ventas
- `ProductsChart.jsx` - Gráfico de productos
- `TopProducts.jsx` - Lista de top productos
- `RecentSales.jsx` - Ventas recientes

### 2. Clientes 👥

**Ubicación**: `src/dashboard/modules/clients/`

Gestión completa de clientes:
- Listado con búsqueda y filtros
- Crear/editar/eliminar clientes
- Validación de documentos
- Integración con ciudades

**Componentes**:
- `Clients.jsx` - Página principal

### 3. Inventario 📦

**Ubicación**: `src/dashboard/modules/inventory/`

Sistema de inventario con:
- Gestión de categorías
- Productos con códigos automáticos
- Control de stock
- Alertas de bajo inventario
- Filtros avanzados

**Componentes**:
- `Categories.jsx` - Gestión de categorías
- `CategoryForm.jsx` - Formulario de categoría
- `CategoryList.jsx` - Lista de categorías
- `Products.jsx` - Gestión de productos
- `ProductForm.jsx` - Formulario de producto
- `ProductList.jsx` - Lista de productos

### 4. Facturación 🧾

**Ubicación**: `src/dashboard/modules/invoices/`

Facturación electrónica DIAN:
- Crear facturas electrónicas
- Validación local
- Envío a DIAN
- Generación de PDF
- Búsqueda de clientes por documento

**Componentes**:
- `InvoiceList.jsx` - Lista de facturas
- `CreateInvoice.jsx` - Crear factura
- `InvoiceDetail.jsx` - Detalle de factura
- `InvoicePreview.jsx` - Vista previa

### 5. Ventas 💰

**Ubicación**: `src/dashboard/modules/sales/`

Punto de venta completo:
- Ventas rápidas
- Múltiples métodos de pago
- Sistema de apartados
- Historial de ventas
- Impresión de recibos

**Componentes**:
- `Sales.jsx` - Punto de venta
- `SaleDetail.jsx` - Detalle de venta
- `PaymentModal.jsx` - Modal de pagos

### 6. Usuarios 👤

**Ubicación**: `src/dashboard/modules/usuarios/`

Gestión de usuarios:
- CRUD de usuarios
- Roles y permisos
- Validación de datos

**Componentes**:
- `Usuarios.jsx` - Gestión de usuarios

### 7. Soporte 💬

**Ubicación**: `src/dashboard/modules/soporte/`

Sistema de soporte:
- Envío de tickets
- Formulario de contacto

**Componentes**:
- `Soporte.jsx` - Formulario de soporte

---

## 🧩 Componentes Reutilizables

### LoadingSpinner

Spinner de carga animado.

```jsx
<LoadingSpinner />
```

### DeleteModal

Modal de confirmación para eliminar.

```jsx
<DeleteModal
  isOpen={isOpen}
  onClose={handleClose}
  onConfirm={handleDelete}
  itemName="Producto X"
/>
```

### Modal

Modal genérico reutilizable.

```jsx
<Modal isOpen={isOpen} onClose={handleClose} title="Título">
  <p>Contenido del modal</p>
</Modal>
```

### Pagination

Componente de paginación.

```jsx
<Pagination
  currentPage={page}
  totalPages={totalPages}
  onPageChange={setPage}
/>
```

### SearchBar

Barra de búsqueda con debounce.

```jsx
<SearchBar
  value={search}
  onChange={setSearch}
  placeholder="Buscar..."
/>
```

---

## 🔌 Servicios

### API Service (`services/api.js`)

Configuración global de Axios:

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para agregar token
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

### Auth Service (`auth/authService.js`)

Servicio de autenticación:

```javascript
import api from '../services/api';

export const login = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
};

export const register = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};
```

### Inventory API (`inventory/inventoryApi.js`)

Servicios de inventario:

```javascript
import api from '../../services/api';

export const categoryService = {
  getAll: () => api.get('/categories'),
  create: (data) => api.post('/categories', data),
  update: (id, data) => api.put(`/categories/${id}`, data),
  delete: (id) => api.delete(`/categories/${id}`)
};

export const productService = {
  getAll: (params) => api.get('/inventory-products', { params }),
  getById: (id) => api.get(`/inventory-products/${id}`),
  create: (data) => api.post('/inventory-products', data),
  update: (id, data) => api.put(`/inventory-products/${id}`, data),
  delete: (id) => api.delete(`/inventory-products/${id}`),
  previewCode: (categoryId) => api.get('/inventory-products/preview-code', {
    params: { category_id: categoryId }
  })
};
```

---

## 🎨 Estilos

### TailwindCSS

El proyecto usa TailwindCSS 4 con utilidades personalizadas.

**Clases comunes**:
```css
/* Botones */
.btn-primary
.btn-secondary
.btn-danger

/* Cards */
.card
.card-header
.card-body

/* Forms */
.form-input
.form-label
.form-error
```

### CSS Modules

Cada módulo tiene sus propios estilos:

- `authStyles.css` - Estilos de autenticación
- `inventory.css` - Estilos de inventario
- `invoiceStyles.css` - Estilos de facturas
- `salesStyles.css` - Estilos de ventas
- `usuariosStyles.css` - Estilos de usuarios
- `soporteStyles.css` - Estilos de soporte

### Responsive Design

El diseño es completamente responsive:

```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Contenido */}
</div>
```

---

## 🔐 Autenticación

### Flujo de Login

1. Usuario ingresa credenciales en `Login.jsx`
2. Se envía petición a `/api/auth/login`
3. Se recibe token JWT
4. Token se guarda en `localStorage`
5. Se redirige al dashboard

### Protección de Rutas

```jsx
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    return <Navigate to="/login" />;
  }
  
  return children;
};
```

### Uso en App.jsx

```jsx
<Route path="/dashboard" element={
  <ProtectedRoute>
    <Dashboard />
  </ProtectedRoute>
} />
```

---

## 📊 Gráficos con Recharts

### Ejemplo de Gráfico de Ventas

```jsx
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const SalesChart = ({ data }) => {
  return (
    <LineChart width={600} height={300} data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="date" />
      <YAxis />
      <Tooltip />
      <Line type="monotone" dataKey="sales" stroke="#8884d8" />
    </LineChart>
  );
};
```

---

## 🚨 Alertas con SweetAlert2

### Ejemplo de Alerta de Éxito

```javascript
import Swal from 'sweetalert2';

Swal.fire({
  icon: 'success',
  title: '¡Éxito!',
  text: 'Producto creado correctamente',
  timer: 2000
});
```

### Confirmación de Eliminación

```javascript
const result = await Swal.fire({
  title: '¿Estás seguro?',
  text: 'Esta acción no se puede deshacer',
  icon: 'warning',
  showCancelButton: true,
  confirmButtonText: 'Sí, eliminar',
  cancelButtonText: 'Cancelar'
});

if (result.isConfirmed) {
  // Eliminar
}
```

---

## 🧪 Testing

```bash
# Ejecutar linter
npm run lint

# Fix automático
npm run lint -- --fix
```

---

## 🚀 Deployment

### Build

```bash
npm run build
```

### Deploy a Netlify

```bash
# Instalar Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir=dist
```

### Deploy a Vercel

```bash
# Instalar Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

---

## 📝 Buenas Prácticas

1. **Componentes**: Mantén componentes pequeños y reutilizables
2. **Hooks**: Usa hooks personalizados para lógica compartida
3. **Servicios**: Centraliza las llamadas a API en servicios
4. **Estilos**: Usa TailwindCSS para consistencia
5. **Validación**: Valida datos antes de enviar al backend
6. **Errores**: Maneja errores con try/catch y alertas
7. **Loading**: Muestra estados de carga
8. **Responsive**: Diseña mobile-first

---

## 🔧 Troubleshooting

### Error de CORS

Si ves errores de CORS, verifica que el backend tenga configurado:

```javascript
app.use(cors({
  origin: 'http://localhost:5173'
}));
```

### Error de Variables de Entorno

Las variables deben empezar con `VITE_`:

```env
VITE_API_URL=http://localhost:3000/api
```

### Error de Build

Limpia caché y reinstala:

```bash
rm -rf node_modules dist
npm install
npm run build
```

---

## 📚 Recursos

- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [TailwindCSS Documentation](https://tailwindcss.com/)
- [React Router Documentation](https://reactrouter.com/)
- [Recharts Documentation](https://recharts.org/)

---

**Desarrollado con ❤️ para GasMonkey**
