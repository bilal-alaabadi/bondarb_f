// src/components/home/HeroSection.jsx
import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import card1 from "../../assets/g4741-Edit.png";
import card2 from "../../assets/WhatsApp Image 2026-01-28 at 11.46.17 AM.jpeg";
import card3 from "../../assets/Screenshot 2025-08-26 175638.png";
import card4 from "../../assets/Screenshot 2025-08-26 175649.png";

const HeroSection = () => {
  const lang = useSelector((s) => s.locale.lang);

  // helper: يبني رابط مع category مطابق لقيم الفلاتر
  const buildShopLink = (category) => {
    if (!category || category === "All") return "/shop";
    return `/shop?category=${encodeURIComponent(category)}`;
  };

  const cards = [
    {
      id: 1,
      image: card1,
      // Men’s Washes
      trend: lang === "en" ? "MEN’S WASHES COLLECTION" : "مجموعة غسول الرجال",
      title: lang === "en" ? "DISCOVER YOUR SCENT" : "اكتشف عطرك",
      to: buildShopLink("Men’s Washes"),
    },
    {
      id: 3,
      image: card3,
      // Body Moisturizer
      trend: lang === "en" ? "PERFUME LOTION COLLECTION" : "مجموعة لوشن العطور",
      title: lang === "en" ? "ESSENCE OF ELEGANCE" : "جوهر الأناقة",
      to: buildShopLink("Body Moisturizer"),
    },
    {
      id: 4,
      image: card4,
      // Liquid Bath Soap
      trend: lang === "en" ? "MEN’S CARE COLLECTION" : "مجموعة العناية بالرجال",
      title: lang === "en" ? "ULTIMATE LUXURY" : "الفخامة المطلقة",
      to: buildShopLink("Liquid Bath Soap"),
    },
    {
      id: 2,
      image: card2,
      // Women’s Washes
      trend: lang === "en" ? "WOMEN’S WASHES COLLECTION" : "مجموعة غسول النساء",
      title: lang === "en" ? "DISCOVER YOUR STYLE" : "أناقة تتحدث",
      to: buildShopLink("Women’s Washes"),
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {cards.map((card) => (
          <Link key={card.id} to={card.to} className="w-full">
            <article className="w-full flex flex-col items-center">
              <div className="w-[160px] h-[160px] sm:w-full sm:aspect-square overflow-hidden rounded-none shadow-sm flex items-center justify-center">
                <img
                  src={card.image}
                  alt={card.title}
                  className="max-w-full max-h-full object-contain"
                  loading="lazy"
                />
              </div>
              <div className="mt-3 text-center">
                <p className="text-xs sm:text-sm font-semibold tracking-wide uppercase text-gray-900">
                  {card.trend} <span aria-hidden>→</span>
                </p>
                <p className="text-sm text-gray-700">{card.title}</p>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default HeroSection;
