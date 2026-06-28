'use client';

import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import { LogOut, Menu, X } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { authClient } from '../lib/auth-client';

const Profile = ({ user, navbarLinks }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const router = useRouter();
    const dropdownRef = useRef(null);


    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setProfileOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSignOut = async () => {
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    router.push("/auth/login");
                    router.refresh();
                },
            },
        });
        setIsOpen(false);
        setProfileOpen(false);
    };

    return (
        <>
            {/* Desktop */}
            <div className="hidden md:flex items-center gap-3">
                {user ? (
                    <div className="relative " ref={dropdownRef}>
                        {/* Avatar button */}
                        <button
                            onClick={() => setProfileOpen(!profileOpen)}
                            className="flex items-center focus:outline-none"
                        >
                            <div className="relative cursor-pointer">
                                <Image
                                    src={user.image || `https://ui-avatars.com/api/?name=${user.name}`}
                                    alt={user.name}
                                    width={36}
                                    height={36}
                                    className="rounded-full border border-slate-200 dark:border-zinc-700 object-cover"
                                />
                                {/* Online indicator */}
                                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white dark:border-zinc-950 rounded-full" />
                            </div>
                        </button>

                        {/* Dropdown */}
                        <AnimatePresence>
                            {profileOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    transition={{ duration: 0.2 }}
                                    className="absolute right-0 mt-3 w-56 rounded-2xl shadow-xl shadow-slate-200/20 dark:shadow-black/40 py-1 bg-white border border-slate-100 dark:bg-zinc-900 dark:border-zinc-800"
                                >
                                    {/* User info */}
                                    <div className="px-4 py-3 dark:border-zinc-800">
                                        <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                                            {user.name}
                                        </p>
                                        <p className="text-xs text-slate-500 dark:text-zinc-400 truncate mt-0.5">
                                            {user.email}
                                        </p>
                                    </div>

                                    <div>
                                        <p className='border-b border-slate-300 mx-2'></p>
                                    </div>

                                    {/* Sign out */}
                                    <div className="p-1">
                                        <button
                                            onClick={handleSignOut}
                                            className="w-full text-left px-3 py-2 text-sm flex items-center gap-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-500/10 text-red-600 dark:text-red-400 transition-colors"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            Sign out
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                ) : (
                    <div className="flex items-center gap-9">
                        <Link href="/auth/login" className="text-[#c9943a] hover:text-[#caa25c] text-sm font-medium">
                            Sign In
                        </Link>

                        <Link href="/auth/signup" className="bg-[#c9943a] hover:bg-[#e79303] text-white px-5 py-2 rounded-lg text-sm font-semibold transition-colors">
                            Get Started
                        </Link>
                    </div>
                )}
            </div>

            {/* Mobile: hamburger */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden text-slate-600 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white focus:outline-none"
            >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>

            {/* Mobile: dropdown menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="md:hidden overflow-hidden absolute top-full left-0 right-0 border-t border-slate-100 dark:border-zinc-800 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xl"
                    >
                        <div className="px-4 py-6 space-y-2">
                            {navbarLinks.map(link => (
                                <Link
                                    key={link.id}
                                    href={link.href}
                                    onClick={() => setIsOpen(false)}
                                    className="block px-4 py-3 rounded-2xl text-base font-medium text-slate-600 hover:bg-slate-50 dark:text-zinc-300 dark:hover:bg-zinc-900/50 transition-all"
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <div className="pt-4 mt-4 border-t border-slate-100 dark:border-zinc-800">
                                {user ? (
                                    <div>
                                        <div className="flex items-center gap-3 mb-6 px-2">
                                            <Image
                                                src={user.image || `https://ui-avatars.com/api/?name=${user.name}`}
                                                alt={user.name}
                                                width={48}
                                                height={48}
                                                className="rounded-full border border-slate-200 dark:border-zinc-700"
                                            />
                                            <div>
                                                <p className="font-medium">{user.name}</p>
                                                <p className="text-sm text-slate-500 dark:text-zinc-400">{user.email}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={handleSignOut}
                                            className="w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 font-medium"
                                        >
                                            <LogOut className="w-5 h-5" />
                                            Sign out
                                        </button>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 gap-3">
                                        <Link
                                            href="/login"
                                            onClick={() => setIsOpen(false)}
                                            className="block text-center py-3 text-sm font-medium text-slate-700 dark:text-zinc-300 bg-slate-50 dark:bg-zinc-900 rounded-xl"
                                        >
                                            Log in
                                        </Link>
                                        <Link
                                            href="/sign-up"
                                            onClick={() => setIsOpen(false)}
                                            className="block text-center py-3 text-sm font-medium bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl shadow-md"
                                        >
                                            Get Started
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Profile;