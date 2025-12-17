import axios from 'axios';

const API_URL = 'http://localhost:3000/api/support';

/**
 * Envía un mensaje de soporte
 * @param {Object} formData - Datos del formulario
 * @param {string} formData.nombre - Nombre del remitente
 * @param {string} formData.email - Email del remitente
 * @param {string} formData.asunto - Asunto del mensaje
 * @param {string} formData.mensaje - Mensaje
 * @returns {Promise} - Respuesta del servidor
 */
export const sendSupportMessage = async (formData) => {
    try {
        const response = await axios.post(`${API_URL}/send`, formData);
        return response.data;
    } catch (error) {
        console.error('Error al enviar mensaje de soporte:', error);
        throw error.response?.data || { error: 'Error al enviar el mensaje' };
    }
};

export default {
    sendSupportMessage
};
