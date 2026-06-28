export default function StatsStrip() {
  const stats = [
    ["1,200+", "Artworks"],
    ["450+", "Artists"],
    ["8,000+", "Collectors"],
    ["42", "Countries"],
  ];

  return (
    <section className="bg-[#c9943a] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-wrap justify-center gap-8 sm:gap-12">
        {stats.map(([n, l]) => (
          <div key={l} className="text-center">
            <p className="text-2xl font-semibold">{n}</p>
            <p className="text-white/70 text-[16px] font-semibold uppercase tracking-widest">{l}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
