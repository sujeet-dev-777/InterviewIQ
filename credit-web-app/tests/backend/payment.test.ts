import request from 'supertest';
import app from '../../src/backend/server'; // Adjust the path as necessary
import { createMockUser } from '../utils/mockData'; // Assuming you have a utility to create mock user data

describe('Payment API', () => {
    let user;

    beforeAll(async () => {
        user = await createMockUser(); // Create a mock user for testing
    });

    afterAll(async () => {
        // Clean up any resources if necessary
    });

    it('should process a dummy payment successfully', async () => {
        const response = await request(app)
            .post('/api/payments') // Adjust the endpoint as necessary
            .send({
                userId: user.id,
                amount: 100, // Example amount
            });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', 'Payment processed successfully');
        expect(response.body).toHaveProperty('transactionId');
    });

    it('should return an error for invalid payment data', async () => {
        const response = await request(app)
            .post('/api/payments')
            .send({
                userId: user.id,
                amount: -50, // Invalid amount
            });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error', 'Invalid payment data');
    });
});