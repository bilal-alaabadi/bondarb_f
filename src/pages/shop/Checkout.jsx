// Checkout.jsx
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RiBankCardLine } from "react-icons/ri";
import { getBaseUrl } from '../../utils/baseURL';
import { useNavigate } from 'react-router-dom';

const FREE_SHIPPING_THRESHOLD = 15; // 🔹 حد الشحن المجاني (OMR)

const Checkout = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [email, setEmail] = useState('');
  const [wilayat, setWilayat] = useState('');
  const [description, setDescription] = useState('');

  const { products, totalPrice, country } = useSelector((state) => state.cart);

  // ========================= Shipping + Currency =========================
  const usingAED = country === 'الإمارات';
  const currency = usingAED ? 'AED' : 'OMR';
  const exchangeRate = usingAED ? 9.5 : 1;

  const baseShippingFee = usingAED ? 4 : 2;
  const isFreeShipping = totalPrice >= FREE_SHIPPING_THRESHOLD;
  const effectiveShippingBase = isFreeShipping ? 0 : baseShippingFee;

  const shippingFee = effectiveShippingBase * exchangeRate;
  const subtotal = totalPrice * exchangeRate;
  const grandTotal = (totalPrice + effectiveShippingBase) * exchangeRate;

  // ========================= Guards =========================
  useEffect(() => {
    if (products.length === 0) {
      setError("Your cart is empty. Please add products before proceeding to checkout.");
    } else {
      setError('');
    }
  }, [products]);

  // ========================= Payment =========================
  const makePayment = async (e) => {
    e.preventDefault();

    if (products.length === 0) {
      setError("Your cart is empty. Please add products before proceeding to checkout.");
      return;
    }

    if (!customerName || !customerPhone || !country || !wilayat || !email) {
      setError("Please fill in all required fields (Full Name, Phone, Email, Country, Address).");
      return;
    }

    const body = {
      products: products.map(product => ({
        _id: product._id,
        name: product.name,
        price: product.price,
        quantity: product.quantity,
        image: Array.isArray(product.image) ? product.image[0] : product.image,
  selectedSize: product.selectedSize || product.size || '',

        ...(product.selectedSize && { selectedSize: product.selectedSize }),
        ...(product.selectedColor && { selectedColor: product.selectedColor }),
        ...(product.cartKey && { cartKey: product.cartKey }),
        ...(product.customization && { customization: product.customization }),
      })),
      customerName,
      customerPhone,
      country,
      wilayat,
      description,
      email,
      freeShipping: isFreeShipping, // 🔹 اختياري للتتبع
    };

    try {
      const response = await fetch(
        `${getBaseUrl()}/api/orders/create-checkout-session`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create checkout session");
      }

      const session = await response.json();

      if (session.paymentLink) {
        window.location.href = session.paymentLink;
      } else {
        setError("An error occurred while generating the payment link. Please try again.");
      }
    } catch (error) {
      console.error("Error during payment process:", error);
      setError(error.message || "An error occurred during payment. Please try again.");
    }
  };

  // ========================= UI =========================
  return (
    <div className="p-4 md:p-12 max-w-6xl mx-auto flex flex-col md:flex-row gap-8">
      {/* ================= Billing Details ================= */}
      <div className="flex-1 pt-20">
        <h1 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">Billing Details</h1>
        {error && <div className="text-red-500 mb-4">{error}</div>}

        <form onSubmit={makePayment} className="space-y-4 md:space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-2">Full Name</label>
              <input
                type="text"
                className="w-full p-2 border rounded-md"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Phone Number</label>
              <input
                type="tel"
                className="w-full p-2 border rounded-md"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Email</label>
              <input
                type="email"
                className="w-full p-2 border rounded-md"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Country</label>
              <input
                type="text"
                className="w-full p-2 border rounded-md bg-gray-100"
                value={country}
                readOnly
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Address</label>
              <input
                type="text"
                className="w-full p-2 border rounded-md"
                value={wilayat}
                onChange={(e) => setWilayat(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Additional Notes (optional)</label>
              <textarea
                className="w-full p-2 border rounded-md"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows="3"
              />
            </div>
          </div>

          <button
            type="submit"
            className="bg-[#7A2432] text-white px-6 py-3 rounded-md w-full"
            disabled={products.length === 0}
          >
            Place Order
          </button>
        </form>
      </div>

      {/* ================= Order Summary ================= */}
      <div className="w-full md:w-1/3 p-4 md:p-6 bg-white rounded-lg shadow-lg border">
        <h2 className="text-lg md:text-xl font-bold mb-4">Your Order</h2>

        {products.map((product) => (
          <div
            key={product.cartKey}
            className="py-2 border-b border-gray-100"
          >
            <div className="flex justify-between">
              <span>{product.name} × {product.quantity}</span>
              <span>
                {(product.price * product.quantity * exchangeRate).toFixed(2)} {currency}
              </span>
            </div>

            {product.selectedSize && (
              <div className="text-sm text-gray-500">
                Size: <span className="font-medium">{product.selectedSize}</span>
              </div>
            )}
          </div>
        ))}

        <div className="flex justify-between pt-3">
          <span>Subtotal</span>
          <span>{subtotal.toFixed(2)} {currency}</span>
        </div>

        <div className="flex justify-between pt-2">
          <span>Shipping</span>
          <span>
            {isFreeShipping ? "Free" : `${shippingFee.toFixed(2)} ${currency}`}
          </span>
        </div>

        <div className="flex justify-between pt-4 font-bold border-t mt-2">
          <span>Total</span>
          <span>{grandTotal.toFixed(2)} {currency}</span>
        </div>

        <div className="mt-6 pt-6 border-t">
          <h3 className="text-lg font-semibold mb-4">Thawani Payment</h3>
          <button
            onClick={makePayment}
            className="w-full bg-[#7A2432] text-white px-4 py-2 rounded-md flex items-center justify-center gap-2"
          >
            <RiBankCardLine className="text-xl" />
            Pay with Thawani
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
