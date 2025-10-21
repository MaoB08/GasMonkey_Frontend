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
      } catch (e) {}

      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: errorMessage,
      });

      return null;
    }

    const data = await response.json();
    
    if (data.token && data.user) {
      localStorage.setItem('accessToken', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    
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

