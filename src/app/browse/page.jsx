'use client'

import { useState, useEffect, useRef, useCallback } from "react";
import { Search, SlidersHorizontal, Heart, ChevronDown, ChevronLeft, ChevronRight, X, ImageOff } from "lucide-react";
import Image from "next/image";
import { getArtworksAll } from "@/lib/api/ArtistsCard";
import Link from "next/link";

/* ============================================================================
   MOCK DATA
   Replace this with nothing — once fetchArtworks() below talks to your real
   API, this array goes away entirely. It only exists so this component runs
   standalone right now.
============================================================================ */

const CATEGORIES = ["All", "Watercolor", "Digital", "Painting", "Sculpture", "Photography"];
const SORT_OPTIONS = [
    { value: "newest", label: "Newest First" },
    { value: "price_asc", label: "Price: Low to High" },
    { value: "price_desc", label: "Price: High to Low" },
    { value: "title_asc", label: "Title: A to Z" },
];
const PAGE_SIZE = 6;

async function fetchArtworks({ data, search, category, minPrice, maxPrice, sortBy, page, pageSize }) {

    await new Promise((resolve) => setTimeout(resolve, 650));

    // ✅ FIX: ensure array even if API returns {data: []} or {items: []}
    const safeData =
        Array.isArray(data)
            ? data
            : data?.data || data?.items || [];

    let results = [...safeData];

    if (search?.trim()) {
        const q = search.trim().toLowerCase();
        results = results.filter(
            (a) => a.title?.toLowerCase().includes(q) || a.artist?.toLowerCase().includes(q)
        );
    }

    if (category && category !== "All") {
        results = results.filter((a) => a.category === category);
    }

    if (minPrice !== "" && !Number.isNaN(Number(minPrice))) {
        results = results.filter((a) => a.price >= Number(minPrice));
    }

    if (maxPrice !== "" && !Number.isNaN(Number(maxPrice))) {
        results = results.filter((a) => a.price <= Number(maxPrice));
    }

    switch (sortBy) {
        case "price_asc":
            results.sort((a, b) => a.price - b.price);
            break;
        case "price_desc":
            results.sort((a, b) => b.price - a.price);
            break;
        case "title_asc":
            results.sort((a, b) => a.title.localeCompare(b.title));
            break;
        default:
            results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    const total = results.length;
    const start = (page - 1) * pageSize;
    const items = results.slice(start, start + pageSize);

    return { items, total };
}

/* ============================================================================
   STYLES
============================================================================ */
function Styles() {
    return (
        <style>{`
      .bam-root {
        --bg: #0b0b0c;
        --surface: #161618;
        --surface-hover: #1d1d20;
        --border: #28282b;
        --border-soft: #1f1f22;
        --text-primary: #f3f1ec;
        --text-secondary: #9a9aa0;
        --text-muted: #686870;
        --accent: #c9943a;
        --accent-soft: rgba(201, 148, 58, 0.13);
        --accent-border: rgba(201, 148, 58, 0.45);
        --radius: 10px;
        background: var(--bg);
        color: var(--text-primary);
        min-height: 100%;
        padding: 32px 28px 64px;
        box-sizing: border-box;
      }
      .bam-root * { box-sizing: border-box; }
      .bam-shell { max-width: 1180px; margin: 0 auto; }

      .bam-eyebrow {
        font-size: 16px;
        font-weight: 600;
        letter-spacing: 0.14em;
        color: var(--accent);
        margin: 0 0 8px;
      }
      .bam-title {
        font-size: 30px;
        font-weight: 700;
        letter-spacing: -0.01em;
        margin: 0 0 24px;
        color: var(--text-primary);
      }

      .bam-controls-row {
        display: flex;
        gap: 10px;
        align-items: stretch;
      }
      .bam-search {
        position: relative;
        flex: 1 1 auto;
      }
      .bam-search svg {
        position: absolute;
        left: 13px;
        top: 50%;
        transform: translateY(-50%);
        color: var(--text-muted);
        pointer-events: none;
      }
      .bam-search input {
        width: 100%;
        height: 42px;
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: var(--radius);
        color: var(--text-primary);
        padding: 0 14px 0 38px;
        font-size: 14px;
        outline: none;
        transition: border-color 0.15s ease;
      }
      .bam-search input::placeholder { color: var(--text-muted); }
      .bam-search input:focus { border-color: var(--accent-border); }

      .bam-select-wrap { position: relative; }
      .bam-select-wrap svg.chev {
        position: absolute;
        right: 12px;
        top: 50%;
        transform: translateY(-50%);
        color: var(--text-muted);
        pointer-events: none;
      }
      .bam-select {
        height: 42px;
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: var(--radius);
        color: var(--text-primary);
        font-size: 14px;
        padding: 0 34px 0 14px;
        appearance: none;
        cursor: pointer;
        outline: none;
        min-width: 168px;
      }
      .bam-select:focus { border-color: var(--accent-border); }

      .bam-filter-btn {
        height: 42px;
        display: inline-flex;
        align-items: center;
        gap: 8px;
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: var(--radius);
        color: var(--text-primary);
        font-size: 14px;
        font-weight: 500;
        padding: 0 16px;
        cursor: pointer;
        transition: background 0.15s ease, border-color 0.15s ease;
        white-space: nowrap;
      }
      .bam-filter-btn:hover { background: var(--surface-hover); }
      .bam-filter-btn.active {
        border-color: var(--accent-border);
        background: var(--accent-soft);
        color: var(--accent);
      }
      .bam-filter-badge {
        background: var(--accent);
        color: #1a1305;
        font-size: 11px;
        font-weight: 700;
        border-radius: 999px;
        min-width: 18px;
        height: 18px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 0 5px;
      }

      .bam-filter-panel {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr auto;
        gap: 12px;
        align-items: end;
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: var(--radius);
        padding: 16px;
        margin-top: 10px;
        animation: bam-slide-down 0.18s ease;
      }
      @keyframes bam-slide-down {
        from { opacity: 0; transform: translateY(-6px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .bam-field label {
        display: block;
        font-size: 11px;
        color: var(--text-secondary);
        margin-bottom: 6px;
        letter-spacing: 0.02em;
      }
      .bam-field input, .bam-field select {
        width: 100%;
        height: 38px;
        background: var(--bg);
        border: 1px solid var(--border);
        border-radius: 8px;
        color: var(--text-primary);
        padding: 0 12px;
        font-size: 14px;
        outline: none;
      }
      .bam-field input::placeholder { color: var(--text-muted); }
      .bam-field input:focus, .bam-field select:focus { border-color: var(--accent-border); }
      .bam-clear-btn {
        height: 38px;
        padding: 0 16px;
        background: transparent;
        border: 1px solid var(--border);
        border-radius: 8px;
        color: var(--text-secondary);
        font-size: 13px;
        font-weight: 500;
        cursor: pointer;
        white-space: nowrap;
        transition: color 0.15s ease, border-color 0.15s ease;
      }
      .bam-clear-btn:hover { color: var(--accent); border-color: var(--accent-border); }

      .bam-meta-row {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
        margin: 22px 0 14px;
      }
      .bam-count {
        font-size: 14px;
        color: var(--text-secondary);
      }
      .bam-count strong { color: var(--text-primary); }

      .bam-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 20px;
      }
      @media (max-width: 900px) {
        .bam-grid { grid-template-columns: repeat(2, 1fr); }
        .bam-filter-panel { grid-template-columns: 1fr 1fr; }
      }
      @media (max-width: 560px) {
        .bam-grid { grid-template-columns: 1fr; }
        .bam-controls-row { flex-wrap: wrap; }
        .bam-filter-panel { grid-template-columns: 1fr; }
        .bam-root { padding: 22px 16px 48px; }
      }

      .bam-card {
        background: var(--surface);
        border: 1px solid var(--border-soft);
        border-radius: var(--radius);
        overflow: hidden;
        cursor: pointer;
        transition: transform 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease;
      }
      .bam-card:hover {
        transform: translateY(-3px);
        border-color: var(--accent-border);
        box-shadow: 0 10px 28px -12px rgba(0,0,0,0.55);
      }
      .bam-card:focus-visible {
        outline: 2px solid var(--accent);
        outline-offset: 2px;
      }
      .bam-card-img-wrap {
        position: relative;
        width: 100%;
        aspect-ratio: 1 / 1;
        background: #000;
        overflow: hidden;
      }
      .bam-card-img-wrap img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
        transition: transform 0.4s ease;
      }
      .bam-card:hover .bam-card-img-wrap img { transform: scale(1.045); }
      .bam-fav-btn {
        position: absolute;
        top: 10px;
        right: 10px;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        background: rgba(10,10,11,0.65);
        backdrop-filter: blur(4px);
        border: none;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        color: #fff;
        transition: background 0.15s ease;
      }
      .bam-fav-btn:hover { background: rgba(10,10,11,0.85); }
      .bam-fav-btn.is-fav svg { fill: var(--accent); color: var(--accent); }

      .bam-card-body { padding: 12px 14px 14px; }
      .bam-card-top-row {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
        gap: 8px;
        margin-bottom: 4px;
      }
      .bam-card-title {
        font-size: 15px;
        font-weight: 600;
        color: var(--text-primary);
        margin: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .bam-card-price {
        font-size: 14px;
        font-weight: 700;
        color: var(--accent);
        flex-shrink: 0;
      }
      .bam-card-bottom-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .bam-card-artist {
        font-size: 12.5px;
        color: var(--text-secondary);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .bam-tag {
        font-size: 10.5px;
        font-weight: 600;
        letter-spacing: 0.02em;
        color: var(--accent);
        background: var(--accent-soft);
        border: 1px solid var(--accent-border);
        border-radius: 5px;
        padding: 3px 7px;
        flex-shrink: 0;
        margin-left: 8px;
      }

      /* skeleton */
      .bam-skel-img, .bam-skel-line {
        background: linear-gradient(100deg, var(--surface) 35%, var(--surface-hover) 50%, var(--surface) 65%);
        background-size: 200% 100%;
        animation: bam-shimmer 1.3s ease-in-out infinite;
      }
      @keyframes bam-shimmer {
        0% { background-position: 150% 0; }
        100% { background-position: -50% 0; }
      }
      .bam-skel-img { width: 100%; aspect-ratio: 1/1; }
      .bam-skel-line { height: 13px; border-radius: 4px; }

      .bam-empty {
        grid-column: 1 / -1;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10px;
        padding: 64px 0;
        color: var(--text-secondary);
        text-align: center;
      }
      .bam-empty svg { color: var(--text-muted); }
      .bam-empty-title { font-size: 15px; font-weight: 600; color: var(--text-primary); }
      .bam-empty-sub { font-size: 13px; color: var(--text-muted); max-width: 320px; }

      .bam-pagination {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 6px;
        margin-top: 36px;
      }
      .bam-page-btn {
        height: 34px;
        min-width: 34px;
        padding: 0 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: 8px;
        color: var(--text-secondary);
        font-size: 13px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.15s ease;
      }
      .bam-page-btn:hover:not(:disabled) { border-color: var(--accent-border); color: var(--text-primary); }
      .bam-page-btn:disabled { opacity: 0.35; cursor: not-allowed; }
      .bam-page-btn.active {
        background: var(--accent);
        border-color: var(--accent);
        color: #1a1305;
      }
    `}</style>
    );
}

/* ============================================================================
   SMALL PIECES
============================================================================ */
function SkeletonCard() {
    return (
        <div className="bam-card" style={{ cursor: "default" }}>
            <div className="bam-skel-img" />
            <div className="bam-card-body">
                <div className="bam-skel-line" style={{ width: "70%", marginBottom: 8 }} />
                <div className="bam-skel-line" style={{ width: "40%" }} />
            </div>
        </div>
    );
}

function ArtworkCard({ artwork, isFav, onToggleFav, }) {
    const [imgError, setImgError] = useState(false);

    return (
        <div
            className="bam-card"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => (e.key === "Enter" || e.key === " ")}
        >
            <div className="bam-card-img-wrap">
                {!imgError ? (
                    <Image
                        width={640}
                        height={640}
                        src={artwork.imageFile}
                        alt={artwork.title}
                        unoptimized
                        loading="lazy"
                        onError={() => setImgError(true)}
                    />
                ) : (
                    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)" }}>
                        <ImageOff size={28} />
                    </div>
                )}
                <button
                    className={`bam-fav-btn ${isFav ? "is-fav" : ""}`}
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); onToggleFav(artwork._id); }}
                    aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
                >
                    <Heart size={15} />
                </button>
            </div>
            <div className="bam-card-body">
                <div className="bam-card-top-row">
                    <p className="bam-card-title">{artwork.title}</p>
                    <span className="bam-card-price">${artwork.price.toLocaleString()}</span>
                </div>
                <div className="bam-card-bottom-row">
                    <span className="bam-card-artist">{artwork.artist}</span>
                    <span className="bam-tag">{artwork.category}</span>
                </div>
            </div>
        </div>
    );
}

/* ============================================================================
   MAIN COMPONENT
============================================================================ */
export default function BrowseArtworks({ onOpenArtwork }) {
    const [searchInput, setSearchInput] = useState("");
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("All");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [sortBy, setSortBy] = useState("newest");
    const [filtersOpen, setFiltersOpen] = useState(false);
    const [page, setPage] = useState(1);

    const [artworks, setArtworks] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [favorites, setFavorites] = useState(() => new Set());

    const [data, setData] = useState([]);

    const requestId = useRef(0);

    // debounce the raw search input -> committed `search` value
    useEffect(() => {
        const load = async () => {
            try {
                const res = await getArtworksAll();

                // ✅ FIX: handle multiple possible API shapes
                const normalized =
                    Array.isArray(res)
                        ? res
                        : res?.data || res?.items || [];

                setData(normalized);
            } catch (err) {
                setError(err.message || "Failed to load data");
            }
        };

        load();
    }, []);

    /* debounce search */
    useEffect(() => {
        const t = setTimeout(() => setSearch(searchInput), 350);
        return () => clearTimeout(t);
    }, [searchInput]);

    /* reset page */
    useEffect(() => {
        setPage(1);
    }, [search, category, minPrice, maxPrice, sortBy]);

    /* FIX: only run when data exists */
    useEffect(() => {
        if (!data.length) return;

        const id = ++requestId.current;
        setLoading(true);
        setError(null);

        fetchArtworks({
            data,
            search,
            category,
            minPrice,
            maxPrice,
            sortBy,
            page,
            pageSize: PAGE_SIZE
        })
            .then(({ items, total }) => {
                if (id !== requestId.current) return;
                setArtworks(items);
                setTotal(total);
            })
            .catch((err) => {
                if (id !== requestId.current) return;
                setError(err.message);
            })
            .finally(() => {
                if (id !== requestId.current) return;
                setLoading(false);
            });

    }, [data, search, category, minPrice, maxPrice, sortBy, page]);

    const toggleFav = useCallback((id) => {
        setFavorites((prev) => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    }, []);

    const activeFilterCount =
        (category !== "All" ? 1 : 0) + (minPrice !== "" ? 1 : 0) + (maxPrice !== "" ? 1 : 0);

    const clearAll = () => {
        setCategory("All");
        setMinPrice("");
        setMaxPrice("");
    };

    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

    return (
        <div className="bam-root mt-22 bg-black">
            <Styles />
            <div className="bam-shell">
                <p className="bam-eyebrow">MARKETPLACE</p>
                <h1 className="bam-title">Browse Artworks</h1>

                <div className="bam-controls-row">
                    <div className="bam-search">
                        <Search size={16} />
                        <input
                            type="text"
                            placeholder="Search by title or artist..."
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                        />
                    </div>

                    <div className="bam-select-wrap">
                        <select className="bam-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                            {SORT_OPTIONS.map((opt) => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                        <ChevronDown size={15} className="chev" />
                    </div>

                    <button
                        className={`bam-filter-btn ${filtersOpen ? "active" : ""}`}
                        onClick={() => setFiltersOpen((v) => !v)}
                    >
                        <SlidersHorizontal size={15} />
                        Filters
                        {activeFilterCount > 0 && <span className="bam-filter-badge">{activeFilterCount}</span>}
                    </button>
                </div>

                {filtersOpen && (
                    <div className="bam-filter-panel">
                        <div className="bam-field">
                            <label htmlFor="bam-category">Category</label>
                            <select id="bam-category" value={category} onChange={(e) => setCategory(e.target.value)}>
                                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div className="bam-field">
                            <label htmlFor="bam-min">Min Price ($)</label>
                            <input
                                id="bam-min"
                                type="number"
                                min="0"
                                placeholder="0"
                                value={minPrice}
                                onChange={(e) => setMinPrice(e.target.value)}
                            />
                        </div>
                        <div className="bam-field">
                            <label htmlFor="bam-max">Max Price ($)</label>
                            <input
                                id="bam-max"
                                type="number"
                                min="0"
                                placeholder="Any"
                                value={maxPrice}
                                onChange={(e) => setMaxPrice(e.target.value)}
                            />
                        </div>
                        <button className="bam-clear-btn" onClick={clearAll}>
                            <X size={13} style={{ marginRight: 5, verticalAlign: -2 }} />
                            Clear All
                        </button>
                    </div>
                )}

                <div className="bam-meta-row">
                    <span className="bam-count">
                        {loading ? "Searching…" : <><strong>{total}</strong> artwork{total !== 1 ? "s" : ""} found</>}
                    </span>
                </div>

                <div className="bam-grid">
                    {loading ? (
                        Array.from({ length: PAGE_SIZE }).map((_, i) => <SkeletonCard key={i} />)
                    ) : error ? (
                        <div className="bam-empty">
                            <p className="bam-empty-title">Couldn't load artworks</p>
                            <p className="bam-empty-sub">{error}</p>
                        </div>
                    ) : artworks.length === 0 ? (
                        <div className="bam-empty">
                            <Search size={28} />
                            <p className="bam-empty-title">No artworks found</p>
                            <p className="bam-empty-sub">Try a different search term or clear your filters.</p>
                        </div>
                    ) : (
                        artworks.map((artwork) => (
                            <Link
                                key={artwork._id}
                                href={`/browse/${artwork._id}`}
                                style={{ textDecoration: 'none', color: 'inherit' }}
                            >
                                <ArtworkCard
                                    artwork={artwork}
                                    isFav={favorites.has(artwork._id)}
                                    onToggleFav={toggleFav}
                                />
                            </Link>
                        ))
                    )}
                </div>

                {!loading && !error && total > 0 && (
                    <div className="bam-pagination">
                        <button className="bam-page-btn" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
                            <ChevronLeft size={15} />
                        </button>
                        {Array.from({ length: totalPages }).map((_, i) => (
                            <button
                                key={i}
                                className={`bam-page-btn ${page === i + 1 ? "active" : ""}`}
                                onClick={() => setPage(i + 1)}
                            >
                                {i + 1}
                            </button>
                        ))}
                        <button className="bam-page-btn" disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>
                            <ChevronRight size={15} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}