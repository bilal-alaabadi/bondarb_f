import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from "react-redux";
import { useFetchAllProductsQuery } from '../../redux/features/products/productsApi';

const FeaturedProducts = ({ onLoadingChange }) => {
  const lang = useSelector((s) => s.locale?.lang || "en");
  const {
    data: { products = [] } = {},
    error,
    isLoading,
    isFetching,
  } = useFetchAllProductsQuery({ page: 1, limit: 4, lang });

  // إدارة حالة التحميل
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

  React.useEffect(() => {
    return () => {
      if (loadingFlagRef.current) {
        onLoadingChange?.(false);
        loadingFlagRef.current = false;
      }
    };
  }, [onLoadingChange]);

  // أثناء التحميل
  if (isFetching || isLoading) {
    return <div className="py-12 text-center text-gray-500 min-h-[200px]">{lang === "ar" ? "جاري التحميل…" : "Loading…"}</div>;
  }

  if (error) {
    return <div className="text-center py-12 text-red-500">{lang === "ar" ? "حدث خطأ أثناء جلب البيانات." : "Failed to load data."}</div>;
  }

  if (products.length === 0) return null;

  return (
    <section className="py-10 md:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 text-gray-900">
          {lang === "ar" ? "منتجات مميزة" : "Featured Products"}
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {products.map((product) => (
            <div key={product._id} className="group relative bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              <Link to={`/shop/${product._id}`} className="block">
                <div className="aspect-square overflow-hidden">
                  <img
                    src={product.image?.[0] || 'https://via.placeholder.com/400x400'}
                    alt={product?.name || ''}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.currentTarget.src = 'https://via.placeholder.com/400x400';
                    }}
                  />
                </div>
                
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {product.description?.substring(0, 80)}...
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-[#0E161B] font-bold">
                      {lang === "ar" ? `${product.price} ر.ع` : `OMR ${product.price}`}
                    </span>
                    {product.oldPrice && product.oldPrice > product.price && (
                      <span className="text-sm text-gray-500 line-through">
                        {lang === "ar" ? `${product.oldPrice} ر.ع` : `OMR ${product.oldPrice}`}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-10">
          <Link
            to="/shop"
            className="inline-flex items-center justify-center bg-[#0E161B] text-white px-8 py-3 text-sm font-semibold rounded-md hover:bg-gray-900 transition-colors"
          >
            {lang === "ar" ? "عرض جميع المنتجات" : "View All Products"}
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;