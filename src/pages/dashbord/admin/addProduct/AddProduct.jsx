// src/pages/dashbord/admin/addProduct/AddProduct.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import TextInput from './TextInput';
import SelectInput from './SelectInput';
import UploadImage from './UploadImage';
import { useAddProductMutation } from '../../../../redux/features/products/productsApi';
import { useNavigate } from 'react-router-dom';

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

const AddProduct = () => {
  const { user } = useSelector((state) => state.auth);

  const [product, setProduct] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    oldPrice: '',
    homeIndex: '',

    name_en: '',
    name_ar: '',
    description_en: '',
    description_ar: '',
  });

  const [image, setImage] = useState([]);
  const [showVariantSection, setShowVariantSection] = useState(false);

  // ✅ variants state: { size, enabled, price, oldPrice }
  const [variantsUI, setVariantsUI] = useState([]);

  const [addProduct, { isLoading }] = useAddProductMutation();
  const navigate = useNavigate();

  const sizeOptions = useMemo(() => {
    const opts = sizeOptionsByCategory[product.category] || [];
    return opts.filter((o) => o.value); // remove empty option
  }, [product.category]);

  useEffect(() => {
    const hasSizes = Boolean(sizeOptionsByCategory[product.category]);
    setShowVariantSection(hasSizes);

    if (hasSizes) {
      // Initialize variants UI from category sizes
      setVariantsUI((prev) => {
        const mapPrev = new Map((prev || []).map((v) => [v.size, v]));
        return sizeOptions.map((opt) => {
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
  }, [product.category, sizeOptions]);

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
      'الصور': image.length > 0,
    };

    const missing = Object.entries(requiredFields)
      .filter(([_, v]) => !v)
      .map(([k]) => k);

    if (missing.length > 0) {
      alert(`الرجاء ملء الحقول التالية: ${missing.join('، ')}`);
      return;
    }

    // ✅ Build variants payload if category has sizes
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
      const payload = {
        name: baseName,
        description: baseDesc,
        category: product.category,

        // إذا في Variants: الباكند سيحدد price تلقائياً (لكن نرسل أيضاً price كاحتياط)
        price: showVariantSection ? Number(variantsPayload[0]?.price || 0) : Number(product.price),
        oldPrice: showVariantSection ? undefined : (product.oldPrice ? Number(product.oldPrice) : undefined),

        variants: showVariantSection ? variantsPayload : [],

        image,
        author: user?._id,

        name_en: product.name_en || baseName,
        name_ar: product.name_ar,
        description_en: product.description_en || baseDesc,
        description_ar: product.description_ar,
      };

      if (product.homeIndex !== '') {
        payload.homeIndex = Number(product.homeIndex);
      }

      await addProduct(payload).unwrap();

      alert('تمت إضافة المنتج بنجاح');
      setProduct({
        name: '',
        description: '',
        category: '',
        price: '',
        oldPrice: '',
        homeIndex: '',
        name_en: '',
        name_ar: '',
        description_en: '',
        description_ar: '',
      });
      setImage([]);
      setVariantsUI([]);
      navigate('/shop');
    } catch (err) {
      console.error('Failed to submit product', err);
      alert('حدث خطأ أثناء إضافة المنتج');
    }
  };

  return (
    <div className="container mx-auto mt-8" dir="rtl">
      <h2 className="text-2xl font-bold mb-6">إضافة منتج جديد</h2>

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

        {/* ✅ Variants (Sizes with different prices) */}
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

        <UploadImage name="image" id="image" uploaded={image} setImage={setImage} />

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

        <div>
          <button type="submit" className="add-product-btn" disabled={isLoading}>
            {isLoading ? 'جاري الإضافة...' : 'أضف منتج'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
