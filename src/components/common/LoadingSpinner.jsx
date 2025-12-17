/**
 * Spinner de carga reutilizable
 * @param {string} size - Tamaño del spinner: 'sm', 'md', 'lg' (default: 'md')
 * @param {string} text - Texto opcional a mostrar debajo del spinner
 */
export default function LoadingSpinner({ size = 'md', text = '' }) {
    const sizeClasses = {
        sm: 'w-6 h-6 border-2',
        md: 'w-10 h-10 border-3',
        lg: 'w-16 h-16 border-4'
    };

    return (
        <div className="flex flex-col items-center justify-center py-8">
            <div
                className={`${sizeClasses[size]} border-blue-600 border-t-transparent rounded-full animate-spin`}
            />
            {text && (
                <p className="mt-3 text-gray-600 text-sm">{text}</p>
            )}
        </div>
    );
}
