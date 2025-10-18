import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import logo from "../assets/LOGO_Bond Var2.png";
import Thw from "../assets/images__4_-removebg-preview.png";

const Footer = () => {
  // اللغة والاتجاه
  const lang = useSelector((s) => s.locale.lang);
  const isRTL = lang === "ar";

  // نصوص باللغتين
  const t = {
    address: lang === "ar" ? "العنوان" : "Address",
    contact: lang === "ar" ? "التواصل" : "Contact",
    phone: lang === "ar" ? "الهاتف" : "Phone",
    email: lang === "ar" ? "البريد الإلكتروني" : "Email",
    subscribeTitle:
      lang === "ar" ? "اشترك في «أخبار بوند»" : 'Subscribe to “BOND news”',
    emailPlaceholder: lang === "ar" ? "البريد الإلكتروني" : "Email",
    refund: lang === "ar" ? "سياسة الاسترجاع" : "Refund Policy",
    privacy: lang === "ar" ? "سياسة الخصوصية" : "Privacy Policy",
    shipping: lang === "ar" ? "سياسة الشحن" : "Shipping Policy",
    rights: lang === "ar" ? "جميع الحقوق محفوظة." : "All rights reserved.",
    // السطر الجديد للتصميم
    designedBy: lang === "ar" ? "تصميم" : "Designed by",
    companyName: lang === "ar" ? "شركة موبادر" : "Mobadeer",
  };

  // بيانات التواصل (نفس الشكل المعروض، وروابط منفصلة)
  const DISPLAY_PHONE = "+968 9271 2374"; // يُعرض للمستخدم كما هو
  const WHATSAPP_PHONE = "96892712374";   // للربط مع wa.me (بدون مسافات)
  const EMAIL = "Bondarabia1@gmail.com";

  const IG_URL =
    "https://www.instagram.com/bondarabia?igsh=MTgzbDhqZWc2ZGR6Ng%3D%3D&utm_source=qr";

  // رابط إنستجرام شركة موبادر
  const MOBADEER_IG = "https://www.instagram.com/mobadeere/";

  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8" dir={isRTL ? "rtl" : "ltr"}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* الشعار */}
          <div className={`${isRTL ? "md:justify-end" : "md:justify-start"} flex justify-center`}>
            <div className="w-40">
              <img src={logo} alt="Bond Arabia" className="w-full h-auto" />
            </div>
          </div>

          {/* العنوان */}
          <div>
            <h3 className="text-lg font-medium mb-4">{t.address}</h3>
            {/* ثنائي اللغة كما طَلَبت */}
            <p className="text-gray-400">سلطنة عُمان | Oman</p>
          </div>

          {/* التواصل */}
          <div>
            <h3 className="text-lg font-medium mb-4">{t.contact}</h3>

            {/* الرقم: نفس الشكل المعروض، لكن الرابط يفتح واتساب */}
            <p className="text-gray-400">
              {t.phone}:{" "}
              <a
                href={`https://wa.me/${WHATSAPP_PHONE}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                {DISPLAY_PHONE}
              </a>
            </p>

            {/* الايميل: نفس الشكل المعروض، لكن الرابط mailto */}
            <p className="text-gray-400">
              {t.email}:{" "}
              <a
                href={`mailto:${EMAIL}`}
                className="hover:underline"
              >
                {EMAIL}
              </a>
            </p>
          </div>

          {/* النشرة البريدية (كما هي عندك الآن معطلة/مخفية بالكومنت)، أبقيتها بدون تغييرات في الشكل */}
          <div>
            <form className={`flex ${isRTL ? "flex-row-reverse" : ""}`}>
              {/* الحقول مُعلّقة لديك بالكومنت، تركتها كما هي */}
            </form>

            {/* وسائل التواصل (إنستجرام + يوتيوب + صورة Thw) */}
            <div className={`mt-6 flex ${isRTL ? "space-x-reverse space-x-4" : "space-x-4"}`}>
              {/* Instagram — الرابط الجديد */}
              <a
                href={IG_URL}
                className="text-gray-400 hover:text-white"
                aria-label="Instagram"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    fillRule="evenodd"
                    d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>

              <a
                href="https://www.youtube.com/@bondthailand"
                className="text-gray-400 hover:text-white"
                aria-label="YouTube"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    fillRule="evenodd"
                    d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 01-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 01-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 011.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418zM15.194 12 10 15V9l5.194 3z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>

              <img src={Thw} className="w-6 text-gray-400 invert brightness-0" alt="Thawani" />
            </div>
          </div>
        </div>

        {/* أسفل الفوتر */}
        <div className="mt-12 border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3">
            <div className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} Bond Arabia. {t.rights}
            </div>

            {/* سطر "تصميم شركة موبادر" مع رابط إنستجرام */}
            <div className="text-gray-400 text-sm">
              {t.designedBy}{" "}
              <a
                href={MOBADEER_IG}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-200 hover:text-white underline underline-offset-4"
                aria-label={t.companyName}
                title={t.companyName}
              >
                {t.companyName}
              </a>
            </div>

            <div className="mt-1 md:mt-0">
              <ul className={`flex ${isRTL ? "space-x-reverse space-x-6" : "space-x-6"}`}>
                <li>
                  <Link to="/return-policy" className="text-gray-400 hover:text-white text-sm">
                    {t.refund}
                  </Link>
                </li>
                {/* احتفظت بالبقية كما كانت مُعلّقة */}
                {/* <li>
                  <Link to="/privacy-policy" className="text-gray-400 hover:text-white text-sm">
                    {t.privacy}
                  </Link>
                </li>
                <li>
                  <Link to="/shipping-policy" className="text-gray-400 hover:text-white text-sm">
                    {t.shipping}
                  </Link>
                </li> */}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
