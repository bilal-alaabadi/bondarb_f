// src/pages/dashbord/admin/addProduct/AddProduct.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import TextInput from './TextInput';
import SelectInput from './SelectInput';
import UploadImage from './UploadImage';
import { useAddProductMutation } from '../../../../redux/features/products/productsApi';
import { useNavigate } from 'react-router-dom';

const AddProduct = () => {
  const { user } = useSelector((state) => state.auth);
  const lang = useSelector((state) => state.locale.lang);
  const isRTL = lang === 'ar';

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

  const sizeOptionsByCategory = {
    'Men’s Washes': [
      { label: lang === 'ar' ? '130 مل' : '130 ml', value: '130 ml' },
      { label: lang === 'ar' ? '35 مل' : '35 ml', value: '35 ml' },
      { label: lang === 'ar' ? '500 مل' : '500 ml', value: '500 ml' },
      { label: lang === 'ar' ? '10 مل (علبة)' : '10 ml (Box)', value: '10 ml' },
    ],
    'Women’s Washes': [
      { label: lang === 'ar' ? '130 مل' : '130 ml', value: '130 ml' },
      { label: lang === 'ar' ? '35 مل' : '35 ml', value: '35 ml' },
    ],
    'Liquid Bath Soap': [{ label: lang === 'ar' ? '500 مل' : '500 ml', value: '500 ml' }],
  };

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
  const [variantsUI, setVariantsUI] = useState([]);

  const [addProduct, { isLoading }] = useAddProductMutation();
  const navigate = useNavigate();

  const sizeOptions = useMemo(() => {
    const opts = sizeOptionsByCategory[product.category] || [];
    return opts.filter((o) => o.value);
  }, [product.category]);

  useEffect(() => {
    const hasSizes = Boolean(sizeOptionsByCategory[product.category]);
    setShowVariantSection(hasSizes);

    if (hasSizes) {
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
      alert(
        lang === 'ar'
          ? `الرجاء ملء الحقول التالية: ${missing.join('، ')}`
          : `Please fill the following fields: ${missing.join(', ')}`
      );
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
        alert(
          lang === 'ar'
            ? 'الرجاء اختيار حجم واحد على الأقل وإدخال سعر صحيح لكل حجم'
            : 'Please select at least one size and enter a valid price'
        );
        return;
      }
    } else {
      if (!product.price) {
        alert(lang === 'ar' ? 'الرجاء إدخال السعر' : 'Please enter price');
        return;
      }
    }

    try {
      const payload = {
        name: baseName,
        description: baseDesc,
        category: product.category,
        price: showVariantSection
          ? Number(variantsPayload[0]?.price || 0)
          : Number(product.price),
        oldPrice: showVariantSection
          ? undefined
          : product.oldPrice
          ? Number(product.oldPrice)
          : undefined,
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

      alert(lang === 'ar' ? 'تمت إضافة المنتج بنجاح' : 'Product added successfully');

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
      console.error(err);
      alert(
        lang === 'ar'
          ? 'حدث خطأ أثناء إضافة المنتج'
          : 'An error occurred while adding the product'
      );
    }
  };

  return (
    <div className="container mx-auto mt-8" dir={isRTL ? 'rtl' : 'ltr'}>
      <h2 className="text-2xl font-bold mb-6">
        {lang === 'ar' ? 'إضافة منتج جديد' : 'Add New Product'}
      </h2>

<form onSubmit={handleSubmit} className="space-y-4">
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

  {/* ===== Variants ===== */}
  {showVariantSection ? (
    <div className="border rounded-lg p-4 bg-gray-50">
      <h3 className="font-bold mb-3">
        {lang === 'ar'
          ? 'الأحجام المتوفرة (ml) وأسعارها'
          : 'Available Sizes (ml) & Prices'}
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
                    onChange={(e) =>
                      setVariantField(v.size, 'price', e.target.value)
                    }
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
                    onChange={(e) =>
                      setVariantField(v.size, 'oldPrice', e.target.value)
                    }
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

  <UploadImage
    name="image"
    id="image"
    uploaded={image}
    setImage={setImage}
  />

  <div>
    <label className="block text-sm font-medium text-gray-700">
      {lang === 'ar' ? 'وصف المنتج (EN)' : 'Product Description (EN)'}
    </label>
    <textarea
      name="description_en"
      className="add-product-InputCSS"
      rows={4}
      value={product.description_en}
      placeholder={
        lang === 'ar'
          ? 'Ingredients / scent / how to use…'
          : 'Ingredients / scent / how to use…'
      }
      onChange={handleChange}
    />
  </div>

  <div>
    <label className="block text-sm font-medium text-gray-700">
      {lang === 'ar' ? 'وصف المنتج (AR)' : 'Product Description (AR)'}
    </label>
    <textarea
      name="description_ar"
      className="add-product-InputCSS"
      rows={4}
      value={product.description_ar}
      placeholder={
        lang === 'ar'
          ? 'المكونات / الرائحة / طريقة الاستخدام…'
          : 'Arabic description…'
      }
      onChange={handleChange}
    />
  </div>

  <div>
    <button type="submit" className="add-product-btn" disabled={isLoading}>
      {isLoading
        ? lang === 'ar'
          ? 'جاري الإضافة...'
          : 'Adding...'
        : lang === 'ar'
        ? 'أضف منتج'
        : 'Add Product'}
    </button>
  </div>
</form>

    </div>
  );
};

export default AddProduct;
