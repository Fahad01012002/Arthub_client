
import { getUserSession } from "@/lib/core/session";
import { Bars, Bell, Magnifier, Person } from "@gravity-ui/icons";
import { Button, Drawer } from "@heroui/react";
import { Bookmark, Briefcase, Building2, Grid, Users } from "lucide-react";
import Link from "next/link";

const DashboardSidebar = async () => {

    const user = await getUserSession();

    let navItems = [];

    if (user?.role === 'artist') {
        navItems = [
            { icon: Grid, label: "Dashboard", href: "/dashboard/artist" },
            { icon: Bookmark, label: "Sales History", href: "/dashboard/artist/sales-history" },
            { icon: Person, label: "Profile", href: "/dashboard/artist/profile" },
        ];
    }
    else if (user?.role === 'admin') {
        navItems = [
            { icon: Grid, label: "Dashboard", href: "/dashboard/admin" },
            { icon: Users, label: "Users", href: "/dashboard/admin/users" },
            { icon: Building2, label: "Artworks", href: "/dashboard/admin/artworks" },
            { icon: Briefcase, label: "Transaction", href: "/dashboard/admin/transactions" },
            { icon: Person, label: "Profile", href: "/dashboard/admin/profile" },
        ];
    }
    else {
        navItems = [
            { icon: Grid, label: "Dashboard", href: "/dashboard/user" },
            { icon: Magnifier, label: "My Artworks", href: "/dashboard/user/my-artworks" },
            { icon: Bell, label: "Purchase History", href: "/dashboard/user/purchase-history" },
            { icon: Person, label: "Profile", href: "/dashboard/user/profile" },
        ];
    }

    const navLink = (
        <nav className="flex flex-col gap-1">
            {navItems.map((item) => (
                 <Link
                    href={item.href}
                    key={item.label}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-foreground transition-colors hover:bg-default"

                >
                    <item.icon className="size-5 text-muted" />
                    {item.label}
                </Link>
            ))}
        </nav>
    )

    return (
        <div>
             <aside className="hidden w-64 shrink-0 border-r border-zinc-800 bg-black lg:block">
                {navLink}
            </aside>
            <Drawer>
                <Button className='lg:hidden' variant="secondary">
                    <Bars />
                    Menu
                </Button>
                <Drawer.Backdrop>
                    <Drawer.Content placement="left">
                        <Drawer.Dialog>
                            <Drawer.CloseTrigger />
                            <Drawer.Header>
                                <Drawer.Heading>Navigation</Drawer.Heading>
                            </Drawer.Header>
                            <Drawer.Body>
                                {navLink}
                            </Drawer.Body>
                        </Drawer.Dialog>
                    </Drawer.Content>
                </Drawer.Backdrop>
            </Drawer>
        </div>
    );
};

export default DashboardSidebar;


