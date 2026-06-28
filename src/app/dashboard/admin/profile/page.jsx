'use client'

import { useState, useEffect } from 'react';
// আপনার আগের প্রোভাইড করা API ফাংশনটি ইমপোর্ট করুন (পাথ ঠিক করে নিবেন)
import { getUserSession } from '@/lib/core/session';
import { updateUserDetails } from '@/lib/actions/Admin';
import { toast } from 'react-toastify';

export default function ProfileForm() {
    // ১. স্টেট সব সময় কম্পোনেন্টের একদম উপরে ডিক্লেয়ার করতে হয়
    const [userId, setUserId] = useState('');
    const [formData, setFormData] = useState({
        artistName: '',
        email: '',
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    // ২. সেশন থেকে ডাটা এনে স্টেটে সেট করার সঠিক নিয়ম
    useEffect(() => {
        async function fetchUserData() {
            try {
                const session = await getUserSession();
                if (session) {
                    setUserId(session.id || session._id); // আপনার সেশন অবজেক্ট অনুযায়ী আইডি নিবেন
                    setFormData({
                        artistName: session.name || '',
                        email: session.email || '',
                    });
                }
            } catch (err) {
                console.error("Failed to fetch user session:", err);
                toast.error("Failed to fetch user data");
            }
        }
        fetchUserData();
    }, []);

    // Input এর চেঞ্জ হ্যান্ডেল করার ফাংশন
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Form সাবমিট এবং API হিট করার ফাংশন
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!userId) {
            setMessage('User session not found. Please reload. ❌');
            return;
        }

        setLoading(true);
        setMessage('');

        try {
            // formData থেকে সঠিক ভ্যালুগুলো পাস করা হচ্ছে
            const data = await updateUserDetails(userId, formData.artistName, formData.email);
            
            if (data.modifiedCount > 0 || data.matchedCount > 0) {
                setMessage('Profile updated successfully! ✅');
                toast.success('Profile updated successfully!');
            } else {
                setMessage('No changes made. ⚠️');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            setMessage('Server error. Please try again. ❌');
        } finally {
            setLoading(false);
        }
    };

    // ইউজারের নামের প্রথম অক্ষর ডাইনামিকলি দেখানোর জন্য
    const avatarLetter = formData.artistName ? formData.artistName.charAt(0).toUpperCase() : 'U';

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                {/* Profile Avatar with Dynamic Initial Letter */}
                <div style={styles.avatar}>{avatarLetter}</div>

                <form onSubmit={handleSubmit} style={styles.form}>
                    {/* Artist Name Field */}
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Artist Name</label>
                        <input
                            type="text"
                            name="artistName"
                            value={formData.artistName}
                            onChange={handleChange}
                            style={styles.input}
                            required
                        />
                    </div>

                    {/* Email Field */}
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            style={styles.input}
                            required
                        />
                    </div>

                    {/* Save Changes Button */}
                    <button type="submit" disabled={loading} style={styles.button}>
                        {loading ? 'Saving...' : 'Save Changes ✓'}
                    </button>
                </form>
            </div>
        </div>
    );
}

// UI এর সাথে ম্যাচ করে ইনলাইন স্টাইলস
const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#0a0a0a',
        fontFamily: 'sans-serif',
        padding: '20px',
    },
    card: {
        backgroundColor: '#161616',
        padding: '40px',
        borderRadius: '12px',
        width: '100%',
        maxWidth: '450px',
        border: '1px solid #222',
        boxSizing: 'border-box',
    },
    avatar: {
        width: '80px',
        height: '80px',
        borderRadius: '50%',
        backgroundColor: '#cca343',
        color: '#fff',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: '28px',
        fontFamily: 'Georgia, serif',
        marginBottom: '30px',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
    },
    inputGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
    },
    label: {
        color: '#fff',
        fontSize: '16px',
        fontWeight: '600',
    },
    input: {
        backgroundColor: '#1c1c1e',
        border: '1px solid #2c2c2e',
        borderRadius: '6px',
        padding: '14px 16px',
        color: '#fff',
        fontSize: '15px',
        outline: 'none',
        width: '100%',
        boxSizing: 'border-box',
    },
    button: {
        width: '100%',
        backgroundColor: '#cca343',
        color: '#161616',
        border: 'none',
        borderRadius: '8px',
        padding: '14px',
        fontSize: '16px',
        fontWeight: '600',
        cursor: 'pointer',
        marginTop: '10px',
        transition: 'opacity 0.2s',
    },
    message: {
        color: '#cca343',
        fontSize: '14px',
        textAlign: 'center',
        margin: '5px 0',
    },
};