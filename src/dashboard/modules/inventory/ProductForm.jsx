import { useState, useEffect } from 'react';
import { productService, categoryService } from '../../../services/inventoryApi';
import { useAuth } from '../../../auth/useAuth';

/**
 * Formulario para crear/editar productos con preview de código
 */
export default function ProductForm({ product, onSuccess, onCancel }) {
    const { token } = useAuth();
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        size: '',
        category_id: '',
        current_price: '',
        stock: ''
    });
    const [codePreview, setCodePreview] = useState('');
    const [loadingPreview, setLoadingPreview] = useState(false);
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    const isEditMode = !!product;

    useEffect(() => {
        loadCategories();
    }, []);

    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name || '',
                size: product.size || '',
                category_id: product.category_id || '',
                current_price: product.current_price || '',
                stock: product.stock || ''
            });
            setCodePreview(product.code || '');
        }
    }, [product]);

    const loadCategories = async () => {
        try {
            const data = await categoryService.getAll(token);

            // Handle different response structures
            let categoriesArray = [];
            if (Array.isArray(data)) {
                categoriesArray = data;
            } else if (data && Array.isArray(data.categories)) {
                categoriesArray = data.categories;
            } else if (data && Array.isArray(data.data)) {
                categoriesArray = data.data;
            }

            setCategories(categoriesArray);
        } catch (err) {
            console.error('Error loading categories:', err);
            setCategories([]); // Ensure categories is always an array
        }
    };

    const loadCodePreview = async (categoryId) => {
        if (!categoryId) {
            setCodePreview('');
            return;
        }

        try {
            setLoadingPreview(true);
            const data = await productService.previewCode(categoryId, token);
            setCodePreview(data.preview_code || '');
        } catch (err) {
            console.error('Error loading code preview:', err);
            setCodePreview('Error al cargar preview');
        } finally {
            setLoadingPreview(false);
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'El nombre es requerido';
        }

        if (!formData.category_id) {
            newErrors.category_id = 'La categoría es requerida';
        }

        if (!formData.current_price || formData.current_price <= 0) {
            newErrors.current_price = 'El precio debe ser mayor a 0';
        }

        if (formData.stock === '' || formData.stock < 0) {
            newErrors.stock = 'El stock debe ser mayor o igual a 0';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Load code preview when category changes (only in create mode)
        if (name === 'category_id' && !isEditMode) {
            loadCodePreview(value);
        }

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            setSubmitting(true);

            const submitData = {
                name: formData.name,
                size: formData.size || null,
                category_id: parseInt(formData.category_id),
                current_price: parseFloat(formData.current_price),
                stock: parseInt(formData.stock)
            };

            if (isEditMode) {
                await productService.update(product.id, submitData, token);
            } else {
                await productService.create(submitData, token);
            }

            if (onSuccess) {
                onSuccess();
            }
        } catch (err) {
            // Error already handled in service
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Code Preview / Current Code */}
            {!isEditMode && formData.category_id && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 rounded-lg p-4 shadow-sm">
                    <div className="flex items-start">
                        <svg className="h-6 w-6 text-blue-500 mr-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                        </svg>
                        <div className="flex-1">
                            <p className="text-sm font-semibold text-blue-900 mb-1">
                                Código que se asignará
                            </p>
                            <p className="text-2xl font-mono font-bold text-blue-700">
                                {loadingPreview ? (
                                    <span className="animate-pulse">Cargando...</span>
                                ) : codePreview}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {isEditMode && (
                <div className="bg-gray-50 border-l-4 border-gray-400 rounded-lg p-4 shadow-sm">
                    <div className="flex items-start">
                        <svg className="h-6 w-6 text-gray-500 mr-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                        </svg>
                        <div className="flex-1">
                            <p className="text-sm font-semibold text-gray-700 mb-1">Código actual</p>
                            <p className="text-2xl font-mono font-bold text-gray-900">{codePreview}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Product Information Section */}
            <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <svg className="h-5 w-5 text-gray-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Información del Producto
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Name */}
                    <div className="md:col-span-2">
                        <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                            Nombre del Producto <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Ej: Camiseta Deportiva"
                                className={`block w-full pl-10 pr-3 py-2.5 rounded-lg shadow-sm sm:text-sm transition-colors ${errors.name
                                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                                    : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400'
                                    }`}
                                autoFocus
                            />
                        </div>
                        {errors.name && (
                            <p className="mt-1.5 text-sm text-red-600 flex items-center">
                                <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                {errors.name}
                            </p>
                        )}
                    </div>

                    {/* Size */}
                    <div>
                        <label htmlFor="size" className="block text-sm font-semibold text-gray-700 mb-2">
                            Talla
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                id="size"
                                name="size"
                                value={formData.size}
                                onChange={handleChange}
                                placeholder="Ej: M, L, 42, 10.5"
                                className="block w-full pl-10 pr-3 py-2.5 rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400 sm:text-sm transition-colors"
                            />
                        </div>
                        <p className="mt-1.5 text-xs text-gray-500">Opcional: S, M, L, XL, 42, etc.</p>
                    </div>

                    {/* Category */}
                    <div>
                        <label htmlFor="category_id" className="block text-sm font-semibold text-gray-700 mb-2">
                            Categoría <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                </svg>
                            </div>
                            <select
                                id="category_id"
                                name="category_id"
                                value={formData.category_id}
                                onChange={handleChange}
                                disabled={isEditMode}
                                className={`block w-full pl-10 pr-3 py-2.5 rounded-lg shadow-sm sm:text-sm transition-colors ${errors.category_id
                                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                                    : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400'
                                    } ${isEditMode ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                            >
                                <option value="">Seleccionar categoría</option>
                                {categories.map(category => (
                                    <option key={category.id} value={category.id}>
                                        {category.name} ({category.code_prefix})
                                    </option>
                                ))}
                            </select>
                        </div>
                        {errors.category_id && (
                            <p className="mt-1.5 text-sm text-red-600 flex items-center">
                                <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                {errors.category_id}
                            </p>
                        )}
                        {isEditMode && (
                            <p className="mt-1.5 text-xs text-amber-600 flex items-center">
                                <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                No se puede cambiar en modo edición
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Pricing & Inventory Section */}
            <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <svg className="h-5 w-5 text-gray-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Precio e Inventario
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Price */}
                    <div>
                        <label htmlFor="current_price" className="block text-sm font-semibold text-gray-700 mb-2">
                            Precio <span className="text-red-500">*</span>
                        </label>
                        <div className="relative rounded-lg shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <span className="text-gray-500 font-semibold">$</span>
                            </div>
                            <input
                                type="number"
                                id="current_price"
                                name="current_price"
                                value={formData.current_price}
                                onChange={handleChange}
                                min="0"
                                step="0.01"
                                placeholder="0.00"
                                className={`block w-full pl-8 pr-12 py-2.5 rounded-lg sm:text-sm transition-colors ${errors.current_price
                                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                                    : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400'
                                    }`}
                            />
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                <span className="text-gray-400 text-xs">COP</span>
                            </div>
                        </div>
                        {errors.current_price && (
                            <p className="mt-1.5 text-sm text-red-600 flex items-center">
                                <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                {errors.current_price}
                            </p>
                        )}
                    </div>

                    {/* Stock */}
                    <div>
                        <label htmlFor="stock" className="block text-sm font-semibold text-gray-700 mb-2">
                            Stock <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                            </div>
                            <input
                                type="number"
                                id="stock"
                                name="stock"
                                value={formData.stock}
                                onChange={handleChange}
                                min="0"
                                placeholder="0"
                                className={`block w-full pl-10 pr-3 py-2.5 rounded-lg shadow-sm sm:text-sm transition-colors ${errors.stock
                                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                                    : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400'
                                    }`}
                            />
                        </div>
                        {errors.stock && (
                            <p className="mt-1.5 text-sm text-red-600 flex items-center">
                                <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                {errors.stock}
                            </p>
                        )}
                        {formData.stock !== '' && parseInt(formData.stock) < 10 && (
                            <div className="mt-2 bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded">
                                <p className="text-sm text-yellow-800 flex items-center">
                                    <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    <span className="font-medium">Stock bajo</span>
                                    <span className="ml-1">(menos de 10 unidades)</span>
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-2">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-5 py-2.5 border-2 border-gray-300 rounded-lg shadow-sm text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all"
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2.5 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 active:scale-95"
                >
                    {submitting ? (
                        <span className="flex items-center">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Guardando...
                        </span>
                    ) : (
                        <span className="flex items-center">
                            <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                            {isEditMode ? 'Actualizar Producto' : 'Crear Producto'}
                        </span>
                    )}
                </button>
            </div>
        </form>
    );
}
