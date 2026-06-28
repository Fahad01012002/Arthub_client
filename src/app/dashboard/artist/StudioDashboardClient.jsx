// src/app/studio/StudioDashboardClient.jsx
"use client";

import React, { useState, useRef } from "react";
import { Button, Modal } from "@heroui/react";
import ArtworkTable from "./MyArtworksTable";
import { getUserSession } from "@/lib/core/session";
import { createArtistCard } from "@/lib/actions/ArtistCard";

export default function StudioDashboardClient({ stats, data }) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const fileInputRef = useRef(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(URL.createObjectURL(file));
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith("image/")) {
            setSelectedImage(URL.createObjectURL(file));
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current.click();
    };

    const removeImage = (e) => {
        e.stopPropagation();
        setSelectedImage(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

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

    // 🌟 ফর্ম সাবমিট হ্যান্ডলার (সমস্ত ডাটা এখানে একবারে ক্যাচ হবে)
    const handleSubmit = async (e) => {
        e.preventDefault(); // পেজ রিফ্রেশ হওয়া বন্ধ করবে

        const formData = new FormData(e.currentTarget);

        const user = await getUserSession();

        const imageFile = fileInputRef.current?.files?.[0];

        if (!imageFile) {
            alert("Please select an image");
            return;
        }

        const imageUrl = await uploadImageToImgBB(imageFile);


        const artworkDetails = {
            title: formData.get("title"),
            category: formData.get("category"),
            price: formData.get("price"),
            description: formData.get("description"),
            imageFile: imageUrl,
            userId: user?.id,
            Status: 'Active',
            Views: ''
        };

        await createArtistCard(artworkDetails);

        setIsOpen(false);
        setSelectedImage(null);
    };

    return (
        <div className="min-h-screen bg-[#000000] text-white antialiased">
            <div className="px-4 mx-auto">

                {/* COMPONENT 1: HEADER SECTION */}
                <div className="flex justify-between items-end mb-8 pt-8">
                    <div>
                        <h1 className="text-4xl font-medium tracking-tight">
                            My Studio
                        </h1>
                    </div>

                    <Button
                        onPress={() => setIsOpen(true)}
                        className="bg-[#c9943a] hover:bg-[#cb8607] text-black font-medium px-5 py-2.5 rounded transition-all flex items-center gap-2 text-[16px] h-auto"
                    >
                        <span>+ Add Artwork</span>
                    </Button>
                </div>

                {/* STATS GRID COMPONENT */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {stats.map((stat, index) => (
                        <div
                            key={index}
                            className="bg-[#121212] border border-neutral-900 rounded-lg p-6 flex justify-between items-start"
                        >
                            <div>
                                <p className="text-[14px] font-medium tracking-wider text-neutral-500 uppercase mb-4">
                                    {stat.title}
                                </p>
                                <p className="text-[25px] font-bold text-neutral-100">
                                    {stat.value}
                                </p>
                            </div>
                            <div className={`p-2 rounded-md ${stat.bgIcon}`}>
                                {stat.icon}
                            </div>
                        </div>
                    ))}
                </div>

                {/* COMPONENT 2: CUSTOM BACKDROP MODAL */}
                <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
                    <Modal.Backdrop
                        className="bg-linear-to-t from-black/80 via-black/40 to-transparent backdrop-blur-sm"
                        variant="blur"
                    >
                        <Modal.Container>
                            {/* 🌟 ফর্ম ট্যাগ যোগ করা হয়েছে যা সাবমিট ইভেন্ট হ্যান্ডেল করবে */}
                            <form onSubmit={handleSubmit} className="w-full flex items-center justify-center">
                                <Modal.Dialog className="max-w-2xl w-full bg-[#0f0f0f] border border-neutral-900 rounded-xl p-0 overflow-hidden text-white shadow-2xl relative">

                                    {/* Modal Header */}
                                    <Modal.Header className="flex flex-col pt-8 px-8 pb-3 items-start border-b-0">
                                        <h2 className="text-3xl font-semibold">
                                            Add New Artwork
                                        </h2>
                                    </Modal.Header>

                                    {/* Modal Body / Form Fields */}
                                    <Modal.Body className="px-8 py-4 flex flex-col gap-5">
                                        {/* Title Field */}
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-[16px] font-medium text-white">Title</label>
                                            <input
                                                type="text"
                                                name="title" // 🌟 formData-তে ধরার জন্য name প্রোপার্টি আবশ্যক
                                                required
                                                placeholder="Give your artwork a title"
                                                className="w-full bg-[#181818] border border-neutral-800 hover:border-[#c9943a] focus:border-[#c9943a] rounded px-3 py-2.5 text-sm text-neutral-200 placeholder-neutral-600 focus:outline-none transition-colors"
                                            />
                                        </div>

                                        {/* Category Field */}
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-[16px] font-medium text-white">Category</label>
                                            <div className="relative group/select">
                                                <select
                                                    name="category" // 🌟 name প্রোপার্টি যুক্ত করা হয়েছে
                                                    className="w-full bg-[#181818] border border-neutral-800 hover:border-[#c9943a] focus:border-[#c9943a] rounded px-3 py-2.5 text-sm text-neutral-200 focus:outline-none transition-colors appearance-none cursor-pointer"
                                                >
                                                    <option value="Painting">Painting</option>
                                                    <option value="Sculpture">Sculpture</option>
                                                    <option value="Digital Art">Digital Art</option>
                                                    <option value="Photography">Photography</option>
                                                </select>
                                                <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-neutral-500">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Price Field */}
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-[16px] font-medium text-white">Price (USD)</label>
                                            <div className="relative">
                                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-neutral-500 text-sm">
                                                    $
                                                </span>
                                                <input
                                                    type="number" // 🌟 টেক্সটের বদলে নাম্বার টাইপ করা হয়েছে ভাল ভ্যালিডেশনের জন্য
                                                    name="price" // 🌟 name প্রোপার্টি যুক্ত করা হয়েছে
                                                    required
                                                    placeholder="e.g. 1200"
                                                    className="w-full bg-[#181818] border border-neutral-800 hover:border-[#c9943a] focus:border-[#c9943a] rounded pl-7 pr-3 py-2.5 text-sm text-neutral-200 placeholder-neutral-600 focus:outline-none transition-colors"
                                                />
                                            </div>
                                        </div>

                                        {/* Description Field */}
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-[16px] font-medium text-white">Description</label>
                                            <textarea
                                                rows={4}
                                                name="description" // 🌟 name প্রোপার্টি যুক্ত করা হয়েছে
                                                placeholder="Describe your artwork, its inspiration, medium, and dimensions..."
                                                className="w-full bg-[#181818] border border-neutral-800 hover:border-[#c9943a] focus:border-[#c9943a] rounded px-3 py-2.5 text-sm text-neutral-200 placeholder-neutral-600 focus:outline-none transition-colors resize-none"
                                            />
                                        </div>

                                        {/* Artwork Image Upload Area */}
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-[16px] font-medium text-white">Artwork Image</label>

                                            <input
                                                type="file"
                                                ref={fileInputRef}
                                                name="artworkImage" // 🌟 name প্রোপার্টি যুক্ত করা হয়েছে
                                                onChange={handleImageChange}
                                                accept="image/*"
                                                className="hidden"
                                            />

                                            <div
                                                onClick={triggerFileInput}
                                                onDragOver={handleDragOver}
                                                onDrop={handleDrop}
                                                className="border border-dashed border-neutral-800 hover:border-[#c9943a] rounded-lg p-6 bg-[#141414]/50 flex flex-col items-center justify-center min-h-35 cursor-pointer transition-colors group relative overflow-hidden"
                                            >
                                                {selectedImage ? (
                                                    <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-black/40 group/img">
                                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                                        <img
                                                            src={selectedImage}
                                                            alt="Artwork Preview"
                                                            className="w-full h-full object-contain"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={removeImage}
                                                            className="absolute top-2 right-2 bg-black/70 hover:bg-red-600 text-white p-1.5 rounded-full opacity-0 group-hover/img:opacity-100 transition-all shadow"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <svg className="w-6 h-6 text-neutral-500 group-hover:text-[#c9943a] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                                        </svg>
                                                        <div className="text-center">
                                                            <p className="text-xs text-neutral-400 group-hover:text-neutral-300 transition-colors">Click to upload or drag & drop</p>
                                                            <p className="text-[10px] text-neutral-600 mt-0.5">PNG, JPG, WEBP up to 10MB (via imgBB)</p>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </Modal.Body>

                                    {/* Modal Footer */}
                                    <Modal.Footer className="px-8 pt-3 pb-8 flex gap-3 border-t-0">
                                        <Button
                                            type="button" // 🌟 ক্যানসেল বাটনে টাইপ 'button' নিশ্চিত করা হয়েছে যেন এটি ফর্ম সাবমিট না করে
                                            onPress={() => setIsOpen(false)}
                                            className="flex-1 bg-transparent border border-neutral-800 hover:bg-neutral-900 text-white font-medium rounded transition-colors text-sm py-5 h-auto"
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            type="submit" // 🌟 বাটনের টাইপ 'submit' করা হয়েছে যাতে ক্লিক করলে handleSubmit ফাংশনটি রান হয়
                                            className="flex-1 bg-[#d9a74a] hover:bg-[#c2933c] text-black font-semibold rounded transition-colors text-sm py-5 h-auto flex items-center justify-center gap-1.5"
                                        >
                                            <span>Publish Artwork</span>
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                            </svg>
                                        </Button>
                                    </Modal.Footer>

                                    {/* Close Trigger Icon */}
                                    <Modal.CloseTrigger
                                        className="absolute top-4 right-4 text-neutral-500 hover:text-white transition-colors cursor-pointer"
                                        onClick={() => setIsOpen(false)}
                                    >

                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                        </svg>

                                    </Modal.CloseTrigger>
                                </Modal.Dialog>
                            </form>
                        </Modal.Container>
                    </Modal.Backdrop>
                </Modal>

            </div>

            <div>
                <ArtworkTable data={data} />
            </div>
        </div>
    );
}