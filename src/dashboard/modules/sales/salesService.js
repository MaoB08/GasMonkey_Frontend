const API_URL = import.meta.env.VITE_API_URL;

export const salesService = {
    // Crear nueva venta
    async createSale(saleData, token) {
        const response = await fetch(`${API_URL}/api/sales`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(saleData)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Error al crear venta');
        }

        return response.json();
    },

    // Listar ventas con filtros
    async getSales(filters, token) {
        const params = new URLSearchParams();

        if (filters.page) params.append('page', filters.page);
        if (filters.limit) params.append('limit', filters.limit);
        if (filters.client_id) params.append('client_id', filters.client_id);
        if (filters.staff_id) params.append('staff_id', filters.staff_id);
        if (filters.state) params.append('state', filters.state);
        if (filters.payment_status) params.append('payment_status', filters.payment_status);
        if (filters.date_from) params.append('date_from', filters.date_from);
        if (filters.date_to) params.append('date_to', filters.date_to);

        const response = await fetch(`${API_URL}/api/sales?${params}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Error al obtener ventas');
        }

        return response.json();
    },

    // Obtener detalle de venta
    async getSaleById(id, token) {
        const response = await fetch(`${API_URL}/api/sales/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Error al obtener venta');
        }

        return response.json();
    },

    // Agregar pago a venta APARTADO/CREDIT
    async addPayment(saleId, paymentData, token) {
        const response = await fetch(`${API_URL}/api/sales/${saleId}/payment`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(paymentData)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Error al agregar pago');
        }

        return response.json();
    },

    // Generar factura
    async generateInvoice(saleId, type, token) {
        const response = await fetch(`${API_URL}/api/sales/${saleId}/invoice?type=${type}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Error al generar factura');
        }

        return response.json();
    }
};

export const discountService = {
    // Listar descuentos
    async getDiscounts(token) {
        const response = await fetch(`${API_URL}/api/discounts`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Error al obtener descuentos');
        }

        return response.json();
    },

    // Validar código de descuento
    async validateDiscount(code, purchaseAmount, token) {
        const params = purchaseAmount ? `?purchase_amount=${purchaseAmount}` : '';
        const response = await fetch(`${API_URL}/api/discounts/validate/${code}${params}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Error al validar descuento');
        }

        return data;
    },

    // Crear descuento
    async createDiscount(discountData, token) {
        const response = await fetch(`${API_URL}/api/discounts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(discountData)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Error al crear descuento');
        }

        return response.json();
    },

    // Actualizar descuento
    async updateDiscount(id, discountData, token) {
        const response = await fetch(`${API_URL}/api/discounts/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(discountData)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Error al actualizar descuento');
        }

        return response.json();
    },

    // Desactivar descuento
    async deleteDiscount(id, token) {
        const response = await fetch(`${API_URL}/api/discounts/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Error al desactivar descuento');
        }

        return response.json();
    }
};

export const paymentMethodService = {
    // Listar métodos de pago
    async getPaymentMethods(token) {
        const response = await fetch(`${API_URL}/api/payment-methods`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Error al obtener métodos de pago');
        }

        return response.json();
    }
};

export const staffService = {
    // Listar personal
    async getStaff(token) {
        const response = await fetch(`${API_URL}/api/staff`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Error al obtener personal');
        }

        return response.json();
    }
};

export const taxConfigService = {
    // Obtener configuraciones de impuestos
    async getTaxConfigurations(token) {
        const response = await fetch(`${API_URL}/api/tax-config`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Error al obtener configuraciones de impuestos');
        }

        return response.json();
    }
};

export const returnService = {
    // Listar devoluciones
    async getReturns(filters, token) {
        const params = new URLSearchParams();
        if (filters.status) params.append('status', filters.status);

        const response = await fetch(`${API_URL}/api/sale-returns?${params}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Error al obtener devoluciones');
        }

        return response.json();
    },

    // Aprobar devolución
    async approveReturn(returnId, staffId, token) {
        const response = await fetch(`${API_URL}/api/sale-returns/${returnId}/approve`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ staff_id: staffId })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Error al aprobar devolución');
        }

        return response.json();
    },

    // Rechazar devolución
    async rejectReturn(returnId, staffId, reason, token) {
        const response = await fetch(`${API_URL}/api/sale-returns/${returnId}/reject`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ staff_id: staffId, rejection_reason: reason })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Error al rechazar devolución');
        }

        return response.json();
    }
};

// Búsqueda unificada de productos (inventory + DIAN)
export const productSearchService = {
    async searchProducts(query, token) {
        // Buscar en ambas tablas
        const [inventoryResponse, dianResponse] = await Promise.allSettled([
            fetch(`${API_URL}/api/inventory-products?search=${query}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            }),
            fetch(`${API_URL}/api/products?search=${query}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            })
        ]);

        const products = [];

        // Productos de inventario
        if (inventoryResponse.status === 'fulfilled' && inventoryResponse.value.ok) {
            const data = await inventoryResponse.value.json();
            // El backend devuelve { success: true, data: [...] }
            const inventoryProducts = (data.data || []).map(p => ({
                id: p.id,
                code: p.code,
                name: p.name,
                current_price: p.current_price,
                stock: p.stock,
                source: 'INVENTORY',
                displayName: `${p.name} (Stock: ${p.stock}) - ${p.code}`
            }));
            products.push(...inventoryProducts);
        }

        // Productos DIAN (si la ruta existe)
        if (dianResponse.status === 'fulfilled' && dianResponse.value.ok) {
            const data = await dianResponse.value.json();
            const dianProducts = (data.products || data.data || []).map(p => ({
                id: p.id,
                code: p.code,
                name: p.name,
                price: p.price,
                source: 'DIAN',
                displayName: `${p.name} (DIAN) - ${p.code || ''}`
            }));
            products.push(...dianProducts);
        }

        return products;
    }
};
