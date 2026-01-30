// ========================= UpdateProduct.jsx (Final - Same as AddProduct) =========================
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  useFetchProductByIdQuery,
  useUpdateProductMutation,
} from '../../../../redux/features/products/productsApi';
import { useSelector, useDispatch } from 'react-redux';
import TextInput from '../addProduct/TextInput';
import SelectInput from '../addProduct/SelectInput';
import UpdateImag from '../manageProduct/UpdateImag';
import productsApi from '../../../../redux/features/products/productsApi'; // ✅

const categories = [
  { label: 'اختر تصنيف', value: '' },
  { label: 'Men’s Washes', value: 'Men’s Washes' },
  { label: 'Women’s Washes', value: 'Women’s Washes' },
  { label: 'Liquid Bath Soap', value: 'Liquid Bath Soap' },
  { label: 'Deodorant', value: 'Deodorant' },
  { label: 'Body Wet Wipes', value: 'Body Wet Wipes' },
  { label: 'Body Powder', value: 'Body Powder' },
  { label: 'Body Moisturizer', value: 'Body Moisturizer' },
];

const sizeOptionsByCategory = {
  'Men’s Washes': [
    { label: 'Choose size', value: '' },
    { label: '130 ml', value: '130 ml' },
    { label: '45 ml', value: '45 ml' },
    { label: '10 ml (Box / All Scents)', value: '10 ml' },
  ],
  'Women’s Washes': [
    { label: 'Choose size', value: '' },
    { label: '130 ml', value: '130 ml' },
    { label: '45 ml', value: '45 ml' },
  ],
  'Liquid Bath Soap': [
    { label: 'Choose size', value: '' },
    { label: '500 ml', value: '500 ml' },
  ],
};

const homeIndexOptions = [
  { label: 'بدون موضع في الرئيسية', value: '' },
  { label: '1', value: '1' },
  { label: '2', value: '2' },
  { label: '3', value: '3' },
  { label: '4', value: '4' },
  { label: '5', value: '5' },
  { label: '6', value: '6' },
];

// ✅ نفس الصفحة: فقط ضمان ظهور الأحجام من قاعدة البيانات حتى لو ما كانت ضمن sizeOptionsByCategory
const getSizeOptions = (category, dbVariants = [], currentUI = []) => {
  const predefined = sizeOptionsByCategory[category];
  if (predefined) return predefined.filter((o) => o.value);

  const fromDb = Array.isArray(dbVariants) ? dbVariants : [];
  const sizes = fromDb
    .map((v) => String(v?.size || '').trim())
    .filter(Boolean);

  const uniq = Array.from(new Set(sizes));
  if (uniq.length > 0) return uniq.map((s) => ({ label: s, value: s }));

  const fromUI = Array.isArray(currentUI) ? currentUI : [];
  const uiSizes = fromUI.map((v) => String(v?.size || '').trim()).filter(Boolean);
  const uniqUI = Array.from(new Set(uiSizes));
  return uniqUI.map((s) => ({ label: s, value: s }));
};

const UpdateProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch(); // ✅
  const { user } = useSelector((state) => state.auth);

  const {
    data: productData,
    isLoading: isFetching,
    error: fetchError,
    refetch,
  } = useFetchProductByIdQuery(
    { id, lang: 'raw' },
    {
      refetchOnMountOrArgChange: true,
      refetchOnFocus: true,
      refetchOnReconnect: true,
    }
  );

  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

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

  const [newImages, setNewImages] = useState([]); // Files[]
  const [keepImages, setKeepImages] = useState([]); // string[]

  const [showVariantSection, setShowVariantSection] = useState(false);
  const [variantsUI, setVariantsUI] = useState([]); // { size, enabled, price, oldPrice }

  const sizeOptions = useMemo(() => {
    return getSizeOptions(product.category, [], variantsUI);
  }, [product.category, variantsUI]);

  useEffect(() => {
    if (!productData) return;
    const p = productData.product ? productData.product : productData;

    const currentImages = Array.isArray(p?.image) ? p.image : p?.image ? [p.image] : [];
    const dbVariants = Array.isArray(p?.variants) ? p.variants : [];

    setProduct({
      name: p?.name || '',
      description: p?.description || '',
      category: p?.category || '',
      price: p?.price != null ? String(p.price) : '',
      oldPrice: p?.oldPrice != null ? String(p.oldPrice) : '',
      homeIndex: p?.homeIndex != null && p?.homeIndex !== '' ? String(p.homeIndex) : '',
      inStock: typeof p?.inStock === 'boolean' ? p.inStock : true,
      image: currentImages,

      name_en: p?.name_en || '',
      name_ar: p?.name_ar || '',
      description_en: p?.description_en || '',
      description_ar: p?.description_ar || '',
    });

    setKeepImages(currentImages);

    // ✅ هنا الإصلاح: حتى لو التصنيف مو موجود في sizeOptionsByCategory، نطلع الأحجام من dbVariants
    const opts = getSizeOptions(p?.category, dbVariants, []);
    const hasSizes = opts.length > 0;
    setShowVariantSection(hasSizes);

    if (hasSizes) {
      const mapDb = new Map(
        dbVariants.map((v) => [String(v?.size || '').trim(), v])
      );

      setVariantsUI(
        opts.map((opt) => {
          const found = mapDb.get(opt.value);
          return {
            size: opt.value,
            enabled: Boolean(found),
            price: found?.price != null ? String(found.price) : '',
            oldPrice: found?.oldPrice != null ? String(found.oldPrice) : '',
          };
        })
      );
    } else {
      setVariantsUI([]);
    }
  }, [productData]);

  useEffect(() => {
    const opts = getSizeOptions(product.category, [], variantsUI);
    const hasSizes = opts.length > 0;
    setShowVariantSection(hasSizes);

    if (hasSizes) {
      setVariantsUI((prev) => {
        const mapPrev = new Map((prev || []).map((v) => [v.size, v]));
        return opts.map((opt) => {
          const existing = mapPrev.get(opt.value);
          return (
            existing || {
              size: opt.value,
              enabled: false,
              price: '',
              oldPrice: '',
            }
          );
        });
      });
    } else {
      setVariantsUI([]);
    }
  }, [product.category]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const toggleVariant = (size) => {
    setVariantsUI((prev) =>
      prev.map((v) => (v.size === size ? { ...v, enabled: !v.enabled } : v))
    );
  };

  const setVariantField = (size, field, value) => {
    setVariantsUI((prev) =>
      prev.map((v) => (v.size === size ? { ...v, [field]: value } : v))
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const baseName = product.name || product.name_en;
    const baseDesc = product.description || product.description_en;

    const requiredFields = {
      'اسم المنتج (EN)': baseName,
      'اسم المنتج (AR)': product.name_ar,
      'الوصف (EN)': baseDesc,
      'الوصف (AR)': product.description_ar,
      'تصنيف المنتج': product.category,
      'الصور': (keepImages?.length || 0) + (newImages?.length || 0) > 0,
    };

    const missing = Object.entries(requiredFields)
      .filter(([_, v]) => !v)
      .map(([k]) => k);

    if (missing.length > 0) {
      alert(`الرجاء ملء الحقول التالية: ${missing.join('، ')}`);
      return;
    }

    let variantsPayload = [];
    if (showVariantSection) {
      variantsPayload = (variantsUI || [])
        .filter((v) => v.enabled)
        .map((v) => ({
          size: v.size,
          price: Number(v.price),
          oldPrice: v.oldPrice ? Number(v.oldPrice) : 0,
        }))
        .filter((v) => v.size && Number.isFinite(v.price) && v.price > 0);

      if (variantsPayload.length === 0) {
        alert('الرجاء اختيار حجم واحد على الأقل وإدخال سعر صحيح لكل حجم مختار');
        return;
      }
    } else {
      if (!product.price) {
        alert('الرجاء إدخال السعر');
        return;
      }
    }

    try {
      const formData = new FormData();

      formData.append('name', baseName);
      formData.append('description', baseDesc);
      formData.append('category', product.category);

      const priceToSend = showVariantSection
        ? String(variantsPayload[0]?.price || 0)
        : String(product.price);

      formData.append('price', priceToSend);
      formData.append('oldPrice', showVariantSection ? '' : (product.oldPrice || ''));
      formData.append('author', user?._id || '');
      formData.append('inStock', String(product.inStock));
      formData.append('homeIndex', product.homeIndex);

      if (showVariantSection) {
        formData.append('variants', JSON.stringify(variantsPayload));
      }

      formData.append('name_en', product.name_en || baseName);
      formData.append('name_ar', product.name_ar || '');
      formData.append('description_en', product.description_en || baseDesc);
      formData.append('description_ar', product.description_ar || '');

      formData.append('keepImages', JSON.stringify(keepImages || []));
      (newImages || []).forEach((file) => formData.append('image', file));

      await updateProduct({ id, body: formData }).unwrap();

      dispatch(productsApi.util.invalidateTags([{ type: 'Product', id }, 'ProductList']));

      await refetch();

      alert('تم تحديث المنتج بنجاح');
      navigate('/dashboard/manage-products');
    } catch (error) {
      const msg = error?.data?.message || error?.message || 'خطأ غير معروف';
      alert('حدث خطأ أثناء تحديث المنتج: ' + msg);
    }
  };

  if (isFetching) return <div className="text-center py-8">جاري تحميل بيانات المنتج...</div>;
  if (fetchError) return <div className="text-center py-8 text-red-500">خطأ في تحميل بيانات المنتج</div>;

  return (
    <div className="container mx-auto mt-8 px-4" dir="rtl">
      <h2 className="text-2xl font-bold mb-6 text-right">تحديث المنتج</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <TextInput
          label="اسم المنتج (EN)"
          name="name_en"
          placeholder="Example: Product name"
          value={product.name_en}
          onChange={handleChange}
        />
        <TextInput
          label="اسم المنتج (AR)"
          name="name_ar"
          placeholder="مثال: اسم المنتج"
          value={product.name_ar}
          onChange={handleChange}
        />

        <SelectInput
          label="تصنيف المنتج"
          name="category"
          value={product.category}
          onChange={handleChange}
          options={categories}
        />

        <SelectInput
          label="موضع الصفحة الرئيسية (1–6)"
          name="homeIndex"
          value={product.homeIndex}
          onChange={handleChange}
          options={homeIndexOptions}
        />

        {showVariantSection ? (
          <div className="border rounded-lg p-4 bg-gray-50">
            <h3 className="font-bold mb-3">الأحجام المتوفرة (ml) وأسعارها</h3>

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
                        <label className="block text-sm text-gray-700 mb-1">السعر</label>
                        <input
                          type="number"
                          step="0.001"
                          className="w-full p-2 border rounded-md"
                          value={v.price}
                          onChange={(e) => setVariantField(v.size, 'price', e.target.value)}
                          placeholder="مثال: 5.500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-700 mb-1">السعر القديم (اختياري)</label>
                        <input
                          type="number"
                          step="0.001"
                          className="w-full p-2 border rounded-md"
                          value={v.oldPrice}
                          onChange={(e) => setVariantField(v.size, 'oldPrice', e.target.value)}
                          placeholder="مثال: 7.500"
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
              label="السعر القديم (اختياري)"
              name="oldPrice"
              type="number"
              placeholder="مثال: 7.500"
              value={product.oldPrice}
              onChange={handleChange}
            />
            <TextInput
              label="السعر"
              name="price"
              type="number"
              placeholder="مثال: 5.500"
              value={product.price}
              onChange={handleChange}
            />
          </>
        )}

        <UpdateImag
          name="image"
          id="image"
          initialImages={product.image}
          setImages={setNewImages}
          setKeepImages={setKeepImages}
        />

        <div>
          <label htmlFor="description_en" className="block text-sm font-medium text-gray-700">
            وصف المنتج (EN)
          </label>
          <textarea
            name="description_en"
            id="description_en"
            className="add-product-InputCSS"
            value={product.description_en}
            placeholder="Ingredients / scent / how to use…"
            onChange={handleChange}
            rows={4}
          />
        </div>

        <div>
          <label htmlFor="description_ar" className="block text-sm font-medium text-gray-700">
            وصف المنتج (AR)
          </label>
          <textarea
            name="description_ar"
            id="description_ar"
            className="add-product-InputCSS"
            value={product.description_ar}
            placeholder="المكونات / الرائحة / طريقة الاستخدام…"
            onChange={handleChange}
            rows={4}
          />
        </div>

        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="availability"
              value="available"
              checked={product.inStock === true}
              onChange={() => setProduct((prev) => ({ ...prev, inStock: true }))}
            />
            <span>المنتج متوفر</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="availability"
              value="ended"
              checked={product.inStock === false}
              onChange={() => setProduct((prev) => ({ ...prev, inStock: false }))}
            />
            <span>انتهى المنتج</span>
          </label>
        </div>

        <div className="flex justify-end pt-4">
          <button type="submit" className="add-product-btn" disabled={isUpdating}>
            {isUpdating ? 'جاري التحديث...' : 'حفظ التغييرات'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateProduct;
