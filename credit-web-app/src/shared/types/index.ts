export type CreditPurchase = {
    amount: number;
    userId: string;
    transactionId: string;
};

export interface PaymentResponse {
    success: boolean;
    message: string;
    transactionId?: string;
}

export interface User {
    id: string;
    name: string;
    email: string;
    credits: number;
}