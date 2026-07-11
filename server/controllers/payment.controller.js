import Payment from "../models/payment.model.js";
import User from "../models/user.model.js";
import stripe from "../services/stripe.service.js";

// create a checkout session and record it in the database
export const createOrder = async (req,res) => {
    try {
        const {planId, amount, credits} = req.body;
          if (!amount || !credits) {
      return res.status(400).json({ message: "Invalid plan data" });
    }

    // amount is expected in rupees on the frontend
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: `${planId} credits`,
            },
            unit_amount: amount * 100, // paise
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/pricing`,
      metadata: {
        userId: req.userId,
        planId,
        credits,
      },
    });

    await Payment.create({
      userId: req.userId,
      planId,
      amount,
      credits,
      stripeSessionId: session.id,
      status: "created",
    });

    return res.json({ sessionId: session.id });

    } catch (error) {
         console.error("createOrder error", error);
         return res.status(500).json({message: `failed to create Stripe session ${error}`});
    }
}

// verify after redirect (or via webhook) that the session actually succeeded
export const verifyPayment = async (req,res) => {
    try {
        const { sessionId } = req.body;
        if (!sessionId) {
          return res.status(400).json({ message: "sessionId required" });
        }

        const session = await stripe.checkout.sessions.retrieve(sessionId, {
          expand: ["payment_intent"],
        });

        if (session.payment_status !== "paid") {
          return res.status(400).json({ message: "Payment not completed" });
        }

        const payment = await Payment.findOne({
          stripeSessionId: sessionId,
        });

        if (!payment) {
          return res.status(404).json({ message: "Payment not found" });
        }

        if (payment.status === "paid") {
          // already done
          const user = await User.findById(payment.userId);
          return res.json({ message: "Already processed", user });
        }

        // Update payment record
        payment.status = "paid";
        // session.payment_intent may be either a string ID or an expanded object
        payment.stripePaymentIntentId =
          typeof session.payment_intent === "object"
            ? session.payment_intent.id
            : session.payment_intent;
        await payment.save();

        // Add credits to user
        const updatedUser = await User.findByIdAndUpdate(payment.userId, {
          $inc: { credits: payment.credits },
        }, { new: true });

        res.json({
          success: true,
          message: "Payment verified and credits added",
          user: updatedUser,
        });

    } catch (error) {
         console.error("verifyPayment error", error);
         return res.status(500).json({message: `failed to verify Stripe payment ${error}`});
    }
}