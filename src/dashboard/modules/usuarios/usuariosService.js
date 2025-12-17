const API_URL = "http://localhost:3000/api"; 

// Listar usuarios
export async function listarUsuarios() {
  try {
    const response = await fetch(`${API_URL}/usuarios/listar`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      throw new Error('Error al traer los usuarios');
    }

    return await response.json();
  } catch (error) {
    console.error('❌ Error en listarUsuarios:', error);
    throw error;
  }
}

// Crear usuario
export async function crearUsuario(datos) {
  try {
    const response = await fetch(`${API_URL}/usuarios/crear`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos),
    });

    if (!response.ok) throw new Error('Error al crear usuario');
    return await response.json();
  } catch (error) {
    console.error('❌ Error en crearUsuario:', error);
    throw error;
  }
}

// Editar usuario
export async function editarUsuario(id, datosActualizados) {
  try {
    const response = await fetch(`${API_URL}/usuarios/editar/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datosActualizados),
    });

    if (!response.ok) throw new Error('Error al editar usuario');
    return await response.json();
  } catch (error) {
    console.error('❌ Error en editarUsuario:', error);
    throw error;
  }
}

// Eliminar usuario
export async function eliminarUsuario(id) {
  try {
    const response = await fetch(`${API_URL}/usuarios/eliminar/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) throw new Error('Error al eliminar usuario');
    return await response.json();
  } catch (error) {
    console.error('❌ Error en eliminarUsuario:', error);
    throw error;
  }
}