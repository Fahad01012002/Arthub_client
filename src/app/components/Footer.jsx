import { Mail, Palette } from 'lucide-react';
import { BsFacebook, BsInstagram, BsTwitter, BsYoutube } from 'react-icons/bs';

export default function Footer() {
    return (
        <footer className="bg-[#18181b] text-[#a1a1aa] border-t border-[#27272a] w-full">
            {/* Upper Main Footer Grid Section */}
            <div className="w-11/12 mx-auto px-6 pt-16 pb-12 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-4">

                {/* Brand/Logo Column */}
                <div className="md:col-span-4 flex flex-col space-y-4">
                    <div className="flex items-center gap-2">
                        <div className="bg-[#d97706] p-1.5 rounded-md text-[#18181b]">
                            <Palette className="w-5 h-5 fill-current" />
                        </div>
                        <span className="text-white font-serif text-xl font-bold tracking-wide">
                            ArtHub
                        </span>
                    </div>
                    <p className="text-sm leading-relaxed max-w-sm text-[#71717a]">
                        A global marketplace connecting artists and collectors through the power of original art.
                    </p>
                    {/* Social Links Row */}
                    <div className="flex items-center gap-2 pt-2">
                        {[BsInstagram, BsTwitter, BsFacebook, BsYoutube].map((Icon, idx) => (
                            <a
                                key={idx}
                                href="#"
                                className="p-2 border border-[#27272a] rounded-md text-[#a1a1aa] hover:text-white hover:border-[#3f3f46] transition-colors"
                            >
                                <Icon className="w-4 h-4" />
                            </a>
                        ))}
                    </div>
                </div>

                {/* Explore Columns */}
                <div className="md:col-span-2 flex flex-col space-y-3">
                    <h3 className="text-white font-serif text-sm font-bold tracking-wider">Explore</h3>
                    <ul className="space-y-2 text-sm">
                        {['Browse Artworks', 'Categories', 'Artists', 'New Arrivals'].map((item) => (
                            <li key={item}>
                                <a href="#" className="hover:text-white transition-colors">{item}</a>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Company Column */}
                <div className="md:col-span-2 flex flex-col space-y-3">
                    <h3 className="text-white font-serif text-sm font-bold tracking-wider">Company</h3>
                    <ul className="space-y-2 text-sm">
                        {['About Us', 'Careers', 'Press', 'Privacy Policy', 'Terms of Service'].map((item) => (
                            <li key={item}>
                                <a href="#" className="hover:text-white transition-colors">{item}</a>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Newsletter Subscription input wrapper */}
                <div className="md:col-span-4 flex flex-col space-y-3">
                    <h3 className="text-white font-serif text-sm font-bold tracking-wider">Newsletter</h3>
                    <p className="text-sm text-[#71717a] leading-relaxed">
                        Get curated art delivered to your inbox weekly.
                    </p>
                    <div className="flex items-center max-w-sm pt-1">
                        <input
                            type="email"
                            placeholder="your@email.com"
                            className="w-full bg-[#1e1e24] border border-[#27272a] rounded-l-md px-3 py-2 text-sm text-white placeholder-[#52525b] focus:outline-none focus:border-[#d97706]"
                        />
                        <button className="bg-[#d97706] text-[#18181b] p-2.5 rounded-r-md hover:bg-[#b45309] transition-colors flex items-center justify-center">
                            <Mail className="w-4 h-4 fill-current" />
                        </button>
                    </div>
                </div>

            </div>

            {/* Horizontal Divider Line */}
            <div className="max-w-7xl mx-auto px-6">
                <div className="border-t border-[#27272a]"></div>
            </div>

            {/* Bottom bar row */}
            <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center text-xs text-[#52525b]">
                <span>© 2026 ArtHub. All rights reserved.</span>
                <span className="font-mono tracking-wider">v2.0.0</span>
            </div>
        </footer>
    );
}