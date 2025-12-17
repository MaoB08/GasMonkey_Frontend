import React from 'react';
import { Activity } from 'lucide-react';

export default function RealtimeIndicator({ lastUpdate }) {
    return (
        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20">
            <Activity className="h-5 w-5 text-green-400 animate-pulse" />
            <div className="text-white">
                <p className="text-xs font-medium opacity-90">Actualizado</p>
                <p className="text-sm font-bold">{lastUpdate}</p>
            </div>
        </div>
    );
}
