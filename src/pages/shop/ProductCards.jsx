// src/pages/shop/ProductCards.jsx
import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { LangContext } from "../../LangContext";

const ProductCards = ({ products }) => {
  const navigate = useNavigate();
  const [clicked, setClicked] = useState({});
  const { country } = useSelector((state) => state.cart);
  const lang = useContext(LangContext);

  const tField = (obj, base) => {
    if (!obj) return "";
    if (lang === "ar") return obj[`${base}_ar`] ?? obj[base] ?? "";
    return obj[`${base}_en`] ?? obj[base] ?? "";
  };

  const currency = country === "الإمارات" ? "AED" : "OMR";
  const rate = country === "الإمارات" ? 9.5 : 1;

  const priceFor = (p) => {
    if (!p) return 0;
    if (typeof p.price === "object" && p.price !== null) {
      return (p.price["500 جرام"] || 0) * rate;
    }
    return (p.regularPrice || p.price || 0) * rate;
  };

  const handleGoToProduct = (id) => {
    setClicked((s) => ({ ...s, [id]: true }));
    setTimeout(() => {
      navigate(`/shop/${id}`);
    }, 200);
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((p) => {
        const price = priceFor(p);
        const rawOld = p?.oldPrice ? p.oldPrice * rate : null;
        const hasDiscount = Number.isFinite(rawOld) && rawOld > price;
        const outOfStock =
          p?.stock === 0 || p?.inStock === false || p?.available === false;

        const name = tField(p, "name");
        const category = tField(p, "category");

        return (
          <div
            key={p._id}
            className="relative flex h-full flex-col overflow-hidden rounded-md bg-white"
          >
            {outOfStock && (
              <div className="absolute left-5 top-3 z-10 rounded-md bg-white px-3 py-1 text-xs font-semibold shadow-sm">
                {lang === "ar" ? "غير متوفر" : "Sold out"}
              </div>
            )}

            <Link to={`/shop/${p._id}`} className="block">
              <div className="w-full h-72 flex items-center justify-center bg-white">
                <img
                  src={p.image?.[0] || "https://via.placeholder.com/600"}
                  alt={name}
                  className="max-h-full max-w-full object-contain"
                />
              </div>
            </Link>

            <div className="flex flex-1 flex-col px-3 pb-4">
              <h4 className="mt-2 text-center text-[13px] font-semibold uppercase">
                {name}
              </h4>

              <p className="mt-1 text-center text-[11px] text-gray-500 uppercase">
                {category}
              </p>

              <div className="mt-2 text-center">
                <div className="text-[18px] font-semibold">
                  {price.toFixed(2)} {currency}
                </div>
                {hasDiscount && (
                  <div className="text-xs line-through text-gray-500">
                    {rawOld.toFixed(2)} {currency}
                  </div>
                )}
              </div>

              {outOfStock ? (
                <button
                  disabled
                  className="mt-3 w-full rounded-md border-2 border-gray-300 px-4 py-3 text-sm text-gray-500 cursor-not-allowed"
                >
                  {lang === "ar" ? "غير متوفر" : "Sold out"}
                </button>
              ) : (
                <button
                  onClick={() => handleGoToProduct(p._id)}
                  className="mt-3 w-full rounded-md border-2 border-gray-900 px-4 py-3 text-sm font-medium text-gray-900 hover:bg-gray-900 hover:text-white transition"
                >
                  {lang === "ar"
                    ? "اختر الحجم"
                    : "Select size"}
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProductCards;
