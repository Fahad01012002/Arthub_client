// app/pricing/success/page.jsx
import { stripe } from "@/app/lib/stripe"
import { redirect } from "next/navigation"
import Link from "next/link"
import { CheckCircleIcon } from "lucide-react"
import { createTransactionHistory } from "@/lib/actions/History"
import { updateUserPurchaseCount } from "@/lib/actions/PurchaseCount"
import { updateStatus } from "@/lib/actions/UpdateStatus"
import { updateUser } from "@/lib/actions/UpdateUser"
// 🎯 এখানে তোমার সাবস্ক্রিপশন আপডেট করার অ্যাকশন বা ফাংশনটি ইম্পোর্ট করো
// import { updateUserSubscription } from "@/lib/actions/Subscription" 

export default async function Success({ searchParams }) {
    const { session_id } = await searchParams;

    if (!session_id)
        throw new Error('Please provide a valid session_id (`cs_test_...`)')

    // ১. স্ট্রাইপ থেকে সেশনের ডাটা এবং মেটাডাটা রিট্রিভ করা হচ্ছে
    const session = await stripe.checkout.sessions.retrieve(session_id, {
        expand: ['line_items', 'payment_intent']
    })

    const {
        status,
        metadata,
        amount_total,
        currency
    } = session;

    if (status === 'open') {
        return redirect('/')
    }

    if (status === 'complete') {
        // ২. মেটাডাটা থেকে আইডিগুলো বের করা
        const { artworkId, planId, userId, buyerId, purchaseType, returnPath } = metadata || {};

        // পেমেন্ট টাইপ চেক করার ফ্ল্যাগ
        const isSubscription = purchaseType === 'subscription';



        // 🎯 ৩. ডাটাবেজ আপডেট কন্ডিশনাল লজিক 
        if (isSubscription) {

            // ========================================================
            // 🔄 [সাবস্ক্রিপশন পেমেন্ট হ্যান্ডলিং]
            // ========================================================
            if (planId && buyerId) {

                const data = {
                    sessionId: session_id,
                    buyerId: buyerId,
                    amount: amount_total / 100,
                    currency,
                    status: 'success',
                    type: 'Subscription'
                }

                // ট্রানজেকশন হিস্ট্রি তৈরি
                await createTransactionHistory(data);

                await updateUser(planId, buyerId);


            }

        } else {

            // ========================================================
            // 🎨 [ওয়ান-টাইম আর্টওয়ার্ক পেমেন্ট হ্যান্ডলিং]
            // ========================================================
            if (artworkId && buyerId) {
                const data = {
                    sessionId: session_id,
                    artworkId,
                    userId: userId,
                    buyerId: buyerId,
                    amount: amount_total / 100,
                    currency,
                    status: 'success',
                    type: 'Purchase'
                }

                // ট্রানজেকশন হিস্ট্রি তৈরি
                await createTransactionHistory(data);

                // ইউজারের পারচেজ কাউন্ট বাড়ানো
                await updateUserPurchaseCount(buyerId);

                // আর্টওয়ার্কের স্ট্যাটাস SOLD করা
                await updateStatus(artworkId);
            }
        }

        // ৪. ডাইনামিক টেক্সট এবং ইউআই কনফিগারেশন
        const formattedAmount = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency || 'usd'
        }).format(amount_total / 100);

        const shortSessionId = session_id.length > 20
            ? `${session_id.slice(0, 12)}...${session_id.slice(-4)}`
            : session_id;

        // ৫. বাটন রিডাইরেক্ট ইউআরএল সেটিং (যদি returnPath থাকে তবে সেখানে যাবে, নাহলে ড্যাশবোর্ডে যাবে)
        const finalRedirectUrl = returnPath || "/";

        return (
            <div className="min-h-screen bg-black flex items-center justify-center p-4 mt-20">
                <div className="max-w-120 w-full">
                    <div className="bg-[#1a1b1f] rounded-2xl border border-[#2A2A3A] p-8 shadow-2xl shadow-black/50">

                        {/* Logo */}
                        <div className="flex items-center justify-center bg-[#1a1b1f] mb-5">
                            <div className="relative flex items-center justify-center w-20 h-20 rounded-full bg-emerald-500/10">
                                <div className="absolute inset-0 rounded-full bg-emerald-400/20 blur-md" />
                                <div className="relative flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-400/10">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Status Badge */}
                        <div className="flex justify-center mb-4">
                            <div className="flex items-center gap-2 bg-[#1A1A2E] border border-[#4b4b64] rounded-full px-3 py-1">
                                <CheckCircleIcon className="w-3.5 h-3.5 text-[#60A5FA]" />
                                <span className="text-[10px] font-semibold text-[#3B82F6] tracking-widest uppercase">
                                    {isSubscription ? "Subscription Activated" : "Payment Successful"}
                                </span>
                            </div>
                        </div>

                        {/* Heading */}
                        <h1 className="text-[30px] font-bold leading-9 text-white text-center tracking-tight mb-6">
                            {isSubscription ? "Welcome to Premium!" : "Purchase Completed!"}
                        </h1>

                        {/* Dynamic Price Message */}
                        <p className="text-[#94A3B8] text-[16px] leading-7 text-center mb-4">
                            Your payment of <span className="text-white font-semibold">{formattedAmount}</span> was received perfectly.
                        </p>

                        {/* Dynamic Paragraph Description */}
                        <p className="text-center text-gray-400 text-[14px] font-medium leading-6 mb-8">
                            {isSubscription ? (
                                <>Your account subscription plan has been upgraded successfully. Access unlocked!</>
                            ) : (
                                <>The artwork status has been updated to <span className="text-[#34D399]">SOLD</span> and added to your purchase history.</>
                            )}
                        </p>

                        {/* Session ID */}
                        <div className="flex items-center justify-between bg-[#000000] border border-[#2A2A3A] rounded-lg p-4 mb-8">
                            <div className="flex items-center gap-2">
                                <CheckCircleIcon className="w-3.5 h-3.5 text-gray-400" />
                                <span className="text-xs text-[#94A3B8] font-medium">Session ID verified</span>
                            </div>
                            <span title={session_id} className="text-xs text-[#E2E8F0] font-mono bg-[#1F2937] px-3 py-1 rounded border border-[#2A2A3A]">
                                {shortSessionId}
                            </span>
                        </div>

                        {/* Dynamic Button */}
                        <Link
                            href={finalRedirectUrl}
                            className="w-full block text-center bg-white text-black font-bold text-[16px] leading-6 py-4 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                        >
                            {returnPath && returnPath !== '/' ? "Return to Previous Page" : "Go to Dashboard"}
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    // Fallback
    return (
        <div className="min-h-screen bg-[#0D0D14] flex items-center justify-center p-4">
            <div className="bg-[#14141E] rounded-2xl border border-[#2A2A3A] p-8 max-w-md w-full text-center">
                <h2 className="text-xl font-semibold text-white">Payment Status</h2>
                <p className="text-[#94A3B8] mt-2">Status: {status}</p>
                <Link href="/" className="mt-4 inline-block text-[#7C3AED] hover:text-[#A78BFA] font-medium transition">
                    Return to Home
                </Link>
            </div>
        </div>
    )
}