"use client";

import { updateRole } from "@/lib/actions/Admin";
import { getAllUsers } from "@/lib/api/User";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const ROLE_OPTIONS = ["user", "artist", "admin"];

function RoleButtons({ value, onSelect, loadingId, userId }) {
    return (
        <div className="flex items-center gap-1.5">
            {ROLE_OPTIONS.filter((role) => role !== value).map((role) => {
                const isThisButtonLoading = loadingId === `${userId}-${role}`;

                return (
                    <button
                        key={role}
                        type="button"
                        disabled={!!loadingId}
                        onClick={() => onSelect(role)}
                        className={`px-2.5 py-1 text-xs font-medium rounded border transition-all duration-150 whitespace-nowrap ${
                            isThisButtonLoading
                                ? "bg-[#3a3530] text-[#8b8680] border-[#3a3530] cursor-not-allowed animate-pulse"
                                : "bg-[#13110e] text-[#f5f1ea] border-[#3a3530] hover:bg-[#d8b16e] hover:text-[#13110e] hover:border-[#d8b16e]"
                        }`}
                    >
                        {isThisButtonLoading ? "Updating..." : role}
                    </button>
                );
            })}
        </div>
    );
}

export default function UsersTable() {
    const [users, setUsers] = useState([]);
    const [loadingId, setLoadingId] = useState(null);

    const [confirmModal, setConfirmModal] = useState({
        isOpen: false,
        userId: null,
        newRole: null,
    });

    useEffect(() => {
        async function fetchUsers() {
            try {
                const data = await getAllUsers();
                setUsers(data || []);
            } catch (err) {
                toast.error("Failed to fetch users");
            }
        }
        fetchUsers();
    }, []);


    function handleRoleClick(userId, newRole) {
        setConfirmModal({
            isOpen: true,
            userId,
            newRole,
        });
    }

    async function processRoleChange() {
        const { userId, newRole } = confirmModal;
        

        setConfirmModal({ isOpen: false, userId: null, newRole: null });
        
        setLoadingId(`${userId}-${newRole}`);

        try {
            const result = await updateRole(userId, newRole);

            if (result && result.success === false) {
                toast.error(result.message || "Failed to update role on the server");
                return;
            }

            setUsers((prev) =>
                prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u))
            );

            toast.success(`Role updated to ${newRole} successfully!`);
        } catch (error) {
            console.error("Error updating role:", error);
            toast.error("Role update failed. Please try again.");
        } finally {
            setLoadingId(null);
        }
    }

    return (
        <div className="bg-[#000000] px-3 relative min-h-screen">
            <h1 className="font-bold text-4xl mb-10">All Users</h1>
            <div className="rounded-xl border border-[#282828] overflow-hidden">
                
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-[#282828]">
                            {["Name", "Email", "Role", "Joined", "Actions"].map((h) => (
                                <th
                                    key={h}
                                    className="px-6 py-3 text-xs uppercase tracking-wider text-[#8b8680] font-normal"
                                >
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user._id} className="border-t border-[#262626]">
                                <td className="px-6 py-4 font-semibold text-[#f5f1ea] text-sm">{user.name}</td>
                                <td className="px-6 py-4 text-sm text-[#8b8680]">{user.email}</td>
                                <td className="px-6 py-4">
                                    <span className="inline-block text-[11px] lowercase px-2.5 py-1 rounded-md border border-[#3a3530] text-[#9a958c]">
                                        {user.role ? user.role.toLowerCase() : ""}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-[#8b8680]">
                                    {user.createdAt || user.joined}
                                </td>
                                <td className="px-6 py-4">
                                    <RoleButtons
                                        userId={user._id}
                                        value={user.role}
                                        loadingId={loadingId}
                                        onSelect={(role) => handleRoleClick(user._id, role)} // মোডাল ট্রিগার ফাংশন
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {confirmModal.isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
                    <div className="bg-[#13110e] border border-[#282828] p-6 rounded-xl w-full max-w-sm mx-4 shadow-2xl text-center">
                        {/* আইকন বা টাইটেল */}
                        <div className="w-12 h-12 rounded-full bg-[#d8b16e]/10 border border-[#d8b16e]/30 flex items-center justify-center mx-auto mb-4">
                            <span className="text-[#d8b16e] text-lg font-bold">!</span>
                        </div>
                        
                        <h3 className="text-[#f5f1ea] text-base font-semibold mb-2">Change User Role?</h3>
                        <p className="text-[#8b8680] text-sm mb-6">
                            Are you sure you want to promote/change this user's role to 
                            <span className="text-[#d8b16e] font-medium uppercase ml-1">"{confirmModal.newRole}"</span>?
                        </p>

                        {/* অ্যাকশন বাটনস */}
                        <div className="flex items-center justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setConfirmModal({ isOpen: false, userId: null, newRole: null })}
                                className="w-full px-4 py-2 text-xs font-medium rounded-md bg-transparent border border-[#3a3530] text-[#8b8680] hover:text-[#f5f1ea] hover:border-[#8b8680] transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={processRoleChange}
                                className="w-full px-4 py-2 text-[16px] rounded-md bg-[#d8b16e] text-[#13110e] hover:bg-[#c59f5d] font-semibold transition-colors shadow-lg shadow-[#d8b16e]/10"
                            >
                                Yes, Update
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}