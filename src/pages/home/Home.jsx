// src/pages/home/Home.jsx
import React from "react";
import Banner from "./Banner";
import TrendingProducts from "../shop/TrendingProducts";
import HeroSection from "./HeroSection";
import DealsSection from "./DealsSection";
import One from "./One";
import PromoBanner from "./PromoBanner";
import FeaturedProducts from "../shop/FeaturedProducts.jsx"; // سننشئ هذا المكون

// ✅ استدعِ صورتك بالمسار الذي ذكرتَه
import timings from "../../assets/LOGO_Bond Var1.png";

// ✅ Overlay بلا Tailwind
const overlayStyle = {
  position: "fixed",
  inset: 0,
  background: "rgba(255,255,255,0.92)",
  display: "grid",
  placeItems: "center",
  zIndex: 999999, // أعلى من أي عنصر آخر
};

const imgStyle = {
  height: 96, // px
  width: 96,  // px
  objectFit: "contain",
  imageRendering: "crisp-edges",
};

const LoadingOverlay = ({ show }) => {
  if (!show) return null;
  return (
    <div style={overlayStyle} aria-busy="true" aria-live="polite">
      <img src={timings} alt="Loading..." style={imgStyle} />
    </div>
  );
};

const Home = () => {
  const [loadingCount, setLoadingCount] = React.useState(0);
  const handleLoadingChange = React.useCallback((isLoading) => {
    setLoadingCount((n) => n + (isLoading ? 1 : -1));
  }, []);
  const isLoading = loadingCount > 0;

  // مُغلِّف لتمرير onLoadingChange بسهولة
  const TrendingWithLoading = (props) => (
    <TrendingProducts {...props} onLoadingChange={handleLoadingChange} />
  );

  return (
    <>
      <LoadingOverlay show={isLoading} />

      <Banner />
      <HeroSection />

      {/* ستة أماكن في الرئيسية يمكن التحكم بها عبر الحقل homeIndex (1..6) */}
      <TrendingWithLoading slot={1} flip={false} />
      <One />
      <TrendingWithLoading slot={2} flip={false} />
      <TrendingWithLoading slot={3} flip={true} />

      {/* المنتج الرابع بشكل خاص (مثل الصورة) */}
      <TrendingWithLoading slot={4} />
      <DealsSection />

      {/* أول 4 منتجات بعد DealsSection */}
      <FeaturedProducts onLoadingChange={handleLoadingChange} />

      <TrendingWithLoading slot={5} flip={true} />
      <TrendingWithLoading slot={6} flip={false} />
      <PromoBanner />
    </>
  );
};

export default Home;
