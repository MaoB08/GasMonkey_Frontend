import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function KPICard({ title, value, subtitle, icon: Icon, trend, color = 'blue' }) {
    const colorClasses = {
        blue: 'from-blue-100 to-blue-200 text-blue-600',
        green: 'from-green-100 to-green-200 text-green-600',
        yellow: 'from-yellow-100 to-yellow-200 text-yellow-600',
        purple: 'from-purple-100 to-purple-200 text-purple-600',
        pink: 'from-pink-100 to-pink-200 text-pink-600'
    };

    const isPositive = trend && trend.startsWith('+');
    const isNegative = trend && trend.startsWith('-');

    return (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 transform transition-all hover:scale-105">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <p className="text-sm font-semibold text-gray-600">{title}</p>
                    <h2 className="text-3xl font-bold text-gray-900 mt-2">{value}</h2>
                    {subtitle && (
                        <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
                    )}
                </div>
                <div className={`bg-gradient-to-br ${colorClasses[color]} p-3 rounded-xl`}>
                    <Icon className="h-8 w-8" />
                </div>
            </div>
            {trend && (
                <div className="flex items-center gap-1 mt-2">
                    {isPositive && <TrendingUp className="h-4 w-4 text-green-600" />}
                    {isNegative && <TrendingDown className="h-4 w-4 text-red-600" />}
                    <span className={`text-sm font-semibold ${isPositive ? 'text-green-600' : isNegative ? 'text-red-600' : 'text-gray-600'}`}>
                        {trend}
                    </span>
                    <span className="text-sm text-gray-500">vs período anterior</span>
                </div>
            )}
        </div>
    );
}
