'use client'

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@heroui/react';
import { toast } from 'react-toastify';
import { usePathname, useRouter } from 'next/navigation';
import { startCheckout } from '@/app/lib/Checkout';

const CardDetailsPage = ({ data, user, currentPackage, id }) => {

    const [limitReached, setLimitReached] = useState(false);

    const router = useRouter();
    const pathname = usePathname();

    const {
        _id: artworkId,
        title,
        category,
        price,
        description,
        imageFile,
        Views,
        Status,
        artistName,
        userId: artistId
    } = data || {};

    const role = user?.role;
    const currentUserId = user?.id;
    const purchaseCount = user?.purchaseCount || 0;

    const isSold = Status?.toLowerCase() === 'sold';
    const isLoggedIn = !!user;
    const isOwner = isLoggedIn && currentUserId === artistId;
    const isAdmin = isLoggedIn && role === 'admin';

    const maxLimit = currentPackage?.maxApplicationPerMonth || 0;


    if (limitReached) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4 bg-[#0a0a0a] text-white">
                <div className="max-w-2xl w-full bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-12 shadow-2xl relative">

                    <button
                        onClick={() => setLimitReached(false)}
                        className="absolute top-6 left-6 flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-4 py-2 rounded-xl border border-white/5"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                        </svg>
                        Go Back
                    </button>

                    {/* Icon Container */}
                    <div className="relative mb-8 flex justify-center mt-4">
                        <div className="w-24 h-24 bg-linear-to-br from-yellow-500/20 to-orange-500/20 rounded-2xl flex items-center justify-center border border-yellow-500/30">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-yellow-400">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                            </svg>
                        </div>
                        <div className="absolute top-0 right-[40%] animate-pulse">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-yellow-400">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a1.194 1.194 0 0 0 1.586.029L22.5 6m0 0H18m4.5 0V10.5" />
                            </svg>
                        </div>
                    </div>

                    {/* Title */}
                    <div className="text-center mb-6">
                        <h2 className="text-3xl font-bold text-white mb-2">
                            Purchase Limit Reached! 🎯
                        </h2>
                        <p className="text-gray-400 text-lg">
                            You've used all <span className="text-orange-400 font-semibold">{maxLimit}</span> free purchases for this month.
                        </p>
                    </div>

                    {/* Stats Card */}
                    <div className="bg-white/5 rounded-xl p-6 mb-8 border border-white/10">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-gray-400 text-sm">Artworks Purchased</span>
                            <span className="text-white font-semibold">
                                {purchaseCount} / {maxLimit}
                            </span>
                        </div>
                        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-green-400 to-red-500 rounded-full transition-all"
                                style={{
                                    width: `${maxLimit > 0 ? Math.min((purchaseCount / maxLimit) * 100, 100) : 0}%`
                                }}
                            />
                        </div>
                        <p className="text-white text-[16px] mt-4 font-medium text-center">
                            🚀 You're ready for more master artworks!
                        </p>
                    </div>

                    {/* Features Preview */}
                    <div className="grid grid-cols-2 gap-3 mb-8">
                        {[
                            'Unlimited Purchases',
                            'Priority Artist Support',
                            'Exclusive Art Auctions',
                            'Early Access to Drops',
                            'Certificate of Authenticity',
                            'Profile Collector Badge'
                        ].map((feature, index) => (
                            <div key={index} className="flex items-center gap-2 bg-white/5 rounded-lg px-3 py-2">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-blue-400">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
                                </svg>
                                <span className="text-gray-300 text-sm">{feature}</span>
                            </div>
                        ))}
                    </div>

                    {/* CTA Button */}

                    <button
                        onClick={() => { router.push(`/pricing?returnTo=${encodeURIComponent(pathname)}`)}}
                        className="w-full bg-linear-to-r from-blue-600 to-orange-600 text-white hover:cursor-pointer font-semibold py-4 rounded-xl shadow-lg hover:shadow-orange-500/25 transition-all transform hover:scale-[1.02] group flex items-center justify-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747c.224-.891-.015-1.835-.656-2.476l-2.584-2.584a2.25 2.25 0 0 1-.659-1.59V4.5a2.25 2.25 0 0 0-2.25-2.25h-5.25A2.25 2.25 0 0 0 7.125 4.5v1.364c0 .597-.24 1.17-.659 1.59L3.882 10.04a2.41 2.41 0 0 0-.656 2.476A9.004 9.004 0 0 0 12 21Z" />
                        </svg>
                        Upgrade Plan to Unlock
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 group-hover:translate-x-1 transition-transform">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                        </svg>
                    </button>

                </div>
            </div>
        );
    }

    const handlePayment = async () => {
        if (!isLoggedIn) {
            router.push(`/auth/login?redirect=${encodeURIComponent(pathname)}`)
            router.refresh();
            return;
        }
        if (isSold) {
            toast.error("This artwork has already been sold!");
            return;
        }
        if (isOwner) {
            toast.error("You cannot purchase your own artwork!");
            return;
        }
        if (isAdmin) {
            toast.error("Admin account cannot purchase artworks.");
            return;
        }


        if (role === 'user') {
            if (maxLimit !== -1 && purchaseCount >= maxLimit) {
                setLimitReached(true);
                return;
            }
        }

        //payment
        startCheckout({ artworkId, buyerId: currentUserId });
    };

    // ৪. ডায়নামিক বাটন কনফিগারেশন জেনারেটর
    const getButtonConfig = () => {
        if (isSold) {
            return {
                text: "Sold Out",
                disabled: true,
                className: "bg-neutral-800 text-neutral-500 py-6 cursor-not-allowed border border-neutral-700"
            };
        }
        if (!isLoggedIn) {
            return {
                text: "Login to Purchase",
                disabled: false,
                className: "bg-[#c9943a] hover:bg-[#dc9c25] py-6 text-black"
            };
        }
        if (isOwner) {
            return {
                text: "Your Artwork",
                disabled: true,
                className: "bg-gray-700 text-gray-400 py-6 cursor-not-allowed"
            };
        }
        if (isAdmin) {
            return {
                text: "Admin Mode (Read Only)",
                disabled: true,
                className: "bg-blue-900/40 text-blue-300 border py-6 border-blue-800 cursor-not-allowed"
            };
        }

        return {
            text: "Purchase via Stripe",
            disabled: false,
            className: "bg-[#c9943a] hover:bg-[#dc9c25] py-6 text-black"
        };
    };

    const btnConfig = getButtonConfig();

    return (
        <div className="min-h-screen text-white flex items-center justify-center w-13/14 mx-auto mt-20 md:p-12">
            <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-start">

                {/* Left Side: Artwork Image */}
                <div className="md:col-span-7 flex justify-center">
                    <div className="w-full overflow-hidden rounded-sm shadow-xl relative">
                        <Image
                            width={700}
                            height={700}
                            unoptimized
                            src={imageFile}
                            alt={title || "Artwork Image"}
                            className="w-full h-auto object-cover max-h-[90vh]"
                        />
                        {isSold && (
                            <div className="absolute top-4 left-4 bg-red-600 text-white font-bold uppercase tracking-widest text-xs px-3 py-1.5 rounded-xs shadow-md">
                                Sold
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Side: Details UI */}
                <div className="md:col-span-5 flex flex-col space-y-6">
                    <div>
                        <span className="text-[#c9943a] uppercase tracking-wider text-[16px] font-semibold">
                            {category || "Category"}
                        </span>
                        <h1 className="text-4xl md:text-5xl font-bold mt-4 mb-4 tracking-wide text-[#EAEAEA]">
                            {title || "Untitled Artwork"}
                        </h1>
                        <p className="text-[#c9943a] text-[16px] font-medium">
                            {artistName || "Unknown Artist"}
                        </p>
                    </div>

                    {/* Meta Indicators Blocks */}
                    <div className="bg-[#171717] border border-[#222222] p-4 rounded-sm grid grid-cols-3 gap-4">
                        <div>
                            <span className="text-[12px] text-gray-400 uppercase block tracking-wider">Price</span>
                            <span className="text-2xl font-bold text-[#c9943a] mt-1 block">
                                ${price ? price.toLocaleString() : "0"}
                            </span>
                        </div>
                        <div>
                            <span className="text-[12px] text-gray-400 uppercase block tracking-wider">Views</span>
                            <span className="text-lg font-semibold text-gray-300 mt-2 block">
                                {Views || 0}
                            </span>
                        </div>
                        <div>
                            <span className="text-[12px] text-gray-400 uppercase block tracking-wider">Status</span>
                            <span className={`text-sm font-medium mt-2.5 block ${isSold ? 'text-red-500' : 'text-emerald-500'}`}>
                                {isSold ? 'Sold' : 'Available'}
                            </span>
                        </div>
                    </div>

                    {/* Description */}
                    <p className="text-gray-400 text-sm leading-relaxed tracking-wide font-light">
                        {description || "No description provided for this specific master artwork layer."}
                    </p>

                    {/* Call to Actions */}
                    <div className="flex items-center space-x-3 pt-4">
                        <Button
                            onClick={handlePayment}
                            disabled={btnConfig.disabled}
                            className={`flex-1 font-semibold text-[16px] py-3.5 px-6 rounded-sm transition-all flex items-center justify-center space-x-2 shadow-lg ${btnConfig.className}`}
                        >
                            {!isSold && (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
                                </svg>
                            )}
                            <span>{btnConfig.text}</span>
                        </Button>

                        <button className="p-3.5 bg-transparent border border-[#333333] hover:border-gray-500 rounded-sm text-gray-400 hover:text-white transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                            </svg>
                        </button>

                        <button className="p-3.5 bg-transparent border border-[#333333] hover:border-gray-500 rounded-sm text-gray-400 hover:text-white transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" />
                            </svg>
                        </button>
                    </div>

                    {/* Bottom Metadata */}
                    <div className="border-t border-[#1C1C1C] pt-6 grid grid-cols-2 gap-y-4 text-xs">
                        <div>
                            <span className="text-gray-400 block uppercase text-[12px] tracking-wider">Category</span>
                            <span className="text-gray-300 text-[16px] mt-1 block font-medium">{category || "Watercolor"}</span>
                        </div>
                        <div>
                            <span className="text-gray-400 block uppercase text-[12px] tracking-wider">Artist</span>
                            <span className="text-gray-300 text-[16px] mt-1 block font-medium">{artistName || "Unknown"}</span>
                        </div>
                        <div className="col-span-2">
                            <span className="text-gray-400 block uppercase text-[12px] tracking-wider">Status</span>
                            <span className="text-gray-300 mt-1 text-[16px] block font-medium">{isSold ? "Sold" : "Available"}</span>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default CardDetailsPage;