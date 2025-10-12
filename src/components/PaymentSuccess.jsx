// ========================= PaymentSuccess.jsx (EN) =========================
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

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const client_reference_id = query.get('client_reference_id');

    if (client_reference_id) {
      fetch(`${getBaseUrl()}/api/orders/confirm-payment`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ client_reference_id })
      })
        .then((res) =>
          res.ok ? res.json() : Promise.reject(new Error(`HTTP error! status: ${res.status}`))
        )
        .then(async (data) => {
          if (data.error) throw new Error(data.error);
          if (!data.order) throw new Error("No order data received.");

          if (data.order.status === 'completed' && selectedItems > 0) {
            dispatch(clearCart());
          }

          setOrder(data.order);

          const productsDetails = await Promise.all(
            (data.order.products || []).map(async (item) => {
              let fetched = {};
              try {
                const response = await fetch(`${getBaseUrl()}/api/products/${item.productId}`);
                if (response.ok) {
                  const productData = await response.json();
                  fetched = productData?.product || {};
                }
              } catch { /* ignore */ }

              // Gift card per item, or fallback to order-level gift card
              const gc = item.giftCard && (item.giftCard.from || item.giftCard.to || item.giftCard.phone || item.giftCard.note)
                ? item.giftCard
                : (data.order.giftCard && (data.order.giftCard.from || data.order.giftCard.to || data.order.giftCard.phone || data.order.giftCard.note)
                    ? data.order.giftCard
                    : null);

              return {
                productId: item.productId,
                name: item.name || fetched.name || 'Product',
                quantity: item.quantity,
                measurements: item.measurements || {},
                selectedSize: item.selectedSize,
                category: item.category || fetched.category || '',
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
          console.error("Error confirming payment", err);
          setError(err.message || String(err));
        });
    } else {
      setError("No session ID found in the URL");
    }
  }, [dispatch, selectedItems]);

  // Robust UAE check (Arabic or English)
  const isUAE = (() => {
    const c = order?.country?.trim()?.toLowerCase() || "";
    return c === "الإمارات" || c === "uae" || c === "united arab emirates";
  })();

  const currency = isUAE ? 'AED' : 'OMR';
  const exchangeRate = isUAE ? 9.5 : 1;

  const formatPrice = (price) => (Number(price || 0) * exchangeRate).toFixed(2);

  const prettyKey = (k) => {
    const map = {
      length: 'Length',
      sleeveLength: 'Sleeve Length',
      width: 'Width',
      design: 'Design',
      color: 'Color',
      buttons: 'Buttons',
      quantity: 'Veils Quantity',
      colorOption: 'Color Option',
      notes: 'Notes',
      size: 'Size',
    };
    return map[k] || k;
  };

  const renderMeasurements = (m) => {
    if (!m || typeof m !== 'object') return null;
    const entries = Object.entries(m).filter(([_, v]) => v !== '' && v !== null && v !== undefined);
    if (entries.length === 0) return null;
    return (
      <div className="mt-3 text-sm rounded p-3">
        <h5 className="font-semibold mb-2">Measurements / Options:</h5>
        <ul className="list-disc pl-5 space-y-1">
          {entries.map(([key, val]) => (
            <li key={key}>
              <span className="font-medium">{prettyKey(key)}:</span> <span>{String(val)}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  if (error) return <div className="text-red-500">Error: {error}</div>;
  if (!order) return <div>Loading...</div>;

  const isDeposit = !!order.depositMode;
  const remaining = Number(order.remainingAmount || 0);
  const hasGift = Boolean(
    order?.giftCard &&
    (order.giftCard.from || order.giftCard.to || order.giftCard.phone || order.giftCard.note)
  );

  return (
    <section className='section__container rounded p-6' dir="ltr">
      <h2 className="text-2xl font-bold mb-2">
        Payment Successful
        {hasGift && (
          <span className="ml-2 inline-block text-sm font-semibold px-2 py-0.5 rounded bg-pink-100 text-pink-800 align-middle">
            Gift 🎁
          </span>
        )}
      </h2>
      <p className="text-gray-600">Order Number: {order.orderId}</p>
      {order.paymentSessionId && (
        <p className="text-gray-600">Payment Session ID: {order.paymentSessionId}</p>
      )}

      {/* Order-level Gift Card */}
      {hasGift && (
        <div className="mt-4 p-3 rounded-md bg-pink-50 border border-pink-200 text-pink-900 text-sm">
          <h4 className="font-semibold mb-2">Gift Card Details</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1">
            {order.giftCard.from && <div><span className="font-medium">From: </span>{order.giftCard.from}</div>}
            {order.giftCard.to && <div><span className="font-medium">To: </span>{order.giftCard.to}</div>}
            {order.giftCard.phone && <div><span className="font-medium">Recipient Phone: </span>{order.giftCard.phone}</div>}
            {order.giftCard.note && <div className="md:col-span-2"><span className="font-medium">Gift Notes: </span>{order.giftCard.note}</div>}
          </div>
        </div>
      )}

      {isDeposit && (
        <div className="mt-4 p-3 rounded-md bg-amber-50 border border-amber-200 text-amber-800 text-sm">
          A <span className="font-semibold">deposit</span> of {formatPrice(order.amount)} {currency} was paid.
          The remaining amount to complete the order is <span className="font-semibold">{formatPrice(remaining)} {currency}</span>.
        </div>
      )}

      {/* Products */}
      <div className="mt-8 pt-6">
        <h3 className="text-xl font-bold mb-4">Products</h3>
        <div className="space-y-6">
          {products.map((product, index) => (
            <div key={index} className="flex flex-col md:flex-row gap-4 p-4 border rounded-lg">
              <div className="md:w-1/4">
                <img
                  src={Array.isArray(product.image) ? product.image[0] : product.image}
                  alt={product.name}
                  className="w-full h-auto rounded-md"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/150";
                    e.target.alt = "Image not available";
                  }}
                />
              </div>
              <div className="md:w-3/4">
                <h4 className="text-lg font-semibold">{product.name}</h4>
                {product.description && (
                  <p className="text-gray-600 mt-2">{product.description}</p>
                )}

                <div className="mt-2">
                  <span className="font-medium">Category: </span>
                  <span>{product.category || '—'}</span>
                </div>

                <div className="mt-2">
                  <span className="font-medium">Quantity: </span>
                  <span>{product.quantity}</span>
                </div>

                {product.selectedSize && (
                  <div className="mt-2">
                    <span className="font-medium">Size: </span>
                    <span>{product.selectedSize}</span>
                  </div>
                )}

                {renderMeasurements(product.measurements)}

                {/* Item-level Gift Card */}
                {product.giftCard &&
                  ((product.giftCard.from && String(product.giftCard.from).trim()) ||
                    (product.giftCard.to && String(product.giftCard.to).trim()) ||
                    (product.giftCard.phone && String(product.giftCard.phone).trim()) ||
                    (product.giftCard.note && String(product.giftCard.note).trim())) && (
                    <div className="mt-3 p-3 rounded-md bg-pink-50 border border-pink-200 text-pink-900 text-sm">
                      <div className="font-semibold mb-1">Gift Card</div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1">
                        {product.giftCard.from && String(product.giftCard.from).trim() && (
                          <div><span className="font-medium">From: </span>{product.giftCard.from}</div>
                        )}
                        {product.giftCard.to && String(product.giftCard.to).trim() && (
                          <div><span className="font-medium">To: </span>{product.giftCard.to}</div>
                        )}
                        {product.giftCard.phone && String(product.giftCard.phone).trim() && (
                          <div><span className="font-medium">Recipient Phone: </span>{product.giftCard.phone}</div>
                        )}
                        {product.giftCard.note && String(product.giftCard.note).trim() && (
                          <div className="md:col-span-2"><span className="font-medium">Gift Notes: </span>{product.giftCard.note}</div>
                        )}
                      </div>
                    </div>
                  )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Order Summary */}
      <div className="mt-8 border-t pt-6">
        <h3 className="text-xl font-bold mb-4">Order Summary</h3>
        <div className="bg-gray-50 p-4 rounded-lg space-y-3">
          {!isDeposit ? (
            <>
              <div className="flex justify-between py-2">
                <span>Items Total:</span>
                <span className="font-semibold">
                  {formatPrice(Number(order.amount) - Number(order.shippingFee))} {currency}
                </span>
              </div>

              <div className="flex justify-between py-2">
                <span>Shipping Fee:</span>
                <span className="font-semibold">{formatPrice(order.shippingFee)} {currency}</span>
              </div>

              <div className="flex justify-between py-2 border-t pt-3">
                <span className="font-medium">Grand Total:</span>
                <span className="font-bold text-lg">{formatPrice(order.amount)} {currency}</span>
              </div>
            </>
          ) : (
            <>
              <div className="flex justify-between py-2">
                <span>Deposit Paid:</span>
                <span className="font-semibold">{formatPrice(order.amount)} {currency}</span>
              </div>

              <div className="flex justify-between py-2">
                <span>Remaining Amount:</span>
                <span className="font-semibold">{formatPrice(remaining)} {currency}</span>
              </div>

              <div className="text-xs text-gray-600">
                The remaining amount includes product value after discounts and shipping (if applicable).
              </div>
            </>
          )}

          {/* Also show gift data in summary */}
          {hasGift && (
            <div className="rounded-md border bg-pink-50 p-3 space-y-2">
              <div className="flex justify-between">
                <span>Order Type:</span>
                <span className="font-semibold text-pink-700">Gift 🎁</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                {order.giftCard.from && <div><span className="font-medium">From: </span>{order.giftCard.from}</div>}
                {order.giftCard.to && <div><span className="font-medium">To: </span>{order.giftCard.to}</div>}
                {order.giftCard.phone && <div><span className="font-medium">Recipient Phone: </span>{order.giftCard.phone}</div>}
                {order.giftCard.note && (
                  <div className="md:col-span-2">
                    <span className="font-medium">Gift Notes: </span>{order.giftCard.note}
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="flex justify-between py-2 border-t pt-3">
            <span>Order Status:</span>
            <span className="font-semibold">{order.status}</span>
          </div>

          <div className="flex justify-between py-2">
            <span>Customer Name:</span>
            <span className="font-semibold">{order.customerName}</span>
          </div>
          <div className="flex justify-between py-2">
            <span>Email:</span>
            <span className="font-semibold">{order.email}</span>
          </div>

          <div className="flex justify-between py-2">
            <span>Phone:</span>
            <span className="font-semibold">{order.customerPhone}</span>
          </div>

          <div className="flex justify-between py-2">
            <span>Country:</span>
            <span className="font-semibold">{order.country}</span>
          </div>

          <div className="flex justify-between py-2">
            <span>Address:</span>
            <span className="font-semibold">{order.wilayat}</span>
          </div>

          <div className="flex justify-between py-2 border-t pt-3">
            <span>Order Date:</span>
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
