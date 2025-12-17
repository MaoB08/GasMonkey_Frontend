import React from 'react';
import { AlertTriangle, Package } from 'lucide-react';

export default function LowStockAlert({ products }) {
    if (!products || products.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Package className="h-5 w-5 text-green-600" />
                    Stock Bajo
                </h3>
                <p className="text-gray-500 text-center py-4">✅ No hay productos con stock bajo</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
                Alertas de Stock Bajo
            </h3>
            <div className="space-y-3 max-h-[300px] overflow-y-auto">
                {products.map((product, index) => (
                    <div
                        key={index}
                        className={`p-3 rounded-lg border-l-4 ${product.status === 'out_of_stock'
                                ? 'bg-red-50 border-red-500'
                                : 'bg-orange-50 border-orange-500'
                            }`}
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-semibold text-gray-900">{product.product_name}</p>
                                <p className="text-sm text-gray-600">Código: {product.product_code}</p>
                            </div>
                            <div className="text-right">
                                <p className={`text-lg font-bold ${product.status === 'out_of_stock' ? 'text-red-600' : 'text-orange-600'
                                    }`}>
                                    {product.current_stock}
                                </p>
                                <p className="text-xs text-gray-500">Mín: {product.min_stock}</p>
                            </div>
                        </div>
                        {product.status === 'out_of_stock' && (
                            <p className="text-xs text-red-600 font-semibold mt-1">⚠️ AGOTADO</p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
