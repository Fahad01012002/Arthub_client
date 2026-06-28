"use client";

import React, { useState, Suspense } from "react";
import { authClient } from "@/app/lib/auth-client";
import { Form, TextField, Input, FieldError, Label } from "@heroui/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";

const IMGBB_API_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

const uploadImageToImgBB = async (file) => {
    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
        method: "POST",
        body: formData,
    });

    const data = await res.json();

    if (!data.success) {
        throw new Error(data.error?.message || "Image upload failed");
    }

    return data.data.url;
};

// ১. মূল সাইন-আপ ফর্মের ভেতরের লজিক ও UI (যা useSearchParams ব্যবহার করে)
const SignUpFormContent = () => {
    const [selectedRole, setSelectedRole] = useState("user");
    const [photoFile, setPhotoFile] = useState(null);
    const [photoPreview, setPhotoPreview] = useState(null);
    const [photoError, setPhotoError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectTo = searchParams.get("redirect") || "/";

    const validatePhotoFile = (file) => {
        const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
        if (!allowedTypes.includes(file.type)) return "Only JPG, PNG or WEBP allowed.";
        if (file.size > 5 * 1024 * 1024) return "Max file size is 5MB.";
        return null;
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const errMsg = validatePhotoFile(file);
        if (errMsg) {
            setPhotoError(errMsg);
            setPhotoFile(null);
            setPhotoPreview(null);
            return;
        }

        setPhotoError("");
        setPhotoFile(file);

        const reader = new FileReader();
        reader.onload = () => setPhotoPreview(reader.result);
        reader.readAsDataURL(file);
    };

    const handleGoogleSignUp = async () => {
        const plan = selectedRole === "user" ? "user_free" : "artist_free";

        localStorage.setItem("pendingRole", selectedRole);
        localStorage.setItem("pendingPlan", plan);
        
        await authClient.signIn.social({
            provider: "google",
        });
    };

    const onSubmit = async (e) => {
        e.preventDefault();

        if (!photoFile) {
            setPhotoError("Please upload a profile photo.");
            return;
        }

        const user = Object.fromEntries(new FormData(e.currentTarget));
        const plan = selectedRole === "user" ? "user_free" : "artist_free";

        setIsSubmitting(true);

        try {
            const imageUrl = await uploadImageToImgBB(photoFile);

            const { data, error } = await authClient.signUp.email({
                email: user.email,
                password: user.password,
                name: user.name,
                image: imageUrl,
                role: selectedRole,
                plan,
                createSession: false,
            });

            if (data) {
                toast.success("Account created successfully!");
                router.push(redirectTo);
                router.refresh();
            } else {
                toast.error(error.message || "Failed to create account");
            }
        } catch (err) {
            toast.error(err.message || "Photo upload failed. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const validateName = (value) => {
        if (value.length < 3) return "Name must be at least 3 characters.";
        if (value.length > 50) return "Name must be at most 50 characters.";
        if (!/^[a-zA-Z\s]+$/.test(value)) return "Name can only contain letters and spaces.";
        return null;
    };

    const validatePassword = (value) => {
        if (value.length < 6) return "Password must be at least 6 characters long.";
        if (!/[A-Z]/.test(value)) return "Password must contain at least one uppercase letter.";
        if (!/[a-z]/.test(value)) return "Password must contain at least one lowercase letter.";
        if (!/[0-9]/.test(value)) return "Password must contain at least one number.";
        if (!/[^A-Za-z0-9]/.test(value)) return "Password must contain at least one special character.";
        return null;
    };

    return (
        <div className="w-full max-w-md mx-auto bg-white dark:bg-zinc-900 rounded-3xl shadow-xl dark:shadow-zinc-900 px-8 py-10 border border-transparent dark:border-zinc-800">
            <h1 className="text-center text-[1.65rem] font-extrabold text-[#0d1117] dark:text-white mb-1">
                Join the Creative Hub
            </h1>
            <p className="text-center text-sm text-gray-400 dark:text-zinc-500 mb-7">
                Join ArtHub to find paintings, connect with employers, and grow your career.
            </p>

            <Form onSubmit={onSubmit} className="flex flex-col gap-4">
                {/* Full Name */}
                <TextField isRequired name="name" validate={validateName} className="w-full flex flex-col gap-1.5">
                    <Label className="text-sm font-medium text-gray-700 dark:text-zinc-300">Full Name</Label>
                    <div className="relative w-full">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-zinc-500">
                            <UserIcon />
                        </span>
                        <Input
                            placeholder="Enter your full name"
                            className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-[#f4f5f9] dark:bg-zinc-800 border border-transparent focus:border-[#c9943a] focus:ring-0 focus:ring-offset-0 focus:bg-white dark:focus:bg-zinc-700 outline-none text-sm text-gray-700 dark:text-zinc-100 placeholder-gray-400 dark:placeholder-zinc-500 transition-all"
                        />
                    </div>
                    <FieldError className="text-xs text-red-500 mt-0.5 pl-1" />
                </TextField>

                {/* Email */}
                <TextField isRequired name="email" type="email" className="w-full flex flex-col gap-1.5">
                    <Label className="text-sm font-medium text-gray-700 dark:text-zinc-300">Email Address</Label>
                    <div className="relative w-full">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-zinc-500">
                            <EmailIcon />
                        </span>
                        <Input
                            placeholder="Enter your email"
                            className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-[#f4f5f9] dark:bg-zinc-800 border border-transparent focus:border-[#c9943a] focus:ring-0 focus:ring-offset-0 focus:bg-white dark:focus:bg-zinc-700 outline-none text-sm text-gray-700 dark:text-zinc-100 placeholder-gray-400 dark:placeholder-zinc-500 transition-all"
                        />
                    </div>
                    <FieldError className="text-xs text-red-500 mt-0.5 pl-1" />
                </TextField>

                {/* Profile Photo Upload */}
                <div className="w-full flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-gray-700 dark:text-zinc-300">
                        Profile Photo
                    </label>

                    <label
                        htmlFor="photoUpload"
                        className="relative w-full flex items-center gap-4 px-4 py-3 rounded-2xl bg-[#f4f5f9] dark:bg-zinc-800 border border-transparent hover:border-[#c9943a] cursor-pointer transition-all"
                    >
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 dark:bg-zinc-700 flex items-center justify-center shrink-0">
                            {photoPreview ? (
                                <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <PhotoIcon />
                            )}
                        </div>

                        <div className="flex flex-col overflow-hidden">
                            <span className="text-sm text-gray-700 dark:text-zinc-100 truncate">
                                {photoFile ? photoFile.name : "Click to upload photo"}
                            </span>
                            <span className="text-xs text-gray-400 dark:text-zinc-500">
                                JPG, PNG or WEBP (max 5MB)
                            </span>
                        </div>

                        <input
                            id="photoUpload"
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            className="hidden"
                            onChange={handlePhotoChange}
                        />
                    </label>

                    {photoError && <p className="text-xs text-red-500 mt-0.5 pl-1">{photoError}</p>}
                </div>

                {/* Password */}
                <TextField isRequired name="password" type="password" validate={validatePassword} className="w-full flex flex-col gap-1.5">
                    <Label className="text-sm font-medium text-gray-700 dark:text-zinc-300">Password</Label>
                    <div className="relative w-full">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-zinc-500">
                            <LockIcon />
                        </span>
                        <Input
                            placeholder="Enter a strong password"
                            className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-[#f4f5f9] dark:bg-zinc-800 border border-transparent focus:border-[#c9943a] focus:ring-0 focus:ring-offset-0 focus:bg-white dark:focus:bg-zinc-700 outline-none text-sm text-gray-700 dark:text-zinc-100 placeholder-gray-400 dark:placeholder-zinc-500 transition-all"
                        />
                    </div>
                    <FieldError className="text-xs text-red-500 mt-0.5 pl-1" />
                </TextField>

                {/* Role Selection */}
                <div className="w-full flex flex-col gap-1.5">
                    <label className="text-sm font-medium block text-gray-700 dark:text-zinc-300">I am a…</label>
                    <div className="grid grid-cols-2 gap-2">
                        {["user", "artist"].map((r) => (
                            <button
                                key={r}
                                type="button"
                                onClick={() => setSelectedRole(r)}
                                className={`py-2.5 text-sm rounded-xl border transition-all capitalize font-medium ${selectedRole === r
                                    ? "border-[#c9943a] bg-[#c9943a]/10 text-[#c9943a]"
                                    : "border-gray-200 dark:border-zinc-700 text-gray-500 hover:bg-gray-50 dark:hover:bg-zinc-800"
                                    }`}
                            >
                                {r === "user" ? "Buyer / Collector" : "Artist / Creator"}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Register Button */}
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="mt-2 w-full flex items-center justify-center gap-2 bg-[#c9943a] hover:bg-[#b58230] active:scale-95 text-white font-semibold text-sm rounded-2xl py-3.5 transition-all duration-200 shadow-md shadow-amber-100 dark:shadow-zinc-900 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    <RegisterIcon />
                    {isSubmitting ? "Creating account..." : "Register"}
                </button>

                {/* Divider */}
                <div className="flex items-center gap-3 my-0.5 w-full">
                    <div className="flex-1 h-px bg-gray-200 dark:bg-zinc-700" />
                    <span className="text-xs text-gray-400 dark:text-zinc-500 whitespace-nowrap">
                        Or sign up with
                    </span>
                    <div className="flex-1 h-px bg-gray-200 dark:bg-zinc-700" />
                </div>

                {/* Google Button */}
                <button
                    onClick={handleGoogleSignUp}
                    type="button"
                    className="w-full flex items-center justify-center gap-3 border border-gray-200 dark:border-zinc-700 hover:border-gray-300 dark:hover:border-zinc-600 hover:bg-gray-50 dark:hover:bg-zinc-800 active:scale-95 text-gray-700 dark:text-zinc-300 font-medium text-sm rounded-2xl py-3.5 transition-all duration-200"
                >
                    <GoogleIcon />
                    Sign up with Google
                </button>
            </Form>

            <p className="text-center text-sm text-gray-400 dark:text-zinc-500 mt-6">
                Already have an account?{" "}
                <Link href={`/auth/login?redirect=${redirectTo}`} className="text-[#c9943a] dark:text-[#c9943a] font-semibold hover:underline">
                    Log in here
                </Link>
            </p>
        </div>
    );
};

// ২. মূল পেজ এক্সপোর্ট (যা কন্টেন্টকে Suspense দিয়ে র‍্যাপ করে বিল্ড সিকিউর করবে)
const SignUp = () => {
    return (
        <div className="min-h-screen bg-gray-100 dark:bg-zinc-950 flex items-center justify-center p-4 transition-colors">
            <Suspense fallback={
                <div className="w-full max-w-md mx-auto text-center py-10 text-gray-500 dark:text-zinc-400">
                    Loading registration form...
                </div>
            }>
                <SignUpFormContent />
            </Suspense>
        </div>
    );
};

export default SignUp;

// SVG Components
const UserIcon = () => (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
    </svg>
);
const EmailIcon = () => (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 4H2C0.9 4 0 4.9 0 6v12c0 1.1 0.9 2 2 2h20c1.1 0 2-0.9 2-2V6c0-1.1-0.9-2-2-2z" />
        <path d="M22 6l-10 7L2 6" />
    </svg>
);
const PhotoIcon = () => (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 dark:text-zinc-500">
        <rect width="18" height="18" x="3" y="3" rx="2" /><circle cx="9" cy="9" r="2" /><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
    </svg>
);
const LockIcon = () => (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect width="18" height="11" x="3" y="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
);
const RegisterIcon = () => (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><line x1="19" x2="19" y1="8" y2="14" /><line x1="22" x2="16" y1="11" y2="11" />
    </svg>
);
const GoogleIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
);