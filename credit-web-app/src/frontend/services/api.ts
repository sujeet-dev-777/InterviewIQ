import axios from 'axios';

const API_URL = 'http://localhost:5000/api'; // Adjust the URL as needed

export const buyCredits = async (amount: number) => {
    try {
        const response = await axios.post(`${API_URL}/buy-credits`, { amount });
        return response.data;
    } catch (error) {
        throw new Error('Error purchasing credits: ' + error.message);
    }
};