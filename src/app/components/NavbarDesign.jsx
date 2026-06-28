'use client'

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

const NavbarDesign = ({ navbarLink }) => {

    const pathname = usePathname();
    const { href, name } = navbarLink;
    const isActive = pathname === href;

    return (
        <Link
            href={href}
            className='relative px-5 py-2 rounded-full overflow-hidden group'
        >

            <motion.span
                className={`
                    absolute inset-0 rounded-full
                    border transition-all duration-700
                    backdrop-blur-2xl
                    ${isActive
                        ? 'bg-[#ffffff10] border-[#ffffff20] shadow-[0_8px_30px_rgb(0,0,0,0.08)]'
                        : 'bg-transparent border-transparent group-hover:bg-gray-100/70 group-hover:border-gray-200/50'
                    }
                `}
                initial={false}
                animate={{
                    scale: isActive ? 1 : 0.9,
                    opacity: isActive ? 1 : 0,
                }}
                transition={{
                    duration: 0.7,
                    ease: [0.22, 1, 0.36, 1]
                }}
            />

            {isActive && (
                <motion.span
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 0.4, scale: 1 }}
                    className={`
                        absolute inset-0 rounded-full bg-white blur-xl -z-10
                    `}
                />
            )}

            {/* Hover Glow Effect */}
            {!isActive && (
                <motion.span
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 0.3 }}
                    className="absolute inset-0 rounded-full bg-linear-to-r from-blue-400/20 via-purple-400/20 to-pink-400/20 blur-xl"
                />
            )}

            <motion.span
                className={`
                    relative z-10 text-sm font-medium
                    transition-all duration-500
                    ${isActive
                        ? 'text-white'
                        : 'text-gray-300 group-hover:text-white'}
                `}
                whileHover={!isActive ? { y: -1 } : {}}
            >
                {name}
            </motion.span>

            {isActive && (
                <motion.span
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: '2rem', opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-0.5 bg-linear-to-r from-blue-500 to-purple-500 rounded-full"
                />
            )}

        </Link>
    );
};

export default NavbarDesign;