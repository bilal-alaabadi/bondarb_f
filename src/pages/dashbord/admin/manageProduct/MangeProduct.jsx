import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  useDeleteProductMutation,
  useFetchAllProductsQuery,
} from '../../../../redux/features/products/productsApi';

const ManageProduct = () => {
  const lang = useSelector((state) => state.locale.lang);
  const isRTL = lang === 'ar';

  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(12);

  const {
    data: { products = [], totalPages = 1, totalProducts = 0 } = {},
    isLoading,
    error,
    refetch,
  } = useFetchAllProductsQuery({
    category: '',
    minPrice: '',
    maxPrice: '',
    page: currentPage,
    limit: productsPerPage,
  });

  const [deleteProduct, { isLoading: isDeleting }] =
    useDeleteProductMutation();

  const startProduct = (currentPage - 1) * productsPerPage + 1;
  const endProduct = Math.min(
    startProduct + productsPerPage - 1,
    totalProducts
  );

  const handlePageChange = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const getProductPrice = (product) => {
    if (product.regularPrice)
      return `${product.regularPrice} ${
        lang === 'ar' ? 'OMR' : 'OMR'
      }`;

    if (!product.price) return 'N/A';

    if (typeof product.price === 'object') {
      const prices = [];
      if (product.price['500 جرام'])
        prices.push(
          `${product.price['500 جرام']} ${
            lang === 'ar' ? 'OMR' : 'OMR'
          } (500g)`
        );
      if (product.price['1 كيلو'])
        prices.push(
          `${product.price['1 كيلو']} ${
            lang === 'ar' ? 'OMR' : 'OMR'
          } (1kg)`
        );
      if (product.price.default)
        prices.push(
          `${product.price.default} ${
            lang === 'ar' ? 'OMR' : 'OMR'
          }`
        );

      return prices.join(' - ') || 'N/A';
    }

    return `${product.price} ${lang === 'ar' ? 'OMR' : 'OMR'}`;
  };

  const handleDeleteProduct = async (id) => {
    const confirmDelete = window.confirm(
      lang === 'ar'
        ? 'هل أنت متأكد أنك تريد حذف هذا المنتج؟'
        : 'Are you sure you want to delete this product?'
    );
    if (!confirmDelete) return;

    try {
      await deleteProduct(id).unwrap();
      alert(
        lang === 'ar'
          ? 'تم حذف المنتج بنجاح'
          : 'Product deleted successfully'
      );

      if (products.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      } else {
        refetch();
      }
    } catch (error) {
      console.error(error);
      alert(
        lang === 'ar'
          ? 'فشل في حذف المنتج'
          : 'Failed to delete product'
      );
    }
  };

  return (
    <div className="mx-auto p-2 md:p-4 w-full" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="bg-white rounded-lg shadow-md p-3 md:p-6 w-full">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-4 md:mb-6 w-full">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 w-full md:w-auto text-center md:text-right">
            {lang === 'ar' ? 'إدارة المنتجات' : 'Manage Products'}
          </h2>

          <div className="w-full md:w-auto mt-2 md:mt-0 flex justify-center md:justify-end">
            <span className="text-xs md:text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
              {lang === 'ar'
                ? `عرض ${startProduct}-${endProduct} من ${totalProducts} منتج`
                : `Showing ${startProduct}-${endProduct} of ${totalProducts} products`}
            </span>
          </div>
        </div>

        {/* Loading / Error */}
        {isLoading ? (
          <div className="text-center py-8">
            {lang === 'ar'
              ? 'جاري تحميل المنتجات...'
              : 'Loading products...'}
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">
            {lang === 'ar'
              ? 'حدث خطأ أثناء تحميل المنتجات'
              : 'Error loading products'}
          </div>
        ) : (
          <>
            {/* Mobile */}
            <div className="md:hidden space-y-3 w-full">
              {products.map((product, index) => (
                <div
                  key={product._id}
                  className="border rounded-lg p-3 shadow-sm w-full"
                >
                  <div className="grid grid-cols-3 gap-2 items-center">
                    <div className="col-span-2">
                      <p className="font-medium text-gray-900 text-sm truncate">
                        {startProduct + index}. {product.name}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {product.category}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {getProductPrice(product)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-2 flex justify-end space-x-2">
                    <Link
                      to={`/dashboard/update-product/${product._id}`}
                      className="text-blue-600 hover:text-blue-900 text-xs px-2 py-1 border border-blue-200 rounded"
                    >
                      {lang === 'ar' ? 'تعديل' : 'Edit'}
                    </Link>
                    <button
                      onClick={() => handleDeleteProduct(product._id)}
                      disabled={isDeleting}
                      className="text-red-600 hover:text-red-900 text-xs px-2 py-1 border border-red-200 rounded"
                    >
                      {isDeleting
                        ? lang === 'ar'
                          ? 'جاري الحذف...'
                          : 'Deleting...'
                        : lang === 'ar'
                        ? 'حذف'
                        : 'Delete'}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop */}
            <div className="hidden md:block w-full overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-xs text-gray-500">#</th>
                    <th className="px-4 py-2 text-right text-xs text-gray-500">
                      {lang === 'ar' ? 'اسم المنتج' : 'Product Name'}
                    </th>
                    <th className="px-4 py-2 text-right text-xs text-gray-500">
                      {lang === 'ar' ? 'الصنف' : 'Category'}
                    </th>
                    <th className="px-4 py-2 text-right text-xs text-gray-500">
                      {lang === 'ar' ? 'السعر' : 'Price'}
                    </th>
                    <th className="px-4 py-2 text-center text-xs text-gray-500">
                      {lang === 'ar' ? 'الإجراءات' : 'Actions'}
                    </th>
                  </tr>
                </thead>

                <tbody className="bg-white divide-y divide-gray-200">
                  {products.map((product, index) => (
                    <tr key={product._id}>
                      <td className="px-4 py-3 text-xs text-center">
                        {startProduct + index}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium truncate">
                        {product.name}
                      </td>
                      <td className="px-4 py-3 text-xs">
                        {product.category}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {getProductPrice(product)}
                      </td>
                      <td className="px-4 py-3 flex justify-center space-x-2">
                        <Link
                          to={`/dashboard/update-product/${product._id}`}
                          className="text-blue-600 text-xs px-3 py-1 border rounded"
                        >
                          {lang === 'ar' ? 'تعديل' : 'Edit'}
                        </Link>
                        <button
                          onClick={() =>
                            handleDeleteProduct(product._id)
                          }
                          disabled={isDeleting}
                          className="text-red-600 text-xs px-3 py-1 border rounded"
                        >
                          {isDeleting
                            ? lang === 'ar'
                              ? 'جاري الحذف...'
                              : 'Deleting...'
                            : lang === 'ar'
                            ? 'حذف'
                            : 'Delete'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-4 flex justify-center">
                <nav className="inline-flex shadow rounded-md">
                  <button
                    onClick={() =>
                      handlePageChange(currentPage - 1)
                    }
                    disabled={currentPage === 1}
                    className="px-3 py-1 border"
                  >
                    {lang === 'ar' ? 'السابق' : 'Prev'}
                  </button>

                  {Array.from(
                    { length: totalPages },
                    (_, i) => i + 1
                  ).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-1 border ${
                        currentPage === page
                          ? 'bg-blue-500 text-white'
                          : ''
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    onClick={() =>
                      handlePageChange(currentPage + 1)
                    }
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 border"
                  >
                    {lang === 'ar' ? 'التالي' : 'Next'}
                  </button>
                </nav>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ManageProduct;
