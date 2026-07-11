import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();

// secret key from environment
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-12-18.acacia",
});

export default stripe;
