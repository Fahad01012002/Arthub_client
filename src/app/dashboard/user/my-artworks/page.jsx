export const dynamic = "force-dynamic";

import { getDetails } from '@/lib/api/User';
import { getUserSession } from '@/lib/core/session';
import Image from 'next/image';
import React from 'react';

export default async function MyArtworksPage() {
    let artworks = [];
    let errorMessage = '';

    try {
        const session = await getUserSession();

        if (session && (session.id || session._id)) {
            const buyerId = session.id || session._id;

            // API কল করা হচ্ছে
            const apiResponse = await getDetails(buyerId);

            // কনসোলে চেক করার জন্য (সার্ভার টার্মিনালে প্রিন্ট হবে)
            console.log("API Response type:", typeof apiResponse, apiResponse);

            // ১. যদি রেসপন্স সরাসরি অ্যারে হয়
            if (Array.isArray(apiResponse)) {
                artworks = apiResponse;
            }
            // ২. যদি রেসপন্সের ভেতরে কোনো অবজেক্টের মধ্যে ডাটা থাকে (যেমন: apiResponse.data)
            else if (apiResponse && Array.isArray(apiResponse.data)) {
                artworks = apiResponse.data;
            }
            // ৩. যদি সিঙ্গেল অবজেক্ট আসে, সেটাকে অ্যারে বানিয়ে নেওয়া
            else if (apiResponse && typeof apiResponse === 'object' && Object.keys(apiResponse).length > 0) {
                artworks = [apiResponse];
            }
        } else {
            errorMessage = "Please log in to view your purchased artworks.";
        }
    } catch (error) {
        console.error("Error loading artworks:", error);
        errorMessage = "Failed to load your purchased artworks. Please try again later.";
    }

    return (
        <div style={styles.container}>
            <h1 style={styles.heading}>My Purchased Artworks</h1>

            {errorMessage && <p style={styles.error}>{errorMessage}</p>}

            {/* সেফটি চেক: ডাটা অ্যারে কিনা এবং লেন্থ ০ কিনা */}
            {!errorMessage && (!Array.isArray(artworks) || artworks.length === 0) && (
                <p style={styles.emptyText}>You haven't purchased any artworks yet.</p>
            )}

            {/* আর্টওয়ার্কের গ্রিড লেআউট */}
            <div style={styles.grid}>
                {/* এখানে সেফলি চেক করে ম্যাপ করা হচ্ছে যেন এরর না আসে */}
                {Array.isArray(artworks) && artworks.map((artwork) => (
                    <div key={artwork._id || Math.random()} style={styles.card}>

                        {/* Artwork Image Container */}
                        <div style={styles.imageContainer}>
                            <Image
                                width={100}
                                height={100}
                                unoptimized
                                src={artwork.imageFile || ''}
                                alt={artwork.title || 'Artwork'}
                                style={styles.image}
                                loading="lazy"
                            />
                            {artwork.Status && (
                                <span style={styles.badge}>
                                    {artwork.Status}
                                </span>
                            )}
                        </div>

                        {/* Artwork Info */}
                        <div style={styles.infoContainer}>
                            <h3 style={styles.title}>{artwork.title || 'Untitled'}</h3>
                            <p style={styles.category}>{artwork.category || 'Digital & Watercolor'}</p>

                            <div style={styles.priceRow}>
                                <span style={styles.priceLabel}>Price paid</span>
                                <span style={styles.price}>${artwork.price || 0}</span>
                            </div>
                        </div>

                    </div>
                ))}
            </div>
        </div>
    );
}

const styles = {
    container: { backgroundColor: '#0a0a0a', minHeight: '100vh', padding: '60px 20px', color: '#fff', fontFamily: 'sans-serif' },
    heading: { fontSize: '26px', fontWeight: '600', marginBottom: '40px', textAlign: 'center', letterSpacing: '0.5px' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '30px', maxWidth: '1200px', margin: '0 auto' },
    card: { backgroundColor: '#161616', borderRadius: '12px', overflow: 'hidden', border: '1px solid #222', display: 'flex', flexDirection: 'column' },
    imageContainer: { position: 'relative', width: '100%', paddingTop: '100%', backgroundColor: '#1c1c1e' },
    image: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' },


    badge: {
        position: 'absolute',
        top: '14px',
        right: '14px',
        backgroundColor: '#ff453a', 
        color: '#ffffff',          
        padding: '4px 12px',
        borderRadius: '20px',
        fontSize: '11px',
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: '0.5px'
    },

    infoContainer: { padding: '20px', display: 'flex', flexDirection: 'column', gap: '6px' },
    title: { fontSize: '18px', fontWeight: '600', color: '#fff', margin: 0, letterSpacing: '0.3px' },
    category: { fontSize: '14px', color: '#8a8a8f', margin: '0 0 10px 0' },
    priceRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #222', paddingTop: '12px', marginTop: '4px' },
    priceLabel: { fontSize: '13px', color: '#666' },
    price: { fontSize: '16px', fontWeight: '700', color: '#cca343' },
    error: { color: '#ff453a', textAlign: 'center', fontSize: '16px' },
    emptyText: { color: '#8a8a8f', textAlign: 'center', fontSize: '16px', marginTop: '60px' }
}; // অবজেক্টের ব্র্যাকেটটি এখানে সঠিকভাবে ক্লোজ করা হয়েছে