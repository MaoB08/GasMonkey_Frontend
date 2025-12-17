import Swal from 'sweetalert2';

const API_URL = import.meta.env.VITE_API_URL;

/**
 * Crear nueva factura
 */
export async function createInvoice(invoiceData, token) {
  try {
    const response = await fetch(`${API_URL}/api/invoices`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(invoiceData)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Error al crear factura');
    }

    return data;
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.message
    });
    throw error;
  }
}

/**
 * Enviar factura a la DIAN
 */
export async function sendInvoiceToDIAN(invoiceId, token) {
  try {
    const response = await fetch(`${API_URL}/api/invoices/${invoiceId}/send-to-dian`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Error al enviar a DIAN');
    }

    Swal.fire({
      icon: 'success',
      title: '¡Enviado!',
      text: 'Factura enviada exitosamente a la DIAN',
      timer: 2000
    });

    return data;
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.message
    });
    throw error;
  }
}

/**
 * Validar factura con reglas DIAN
 */
export async function validateInvoice(invoiceId, token) {
  try {
    const response = await fetch(`${API_URL}/api/invoices/${invoiceId}/validate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Error al validar factura');
    }

    return data;
  } catch (error) {
    console.error('Error validando factura:', error);
    throw error;
  }
}

/**
 * Listar facturas
 */
export async function getInvoices(filters, token) {
  try {
    const queryParams = new URLSearchParams(filters);

    const response = await fetch(`${API_URL}/api/invoices?${queryParams}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Error al obtener facturas');
    }

    return data;
  } catch (error) {
    console.error('Error obteniendo facturas:', error);
    throw error;
  }
}

/**
 * Obtener factura por ID
 */
export async function getInvoiceById(invoiceId, token) {
  try {
    const response = await fetch(`${API_URL}/api/invoices/${invoiceId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Error al obtener factura');
    }

    return data;
  } catch (error) {
    console.error('Error obteniendo factura:', error);
    throw error;
  }
}

/**
 * Descargar PDF
 */
export function downloadPDF(invoiceId, token) {
  window.open(`${API_URL}/api/invoices/${invoiceId}/pdf?token=${token}`, '_blank');
}

/**
 * Descargar XML
 */
export function downloadXML(invoiceId, token) {
  window.open(`${API_URL}/api/invoices/${invoiceId}/xml?token=${token}`, '_blank');
}

/**
 * Anular factura
 */
export async function cancelInvoice(invoiceId, reason, token) {
  try {
    const result = await Swal.fire({
      title: '¿Anular factura?',
      text: 'Esta acción generará una nota crédito',
      icon: 'warning',
      input: 'text',
      inputLabel: 'Motivo de anulación',
      inputValue: reason,
      inputPlaceholder: 'Ingresa el motivo...',
      showCancelButton: true,
      confirmButtonText: 'Sí, anular',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#d33'
    });

    if (!result.isConfirmed) {
      return null;
    }

    const response = await fetch(`${API_URL}/api/invoices/${invoiceId}/cancel`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ reason: result.value })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Error al anular factura');
    }

    Swal.fire({
      icon: 'success',
      title: 'Factura anulada',
      text: 'La factura ha sido anulada exitosamente',
      timer: 2000
    });

    return data;
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.message
    });
    throw error;
  }
}