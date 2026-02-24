import React, { useState } from "react";

export default function PortfolioCarousel({ items = [], instagram, city = "" }) {
  const [activeTab, setActiveTab] = useState("all");
  const [selectedImage, setSelectedImage] = useState(null);

  const filtered =
    activeTab === "all" ? items : items.filter((it) => it.category === activeTab);

  const openModal = (image) => setSelectedImage(image);
  const closeModal = () => setSelectedImage(null);

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div className="portfolio">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2 bg-gradient-to-r from-pink-600 to-rose-500 bg-clip-text text-transparent">نمونه‌کارهای تخصصی</h2>
          <p className="text-gray-600 text-lg">بهترین نتایج فیلر و کانتورینگ | گالری کاملاً واقعی</p>
        </div>

        <div className="flex flex-wrap gap-2 bg-gray-100 p-1 rounded-xl shadow-sm">
          {[{ id: "all", label: "همه" }, { id: "filer", label: "فیلر" }, { id: "kantor", label: "کانتورینگ" }].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`px-6 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                activeTab === t.id ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg transform scale-105" : "text-gray-500 hover:text-gray-800 hover:bg-white"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((it) => (
          <div
            key={it.id}
            className="group relative rounded-2xl overflow-hidden bg-white shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 cursor-pointer"
            onClick={() => openModal(it)}
          >
            <div className="aspect-square overflow-hidden">
              <img
                src={it.image}
                alt={`${it.title} ${city}`}
                loading="lazy"
                className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
              <div>
                <div className="text-pink-300 text-xs font-bold uppercase tracking-wider mb-1">نمونه کار</div>
                <h3 className="font-bold text-white text-xl">{it.title}</h3>
              </div>
            </div>
            <div className="absolute top-4 right-4 bg-pink-500 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
              </svg>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 text-center">
        <a href={instagram} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white px-8 py-4 rounded-xl hover:from-pink-600 hover:to-rose-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12.017 0C8.396 0 7.609.034 6.298.148 4.985.262 4.05.52 3.28.99c-.77.47-1.42 1.12-1.89 1.89C.52 3.65.262 4.585.148 5.898.034 7.209 0 7.996 0 11.617s.034 4.408.148 5.719c.114 1.313.372 2.248.842 3.018.47.77 1.12 1.42 1.89 1.89.77.47 1.705.728 3.018.842C7.609 23.966 8.396 24 12.017 24s4.408-.034 5.719-.148c1.313-.114 2.248-.372 3.018-.842.77-.47 1.42-1.12 1.89-1.89.47-.77.728-1.705.842-3.018C23.966 16.025 24 15.238 24 11.617s-.034-4.408-.148-5.719c-.114-1.313-.372-2.248-.842-3.018-.47-.77-1.12-1.42-1.89-1.89C20.265.52 19.33.262 18.017.148 16.706.034 15.919 0 12.297 0h-.28zm0 2.16c3.543 0 3.967.013 5.371.147 1.312.124 2.028.332 2.508.552.547.25.947.65 1.197 1.197.22.48.428 1.196.552 2.508.134 1.404.147 1.828.147 5.371s-.013 3.967-.147 5.371c-.124 1.312-.332 2.028-.552 2.508-.25.547-.65.947-1.197 1.197-.48.22-1.196.428-2.508.552-1.404.134-1.828.147-5.371.147s-3.967-.013-5.371-.147c-1.312-.124-2.028-.332-2.508-.552-.547-.25-.947-.65-1.197-1.197-.22-.48-.428-1.196-.552-2.508C2.173 15.584 2.16 15.16 2.16 11.617s.013-3.967.147-5.371c.124-1.312.332-2.028.552-2.508.25-.547.65-.947 1.197-1.197.48-.22 1.196-.428 2.508-.552C8.33 2.173 8.754 2.16 12.297 2.16zM12.017 6.906a5.11 5.11 0 100 10.22 5.11 5.11 0 000-10.22zm0 8.43a3.32 3.32 0 110-6.64 3.32 3.32 0 010 6.64zm5.77-8.76a1.2 1.2 0 11-2.4 0 1.2 1.2 0 012.4 0z"/>
          </svg>
          مشاهده نمونه‌کارهای بیشتر در اینستاگرام
        </a>
      </div>

      {/* Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={closeModal}>
          <div className="relative max-w-4xl max-h-full" onClick={(e) => e.stopPropagation()}>
            <img
              src={selectedImage.image}
              alt={selectedImage.title}
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
            />
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm text-white rounded-full p-2 hover:bg-white/30 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm text-white p-4 rounded-lg">
              <h3 className="text-xl font-bold">{selectedImage.title}</h3>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
