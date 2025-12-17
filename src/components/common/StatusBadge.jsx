import { INVOICE_STATUS_LABELS, INVOICE_STATUS_COLORS } from '../../utils/constants';

/**
 * Badge para mostrar el estado de una factura
 * @param {string} status - Estado de la factura (draft, sent, accepted, rejected, cancelled, error)
 */
export default function StatusBadge({ status }) {
    const label = INVOICE_STATUS_LABELS[status] || status;
    const colorClasses = INVOICE_STATUS_COLORS[status] || INVOICE_STATUS_COLORS.draft;

    return (
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${colorClasses}`}>
            {label}
        </span>
    );
}
