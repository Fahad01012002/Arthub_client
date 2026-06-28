"use client";

import { useEffect, useState } from "react";
import { Trash2, ChevronLeft, ChevronRight, AlertCircle } from "lucide-react";
import { getArtworksAll } from "@/lib/api/ArtistsCard";
import { toast } from "react-toastify";
import { getUserById } from "@/lib/core/session";
import Image from "next/image";
import { deleteArtistCard } from "@/lib/actions/ArtistCard";
import { useRouter } from "next/navigation";

function CategoryBadge({ category }) {
  return (
    <span
      className="inline-block text-xs px-3 py-1 rounded-md border border-amber-500/40 bg-amber-500/10 text-amber-400"
    >
      {category}
    </span>
  );
}

function ArtistName({ userId }) {
  const [name, setName] = useState("Loading...");

  useEffect(() => {
    async function getUser() {
      try {
        const data = await getUserById(userId);
        if (data && data.name) {
          setName(data.name);
        } else {
          setName("Unknown User");
        }
      } catch (error) {
        console.error("Error fetching user detail:", error);
        setName("Error loading");
      }
    }
    getUser();
  }, [userId]);

  return <span className="text-xs text-[#8b8680]">{name}</span>;
}

function StatusBadge({ status }) {
  const styles =
    status === "Active"
      ? "border-green-500/40 bg-green-500/10 text-green-400"
      : "border-red-500/40 bg-red-500/10 text-red-400";
  return (
    <span className={`inline-block text-xs px-3 py-1 rounded-md border ${styles}`}>
      {status}
    </span>
  );
}

export default function ArtworksTable() {
  const [artworks, setArtworks] = useState([]);
  const router = useRouter();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;


  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedArtId, setSelectedArtId] = useState(null);
  const [selectedArtTitle, setSelectedArtTitle] = useState("");

  useEffect(() => {
    async function fetchUsers() {
      try {
        const data = await getArtworksAll();
        setArtworks(data || []);
      } catch (err) {
        toast.error("Failed to fetch users");
      }
    }
    fetchUsers();
  }, []);

  function openDeleteModal(id, title) {
    setSelectedArtId(id);
    setSelectedArtTitle(title);
    setIsModalOpen(true);
  }


  async function confirmDelete() {
    if (!selectedArtId) return;

    try {
      await deleteArtistCard(selectedArtId);
      router.refresh();

      setArtworks((prev) => prev.filter((a) => a._id !== selectedArtId));
      toast.success("Artwork deleted successfully");


      const remainingItems = artworks.filter((a) => a._id !== selectedArtId).length;
      const totalPages = Math.ceil(remainingItems / itemsPerPage);
      if (currentPage > totalPages && totalPages > 0) {
        setCurrentPage(totalPages);
      }
    } catch (error) {
      toast.error("Failed to delete artwork");
    } finally {

      setIsModalOpen(false);
      setSelectedArtId(null);
      setSelectedArtTitle("");
    }
  }

  // 🛠️ পেজিনেশন ক্যালকুলেশন
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentArtworks = artworks.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(artworks.length / itemsPerPage);

  return (
    <div className="bg-[#000000] p-8 min-h-screen relative">

      <h1 className="font-bold text-4xl mb-10">All Artworks</h1>
      <div className="rounded-xl border border-[#3a3a3a] overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-[#3a3a3a]">
              {["Artwork", "Artist", "Category", "Price", "Status", "Actions"].map((h) => (
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
            {currentArtworks.map((art) => (
              <tr key={art._id} className="border-t border-[#2c2c2c]">
                <td className="px-6 py-3">
                  <div className="flex items-center gap-3">
                    <Image
                      width={100}
                      unoptimized
                      height={100}
                      src={`${art.imageFile}`}
                      alt={art.title}
                      className="w-10 h-10 rounded-md bg-linear-to-br shrink-0 object-cover"
                    />
                    <div className="flex flex-col">
                      <span className="font-semibold text-[#f5f1ea] text-sm">{art.title}</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-3 text-sm text-[#9a958c]">
                  <ArtistName userId={art.userId} />
                </td>
                <td className="px-6 py-3">
                  <CategoryBadge category={art.category} />
                </td>
                <td className="px-6 py-3 text-sm font-semibold text-[#f5f1ea]">
                  {art.price}
                </td>
                <td className="px-6 py-3">
                  <span className="capitalize">
                    <StatusBadge status={art.Status || art.status} />
                  </span>
                </td>
                <td className="px-6 py-3">
                  <button
                    type="button"
                    onClick={() => openDeleteModal(art._id, art.title)}
                    className="text-[#8b8680] hover:text-red-400 transition-colors"
                    aria-label={`Delete ${art.title}`}
                  >
                    <Trash2 size={16} strokeWidth={1.75} />
                  </button>
                </td>
              </tr>
            ))}

            {artworks.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-sm text-[#8b8680]">
                  No artworks left.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8 select-none">
          <button
            type="button"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            className={`w-10 h-10 rounded-lg border flex items-center justify-center transition-all duration-150 ${currentPage === 1
              ? "border-[#222222] text-[#444444] cursor-not-allowed bg-transparent"
              : "border-[#2c2c2c] text-[#8b8680] hover:border-[#d8b16e] hover:text-[#f5f1ea] bg-transparent"
              }`}
          >
            <ChevronLeft size={16} />
          </button>

          {Array.from({ length: totalPages }, (_, index) => {
            const pageNum = index + 1;
            const isActive = currentPage === pageNum;

            return (
              <button
                key={pageNum}
                type="button"
                onClick={() => setCurrentPage(pageNum)}
                className={`w-10 h-10 text-sm font-semibold rounded-lg transition-all duration-150 border flex items-center justify-center ${isActive
                  ? "bg-[#d8b16e] text-[#13110e] border-[#d8b16e]"
                  : "bg-transparent text-[#f5f1ea] border-[#2c2c2c] hover:border-[#d8b16e]"
                  }`}
              >
                {pageNum}
              </button>
            );
          })}

          <button
            type="button"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            className={`w-10 h-10 rounded-lg border flex items-center justify-center transition-all duration-150 ${currentPage === totalPages
              ? "border-[#222222] text-[#444444] cursor-not-allowed bg-transparent"
              : "border-[#2c2c2c] text-[#8b8680] hover:border-[#d8b16e] hover:text-[#f5f1ea] bg-transparent"
              }`}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-[#13110e] border border-[#26211a] w-full max-w-md p-6 rounded-2xl flex flex-col items-center shadow-2xl text-center mx-4">


            <div className="w-14 h-14 rounded-full border border-amber-600/30 bg-amber-600/10 flex items-center justify-center mb-4 text-amber-500">
              <span className="text-2xl font-serif">!</span>
            </div>


            <h3 className="text-xl font-bold text-[#f5f1ea] mb-2 tracking-wide">
              Delete Artwork?
            </h3>

            <p className="text-[#9a958c] text-sm leading-relaxed mb-6 px-2">
              Are you sure you want to delete <span className="text-amber-400 font-semibold">"{selectedArtTitle}"</span>? This action cannot be undone.
            </p>

            {/* বাটন গ্রুপ (Cancel এবং Yes, Update/Delete) */}
            <div className="flex items-center gap-3 w-full justify-center">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-2.5 min-w-25 rounded-xl border border-[#2c2c2c] bg-[#1a1a1a] text-[#8b8680] text-sm font-semibold hover:text-[#f5f1ea] hover:border-[#3a3a3a] transition-all duration-150"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="px-6 py-2.5 min-w-30 rounded-xl bg-[#d8b16e] text-[#13110e] text-sm font-bold hover:bg-[#c9a05c] active:scale-95 shadow-[0_4px_12px_rgba(216,177,110,0.15)] transition-all duration-150"
              >
                Yes, Delete
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}