'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';

export default function NotFound() {
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/@dotlottie/player-component@latest/dist/dotlottie-player.mjs';
        script.type = 'module';
        document.body.appendChild(script);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 px-4 text-center">

            {/* Lottie Animation Container */}
            <div className="w-full max-w-[650px] h-[350px]">
                <dotlottie-player
                    src="Error 404.json" // public ফোল্ডারে থাকা আপনার ফাইলের নাম
                    background="transparent"
                    speed="1"
                    loop
                    autoplay
                ></dotlottie-player>
            </div>

            {/* Error Message */}
            <h1 className="mt-4 text-3xl font-extrabold text-gray-800 dark:text-white sm:text-4xl">
                Page Not Found!
            </h1>
            <p className="mt-2 text-base text-gray-500 dark:text-gray-400 max-w-md">
                Oops! The page you are looking for doesn't exist, has been removed, or the link is broken.
            </p>

            {/* Back to Home Button */}
            <div className="mt-6">
                <Link
                    href="/"
                    className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 shadow-md"
                >
                    Back to Home
                </Link>
            </div>

        </div>
    );
}