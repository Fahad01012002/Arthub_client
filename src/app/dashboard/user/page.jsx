import { Users, Palette, ShoppingBag, DollarSign } from "lucide-react";

const stats = [
    { label: "Total Users", value: "1,284", change: "+12% this month", icon: Users, iconBg: "bg-blue-500/15", iconColor: "text-blue-400" },
    { label: "Total Artists", value: "312", change: "+8% this month", icon: Palette, iconBg: "bg-amber-500/15", iconColor: "text-amber-500" },
    { label: "Artworks Sold", value: "4,891", change: "+24% this month", icon: ShoppingBag, iconBg: "bg-green-500/15", iconColor: "text-green-400" },
    { label: "Total Revenue", value: "$284,320", change: "+31% this month", icon: DollarSign, iconBg: "bg-purple-500/15", iconColor: "text-purple-400" },
];

export default function UserDashboard() {
    return (
        <div className="bg-[#000000] px-3">
            <h1
                className="text-4xl font-bold text-[#f5f1ea] mb-8"
            >
            User Panel
            </h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {stats.map((s) => {
                    const Icon = s.icon;
                    return (
                        <div key={s.label} className="rounded-xl border border-[#282828] bg-[#000000] p-5">
                            <div className="flex items-center justify-between mb-6">
                                <p
                                    className="text-xs uppercase tracking-wider text-[#8b8680]"
                                >
                                    {s.label}
                                </p>
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${s.iconBg}`}>
                                    <Icon size={16} className={s.iconColor} strokeWidth={2} />
                                </div>
                            </div>
                            <p
                                className="text-3xl font-bold text-[#f5f1ea] mb-1"
                            >
                                {s.value}
                            </p>
                            <p className="text-sm text-green-400">{s.change}</p>
                        </div>
                    );
                })}
            </div>

        </div>
    );
}


