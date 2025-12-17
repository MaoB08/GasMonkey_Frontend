import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createInvoice, sendInvoiceToDIAN, validateInvoice } from './invoiceService';
import { useAuth } from '../../../auth/useAuth';
import Swal from 'sweetalert2';

export function CreateInvoice() {
  const { getToken } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    company_id: '',
    customer_id: '',
    payment_method: 'Contado',
    payment_means: 'Efectivo',
    due_days: 0,
    notes: ''
  });

  const [customerDocument, setCustomerDocument] = useState('');
  const [customerInfo, setCustomerInfo] = useState(null);
  const [searchingCustomer, setSearchingCustomer] = useState(false);

  const [items, setItems] = useState([
    {
      code: '',
      name: '',
      description: '',
      quantity: 1,
      unit_price: 0,
      iva_percentage: 19,
      unit_measure: 'UNI'
    }
  ]);

  const [loading, setLoading] = useState(false);

  // Buscar cliente por documento
  const searchCustomer = async (document) => {
    if (!document || document.length < 3) {
      setCustomerInfo(null);
      setFormData({ ...formData, customer_id: '' });
      return;
    }

    setSearchingCustomer(true);
    try {
      const token = getToken();
      const API_URL = import.meta.env.VITE_API_URL;

      const response = await fetch(`${API_URL}/api/customers/search?document=${document}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (response.ok && data.customer) {
        setCustomerInfo(data.customer);
        setFormData({ ...formData, customer_id: data.customer.id });
      } else {
        setCustomerInfo(null);
        setFormData({ ...formData, customer_id: '' });
      }
    } catch (error) {
      console.error('Error buscando cliente:', error);
      setCustomerInfo(null);
      setFormData({ ...formData, customer_id: '' });
    } finally {
      setSearchingCustomer(false);
    }
  };

  // Manejar cambio en documento del cliente
  const handleDocumentChange = (e) => {
    const document = e.target.value;
    setCustomerDocument(document);

    // Buscar automáticamente cuando tenga suficientes caracteres
    if (document.length >= 5) {
      searchCustomer(document);
    } else {
      setCustomerInfo(null);
      setFormData({ ...formData, customer_id: '' });
    }
  };

  // Agregar nuevo item
  const addItem = () => {
    setItems([...items, {
      code: '',
      name: '',
      description: '',
      quantity: 1,
      unit_price: 0,
      iva_percentage: 19,
      unit_measure: 'UNI'
    }]);
  };

  // Eliminar item
  const removeItem = (index) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  // Actualizar item
  const updateItem = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  // Calcular totales
  const calculateTotals = () => {
    let subtotal = 0;
    let taxTotal = 0;

    items.forEach(item => {
      const itemSubtotal = item.quantity * item.unit_price;
      const itemTax = itemSubtotal * (item.iva_percentage / 100);

      subtotal += itemSubtotal;
      taxTotal += itemTax;
    });

    return {
      subtotal: subtotal.toFixed(2),
      taxTotal: taxTotal.toFixed(2),
      total: (subtotal + taxTotal).toFixed(2)
    };
  };

  const totals = calculateTotals();

  // Crear factura
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.customer_id) {
      Swal.fire({
        icon: 'warning',
        title: 'Cliente requerido',
        text: 'Debes buscar un cliente por su documento'
      });
      return;
    }

    const hasEmptyItems = items.some(item => !item.name || item.unit_price <= 0);
    if (hasEmptyItems) {
      Swal.fire({
        icon: 'warning',
        title: 'Items incompletos',
        text: 'Verifica que todos los items tengan nombre y precio'
      });
      return;
    }

    setLoading(true);

    try {
      const token = getToken();

      // Crear factura
      const invoiceData = {
        ...formData,
        company_id: '9e0500fb-6e79-42c8-809c-a3b83de41040',
        items: items
      };

      const result = await createInvoice(invoiceData, token);
      const createdInvoiceId = result.invoice.id;

      // Validar factura automáticamente
      const validationResult = await validateInvoice(createdInvoiceId, token);

      // Mostrar resultados de validación en un modal
      const hasErrors = validationResult.errors && validationResult.errors.length > 0;
      const hasWarnings = validationResult.warnings && validationResult.warnings.length > 0;

      // Crear el HTML para el modal con los resultados
      let validationHTML = '<div style="text-align: left;">';

      if (validationResult.valid && !hasErrors && !hasWarnings) {
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
            <strong style="color: #991b1b;">❌ Errores (${validationResult.errors.length})</strong>
            <p style="color: #b91c1c; margin: 4px 0 8px 0; font-size: 12px;">Deben corregirse antes de enviar a DIAN</p>
            <ul style="margin: 0; padding-left: 20px; color: #991b1b; font-size: 13px;">
              ${validationResult.errors.map(err => `<li style="margin: 4px 0;">${err}</li>`).join('')}
            </ul>
          </div>
        `;
      }

      if (hasWarnings) {
        validationHTML += `
          <div style="background: #fef3c7; border: 1px solid #fcd34d; border-radius: 8px; padding: 12px;">
            <strong style="color: #92400e;">⚠️ Advertencias (${validationResult.warnings.length})</strong>
            <p style="color: #b45309; margin: 4px 0 8px 0; font-size: 12px;">No bloquean el envío, pero deberías revisarlas</p>
            <ul style="margin: 0; padding-left: 20px; color: #92400e; font-size: 13px;">
              ${validationResult.warnings.map(warn => `<li style="margin: 4px 0;">${warn}</li>`).join('')}
            </ul>
          </div>
        `;
      }

      validationHTML += '</div>';

      // Preguntar si enviar a DIAN (solo si no hay errores)
      if (!hasErrors) {
        const sendResult = await Swal.fire({
          icon: hasWarnings ? 'warning' : 'success',
          title: 'Factura creada',
          html: validationHTML + '<p style="margin-top: 16px; font-weight: 500;">¿Deseas enviarla a la DIAN ahora?</p>',
          showCancelButton: true,
          confirmButtonText: 'Sí, enviar',
          cancelButtonText: 'Después',
          width: '600px'
        });

        if (sendResult.isConfirmed) {
          await sendInvoiceToDIAN(createdInvoiceId, token);
        }
      } else {
        // Si hay errores, solo mostrar los resultados sin opción de enviar
        await Swal.fire({
          icon: 'error',
          title: 'Factura creada con errores',
          html: validationHTML + '<p style="margin-top: 16px; color: #991b1b;">No se puede enviar a DIAN hasta corregir los errores.</p>',
          confirmButtonText: 'Entendido',
          width: '600px'
        });
      }

      navigate('/home/facturas');

    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Nueva Factura Electrónica</h1>

      <form onSubmit={handleSubmit}>
        {/* Información del cliente */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Documento del Cliente *
          </label>
          <div className="relative">
            <input
              type="text"
              value={customerDocument}
              onChange={handleDocumentChange}
              placeholder="Ingresa el número de documento..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            {searchingCustomer && (
              <div className="absolute right-3 top-2.5">
                <div className="animate-spin h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full"></div>
              </div>
            )}
          </div>

          {/* Información del cliente encontrado */}
          {customerInfo && (
            <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-md">
              <div className="flex items-start">
                <svg className="h-5 w-5 text-green-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-green-800">
                    ✓ Cliente encontrado
                  </p>
                  <p className="text-sm text-green-700 mt-1">
                    <strong>Nombre:</strong> {customerInfo.business_name || `${customerInfo.first_name} ${customerInfo.last_name}`}
                  </p>
                  {customerInfo.email && (
                    <p className="text-sm text-green-700">
                      <strong>Email:</strong> {customerInfo.email}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Mensaje cuando no se encuentra */}
          {!customerInfo && customerDocument.length >= 5 && !searchingCustomer && (
            <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <p className="text-sm text-yellow-800">
                ⚠️ No se encontró un cliente con este documento
              </p>
            </div>
          )}
        </div>

        {/* Información general */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Forma de pago
            </label>
            <select
              value={formData.payment_method}
              onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Contado">Contado</option>
              <option value="Crédito">Crédito</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Medio de pago
            </label>
            <select
              value={formData.payment_means}
              onChange={(e) => setFormData({ ...formData, payment_means: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Efectivo">Efectivo</option>
              <option value="Transferencia">Transferencia</option>
              <option value="Tarjeta">Tarjeta</option>
            </select>
          </div>
        </div>

        {/* Items */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Items de la factura</h2>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left">#</th>
                  <th className="px-4 py-2 text-left">Descripción</th>
                  <th className="px-4 py-2 text-left">Cantidad</th>
                  <th className="px-4 py-2 text-left">Precio</th>
                  <th className="px-4 py-2 text-left">IVA %</th>
                  <th className="px-4 py-2 text-right">Total</th>
                  <th className="px-4 py-2"></th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => {
                  const itemTotal = item.quantity * item.unit_price * (1 + item.iva_percentage / 100);

                  return (
                    <tr key={index} className="border-b">
                      <td className="px-4 py-2">{index + 1}</td>
                      <td className="px-4 py-2">
                        <input
                          type="text"
                          value={item.name}
                          onChange={(e) => updateItem(index, 'name', e.target.value)}
                          placeholder="Nombre del producto/servicio"
                          className="w-full px-2 py-1 border rounded"
                          required
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateItem(index, 'quantity', parseFloat(e.target.value))}
                          min="0.01"
                          step="0.01"
                          className="w-20 px-2 py-1 border rounded"
                          required
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="number"
                          value={item.unit_price}
                          onChange={(e) => updateItem(index, 'unit_price', parseFloat(e.target.value))}
                          min="0"
                          step="0.01"
                          className="w-32 px-2 py-1 border rounded"
                          required
                        />
                      </td>
                      <td className="px-4 py-2">
                        <select
                          value={item.iva_percentage}
                          onChange={(e) => updateItem(index, 'iva_percentage', parseFloat(e.target.value))}
                          className="w-20 px-2 py-1 border rounded"
                        >
                          <option value="0">0%</option>
                          <option value="5">5%</option>
                          <option value="19">19%</option>
                        </select>
                      </td>
                      <td className="px-4 py-2 text-right font-medium">
                        ${itemTotal.toFixed(2)}
                      </td>
                      <td className="px-4 py-2">
                        {items.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeItem(index)}
                            className="text-red-600 hover:text-red-800"
                          >
                            ✕
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <button
            type="button"
            onClick={addItem}
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            + Agregar item
          </button>
        </div>

        {/* Totales */}
        <div className="flex justify-end mb-6">
          <div className="w-64 bg-gray-50 p-4 rounded">
            <div className="flex justify-between mb-2">
              <span>Subtotal:</span>
              <span className="font-medium">${totals.subtotal}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>IVA:</span>
              <span className="font-medium">${totals.taxTotal}</span>
            </div>
            <div className="flex justify-between text-lg font-bold border-t pt-2">
              <span>TOTAL:</span>
              <span className="text-green-600">${totals.total}</span>
            </div>
          </div>
        </div>

        {/* Botones */}
        <div className="flex gap-4 justify-end">
          <button
            type="button"
            onClick={() => navigate('/home/facturas')}
            className="px-6 py-2 border border-gray-300 rounded hover:bg-gray-100"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? 'Creando...' : 'Crear Factura'}
          </button>
        </div>
      </form>
    </div>
  );
}