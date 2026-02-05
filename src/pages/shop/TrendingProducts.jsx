
// src/pages/shop/TrendingProducts.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from "react-redux";
import { useFetchAllProductsQuery } from '../../redux/features/products/productsApi';

const Pill = ({ children }) => (
  <span className="inline-block bg-white/10 text-white/95 px-3 py-1 rounded-[6px] text-[15px] leading-relaxed">
    {children}
  </span>
);

/* ====== Layout #4 (special) ====== */
const FourthLayout = ({ product, lang }) => {
  const lines = (product?.description || '')
    .split(/\r?\n|[.،]+/)
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 6);

  const title = product?.name || '';

  return (
    <section className="py-10 md:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <article className="relative overflow-hidden bg-white shadow-sm ring-black/5">
          <div className="grid grid-cols-1 md:grid-cols-2 h-full">
            {/* الصورة (يمين على الديسكتوب) */}
            <div className="relative order-1 md:order-2 h-full">
              <img
                src={product.image?.[0] || 'https://via.placeholder.com/1200x1400'}
                alt={product?.name || ''}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = 'https://via.placeholder.com/1200x1400';
                }}
              />
            </div>

            {/* النصوص (يسار على الديسكتوب) */}
            <div className="order-2 md:order-1 bg-[#0E161B] text-white px-6 sm:px-10 md:px-12 py-10 md:py-14 flex items-center h-full">
              <div className="w-full max-w-[620px]">
                <h3 className="uppercase font-extrabold text-4xl sm:text-[44px] md:text-[56px] leading-[1.15] tracking-wide mb-8">
                  {title}
                </h3>

                {/* النصوص كفقرات */}
                <div className="space-y-4 mb-10">
                  {lines.map((t, i) => (
                    <p key={i} className="text-white/90 text-base md:text-lg leading-7">
                      {t}
                    </p>
                  ))}
                </div>

                <Link
                  to={`/shop/${product._id}`}
                  className="inline-flex w-fit items-center justify-center rounded-md bg-white text-[#0E161B] px-7 py-4 text-[15px] font-semibold shadow-sm hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
                >
                  {lang === "ar" ? "تسوّق الآن" : "Shop Now"}
                </Link>
              </div>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
};

/* ====== Layout #5 (maroon left, image right) ====== */
const FifthLayout = ({ product, lang }) => {
  const smallTitle = product?.category || (lang === "ar" ? "مُميز" : "FEATURED");

  return (
    <section className="py-10 md:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <article className="relative overflow-hidden bg-white shadow-sm ring-black/5">
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* الصورة أولاً على الموبايل */}
            <div className="relative order-1 md:order-2">
              <div className="absolute inset-0 bg-white" />
              <div className="relative h-full w-full min-h-[420px] md:min-h-[520px]">
                <img
                  src={product.image?.[0] || 'https://via.placeholder.com/1200x900'}
                  alt={product?.name || ''}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/1200x900';
                  }}
                />
              </div>
            </div>

            {/* النصوص ثانيًا على الموبايل */}
            <div className="bg-[#7A2432] text-white p-6 sm:p-8 md:p-12 flex flex-col justify-center order-2 md:order-1">
              <p className="uppercase tracking-widest text-xs sm:text-sm opacity-90 mb-3">
                {smallTitle}
              </p>
              <h3 className="uppercase text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight tracking-wide mb-6">
                {product?.name || ''}
              </h3>

              {product?.description && (
                <p className="text-white/90 text-base md:text-lg leading-8 mb-8 max-w-[560px]">
                  {product.description}
                </p>
              )}

              <Link
                to={`/shop/${product._id}`}
                className="inline-flex w-fit items-center justify-center bg-white text-[#7A2432] px-7 py-4 text-sm md:text-base font-semibold shadow-sm hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
              >
                {lang === "ar" ? "تسوّق الآن" : "Shop Now"}
              </Link>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
};

/* ====== Layout #6 (image left, dark panel right) ====== */
const SixthLayout = ({ product, lang }) => {
  const smallTitle = product?.category || (lang === "ar" ? "مُميز" : "FEATURED");

  return (
    <section className="py-10 md:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <article className="relative overflow-hidden bg-white shadow-sm ring-black/5">
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Left image */}
            <div className="relative order-1 md:order-1">
              <div className="absolute inset-0 bg-black" />
              <div className="relative h-full w-full min-h-[420px] md:min-h-[520px]">
                <img
                  src={product.image?.[0] || 'https://via.placeholder.com/1200x900'}
                  alt={product?.name || ''}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/1200x900';
                  }}
                />
              </div>
            </div>

            {/* Right panel */}
            <div className="bg-[#0E161B] text-white p-6 sm:p-8 md:p-12 flex flex-col justify-center order-2 md:order-2">
              <p className="uppercase tracking-widest text-xs sm:text-sm opacity-90 mb-3">
                {smallTitle}
              </p>
              <h3 className="uppercase text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight tracking-wide mb-6">
                {product?.name || ''}
              </h3>

              {product?.description && (
                <p className="text-white/90 text-base md:text-lg leading-8 mb-8 max-w-[560px]">
                  {product.description}
                </p>
              )}

              <Link
                to={`/shop/${product._id}`}
                className="inline-flex w-fit items-center justify-center bg-white text-[#0E161B] px-7 py-4 text-sm md:text-base font-semibold shadow-sm hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
              >
                {lang === "ar" ? "تسوّق الآن" : "Shop Now"}
              </Link>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
};

/* ====== Default Layout ====== */
const DefaultLayout = ({ product, flip, lang }) => {
  const imageOrder = `order-1 ${flip ? 'md:order-2' : 'md:order-1'}`;
  const textOrder  = `order-2 ${flip ? 'md:order-1' : 'md:order-2'}`;
  const gridCols = flip ? 'md:grid-cols-[1fr_496px]' : 'md:grid-cols-[496px_1fr]';

  return (
    <section className="py-10 md:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <article className="relative overflow-hidden bg-white shadow-sm ring-black/5">
          <div className={`grid grid-cols-1 ${gridCols} gap-8 md:gap-16 items-center`}>
            <div className={imageOrder}>
              <Link to={`/shop/${product._id}`} className="block">
                <div className="w-full aspect-[4/5] overflow-hidden md:w-[496px] md:h-[618px] md:aspect-auto">
                  <img
                    src={product.image?.[0] || 'https://via.placeholder.com/900x1200'}
                    alt={product?.name || ''}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = 'https://via.placeholder.com/900x1200';
                    }}
                  />
                </div>
              </Link>
            </div>

            <div className={`${textOrder} flex flex-col items-start text-left md:pl-6 lg:pl-10`} dir="ltr">
              {product?.name && (
                <h3 className="uppercase text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight tracking-wide text-gray-900 mb-6">
                  {product.name}
                </h3>
              )}

              {product?.description && (
                <p className="text-gray-600 text-base md:text-lg leading-8 whitespace-pre-line mb-8 max-w-[620px]">
                  {product.description}
                </p>
              )}

              <Link
                to={`/shop/${product._id}`}
                className="inline-flex items-center justify-center bg-[#9B2D1F] px-7 py-4 text-white text-sm md:text-base font-semibold shadow-sm hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#9B2D1F]"
              >
                {lang === "ar" ? "تسوّق الآن" : "Shop Now"}
              </Link>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
};

/* ====== Main Component (with onLoadingChange) ====== */
const TrendingProducts = ({ slot = 1, flip = false, onLoadingChange }) => {
  const lang = useSelector((s) => s.locale?.lang || "en");

  const {
    data: { products = [] } = {},
    error,
    isLoading,   // أول تحميل
    isFetching,  // يشمل أي refetch لاحق أيضاً
  } = useFetchAllProductsQuery({ homeIndex: slot, page: 1, limit: 1, lang });

  // إشعار الصفحة الرئيسية بحالة التحميل (آمن ضد التكرار)
  const loadingFlagRef = React.useRef(false);

  React.useEffect(() => {
    if (isFetching && !loadingFlagRef.current) {
      loadingFlagRef.current = true;
      onLoadingChange?.(true);
    }
    if (!isFetching && loadingFlagRef.current) {
      loadingFlagRef.current = false;
      onLoadingChange?.(false);
    }
  }, [isFetching, onLoadingChange]);

  // تنظيف عند إلغاء التركيب (unmount) في حال بقيت حالة التحميل مرفوعة
  React.useEffect(() => {
    return () => {
      if (loadingFlagRef.current) {
        onLoadingChange?.(false);
        loadingFlagRef.current = false;
      }
    };
  }, [onLoadingChange]);

  // Placeholder بسيط أثناء التحميل (حتى لا يقفز ال layout) — الـOverlay العام سيغطي الشاشة
  if (isFetching || isLoading) {
    return <div className="py-12 text-center text-gray-500 min-h-[200px]">{lang === "ar" ? "جاري التحميل…" : "Loading…"}</div>;
  }

  if (error) {
    return <div className="text-center py-12 text-red-500">{lang === "ar" ? "حدث خطأ أثناء جلب البيانات." : "Failed to load data."}</div>;
  }

  const product = products[0];
  if (!product) return null;

  if (slot === 4) return <FourthLayout product={product} lang={lang} />;
  if (slot === 5) return <FifthLayout product={product} lang={lang} />;
  if (slot === 6) return <SixthLayout product={product} lang={lang} />;

  return <DefaultLayout product={product} flip={flip} lang={lang} />;
};

export default TrendingProducts;