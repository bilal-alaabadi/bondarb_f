import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RiBankCardLine } from "react-icons/ri";
import { getBaseUrl } from '../../utils/baseURL';
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [email, setEmail] = useState('');
  const [wilayat, setWilayat] = useState('');
  const [description, setDescription] = useState('');

  const { products, totalPrice, country } = useSelector((state) => state.cart);

  // Shipping and currency by country
  const baseShippingFee = country === 'الإمارات' ? 4 : 2;
  const currency = country === 'الإمارات' ? 'AED' : 'OMR';
  const exchangeRate = country === 'الإمارات' ? 9.5 : 1;
  const shippingFee = baseShippingFee * exchangeRate;

  useEffect(() => {
    if (products.length === 0) {
      setError("Your cart is empty. Please add products before proceeding to checkout.");
    } else {
      setError('');
    }
  }, [products]);

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
        image: Array.isArray(product.image) ? product.image[0] : product.image
      })),
      customerName,
      customerPhone,
      country,
      wilayat,
      description,
      email
    };

    try {
      const response = await fetch(`${getBaseUrl()}/api/orders/create-checkout-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });

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

  return (
    <div className="p-4 md:p-12  max-w-6xl mx-auto flex flex-col md:flex-row gap-8">
      {/* Billing Details */}
      <div className="flex-1 pt-20 ">
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
                placeholder="name@example.com"
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
                placeholder="Please enter the full address"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Additional Notes (optional)</label>
              <textarea
                className="w-full p-2 border rounded-md"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Any notes or extra details about the order"
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

      {/* Order Summary */}
      <div className=" w-full md:w-1/3 p-4 md:p-6 bg-white rounded-lg shadow-lg border border-gray-200">
        <h2 className="text-lg md:text-xl font-bold mb-4 text-gray-800">Your Order</h2>
        <div className="space-y-4">
          {products.map((product) => (
            <div key={product._id} className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-700">{product.name} × {product.quantity}</span>
              <span className="text-gray-900 font-medium">
                {(product.price * product.quantity * exchangeRate).toFixed(2)} {currency}
              </span>
            </div>
          ))}

          <div className="flex justify-between items-center pt-2 border-t border-gray-200">
            <span className="text-gray-800">Shipping Fee</span>
            <p className="text-gray-900">{shippingFee.toFixed(2)} {currency}</p>
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-gray-200">
            <span className="text-gray-800 font-semibold">Total</span>
            <p className="text-gray-900 font-bold">
              {((totalPrice + baseShippingFee) * exchangeRate).toFixed(2)} {currency}
            </p>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Thawani Payment</h3>
          <button
            onClick={makePayment}
            className="w-full bg-[#7A2432] text-white px-4 py-2 rounded-md transition-colors duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
            disabled={products.length === 0}
          >
            <RiBankCardLine className="text-xl" />
            <span>Pay with Thawani</span>
          </button>
          <p className="mt-4 text-sm text-gray-600">
            Your personal data will be used to process your order, support your experience on this site,
            and for other purposes described in our <a className="text-blue-600 hover:underline">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
