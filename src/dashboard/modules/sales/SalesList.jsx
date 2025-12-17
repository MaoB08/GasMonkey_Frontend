import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { salesService } from './salesService';
import { useAuth } from '../../../auth/useAuth';
import { ShoppingCart, DollarSign, Clock, CheckCircle, Plus, Search } from 'lucide-react';
import Swal from 'sweetalert2';
import './sales.css';

export function SalesList() {
    const { getToken } = useAuth();
    const [sales, setSales] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        page: 1,
        limit: 20,
        state: '',
        payment_status: '',
        date_from: '',
        date_to: ''
    });
    const [pagination, setPagination] = useState({});

    useEffect(() => {
        loadSales();
    }, [filters]);

    const loadSales = async () => {
        try {
            setLoading(true);
            const token = getToken();
            const response = await salesService.getSales(filters, token);
            setSales(response.sales);
            setPagination(response.pagination);
        } catch (error) {
            console.error('Error cargando ventas:', error);
            Swal.fire('Error', 'No se pudieron cargar las ventas', 'error');
        } finally {
            setLoading(false);
        }
    };

    const getStateBadge = (state) => {
        const badges = {
            PAID: 'badge-paid',
            PENDING: 'badge-pending',
            CREDIT: 'badge-credit'
        };
        const labels = {
            PAID: 'Pagado',
            PENDING: 'Pendiente',
            CREDIT: 'Crédito'
        };
        return <span className={`badge ${badges[state]}`}>{labels[state]}</span>;
    };

    const getPaymentStatusBadge = (status) => {
        const badges = {
            CASH: 'badge-cash',
            TRANSFER: 'badge-transfer',
            CARD: 'badge-card',
            CREDIT: 'badge-credit',
            APARTADO: 'badge-apartado'
        };
        const labels = {
            CASH: 'Efectivo',
            TRANSFER: 'Transferencia',
            CARD: 'Tarjeta',
            CREDIT: 'Crédito',
            APARTADO: 'Apartado'
        };
        return <span className={`badge ${badges[status]}`}>{labels[status]}</span>;
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0
        }).format(amount);
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('es-CO');
    };

    // Calculate statistics
    const totalSales = sales.length;
    const totalRevenue = sales.reduce((sum, sale) => sum + parseFloat(sale.total || 0), 0);
    const pendingSales = sales.filter(s => s.state === 'PENDING').length;
    const completedSales = sales.filter(s => s.state === 'PAID').length;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="px-4 sm:px-6 lg:px-8 py-8">
                {/* Header with Gradient */}
                <div className="bg-gradient-to-r from-purple-600 to-pink-700 rounded-2xl shadow-xl p-8 mb-8">
                    <div className="sm:flex sm:items-center sm:justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                                <ShoppingCart className="h-8 w-8 text-white" />
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-white">Gestión de Ventas</p>
                                <p className="mt-1 text-purple-100">
                                    Administra las ventas del sistema
                                </p>
                            </div>
                        </div>
                        <div className="mt-4 sm:mt-0">
                            <Link
                                to="/home/ventas/nueva"
                                className="inline-flex items-center px-6 py-3 border-2 border-white/30 rounded-xl shadow-lg text-sm font-semibold text-white bg-white/10 backdrop-blur-sm hover:bg-white/20 hover:border-white/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition-all transform hover:scale-105"
                            >
                                <Plus className="h-5 w-5 mr-2" />
                                Nueva Venta
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 transform transition-all hover:scale-105">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-semibold text-gray-600">Total Ventas</p>
                                <h2 className="text-3xl font-bold text-gray-900 mt-2">{totalSales}</h2>
                            </div>
                            <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-3 rounded-xl">
                                <ShoppingCart className="h-8 w-8 text-blue-600" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 transform transition-all hover:scale-105">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-semibold text-gray-600">Ingresos Totales</p>
                                <h2 className="text-2xl font-bold text-green-600 mt-2">
                                    {formatCurrency(totalRevenue)}
                                </h2>
                            </div>
                            <div className="bg-gradient-to-br from-green-100 to-green-200 p-3 rounded-xl">
                                <DollarSign className="h-8 w-8 text-green-600" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 transform transition-all hover:scale-105">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-semibold text-gray-600">Pendientes</p>
                                <h2 className="text-3xl font-bold text-yellow-600 mt-2">{pendingSales}</h2>
                            </div>
                            <div className="bg-gradient-to-br from-yellow-100 to-yellow-200 p-3 rounded-xl">
                                <Clock className="h-8 w-8 text-yellow-600" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 transform transition-all hover:scale-105">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-semibold text-gray-600">Completadas</p>
                                <h2 className="text-3xl font-bold text-purple-600 mt-2">{completedSales}</h2>
                            </div>
                            <div className="bg-gradient-to-br from-purple-100 to-purple-200 p-3 rounded-xl">
                                <CheckCircle className="h-8 w-8 text-purple-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-6">
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="bg-purple-100 p-2 rounded-lg">
                            <Search className="h-5 w-5 text-purple-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">Filtros de Búsqueda</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="filter-group">
                            <label className="block text-sm font-semibold text-gray-600 mb-2">Estado</label>
                            <select
                                value={filters.state}
                                onChange={(e) => setFilters({ ...filters, state: e.target.value, page: 1 })}
                                className="w-full px-4 py-2.5 rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 hover:border-gray-400 sm:text-sm transition-colors"
                            >
                                <option value="">Todos</option>
                                <option value="PAID">Pagado</option>
                                <option value="PENDING">Pendiente</option>
                                <option value="CREDIT">Crédito</option>
                            </select>
                        </div>

                        <div className="filter-group">
                            <label className="block text-sm font-semibold text-gray-600 mb-2">Método de Pago</label>
                            <select
                                value={filters.payment_status}
                                onChange={(e) => setFilters({ ...filters, payment_status: e.target.value, page: 1 })}
                                className="w-full px-4 py-2.5 rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 hover:border-gray-400 sm:text-sm transition-colors"
                            >
                                <option value="">Todos</option>
                                <option value="CASH">Efectivo</option>
                                <option value="TRANSFER">Transferencia</option>
                                <option value="CARD">Tarjeta</option>
                                <option value="CREDIT">Crédito</option>
                                <option value="APARTADO">Apartado</option>
                            </select>
                        </div>

                        <div className="filter-group">
                            <label className="block text-sm font-semibold text-gray-600 mb-2">Fecha Desde</label>
                            <input
                                type="date"
                                value={filters.date_from}
                                onChange={(e) => setFilters({ ...filters, date_from: e.target.value, page: 1 })}
                                className="w-full px-4 py-2.5 rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 hover:border-gray-400 sm:text-sm transition-colors"
                            />
                        </div>

                        <div className="filter-group">
                            <label className="block text-sm font-semibold text-gray-600 mb-2">Fecha Hasta</label>
                            <input
                                type="date"
                                value={filters.date_to}
                                onChange={(e) => setFilters({ ...filters, date_to: e.target.value, page: 1 })}
                                className="w-full px-4 py-2.5 rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 hover:border-gray-400 sm:text-sm transition-colors"
                            />
                        </div>
                    </div>
                </div>

                {/* Table */}
                {loading ? (
                    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-12 text-center">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                        <p className="mt-4 text-gray-600 font-medium">Cargando ventas...</p>
                    </div>
                ) : (
                    <>
                        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                                    <ShoppingCart className="h-5 w-5 text-green-600 mr-2" />
                                    Lista de Ventas
                                </h3>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                                        <tr>
                                            <th className="px-6 py-4 text-xs font-bold text-gray-600 uppercase tracking-wider">ID</th>
                                            <th className="px-6 py-4 text-xs font-bold text-gray-600 uppercase tracking-wider">Fecha</th>
                                            <th className="px-6 py-4 text-xs font-bold text-gray-600 uppercase tracking-wider">Cliente</th>
                                            <th className="px-6 py-4 text-xs font-bold text-gray-600 uppercase tracking-wider">Total</th>
                                            <th className="px-6 py-4 text-xs font-bold text-gray-600 uppercase tracking-wider">Estado</th>
                                            <th className="px-6 py-4 text-xs font-bold text-gray-600 uppercase tracking-wider">Método Pago</th>
                                            <th className="px-6 py-4 text-xs font-bold text-gray-600 uppercase tracking-wider text-right">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {sales.length === 0 ? (
                                            <tr>
                                                <td colSpan="7" className="text-center py-12 text-gray-500">
                                                    <ShoppingCart className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                                                    <p className="font-medium">No se encontraron ventas</p>
                                                </td>
                                            </tr>
                                        ) : (
                                            sales.map((sale, index) => (
                                                <tr
                                                    key={sale.cod_sale}
                                                    className={`transition-all duration-150 ${index % 2 === 0 ? 'bg-white hover:bg-green-50' : 'bg-gray-50/50 hover:bg-green-50'
                                                        }`}
                                                >
                                                    <td className="px-6 py-4 font-semibold text-gray-900">#{sale.cod_sale}</td>
                                                    <td className="px-6 py-4 text-gray-700">{formatDate(sale.date)}</td>
                                                    <td className="px-6 py-4 text-gray-700">
                                                        {sale.client ?
                                                            `${sale.client.first_name} ${sale.client.last_name1}` :
                                                            'N/A'
                                                        }
                                                    </td>
                                                    <td className="px-6 py-4 text-gray-900 font-bold">
                                                        {formatCurrency(sale.total)}
                                                    </td>
                                                    <td className="px-6 py-4">{getStateBadge(sale.state)}</td>
                                                    <td className="px-6 py-4">{getPaymentStatusBadge(sale.payment_status)}</td>
                                                    <td className="px-6 py-4 text-right">
                                                        <Link
                                                            to={`/home/ventas/${sale.cod_sale}`}
                                                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-semibold rounded-lg text-white bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all transform hover:scale-105"
                                                            title="Ver detalle"
                                                        >
                                                            Ver Detalle
                                                        </Link>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Pagination */}
                        {pagination.totalPages > 1 && (
                            <div className="flex justify-between items-center p-4 text-sm text-gray-600">
                                <p>
                                    Mostrando página {pagination.page} de {pagination.totalPages}
                                </p>

                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
                                        disabled={filters.page === 1}
                                        className={`px-3 py-1 rounded-md border ${filters.page === 1 ? "text-gray-400 cursor-not-allowed" : "hover:bg-gray-100"
                                            }`}
                                    >
                                        Anterior
                                    </button>

                                    <button
                                        onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
                                        disabled={filters.page === pagination.totalPages}
                                        className={`px-3 py-1 rounded-md border ${filters.page === pagination.totalPages
                                            ? "text-gray-400 cursor-not-allowed"
                                            : "hover:bg-gray-100"
                                            }`}
                                    >
                                        Siguiente
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
