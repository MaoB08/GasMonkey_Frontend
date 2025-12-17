import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getInvoices, sendInvoiceToDIAN, downloadPDF } from './invoiceService';
import { useAuth } from '../../../auth/useAuth';
import StatusBadge from '../../../components/common/StatusBadge';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import ErrorAlert from '../../../components/common/ErrorAlert';
import { formatCurrency, formatDate } from '../../../utils/formatters';
import { INVOICE_STATUSES } from '../../../utils/constants';
import Swal from 'sweetalert2';

/**
 * Lista de facturas con paginación y acciones
 * @param {object} filters - Filtros aplicados a la lista
 */
export default function InvoiceList({ filters = {} }) {
    const { getToken } = useAuth();
    const navigate = useNavigate();

    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({
        page: 1,
        pages: 1,
        total: 0,
        limit: 20
    });

    // Cargar facturas cuando cambian los filtros o la página
    useEffect(() => {
        loadInvoices();
    }, [filters, pagination.page]);

    const loadInvoices = async () => {
        setLoading(true);
        setError(null);

        try {
            const token = getToken();
            const data = await getInvoices(
                { ...filters, page: pagination.page, limit: pagination.limit },
                token
            );

            setInvoices(data.invoices || []);
            setPagination(prev => ({
                ...prev,
                page: data.page,
                pages: data.pages,
                total: data.total
            }));
        } catch (err) {
            console.error('Error cargando facturas:', err);
            setError('Error al cargar las facturas. Por favor, intenta de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    const handleSendToDIAN = async (invoice) => {
        const result = await Swal.fire({
            title: '¿Enviar factura a DIAN?',
            text: `Factura ${invoice.full_number}`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Sí, enviar',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#3b82f6'
        });

        if (result.isConfirmed) {
            try {
                const token = getToken();
                await sendInvoiceToDIAN(invoice.id, token);
                loadInvoices(); // Recargar lista
            } catch (err) {
                // El error ya se maneja en el servicio con SweetAlert
                console.error('Error enviando a DIAN:', err);
            }
        }
    };

    const handleDownloadPDF = async (invoice) => {
        try {
            const token = getToken();
            await downloadPDF(invoice.id, token);
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo descargar el PDF'
            });
        }
    };

    const handleViewDetail = (invoiceId) => {
        navigate(`/home/facturas/${invoiceId}`);
    };

    const changePage = (newPage) => {
        if (newPage >= 1 && newPage <= pagination.pages) {
            setPagination(prev => ({ ...prev, page: newPage }));
        }
    };

    if (loading) {
        return <LoadingSpinner text="Cargando facturas..." />;
    }

    return (
        <div>
            {error && <ErrorAlert message={error} onClose={() => setError(null)} />}

            {invoices.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg shadow">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No hay facturas</h3>
                    <p className="mt-1 text-sm text-gray-500">
                        {Object.keys(filters).length > 0
                            ? 'No se encontraron facturas con los filtros aplicados'
                            : 'Comienza creando tu primera factura electrónica'}
                    </p>
                </div>
            ) : (
                <>
                    {/* Tabla de facturas */}
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Número
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Cliente
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Fecha
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Total
                                        </th>
                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Estado
                                        </th>
                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Acciones
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {invoices.map((invoice) => (
                                        <tr key={invoice.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="text-sm font-mono font-medium text-gray-900">
                                                    {invoice.full_number}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-900">
                                                    {invoice.Customer?.business_name ||
                                                        `${invoice.Customer?.first_name || ''} ${invoice.Customer?.last_name || ''}`.trim()}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    {invoice.Customer?.document_number}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {formatDate(invoice.issue_date)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-semibold text-gray-900">
                                                {formatCurrency(invoice.total)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                <StatusBadge status={invoice.status} />
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                                                <div className="flex gap-2 justify-center">
                                                    {/* Botón Enviar a DIAN (solo para borradores) */}
                                                    {invoice.status === INVOICE_STATUSES.DRAFT && (
                                                        <button
                                                            onClick={() => handleSendToDIAN(invoice)}
                                                            className="bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600 transition"
                                                            title="Enviar a DIAN"
                                                        >
                                                            Enviar
                                                        </button>
                                                    )}


                                                    {/* Botón Descargar PDF (para facturas enviadas o aceptadas) */}
                                                    {(invoice.status === INVOICE_STATUSES.SENT || invoice.status === INVOICE_STATUSES.ACCEPTED) && (
                                                        <button
                                                            onClick={() => handleDownloadPDF(invoice)}
                                                            className="bg-green-500 text-white px-3 py-1 rounded text-xs hover:bg-green-600 transition"
                                                            title="Descargar PDF"
                                                        >
                                                            PDF
                                                        </button>
                                                    )}


                                                    {/* Botón Ver detalle */}
                                                    <button
                                                        onClick={() => handleViewDetail(invoice.id)}
                                                        className="bg-gray-500 text-white px-3 py-1 rounded text-xs hover:bg-gray-600 transition"
                                                        title="Ver detalle"
                                                    >
                                                        Ver
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Paginación */}
                    <div className="mt-4 flex items-center justify-between bg-white px-4 py-3 rounded-lg shadow">
                        <div className="flex-1 flex justify-between sm:hidden">
                            <button
                                onClick={() => changePage(pagination.page - 1)}
                                disabled={pagination.page === 1}
                                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Anterior
                            </button>
                            <button
                                onClick={() => changePage(pagination.page + 1)}
                                disabled={pagination.page >= pagination.pages}
                                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Siguiente
                            </button>
                        </div>
                        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm text-gray-700">
                                    Mostrando{' '}
                                    <span className="font-medium">
                                        {(pagination.page - 1) * pagination.limit + 1}
                                    </span>
                                    {' '}-{' '}
                                    <span className="font-medium">
                                        {Math.min(pagination.page * pagination.limit, pagination.total)}
                                    </span>
                                    {' '}de{' '}
                                    <span className="font-medium">{pagination.total}</span>
                                    {' '}facturas
                                </p>
                            </div>
                            <div>
                                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                                    <button
                                        onClick={() => changePage(pagination.page - 1)}
                                        disabled={pagination.page === 1}
                                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <span className="sr-only">Anterior</span>
                                        ‹
                                    </button>
                                    <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                                        Página {pagination.page} de {pagination.pages}
                                    </span>
                                    <button
                                        onClick={() => changePage(pagination.page + 1)}
                                        disabled={pagination.page >= pagination.pages}
                                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <span className="sr-only">Siguiente</span>
                                        ›
                                    </button>
                                </nav>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
