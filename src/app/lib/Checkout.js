import { toast } from "react-toastify";

export async function startCheckout({ 
    purchaseType = 'one_time',
    artworkId = null,
    planId = null,
    buyerId, 
    interval = 'month', 
    intervalCount = 1, 
    returnPath 
}) {
    toast.loading("Redirecting to checkout...", { id: "stripe-loading" });
    
    try {
  
        if (purchaseType === 'one_time' && !artworkId) {
            throw new Error("Artwork ID is required for one-time purchases.");
        }
        if (purchaseType === 'subscription' && !planId) {
            throw new Error("Plan ID is required for subscriptions.");
        }

        const response = await fetch('/api/checkout_sessions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                purchaseType,
                artworkId, 
                planId,
                buyerId, 
                interval, 
                intervalCount, 
                returnPath 
            }),
        });

        const result = await response.json();
        if (result?.url) {
            window.location.href = result.url;
        } else {
            toast.error(result?.error || "Failed to initialize Stripe checkout session.");
        }
    } catch (error) {
        console.error(error);
        toast.error(error.message || "Something went wrong.");
    } finally {
        toast.dismiss("stripe-loading");
    }
}