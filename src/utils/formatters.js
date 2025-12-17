import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

/**
 * Formatea un número como moneda colombiana (COP)
 * @param {number|string} amount - Monto a formatear
 * @returns {string} Monto formateado
 */
export function formatCurrency(amount) {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;

    if (isNaN(numAmount)) return '$0';

    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(numAmount);
}

/**
 * Formatea una fecha en formato dd/MM/yyyy
 * @param {string|Date} dateString - Fecha a formatear
 * @returns {string} Fecha formateada
 */
export function formatDate(dateString) {
    if (!dateString) return '-';

    try {
        const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
        return format(date, 'dd/MM/yyyy', { locale: es });
    } catch (error) {
        console.error('Error formateando fecha:', error);
        return dateString;
    }
}

/**
 * Formatea una fecha y hora en formato dd/MM/yyyy HH:mm
 * @param {string|Date} dateString - Fecha y hora a formatear
 * @returns {string} Fecha y hora formateada
 */
export function formatDateTime(dateString) {
    if (!dateString) return '-';

    try {
        const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
        return format(date, 'dd/MM/yyyy HH:mm', { locale: es });
    } catch (error) {
        console.error('Error formateando fecha y hora:', error);
        return dateString;
    }
}

/**
 * Formatea un número con separadores de miles
 * @param {number|string} number - Número a formatear
 * @param {number} decimals - Cantidad de decimales (default: 2)
 * @returns {string} Número formateado
 */
export function formatNumber(number, decimals = 2) {
    const numValue = typeof number === 'string' ? parseFloat(number) : number;

    if (isNaN(numValue)) return '0';

    return new Intl.NumberFormat('es-CO', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    }).format(numValue);
}

/**
 * Formatea un número de documento (NIT, CC, etc.)
 * @param {string} documentNumber - Número de documento
 * @returns {string} Documento formateado
 */
export function formatDocumentNumber(documentNumber) {
    if (!documentNumber) return '-';

    // Formatear NIT con separadores de miles
    const cleaned = documentNumber.toString().replace(/\D/g, '');

    if (cleaned.length <= 3) return cleaned;

    return cleaned.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}
