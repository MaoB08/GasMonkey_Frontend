import axios from 'axios';

const API_URL = 'http://localhost:3000/api/analytics';

const getAuthHeaders = () => {
    const token = localStorage.getItem('accessToken');
    return {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    };
};

export const analyticsService = {
    /**
     * Get overview statistics
     */
    getOverview: async () => {
        try {
            const response = await axios.get(`${API_URL}/overview`, getAuthHeaders());
            return response.data;
        } catch (error) {
            console.error('Error fetching overview:', error);
            throw error;
        }
    },

    /**
     * Get sales trend
     * @param {string} period - 'day', 'week', or 'month'
     */
    getSalesTrend: async (period = 'week') => {
        try {
            const response = await axios.get(`${API_URL}/sales-trend?period=${period}`, getAuthHeaders());
            return response.data;
        } catch (error) {
            console.error('Error fetching sales trend:', error);
            throw error;
        }
    },

    /**
     * Get top selling products
     * @param {number} limit - Number of products to return
     */
    getTopProducts: async (limit = 10) => {
        try {
            const response = await axios.get(`${API_URL}/top-products?limit=${limit}`, getAuthHeaders());
            return response.data;
        } catch (error) {
            console.error('Error fetching top products:', error);
            throw error;
        }
    },

    /**
     * Get payment methods distribution
     */
    getPaymentMethods: async () => {
        try {
            const response = await axios.get(`${API_URL}/payment-methods`, getAuthHeaders());
            return response.data;
        } catch (error) {
            console.error('Error fetching payment methods:', error);
            throw error;
        }
    },

    /**
     * Get sales heatmap by hour
     */
    getSalesHeatmap: async () => {
        try {
            const response = await axios.get(`${API_URL}/sales-heatmap`, getAuthHeaders());
            return response.data;
        } catch (error) {
            console.error('Error fetching sales heatmap:', error);
            throw error;
        }
    },

    /**
     * Get low stock products
     */
    getLowStock: async () => {
        try {
            const response = await axios.get(`${API_URL}/low-stock`, getAuthHeaders());
            return response.data;
        } catch (error) {
            console.error('Error fetching low stock:', error);
            throw error;
        }
    }
};
