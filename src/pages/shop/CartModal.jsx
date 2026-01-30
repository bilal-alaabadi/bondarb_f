// CartModal.jsx
import React, { useEffect } from "react";
import OrderSummary from "./OrderSummary";

const CartModal = ({ isOpen, onClose }) => {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => (document.body.style.overflow = "");
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100]">
      <button
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-black/45 backdrop-blur-[2px]"
      />

      <aside className="absolute right-0 top-0 h-full bg-white shadow-2xl w-[90%] max-w-[420px] md:w-[480px] flex flex-col">
        <Header onClose={onClose} />
        <OrderSummary onClose={onClose} />
      </aside>
    </div>
  );
};

const Header = ({ onClose }) => (
  <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white px-4 py-4">
    <h2 className="text-lg font-semibold">Your Cart</h2>
    <button onClick={onClose} aria-label="Close" className="text-gray-700 hover:text-black">
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </button>
  </div>
);

export default CartModal;
