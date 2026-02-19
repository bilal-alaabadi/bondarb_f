// ========================= PaymentSuccess.jsx (EN + AR) =========================
import React, { useEffect, useState } from 'react';
import { getBaseUrl } from '../utils/baseURL';
import { useDispatch, useSelector } from 'react-redux';
import { clearCart } from '../redux/features/cart/cartSlice';

const PaymentSuccess = () => {
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);
  const [products, setProducts] = useState([]);
  const dispatch = useDispatch();
  const { selectedItems } = useSelector((state) => state.cart);

  const lang = useSelector((state) => state.locale?.lang || 'en');
  const isRTL = lang === 'ar';

  const TEXT = {
    en: {
      paymentSuccess: 'Payment Successful',
      giftBadge: 'Gift 🎁',
      orderNumber: 'Order Number',
      paymentSessionId: 'Payment Session ID',
      giftCardDetails: 'Gift Card Details',
      from: 'From',
      to: 'To',
      recipientPhone: 'Recipient Phone',
      giftNotes: 'Gift Notes',
      depositInfo1: 'A',
      depositInfo2: 'deposit',
      depositInfo3: 'was paid.',
      depositInfo4: 'The remaining amount to complete the order is',
      productsTitle: 'Products',
      measurementsTitle: 'Measurements / Options:',
      giftCardTitle: 'Gift Card',
      orderSummary: 'Order Summary',
      itemsTotal: 'Items Total:',
      shippingFee: 'Shipping Fee:',
      grandTotal: 'Grand Total:',
      depositPaid: 'Deposit Paid:',
      remainingAmount: 'Remaining Amount:',
      remainingInfo:
        'The remaining amount includes product value after discounts and shipping (if applicable).',
      orderType: 'Order Type:',
      orderTypeGift: 'Gift 🎁',
      orderStatus: 'Order Status:',
      customerName: 'Customer Name:',
      email: 'Email:',
      phone: 'Phone:',
      state: 'state:',
      address: 'Address:',
      orderDate: 'Order Date:',
      loading: 'Loading...',
      errorPrefix: 'Error:',
      orderTypeGiftLabel: 'Gift 🎁',
      length: 'Length',
      sleeveLength: 'Sleeve Length',
      width: 'Width',
      design: 'Design',
      color: 'Color',
      buttons: 'Buttons',
      veilsQuantity: 'Veils Quantity',
      colorOption: 'Color Option',
      notes: 'Notes',
      size: 'Size',
      category: 'Category',
      quantity: 'Quantity',
    },
    ar: {
      paymentSuccess: 'تمت عملية الدفع بنجاح',
      giftBadge: 'هدية 🎁',
      orderNumber: 'رقم الطلب',
      paymentSessionId: 'معرّف جلسة الدفع',
      giftCardDetails: 'تفاصيل بطاقة الإهداء',
      from: 'من',
      to: 'إلى',
      recipientPhone: 'رقم جوال المستلم',
      giftNotes: 'ملاحظات الهدية',
      depositInfo1: 'تم دفع',
      depositInfo2: 'دفعة مقدمة',
      depositInfo3: '',
      depositInfo4: 'والمبلغ المتبقي لإكمال الطلب هو',
      productsTitle: 'المنتجات',
      measurementsTitle: 'المقاسات / الخيارات:',
      giftCardTitle: 'بطاقة الإهداء',
      orderSummary: 'ملخص الطلب',
      itemsTotal: 'إجمالي المنتجات:',
      shippingFee: 'رسوم الشحن:',
      grandTotal: 'الإجمالي النهائي:',
      depositPaid: 'الدفعة المدفوعة:',
      remainingAmount: 'المبلغ المتبقي:',
      remainingInfo:
        'المبلغ المتبقي يشمل قيمة المنتجات بعد الخصومات مع الشحن (إن وُجد).',
      orderType: 'نوع الطلب:',
      orderTypeGift: 'هدية 🎁',
      orderStatus: 'حالة الطلب:',
      customerName: 'اسم العميل:',
      email: 'البريد الإلكتروني:',
      phone: 'رقم الهاتف:',
      state: 'المنطقة:',
      address: 'العنوان:',
      orderDate: 'تاريخ الطلب:',
      loading: 'جاري التحميل...',
      errorPrefix: 'خطأ:',
      orderTypeGiftLabel: 'هدية 🎁',
      length: 'الطول',
      sleeveLength: 'طول الكم',
      width: 'العرض',
      design: 'التصميم',
      color: 'اللون',
      buttons: 'الأزرار',
      veilsQuantity: 'عدد الطرح',
      colorOption: 'خيار اللون',
      notes: 'ملاحظات',
      size: 'المقاس',
      category: 'الفئة',
      quantity: 'الكمية',
    },
  }[lang];

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const client_reference_id = query.get('client_reference_id');

    if (client_reference_id) {
      fetch(`${getBaseUrl()}/api/orders/confirm-payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ client_reference_id }),
      })
        .then(async (res) => {
          const data = await res.json().catch(() => ({}));
          if (!res.ok) {
            const msg =
              data?.error ||
              data?.message ||
              `HTTP error! status: ${res.status}`;
            throw new Error(msg);
          }
          return data;
        })
        .then(async (data) => {
          if (data.error) throw new Error(data.error);
          if (!data.order) throw new Error('No order data received.');

          if (data.order.status === 'completed' && selectedItems > 0) {
            dispatch(clearCart());
          }

          setOrder(data.order);

          const productsDetails = await Promise.all(
            (data.order.products || []).map(async (item) => {
              let fetched = {};
              try {
                const response = await fetch(
                  `${getBaseUrl()}/api/products/product/${item.productId}?lang=raw`
                );
                if (response.ok) {
                  const productData = await response.json();
                  fetched = productData?.product || {};
                }
              } catch {
                /* ignore */
              }

              const gc =
                item.giftCard &&
                (item.giftCard.from ||
                  item.giftCard.to ||
                  item.giftCard.phone ||
                  item.giftCard.note)
                  ? item.giftCard
                  : data.order.giftCard &&
                    (data.order.giftCard.from ||
                      data.order.giftCard.to ||
                      data.order.giftCard.phone ||
                      data.order.giftCard.note)
                  ? data.order.giftCard
                  : null;

              return {
                productId: item.productId,
                name: item.name || fetched.name || 'Product',
                quantity: item.quantity,
                measurements: item.measurements || {},
                selectedSize: item.selectedSize,
                category:
                  item.category ||
                  (lang === 'ar'
                    ? fetched.category_ar
                    : fetched.category_en) ||
                  fetched.category ||
                  '',
                image: item.image || fetched.image || '',
                description: fetched.description || '',
                price: item.price ?? fetched.regularPrice ?? fetched.price ?? 0,
                giftCard: gc,
              };
            })
          );

          setProducts(productsDetails);
        })
        .catch((err) => {
          console.error('Error confirming payment', err);
          setError(err.message || String(err));
        });
    } else {
      setError('No session ID found in the URL');
    }
  }, [dispatch, selectedItems, lang]);

  const isUAE = (() => {
    const c = order?.state?.trim()?.toLowerCase() || '';
    return c === 'الإمارات' || c === 'uae' || c === 'united arab emirates';
  })();

  const currency = isUAE ? 'AED' : 'OMR';
  const exchangeRate = isUAE ? 9.5 : 1;

  const formatPrice = (price) => (Number(price || 0) * exchangeRate).toFixed(2);

  const prettyKey = (k) => {
    const map = {
      length: TEXT.length,
      sleeveLength: TEXT.sleeveLength,
      width: TEXT.width,
      design: TEXT.design,
      color: TEXT.color,
      buttons: TEXT.buttons,
      quantity: TEXT.veilsQuantity,
      colorOption: TEXT.colorOption,
      notes: TEXT.notes,
      size: TEXT.size,
    };
    return map[k] || k;
  };

  const renderMeasurements = (m) => {
    if (!m || typeof m !== 'object') return null;
    const entries = Object.entries(m).filter(
      ([_, v]) => v !== '' && v !== null && v !== undefined
    );
    if (entries.length === 0) return null;
    return (
      <div className="mt-3 text-sm rounded p-3">
        <h5 className="font-semibold mb-2">{TEXT.measurementsTitle}</h5>
        <ul className="list-disc pl-5 space-y-1">
          {entries.map(([key, val]) => (
            <li key={key}>
              <span className="font-medium">{prettyKey(key)}: </span>
              <span>{String(val)}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  if (error) return <div className="text-red-500">{TEXT.errorPrefix} {error}</div>;
  if (!order) return <div>{TEXT.loading}</div>;

  const isDeposit = !!order.depositMode;
  const remaining = Number(order.remainingAmount || 0);
  const hasGift = Boolean(
    order?.giftCard &&
    (order.giftCard.from || order.giftCard.to || order.giftCard.phone || order.giftCard.note)
  );

  return (
    <section className="section__container rounded p-6" dir={isRTL ? 'rtl' : 'ltr'}>
      <h2 className="text-2xl font-bold mb-2">
        {TEXT.paymentSuccess}
        {hasGift && (
          <span
            className={`inline-block text-sm font-semibold px-2 py-0.5 rounded bg-pink-100 text-pink-800 align-middle ${
              isRTL ? 'mr-2' : 'ml-2'
            }`}
          >
            {TEXT.giftBadge}
          </span>
        )}
      </h2>

      <p className="text-gray-600">
        {TEXT.orderNumber}: {order.orderId}
      </p>

      {order.paymentSessionId && (
        <p className="text-gray-600">
          {TEXT.paymentSessionId}: {order.paymentSessionId}
        </p>
      )}

      {hasGift && (
        <div className="mt-4 p-3 rounded-md bg-pink-50 border border-pink-200 text-pink-900 text-sm">
          <h4 className="font-semibold mb-2">{TEXT.giftCardDetails}</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1">
            {order.giftCard.from && (
              <div>
                <span className="font-medium">{TEXT.from}: </span>
                {order.giftCard.from}
              </div>
            )}
            {order.giftCard.to && (
              <div>
                <span className="font-medium">{TEXT.to}: </span>
                {order.giftCard.to}
              </div>
            )}
            {order.giftCard.phone && (
              <div>
                <span className="font-medium">{TEXT.recipientPhone}: </span>
                {order.giftCard.phone}
              </div>
            )}
            {order.giftCard.note && (
              <div className="md:col-span-2">
                <span className="font-medium">{TEXT.giftNotes}: </span>
                {order.giftCard.note}
              </div>
            )}
          </div>
        </div>
      )}

      {isDeposit && (
        <div className="mt-4 p-3 rounded-md bg-amber-50 border border-amber-200 text-amber-800 text-sm">
          {TEXT.depositInfo1}{' '}
          <span className="font-semibold">
            {formatPrice(order.amount)} {currency}
          </span>{' '}
          {TEXT.depositInfo2} {TEXT.depositInfo3}{' '}
          {TEXT.depositInfo4}{' '}
          <span className="font-semibold">
            {formatPrice(remaining)} {currency}
          </span>
          .
        </div>
      )}

      <div className="mt-8 pt-6">
        <h3 className="text-xl font-bold mb-4">{TEXT.productsTitle}</h3>
        <div className="space-y-6">
          {products.map((product, index) => (
            <div key={index} className="flex flex-col md:flex-row gap-4 p-4 border rounded-lg">
              <div className="md:w-1/4">
                <img
                  src={Array.isArray(product.image) ? product.image[0] : product.image}
                  alt={product.name}
                  className="w-full h-auto rounded-md"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/150';
                    e.target.alt = 'Image not available';
                  }}
                />
              </div>

              <div className="md:w-3/4">
                <h4 className="text-lg font-semibold">{product.name}</h4>

                {product.description && (
                  <p className="text-gray-600 mt-2">{product.description}</p>
                )}

                <div className="mt-2">
                  <span className="font-medium">{TEXT.category}: </span>
                  <span>{product.category || '—'}</span>
                </div>

                <div className="mt-2">
                  <span className="font-medium">{TEXT.quantity}: </span>
                  <span>{product.quantity}</span>
                </div>

                {product.selectedSize && (
                  <div className="mt-2">
                    <span className="font-medium">{TEXT.size}: </span>
                    <span>{product.selectedSize}</span>
                  </div>
                )}

                {renderMeasurements(product.measurements)}

                {product.giftCard &&
                  ((product.giftCard.from && String(product.giftCard.from).trim()) ||
                    (product.giftCard.to && String(product.giftCard.to).trim()) ||
                    (product.giftCard.phone && String(product.giftCard.phone).trim()) ||
                    (product.giftCard.note && String(product.giftCard.note).trim())) && (
                    <div className="mt-3 p-3 rounded-md bg-pink-50 border border-pink-200 text-pink-900 text-sm">
                      <div className="font-semibold mb-1">{TEXT.giftCardTitle}</div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1">
                        {product.giftCard.from && String(product.giftCard.from).trim() && (
                          <div>
                            <span className="font-medium">{TEXT.from}: </span>
                            {product.giftCard.from}
                          </div>
                        )}
                        {product.giftCard.to && String(product.giftCard.to).trim() && (
                          <div>
                            <span className="font-medium">{TEXT.to}: </span>
                            {product.giftCard.to}
                          </div>
                        )}
                        {product.giftCard.phone && String(product.giftCard.phone).trim() && (
                          <div>
                            <span className="font-medium">{TEXT.recipientPhone}:{' '}</span>
                            {product.giftCard.phone}
                          </div>
                        )}
                        {product.giftCard.note && String(product.giftCard.note).trim() && (
                          <div className="md:col-span-2">
                            <span className="font-medium">{TEXT.giftNotes}:{' '}</span>
                            {product.giftCard.note}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 border-t pt-6">
        <h3 className="text-xl font-bold mb-4">{TEXT.orderSummary}</h3>
        <div className="bg-gray-50 p-4 rounded-lg space-y-3">
          {!isDeposit ? (
            <>
              <div className="flex justify-between py-2">
                <span>{TEXT.itemsTotal}</span>
                <span className="font-semibold">
                  {formatPrice(Number(order.amount) - Number(order.shippingFee))}{' '}
                  {currency}
                </span>
              </div>

              <div className="flex justify-between py-2">
                <span>{TEXT.shippingFee}</span>
                <span className="font-semibold">
                  {formatPrice(order.shippingFee)} {currency}
                </span>
              </div>

              <div className="flex justify-between py-2 border-t pt-3">
                <span className="font-medium">{TEXT.grandTotal}</span>
                <span className="font-bold text-lg">
                  {formatPrice(order.amount)} {currency}
                </span>
              </div>
            </>
          ) : (
            <>
              <div className="flex justify-between py-2">
                <span>{TEXT.depositPaid}</span>
                <span className="font-semibold">
                  {formatPrice(order.amount)} {currency}
                </span>
              </div>

              <div className="flex justify-between py-2">
                <span>{TEXT.remainingAmount}</span>
                <span className="font-semibold">
                  {formatPrice(remaining)} {currency}
                </span>
              </div>

              <div className="text-xs text-gray-600">{TEXT.remainingInfo}</div>
            </>
          )}

          {hasGift && (
            <div className="rounded-md border bg-pink-50 p-3 space-y-2">
              <div className="flex justify-between">
                <span>{TEXT.orderType}</span>
                <span className="font-semibold text-pink-700">
                  {TEXT.orderTypeGiftLabel}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                {order.giftCard.from && (
                  <div>
                    <span className="font-medium">{TEXT.from}: </span>
                    {order.giftCard.from}
                  </div>
                )}
                {order.giftCard.to && (
                  <div>
                    <span className="font-medium">{TEXT.to}: </span>
                    {order.giftCard.to}
                  </div>
                )}
                {order.giftCard.phone && (
                  <div>
                    <span className="font-medium">{TEXT.recipientPhone}:{' '}</span>
                    {order.giftCard.phone}
                  </div>
                )}
                {order.giftCard.note && (
                  <div className="md:col-span-2">
                    <span className="font-medium">{TEXT.giftNotes}: </span>
                    {order.giftCard.note}
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="flex justify-between py-2 border-t pt-3">
            <span>{TEXT.orderStatus}</span>
            <span className="font-semibold">{order.status}</span>
          </div>

          <div className="flex justify-between py-2">
            <span>{TEXT.customerName}</span>
            <span className="font-semibold">{order.customerName}</span>
          </div>

          <div className="flex justify-between py-2">
            <span>{TEXT.email}</span>
            <span className="font-semibold">{order.email}</span>
          </div>

          <div className="flex justify-between py-2">
            <span>{TEXT.phone}</span>
            <span className="font-semibold">{order.customerPhone}</span>
          </div>

          <div className="flex justify-between py-2">
            <span>{TEXT.state}</span>
            <span className="font-semibold">{order.state}</span>
          </div>

          <div className="flex justify-between py-2">
            <span>{TEXT.address}</span>
            <span className="font-semibold">{order.wilayat}</span>
          </div>

          <div className="flex justify-between py-2 border-t pt-3">
            <span>{TEXT.orderDate}</span>
            <span className="font-semibold">
              {new Date(order.createdAt).toLocaleDateString('en-GB')}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PaymentSuccess;
