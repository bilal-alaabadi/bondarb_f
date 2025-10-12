import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { clearCart, updateQuantity, removeFromCart } from "../../redux/features/cart/cartSlice";

const OrderSummary = ({ onClose }) => {
  const dispatch = useDispatch();
  const { products, totalPrice, shippingFee, country } = useSelector((s) => s.cart);
  const lang = useSelector((s) => s.locale.lang);

  // ترجمات بسيطة
  const t = (key) => {
    const en = {
      empty: "Your cart is empty",
      remove: "Remove",
      subtotal: "Subtotal",
      shipping: "Shipping",
      note:
        "Shipping and taxes (if applicable) are calculated at checkout. Extra fees may apply depending on destination.",
      total: "Total",
      checkout: "Checkout",
      clear: "Clear Cart",
      unit: "Unit",
      qty: "Qty",
      currencyAED: "AED",
      currencyOMR: "OMR",
      cart: "Cart",
    };
    const ar = {
      empty: "سلتك فارغة",
      remove: "حذف",
      subtotal: "المجموع الفرعي",
      shipping: "الشحن",
      note:
        "يتم احتساب الشحن والضرائب (إن وجدت) عند الدفع. قد تنطبق رسوم إضافية حسب الوجهة.",
      total: "الإجمالي",
      checkout: "الدفع",
      clear: "إفراغ السلة",
      unit: "السعر",
      qty: "الكمية",
      currencyAED: "درهم",
      currencyOMR: "ريال",
      cart: "السلة",
    };
    return (lang === "ar" ? ar : en)[key];
  };

  const usingAED = country === "الإمارات";
  const currency = usingAED ? t("currencyAED") : t("currencyOMR");
  const rate = usingAED ? 9.5 : 1; // التحويل التقريبي الذي تستخدمه
  const fmt = (n) => (n * rate).toFixed(2);

  const subtotal = fmt(totalPrice);
  const shipping = fmt(shippingFee);
  const grandTotal = (Number(subtotal) + Number(shipping)).toFixed(2);

  const inc = (id) => dispatch(updateQuantity({ id, type: "increment" }));
  const dec = (id) => dispatch(updateQuantity({ id, type: "decrement" }));
  const remove = (id) => dispatch(removeFromCart({ id }));

  return (
    <div className="flex h-full flex-col bg-white" dir={lang === "ar" ? "rtl" : "ltr"}>
      {/* Items */}
      <div className="flex-1 overflow-y-auto px-4">
        {products.length === 0 ? (
          <div className="py-12 text-center text-gray-600">{t("empty")}</div>
        ) : (
          products.map((item) => {
            const unit = item.price;
            const rowTotal = fmt(unit * item.quantity);
            return (
              <div key={item._id} className="grid grid-cols-12 items-start gap-3 border-b py-5">
                {/* Image */}
                <div className="col-span-3">
                  <div className="h-20 w-20 overflow-hidden border bg-white">
                    <img
                      src={item.image?.[0] || "https://via.placeholder.com/150"}
                      alt={item.name}
                      className="h-full w-full object-contain"
                    />
                  </div>
                </div>

                {/* Info */}
                <div className="col-span-6">
                  <div className="text-sm font-semibold">{item.name}</div>

                  {/* السعر للوحدة */}
                  <div className="mt-1 text-sm text-gray-600">
                    {fmt(unit)} {currency}
                  </div>

                  {/* التحكم بالكمية */}
                  <div className="mt-3 inline-flex items-center overflow-hidden rounded border">
                    <button onClick={() => dec(item._id)} className="px-3 py-2 text-lg leading-none">−</button>
                    <div className="w-10 text-center text-sm">{item.quantity}</div>
                    <button onClick={() => inc(item._id)} className="px-3 py-2 text-lg leading-none">+</button>
                  </div>

                  <button
                    onClick={() => remove(item._id)}
                    className="ms-3 inline-flex items-center text-gray-600 hover:text-red-600"
                  >
                    {t("remove")}
                  </button>
                </div>

                {/* Total per row */}
                <div className="col-span-3 text-right text-base">
                  {rowTotal} {currency}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer */}
      <div className="sticky bottom-0 border-t bg-white px-4 pt-4 pb-5">
        <div className="mb-1 flex items-center justify-between text-sm text-gray-700">
          <span>{t("subtotal")}</span>
          <span>
            {subtotal} {currency}
          </span>
        </div>
        <div className="mb-2 flex items-center justify-between text-sm text-gray-700">
          <span>{t("shipping")}</span>
          <span>
            {shipping} {currency}
          </span>
        </div>

        <p className="mb-3 text-[12px] text-gray-500">{t("note")}</p>

        <div className="mb-3 flex items-center justify-between text-base font-semibold">
          <span>{t("total")}</span>
          <span>
            {grandTotal} {currency}
          </span>
        </div>

        <Link to="/Checkout" onClick={onClose}>
          <button className="mb-3 w-full rounded bg-[#7A2432] py-3 text-white hover:brightness-110">
            {t("checkout")}
          </button>
        </Link>

        <button
          onClick={() => dispatch(clearCart())}
          className="w-full rounded border py-2 text-sm text-gray-700 hover:bg-gray-50"
        >
          {t("clear")}
        </button>
      </div>
    </div>
  );
};

export default OrderSummary;
