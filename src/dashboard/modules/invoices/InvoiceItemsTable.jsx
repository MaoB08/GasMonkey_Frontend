import { formatCurrency, formatNumber } from '../../../utils/formatters';

/**
 * Tabla de items de factura (solo lectura)
 * @param {Array} items - Array de items de la factura
 */
export default function InvoiceItemsTable({ items = [] }) {
    if (!items || items.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500">
                No hay items en esta factura
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">#</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Código</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Nombre</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Descripción</th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-700">Cantidad</th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-700">Precio Unit.</th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-700">IVA %</th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-700">Subtotal</th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-700">Total</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item, index) => (
                        <tr key={item.id || index} className="border-t hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm">{item.line_number || index + 1}</td>
                            <td className="px-4 py-3 text-sm font-mono">{item.code || '-'}</td>
                            <td className="px-4 py-3 text-sm font-medium">{item.name}</td>
                            <td className="px-4 py-3 text-sm text-gray-600">{item.description || '-'}</td>
                            <td className="px-4 py-3 text-sm text-right">
                                {formatNumber(item.quantity, 3)} {item.unit_measure || 'UNI'}
                            </td>
                            <td className="px-4 py-3 text-sm text-right">{formatCurrency(item.unit_price)}</td>
                            <td className="px-4 py-3 text-sm text-right">{formatNumber(item.iva_percentage, 2)}%</td>
                            <td className="px-4 py-3 text-sm text-right font-medium">
                                {formatCurrency(item.subtotal)}
                            </td>
                            <td className="px-4 py-3 text-sm text-right font-semibold">
                                {formatCurrency(item.total)}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
