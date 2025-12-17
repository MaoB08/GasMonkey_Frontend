/**
 * Constantes del sistema de facturación electrónica
 */

// Estados de factura
export const INVOICE_STATUSES = {
  DRAFT: 'draft',
  SENT: 'sent',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
  CANCELLED: 'cancelled',
  ERROR: 'error'
};

// Labels de estados
export const INVOICE_STATUS_LABELS = {
  [INVOICE_STATUSES.DRAFT]: 'Borrador',
  [INVOICE_STATUSES.SENT]: 'Enviada',
  [INVOICE_STATUSES.ACCEPTED]: 'Aceptada',
  [INVOICE_STATUSES.REJECTED]: 'Rechazada',
  [INVOICE_STATUSES.CANCELLED]: 'Anulada',
  [INVOICE_STATUSES.ERROR]: 'Error'
};

// Colores de estados (Tailwind CSS)
export const INVOICE_STATUS_COLORS = {
  [INVOICE_STATUSES.DRAFT]: 'bg-gray-200 text-gray-800',
  [INVOICE_STATUSES.SENT]: 'bg-blue-200 text-blue-800',
  [INVOICE_STATUSES.ACCEPTED]: 'bg-green-200 text-green-800',
  [INVOICE_STATUSES.REJECTED]: 'bg-red-200 text-red-800',
  [INVOICE_STATUSES.CANCELLED]: 'bg-orange-200 text-orange-800',
  [INVOICE_STATUSES.ERROR]: 'bg-red-300 text-red-900'
};

// Métodos de pago
export const PAYMENT_METHODS = [
  { value: 'Contado', label: 'Contado' },
  { value: 'Crédito', label: 'Crédito' }
];

// Medios de pago
export const PAYMENT_MEANS = [
  { value: 'Efectivo', label: 'Efectivo' },
  { value: 'Transferencia', label: 'Transferencia' },
  { value: 'Tarjeta', label: 'Tarjeta' }
];

// Porcentajes de IVA
export const IVA_PERCENTAGES = [
  { value: 0, label: '0%' },
  { value: 5, label: '5%' },
  { value: 19, label: '19%' }
];

// Unidades de medida
export const UNIT_MEASURES = [
  { value: 'UNI', label: 'Unidad' },
  { value: 'GAL', label: 'Galón' },
  { value: 'LTS', label: 'Litros' },
  { value: 'KG', label: 'Kilogramo' },
  { value: 'MT', label: 'Metro' }
];

// Paginación
export const DEFAULT_PAGE_SIZE = 20;
export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];
