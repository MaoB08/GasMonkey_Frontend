import { useState } from 'react';
import { useAuth } from './useAuth';
import { Link, useNavigate } from "react-router-dom";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import Swal from 'sweetalert2';
import { TwoFactorVerification } from './TwoFactorVerification';
import Logo from '../assets/imagenes/logo.png';

export function LoginForm({ onLogin }) {
    const { handleLogin, loading, error } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [show2FA, setShow2FA] = useState(false);
    const [tempToken, setTempToken] = useState('');
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const result = await handleLogin({ username, password }, (data) => {
            // Si requiere 2FA
            if (data.requires2FA) {
                setTempToken(data.tempToken);
                setEmail(data.email);
                setShow2FA(true);
            } else {
                // Login directo sin 2FA - useAuth ya maneja el context login
                Swal.fire({
                    icon: 'success',
                    title: '¡Bienvenido!',
                    text: 'Inicio de sesión exitoso.',
                    timer: 1500,
                    showConfirmButton: false,
                });

                // Navigate immediately, not in callback
                navigate('/home');
            }
        });
    };

    const handle2FASuccess = (data) => {
        navigate('/home');
    };

    const handleBackToLogin = () => {
        setShow2FA(false);
        setTempToken('');
        setEmail('');
        setUsername('');
        setPassword('');
    };

    // Si está en modo 2FA, mostrar componente de verificación
    if (show2FA) {
        return (
            <TwoFactorVerification
                tempToken={tempToken}
                email={email}
                onSuccess={handle2FASuccess}
                onBack={handleBackToLogin}
            />
        );
    }

    // Login normal
    return (
        <div className='min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-100 to-[#4D6C98]'>
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md ">
                <div className="text-center mb-8">
                    <div className='text-center mb-8 relative'>
                        <img src={Logo} alt="Logo" className='w-34 h-34 absolute left-0 top-1/2 transform -translate-y-1/2' />
                        <h1 className="text-2xl font-bold text-gray-800">¡Bienvenido!</h1>
                    </div>
                    <p className="text-gray-600 mt-2">Gestor de Inventario</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="space-y-5">
                        {error && <p className="text-red-500 text-sm">{error}</p>}

                        {/* Campo Usuario */}
                        <div>
                            <label
                                htmlFor="userName"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Usuario
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg
                                        className="h-5 w-5 text-gray-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M5.121 17.804A13.937 13.937 0 0112 15c2.485 0 4.778.605 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z"
                                        />
                                    </svg>
                                </div>
                                <input
                                    id="userName"
                                    name="userName"
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="Ingresa tu usuario"
                                    required
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                            </div>
                        </div>

                        {/* Campo Contraseña */}
                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Contraseña
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg
                                        className="h-5 w-5 text-gray-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 11c1.657 0 3-1.343 3-3V5a3 3 0 00-6 0v3c0 1.657 1.343 3 3 3zM5 11h14v10H5V11z"
                                        />
                                    </svg>
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                                <div
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                >
                                    {showPassword ? (
                                        <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                                    ) : (
                                        <EyeIcon className="h-5 w-5 text-gray-400" />
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Botón Entrar */}
                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                            >
                                {loading ? 'Entrando...' : 'Entrar'}
                            </button>
                        </div>

                        <Link
                            to="/forgot-password"
                            className="text-sm text-blue-600 hover:text-blue-500 font-medium flex justify-end"
                        >
                            ¿Olvidaste tu contraseña?
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

