import { useState } from 'react';
import ProductList from './ProductList';
import ProductForm from './ProductForm';
import { categoryService } from '../../../services/inventoryApi';
import { useAuth } from '../../../auth/useAuth';
import { useEffect } from 'react';

/**
 * Página principal de gestión de productos
 */
export default function Products() {
    const { token } = useAuth();
    const [showForm, setShowForm] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [categories, setCategories] = useState([]);

    // Filter states
    const [filters, setFilters] = useState({
        search: '',
        category_id: '',
        low_stock: false,
        min_price: '',
        max_price: ''
    });

    useEffect(() => {
        loadCategories();
    }, []);

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

    const handleNewProduct = () => {
        setSelectedProduct(null);
        setShowForm(true);
    };

    const handleEdit = (product) => {
        setSelectedProduct(product);
        setShowForm(true);
    };

    const handleFormSuccess = () => {
        setShowForm(false);
        setSelectedProduct(null);
        setRefreshTrigger(prev => prev + 1);
    };

    const handleFormCancel = () => {
        setShowForm(false);
        setSelectedProduct(null);
    };

    const handleRefresh = () => {
        setRefreshTrigger(prev => prev + 1);
    };

    const handleFilterChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleClearFilters = () => {
        setFilters({
            search: '',
            category_id: '',
            low_stock: false,
            min_price: '',
            max_price: ''
        });
    };

    const activeFiltersCount = Object.values(filters).filter(v => v !== '' && v !== false).length;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="px-4 sm:px-6 lg:px-8 py-8">
                {/* Header with Gradient */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl shadow-xl p-8 mb-8">
                    <div className="sm:flex sm:items-center sm:justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                                <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-white">Gestión de Productos</p>
                                <p className="mt-1 text-blue-100">
                                    Administra tu inventario de forma eficiente
                                </p>
                            </div>
                        </div>
                        <div className="mt-4 sm:mt-0">
                            <button
                                onClick={handleNewProduct}
                                className="inline-flex items-center px-6 py-3 border-2 border-white/30 rounded-xl shadow-lg text-sm font-semibold text-white bg-white/10 backdrop-blur-sm hover:bg-white/20 hover:border-white/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition-all transform hover:scale-105"
                            >
                                <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                </svg>
                                Nuevo Producto
                            </button>
                        </div>
                    </div>
                </div>

                {/* Filters Section */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-6">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-3">
                            <div className="bg-blue-100 p-2 rounded-lg">
                                <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900">Filtros de Búsqueda</h3>
                            {activeFiltersCount > 0 && (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    {activeFiltersCount} activo{activeFiltersCount > 1 ? 's' : ''}
                                </span>
                            )}
                        </div>
                        {activeFiltersCount > 0 && (
                            <button
                                onClick={handleClearFilters}
                                className="inline-flex items-center px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                            >
                                <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                Limpiar Filtros
                            </button>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5">
                        {/* Search */}
                        <div>
                            <label htmlFor="search" className="block text-sm font-semibold text-gray-700 mb-2">
                                Buscar
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    id="search"
                                    name="search"
                                    value={filters.search}
                                    onChange={handleFilterChange}
                                    placeholder="Nombre o código..."
                                    className="block w-full pl-10 pr-3 py-2.5 rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400 sm:text-sm transition-colors"
                                />
                            </div>
                        </div>

                        {/* Category */}
                        <div>
                            <label htmlFor="category_id" className="block text-sm font-semibold text-gray-700 mb-2">
                                Categoría
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
                                    value={filters.category_id}
                                    onChange={handleFilterChange}
                                    className="block w-full pl-10 pr-3 py-2.5 rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400 sm:text-sm transition-colors"
                                >
                                    <option value="">Todas</option>
                                    {categories.map(category => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Min Price */}
                        <div>
                            <label htmlFor="min_price" className="block text-sm font-semibold text-gray-700 mb-2">
                                Precio Mínimo
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <span className="text-gray-500 font-medium">$</span>
                                </div>
                                <input
                                    type="number"
                                    id="min_price"
                                    name="min_price"
                                    value={filters.min_price}
                                    onChange={handleFilterChange}
                                    min="0"
                                    placeholder="0"
                                    className="block w-full pl-8 pr-3 py-2.5 rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400 sm:text-sm transition-colors"
                                />
                            </div>
                        </div>

                        {/* Max Price */}
                        <div>
                            <label htmlFor="max_price" className="block text-sm font-semibold text-gray-700 mb-2">
                                Precio Máximo
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <span className="text-gray-500 font-medium">$</span>
                                </div>
                                <input
                                    type="number"
                                    id="max_price"
                                    name="max_price"
                                    value={filters.max_price}
                                    onChange={handleFilterChange}
                                    min="0"
                                    placeholder="999999"
                                    className="block w-full pl-8 pr-3 py-2.5 rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400 sm:text-sm transition-colors"
                                />
                            </div>
                        </div>

                        {/* Low Stock */}
                        <div className="flex items-end">
                            <label className="flex items-center space-x-3 cursor-pointer bg-gray-50 hover:bg-gray-100 px-4 py-3 rounded-lg transition-colors w-full">
                                <input
                                    type="checkbox"
                                    name="low_stock"
                                    checked={filters.low_stock}
                                    onChange={handleFilterChange}
                                    className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                />
                                <span className="text-sm font-medium text-gray-700 flex items-center">
                                    <svg className="h-5 w-5 text-yellow-500 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    Stock Bajo
                                </span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Form Panel */}
                {showForm && (
                    <div className="mb-6 bg-white rounded-xl shadow-lg border border-gray-200 p-6 animate-fadeIn">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-900 flex items-center">
                                <svg className="h-6 w-6 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                {selectedProduct ? 'Editar Producto' : 'Nuevo Producto'}
                            </h2>
                        </div>
                        <ProductForm
                            product={selectedProduct}
                            onSuccess={handleFormSuccess}
                            onCancel={handleFormCancel}
                        />
                    </div>
                )}

                {/* List */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                    <ProductList
                        onEdit={handleEdit}
                        onRefresh={handleRefresh}
                        refreshTrigger={refreshTrigger}
                        filters={filters}
                    />
                </div>
            </div>
        </div>
    );
}
