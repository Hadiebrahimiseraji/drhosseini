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
        className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-gradient-to-br from-white via-amber-50/30 to-amber-100/20"
      >
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-200/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-100/10 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10 grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight">
              {SLOGAN}
              <br />
              <span className="text-amber-600">دکتر فائزه حسینی</span>
            </h1>

            <p className="text-lg text-gray-600 leading-relaxed max-w-lg">
              {SERVICES_TEXT}
            </p>

            <div className="bg-white/80 backdrop-blur-md border border-white shadow-lg rounded-2xl p-4">
              <p className="text-sm text-gray-700">
                <b>نظام پزشکی:</b> {MEDICAL_ID}
              </p>
              <p className="text-sm text-gray-700 mt-1">
                <b>شماره تماس / واتس‌اپ:</b> {PHONE_DISPLAY}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <button
                onClick={() =>
                  document
                    .querySelector("#booking")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="bg-gray-900 text-white px-8 py-3.5 rounded-xl hover:bg-gray-800 transition flex items-center justify-center gap-2 shadow-lg"
              >
                <Calendar size={20} />
                رزرو وقت مشاوره
              </button>

              <a
                href={INSTAGRAM_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white text-gray-800 border-2 border-gray-200 px-8 py-3.5 rounded-xl hover:border-amber-500 hover:text-amber-600 transition flex items-center justify-center gap-2"
              >
                اینستاگرام
                <Instagram size={20} />
              </a>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2 text-sm text-gray-600">
              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-green-50 border border-green-100 text-green-700 px-4 py-2 rounded-xl hover:bg-green-100 transition"
              >
                <MessageCircle size={18} />
                واتس‌اپ: {PHONE_DISPLAY}
              </a>
              <a
                href={`tel:+${PHONE_E164}`}
                className="inline-flex items-center gap-2 bg-gray-50 border border-gray-200 text-gray-800 px-4 py-2 rounded-xl hover:bg-gray-100 transition ltr"
                dir="ltr"
              >
                <Phone size={18} />
                +{PHONE_E164}
              </a>
            </div>
          </div>

          <div className="hidden md:block">
            <div className="bg-white/80 backdrop-blur-md border border-white shadow-2xl rounded-3xl p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-amber-100 p-3 rounded-2xl">
                  <Stethoscope className="text-amber-700" />
                </div>
                <div>
                  <p className="font-bold text-gray-900">دکتر فائزه حسینی</p>
                  <p className="text-amber-700 text-sm">
                    زیبایی و مراقبت پوست • {CITY}
                  </p>
                </div>
              </div>

              <p className="text-gray-600 leading-7 text-justify">
                رویکرد ما بر «نتیجه طبیعی»، «ایمنی»، و «هماهنگی چهره» است. برای
                مشاوره و رزرو، کافیست فرم را تکمیل کنید تا پیام آماده در واتس‌اپ
                برای ارسال باز شود.
              </p>

              <div className="mt-6 grid grid-cols-2 gap-3">
                {[
                  "پروتکل‌های ایمن",
                  "نتیجه طبیعی",
                  "مشاوره دقیق",
                  "پیگیری پس از خدمات",
                ].map((text) => (
                  <div
                    key={text}
                    className="bg-gray-50 border border-gray-100 rounded-xl p-3 text-sm flex items-center gap-2"
                  >
                    <CheckCircle size={18} className="text-amber-500" />
                    {text}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 p-6 bg-amber-50 border border-amber-200 rounded-2xl">
              <p className="text-sm text-amber-900 text-center font-medium">
                ✨ نمونه‌کارهای بیشتر را در بخش پورتفوليو مشاهده کنید
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="glass p-8 mb-12 max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              درباره دکتر فائزه حسینی
            </h2>
            <p className="text-lg text-gray-600 leading-8">
              با تمرکز بر زیبایی طبیعی و ایمنی، خدمات تخصصی در زمینه فیلر، بوتاکس، جوانسازی
              با نخ و کانتورینگ تخصصی صورت و لب ارائه می‌شود. هر مشاوره با درک دقیق از نیازهای شما آغاز
              شده و مسیر درمان کاملاً متناسب طراحی می‌گردد.
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="glass p-6 text-center hover:shadow-lg transition">
              <div className="text-3xl mb-3">✨</div>
              <h3 className="font-bold text-gray-900 mb-2">نتیجه طبیعی</h3>
              <p className="text-sm text-gray-600">طراحی هارمونیک و منطبق با ویژگی‌های چهره شما</p>
            </div>
            <div className="glass p-6 text-center hover:shadow-lg transition">
              <div className="text-3xl mb-3">🛡️</div>
              <h3 className="font-bold text-gray-900 mb-2">ایمنی اول</h3>
              <p className="text-sm text-gray-600">رعایت کامل استانداردهای طب جمیل بین‌المللی</p>
            </div>
            <div className="glass p-6 text-center hover:shadow-lg transition">
              <div className="text-3xl mb-3">🎯</div>
              <h3 className="font-bold text-gray-900 mb-2">مشاوره دقیق</h3>
              <p className="text-sm text-gray-600">درک عمیق از خواسته‌ها و انتظارات هر فرد</p>
            </div>
            <div className="glass p-6 text-center hover:shadow-lg transition">
              <div className="text-3xl mb-3">💬</div>
              <h3 className="font-bold text-gray-900 mb-2">پیگیری مداوم</h3>
              <p className="text-sm text-gray-600">پشتیبانی پس از خدمات و نکات مراقبتی</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="glass text-center max-w-3xl mx-auto mb-16 p-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              خدمات تخصصی
            </h2>
            <p className="text-gray-600">
              {SERVICES_TEXT} — {CITY}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, idx) => (
              <div
                key={idx}
                className="glass p-8 rounded-2xl shadow-sm hover:shadow-xl transition duration-300 group"
              >
                <div className="text-4xl mb-6 bg-pink-50 w-16 h-16 rounded-2xl flex items-center justify-center group-hover:bg-pink-500 group-hover:text-white transition duration-300 group-hover:scale-110">
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {service.title}
                </h3>
                <p className="text-gray-500 leading-relaxed mb-6">
                  {service.desc}
                </p>
                <a
                  href="#booking"
                  className="inline-flex items-center text-pink-600 font-medium hover:gap-2 transition-all"
                >
                  رزرو این خدمت <ArrowLeft size={16} className="mr-1" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section id="gallery" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <PortfolioCarousel items={galleryItems} instagram={INSTAGRAM_LINK} city={CITY} />
        </div>
      </section>

      {/* Booking */}
      <section id="booking" className="py-20 bg-gradient-to-br from-gray-50 to-amber-50/30">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto">
            <div className="glass text-center mb-12 p-8">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">رزرو نوبت آنلاین</h2>
              <p className="text-gray-600">فرم را تکمیل کنید و بلافاصله پیام آماده در واتس‌اپ دریافت کنید</p>
            </div>
            <div className="glass p-8 shadow-lg">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900">اطلاعات شما</h3>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    نام و نام خانوادگی
                  </label>
                  <input
                    value={form.fullName}
                    onChange={onChange("fullName")}
                    type="text"
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-amber-500 transition"
                    placeholder="مثال: مریم احمدی"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    شماره تماس
                  </label>
                  <input
                    value={form.phone}
                    onChange={onChange("phone")}
                    type="tel"
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-amber-500 transition text-left"
                    dir="ltr"
                    placeholder="09xxxxxxxxx"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  خدمت مورد نظر
                </label>
                <select
                  value={form.service}
                  onChange={onChange("service")}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-amber-500 transition"
                >
                  <option value="">انتخاب کنید...</option>
                  <option value="فیلر و ژل (صورت/لب)">فیلر و ژل (صورت/لب)</option>
                  <option value="بوتاکس تخصصی">بوتاکس تخصصی</option>
                  <option value="جوانسازی با نخ">جوانسازی با نخ</option>
                  <option value="فیلر بادی">فیلر بادی</option>
                  <option value="کانتورینگ تخصصی">کانتورینگ تخصصی</option>
                  <option value="مشاوره عمومی">مشاوره عمومی</option>
                </select>
              </div>

              <div className="mt-4 grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    تاریخ پیشنهادی (اختیاری)
                  </label>
                  <input
                    value={form.preferredDate}
                    onChange={onChange("preferredDate")}
                    type="date"
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-amber-500 transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ساعت پیشنهادی (اختیاری)
                  </label>
                  <input
                    value={form.preferredTime}
                    onChange={onChange("preferredTime")}
                    type="time"
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-amber-500 transition"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  توضیحات (اختیاری)
                </label>
                <textarea
                  value={form.note}
                  onChange={onChange("note")}
                  rows={3}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-amber-500 transition"
                  placeholder="مثلاً تایم ترجیحی، سابقه حساسیت، یا توضیح کوتاه..."
                />
              </div>

              <button
                type="button"
                onClick={submitBooking}
                className="mt-6 w-full bg-amber-600 text-white font-bold py-4 rounded-xl hover:bg-amber-700 transition shadow-lg shadow-amber-200/50 flex items-center justify-center gap-2"
              >
                ثبت درخواست و ارسال به واتس‌اپ
                <Send size={18} />
              </button>

              <p className="text-xs text-center text-gray-400 mt-4">
                پس از ثبت، واتس‌اپ با متن آماده باز می‌شود تا برای پزشک ارسال کنید.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-20 bg-gray-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16">
            <div className="space-y-8">
              <div className="glass p-8">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">راه‌های ارتباط</h2>
                <p className="text-gray-400 leading-relaxed">
                  برای هماهنگی نوبت، فرم رزرو را تکمیل کنید یا مستقیم در واتس‌اپ پیام
                  بدهید.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-gray-800 p-3 rounded-lg text-amber-500">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">شهر</h4>
                    <p className="text-gray-400 mt-1">{CITY}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-gray-800 p-3 rounded-lg text-amber-500">
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
                  <div className="bg-gray-800 p-3 rounded-lg text-amber-500">
                    <Clock size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">ساعات کاری</h4>
                    <p className="text-gray-400 mt-1">شنبه تا پنجشنبه: ۱۰ صبح الی ۸ شب</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/10">
              <h3 className="text-2xl font-bold mb-4">مشاوره سریع</h3>
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
                  className="inline-flex items-center gap-2 bg-gray-800 text-white px-4 py-2.5 rounded-xl hover:bg-amber-600 transition"
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

      {/* Footer */}
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
