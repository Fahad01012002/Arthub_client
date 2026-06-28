'use client';

import React from 'react';
import { DotLottiePlayer } from '@dotlottie/react-player';

const AnimatedError = ({ fileName, title, message }) => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
            {/* Lottie Container */}
            <div className="w-full max-w-150">
                <DotLottiePlayer
                    src={`/${fileName}`}
                    autoplay
                    loop
                />
            </div>
            
            <h1 className="mt-6 text-3xl font-bold text-gray-800 dark:text-white">
                {title}
            </h1>
            <p className="mt-2 text-gray-500 max-w-md">
                {message}
            </p>
        </div>
    );
};

export default AnimatedError;