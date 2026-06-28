"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import StatsStrip from "./components/StatsStrip";
import ArtCategoriesPage from "./components/RemainingDesign";

const HERO_SLIDES = [
  {
    title: "Where Art Meets\nIts Collector",
    subtitle: "Discover original works from emerging and established artists worldwide.",
    cta: "Browse Artworks",
    image: "https://i.ibb.co.com/v4JQPDyX/photo-1561214115-f2f134cc4912.avif"
  },
  {
    title: "Every Brushstroke\nTells a Story",
    subtitle: "Support independent artists and own a piece of human creativity.",
    cta: "Meet the Artists",
    image: "https://i.ibb.co.com/mFckSv7v/premium-photo-1663937576055-a1d89f3895ca.avif"
  },
  {
    title: "Collect What\nMoves You",
    subtitle: "From digital masterpieces to handcrafted sculptures — curated for you.",
    cta: "Explore Collections",
    image: "https://i.ibb.co.com/CpVvMS63/photo-1541961017774-22349e4a1262.avif"
  },
  {
    title: "Masterpieces\nCurated For You",
    subtitle: "Handpicked exceptional artworks from global talents, tailored to elevate your space.",
    cta: "View Curated Art",
    image: "https://i.ibb.co.com/bR3Vjw4K/pexels-greta-hoffman-7859041.jpg"
  },
  {
    title: "The Future of\nDigital Expression",
    subtitle: "Step into the next generation of creativity with stunning digital arts and NFTs.",
    cta: "Explore Digital",
    image: "https://i.ibb.co.com/S7JgFPXF/pexels-simeart-31052377.jpg"
  }
];

export default function Home() {
  const router = useRouter();
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setSlide((s) => (s + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(t);
  }, []);

  const current = HERO_SLIDES[slide];

  return (
    <div>
      <section className="relative h-[90vh] min-h-140 overflow-hidden bg-black">
        {/* Background Dark Overlay */}
        <div className="absolute inset-0 bg-black/50 z-10" />

        {/* Animated Image Background */}
        {/* CHANGER: mode="popLayout" use kora hoyeche jate ekshathe animation hoy */}
        <AnimatePresence mode="popLayout">
          <motion.img
            key={slide}
            src={current.image}
            alt=""
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "linear" }}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </AnimatePresence>

        {/* Content Area */}
        <div className="relative z-20 h-full flex flex-col justify-center max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-2xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 border border-white/30 bg-white/10 backdrop-blur-sm rounded-sm px-3 py-1.5 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              <span className="text-white/80 text-xs font-[monospace] tracking-widest uppercase">
                New Arrivals
              </span>
            </div>

            {/* Animated Text & Buttons */}
            {/* CHANGER: mode="popLayout" use kora hoyeche image-er sathe sync rakhte */}
            <AnimatePresence mode="popLayout">
              <motion.div
                key={slide}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.6, ease: "linear" }}
              >
                <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-semibold text-white leading-[1.1] mb-4 whitespace-pre-line">
                  {current.title}
                </h1>
                <p className="text-white/70 text-lg mb-8 max-w-md leading-relaxed">
                  {current.subtitle}
                </p>

                {/* Standard HTML Buttons with Tailwind */}
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => router.push("/browse")}
                    className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-black font-medium px-6 py-3 rounded-sm transition-colors text-sm uppercase tracking-wider"
                  >
                    {current.cta} <ChevronRight size={16} />
                  </button>

                  <button
                    onClick={() => router.push("/browse")}
                    className="inline-flex items-center border border-white/30 bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 px-6 py-3 rounded-sm transition-colors text-sm uppercase tracking-wider"
                  >
                    View All
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Slide indicators (Dots) */}
        <div className="absolute z-20 bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {HERO_SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setSlide(i)}
              className={`h-1 rounded-full transition-all duration-300 bg-white ${i === slide ? "w-8 opacity-100" : "w-3 opacity-40"
                }`}
            />
          ))}
        </div>

        {/* Navigation Arrows */}
        <div className="absolute z-20 right-6 bottom-1/2 translate-y-1/2 hidden lg:flex flex-col gap-2">
          <button
            onClick={() => setSlide((slide - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)}
            className="p-2 rounded-sm bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-colors"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => setSlide((slide + 1) % HERO_SLIDES.length)}
            className="p-2 rounded-sm bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-colors"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </section>

      <StatsStrip />


        <section>
          <ArtCategoriesPage />
        </section>
    </div>
  );
}