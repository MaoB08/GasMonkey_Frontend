import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

export default function PaymentMethodsChart({ data }) {
    const COLORS = {
        cash: '#10b981',
        card: '#3b82f6',
        transfer: '#8b5cf6',
        credit: '#f59e0b',
        apartado: '#ec4899'
    };

    const LABELS = {
        cash: 'Efectivo',
        card: 'Tarjeta',
        transfer: 'Transferencia',
        credit: 'Crédito',
        apartado: 'Apartado'
    };

    // Transform data for pie chart
    const chartData = Object.entries(data).map(([key, value]) => ({
        name: LABELS[key] || key,
        value: value,
        color: COLORS[key] || '#6b7280'
    }));

    return (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Métodos de Pago</h3>
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                    >
                        {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}
