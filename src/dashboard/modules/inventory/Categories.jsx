import { useState } from 'react';
import CategoryList from './CategoryList';
import CategoryForm from './CategoryForm';

/**
 * Página principal de gestión de categorías
 */
export default function Categories() {
    const [showForm, setShowForm] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const handleNewCategory = () => {
        setSelectedCategory(null);
        setShowForm(true);
    };

    const handleEdit = (category) => {
        setSelectedCategory(category);
        setShowForm(true);
    };

    const handleFormSuccess = () => {
        setShowForm(false);
        setSelectedCategory(null);
        setRefreshTrigger(prev => prev + 1);
    };

    const handleFormCancel = () => {
        setShowForm(false);
        setSelectedCategory(null);
    };

    const handleRefresh = () => {
        setRefreshTrigger(prev => prev + 1);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="px-4 sm:px-6 lg:px-8 py-8">
                {/* Header with Gradient */}
                <div className="bg-gradient-to-r from-purple-600 to-indigo-700 rounded-2xl shadow-xl p-8 mb-8">
                    <div className="sm:flex sm:items-center sm:justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                                <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-white">Gestión de Categorías</p>
                                <p className="mt-1 text-purple-100">
                                    Organiza y administra las categorías de tu inventario
                                </p>
                            </div>
                        </div>
                        <div className="mt-4 sm:mt-0">
                            <button
                                onClick={handleNewCategory}
                                className="inline-flex items-center px-6 py-3 border-2 border-white/30 rounded-xl shadow-lg text-sm font-semibold text-white bg-white/10 backdrop-blur-sm hover:bg-white/20 hover:border-white/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition-all transform hover:scale-105"
                            >
                                <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                </svg>
                                Nueva Categoría
                            </button>
                        </div>
                    </div>
                </div>

                {/* Form Panel */}
                {showForm && (
                    <div className="mb-6 bg-white rounded-xl shadow-lg border border-gray-200 p-6 animate-fadeIn">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-900 flex items-center">
                                <svg className="h-6 w-6 text-purple-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                {selectedCategory ? 'Editar Categoría' : 'Nueva Categoría'}
                            </h2>
                        </div>
                        <CategoryForm
                            category={selectedCategory}
                            onSuccess={handleFormSuccess}
                            onCancel={handleFormCancel}
                        />
                    </div>
                )}

                {/* List */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                    <CategoryList
                        onEdit={handleEdit}
                        onRefresh={handleRefresh}
                        refreshTrigger={refreshTrigger}
                    />
                </div>
            </div>
        </div>
    );
}
