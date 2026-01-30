// src/pages/shop/ShopPage.jsx
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

import ProductCards from "./ProductCards";
import ShopFiltering from "./ShopFiltering";
import { useFetchAllProductsQuery } from "../../redux/features/products/productsApi";

const filters = {
  categories: [
    "All",
    "Men’s Washes",
    "Women’s Washes",
    "Liquid Bath Soap",
    "Deodorant",
    "Body Wet Wipes",
    "Body Powder",
    "Body Moisturizer",
  ],
};

const ShopPage = () => {
  const lang = useSelector((s) => s.locale.lang || "en");
  const location = useLocation();

  const [filtersState, setFiltersState] = useState({ category: "All" });
  const [currentPage, setCurrentPage] = useState(1);
  const [ProductsPerPage] = useState(12);
  const [showFilters, setShowFilters] = useState(false);

  const { category } = filtersState;

  // ✅ ربط الفلاتر مع الـ URL: /shop?category=Men’s%20Washes
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const urlCategory = params.get("category");

    if (urlCategory && filters.categories.includes(urlCategory)) {
      setFiltersState({ category: urlCategory });
    }
  }, [location.search]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filtersState]);

  const {
    data: { products = [], totalPages = 1, totalProducts = 0 } = {},
    error,
    isLoading,
  } = useFetchAllProductsQuery({
    category: category !== "All" ? category : undefined,
    page: currentPage,
    limit: ProductsPerPage,
    lang,
  });

  const clearFilters = () => setFiltersState({ category: "All" });

  const handlePageChange = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) setCurrentPage(pageNumber);
  };

  if (isLoading)
    return (
      <div className="text-center py-12">
        {lang === "ar" ? "جاري تحميل المنتجات..." : "Loading products…"}
      </div>
    );

  if (error)
    return (
      <div className="text-center py-12 text-red-500">
        {lang === "ar" ? "فشل في جلب المنتجات." : "Failed to load products."}
      </div>
    );

  const startProduct = (currentPage - 1) * ProductsPerPage + 1;
  const endProduct = Math.min(startProduct + ProductsPerPage - 1, totalProducts);

  return (
    <section className="py-8 pt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Top toolbar (mobile toggle + count) */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => setShowFilters((s) => !s)}
            className="md:hidden inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm"
            aria-label="Toggle filters"
          >
            <i className="ri-equalizer-line text-lg" />
            {lang === "ar" ? "الفلاتر" : "Filters"}
          </button>

          <div className="text-sm text-gray-700">
            {lang === "ar" ? "عدد المنتجات" : "Products"}{" "}
            <span className="font-medium">{totalProducts}</span>{" "}
            {lang === "ar" ? "عنصر" : "items"}
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:gap-10 gap-6">
          {/* Left: Filters */}
          <aside className="md:w-64 lg:w-72 shrink-0">
            <div className={`${showFilters ? "block" : "hidden"} md:block`}>
              <div className="rounded-lg border bg-white p-4">
                <ShopFiltering
                  filters={filters}
                  filtersState={filtersState}
                  setFiltersState={setFiltersState}
                  clearFilters={clearFilters}
                />
              </div>
            </div>
          </aside>

          {/* Right: Product grid */}
          <main className="flex-1">
            {/* Results header (desktop) */}
            <div className="hidden md:flex items-center justify-between mb-4">
              <h3 className="text-sm text-gray-600">
                {lang === "ar" ? "إظهار" : "Showing"}{" "}
                <span className="font-medium">
                  {totalProducts === 0 ? 0 : startProduct}-{endProduct}
                </span>{" "}
                {lang === "ar" ? "من" : "of"}{" "}
                <span className="font-medium">{totalProducts}</span>{" "}
                {lang === "ar" ? "منتج" : "products"}
              </h3>
            </div>

            {products.length > 0 ? (
              <>
                <ProductCards products={products} />

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-sm text-gray-600">
                      {lang === "ar" ? "الصفحة" : "Page"} {currentPage}{" "}
                      {lang === "ar" ? "من" : "of"} {totalPages}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`px-4 py-2 rounded-md border ${
                          currentPage === 1
                            ? "text-gray-400 border-gray-200 cursor-not-allowed"
                            : "hover:bg-gray-50"
                        }`}
                      >
                        {lang === "ar" ? "السابق" : "Previous"}
                      </button>

                      <div className="flex gap-1">
                        {[...Array(totalPages)].map((_, i) => (
                          <button
                            key={i}
                            onClick={() => handlePageChange(i + 1)}
                            className={`w-10 h-10 rounded-md border text-sm ${
                              currentPage === i + 1
                                ? "bg-black text-white border-black"
                                : "border-gray-200 hover:bg-gray-50"
                            }`}
                          >
                            {i + 1}
                          </button>
                        ))}
                      </div>

                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`px-4 py-2 rounded-md border ${
                          currentPage === totalPages
                            ? "text-gray-400 border-gray-200 cursor-not-allowed"
                            : "hover:bg-gray-50"
                        }`}
                      >
                        {lang === "ar" ? "التالي" : "Next"}
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="rounded-lg border bg-white p-10 text-center">
                <p className="text-gray-600">
                  {lang === "ar"
                    ? "لا توجد منتجات مطابقة للفلاتر المحددة."
                    : "No products match the selected filters."}
                </p>
                <button
                  onClick={clearFilters}
                  className="mt-4 inline-flex rounded-md bg-black px-4 py-2 text-white hover:opacity-90"
                >
                  {lang === "ar" ? "عرض كل المنتجات" : "Show all products"}
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </section>
  );
};

export default ShopPage;
