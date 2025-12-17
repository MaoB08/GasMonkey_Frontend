import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { salesService, discountService, paymentMethodService, staffService, productSearchService } from './salesService';
import { useAuth } from '../../../auth/useAuth';
import Swal from 'sweetalert2';
import './sales.css';

export function CreateSale() {
    const { getToken } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        client_id: '',
        staff_id: '',
        payment_status: 'CASH',
        payment_id: '',
        discount_code: '',
        initial_payment: '',
        invoice_type: 'NORMAL',
        notes: ''
    });

    const [clientSearch, setClientSearch] = useState('');
    const [clientInfo, setClientInfo] = useState(null);
    const [searchingClient, setSearchingClient] = useState(false);

    const [productSearch, setProductSearch] = useState('');
    const [productResults, setProductResults] = useState([]);
    const [searchingProducts, setSearchingProducts] = useState(false);

    const [items, setItems] = useState([]);
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [staff, setStaff] = useState([]);

    const [discount, setDiscount] = useState(null);
    const [validatingDiscount, setValidatingDiscount] = useState(false);

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadInitialData();
    }, []);

    const loadInitialData = async () => {
        try {
            const token = getToken();
            const [pmResponse, staffResponse] = await Promise.all([
                paymentMethodService.getPaymentMethods(token),
                staffService.getStaff(token)
            ]);
            setPaymentMethods(pmResponse.paymentMethods);
            setStaff(staffResponse.staff);
        } catch (error) {
            console.error('Error cargando datos iniciales:', error);
        }
    };

    // Buscar cliente
    const searchClient = async (document) => {
        if (!document || document.length < 3) {
            setClientInfo(null);
            setFormData({ ...formData, client_id: '' });
            return;
        }

        setSearchingClient(true);
        try {
            const token = getToken();
            const API_URL = import.meta.env.VITE_API_URL;
            // Changed from /api/customers to /api/clients to get INTEGER id
            const response = await fetch(`${API_URL}/api/clients/search?document=${document}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            const data = await response.json();
            if (response.ok && data.client) {
                setClientInfo(data.client);
                setFormData({ ...formData, client_id: data.client.id });
            } else {
                setClientInfo(null);
                setFormData({ ...formData, client_id: '' });
            }
        } catch (error) {
            console.error('Error buscando cliente:', error);
        } finally {
            setSearchingClient(false);
        }
    };

    // Buscar productos
    const searchProducts = async (query) => {
        if (!query || query.length < 2) {
            setProductResults([]);
            return;
        }

        setSearchingProducts(true);
        try {
            const token = getToken();
            const products = await productSearchService.searchProducts(query, token);
            setProductResults(products);
        } catch (error) {
            console.error('Error buscando productos:', error);
        } finally {
            setSearchingProducts(false);
        }
    };

    // Agregar producto a la venta
    const addProduct = (product) => {
        const newItem = {
            product_id: product.id,
            product_source: product.source,
            product_name: product.name,
            quantity: 1,
            unit_price: product.current_price || product.price || 0,
            discount_percentage: 0,
            tax_percentage: 19,
            stock: product.stock || null
        };
        setItems([...items, newItem]);
        setProductSearch('');
        setProductResults([]);
    };

    // Actualizar item
    const updateItem = (index, field, value) => {
        const newItems = [...items];
        newItems[index][field] = value;
        setItems(newItems);
    };

    // Eliminar item
    const removeItem = (index) => {
        setItems(items.filter((_, i) => i !== index));
    };

    // Validar código de descuento
    const validateDiscountCode = async () => {
        if (!formData.discount_code) {
            setDiscount(null);
            return;
        }

        setValidatingDiscount(true);
        try {
            const token = getToken();
            const subtotal = calculateSubtotal();
            const result = await discountService.validateDiscount(
                formData.discount_code,
                subtotal,
                token
            );

            if (result.valid) {
                setDiscount(result.discount);
                Swal.fire('¡Descuento válido!', `Descuento aplicado: ${result.discount.discountAmount}`, 'success');
            }
        } catch (error) {
            setDiscount(null);
            Swal.fire('Error', error.message, 'error');
        } finally {
            setValidatingDiscount(false);
        }
    };

    // Calcular subtotal
    const calculateSubtotal = () => {
        return items.reduce((sum, item) => {
            const lineTotal = item.quantity * item.unit_price;
            const lineDiscount = lineTotal * (item.discount_percentage / 100);
            return sum + (lineTotal - lineDiscount);
        }, 0);
    };

    // Calcular totales
    const calculateTotals = () => {
        let subtotal = calculateSubtotal();
        let discountAmount = discount ? discount.discountAmount : 0;
        let subtotalAfterDiscount = subtotal - discountAmount;
        let tax = items.reduce((sum, item) => {
            const lineTotal = item.quantity * item.unit_price;
            const lineDiscount = lineTotal * (item.discount_percentage / 100);
            const lineTax = (lineTotal - lineDiscount) * (item.tax_percentage / 100);
            return sum + lineTax;
        }, 0);
        let total = subtotalAfterDiscount + tax;

        return {
            subtotal: subtotal.toFixed(2),
            discountAmount: discountAmount.toFixed(2),
            tax: tax.toFixed(2),
            total: total.toFixed(2)
        };
    };

    const totals = calculateTotals();

    // Crear venta
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.client_id) {
            Swal.fire('Error', 'Debe seleccionar un cliente', 'error');
            return;
        }

        if (!formData.staff_id) {
            Swal.fire('Error', 'Debe seleccionar un vendedor', 'error');
            return;
        }

        if (items.length === 0) {
            Swal.fire('Error', 'Debe agregar al menos un producto', 'error');
            return;
        }

        if (formData.payment_status === 'APARTADO' && (!formData.initial_payment || parseFloat(formData.initial_payment) <= 0)) {
            Swal.fire('Error', 'Debe especificar un pago inicial para APARTADO', 'error');
            return;
        }

        setLoading(true);

        try {
            const token = getToken();
            const saleData = {
                client_id: formData.client_id,
                staff_id: formData.staff_id,
                payment_status: formData.payment_status,
                payment_id: formData.payment_id || null, // Convertir string vacío a null
                discount_code: formData.discount_code || undefined,
                initial_payment: formData.initial_payment || undefined,
                invoice_type: formData.invoice_type,
                notes: formData.notes || undefined,
                items: items.map(item => ({
                    product_id: item.product_id,
                    product_source: item.product_source,
                    quantity: parseFloat(item.quantity),
                    unit_price: parseFloat(item.unit_price),
                    discount_percentage: parseFloat(item.discount_percentage),
                    tax_percentage: parseFloat(item.tax_percentage)
                }))
            };

            const saleResult = await salesService.createSale(saleData, token);

            Swal.fire({
                icon: 'success',
                title: 'Venta creada exitosamente',
                text: `Venta #${saleResult.sale.cod_sale}`,
                showCancelButton: true,
                confirmButtonText: 'Ver detalle',
                cancelButtonText: 'Nueva venta'
            }).then((swalResult) => {
                if (swalResult.isConfirmed) {
                    navigate(`/home/ventas/${saleResult.sale.cod_sale}`);
                } else {
                    window.location.reload();
                }
            });

        } catch (error) {
            console.error('Error creando venta:', error);
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
        <div className="create-sale-container">
            <h1>Nueva Venta</h1>

            <form onSubmit={handleSubmit}>
                {/* Cliente */}
                <div className="form-section">
                    <h3>Información del Cliente</h3>
                    <div className="form-group">
                        <label>Documento del Cliente *</label>
                        <input
                            type="text"
                            value={clientSearch}
                            onChange={(e) => {
                                // Solo permitir números
                                const value = e.target.value.replace(/\D/g, '');
                                setClientSearch(value);
                                searchClient(value);
                            }}
                            placeholder="Ingrese número de documento..."
                            className="form-input"
                            pattern="[0-9]*"
                            inputMode="numeric"
                            required
                        />
                        {searchingClient && <span className="loading-text">Buscando...</span>}
                        {clientInfo && (
                            <div className="client-info-box">
                                ✓ Cliente encontrado: {clientInfo.business_name || `${clientInfo.first_name} ${clientInfo.last_name}`}
                            </div>
                        )}
                    </div>
                </div>

                {/* Vendedor */}
                <div className="form-section">
                    <h3>Información de la Venta</h3>
                    <div className="form-grid">
                        <div className="form-group">
                            <label>Vendedor *</label>
                            <select
                                value={formData.staff_id}
                                onChange={(e) => setFormData({ ...formData, staff_id: e.target.value })}
                                className="form-select"
                                required
                            >
                                <option value="">Seleccione vendedor</option>
                                {staff.map(s => (
                                    <option key={s.id} value={s.id}>
                                        {s.fullName}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Método de Pago *</label>
                            <select
                                value={formData.payment_status}
                                onChange={(e) => setFormData({ ...formData, payment_status: e.target.value })}
                                className="form-select"
                                required
                            >
                                <option value="CASH">Efectivo</option>
                                <option value="TRANSFER">Transferencia</option>
                                <option value="CARD">Tarjeta</option>
                                <option value="CREDIT">Crédito</option>
                                <option value="APARTADO">Apartado</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Tipo de Factura *</label>
                            <select
                                value={formData.invoice_type}
                                onChange={(e) => setFormData({ ...formData, invoice_type: e.target.value })}
                                className="form-select"
                                required
                            >
                                <option value="NORMAL">Normal (PDF)</option>
                                <option value="ELECTRONIC">Electrónica (DIAN)</option>
                            </select>
                        </div>

                        {formData.payment_status === 'APARTADO' && (
                            <div className="form-group">
                                <label>Pago Inicial *</label>
                                <input
                                    type="number"
                                    value={formData.initial_payment}
                                    onChange={(e) => setFormData({ ...formData, initial_payment: e.target.value })}
                                    placeholder="Monto inicial"
                                    className="form-input"
                                    min="0"
                                    step="0.01"
                                    required
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* Productos */}
                <div className="form-section">
                    <h3>Productos</h3>
                    <div className="form-group">
                        <label>Buscar Producto</label>
                        <div className="search-container" style={{ position: 'relative' }}>
                            <input
                                type="text"
                                value={productSearch}
                                onChange={(e) => {
                                    setProductSearch(e.target.value);
                                    searchProducts(e.target.value);
                                }}
                                placeholder="Buscar por nombre o código..."
                                className="form-input search-input"
                            />
                            {searchingProducts && (
                                <div className="search-spinner">
                                    <div className="spinner-mini"></div>
                                </div>
                            )}
                            {productResults.length > 0 && (
                                <div className="product-results">
                                    {productResults.map((product, idx) => (
                                        <div
                                            key={idx}
                                            className="product-result-item"
                                            onClick={() => addProduct(product)}
                                        >
                                            <div className="product-info-main">
                                                <strong>{product.name}</strong>
                                                <span className="stock-badge">Stock: {product.stock || '∞'}</span>
                                            </div>
                                            <div className="product-info-sub">
                                                <span>{product.displayName}</span>
                                                <span className="price">{formatCurrency(product.current_price || product.price)}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Lista de productos */}
                    {items.length > 0 && (
                        <div className="items-table-container">
                            <table className="items-table">
                                <thead>
                                    <tr>
                                        <th>Producto</th>
                                        <th>Cantidad</th>
                                        <th>Precio Unit.</th>
                                        <th>Desc. %</th>
                                        <th>IVA %</th>
                                        <th>Total</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.map((item, index) => {
                                        const lineTotal = item.quantity * item.unit_price;
                                        const lineDiscount = lineTotal * (item.discount_percentage / 100);
                                        const lineTax = (lineTotal - lineDiscount) * (item.tax_percentage / 100);
                                        const total = lineTotal - lineDiscount + lineTax;

                                        return (
                                            <tr key={index}>
                                                <td>{item.product_name}</td>
                                                <td>
                                                    <input
                                                        type="number"
                                                        value={item.quantity}
                                                        onChange={(e) => updateItem(index, 'quantity', parseFloat(e.target.value))}
                                                        min="0.01"
                                                        step="0.01"
                                                        className="input-small"
                                                    />
                                                </td>
                                                <td>
                                                    <input
                                                        type="number"
                                                        value={item.unit_price}
                                                        onChange={(e) => updateItem(index, 'unit_price', parseFloat(e.target.value))}
                                                        min="0"
                                                        step="0.01"
                                                        className="input-small"
                                                    />
                                                </td>
                                                <td>
                                                    <input
                                                        type="number"
                                                        value={item.discount_percentage}
                                                        onChange={(e) => updateItem(index, 'discount_percentage', parseFloat(e.target.value))}
                                                        min="0"
                                                        max="100"
                                                        className="input-small"
                                                    />
                                                </td>
                                                <td>
                                                    <select
                                                        value={item.tax_percentage}
                                                        onChange={(e) => updateItem(index, 'tax_percentage', parseFloat(e.target.value))}
                                                        className="input-small"
                                                    >
                                                        <option value="0">0%</option>
                                                        <option value="5">5%</option>
                                                        <option value="19">19%</option>
                                                    </select>
                                                </td>
                                                <td className="text-right">{formatCurrency(total)}</td>
                                                <td>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeItem(index)}
                                                        className="btn-remove"
                                                    >
                                                        ✕
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Descuento */}
                <div className="form-section">
                    <h3>Descuento (Opcional)</h3>
                    <div className="form-group">
                        <label>Código Promocional</label>
                        <div className="input-with-button">
                            <input
                                type="text"
                                value={formData.discount_code}
                                onChange={(e) => setFormData({ ...formData, discount_code: e.target.value.toUpperCase() })}
                                placeholder="Ej: VERANO2024"
                                className="form-input"
                            />
                            <button
                                type="button"
                                onClick={validateDiscountCode}
                                disabled={validatingDiscount || !formData.discount_code}
                                className="btn-validate"
                            >
                                {validatingDiscount ? 'Validando...' : 'Validar'}
                            </button>
                        </div>
                        {discount && (
                            <div className="discount-info">
                                ✓ Descuento aplicado: {formatCurrency(discount.discountAmount)}
                            </div>
                        )}
                    </div>
                </div>

                {/* Totales */}
                <div className="totals-section">
                    <div className="totals-box">
                        <div className="total-row">
                            <span>Subtotal:</span>
                            <span>{formatCurrency(totals.subtotal)}</span>
                        </div>
                        {discount && (
                            <div className="total-row discount-row">
                                <span>Descuento:</span>
                                <span>-{formatCurrency(totals.discountAmount)}</span>
                            </div>
                        )}
                        <div className="total-row">
                            <span>IVA:</span>
                            <span>{formatCurrency(totals.tax)}</span>
                        </div>
                        <div className="total-row total-final">
                            <span>TOTAL:</span>
                            <span>{formatCurrency(totals.total)}</span>
                        </div>
                    </div>
                </div>

                {/* Botones */}
                <div className="form-actions">
                    <button
                        type="button"
                        onClick={() => navigate('/home/ventas')}
                        className="btn btn-secondary"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="btn btn-primary"
                    >
                        {loading ? 'Creando...' : 'Crear Venta'}
                    </button>
                </div>
            </form>
        </div>
    );
}
