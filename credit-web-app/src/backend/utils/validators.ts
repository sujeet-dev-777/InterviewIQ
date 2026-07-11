export const validateCreditAmount = (amount: number): boolean => {
    return amount > 0;
};

export const validatePaymentMethod = (method: string): boolean => {
    const validMethods = ['credit_card', 'paypal', 'bank_transfer'];
    return validMethods.includes(method);
};

export const validateUserId = (userId: string): boolean => {
    return userId.length > 0; // Assuming userId should not be empty
};