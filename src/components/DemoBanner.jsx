export function DemoBanner() {
  const isDemoMode = import.meta.env.VITE_DEMO_MODE === 'true';
  
  if (!isDemoMode) return null;
  
  return (
    <div className="bg-yellow-400 text-gray-900 px-4 py-3 shadow-lg">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🎓</span>
          <div>
            <p className="font-bold">MODO EDUCATIVO / DEMO</p>
            <p className="text-sm">
              Las facturas NO se envían a la DIAN real. Esto es solo para práctica.
            </p>
          </div>
        </div>
        
        <div className="text-right">
          <p className="text-xs font-semibold">Proyecto Académico</p>
          <p className="text-xs">Universidad XYZ - 2024</p>
        </div>
      </div>
    </div>
  );
}