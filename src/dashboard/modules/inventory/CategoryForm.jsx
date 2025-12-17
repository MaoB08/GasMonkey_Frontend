import { useState, useEffect } from 'react';
import { categoryService } from '../../../services/inventoryApi';
import { useAuth } from '../../../auth/useAuth';

/**
 * Formulario para crear/editar categorías
 */
export default function CategoryForm({ category, onSuccess, onCancel }) {
    const { token } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        code_prefix: ''
    });
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    const isEditMode = !!category;

    useEffect(() => {
        if (category) {
            setFormData({
                name: category.name || '',
                description: category.description || '',
                code_prefix: category.code_prefix || ''
            });
        }
    }, [category]);

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'El nombre es requerido';
        }

        if (!formData.code_prefix.trim()) {
            newErrors.code_prefix = 'El prefijo es requerido';
        } else if (!/^[A-Z0-9]+$/.test(formData.code_prefix)) {
            newErrors.code_prefix = 'El prefijo debe ser mayúsculas sin espacios';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'code_prefix' ? value.toUpperCase() : value
        }));
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

            if (isEditMode) {
                await categoryService.update(category.id, formData, token);
            } else {
                await categoryService.create(formData, token);
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
            {/* Name Field */}
            <div>
                <label htmlFor="name" className="block text-sm font-semibold text-gray-900 mb-2">
                    <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                        Nombre de la Categoría
                        <span className="text-red-500">*</span>
                    </div>
                </label>
                <div className="relative">
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Ej: Electrónica, Alimentos, Ropa..."
                        className={`block w-full px-4 py-3 rounded-lg border-2 transition-all ${errors.name
                                ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                                : 'border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-100'
                            } text-gray-900 placeholder-gray-400 focus:outline-none`}
                        autoFocus
                    />
                    {formData.name && !errors.name && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                    )}
                </div>
                {errors.name && (
                    <div className="mt-2 flex items-center gap-1 text-red-600">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <p className="text-sm font-medium">{errors.name}</p>
                    </div>
                )}
            </div>

            {/* Description Field */}
            <div>
                <label htmlFor="description" className="block text-sm font-semibold text-gray-900 mb-2">
                    <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                        </svg>
                        Descripción
                        <span className="text-gray-400 text-xs font-normal">(Opcional)</span>
                    </div>
                </label>
                <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="3"
                    placeholder="Describe brevemente esta categoría..."
                    className="block w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 text-gray-900 placeholder-gray-400 focus:outline-none transition-all resize-none"
                />
                <p className="mt-2 text-xs text-gray-500 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    Ayuda a identificar el tipo de productos en esta categoría
                </p>
            </div>

            {/* Code Prefix Field */}
            <div>
                <label htmlFor="code_prefix" className="block text-sm font-semibold text-gray-900 mb-2">
                    <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                        </svg>
                        Prefijo de Código
                        <span className="text-red-500">*</span>
                    </div>
                </label>
                <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                        <div className="bg-purple-100 px-2 py-1 rounded text-xs font-mono font-bold text-purple-700">
                            {formData.code_prefix || 'XXX'}
                        </div>
                        <span className="text-gray-400">-</span>
                    </div>
                    <input
                        type="text"
                        id="code_prefix"
                        name="code_prefix"
                        value={formData.code_prefix}
                        onChange={handleChange}
                        placeholder="ELEC"
                        maxLength="10"
                        className={`block w-full pl-32 pr-4 py-3 rounded-lg border-2 transition-all font-mono font-bold uppercase ${errors.code_prefix
                                ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                                : 'border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-100'
                            } text-gray-900 placeholder-gray-400 focus:outline-none`}
                    />
                    {formData.code_prefix && !errors.code_prefix && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                    )}
                </div>
                <div className="mt-2 bg-purple-50 border border-purple-200 rounded-lg p-3">
                    <p className="text-xs text-purple-800 flex items-start gap-2">
                        <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        <span>
                            <strong>Formato:</strong> Solo mayúsculas y números, sin espacios.
                            <br />
                            <strong>Ejemplo:</strong> "ELEC" generará códigos como ELEC-001, ELEC-002
                        </span>
                    </p>
                </div>
                {errors.code_prefix && (
                    <div className="mt-2 flex items-center gap-1 text-red-600">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <p className="text-sm font-medium">{errors.code_prefix}</p>
                    </div>
                )}
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-6 py-3 border-2 border-gray-300 rounded-lg text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all"
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-3 border-2 border-transparent rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 disabled:transform-none shadow-lg hover:shadow-xl"
                >
                    {submitting ? (
                        <span className="flex items-center gap-2">
                            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Guardando...
                        </span>
                    ) : (
                        <span className="flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            {isEditMode ? 'Actualizar Categoría' : 'Crear Categoría'}
                        </span>
                    )}
                </button>
            </div>
        </form>
    );
}
