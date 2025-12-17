import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InvoiceList from './InvoiceList';
import InvoiceFilters from './InvoiceFilters';

/**
 * Página principal del módulo de facturas
 */
export default function InvoicesPage() {
    const navigate = useNavigate();
    const [filters, setFilters] = useState({});

    return (
        <div className="p-6">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Facturación Electrónica</h1>
                    <p className="text-gray-600 mt-1">Gestiona tus facturas electrónicas</p>
                </div>
                <button
                    onClick={() => navigate('/home/facturas/crear')}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition shadow-lg hover:shadow-xl flex items-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Nueva Factura
                </button>
            </div>

            {/* Filtros */}
            <InvoiceFilters onFilterChange={setFilters} />

            {/* Lista de facturas */}
            <InvoiceList filters={filters} />
        </div>
    );
}
