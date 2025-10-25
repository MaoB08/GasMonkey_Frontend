import Swal from 'sweetalert2';

const API_URL = import.meta.env.VITE_API_URL;

export async function requestPasswordReset(email) {
  try {
    const response = await fetch(`${API_URL}/api/password-reset/request-reset`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Error al solicitar recuperación');
    }

    return data;
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.message,
    });
    return null;
  }
}

export async function verifyResetCode(email, code) {
  try {
    const response = await fetch(`${API_URL}/api/password-reset/verify-code`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, code }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Código inválido');
    }

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

export async function resetPassword(email, code, newPassword) {
  try {
    const response = await fetch(`${API_URL}/api/password-reset/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, code, newPassword }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Error al restablecer contraseña');
    }

    return data;
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.message,
    });
    return null;
  }
}

export async function resendResetCode(email) {
  try {
    const response = await fetch(`${API_URL}/api/password-reset/resend-code`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Error al reenviar código');
    }

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
      text: error.message,
    });
    return null;
  }
}