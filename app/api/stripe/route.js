// Import the Stripe library
import Stripe from 'stripe';

// Initialize Stripe with the secret key from .env
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * Handles the POST request for creating a Stripe checkout session
 * @param {Request} req - Incoming HTTP request containing cart items
 * @returns {Response} - JSON response with the session ID or error
 */
export async function POST(req) {
  try {
    const cartItems = await req.json();

    const lineItems = cartItems.map((item) => ({
      price_data: {
        currency: 'inr',
        product_data: {
          name: item.name,
        },
        unit_amount: Math.round(item.net_price * 100),
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: process.env.STRIPE_SUCCESS_URL,
      cancel_url: process.env.STRIPE_CANCEL_URL,
    });

    return Response.json({ id: session.id });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
