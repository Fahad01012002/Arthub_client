import Link from "next/link";
import NavbarDesign from "./NavbarDesign";
import { headers } from "next/headers";
import { Palette } from "lucide-react";
import Profile from "./Profile";
import { auth } from "../lib/auth";

const dashboardLinks = {
    user: "/dashboard/user",
    artist: "/dashboard/artist",
    admin: "/dashboard/admin",
};

export default async function Navbar() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    const user = session?.user;

    const navbarLinks = [
        { id: 1, name: "Home", href: "/" },
        { id: 2, name: "Browse", href: "/browse" },
        ...(user?.email
            ? [{
                id: 3,
                name: "Dashboard",
                href: dashboardLinks[user?.role || "user"],
            }]
            : []),
    ];

    return (
        <nav className="absolute top-5 left-0 w-full z-50 bg-transfarent">
            <div className="flex items-center bg-[#222222] rounded-xl justify-between h-14 w-11/12 mx-auto px-4 md:px-8 md:py-8">
                <Link href="/" className="flex items-center shrink-0">
                    <div className="w-8 h-8 bg-[#c9943a] rounded-sm flex items-center justify-center">
                        <Palette size={16} className="text-white" />
                    </div>
                </Link>

                <div className="flex items-center">
                    <div className="hidden md:flex items-center gap-6 text-sm font-medium">
                        {navbarLinks.map((link) => (
                            <NavbarDesign key={link.id} navbarLink={link} />
                        ))}
                        <span className="w-px h-5 bg-gray-600 mr-8" />
                    </div>

                    <div className="flex gap-3">
                        <Profile
                            user={user}
                            navbarLinks={navbarLinks}
                        />
                    </div>
                </div>
            </div >
        </nav >
    );
}