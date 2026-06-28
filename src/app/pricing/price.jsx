'use client';

// app/pricing/page.jsx
import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Check, CreditCard, Sparkles, Loader2 } from 'lucide-react';
import { startCheckout } from '../lib/Checkout';

const PLANS = [
    {
        id: 'user_free',
        name: 'Free',
        price: 0,
        maxApplicationPerMonth: 3,
        features: ['3 purchases per month', 'Community support', 'Standard profile visibility'],
    },
    {
        id: 'user_pro',
        name: 'Pro',
        price: 9.99,
        maxApplicationPerMonth: 9,
        popular: true,
        features: ['9 purchases per month', 'Priority review queue', 'Pro badge on profile', 'Email support'],
    },
    {
        id: 'user_premium',
        name: 'Premium',
        price: 19.99,
        maxApplicationPerMonth: -1,
        features: ['Unlimited purchases', 'Priority review queue', 'Premium badge on profile', 'Dedicated support'],
    },
];

export default function PricingPage({ currentPlanId, buyerId }) {

    console.log(buyerId)

    const searchParams = useSearchParams();
    const returnTo = searchParams.get('returnTo');
    const [loadingPlanId, setLoadingPlanId] = useState(null);

    const handleUpgrade = async (plan) => {
        setLoadingPlanId(plan.id);
        await startCheckout({
            purchaseType: 'subscription',
            planId: plan.id,
            buyerId: buyerId,
            interval: 'month',
            returnPath: returnTo || '/',
        });
        
        setLoadingPlanId(null);
    };

    return (
        <div className="min-h-screen bg-[#000000] px-6 py-24">
            {/* Header */}
            <div className="max-w-2xl mx-auto text-center mb-16">
                <span className="font-mono text-[11px] tracking-[0.25em] uppercase text-[#D9A441]/70">
                    Plans
                </span>
                <h1 className="font-serif text-4xl sm:text-5xl font-bold text-white tracking-tight mt-3">
                    Choose how far you go
                </h1>
                <p className="text-[#9a948a] text-[15px] leading-7 mt-4">
                    Every plan unlocks more purchases per month. Switch or cancel anytime.
                </p>
            </div>

            {/* Cards */}
            <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                {PLANS.map((plan) => {
                    const isCurrent = plan.id === currentPlanId;
                    const isUnlimited = plan.maxApplicationPerMonth === -1;
                    const ghostLabel = isUnlimited ? '∞' : plan.maxApplicationPerMonth;
                    const isLoading = loadingPlanId === plan.id;

                    return (
                        <div
                            key={plan.id}
                            className={[
                                'relative overflow-hidden rounded-2xl p-8 bg-[#0f0e0c] border transition-colors duration-200',
                                plan.popular
                                    ? 'border-[#D9A441] md:-translate-y-3 shadow-[0_0_40px_-10px_rgba(217,164,65,0.35)]'
                                    : isCurrent
                                        ? 'border-[#D9A441]/70'
                                        : 'border-[#262420] hover:border-[#3a372f]',
                            ].join(' ')}
                        >
                            {/* ঘোস্ট নাম্বার — এই প্ল্যানের আসল maxApplicationPerMonth ভ্যালু */}
                            <span
                                aria-hidden="true"
                                className="absolute -top-6 -right-3 font-serif font-bold text-[120px] leading-none text-white/[0.035] select-none"
                            >
                                {ghostLabel}
                            </span>

                            {/* Popular ribbon */}
                            {plan.popular && (
                                <div className="absolute top-0 right-0 flex items-center gap-1 bg-[#D9A441] text-[#15130f] text-[11px] font-bold tracking-wide uppercase px-3 py-1.5 rounded-bl-lg">
                                    <Sparkles className="w-3 h-3" />
                                    Most Popular
                                </div>
                            )}

                            <div className="relative">
                                <div className="flex items-center justify-between mb-1">
                                    <h2 className="font-serif text-2xl font-bold text-white">{plan.name}</h2>
                                    {isCurrent && (
                                        <span className="text-[10px] font-bold uppercase tracking-widest bg-[#D9A441]/15 text-[#D9A441] border border-[#D9A441]/40 rounded-full px-2.5 py-1">
                                            Current
                                        </span>
                                    )}
                                </div>

                                <p className="text-[#9a948a] text-sm mb-6">
                                    {isUnlimited ? 'Unlimited purchases' : `${plan.maxApplicationPerMonth} purchases / month`}
                                </p>

                                <div className="font-mono mb-7">
                                    <span className="text-4xl font-bold text-[#E3A542]">
                                        {plan.price === 0 ? '$0' : `$${plan.price}`}
                                    </span>
                                    {plan.price > 0 && <span className="text-[#9a948a] text-sm ml-1">/mo</span>}
                                </div>

                                <ul className="space-y-3 mb-8">
                                    {plan.features.map((feature) => (
                                        <li key={feature} className="flex items-start gap-2.5 text-[13.5px] text-[#cbc6bc]">
                                            <Check className="w-4 h-4 text-[#34D399] mt-0.5 shrink-0" />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>

                                {isCurrent ? (
                                    <div className="w-full text-center bg-transparent border border-[#262420] text-[#9a948a] font-semibold text-sm py-3 rounded-lg cursor-default">
                                        Your current plan
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => handleUpgrade(plan)}
                                        disabled={isLoading}
                                        className={[
                                            'w-full flex items-center justify-center gap-2 font-semibold text-sm py-3 rounded-lg border transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed',
                                            plan.popular
                                                ? 'bg-[#D9A441] text-[#15130f] border-[#D9A441] hover:bg-[#e3b35e]'
                                                : 'bg-transparent text-white border-[#3a372f] hover:border-[#D9A441]/60',
                                        ].join(' ')}
                                    >
                                        {isLoading ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <>
                                                Upgrade
                                                <CreditCard className="w-4 h-4" />
                                            </>
                                        )}
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}