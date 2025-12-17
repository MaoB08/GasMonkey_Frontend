import Swal from 'sweetalert2';

const API_URL = import.meta.env.VITE_API_URL;

/**
 * ============================================
 * CATEGORY SERVICE
 * ============================================
 */

export const categoryService = {
    /**
     * Get all categories
     */
    async getAll(token) {
        try {
            const response = await fetch(`${API_URL}/api/categories`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();

            // Debug: Log the response structure
            console.log('Categories API Response:', data);

            if (!response.ok) {
                throw new Error(data.error || 'Error al obtener categorías');
            }

            return data;
        } catch (error) {
            console.error('Error obteniendo categorías:', error);
            throw error;
        }
    },

    /**
     * Get category by ID
     */
    async getById(id, token) {
        try {
            const response = await fetch(`${API_URL}/api/categories/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Error al obtener categoría');
            }

            return data;
        } catch (error) {
            console.error('Error obteniendo categoría:', error);
            throw error;
        }
    },

    /**
     * Create new category
     */
    async create(categoryData, token) {
        try {
            const response = await fetch(`${API_URL}/api/categories`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(categoryData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Error al crear categoría');
            }

            Swal.fire({
                icon: 'success',
                title: '¡Éxito!',
                text: 'Categoría creada exitosamente',
                timer: 2000,
                showConfirmButton: false
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
    },

    /**
     * Update category
     */
    async update(id, categoryData, token) {
        try {
            const response = await fetch(`${API_URL}/api/categories/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(categoryData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Error al actualizar categoría');
            }

            Swal.fire({
                icon: 'success',
                title: '¡Éxito!',
                text: 'Categoría actualizada exitosamente',
                timer: 2000,
                showConfirmButton: false
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
    },

    /**
     * Delete category
     */
    async delete(id, token) {
        try {
            const result = await Swal.fire({
                title: '¿Eliminar categoría?',
                text: 'Esta acción no se puede deshacer',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Sí, eliminar',
                cancelButtonText: 'Cancelar',
                confirmButtonColor: '#d33'
            });

            if (!result.isConfirmed) {
                return null;
            }

            const response = await fetch(`${API_URL}/api/categories/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Error al eliminar categoría');
            }

            Swal.fire({
                icon: 'success',
                title: '¡Eliminada!',
                text: 'Categoría eliminada exitosamente',
                timer: 2000,
                showConfirmButton: false
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
};

/**
 * ============================================
 * PRODUCT SERVICE
 * ============================================
 */

export const productService = {
    /**
     * Get all products with optional filters
     */
    async getAll(filters = {}, token) {
        try {
            const queryParams = new URLSearchParams();

            // Add filters to query params
            if (filters.search) queryParams.append('search', filters.search);
            if (filters.category_id) queryParams.append('category_id', filters.category_id);
            if (filters.low_stock) queryParams.append('low_stock', filters.low_stock);
            if (filters.min_price) queryParams.append('min_price', filters.min_price);
            if (filters.max_price) queryParams.append('max_price', filters.max_price);

            const response = await fetch(`${API_URL}/api/inventory-products?${queryParams}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Error al obtener productos');
            }

            return data;
        } catch (error) {
            console.error('Error obteniendo productos:', error);
            throw error;
        }
    },

    /**
     * Get product by ID
     */
    async getById(id, token) {
        try {
            const response = await fetch(`${API_URL}/api/inventory-products/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Error al obtener producto');
            }

            return data;
        } catch (error) {
            console.error('Error obteniendo producto:', error);
            throw error;
        }
    },

    /**
     * Preview product code for a category
     */
    async previewCode(categoryId, token) {
        try {
            const response = await fetch(`${API_URL}/api/inventory-products/preview-code?category_id=${categoryId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Error al obtener preview del código');
            }

            return data;
        } catch (error) {
            console.error('Error obteniendo preview del código:', error);
            throw error;
        }
    },

    /**
     * Create new product
     */
    async create(productData, token) {
        try {
            const response = await fetch(`${API_URL}/api/inventory-products`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(productData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Error al crear producto');
            }

            Swal.fire({
                icon: 'success',
                title: '¡Éxito!',
                text: 'Producto creado exitosamente',
                timer: 2000,
                showConfirmButton: false
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
    },

    /**
     * Update product
     */
    async update(id, productData, token) {
        try {
            const response = await fetch(`${API_URL}/api/inventory-products/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(productData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Error al actualizar producto');
            }

            Swal.fire({
                icon: 'success',
                title: '¡Éxito!',
                text: 'Producto actualizado exitosamente',
                timer: 2000,
                showConfirmButton: false
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
    },

    /**
     * Delete product
     */
    async delete(id, token) {
        try {
            const result = await Swal.fire({
                title: '¿Eliminar producto?',
                text: 'Esta acción no se puede deshacer',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Sí, eliminar',
                cancelButtonText: 'Cancelar',
                confirmButtonColor: '#d33'
            });

            if (!result.isConfirmed) {
                return null;
            }

            const response = await fetch(`${API_URL}/api/inventory-products/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Error al eliminar producto');
            }

            Swal.fire({
                icon: 'success',
                title: '¡Eliminado!',
                text: 'Producto eliminado exitosamente',
                timer: 2000,
                showConfirmButton: false
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
};
