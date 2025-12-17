import React, { useState, useEffect } from 'react';
import { BarChart3, ShoppingCart, DollarSign, Package, TrendingUp } from 'lucide-react';
import { analyticsService } from './analyticsService';
import KPICard from './components/KPICard';
import SalesTrendChart from './components/SalesTrendChart';
import TopProductsChart from './components/TopProductsChart';
import PaymentMethodsChart from './components/PaymentMethodsChart';
import LowStockAlert from './components/LowStockAlert';
import RealtimeIndicator from './components/RealtimeIndicator';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function Analytics() {
    const [loading, setLoading] = useState(true);
    const [overview, setOverview] = useState(null);
    const [salesTrend, setSalesTrend] = useState(null);
    const [topProducts, setTopProducts] = useState([]);
    const [paymentMethods, setPaymentMethods] = useState({});
    const [lowStock, setLowStock] = useState([]);
    const [lastUpdate, setLastUpdate] = useState('');
    const [period, setPeriod] = useState('week');

    const loadAnalytics = async () => {
        try {
            setLoading(true);

            // Load all data in parallel
            const [overviewData, trendData, productsData, paymentsData, stockData] = await Promise.all([
                analyticsService.getOverview(),
                analyticsService.getSalesTrend(period),
                analyticsService.getTopProducts(10),
                analyticsService.getPaymentMethods(),
                analyticsService.getLowStock()
            ]);

            setOverview(overviewData);
            setSalesTrend(trendData);
            setTopProducts(productsData);
            setPaymentMethods(paymentsData);
            setLowStock(stockData);
            setLastUpdate(format(new Date(), 'HH:mm:ss', { locale: es }));
        } catch (error) {
            console.error('Error loading analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAnalytics();

        // Auto-refresh every 30 seconds
        const interval = setInterval(loadAnalytics, 30000);
        return () => clearInterval(interval);
    }, [period]);

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0
        }).format(value);
    };

    if (loading && !overview) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
                    <p className="text-gray-600 font-medium">Cargando analytics...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-700 rounded-2xl shadow-xl p-8 mb-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                                <BarChart3 className="h-8 w-8 text-white" />
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-white">Dashboard de Analytics</p>
                                <p className="mt-1 text-indigo-100">
                                    Métricas y estadísticas en tiempo real
                                </p>
                            </div>
                        </div>
                        <RealtimeIndicator lastUpdate={lastUpdate} />
                    </div>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <KPICard
                        title="Ventas Hoy"
                        value={overview?.today?.sales || 0}
                        subtitle={formatCurrency(overview?.today?.revenue || 0)}
                        icon={ShoppingCart}
                        color="blue"
                    />
                    <KPICard
                        title="Ingresos Hoy"
                        value={formatCurrency(overview?.today?.revenue || 0)}
                        subtitle={`${overview?.today?.products_sold || 0} productos vendidos`}
                        icon={DollarSign}
                        color="green"
                    />
                    <KPICard
                        title="Ventas Semana"
                        value={overview?.week?.sales || 0}
                        subtitle={formatCurrency(overview?.week?.revenue || 0)}
                        icon={TrendingUp}
                        trend={overview?.week?.growth}
                        color="purple"
                    />
                    <KPICard
                        title="Ventas Mes"
                        value={overview?.month?.sales || 0}
                        subtitle={formatCurrency(overview?.month?.revenue || 0)}
                        icon={Package}
                        trend={overview?.month?.growth}
                        color="pink"
                    />
                </div>

                {/* Period Selector */}
                <div className="mb-6 flex justify-end">
                    <div className="bg-white rounded-lg shadow-md p-1 inline-flex">
                        <button
                            onClick={() => setPeriod('day')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${period === 'day'
                                ? 'bg-indigo-600 text-white'
                                : 'text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            Día
                        </button>
                        <button
                            onClick={() => setPeriod('week')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${period === 'week'
                                ? 'bg-indigo-600 text-white'
                                : 'text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            Semana
                        </button>
                        <button
                            onClick={() => setPeriod('month')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${period === 'month'
                                ? 'bg-indigo-600 text-white'
                                : 'text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            Mes
                        </button>
                    </div>
                </div>

                {/* Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {salesTrend && (
                        <SalesTrendChart
                            data={salesTrend.data}
                            labels={salesTrend.labels}
                        />
                    )}
                    {topProducts.length > 0 && (
                        <TopProductsChart products={topProducts.slice(0, 5)} />
                    )}
                </div>

                {/* Bottom Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {Object.keys(paymentMethods).length > 0 && (
                        <PaymentMethodsChart data={paymentMethods} />
                    )}
                    <LowStockAlert products={lowStock} />
                </div>
            </div>
        </div>
    );
}
