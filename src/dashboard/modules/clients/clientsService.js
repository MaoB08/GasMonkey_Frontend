import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

const clientsService = {
    /**
     * Get all clients
     */
    getAllClients: async () => {
        try {
            const response = await axios.get(`${API_URL}/clients`);
            return response.data.data;
        } catch (error) {
            console.error('Error fetching clients:', error);
            throw error;
        }
    },

    /**
     * Get client by ID
     */
    getClientById: async (id) => {
        try {
            const response = await axios.get(`${API_URL}/clients/${id}`);
            return response.data.data;
        } catch (error) {
            console.error('Error fetching client:', error);
            throw error;
        }
    },

    /**
     * Create new client
     */
    createClient: async (clientData) => {
        try {
            const response = await axios.post(`${API_URL}/clients`, clientData);
            return response.data.data;
        } catch (error) {
            console.error('Error creating client:', error);
            throw error;
        }
    },

    /**
     * Update client
     */
    updateClient: async (id, clientData) => {
        try {
            const response = await axios.put(`${API_URL}/clients/${id}`, clientData);
            return response.data.data;
        } catch (error) {
            console.error('Error updating client:', error);
            throw error;
        }
    },

    /**
     * Delete client
     */
    deleteClient: async (id) => {
        try {
            const response = await axios.delete(`${API_URL}/clients/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting client:', error);
            throw error;
        }
    },

    /**
     * Get all cities for dropdown
     */
    getAllCities: async () => {
        try {
            const response = await axios.get(`${API_URL}/cities`);
            return response.data.data;
        } catch (error) {
            console.error('Error fetching cities:', error);
            throw error;
        }
    }
};

export default clientsService;
