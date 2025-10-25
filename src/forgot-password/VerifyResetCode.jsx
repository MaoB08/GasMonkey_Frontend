import { useState, useEffect, useRef } from 'react';
import { verifyResetCode, resendResetCode } from './passwordResetService';
import { ResetPassword } from './ResetPassword';
import Swal from 'sweetalert2';

export function VerifyResetCode({ email, onBack }) {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(900); // 15 minutos
  const [canResend, setCanResend] = useState(false);
  const [verified, setVerified] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleChange = (index, value) => {
    if (value.length > 1) value = value.slice(-1);
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === 'Enter' && code.join('').length === 6) {
      handleVerify();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim().slice(0, 6);
    
    if (!/^\d+$/.test(pastedData)) {
      Swal.fire({
        icon: 'error',
        title: 'Código inválido',
        text: 'El código debe contener solo números',
        timer: 2000
      });
      return;
    }

    const newCode = [...code];
    pastedData.split('').forEach((char, i) => {
      if (i < 6) newCode[i] = char;
    });
    setCode(newCode);

    const lastIndex = Math.min(pastedData.length, 5);
    inputRefs.current[lastIndex]?.focus();
  };

  const handleVerify = async () => {
    const fullCode = code.join('');
    
    if (fullCode.length !== 6) {
      Swal.fire({
        icon: 'warning',
        title: 'Código incompleto',
        text: 'Por favor ingresa los 6 dígitos',
      });
      return;
    }

    setLoading(true);

    try {
      const data = await verifyResetCode(email, fullCode);
      
      if (data) {
        Swal.fire({
          icon: 'success',
          title: '¡Código verificado!',
          text: 'Ahora puedes crear tu nueva contraseña',
          timer: 1500,
          showConfirmButton: false,
        }).then(() => {
          setVerified(true);
        });
      } else {
        setCode(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      }
    } catch (error) {
      setCode(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setLoading(true);
    
    try {
      const result = await resendResetCode(email);
      
      if (result) {
        setCountdown(900);
        setCanResend(false);
        setCode(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (verified) {
    return <ResetPassword email={email} code={code.join('')} />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-100 to-[#4D6C98]">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Verifica tu email</h1>
          <p className="text-gray-600 mt-2">Ingresa el código de 6 dígitos que enviamos a</p>
          <p className="text-blue-600 font-medium mt-1">{email}</p>
        </div>

        <div className="flex justify-center gap-2 mb-6">
          {code.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              maxLength="1"
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={(e) => index === 0 && handlePaste(e)}
              disabled={loading}
              className="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all disabled:bg-gray-100"
            />
          ))}
        </div>

        <div className="text-center mb-6">
          <p className="text-sm text-gray-600">
            {countdown > 0 ? (
              <>
                El código expira en{' '}
                <span className={`font-bold ${countdown < 60 ? 'text-red-600' : 'text-blue-600'}`}>
                  {formatTime(countdown)}
                </span>
              </>
            ) : (
              <span className="text-red-600 font-medium">⚠️ Código expirado</span>
            )}
          </p>
        </div>

        <button
          onClick={handleVerify}
          disabled={loading || code.join('').length !== 6 || countdown === 0}
          className="w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 mb-4 shadow-md"
        >
          {loading ? 'Verificando...' : 'Verificar código'}
        </button>

        <div className="text-center mb-4">
          {countdown > 0 && !canResend ? (
            <p className="text-sm text-gray-500">
              Podrás solicitar un nuevo código en {formatTime(countdown)}
            </p>
          ) : (
            <button
              onClick={handleResend}
              disabled={loading}
              className="text-sm text-blue-600 hover:text-blue-700 hover:underline disabled:text-gray-400 disabled:cursor-not-allowed font-medium transition-colors"
            >
              {loading ? 'Reenviando...' : '📧 Reenviar código'}
            </button>
          )}
        </div>

        <div className="border-t border-gray-200 my-4"></div>

        <button
          onClick={onBack}
          disabled={loading}
          className="w-full py-2 text-gray-600 hover:text-gray-800 font-medium flex items-center justify-center gap-2 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Cambiar email
        </button>
      </div>
    </div>
  );
}
