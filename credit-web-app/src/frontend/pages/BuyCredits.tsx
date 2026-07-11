import React, { useState } from 'react';
import CreditForm from '../components/CreditForm';
import { initiateDummyPayment } from '../services/api';

const BuyCredits: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handlePayment = async (amount: number) => {
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            await initiateDummyPayment(amount);
            setSuccess('Payment successful! Your credits have been added.');
        } catch (err) {
            setError('Payment failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1>Buy Credits</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>{success}</p>}
            <CreditForm onSubmit={handlePayment} loading={loading} />
        </div>
    );
};

export default BuyCredits;