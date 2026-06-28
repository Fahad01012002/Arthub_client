import 'server-only'

import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const PLAN_PRICES = {
    'user_free': 0,
    'user_pro': 9.99,
    'user_premium': 19.99
};