import { useState } from 'react';
import { INVOICE_STATUSES } from '../../../utils/constants';

/**
 * Componente de filtros para la lista de facturas
 * @param {function} onFilterChange - Callback que se ejecuta cuando cambian los filtros
 */
export default function InvoiceFilters({ onFilterChange }) {
    const [filters, setFilters] = useState({
        status: '',
        start_date: '',
        end_date: '',
        customer_search: ''
    });

    const handleFilterChange = (field, value) => {
        const newFilters = { ...filters, [field]: value };
        setFilters(newFilters);

        // Enviar solo filtros con valores
        const activeFilters = Object.entries(newFilters).reduce((acc, [key, val]) => {
            if (val) acc[key] = val;
            return acc;
        }, {});

        onFilterChange(activeFilters);
    };

    const clearFilters = () => {
        setFilters({
            status: '',
            start_date: '',
            end_date: '',
            customer_search: ''
        });
        onFilterChange({});
    };

    const hasActiveFilters = Object.values(filters).some(val => val !== '');

    return (
        <div className="bg-white p-4 rounded-lg shadow mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Filtro por estado */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Estado
                    </label>
                    <select
                        value={filters.status}
                        onChange={(e) => handleFilterChange('status', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Todos</option>
                        <option value={INVOICE_STATUSES.DRAFT}>Borrador</option>
                        <option value={INVOICE_STATUSES.SENT}>Enviada</option>
                        <option value={INVOICE_STATUSES.ACCEPTED}>Aceptada</option>
                        <option value={INVOICE_STATUSES.REJECTED}>Rechazada</option>
                        <option value={INVOICE_STATUSES.CANCELLED}>Anulada</option>
                    </select>
                </div>

                {/* Filtro por fecha inicio */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Fecha desde
                    </label>
                    <input
                        type="date"
                        value={filters.start_date}
                        onChange={(e) => handleFilterChange('start_date', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Filtro por fecha fin */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Fecha hasta
                    </label>
                    <input
                        type="date"
                        value={filters.end_date}
                        onChange={(e) => handleFilterChange('end_date', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Filtro por cliente */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Cliente
                    </label>
                    <input
                        type="text"
                        value={filters.customer_search}
                        onChange={(e) => handleFilterChange('customer_search', e.target.value)}
                        placeholder="Buscar por nombre o NIT..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>

            {/* Botón limpiar filtros */}
            {hasActiveFilters && (
                <div className="mt-4 flex justify-end">
                    <button
                        onClick={clearFilters}
                        className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded"
                    >
                        Limpiar filtros
                    </button>
                </div>
            )}
        </div>
    );
}
