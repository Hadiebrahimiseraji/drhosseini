import React, { useEffect, useMemo, useState } from "react";
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
  Trash2,
  Search,
} from "lucide-react";

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

  // Booking + Admin panel state
  const [appointments, setAppointments] = useState([]);
  const [showAdmin, setShowAdmin] = useState(false);
  const [adminQuery, setAdminQuery] = useState("");

  // Booking form state
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    service: "",
    preferredDate: "",
    preferredTime: "",
    note: "",
  });

  // تصاویر Local (از public/)
  const images = {
    hero: "/filer2.png",
    about: "/kantor2.png",
    interior: "/filer4.png",
  };

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
    { id: 1, category: "filer", image: "/filer1.png", title: "فیلر — نمونه ۱" },
    { id: 2, category: "filer", image: "/filer2.png", title: "فیلر — نمونه ۲" },
    { id: 3, category: "filer", image: "/filer3.png", title: "فیلر — نمونه ۳" },
    { id: 4, category: "filer", image: "/filer4.png", title: "فیلر — نمونه ۴" },
    { id: 5, category: "kantor", image: "/kantor1.png", title: "کانتورینگ — نمونه ۱" },
    { id: 6, category: "kantor", image: "/kantor2.png", title: "کانتورینگ — نمونه ۲" },
    { id: 7, category: "kantor", image: "/kantor3.png", title: "کانتورینگ — نمونه ۳" },
  ];

  const filteredGallery =
    activeTab === "all"
      ? galleryItems
      : galleryItems.filter((item) => item.category === activeTab);

  const adminFiltered = useMemo(() => {
    const query = adminQuery.trim().toLowerCase();
    if (!query) return appointments;
    return appointments.filter((appt) => {
      const haystack = `${appt.fullName} ${appt.phone} ${appt.service} ${
        appt.note ?? ""
      } ${appt.preferredDate ?? ""} ${appt.preferredTime ?? ""}`.toLowerCase();
      return haystack.includes(query);
    });
  }, [adminQuery, appointments]);

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

    setShowAdmin(true);
  };

  const removeAppointment = (id) => {
    if (!confirm("این نوبت حذف شود؟")) return;
    setAppointments((prev) => prev.filter((appt) => appt.id !== id));
  };

  const clearAll = () => {
    if (!confirm("همه نوبت‌ها پاک شود؟")) return;
    setAppointments([]);
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
      >
        <div className="absolute inset-0 z-0">
          <img
            src={images.hero}
            alt="فیلر و بوتاکس در بابل - دکتر فائزه حسینی"
            className="w-full h-full object-cover object-center"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 to-transparent"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10 grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="inline-block px-4 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-bold tracking-wide">
              {BRAND} • {CITY}
            </span>

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

            <div className="mt-6 overflow-hidden rounded-3xl shadow-xl">
              <img
                src={images.interior}
                alt="فضای خدمات - بابل"
                className="w-full h-72 object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-20 bg-white">
        <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              درباره دکتر فائزه حسینی
            </h2>
            <p className="text-gray-600 leading-8">
              با تمرکز بر زیبایی طبیعی و ایمنی، خدمات تخصصی در زمینه فیلر، بوتاکس،
              جوانسازی با نخ و کانتورینگ تخصصی صورت و لب ارائه می‌شود. هر مراجعه
              با مشاوره دقیق آغاز شده و مسیر درمان متناسب با نیاز شما طراحی
              می‌گردد.
            </p>
            <div className="mt-6 grid sm:grid-cols-2 gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-xl p-3">
                <CheckCircle size={18} className="text-amber-500" />
                تمرکز بر نتیجه طبیعی
              </div>
              <div className="flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-xl p-3">
                <ShieldCheck size={18} className="text-amber-500" />
                پروتکل‌های ایمن و استاندارد
              </div>
              <div className="flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-xl p-3">
                <Sparkles size={18} className="text-amber-500" />
                طراحی درمان اختصاصی
              </div>
              <div className="flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-xl p-3">
                <MessageCircle size={18} className="text-amber-500" />
                مشاوره سریع در واتس‌اپ
              </div>
            </div>
          </div>

          <div className="rounded-3xl overflow-hidden shadow-xl">
            <img
              src={images.about}
              alt="کلینیک زیبایی دکتر فائزه حسینی در بابل"
              className="w-full h-80 object-cover"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
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
                className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition duration-300 border border-gray-100 group"
              >
                <div className="text-4xl mb-6 bg-amber-50 w-16 h-16 rounded-2xl flex items-center justify-center group-hover:bg-amber-600 transition duration-300 group-hover:scale-110">
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
                  className="inline-flex items-center text-amber-600 font-medium hover:gap-2 transition-all"
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
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                نمونه‌کارها (فیلر / کانتورینگ)
              </h2>
              <p className="text-gray-600">
                تصاویر از فایل‌های خود شما در ریپو (filer و kantor)
              </p>
            </div>

            <div className="flex flex-wrap gap-2 bg-gray-100 p-1 rounded-xl">
              {[
                { id: "all", label: "همه" },
                { id: "filer", label: "فیلر" },
                { id: "kantor", label: "کانتورینگ" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeTab === tab.id
                      ? "bg-white text-amber-600 shadow-sm"
                      : "text-gray-500 hover:text-gray-800"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {filteredGallery.map((item) => (
              <div
                key={item.id}
                className="group relative overflow-hidden rounded-2xl aspect-[4/3] cursor-pointer"
                title={item.title}
              >
                <img
                  src={item.image}
                  alt={`${item.title} - ${CITY}`}
                  className="w-full h-full object-cover transition duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition duration-300 flex items-end p-6">
                  <div>
                    <span className="text-amber-400 text-xs font-bold uppercase tracking-wider mb-1 block">
                      نمونه کار
                    </span>
                    <h4 className="text-white text-lg font-bold">
                      {item.title}
                    </h4>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <a
              href={INSTAGRAM_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-amber-600 border border-gray-300 hover:border-amber-600 px-6 py-3 rounded-xl transition"
            >
              <Instagram size={20} />
              مشاهده نمونه‌کارهای بیشتر در اینستاگرام
            </a>
          </div>
        </div>
      </section>

      {/* Booking + Admin */}
      <section id="booking" className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-10 items-start">
            <div className="w-full lg:w-1/2 bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
              <div className="flex items-center justify-between gap-3 mb-6">
                <h3 className="text-2xl font-bold text-gray-900">فرم رزرو نوبت</h3>
                <button
                  onClick={() => setShowAdmin((state) => !state)}
                  className="text-sm flex items-center gap-2 bg-gray-100 hover:bg-gray-200 transition px-4 py-2 rounded-full"
                  title="نمایش پنل"
                >
                  <ShieldCheck size={16} />
                  پنل نوبت‌ها
                </button>
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

            <div className="w-full lg:w-1/2">
              <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-2xl font-bold text-gray-900">
                    پنل نوبت‌های ثبت‌شده
                  </h3>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={clearAll}
                      className="text-sm flex items-center gap-2 bg-red-50 text-red-700 border border-red-100 hover:bg-red-100 transition px-4 py-2 rounded-full"
                      title="پاک کردن همه"
                    >
                      <Trash2 size={16} />
                      پاک کردن
                    </button>
                    <button
                      onClick={() => setShowAdmin((state) => !state)}
                      className="text-sm flex items-center gap-2 bg-gray-100 hover:bg-gray-200 transition px-4 py-2 rounded-full"
                    >
                      {showAdmin ? "بستن" : "نمایش"}
                    </button>
                  </div>
                </div>

                {!showAdmin ? (
                  <div className="mt-6 bg-gray-50 border border-gray-100 rounded-2xl p-6 text-gray-600">
                    برای مشاهده نوبت‌ها، روی «نمایش» کلیک کنید.
                  </div>
                ) : (
                  <>
                    <div className="mt-6 flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
                      <Search size={18} className="text-gray-400" />
                      <input
                        value={adminQuery}
                        onChange={(event) => setAdminQuery(event.target.value)}
                        className="w-full bg-transparent outline-none text-gray-700"
                        placeholder="جستجو (نام/شماره/خدمت...)"
                      />
                    </div>

                    <div className="mt-6 space-y-4">
                      {adminFiltered.length === 0 ? (
                        <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6 text-gray-600">
                          هنوز نوبتی ثبت نشده است.
                        </div>
                      ) : (
                        adminFiltered.map((appt) => {
                          const waText = buildWhatsAppMessage(appt);
                          return (
                            <div
                              key={appt.id}
                              className="border border-gray-100 rounded-2xl p-5 hover:shadow-md transition"
                            >
                              <div className="flex items-start justify-between gap-4">
                                <div>
                                  <p className="font-bold text-gray-900">
                                    {appt.fullName}{" "}
                                    <span className="text-xs text-gray-400 mr-2">
                                      ({appt.id.slice(0, 8)})
                                    </span>
                                  </p>
                                  <p className="text-sm text-gray-600 mt-1 ltr" dir="ltr">
                                    {appt.phone}
                                  </p>
                                  <div className="mt-2 flex flex-wrap gap-2">
                                    <span className="text-xs bg-amber-50 text-amber-700 border border-amber-100 px-3 py-1 rounded-full">
                                      {appt.service}
                                    </span>
                                    {appt.preferredDate ? (
                                      <span className="text-xs bg-gray-50 text-gray-700 border border-gray-100 px-3 py-1 rounded-full">
                                        📅 {appt.preferredDate}
                                      </span>
                                    ) : null}
                                    {appt.preferredTime ? (
                                      <span className="text-xs bg-gray-50 text-gray-700 border border-gray-100 px-3 py-1 rounded-full">
                                        ⏰ {appt.preferredTime}
                                      </span>
                                    ) : null}
                                  </div>

                                  {appt.note ? (
                                    <p className="text-sm text-gray-600 mt-3 leading-7">
                                      <span className="font-bold">توضیحات:</span> {appt.note}
                                    </p>
                                  ) : null}

                                  <p className="text-xs text-gray-400 mt-3">
                                    ثبت شده در: {formatFaDateTime(appt.createdAt)}
                                  </p>
                                </div>

                                <div className="flex flex-col gap-2 min-w-[140px]">
                                  <a
                                    href={`${WHATSAPP_LINK}?text=${waText}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2.5 rounded-xl hover:bg-green-700 transition"
                                  >
                                    <MessageCircle size={16} />
                                    ارسال
                                  </a>

                                  <button
                                    onClick={() => removeAppointment(appt.id)}
                                    className="text-sm flex items-center justify-center gap-2 bg-red-50 text-red-700 border border-red-100 px-4 py-2.5 rounded-xl hover:bg-red-100 transition"
                                  >
                                    <Trash2 size={16} />
                                    حذف
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>

                    <div className="mt-6 text-xs text-gray-400 leading-6">
                      این پنل در همین مرورگر ذخیره می‌شود (LocalStorage). برای پنل واقعی
                      و چندکاربره، بک‌اند لازم است.
                    </div>
                  </>
                )}
              </div>
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
              <div>
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
