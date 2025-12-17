import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getInvoiceById, sendInvoiceToDIAN, cancelInvoice, downloadPDF, downloadXML, validateInvoice } from './invoiceService';
import { useAuth } from '../../../auth/useAuth';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import ErrorAlert from '../../../components/common/ErrorAlert';
import StatusBadge from '../../../components/common/StatusBadge';
import InvoiceItemsTable from './InvoiceItemsTable';
import ValidationResults from './ValidationResults';
import { formatCurrency, formatDate, formatDateTime, formatDocumentNumber } from '../../../utils/formatters';
import { INVOICE_STATUSES } from '../../../utils/constants';
import Swal from 'sweetalert2';

/**
 * Vista detallada de una factura
 */
export default function InvoiceDetail() {
    const { id } = useParams();
    const { getToken } = useAuth();
    const navigate = useNavigate();

    const [invoice, setInvoice] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [validationResult, setValidationResult] = useState(null);

    useEffect(() => {
        loadInvoice();
    }, [id]);

    const loadInvoice = async () => {
        setLoading(true);
        setError(null);

        try {
            const token = getToken();
            const data = await getInvoiceById(id, token);
            setInvoice(data.invoice);
        } catch (err) {
            console.error('Error cargando factura:', err);
            setError('Error al cargar la factura. Por favor, intenta de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    const handleSendToDIAN = async () => {
        try {
            const token = getToken();
            await sendInvoiceToDIAN(id, token);
            loadInvoice(); // Recargar para ver el nuevo estado
        } catch (err) {
            console.error('Error enviando a DIAN:', err);
        }
    };

    const handleCancel = async () => {
        try {
            const token = getToken();
            const result = await cancelInvoice(id, '', token);
            if (result) {
                loadInvoice(); // Recargar para ver el nuevo estado
            }
        } catch (err) {
            console.error('Error anulando factura:', err);
        }
    };

    const handleDownloadPDF = () => {
        try {
            const token = getToken();
            downloadPDF(id, token);
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo descargar el PDF'
            });
        }
    };

    const handleDownloadXML = () => {
        try {
            const token = getToken();
            downloadXML(id, token);
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo descargar el XML'
            });
        }
    };

    const handleValidate = async () => {
        try {
            const token = getToken();
            const result = await validateInvoice(id, token);
            setValidationResult(result);

            // Mostrar resultado en un modal
            const hasErrors = result.errors && result.errors.length > 0;
            const hasWarnings = result.warnings && result.warnings.length > 0;

            let validationHTML = '<div style="text-align: left;">';

            if (result.valid && !hasErrors && !hasWarnings) {
                validationHTML += `
                    <div style="background: #d1fae5; border: 1px solid #6ee7b7; border-radius: 8px; padding: 12px; margin-bottom: 12px;">
                        <strong style="color: #065f46;">✅ Validación exitosa</strong>
                        <p style="color: #047857; margin: 4px 0 0 0; font-size: 14px;">La factura cumple con todas las reglas DIAN</p>
                    </div>
                `;
            }

            if (hasErrors) {
                validationHTML += `
                    <div style="background: #fee2e2; border: 1px solid #fca5a5; border-radius: 8px; padding: 12px; margin-bottom: 12px;">
                        <strong style="color: #991b1b;">❌ Errores (${result.errors.length})</strong>
                        <p style="color: #b91c1c; margin: 4px 0 8px 0; font-size: 12px;">Deben corregirse antes de enviar a DIAN</p>
                        <ul style="margin: 0; padding-left: 20px; color: #991b1b; font-size: 13px;">
                            ${result.errors.map(err => `<li style="margin: 4px 0;">${err}</li>`).join('')}
                        </ul>
                    </div>
                `;
            }

            if (hasWarnings) {
                validationHTML += `
                    <div style="background: #fef3c7; border: 1px solid #fcd34d; border-radius: 8px; padding: 12px;">
                        <strong style="color: #92400e;">⚠️ Advertencias (${result.warnings.length})</strong>
                        <p style="color: #b45309; margin: 4px 0 8px 0; font-size: 12px;">No bloquean el envío, pero deberías revisarlas</p>
                        <ul style="margin: 0; padding-left: 20px; color: #92400e; font-size: 13px;">
                            ${result.warnings.map(warn => `<li style="margin: 4px 0;">${warn}</li>`).join('')}
                        </ul>
                    </div>
                `;
            }

            validationHTML += '</div>';

            Swal.fire({
                icon: hasErrors ? 'error' : hasWarnings ? 'warning' : 'success',
                title: 'Resultados de Validación',
                html: validationHTML,
                confirmButtonText: 'Entendido',
                width: '600px'
            });

        } catch (err) {
            console.error('Error validando factura:', err);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo validar la factura'
            });
        }
    };

    if (loading) {
        return <LoadingSpinner text="Cargando factura..." />;
    }

    if (error || !invoice) {
        return (
            <div className="max-w-6xl mx-auto p-6">
                <ErrorAlert message={error || 'Factura no encontrada'} />
                <button
                    onClick={() => navigate('/home/facturas')}
                    className="mt-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                    Volver a facturas
                </button>
            </div>
        );
    }

    const canSendToDIAN = invoice.status === INVOICE_STATUSES.DRAFT &&
        (!validationResult || !validationResult.errors || validationResult.errors.length === 0);
    const canCancel = [INVOICE_STATUSES.SENT, INVOICE_STATUSES.ACCEPTED].includes(invoice.status);
    const canDownload = invoice.pdf_path || invoice.xml_path;

    return (
        <div className="max-w-6xl mx-auto p-6">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <button
                        onClick={() => navigate('/home/facturas')}
                        className="text-blue-600 hover:text-blue-800 mb-2 flex items-center"
                    >
                        ← Volver a facturas
                    </button>
                    <h1 className="text-3xl font-bold text-gray-800">
                        Factura {invoice.full_number}
                    </h1>
                </div>
                <StatusBadge status={invoice.status} />
            </div>

            {/* Información general */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Información de la empresa */}
                    <div>
                        <h2 className="text-lg font-semibold mb-3 text-gray-700">Empresa Emisora</h2>
                        <div className="space-y-2 text-sm">
                            <div>
                                <span className="font-medium">Razón Social:</span>{' '}
                                {invoice.Company?.business_name}
                            </div>
                            <div>
                                <span className="font-medium">NIT:</span>{' '}
                                {formatDocumentNumber(invoice.Company?.nit)}
                            </div>
                        </div>
                    </div>

                    {/* Información del cliente */}
                    <div>
                        <h2 className="text-lg font-semibold mb-3 text-gray-700">Cliente</h2>
                        <div className="space-y-2 text-sm">
                            <div>
                                <span className="font-medium">Nombre:</span>{' '}
                                {invoice.Customer?.business_name ||
                                    `${invoice.Customer?.first_name || ''} ${invoice.Customer?.last_name || ''}`.trim()}
                            </div>
                            <div>
                                <span className="font-medium">Documento:</span>{' '}
                                {formatDocumentNumber(invoice.Customer?.document_number)}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Información de la factura */}
                <div className="mt-6 pt-6 border-t grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                        <span className="font-medium">Fecha de emisión:</span>{' '}
                        {formatDate(invoice.issue_date)}
                    </div>
                    <div>
                        <span className="font-medium">Fecha de vencimiento:</span>{' '}
                        {invoice.due_date ? formatDate(invoice.due_date) : '-'}
                    </div>
                    <div>
                        <span className="font-medium">Método de pago:</span>{' '}
                        {invoice.payment_method}
                    </div>
                    <div>
                        <span className="font-medium">Medio de pago:</span>{' '}
                        {invoice.payment_means}
                    </div>
                    {invoice.dian_sent_at && (
                        <div>
                            <span className="font-medium">Enviado a DIAN:</span>{' '}
                            {formatDateTime(invoice.dian_sent_at)}
                        </div>
                    )}
                    {invoice.cufe && (
                        <div className="md:col-span-3">
                            <span className="font-medium">CUFE:</span>{' '}
                            <span className="font-mono text-xs break-all">{invoice.cufe}</span>
                        </div>
                    )}
                </div>

                {/* Notas */}
                {invoice.notes && (
                    <div className="mt-6 pt-6 border-t">
                        <h3 className="font-medium mb-2">Notas:</h3>
                        <p className="text-sm text-gray-600">{invoice.notes}</p>
                    </div>
                )}
            </div>

            {/* Items de la factura */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
                <h2 className="text-lg font-semibold mb-4 text-gray-700">Items de la Factura</h2>
                <InvoiceItemsTable items={invoice.InvoiceItems || []} />
            </div>

            {/* Totales */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
                <div className="flex justify-end">
                    <div className="w-full md:w-1/2 lg:w-1/3 space-y-3">
                        <div className="flex justify-between text-sm">
                            <span className="font-medium">Subtotal:</span>
                            <span>{formatCurrency(invoice.subtotal)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="font-medium">IVA:</span>
                            <span>{formatCurrency(invoice.tax_total)}</span>
                        </div>
                        <div className="flex justify-between text-lg font-bold border-t pt-3">
                            <span>TOTAL:</span>
                            <span className="text-green-600">{formatCurrency(invoice.total)}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Resultados de validación */}
            {validationResult && (
                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <h2 className="text-lg font-semibold mb-4 text-gray-700">Resultados de Validación</h2>
                    <ValidationResults
                        valid={validationResult.valid}
                        errors={validationResult.errors}
                        warnings={validationResult.warnings}
                    />
                </div>
            )}

            {/* Acciones */}
            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold mb-4 text-gray-700">Acciones</h2>
                <div className="flex flex-wrap gap-3">
                    <button
                        onClick={handleValidate}
                        className="px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
                    >
                        🔍 Validar Factura
                    </button>

                    {canSendToDIAN && (
                        <button
                            onClick={handleSendToDIAN}
                            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                        >
                            Enviar a DIAN
                        </button>
                    )}

                    {!canSendToDIAN && invoice.status === INVOICE_STATUSES.DRAFT && validationResult && validationResult.errors && validationResult.errors.length > 0 && (
                        <div className="px-6 py-2 bg-gray-300 text-gray-600 rounded cursor-not-allowed flex items-center gap-2">
                            <span>⚠️</span>
                            <span>Corrige los errores para enviar</span>
                        </div>
                    )}

                    {canDownload && invoice.pdf_path && (
                        <button
                            onClick={handleDownloadPDF}
                            className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                        >
                            Descargar PDF
                        </button>
                    )}

                    {canDownload && invoice.xml_path && (
                        <button
                            onClick={handleDownloadXML}
                            className="px-6 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
                        >
                            Descargar XML
                        </button>
                    )}

                    {canCancel && (
                        <button
                            onClick={handleCancel}
                            className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                        >
                            Anular Factura
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
