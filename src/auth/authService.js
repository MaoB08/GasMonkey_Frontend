import Swal from 'sweetalert2';

const API_URL = import.meta.env.VITE_API_URL;

export async function login({ username, password }) {
  try {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      let errorMessage = 'Error al iniciar sesión';
      try {
        const error = await response.json();
        errorMessage = error.error || error.message || errorMessage;
      } catch (e) { }

      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: errorMessage,
      });

      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    Swal.fire({
      toast: true,
      icon: 'error',
      title: 'No se pudo conectar al servicio',
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
    });

    return null;
  }
}

export async function verify2FA({ code, tempToken }) {
  try {
    const response = await fetch(`${API_URL}/api/auth/verify-2fa`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, tempToken }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Error al verificar código');
    }

    const data = await response.json();

    // Don't store in localStorage here - let AuthContext handle it
    // This prevents duplicate storage and ensures consistent state management

    return data;
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Código inválido',
      text: error.message,
    });
    return null;
  }
}

export async function resendCode({ tempToken }) {
  try {
    const response = await fetch(`${API_URL}/api/auth/resend-code`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tempToken }),
    });

    if (!response.ok) {
      throw new Error('Error al reenviar código');
    }

    const data = await response.json();

    Swal.fire({
      icon: 'success',
      title: 'Código reenviado',
      text: `Se envió un nuevo código a ${data.email}`,
      timer: 2000
    });

    return data;
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se pudo reenviar el código',
    });
    return null;
  }
}

