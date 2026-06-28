export const dynamic = "force-dynamic";

import { getTransactionHistory } from '@/lib/api/User';
import { getUserSession } from '@/lib/core/session';
import React from 'react';

export default async function TransactionHistoryPage() {
    let historyData = [];
    let errorMessage = '';

    try {
        // ১. সেশন থেকে কারেন্ট ইউজারের buyerId বের করা
        const session = await getUserSession();

        if (session && (session.id)) {
            const buyerId = session.id;

            // ২. ব্যাকএন্ড এপিআই কল করে ট্রানজেকশন হিস্ট্রি ডাটা নিয়ে আসা
            const apiResponse = await getTransactionHistory(buyerId);

            // ডাটা অ্যারে ফরম্যাটে আছে কিনা তা সেফটি চেক করা
            if (Array.isArray(apiResponse)) {
                historyData = apiResponse;
            } else if (apiResponse && Array.isArray(apiResponse.data)) {
                historyData = apiResponse.data;
            }
        } else {
            errorMessage = "Please log in to view your transaction history.";
        }
    } catch (error) {
        console.error("Error loading transaction history:", error);
        errorMessage = "Failed to load transaction history. Please try again later.";
    }

    return (

        <div style={styles.container}>

            <div style={styles.tableWrapper}>
                <h1 className='font-bold text-4xl mb-10'>My Purchase History</h1>
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th style={styles.th}>TRANSACTION ID</th>
                            <th style={styles.th}>ARTWORK</th>
                            <th style={styles.th}>ARTIST</th>
                            <th style={styles.th}>PRICE</th>
                            <th style={styles.th}>DATE</th>
                            <th style={{ ...styles.th, textAlign: 'center' }}>STATUS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* এরর মেসেজ থাকলে তা টেবিলে দেখানো */}
                        {errorMessage && (
                            <tr>
                                <td colSpan="6" style={styles.errorTd}>{errorMessage}</td>
                            </tr>
                        )}

                        {/* কোনো ডাটা না থাকলে খালি স্টেট দেখানো */}
                        {!errorMessage && historyData.length === 0 && (
                            <tr>
                                <td colSpan="6" style={styles.emptyTd}>No transactions found.</td>
                            </tr>
                        )}

                        {/* ডাটা ম্যাপ করে টেবিল রো (Row) তৈরি করা */}
                        {!errorMessage && historyData.map((row) => (
                            <tr key={row._id || Math.random()} style={styles.tr}>
                                {/* Transaction ID (Golden/Ochre color like design) */}
                                <td style={styles.tdId}>{row.transactionId}</td>

                                {/* Artwork Name / Subscription Plan */}
                                <td style={styles.tdBold}>
                                    {row.artworkName}
                                    {row.type === 'Subscription' && (
                                        <span style={styles.subBadge}> (Sub)</span>
                                    )}
                                </td>

                                {/* Artist Name */}
                                <td style={styles.tdMuted}>{row.artistName}</td>

                                {/* Price format $X,XXX */}
                                <td style={styles.tdBold}>
                                    ${Number(row.price).toLocaleString()}
                                </td>

                                {/* Date (YYYY-MM-DD) */}
                                <td style={styles.tdMuted}>{row.date}</td>

                                {/* Status Capsule Badge (Green text with border) */}
                                <td style={{ ...styles.td, textAlign: 'center' }}>
                                    <span style={styles.statusBadge}>
                                        {row.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// আপনার আপলোড করা ইমেজের সাথে ম্যাচ করা আল্ট্রা-ডার্ক থিম স্টাইলস
const styles = {
    container: {
        backgroundColor: '#0a0a0a',
        minHeight: '100vh',
        padding: '0px 10px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        boxSizing: 'border-box',
    },
    tableWrapper: {
        width: '100%',
        maxWidth: '1600px',
        backgroundColor: '#111111', // টেবিলের ভেতরের ডার্ক ব্যাকগ্রাউন্ড
        borderRadius: '12px',
        border: '1px solid #222',  // সুক্ষ বর্ডার লাইন
        overflow: 'hidden',
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
        textAlign: 'left',
        fontSize: '14px',
    },
    th: {
        backgroundColor: '#161616', // টেবিল হেডার ব্যাকগ্রাউন্ড
        color: '#666666',          // হেডার টেক্সটের হালকা ছাই রঙ
        padding: '16px 24px',
        fontWeight: '600',
        fontSize: '12px',
        letterSpacing: '0.8px',
        borderBottom: '1px solid #222',
    },
    tr: {
        borderBottom: '1px solid #1a1a1a', // প্রতিটি রো এর নিচের বর্ডার
    },
    td: {
        padding: '18px 24px',
        verticalAlign: 'middle',
        color: '#ffffff',
    },
    tdId: {
        padding: '18px 24px',
        verticalAlign: 'middle',
        color: '#cca343', // ওখর/গোল্ডেন আইডি টেক্সট কালার
        fontWeight: '600',
    },
    tdBold: {
        padding: '18px 24px',
        verticalAlign: 'middle',
        color: '#ffffff',
        fontWeight: '600',
    },
    tdMuted: {
        padding: '18px 24px',
        verticalAlign: 'middle',
        color: '#8a8a8f', // ডেট এবং আর্টিস্টের জন্য মিউটেড টেক্সট কালার
    },
    subBadge: {
        fontSize: '11px',
        color: '#cca343',
        fontStyle: 'italic',
        marginLeft: '4px'
    },
    statusBadge: {
        display: 'inline-block',
        border: '1px solid #006400', // ডার্ক গ্রিন বর্ডার লাইন
        backgroundColor: 'rgba(0, 100, 0, 0.1)', // ট্রান্সপারেন্ট গ্রিন ব্যাকগ্রাউন্ড
        color: '#00ff7f', // ব্রাইট সবুজ টেক্সট কালার (Completed এর জন্য)
        padding: '6px 16px',
        borderRadius: '6px', // স্কয়ারিশ ক্যাপসুল শেপ
        fontSize: '13px',
        fontWeight: '500',
    },
    errorTd: {
        padding: '30px',
        color: '#ff453a',
        textAlign: 'center',
    },
    emptyTd: {
        padding: '40px',
        color: '#8a8a8f',
        textAlign: 'center',
        fontSize: '15px',
    }
};