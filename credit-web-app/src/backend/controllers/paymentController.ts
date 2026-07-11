import { Request, Response } from 'express';
import { processDummyPayment } from '../services/paymentService';

class PaymentController {
    async buyCredits(req: Request, res: Response): Promise<void> {
        try {
            const { userId, amount } = req.body;

            // Call the service to process the dummy payment
            const result = await processDummyPayment(userId, amount);

            res.status(200).json({
                success: true,
                message: 'Payment processed successfully',
                data: result,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Payment processing failed',
                error: error.message,
            });
        }
    }
}

export default new PaymentController();