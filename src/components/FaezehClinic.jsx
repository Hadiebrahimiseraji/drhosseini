import React, { useEffect, useState } from "react";
import {
  Menu,
  X,
  Phone,
  Calendar,
  MapPin,
  Instagram,
  ArrowLeft,
  CheckCircle,
  Clock,
  Send,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Stethoscope,
} from "lucide-react";
import PortfolioCarousel from "./PortfolioCarousel.jsx";

/**
 * کلینیک زیبایی دکتر فائزه حسینی — نسخه GitHub Pages
 * - RTL + فونت Vazirmatn
 * - ارسال رزرو به واتس‌اپ (بدون بک‌اند)
 * - تصاویر Local از public (filer/kantor)
 * - SEO + Schema.org
 */

const STORAGE_KEY = "faezeh_clinic_appointments_v2";

// شماره جدید
const PHONE_DISPLAY = "09039318879";
const PHONE_E164 = "989039318879"; // 09xxxxxxxxx => 98 + 9xxxxxxxxx
const WHATSAPP_LINK = `https://wa.me/${PHONE_E164}`;
const INSTAGRAM_LINK =
  "https://www.instagram.com/dr.faeze.hosseiinii?igsh=bWxocmxvaGwzYnY5";

const BRAND = "Reel creator";
const CITY = "BABOL";
const MEDICAL_ID = "۱۹۳۲۹۸";
const SLOGAN = "زیبایی شما اعتبار ماست";

const SERVICES_TEXT =
  "فیلر، بوتاکس، جوانسازی با نخ، فیلربادی، کانتورینگ تخصصی صورت و لب";

const uid = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `id_${Date.now()}_${Math.random().toString(16).slice(2)}`;

const safeParse = (value, fallback) => {
  try {
    const parsed = JSON.parse(value);
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
};

const formatFaDateTime = (iso) => {
  try {
    const date = new Date(iso);
    return date.toLocaleString("fa-IR", {
      year: "numeric",
      month: "long",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
};

const buildWhatsAppMessage = (appt) => {
  const lines = [
    "سلام 👋",
    "درخواست رزرو نوبت جدید ثبت شد:",
    `👤 نام: ${appt.fullName}`,
    `📞 تماس: ${appt.phone}`,
    `🧾 خدمت: ${appt.service}`,
    appt.preferredDate ? `📅 تاریخ پیشنهادی: ${appt.preferredDate}` : null,
    appt.preferredTime ? `⏰ ساعت پیشنهادی: ${appt.preferredTime}` : null,
    appt.note ? `📝 توضیحات: ${appt.note}` : null,
    `📍 شهر: ${CITY}`,
    `🆔 کد پیگیری: ${appt.id.slice(0, 8)}`,
  ].filter(Boolean);

  return encodeURIComponent(lines.join("\n"));
};

export default function FaezehClinic() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [scrolled, setScrolled] = useState(false);

  // Booking form state
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    service: "",
    preferredDate: "",
    preferredTime: "",
    note: "",
  });

  // Appointments state
  const [appointments, setAppointments] = useState([]);

  
  const services = [
    {
      title: "فیلر و ژل (صورت و لب)",
      icon: "💉",
      desc: "حجم‌دهی طبیعی، اصلاح عدم تقارن و فرم‌دهی حرفه‌ای با تمرکز بر نتیجه طبیعی.",
    },
    {
      title: "بوتاکس تخصصی",
      icon: "🧬",
      desc: "کاهش چین‌وچروک و خطوط پیشانی/اخم با دوزینگ دقیق و رویکرد ایمن.",
    },
    {
      title: "جوانسازی با نخ",
      icon: "🧵",
      desc: "لیفت و سفت‌سازی بدون جراحی؛ مناسب افتادگی‌های خفیف تا متوسط.",
    },
    {
      title: "کانتورینگ تخصصی",
      icon: "✨",
      desc: "کانتورینگ صورت و لب با طراحی متناسب با فرم چهره و هارمونی طبیعی.",
    },
    {
      title: "فیلر بادی",
      icon: "🫧",
      desc: "فرم‌دهی و حجم‌دهی نواحی منتخب بدن با پروتکل‌های استاندارد و ایمن.",
    },
    {
      title: "مشاوره و طراحی درمان",
      icon: "🩺",
      desc: "بررسی دقیق و پیشنهاد مسیر درمانی متناسب با نیاز واقعی شما.",
    },
  ];

  // گالری از فایل‌های خودت
  const galleryItems = [
    { id: 1, category: "filer", image: `${import.meta.env.BASE_URL}filer1.png`, title: "فیلر — نمونه ۱" },
    { id: 2, category: "filer", image: `${import.meta.env.BASE_URL}filer2.png`, title: "فیلر — نمونه ۲" },
    { id: 3, category: "filer", image: `${import.meta.env.BASE_URL}filer3.png`, title: "فیلر — نمونه ۳" },
    { id: 4, category: "filer", image: `${import.meta.env.BASE_URL}filer4.png`, title: "فیلر — نمونه ۴" },
    { id: 5, category: "kantor", image: `${import.meta.env.BASE_URL}kantor1.png`, title: "کانتورینگ — نمونه ۱" },
    { id: 6, category: "kantor", image: `${import.meta.env.BASE_URL}kantor2.png`, title: "کانتورینگ — نمونه ۲" },
    { id: 7, category: "kantor", image: `${import.meta.env.BASE_URL}kantor3.png`, title: "کانتورینگ — نمونه ۳" },
  ];

  const filteredGallery =
    activeTab === "all"
      ? galleryItems
      : galleryItems.filter((item) => item.category === activeTab);

  const onChange = (key) => (event) =>
    setForm((prev) => ({ ...prev, [key]: event.target.value }));

  // Sticky navbar effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Load appointments from localStorage
  useEffect(() => {
    const saved = safeParse(localStorage.getItem(STORAGE_KEY), []);
    if (Array.isArray(saved)) setAppointments(saved);
  }, []);

  // Persist appointments
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appointments));
  }, [appointments]);

  const validateForm = () => {
    if (!form.fullName.trim()) return "نام و نام خانوادگی را وارد کنید.";
    if (!form.phone.trim()) return "شماره تماس را وارد کنید.";
    const normalizedPhone = form.phone.replace(/\s|-/g, "");
    if (
      !(
        normalizedPhone.startsWith("09") ||
        normalizedPhone.startsWith("+98") ||
        normalizedPhone.startsWith("0098")
      )
    ) {
      return "شماره تماس معتبر وارد کنید (مثلاً 09xxxxxxxxx).";
    }
    if (!form.service) return "لطفاً خدمت مورد نظر را انتخاب کنید.";
    return null;
  };

  const submitBooking = () => {
    const err = validateForm();
    if (err) {
      alert(err);
      return;
    }

    const appt = {
      id: uid(),
      createdAt: new Date().toISOString(),
      status: "pending",
      ...form,
    };

    setAppointments((prev) => [appt, ...prev]);

    // ارسال به واتس‌اپ (پیام آماده)
    const msg = buildWhatsAppMessage(appt);
    window.open(`${WHATSAPP_LINK}?text=${msg}`, "_blank", "noopener,noreferrer");

    setForm({
      fullName: "",
      phone: "",
      service: "",
      preferredDate: "",
      preferredTime: "",
      note: "",
    });
  };

  const toggleMenu = () => setIsMenuOpen((state) => !state);

  // JSON-LD Schema (Local SEO + AI-friendly)
  const schemaJsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalClinic",
    name: "کلینیک زیبایی دکتر فائزه حسینی",
    description: SERVICES_TEXT,
    slogan: SLOGAN,
    areaServed: CITY,
    telephone: PHONE_DISPLAY,
    url: typeof window !== "undefined" ? window.location.href : "",
    sameAs: [INSTAGRAM_LINK],
  };

  return (
    <div className="font-sans text-gray-700 bg-white" dir="rtl">
      {/* SEO / Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJsonLd) }}
      />

      {/* Vazirmatn Font */}
      <style>{`
        @import url('https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.003/Vazirmatn-font-face.css');
        body { font-family: 'Vazirmatn', sans-serif; }
      `}</style>

      {/* Floating WhatsApp Button */}
      <a
        href={WHATSAPP_LINK}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-all hover:scale-110 flex items-center gap-2 group"
        aria-label="واتس‌اپ"
        title="مشاوره واتس‌اپ"
      >
        <MessageCircle size={28} />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 ease-in-out whitespace-nowrap">
          مشاوره واتس‌اپ
        </span>
      </a>

      {/* Navigation */}
      <nav
        className={`fixed w-full z-40 transition-all duration-300 ${
          scrolled ? "bg-white shadow-md py-2" : "bg-transparent py-4"
        }`}
      >
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="text-2xl font-bold text-amber-600 flex items-center gap-2">
            <span className="bg-amber-100 p-2 rounded-full">
              <Sparkles size={18} className="text-amber-600" />
            </span>
            دکتر فائزه حسینی
          </div>

          <div className="hidden md:flex items-center gap-8 text-gray-600 font-medium">
            <a href="#home" className="hover:text-amber-600 transition">
              خانه
            </a>
            <a href="#about" className="hover:text-amber-600 transition">
              درباره
            </a>
            <a href="#services" className="hover:text-amber-600 transition">
              خدمات
            </a>
            <a href="#gallery" className="hover:text-amber-600 transition">
              نمونه‌کارها
            </a>
            <a href="#booking" className="hover:text-amber-600 transition">
              رزرو
            </a>
            <a href="#contact" className="hover:text-amber-600 transition">
              تماس
            </a>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => setShowAdmin((state) => !state)}
              className="flex items-center gap-2 bg-gray-100 text-gray-800 px-4 py-2.5 rounded-full hover:bg-gray-200 transition"
              title="پنل نوبت‌ها"
            >
              <ShieldCheck size={18} />
              پنل نوبت‌ها
            </button>

            <button
              onClick={() =>
                document
                  .querySelector("#booking")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="flex items-center gap-2 bg-amber-600 text-white px-5 py-2.5 rounded-full hover:bg-amber-700 transition shadow-lg shadow-amber-200"
            >
              <Calendar size={18} />
              رزرو وقت
            </button>
          </div>

          <button className="md:hidden text-gray-700" onClick={toggleMenu}>
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white absolute top-full left-0 w-full shadow-lg py-4 px-6 flex flex-col gap-4 border-t">
            {[
              ["#home", "خانه"],
              ["#about", "درباره"],
              ["#services", "خدمات"],
              ["#gallery", "گالری"],
              ["#booking", "رزرو"],
              ["#contact", "تماس"],
            ].map(([href, label]) => (
              <a
                key={href}
                href={href}
                className="text-gray-700 hover:text-amber-600"
                onClick={toggleMenu}
              >
                {label}
              </a>
            ))}

            <button
              onClick={() => {
                setShowAdmin((state) => !state);
                toggleMenu();
              }}
              className="bg-gray-100 text-gray-900 w-full py-3 rounded-lg flex justify-center items-center gap-2"
            >
              <ShieldCheck size={18} /> پنل نوبت‌ها
            </button>

            <button
              onClick={() => {
                document
                  .querySelector("#booking")
                  ?.scrollIntoView({ behavior: "smooth" });
                toggleMenu();
              }}
              className="bg-amber-600 text-white w-full py-3 rounded-lg flex justify-center items-center gap-2"
            >
              <Calendar size={18} /> رزرو نوبت
            </button>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section
        id="home"
        className="relative min-h-screen flex items-center pt-20 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, var(--accent-ivory) 0%, var(--accent-blush) 100%)' }}
      >
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-pink-200/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-lavender-200/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-rose-200/15 rounded-full blur-2xl"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10 grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 fade-in">
            <div>
              <h1 className="heading-primary mb-4">
                {SLOGAN}
                <br />
                <span className="text-accent">دکتر فائزه حسینی</span>
              </h1>
              <p className="text-body max-w-lg">
                متخصص فیلر، بوتاکس و جوانسازی صورت با بیش از ۱۰ سال تجربه<br />
                نتایج طبیعی و ماندگار در محیطی امن و حرفه‌ای
              </p>
            </div>

            <div className="glass p-6">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-accent">۱۰+</div>
                  <div className="text-sm text-muted">سال تجربه</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-accent">۱۰۰۰+</div>
                  <div className="text-sm text-muted">رضایت مشتری</div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-white/20">
                <p className="text-sm text-muted">
                  <strong>نظام پزشکی:</strong> {MEDICAL_ID}
                </p>
                <p className="text-sm text-muted mt-1">
                  <strong>تماس:</strong> {PHONE_DISPLAY}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() =>
                  document
                    .querySelector("#booking")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="btn-primary flex items-center justify-center gap-2"
              >
                <Calendar size={20} />
                رزرو نوبت آنلاین
              </button>
              <button
                onClick={() =>
                  document
                    .querySelector("#contact")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="btn-secondary"
              >
                تماس با ما
              </button>
            </div>
          </div>

          <div className="hidden md:block">
            <div className="glass p-8 slide-up">
              <div className="text-center">
                <div className="w-32 h-32 mx-auto mb-4 bg-gradient-to-br from-pink-400 to-rose-500 rounded-full flex items-center justify-center">
                  <Stethoscope size={48} className="text-white" />
                </div>
                <h3 className="heading-tertiary mb-2">کلینیک تخصصی زیبایی</h3>
                <p className="text-body">با پیشرفته‌ترین تکنیک‌های روز دنیا</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="section-spacing bg-gradient-to-br from-accent-ivory to-accent-blush">
        <div className="container mx-auto px-6">
          <div className="glass p-8 mb-12 max-w-3xl mx-auto text-center">
            <h2 className="heading-secondary mb-6 bg-gradient-to-r from-accent-pink to-accent-rose bg-clip-text text-transparent">درباره دکتر فائزه حسینی</h2>
            <p className="text-body leading-8">
              با تمرکز بر زیبایی طبیعی و ایمنی، خدمات تخصصی در زمینه فیلر، بوتاکس، جوانسازی
              با نخ و کانتورینگ تخصصی صورت و لب ارائه می‌شود. هر مشاوره با درک دقیق از نیازهای شما آغاز
              شده و مسیر درمان کاملاً متناسب طراحی می‌گردد.
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="premium-card p-6 text-center hover:scale-105 transition-transform">
              <div className="text-4xl mb-4">✨</div>
              <h3 className="heading-tertiary mb-2 text-accent">نتیجه طبیعی</h3>
              <p className="text-body">طراحی هارمونیک و منطبق با ویژگی‌های چهره شما</p>
            </div>
            <div className="premium-card p-6 text-center hover:scale-105 transition-transform">
              <div className="text-4xl mb-4">🛡️</div>
              <h3 className="heading-tertiary mb-2 text-accent">ایمنی اول</h3>
              <p className="text-body">رعایت کامل استانداردهای طب جمیل بین‌المللی</p>
            </div>
            <div className="premium-card p-6 text-center hover:scale-105 transition-transform">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="heading-tertiary mb-2 text-accent">مشاوره دقیق</h3>
              <p className="text-body">درک عمیق از خواسته‌ها و انتظارات هر فرد</p>
            </div>
            <div className="premium-card p-6 text-center hover:scale-105 transition-transform">
              <div className="text-4xl mb-4">💬</div>
              <h3 className="heading-tertiary mb-2 text-accent">پیگیری مداوم</h3>
              <p className="text-body">پشتیبانی پس از خدمات و نکات مراقبتی</p>
            </div>
          </div>
        </div>
      </section>

      <section id="services" className="section-spacing bg-gradient-to-br from-white to-accent-blush/30">
        <div className="container mx-auto px-6">
          <div className="glass text-center max-w-3xl mx-auto mb-16 p-8">
            <h2 className="heading-secondary mb-4 bg-gradient-to-r from-accent-lavender to-accent-pink bg-clip-text text-transparent">خدمات تخصصی</h2>
            <p className="text-body">
              {SERVICES_TEXT} — {CITY}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, idx) => (
              <div
                key={idx}
                className="premium-card p-8 group"
              >
                <div className="text-4xl mb-6 bg-gradient-to-br from-accent-blush to-accent-rose w-16 h-16 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  {service.icon}
                </div>
                <h3 className="heading-tertiary mb-3 text-accent">
                  {service.title}
                </h3>
                <p className="text-body mb-6">
                  {service.desc}
                </p>
                <a
                  href="#booking"
                  className="inline-flex items-center text-accent font-medium hover:gap-2 transition-all group-hover:text-accent-pink"
                >
                  رزرو این خدمت <ArrowLeft size={16} className="mr-1" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="gallery" className="section-spacing bg-gradient-to-br from-accent-blush/20 to-white">
        <div className="container mx-auto px-6">
          <PortfolioCarousel items={galleryItems} instagram={INSTAGRAM_LINK} city={CITY} />
        </div>
      </section>

      <section id="booking" className="section-spacing bg-gradient-to-br from-accent-ivory to-accent-blush">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto">
            <div className="glass text-center mb-12 p-8">
              <h2 className="heading-secondary mb-4 bg-gradient-to-r from-accent-rose to-accent-lavender bg-clip-text text-transparent">رزرو نوبت آنلاین</h2>
              <p className="text-body">فرم را تکمیل کنید و بلافاصله پیام آماده در واتس‌اپ دریافت کنید</p>
            </div>
            <div className="premium-card p-8">
              <div className="mb-6">
                <h3 className="heading-tertiary text-accent">اطلاعات شما</h3>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-title mb-2">
                    نام و نام خانوادگی
                  </label>
                  <input
                    value={form.fullName}
                    onChange={onChange("fullName")}
                    type="text"
                    className="form-input"
                    placeholder="مثال: مریم احمدی"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-title mb-2">
                    شماره تماس
                  </label>
                  <input
                    value={form.phone}
                    onChange={onChange("phone")}
                    type="tel"
                    className="form-input"
                    placeholder="۰۹xxxxxxxxx"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-title mb-2">
                    خدمت مورد نظر
                  </label>
                  <select
                    value={form.service}
                    onChange={onChange("service")}
                    className="form-input"
                  >
                    <option value="">انتخاب کنید</option>
                    {services.map((s) => (
                      <option key={s.title} value={s.title}>
                        {s.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-title mb-2">
                    تاریخ پیشنهادی
                  </label>
                  <input
                    value={form.preferredDate}
                    onChange={onChange("preferredDate")}
                    type="date"
                    className="form-input"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-title mb-2">
                    ساعت پیشنهادی
                  </label>
                  <input
                    value={form.preferredTime}
                    onChange={onChange("preferredTime")}
                    type="time"
                    className="form-input"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-title mb-2">
                    توضیحات اضافی (اختیاری)
                  </label>
                  <textarea
                    value={form.note}
                    onChange={onChange("note")}
                    rows={3}
                    className="form-input resize-none"
                    placeholder="هر توضیح یا سؤالی که دارید..."
                  />
                </div>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleSubmit}
                  disabled={!isFormValid}
                  className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send size={20} />
                  ارسال به واتس‌اپ
                </button>
                <button
                  onClick={clearForm}
                  className="btn-secondary flex-1"
                >
                  پاک کردن فرم
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="section-spacing bg-gradient-to-br from-gray-900 to-gray-800 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent-pink/10 rounded-full blur-3xl"></div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16">
            <div className="space-y-8">
              <div className="glass p-8">
                <h2 className="heading-secondary mb-4">راه‌های ارتباط</h2>
                <p className="text-gray-300 leading-relaxed">
                  برای هماهنگی نوبت، فرم رزرو را تکمیل کنید یا مستقیم در واتس‌اپ پیام
                  بدهید.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-gray-800 p-3 rounded-lg text-accent">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">شهر</h4>
                    <p className="text-gray-400 mt-1">{CITY}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-gray-800 p-3 rounded-lg text-accent">
                    <Phone size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">تلفن / واتس‌اپ</h4>
                    <p className="text-gray-400 mt-1 ltr text-right" dir="ltr">
                      {PHONE_DISPLAY}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-3">
                      <a
                        href={WHATSAPP_LINK}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2.5 rounded-xl hover:bg-green-700 transition"
                      >
                        <MessageCircle size={18} />
                        واتس‌اپ
                      </a>
                      <a
                        href={`tel:+${PHONE_E164}`}
                        className="inline-flex items-center gap-2 bg-gray-800 text-white px-4 py-2.5 rounded-xl hover:bg-gray-700 transition ltr"
                        dir="ltr"
                      >
                        <Phone size={18} />
                        تماس
                      </a>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-gray-800 p-3 rounded-lg text-accent">
                    <Clock size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">ساعات کاری</h4>
                    <p className="text-gray-400 mt-1">شنبه تا پنجشنبه: ۱۰ صبح الی ۸ شب</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="glass p-8">
              <h3 className="heading-tertiary mb-4">مشاوره سریع</h3>
              <p className="text-gray-300 leading-7 mb-6">
                پیام آماده را با یک کلیک در واتس‌اپ ارسال کنید:
              </p>

              <a
                href={`${WHATSAPP_LINK}?text=${encodeURIComponent(
                  `سلام، برای رزرو نوبت و دریافت مشاوره از دکتر فائزه حسینی (${CITY}) پیام می‌دهم.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 bg-green-600 text-white font-bold py-4 rounded-xl hover:bg-green-700 transition"
              >
                ارسال پیام در واتس‌اپ
                <Send size={18} />
              </a>

              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href={INSTAGRAM_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-gray-800 text-white px-4 py-2.5 rounded-xl hover:bg-accent transition"
                >
                  <Instagram size={18} />
                  اینستاگرام
                </a>
              </div>

              <div className="mt-6 text-sm text-gray-200">
                <div className="mb-2">
                  <b>نظام پزشکی:</b> {MEDICAL_ID}
                </div>
                <div>
                  <b>خدمات:</b> {SERVICES_TEXT}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-gray-950 text-gray-400 py-12 border-t border-gray-800">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm gap-4">
            <p>© تمامی حقوق محفوظ است — دکتر فائزه حسینی • {CITY}</p>
            <div className="flex gap-6">
              <a
                href={INSTAGRAM_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white"
              >
                اینستاگرام
              </a>
              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white"
              >
                واتس‌اپ
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
