import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import BuyCredits from '../../src/frontend/pages/BuyCredits';
import * as api from '../../src/frontend/services/api';

jest.mock('../../src/frontend/services/api');

describe('BuyCredits Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders BuyCredits component', () => {
        render(<BuyCredits />);
        expect(screen.getByText(/buy credits/i)).toBeInTheDocument();
    });

    test('submits credit purchase', async () => {
        const mockPurchase = jest.fn().mockResolvedValue({ success: true });
        api.purchaseCredits = mockPurchase;

        render(<BuyCredits />);
        
        fireEvent.change(screen.getByLabelText(/amount/i), { target: { value: '10' } });
        fireEvent.click(screen.getByRole('button', { name: /purchase/i }));

        expect(mockPurchase).toHaveBeenCalledWith(10);
        expect(await screen.findByText(/purchase successful/i)).toBeInTheDocument();
    });

    test('handles purchase failure', async () => {
        const mockPurchase = jest.fn().mockResolvedValue({ success: false });
        api.purchaseCredits = mockPurchase;

        render(<BuyCredits />);
        
        fireEvent.change(screen.getByLabelText(/amount/i), { target: { value: '10' } });
        fireEvent.click(screen.getByRole('button', { name: /purchase/i }));

        expect(mockPurchase).toHaveBeenCalledWith(10);
        expect(await screen.findByText(/purchase failed/i)).toBeInTheDocument();
    });
});