import { Router } from 'express';
import PaymentController from '../controllers/paymentController';

const router = Router();
const paymentController = new PaymentController();

router.post('/buy-credits', paymentController.buyCredits);

export default router;