import React from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, ShoppingCart, Users, Package, FileText, TrendingUp, UserCheck, Box } from 'lucide-react';

export default function Home() {
  const quickAccessCards = [
    {
      title: 'Ventas',
      description: 'Gestiona las ventas del sistema',
      icon: <ShoppingCart className="h-8 w-8" />,
      link: '/home/ventas',
      gradient: 'from-purple-500 to-pink-600',
      bgGradient: 'from-purple-100 to-purple-200',
      iconColor: 'text-purple-600'
    },
    {
      title: 'Clientes',
      description: 'Administra tus clientes',
      icon: <UserCheck className="h-8 w-8" />,
      link: '/home/clientes',
      gradient: 'from-blue-500 to-cyan-600',
      bgGradient: 'from-blue-100 to-blue-200',
      iconColor: 'text-blue-600'
    },
    {
      title: 'Productos',
      description: 'Catálogo de productos',
      icon: <Box className="h-8 w-8" />,
      link: '/home/inventario/productos',
      gradient: 'from-green-500 to-emerald-600',
      bgGradient: 'from-green-100 to-green-200',
      iconColor: 'text-green-600'
    },
    {
      title: 'Usuarios',
      description: 'Gestión de usuarios',
      icon: <Users className="h-8 w-8" />,
      link: '/home/usuarios',
      gradient: 'from-orange-500 to-red-600',
      bgGradient: 'from-orange-100 to-orange-200',
      iconColor: 'text-orange-600'
    },
    {
      title: 'Facturas',
      description: 'Facturación electrónica',
      icon: <FileText className="h-8 w-8" />,
      link: '/home/facturas',
      gradient: 'from-indigo-500 to-purple-600',
      bgGradient: 'from-indigo-100 to-indigo-200',
      iconColor: 'text-indigo-600'
    },
    {
      title: 'Categorías',
      description: 'Categorías de inventario',
      icon: <Package className="h-8 w-8" />,
      link: '/home/inventario/categorias',
      gradient: 'from-teal-500 to-green-600',
      bgGradient: 'from-teal-100 to-teal-200',
      iconColor: 'text-teal-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with Gradient */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-700 rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex items-center space-x-4">
            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
              <LayoutDashboard className="h-10 w-10 text-white" />
            </div>
            <div>
              <p className="text-4xl font-bold text-white">Bienvenido a NexusCore</p>
              <p className="mt-2 text-indigo-100 text-lg">
                Sistema de gestión integral para tu negocio
              </p>
            </div>
          </div>
        </div>

        {/* Quick Access Cards */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-indigo-600" />
            Acceso Rápido
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quickAccessCards.map((card, index) => (
              <Link
                key={index}
                to={card.link}
                className="group bg-white rounded-xl shadow-lg border border-gray-200 p-6 transform transition-all hover:scale-105 hover:shadow-xl"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`bg-gradient-to-br ${card.bgGradient} p-3 rounded-xl group-hover:scale-110 transition-transform`}>
                    <div className={card.iconColor}>
                      {card.icon}
                    </div>
                  </div>
                  <svg
                    className="h-5 w-5 text-gray-400 group-hover:text-indigo-600 transition-colors"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{card.title}</h3>
                <p className="text-gray-600 text-sm">{card.description}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Stats Overview */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Resumen del Sistema</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full mb-3">
                <ShoppingCart className="h-6 w-6 text-white" />
              </div>
              <p className="text-gray-600 text-sm font-semibold">Módulo de Ventas</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">Activo</p>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full mb-3">
                <UserCheck className="h-6 w-6 text-white" />
              </div>
              <p className="text-gray-600 text-sm font-semibold">Gestión de Clientes</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">Activo</p>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full mb-3">
                <Package className="h-6 w-6 text-white" />
              </div>
              <p className="text-gray-600 text-sm font-semibold">Control de Inventario</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">Activo</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
