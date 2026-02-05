import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import logo from "../assets/LOGO_Bond Var2.png";
import Thw from "../assets/images__4_-removebg-preview.png";

const Footer = () => {
  const lang = useSelector((s) => s.locale.lang);
  const isRTL = lang === "ar";

  const t = {
    address: lang === "ar" ? "العنوان" : "Address",
    contact: lang === "ar" ? "التواصل" : "Contact",
    phone: lang === "ar" ? "الهاتف" : "Phone",
    email: lang === "ar" ? "البريد الإلكتروني" : "Email",
    refund: lang === "ar" ? "سياسة الاسترجاع" : "Refund Policy",
    rights: lang === "ar" ? "جميع الحقوق محفوظة." : "All rights reserved.",
    designedBy: lang === "ar" ? "تصميم" : "Designed by",
    companyName: lang === "ar" ? "شركة موبادر" : "Mobadeer",
  };

  const DISPLAY_PHONE = "+968 9271 2374";
  const WHATSAPP_PHONE = "96892712374";
  const EMAIL = "Bondarabia1@gmail.com";

  const IG_URL = "https://www.instagram.com/bondarabia";
  const TIKTOK_URL = "https://www.tiktok.com/@bond.arabia";
  const YOUTUBE_URL = "https://www.youtube.com/@bondthailand";
  const MOBADEER_IG = "https://www.instagram.com/mobadeere/";

  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8" dir={isRTL ? "rtl" : "ltr"}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* Logo */}
          <div className="flex justify-center">
            <div className="w-40">
              <img src={logo} alt="Bond Arabia" className="w-full h-auto" />
            </div>
          </div>

          {/* Address */}
          <div>
            <h3 className="text-lg font-medium mb-4">{t.address}</h3>
            <p className="text-gray-400">سلطنة عُمان | Oman</p>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-medium mb-4">{t.contact}</h3>

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

            <p className="text-gray-400">
              {t.email}:{" "}
              <a href={`mailto:${EMAIL}`} className="hover:underline">
                {EMAIL}
              </a>
            </p>
          </div>

          {/* Social Media */}
          <div>
            <div className={`mt-6 flex ${isRTL ? "space-x-reverse space-x-4" : "space-x-4"}`}>

              {/* Instagram */}
              <a href={IG_URL} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <svg className="h-6 w-6 text-gray-400 hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M7 2C4.243 2 2 4.243 2 7v10c0 2.757 2.243 5 5 5h10c2.757 0 5-2.243 5-5V7c0-2.757-2.243-5-5-5H7zm5 4a6 6 0 110 12 6 6 0 010-12zm0 2a4 4 0 100 8 4 4 0 000-8zm6.5-.75a1.25 1.25 0 11-2.5 0 1.25 1.25 0 012.5 0z"/>
                </svg>
              </a>

              {/* TikTok */}
              <a href={TIKTOK_URL} target="_blank" rel="noopener noreferrer" aria-label="TikTok">
                <svg className="h-6 w-6 text-gray-400 hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16 2h2a5 5 0 005 5v2a7 7 0 01-7-7V2z"/>
                  <path d="M10 8v7.5a2.5 2.5 0 11-2-2.45V11a5 5 0 105 5V2h-3v6z"/>
                </svg>
              </a>

              {/* YouTube */}
              {/* <a href={YOUTUBE_URL} target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                <svg className="h-6 w-6 text-gray-400 hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.5 6.2a2.9 2.9 0 00-2-2C19.7 3.7 12 3.7 12 3.7s-7.7 0-9.5.5a2.9 2.9 0 00-2 2A30.1 30.1 0 000 12a30.1 30.1 0 00.5 5.8 2.9 2.9 0 002 2c1.8.5 9.5.5 9.5.5s7.7 0 9.5-.5a2.9 2.9 0 002-2A30.1 30.1 0 0024 12a30.1 30.1 0 00-.5-5.8zM9.5 15.5v-7l6 3.5-6 3.5z"/>
                </svg>
              </a> */}

              {/* Thawani */}
              <img src={Thw} className="w-6 invert brightness-0" alt="Thawani" />
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-3">
          <div className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} Bond Arabia. {t.rights}
          </div>

          <div className="text-gray-400 text-sm">
            {t.designedBy}{" "}
            <a
              href={MOBADEER_IG}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-200 hover:text-white underline"
            >
              {t.companyName}
            </a>
          </div>

          <Link to="/return-policy" className="text-gray-400 hover:text-white text-sm">
            {t.refund}
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
