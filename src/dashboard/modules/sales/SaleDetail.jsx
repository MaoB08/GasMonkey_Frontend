import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { salesService } from './salesService';
import { useAuth } from '../../../auth/useAuth';
import Swal from 'sweetalert2';
import './sales.css';

export function SaleDetail() {
    const { id } = useParams();
    const { getToken } = useAuth();
    const navigate = useNavigate();

    const [sale, setSale] = useState(null);
    const [remainingBalance, setRemainingBalance] = useState(0);
    const [loading, setLoading] = useState(true);
    const [showPaymentModal, setShowPaymentModal] = useState(false);

    useEffect(() => {
        loadSale();
    }, [id]);

    const loadSale = async () => {
        try {
            setLoading(true);
            const token = getToken();
            const response = await salesService.getSaleById(id, token);
            setSale(response.sale);
            setRemainingBalance(response.remainingBalance || 0);
        } catch (error) {
            console.error('Error cargando venta:', error);
            Swal.fire('Error', 'No se pudo cargar la venta', 'error');
            navigate('/home/ventas');
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0
        }).format(amount);
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('es-CO', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatDateTime = (date) => {
        return new Date(date).toLocaleString('es-CO');
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

    if (loading) {
        return <div className="loading-spinner">Cargando venta...</div>;
    }

    if (!sale) {
        return <div>Venta no encontrada</div>;
    }

    return (
        <div className="sale-detail-container">
            <div className="detail-header">
                <div>
                    <h1>Venta #{sale.cod_sale}</h1>
                    <p className="detail-date">{formatDate(sale.date)}</p>
                </div>
                <div className="header-actions">
                    <button
                        onClick={async () => {
                            try {
                                const token = getToken();
                                const API_URL = import.meta.env.VITE_API_URL;
                                const response = await fetch(`${API_URL}/api/sales/${id}/invoice`, {
                                    headers: { 'Authorization': `Bearer ${token}` }
                                });

                                if (response.ok) {
                                    const blob = await response.blob();
                                    const url = window.URL.createObjectURL(blob);
                                    const a = document.createElement('a');
                                    a.href = url;
                                    a.download = `Factura-${sale.cod_sale}.pdf`;
                                    document.body.appendChild(a);
                                    a.click();
                                    window.URL.revokeObjectURL(url);
                                    document.body.removeChild(a);
                                    Swal.fire('Éxito', 'Factura descargada correctamente', 'success');
                                } else {
                                    throw new Error('Error al generar factura');
                                }
                            } catch (error) {
                                console.error('Error descargando factura:', error);
                                Swal.fire('Error', 'No se pudo descargar la factura', 'error');
                            }
                        }}
                        className="btn btn-primary"
                    >
                        📄 Descargar Factura
                    </button>
                    <button onClick={() => navigate('/home/ventas')} className="btn btn-secondary">
                        ← Volver
                    </button>
                </div>
            </div>

            {/* Información general */}
            <div className="detail-grid">
                <div className="detail-card">
                    <h3>Información del Cliente</h3>
                    {sale.client && (
                        <div className="info-rows">
                            <div className="info-row">
                                <span className="label">Nombre:</span>
                                <span>{`${sale.client.first_name} ${sale.client.middle_name || ''} ${sale.client.last_name1} ${sale.client.last_name2 || ''}`.trim()}</span>
                            </div>
                            <div className="info-row">
                                <span className="label">Documento:</span>
                                <span>{sale.client.document_number}</span>
                            </div>
                            {sale.client.email && (
                                <div className="info-row">
                                    <span className="label">Email:</span>
                                    <span>{sale.client.email}</span>
                                </div>
                            )}
                            {sale.client.phone && (
                                <div className="info-row">
                                    <span className="label">Teléfono:</span>
                                    <span>{sale.client.phone}</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="detail-card">
                    <h3>Información de Pago</h3>
                    <div className="info-rows">
                        <div className="info-row">
                            <span className="label">Estado:</span>
                            {getStateBadge(sale.state)}
                        </div>
                        <div className="info-row">
                            <span className="label">Método:</span>
                            <span>{sale.payment_status}</span>
                        </div>
                        {sale.paymentMethod && (
                            <div className="info-row">
                                <span className="label">Forma de pago:</span>
                                <span>{sale.paymentMethod.name}</span>
                            </div>
                        )}
                        <div className="info-row">
                            <span className="label">Tipo de factura:</span>
                            <span>{sale.invoice_type === 'ELECTRONIC' ? 'Electrónica (DIAN)' : 'Normal (PDF)'}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Productos */}
            <div className="detail-card">
                <h3>Productos</h3>
                <table className="detail-table">
                    <thead>
                        <tr>
                            <th>Producto</th>
                            <th>Cantidad</th>
                            <th>Precio Unit.</th>
                            <th>Descuento</th>
                            <th>IVA</th>
                            <th className="text-right">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sale.details && sale.details.map((detail, index) => {
                            const lineTotal = parseFloat(detail.quantity) * parseFloat(detail.unit_price);
                            const lineDiscount = parseFloat(detail.discount_amount);
                            const lineTax = parseFloat(detail.tax_amount);
                            const total = lineTotal - lineDiscount + lineTax;

                            return (
                                <tr key={index}>
                                    <td>{detail.product_name}</td>
                                    <td>{detail.quantity}</td>
                                    <td>{formatCurrency(detail.unit_price)}</td>
                                    <td>
                                        {detail.discount_percentage > 0 ? (
                                            <span>{detail.discount_percentage}% ({formatCurrency(lineDiscount)})</span>
                                        ) : (
                                            '-'
                                        )}
                                    </td>
                                    <td>{detail.tax_percentage}%</td>
                                    <td className="text-right">{formatCurrency(total)}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Totales */}
            <div className="totals-summary">
                <div className="totals-box">
                    <div className="total-row">
                        <span>Subtotal:</span>
                        <span>{formatCurrency(sale.subtotal)}</span>
                    </div>
                    {sale.discount_amount > 0 && (
                        <div className="total-row discount-row">
                            <span>Descuento:</span>
                            <span>-{formatCurrency(sale.discount_amount)}</span>
                        </div>
                    )}
                    <div className="total-row">
                        <span>IVA:</span>
                        <span>{formatCurrency(sale.tax)}</span>
                    </div>
                    <div className="total-row total-final">
                        <span>TOTAL:</span>
                        <span>{formatCurrency(sale.total)}</span>
                    </div>
                </div>
            </div>

            {/* Historial de pagos (APARTADO/CREDIT) */}
            {(sale.payment_status === 'APARTADO' || sale.payment_status === 'CREDIT') && sale.payments && sale.payments.length > 0 && (
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            Historial de Pagos
                        </h3>
                        {remainingBalance > 0 && (
                            <button
                                onClick={() => setShowPaymentModal(true)}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-semibold rounded-lg text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all transform hover:scale-105"
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Agregar Pago
                            </button>
                        )}
                    </div>

                    <div className="space-y-3">
                        {sale.payments.map((payment, index) => (
                            <div key={index} className="bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                                    <div>
                                        <p className="text-xs text-gray-500 font-medium mb-1">Fecha</p>
                                        <p className="text-sm font-semibold text-gray-900">{formatDateTime(payment.payment_date)}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 font-medium mb-1">Monto</p>
                                        <p className="text-sm font-bold text-green-600">{formatCurrency(payment.amount)}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 font-medium mb-1">Método</p>
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                            {payment.paymentMethod?.name || 'N/A'}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 font-medium mb-1">Notas</p>
                                        <p className="text-sm text-gray-700">{payment.notes || '-'}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {remainingBalance > 0 && (
                        <div className="mt-6 bg-gradient-to-r from-orange-50 to-red-50 border-l-4 border-orange-500 rounded-lg p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-700">Saldo Pendiente</p>
                                    <p className="text-2xl font-bold text-orange-600 mt-1">{formatCurrency(remainingBalance)}</p>
                                </div>
                                <svg className="w-12 h-12 text-orange-400 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Notas */}
            {sale.notes && (
                <div className="detail-card">
                    <h3>Notas</h3>
                    <p>{sale.notes}</p>
                </div>
            )}

            {/* Modal de pago */}
            {showPaymentModal && (
                <PaymentModal
                    saleId={sale.cod_sale}
                    remainingBalance={remainingBalance}
                    onClose={() => setShowPaymentModal(false)}
                    onSuccess={() => {
                        setShowPaymentModal(false);
                        loadSale();
                    }}
                />
            )}
        </div>
    );
}

// Modal para agregar pago
function PaymentModal({ saleId, remainingBalance, onClose, onSuccess }) {
    const { getToken } = useAuth();
    const [paymentData, setPaymentData] = useState({
        amount: '',
        payment_method_id: '',
        staff_id: '',
        notes: ''
    });
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [staff, setStaff] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const token = getToken();
            const { paymentMethodService, staffService } = await import('./salesService');
            const [pmResponse, staffResponse] = await Promise.all([
                paymentMethodService.getPaymentMethods(token),
                staffService.getStaff(token)
            ]);
            setPaymentMethods(pmResponse.paymentMethods);
            setStaff(staffResponse.staff);
        } catch (error) {
            console.error('Error cargando datos:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (parseFloat(paymentData.amount) > remainingBalance) {
            Swal.fire('Error', 'El monto excede el saldo pendiente', 'error');
            return;
        }

        setLoading(true);

        try {
            const token = getToken();
            await salesService.addPayment(saleId, paymentData, token);
            Swal.fire('Éxito', 'Pago registrado correctamente', 'success');
            onSuccess();
        } catch (error) {
            console.error('Error agregando pago:', error);
            Swal.fire('Error', error.message, 'error');
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0
        }).format(amount);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-t-2xl p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            <h2 className="text-xl font-bold text-white">Agregar Pago</h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                <div className="p-6">
                    {/* Balance Display */}
                    <div className="bg-gradient-to-r from-orange-50 to-red-50 border-l-4 border-orange-500 rounded-lg p-4 mb-6">
                        <p className="text-sm font-medium text-gray-700 mb-1">Saldo Pendiente</p>
                        <p className="text-3xl font-bold text-orange-600">{formatCurrency(remainingBalance)}</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Monto */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Monto a Pagar *
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">$</span>
                                <input
                                    type="number"
                                    value={paymentData.amount}
                                    onChange={(e) => setPaymentData({ ...paymentData, amount: e.target.value })}
                                    placeholder="0.00"
                                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                    min="0.01"
                                    max={remainingBalance}
                                    step="0.01"
                                    required
                                />
                            </div>
                        </div>

                        {/* Método de Pago */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Método de Pago *
                            </label>
                            <select
                                value={paymentData.payment_method_id}
                                onChange={(e) => setPaymentData({ ...paymentData, payment_method_id: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                required
                            >
                                <option value="">Seleccione método</option>
                                {paymentMethods.map(pm => (
                                    <option key={pm.id} value={pm.id}>{pm.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* Vendedor */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Vendedor *
                            </label>
                            <select
                                value={paymentData.staff_id}
                                onChange={(e) => setPaymentData({ ...paymentData, staff_id: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                required
                            >
                                <option value="">Seleccione vendedor</option>
                                {staff.map(s => (
                                    <option key={s.id} value={s.id}>{s.fullName}</option>
                                ))}
                            </select>
                        </div>

                        {/* Notas */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Notas (Opcional)
                            </label>
                            <textarea
                                value={paymentData.notes}
                                onChange={(e) => setPaymentData({ ...paymentData, notes: e.target.value })}
                                placeholder="Notas adicionales..."
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                                rows="3"
                            />
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Procesando...
                                    </span>
                                ) : 'Registrar Pago'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
