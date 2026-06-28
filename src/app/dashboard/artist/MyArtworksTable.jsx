"use client";

import { deleteArtistCard, updateArtistCard } from "@/lib/actions/ArtistCard";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "react-toastify";

export default function ArtworkTable({ data }) {

    const router = useRouter();

    const itemsPerPage = 5;
    const [currentPage, setCurrentPage] = useState(1);

    // 🌟 Edit এবং Delete এর জন্য প্রয়োজনীয় স্টেটসমূহ
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editingArtwork, setEditingArtwork] = useState(null);

    const artworkData = data || [];

    // Client Side Pagination লজিক
    const totalPages = Math.max(1, Math.ceil(artworkData.length / itemsPerPage));
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = artworkData.slice(indexOfFirstItem, indexOfLastItem);

    // 📝 EDIT BUTTON CLICK HANDLER
    const handleEditClick = (artwork) => {
        setEditingArtwork(artwork);
        setIsEditOpen(true);
    };

    // 💾 UPDATE FORM SUBMIT HANDLER
    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        const artworkId = formData.get("edit-id");

        const updatedData = {
            title: formData.get("edit-title"),
            category: formData.get("edit-category"),
            price: Number(formData.get("edit-price")),
            description: formData.get("edit-description"),
        };

        try {

            const res = await updateArtistCard(artworkId, updatedData);

            if (!res?.acknowledged) {
                throw new Error("Update failed");
            }

            setIsEditOpen(false);
            setEditingArtwork(null);

            toast.success("Artwork updated successfully!");
            router.refresh();

        } catch (error) {
            toast.error('Update failed');
        }
    };

    // 🗑️ DELETE BUTTON HANDLER
    const handleDeleteClick = async (artworkId) => {

        const confirmDelete = window.confirm("Are you sure you want to delete this artwork?");
        if (!confirmDelete) return;

        console.log("Deleting Artwork ID:", artworkId);

        try {

            const res = await deleteArtistCard(artworkId);

            if (!res?.deletedCount) {
                throw new Error("Delete failed");
            }

            toast.success("Artwork deleted successfully!");
            router.refresh();


        } catch (error) {
            toast.error(error?.message || "Delete failed");
        }
    };

    return (
        <div className="w-full bg-[#000000] text-white p-6 antialiased relative">

            {/* টেবিল কন্টেইনার */}
            <div className="bg-[#121212]/40 border border-neutral-800 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-neutral-700 text-neutral-400 text-[11px] tracking-wider font-bold uppercase bg-[#1e1e20]">
                                <th className="py-4 px-6">Artwork</th>
                                <th className="py-4 px-6">Category</th>
                                <th className="py-4 px-6">Price</th>
                                <th className="py-4 px-6">Views</th>
                                <th className="py-4 px-6">Status</th>
                                <th className="py-4 px-6 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-700/60">
                            {currentItems.map((item) => (
                                <tr key={item._id || item.id} className="hover:bg-neutral-500/20 transition-colors group">
                                    {/* Image & Title */}
                                    <td className="py-4 px-6 flex items-center gap-4">
                                        <Image
                                            src={item.imageFile || "https://images.unsplash.com/photo-1541701494587-cb58502866ab"}
                                            width={50}
                                            height={50}
                                            unoptimized
                                            alt={item.title}
                                            className="w-10 h-10 object-cover rounded bg-neutral-800 border border-neutral-800"
                                        />
                                        <span className="font-medium text-[14px] text-neutral-200 group-hover:text-white transition-colors">
                                            {item.title}
                                        </span>
                                    </td>

                                    {/* Category Badge */}
                                    <td className="py-4 px-6">
                                        <span className="px-2.5 py-0.5 border border-amber-900/40 bg-amber-950/20 text-amber-500/90 rounded text-xs font-medium tracking-wide">
                                            {item.category}
                                        </span>
                                    </td>

                                    {/* Price */}
                                    <td className="py-4 px-6 text-[14px] font-medium text-neutral-200">
                                        {item.price}
                                    </td>

                                    {/* Views */}
                                    <td className="py-4 px-6 text-[13px] text-neutral-500 font-mono">
                                        {item.Views || 0}
                                    </td>

                                    {/* Status Badge */}
                                    <td className="py-4 px-6">
                                        <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${item.Status === "Active"
                                            ? "bg-emerald-950/30 text-emerald-500 border border-emerald-900/30"
                                            : "bg-red-950/30 text-red-400 border border-red-900/30"
                                            }`}>
                                            {item.Status || "Active"}
                                        </span>
                                    </td>

                                    {/* Actions (Edit / Delete) */}
                                    <td className="py-4 px-6 text-right">
                                        <div className="flex items-center justify-end gap-3 text-neutral-500">
                                            {/* Edit Button */}
                                            <button
                                                onClick={() => handleEditClick(item)}
                                                className="hover:text-white transition-colors p-1 cursor-pointer"
                                                aria-label="Edit"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                </svg>
                                            </button>

                                            {/* Delete Button */}
                                            <button
                                                onClick={() => handleDeleteClick(item._id || item.id)}
                                                className="hover:text-red-400 transition-colors p-1 cursor-pointer"
                                                aria-label="Delete"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* CLIENT SIDE PAGINATION CONTROLS */}
            {totalPages > 1 && (
                <div className="flex justify-end items-center gap-1.5 mt-6 text-sm font-medium select-none text-neutral-400">
                    {/* Previous Button */}
                    <button
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="p-2 text-neutral-500 hover:text-white disabled:opacity-30 disabled:hover:text-neutral-500 transition-colors cursor-pointer disabled:cursor-not-allowed"
                        aria-label="Previous page"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>

                    {/* Page Numbers */}
                    <div className="flex items-center gap-1">
                        {Array.from({ length: totalPages }, (_, index) => {
                            const pageNumber = index + 1;
                            const isActive = currentPage === pageNumber;

                            return (
                                <button
                                    key={pageNumber}
                                    onClick={() => setCurrentPage(pageNumber)}
                                    className={`min-w-8 h-9 px-2 rounded-lg text-xs font-semibold flex items-center justify-center transition-all ${isActive
                                        ? "bg-white text-black font-bold shadow-md shadow-black/20"
                                        : "text-neutral-400 hover:text-white hover:bg-neutral-900/50"
                                        }`}
                                >
                                    {pageNumber}
                                </button>
                            );
                        })}

                        {totalPages > 4 && (
                            <>
                                <span className="text-neutral-600 px-1 font-bold text-xs tracking-widest">...</span>
                                <button
                                    onClick={() => setCurrentPage(totalPages)}
                                    className={`min-w-[32px] h-9 px-2 rounded-lg text-xs font-semibold flex items-center justify-center transition-all ${currentPage === totalPages
                                        ? "bg-white text-black font-bold"
                                        : "text-neutral-400 hover:text-white"
                                        }`}
                                >
                                    {totalPages}
                                </button>
                            </>
                        )}
                    </div>

                    {/* Next Button */}
                    <button
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="p-2 text-neutral-500 hover:text-white disabled:opacity-30 disabled:hover:text-neutral-500 transition-colors cursor-pointer disabled:cursor-not-allowed"
                        aria-label="Next page"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            )}

            {/* 🌟 🛠️ UPDATE/EDIT ARTWORK MODAL (উইডথ একদম পারফেক্ট থাকবে) */}
            {isEditOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop blur effect */}
                    <div
                        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                        onClick={() => setIsEditOpen(false)}
                    ></div>

                    {/* Modal Content Box (max-w-3xl উইডথ দেওয়া) */}
                    <form
                        onSubmit={handleUpdateSubmit}
                        className="relative w-full max-w-3xl bg-[#0f0f0f] border border-neutral-900 rounded-xl overflow-hidden text-white shadow-2xl z-10"
                    >
                        {/* Modal Header */}
                        <div className="pt-8 px-8 pb-3">
                            <h2 className="text-3xl font-semibold">Update Artwork Details</h2>
                        </div>

                        {/* Modal Body */}
                        <div className="px-8 py-4 flex flex-col gap-5 max-h-[70vh] overflow-y-auto">
                            <input type="hidden" name="edit-id" value={editingArtwork?._id || ""} />
                            {/* Title */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[16px] font-medium text-white">Title</label>
                                <input
                                    type="text"
                                    name="edit-title"
                                    required
                                    defaultValue={editingArtwork?.title || ""}
                                    className="w-full bg-[#181818] border border-neutral-800 hover:border-[#c9943a] focus:border-[#c9943a] rounded px-3 py-2.5 text-sm text-neutral-200 focus:outline-none transition-colors"
                                />
                            </div>

                            {/* Category */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[16px] font-medium text-white">Category</label>
                                <div className="relative">
                                    <select
                                        name="edit-category"
                                        defaultValue={editingArtwork?.category || "Painting"}
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

                            {/* Price */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[16px] font-medium text-white">Price</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        name="edit-price"
                                        required
                                        defaultValue={editingArtwork?.price || ""}
                                        className="w-full bg-[#181818] border border-neutral-800 hover:border-[#c9943a] focus:border-[#c9943a] rounded px-3 py-2.5 text-sm text-neutral-200 focus:outline-none transition-colors"
                                    />
                                </div>
                            </div>

                            {/* Description */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[16px] font-medium text-white">Description</label>
                                <textarea
                                    rows={4}
                                    name="edit-description"
                                    defaultValue={editingArtwork?.description || ""}
                                    placeholder="Add description..."
                                    className="w-full bg-[#181818] border border-neutral-800 hover:border-[#c9943a] focus:border-[#c9943a] rounded px-3 py-2.5 text-sm text-neutral-200 focus:outline-none transition-colors resize-none"
                                />
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="px-8 pt-3 pb-8 flex gap-3">
                            <button
                                type="button"
                                onClick={() => setIsEditOpen(false)}
                                className="flex-1 bg-transparent border border-neutral-800 hover:bg-neutral-900 text-white font-medium rounded transition-colors text-sm py-3.5 cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="flex-1 bg-[#d9a74a] hover:bg-[#c2933c] text-black font-semibold rounded transition-colors text-sm py-3.5 flex items-center justify-center cursor-pointer"
                            >
                                Save Changes
                            </button>
                        </div>

                        {/* Close Trigger Icon */}
                        <button
                            type="button"
                            className="absolute top-4 right-4 text-neutral-500 hover:text-white transition-colors cursor-pointer"
                            onClick={() => setIsEditOpen(false)}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}