import React, { useEffect, useRef, useState } from "react";

export default function PortfolioCarousel({ items = [], instagram, city = "" }) {
  const [activeTab, setActiveTab] = useState("all");
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const trackRef = useRef(null);
  const touchStartX = useRef(0);

  const filtered =
    activeTab === "all" ? items : items.filter((it) => it.category === activeTab);

  useEffect(() => setIndex(0), [activeTab]);

  useEffect(() => {
    if (isPaused || filtered.length <= 1) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % filtered.length), 4500);
    return () => clearInterval(t);
  }, [filtered.length, isPaused]);

  const prev = () => setIndex((i) => (i - 1 + filtered.length) % filtered.length);
  const next = () => setIndex((i) => (i + 1) % filtered.length);

  const handlePointerDown = (e) => {
    touchStartX.current = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
  };
  const handlePointerUp = (e) => {
    const x = e.clientX ?? e.changedTouches?.[0]?.clientX ?? 0;
    const diff = x - touchStartX.current;
    if (Math.abs(diff) > 40) {
      if (diff < 0) next();
      else prev();
    }
  };

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div className="portfolio">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-1">نمونه‌کارهای تخصصی</h2>
          <p className="text-gray-600">بهترین نتایج فیلر و کانتورینگ | گالری کاملاً واقعی</p>
        </div>

        <div className="flex flex-wrap gap-2 bg-gray-100 p-1 rounded-xl">
          {[{ id: "all", label: "همه" }, { id: "filer", label: "فیلر" }, { id: "kantor", label: "کانتورینگ" }].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === t.id ? "bg-white text-amber-600 shadow-sm" : "text-gray-500 hover:text-gray-800"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div
        className="carousel relative rounded-2xl overflow-hidden"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={handlePointerDown}
        onTouchEnd={handlePointerUp}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
      >
        <div
          ref={trackRef}
          className="carousel-track flex transition-transform duration-600"
          style={{ width: `${filtered.length * 100}%`, transform: `translateX(-${(index / filtered.length) * 100}%)` }}
        >
          {filtered.map((it) => (
            <div key={it.id} className="carousel-slide flex-shrink-0 w-full md:w-1/1 p-4">
              <div className="rounded-2xl overflow-hidden bg-gray-50 shadow-sm">
                <img
                  src={it.image}
                  alt={`${it.title} ${city}`}
                  loading="lazy"
                  className="w-full h-[420px] md:h-[480px] object-cover object-center"
                />
                <div className="p-4">
                  <div className="text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">نمونه کار</div>
                  <h3 className="font-bold text-lg">{it.title}</h3>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Controls */}
        <button className="carousel-prev" onClick={prev} aria-label="قبلی">
          ‹
        </button>
        <button className="carousel-next" onClick={next} aria-label="بعدی">
          ›
        </button>

        {/* Dots */}
        <div className="carousel-dots absolute left-1/2 -translate-x-1/2 bottom-4 flex gap-2">
          {filtered.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`w-3 h-3 rounded-full transition-all ${i === index ? "bg-amber-600 w-8" : "bg-gray-300"}`}
              aria-label={`اسلاید ${i + 1}`}
            />
          ))}
        </div>

        <div className="mt-4 text-center">
          <a href={instagram} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-gray-600 hover:text-amber-600 border border-gray-300 px-6 py-3 rounded-xl transition">
            مشاهده نمونه‌کارهای بیشتر در اینستاگرام
          </a>
        </div>
      </div>
    </div>
  );
}
