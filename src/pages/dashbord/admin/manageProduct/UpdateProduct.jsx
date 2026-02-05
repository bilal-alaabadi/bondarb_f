import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import TextInput from '../addProduct/TextInput';
import SelectInput from '../addProduct/SelectInput';
import UpdateImag from '../manageProduct/UpdateImag';

import productsApi, {
  useFetchProductByIdQuery,
  useUpdateProductMutation,
} from '../../../../redux/features/products/productsApi';

// ========================= Sizes by Category (SAME LOGIC AS ADD) =========================
const sizeOptionsByCategory = {
  "Men’s Washes": ["130 ml", "35 ml", "500 ml", "10 ml"],
  "Women’s Washes": ["130 ml", "35 ml"],
  "Liquid Bath Soap": ["500 ml"],
};

const UpdateProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const lang = useSelector((s) => s.locale.lang);
  const isRTL = lang === 'ar';
  const { user } = useSelector((s) => s.auth);

  // ========================= UI Options =========================
  const categories =
    lang === 'ar'
      ? [
          { label: 'اختر تصنيف', value: '' },
          { label: 'Men’s Washes', value: 'Men’s Washes' },
          { label: 'Women’s Washes', value: 'Women’s Washes' },
          { label: 'Liquid Bath Soap', value: 'Liquid Bath Soap' },
          { label: 'Deodorant', value: 'Deodorant' },
          { label: 'Body Wet Wipes', value: 'Body Wet Wipes' },
          { label: 'Body Powder', value: 'Body Powder' },
          { label: 'Body Moisturizer', value: 'Body Moisturizer' },
        ]
      : [
          { label: 'Choose category', value: '' },
          { label: 'Men’s Washes', value: 'Men’s Washes' },
          { label: 'Women’s Washes', value: 'Women’s Washes' },
          { label: 'Liquid Bath Soap', value: 'Liquid Bath Soap' },
          { label: 'Deodorant', value: 'Deodorant' },
          { label: 'Body Wet Wipes', value: 'Body Wet Wipes' },
          { label: 'Body Powder', value: 'Body Powder' },
          { label: 'Body Moisturizer', value: 'Body Moisturizer' },
        ];

  const homeIndexOptions =
    lang === 'ar'
      ? [
          { label: 'بدون موضع في الرئيسية', value: '' },
          { label: '1', value: '1' },
          { label: '2', value: '2' },
          { label: '3', value: '3' },
          { label: '4', value: '4' },
          { label: '5', value: '5' },
          { label: '6', value: '6' },
        ]
      : [
          { label: 'No home position', value: '' },
          { label: '1', value: '1' },
          { label: '2', value: '2' },
          { label: '3', value: '3' },
          { label: '4', value: '4' },
          { label: '5', value: '5' },
          { label: '6', value: '6' },
        ];

  // ========================= Fetch Product =========================
  const {
    data: productData,
    isLoading: isFetching,
    error: fetchError,
    refetch,
  } = useFetchProductByIdQuery({ id, lang: 'raw' });

  const [updateProduct, { isLoading: isUpdating }] =
    useUpdateProductMutation();

  // ========================= State =========================
  const [product, setProduct] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    oldPrice: '',
    homeIndex: '',
    inStock: true,
    image: [],
    name_en: '',
    name_ar: '',
    description_en: '',
    description_ar: '',
  });

  const [newImages, setNewImages] = useState([]);
  const [keepImages, setKeepImages] = useState([]);
  const [showVariantSection, setShowVariantSection] = useState(false);
  const [variantsUI, setVariantsUI] = useState([]);

  // ========================= Hydrate Form + FIX VARIANTS =========================
  useEffect(() => {
    if (!productData) return;

    const p = productData.product || productData;
    const imgs = Array.isArray(p.image) ? p.image : p.image ? [p.image] : [];

    setProduct({
      name: p.name || '',
      description: p.description || '',
      category: p.category || '',
      price: p.price != null ? String(p.price) : '',
      oldPrice: p.oldPrice != null ? String(p.oldPrice) : '',
      homeIndex: p.homeIndex != null ? String(p.homeIndex) : '',
      inStock: typeof p.inStock === 'boolean' ? p.inStock : true,
      image: imgs,
      name_en: p.name_en || '',
      name_ar: p.name_ar || '',
      description_en: p.description_en || '',
      description_ar: p.description_ar || '',
    });

    setKeepImages(imgs);

    const dbVariants = Array.isArray(p.variants) ? p.variants : [];
    const availableSizes = sizeOptionsByCategory[p.category] || [];

    setShowVariantSection(availableSizes.length > 0);

    setVariantsUI(
      availableSizes.map((size) => {
        const existing = dbVariants.find((v) => v.size === size);
        return {
          size,
          enabled: !!existing,
          price: existing ? String(existing.price) : '',
          oldPrice: existing && existing.oldPrice ? String(existing.oldPrice) : '',
        };
      })
    );
  }, [productData]);

  // ========================= Handlers =========================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const toggleVariant = (size) => {
    setVariantsUI((prev) =>
      prev.map((v) =>
        v.size === size ? { ...v, enabled: !v.enabled } : v
      )
    );
  };

  const setVariantField = (size, field, value) => {
    setVariantsUI((prev) =>
      prev.map((v) =>
        v.size === size ? { ...v, [field]: value } : v
      )
    );
  };

  // ========================= Submit =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    const baseName = product.name || product.name_en;
    const baseDesc = product.description || product.description_en;

    const variantsPayload = variantsUI
      .filter((v) => v.enabled)
      .map((v) => ({
        size: v.size,
        price: Number(v.price),
        oldPrice: v.oldPrice ? Number(v.oldPrice) : 0,
      }))
      .filter((v) => v.size && Number.isFinite(v.price) && v.price > 0);

    const formData = new FormData();

    formData.append('name', baseName);
    formData.append('description', baseDesc);
    formData.append('category', product.category);
    formData.append(
      'price',
      variantsPayload.length ? String(variantsPayload[0].price) : String(product.price)
    );
    formData.append('oldPrice', product.oldPrice || '');
    formData.append('author', user?._id || '');
    formData.append('inStock', String(product.inStock));
    formData.append('homeIndex', product.homeIndex);

    formData.append('variants', JSON.stringify(variantsPayload));

    formData.append('name_en', product.name_en || baseName);
    formData.append('name_ar', product.name_ar);
    formData.append('description_en', product.description_en || baseDesc);
    formData.append('description_ar', product.description_ar);

    formData.append('keepImages', JSON.stringify(keepImages));
    newImages.forEach((file) => formData.append('image', file));

    await updateProduct({ id, body: formData }).unwrap();

    dispatch(
      productsApi.util.invalidateTags([{ type: 'Product', id }, 'ProductList'])
    );

    alert(lang === 'ar' ? 'تم تحديث المنتج بنجاح' : 'Product updated successfully');
    navigate('/dashboard/manage-products');
  };

  // ========================= UI states =========================
  if (isFetching) {
    return (
      <div className="text-center py-8">
        {lang === 'ar' ? 'جاري تحميل بيانات المنتج...' : 'Loading product data...'}
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="text-center py-8 text-red-500">
        <div className="mb-3">
          {lang === 'ar' ? 'خطأ في تحميل بيانات المنتج' : 'Error loading product data'}
        </div>
        <button
          type="button"
          className="rounded border px-4 py-2 text-sm hover:bg-gray-50"
          onClick={() => refetch()}
        >
          {lang === 'ar' ? 'إعادة المحاولة' : 'Retry'}
        </button>
      </div>
    );
  }

  // ========================= Render =========================
  return (
    <div className="container mx-auto mt-8 px-4" dir={isRTL ? 'rtl' : 'ltr'}>
      <h2 className="text-2xl font-bold mb-6">
        {lang === 'ar' ? 'تحديث المنتج' : 'Update Product'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* ===== Names ===== */}
        <TextInput
          label={lang === 'ar' ? 'اسم المنتج (EN)' : 'Product Name (EN)'}
          name="name_en"
          placeholder={lang === 'ar' ? 'Example: Product name' : 'Example: Product name'}
          value={product.name_en}
          onChange={handleChange}
        />

        <TextInput
          label={lang === 'ar' ? 'اسم المنتج (AR)' : 'Product Name (AR)'}
          name="name_ar"
          placeholder={lang === 'ar' ? 'مثال: اسم المنتج' : 'Example: Arabic name'}
          value={product.name_ar}
          onChange={handleChange}
        />

        {/* ===== Category + Home Position ===== */}
        <SelectInput
          label={lang === 'ar' ? 'تصنيف المنتج' : 'Product Category'}
          name="category"
          value={product.category}
          onChange={handleChange}
          options={categories}
        />

        <SelectInput
          label={lang === 'ar' ? 'موضع الصفحة الرئيسية (1–6)' : 'Home Page Position (1–6)'}
          name="homeIndex"
          value={product.homeIndex}
          onChange={handleChange}
          options={homeIndexOptions}
        />

        {/* ===== Variants OR Normal Price ===== */}
        {showVariantSection ? (
          <div className="border rounded-lg p-4 bg-gray-50">
            <h3 className="font-bold mb-3">
              {lang === 'ar' ? 'الأحجام المتوفرة (ml) وأسعارها' : 'Available Sizes (ml) & Prices'}
            </h3>

            <div className="space-y-3">
              {variantsUI.map((v) => (
                <div key={v.size} className="bg-white border rounded-md p-3">
                  <div className="flex items-center justify-between gap-3">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={!!v.enabled}
                        onChange={() => toggleVariant(v.size)}
                      />
                      <span className="font-semibold">{v.size}</span>
                    </label>
                  </div>

                  {v.enabled && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                      <div>
                        <label className="block text-sm text-gray-700 mb-1">
                          {lang === 'ar' ? 'السعر' : 'Price'}
                        </label>
                        <input
                          type="number"
                          step="0.001"
                          className="w-full p-2 border rounded-md"
                          value={v.price}
                          onChange={(e) => setVariantField(v.size, 'price', e.target.value)}
                          placeholder={lang === 'ar' ? 'مثال: 5.500' : 'Example: 5.500'}
                        />
                      </div>

                      <div>
                        <label className="block text-sm text-gray-700 mb-1">
                          {lang === 'ar' ? 'السعر القديم (اختياري)' : 'Old Price (optional)'}
                        </label>
                        <input
                          type="number"
                          step="0.001"
                          className="w-full p-2 border rounded-md"
                          value={v.oldPrice}
                          onChange={(e) => setVariantField(v.size, 'oldPrice', e.target.value)}
                          placeholder={lang === 'ar' ? 'مثال: 7.500' : 'Example: 7.500'}
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <>
            <TextInput
              label={lang === 'ar' ? 'السعر القديم (اختياري)' : 'Old Price (optional)'}
              name="oldPrice"
              type="number"
              placeholder={lang === 'ar' ? 'مثال: 7.500' : 'Example: 7.500'}
              value={product.oldPrice}
              onChange={handleChange}
            />

            <TextInput
              label={lang === 'ar' ? 'السعر' : 'Price'}
              name="price"
              type="number"
              placeholder={lang === 'ar' ? 'مثال: 5.500' : 'Example: 5.500'}
              value={product.price}
              onChange={handleChange}
            />
          </>
        )}

        {/* ===== Images ===== */}
        <UpdateImag
          name="image"
          id="image"
          initialImages={product.image}
          setImages={setNewImages}
          setKeepImages={setKeepImages}
        />

        {/* ===== Description EN ===== */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            {lang === 'ar' ? 'وصف المنتج (EN)' : 'Product Description (EN)'}
          </label>
          <textarea
            name="description_en"
            className="add-product-InputCSS"
            rows={4}
            value={product.description_en}
            placeholder={lang === 'ar' ? 'Ingredients / scent / how to use…' : 'Ingredients / scent / how to use…'}
            onChange={handleChange}
          />
        </div>

        {/* ===== Description AR ===== */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            {lang === 'ar' ? 'وصف المنتج (AR)' : 'Product Description (AR)'}
          </label>
          <textarea
            name="description_ar"
            className="add-product-InputCSS"
            rows={4}
            value={product.description_ar}
            placeholder={lang === 'ar' ? 'المكونات / الرائحة / طريقة الاستخدام…' : 'Arabic description…'}
            onChange={handleChange}
          />
        </div>

        {/* ===== Availability ===== */}
        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="availability"
              checked={product.inStock === true}
              onChange={() => setProduct((prev) => ({ ...prev, inStock: true }))}
            />
            <span>{lang === 'ar' ? 'المنتج متوفر' : 'In Stock'}</span>
          </label>

          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="availability"
              checked={product.inStock === false}
              onChange={() => setProduct((prev) => ({ ...prev, inStock: false }))}
            />
            <span>{lang === 'ar' ? 'انتهى المنتج' : 'Out of Stock'}</span>
          </label>
        </div>

        {/* ===== Submit ===== */}
        <div className="flex justify-end pt-4">
          <button type="submit" className="add-product-btn" disabled={isUpdating}>
            {isUpdating
              ? lang === 'ar'
                ? 'جاري التحديث...'
                : 'Updating...'
              : lang === 'ar'
              ? 'حفظ التغييرات'
              : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateProduct;
