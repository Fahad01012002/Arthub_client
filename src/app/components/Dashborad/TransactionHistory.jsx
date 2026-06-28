'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { getUserById } from '@/lib/core/session';
import { getArtworkDetails } from '@/lib/api/ArtistsCard';

// Recharts dynamically imported with SSR disabled to prevent local loading stalls
const AreaChartComponent = dynamic(
    () => import('recharts').then((mod) => {
        const { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } = mod;
        return function Chart({ data }) {
            return (
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                        <defs>
                            <linearGradient id="dashboardTrendGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#c9943a" stopOpacity={0.25} />
                                <stop offset="95%" stopColor="#c9943a" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#232326" vertical={false} />
                        <XAxis dataKey="day" stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} dy={10} />
                        <YAxis stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} dx={-5} />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#141416', borderColor: '#232326', borderRadius: '8px' }}
                            labelStyle={{ color: '#9ca3af', fontSize: '12px' }}
                            itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
                        />
                        <Area type="monotone" dataKey="revenue" stroke="#c9943a" fillOpacity={1} fill="url(#dashboardTrendGradient)" strokeWidth={2} />
                    </AreaChart>
                </ResponsiveContainer>
            );
        };
    }),
    { ssr: false }
);

const dummyChartData = [
    { day: 'Mon', revenue: 4000 },
    { day: 'Tue', revenue: 3200 },
    { day: 'Wed', revenue: 5800 },
    { day: 'Thu', revenue: 4500 },
    { day: 'Fri', revenue: 6200 },
    { day: 'Sat', revenue: 7100 },
    { day: 'Sun', revenue: 8400 },
];

export default function TransactionHistoryTable({ transactionHistory }) {


    const [initialLoading, setInitialLoading] = useState(true);
    const [tableLoading, setTableLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    const itemsPerPage = 5;
    const totalItems = transactionHistory ? transactionHistory.length : 0;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const [enrichedTransactions, setEnrichedTransactions] = useState([]);

    // প্রথমবার পেজ লোডের ডামি টাইমার
    useEffect(() => {
        const timer = setTimeout(() => {
            setInitialLoading(false);
        }, 1500);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        const fetchUserData = async () => {
            if (!transactionHistory || transactionHistory.length === 0) {
                setEnrichedTransactions([]);
                setInitialLoading(false);
                return;
            }

            try {
                // প্রতিটি ট্রানজেকশনের userId দিয়ে লুপ চালিয়ে ব্যাকএন্ড/সেশন থেকে নাম আনা হচ্ছে
                const updatedData = await Promise.all(
                    transactionHistory.map(async (tx) => {
                        try {
                            const buyer = await getUserById(tx.buyerId);
                            const artwork = await getArtworkDetails(tx?.artworkId);
                            console.log(artwork)
                            return {
                                ...tx,
                                name: buyer?.name || 'Unknown User',
                                title: artwork?.title,
                                price: artwork?.price,
                                imageFile: artwork?.imageFile,
                            };
                        } catch (err) {
                            return { ...tx, name: 'Unknown User' };
                        }
                    })
                );
                setEnrichedTransactions(updatedData);
            } catch (error) {
                console.error("Error enrichment transactions:", error);
            } finally {
                // ডেটা লোড পুরোপুরি শেষ হওয়ার পর লোডার বন্ধ হবে
                setInitialLoading(false);
            }
        };

        fetchUserData();
    }, [transactionHistory]);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentTableData = enrichedTransactions ? enrichedTransactions.slice(indexOfFirstItem, indexOfLastItem) : [];

    console.log(currentTableData);

    // পেজ পরিবর্তনের হ্যান্ডলার
    const handlePageChange = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages && pageNumber !== currentPage) {
            setTableLoading(true);
            setCurrentPage(pageNumber);

            setTimeout(() => {
                setTableLoading(false);
            }, 400);
        }
    };

    const renderPageNumbers = () => {
        const pageNumbers = [];
        const maxVisiblePages = 3;
        let startPage = Math.max(1, currentPage - 1);
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(i);
        }
        return pageNumbers;
    };

    return (
        <div className="bg-[#0c0c0e] text-white p-6 min-h-screen font-sans flex flex-col justify-between">
            <div>
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-semibold">Payments & Subscriptions</h1>
                    <p className="text-gray-400 text-sm">Comprehensive overview of platform revenue and active subscriptions.</p>
                </div>

                {/* CONDITION: যদি কোনো ট্রানজেকশন না থাকে */}
                {!initialLoading && totalItems === 0 ? (
                    <div className="flex flex-col items-center justify-center border border-dashed border-[#232326] bg-[#141416]/30 rounded-2xl p-16 my-8 text-center max-w-2xl mx-auto backdrop-blur-sm">
                        {/* Modern Minimalist Box/History Icon */}
                        <div className="w-16 h-16 bg-[#1a1a1c] border border-[#2d2d30] rounded-2xl flex items-center justify-center mb-5 text-[#c9943a]/80 shadow-xl">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 13.5h3.86a2.25 2.25 0 0 1 2.008 1.24l.885 1.77a2.25 2.25 0 0 0 2.007 1.24h1.98a2.25 2.25 0 0 0 2.007-1.24l.885-1.77a2.25 2.25 0 0 1 2.007-1.24h3.86m-18 0h18a2.25 2.25 0 0 1 2.25 2.25v4.25a2.25 2.25 0 0 1-2.25 2.25H2.25A2.25 2.25 0 0 1 0 19.75v-4.25a2.25 2.25 0 0 1 2.25-2.25Z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75h16.5M3.75 8.25h16.5" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-200 mb-1">No Sales Yet</h3>
                        <p className="text-sm text-gray-500 max-w-sm mb-6">
                            Your transaction history is currently empty. Once artwork sells or subscriptions activate, data will stream here in real-time.
                        </p>
                        <button className="bg-[#1c1c1e] hover:bg-[#232326] text-xs text-gray-300 font-medium px-4 py-2 rounded-lg border border-[#2d2d30] transition-colors">
                            Refresh Dashboard
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Top 4 Status Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                            {[
                                { label: "Total Revenue", val: "$1,284,500", diff: "+12.4%", color: "text-emerald-500 bg-emerald-500/10" },
                                { label: "Monthly Revenue", val: "$94,210", diff: "+8.1%", color: "text-emerald-500 bg-emerald-500/10" },
                                { label: "Active Pro Users", val: "12,408", diff: "+2.3%", color: "text-amber-500 bg-amber-500/10" },
                                { label: "Active Enterprise Users", val: "842", diff: "+15.7%", color: "text-emerald-500 bg-emerald-500/10" }
                            ].map((card, i) => (
                                <div key={i} className="bg-[#141416] border border-[#232326] p-5 rounded-xl relative overflow-hidden">
                                    {initialLoading ? (
                                        <div className="animate-pulse space-y-3">
                                            <div className="h-3 w-20 bg-[#232326] rounded"></div>
                                            <div className="h-6 w-32 bg-[#232326] rounded"></div>
                                            <div className="absolute top-4 right-4 h-4 w-12 bg-[#232326] rounded"></div>
                                        </div>
                                    ) : (
                                        <>
                                            <span className={`absolute top-4 right-4 text-xs font-medium px-2 py-0.5 rounded ${card.color}`}>{card.diff}</span>
                                            <p className="text-xs text-gray-400 mb-1">{card.label}</p>
                                            <p className="text-2xl font-bold font-mono">{card.val}</p>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Recent Transactions Table Section */}
                        <div className="bg-[#141416] border border-[#232326] rounded-xl p-5 mb-6">
                            <div className="flex justify-between items-center mb-5">
                                <h2 className="text-lg font-medium">Recent Transactions</h2>
                                <div className="flex gap-2">
                                    <div className="h-7 w-16 bg-[#1c1c1e] border border-[#2d2d30] rounded-lg text-xs text-gray-300 flex items-center justify-center cursor-pointer">Filter</div>
                                    <div className="h-7 w-24 bg-[#1c1c1e] border border-[#2d2d30] rounded-lg text-xs text-gray-300 flex items-center justify-center cursor-pointer">Export CSV</div>
                                </div>
                            </div>

                            {/* Table Area */}
                            <div className="overflow-x-auto min-h-55">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-[#232326] text-[11px] text-gray-400 tracking-wider uppercase">
                                            <th className="pb-3 font-medium">Artwork</th>
                                            <th className="pb-3 font-medium">Buyer</th>
                                            <th className="pb-3 font-medium">Amount</th>
                                            <th className="pb-3 font-medium text-right">Date</th>
                                        </tr>
                                    </thead> {/* Fixed typo here from </tbody> to </thead> */}
                                    <tbody className="divide-y divide-[#1f1f22] text-sm">
                                        {initialLoading || tableLoading ? (
                                            Array.from({ length: 4 }).map((_, index) => (
                                                <tr key={index} className="animate-pulse">
                                                    <td className="py-4"><div className="h-4 bg-[#232326] rounded w-3/4"></div></td>
                                                    <td className="py-4"><div className="h-4 bg-[#232326] rounded w-1/2"></div></td>
                                                    <td className="py-4"><div className="h-4 bg-[#232326] rounded w-2/3"></div></td>
                                                    <td className="py-4 text-right flex justify-end"><div className="h-4 bg-[#232326] rounded w-24"></div></td>
                                                </tr>
                                            ))
                                        ) : (
                                            currentTableData.map((tx) => (
                                                <tr key={tx._id} className="hover:bg-[#1a1a1c]/50 transition-colors">
                                                    <td className="py-3.5 font-medium text-gray-200">{tx.title}</td>
                                                    <td className="py-3.5 text-gray-400">{tx.name}</td>
                                                    <td className="py-3.5 font-semibold text-gray-100 font-mono">{tx.price}</td>
                                                    <td className="py-3.5 text-gray-400 text-right text-xs">
                                                        {tx.createdAt ? new Date(tx.createdAt).toLocaleDateString('en-US', {
                                                            year: 'numeric',
                                                            month: 'short',
                                                            day: 'numeric'
                                                        }) : 'N/A'}
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination Section */}
                            <div className="flex justify-between items-center mt-5 text-xs text-gray-400">
                                <div>
                                    Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, totalItems)} of {totalItems.toLocaleString()} transactions
                                </div>

                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1 || tableLoading}
                                        className={`p-1 px-2.5 bg-[#1c1c1e] border border-[#2d2d30] rounded text-gray-400 ${currentPage === 1 ? 'opacity-40 cursor-not-allowed' : 'hover:text-white'}`}
                                    >
                                        &lt;
                                    </button>

                                    {renderPageNumbers().map((page) => (
                                        <button
                                            key={page}
                                            onClick={() => handlePageChange(page)}
                                            disabled={tableLoading}
                                            className={`p-1 px-2.5 rounded font-medium transition-colors ${currentPage === page ? 'text-[#0c0c0e]' : 'bg-[#1c1c1e] border border-[#2d2d30] text-gray-300'}`}
                                            style={currentPage === page ? { backgroundColor: '#c9943a' } : {}}
                                        >
                                            {page}
                                        </button>
                                    ))}

                                    <button
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages || tableLoading}
                                        className={`p-1 px-2.5 bg-[#1c1c1e] border border-[#2d2d30] rounded text-gray-400 ${currentPage === totalPages ? 'opacity-40 cursor-not-allowed' : 'hover:text-white'}`}
                                    >
                                        &gt;
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Bottom Section: Trend and Plan Distribution */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Revenue Trend */}
                            <div className="bg-[#141416] border border-[#232326] rounded-xl p-5 md:col-span-2 flex flex-col justify-between min-h-[260px]">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-sm font-medium text-gray-300">Revenue Trend (Last 7 Days)</h3>
                                    <span className="text-xs text-gray-500">USD ($)</span>
                                </div>

                                <div className="w-full h-44 mt-4 relative">
                                    {initialLoading ? (
                                        <div className="w-full h-full animate-pulse flex flex-col justify-between pt-4">
                                            <div className="w-full h-full bg-[#1c1c1e]/50 rounded-lg border border-dashed border-[#232326] flex items-center justify-center text-xs text-gray-600">
                                                Generating dynamic analytics...
                                            </div>
                                        </div>
                                    ) : (
                                        <AreaChartComponent data={dummyChartData} />
                                    )}
                                </div>
                            </div>

                            {/* Plan Distribution */}
                            <div className="bg-[#141416] border border-[#232326] rounded-xl p-5 flex flex-col justify-between">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-300 mb-5">Plan Distribution</h3>

                                    {initialLoading ? (
                                        <div className="animate-pulse space-y-5">
                                            {[1, 2, 3].map((n) => (
                                                <div key={n} className="space-y-2">
                                                    <div className="flex justify-between"><div className="h-3 w-16 bg-[#232326] rounded"></div><div className="h-3 w-8 bg-[#232326] rounded"></div></div>
                                                    <div className="w-full bg-[#232326] h-1.5 rounded-full"></div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <>
                                            <div className="mb-4">
                                                <div className="flex justify-between text-xs mb-1">
                                                    <span className="text-gray-400">Enterprise</span>
                                                    <span className="font-mono">35%</span>
                                                </div>
                                                <div className="w-full bg-[#232326] h-1.5 rounded-full overflow-hidden">
                                                    <div className="bg-white h-full rounded-full" style={{ width: '35%' }}></div>
                                                </div>
                                            </div>

                                            <div className="mb-4">
                                                <div className="flex justify-between text-xs mb-1">
                                                    <span className="text-gray-400">Professional</span>
                                                    <span className="font-mono">52%</span>
                                                </div>
                                                <div className="w-full bg-[#232326] h-1.5 rounded-full overflow-hidden">
                                                    <div className="bg-gray-400 h-full rounded-full" style={{ width: '52%' }}></div>
                                                </div>
                                            </div>

                                            <div className="mb-4">
                                                <div className="flex justify-between text-xs mb-1">
                                                    <span className="text-gray-400">Starter</span>
                                                    <span className="font-mono">13%</span>
                                                </div>
                                                <div className="w-full bg-[#232326] h-1.5 rounded-full overflow-hidden">
                                                    <div className="bg-gray-600 h-full rounded-full" style={{ width: '13%' }}></div>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>

                                <button className="w-full text-center text-xs text-gray-400 hover:text-white pt-2 border-t border-[#232326] mt-2 transition-colors">
                                    View detailed report
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}