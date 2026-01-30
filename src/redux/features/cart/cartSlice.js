// cartSlice.js
import { createSlice } from "@reduxjs/toolkit";

const loadState = () => {
  try {
    const s = localStorage.getItem("cartState");
    return s ? JSON.parse(s) : undefined;
  } catch {
    return undefined;
  }
};

const initialState = loadState() || {
  products: [],
  selectedItems: 0,
  totalPrice: 0,
  shippingFee: 2,
  country: "عمان",
};

const makeCartKey = (payload) => {
  const id = payload?._id || "";
  const size = payload?.selectedSize || "";
  const customization = payload?.customization ? JSON.stringify(payload.customization) : "";
  return `${id}__size:${size}__cust:${customization}`;
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const qtyToAdd = Math.max(
        1,
        Number.isFinite(+action.payload?.quantity) ? Math.floor(+action.payload.quantity) : 1
      );

      const cartKey = makeCartKey(action.payload);
      const existing = state.products.find((p) => p.cartKey === cartKey);

      if (existing) {
        existing.quantity += qtyToAdd;
      } else {
        state.products.push({
          ...action.payload,
          cartKey,
          quantity: qtyToAdd,
        });
      }

      state.selectedItems = setSelectedItems(state);
      state.totalPrice = setTotalPrice(state);
      saveState(state);
    },

    updateQuantity: (state, action) => {
      const p = state.products.find((x) => x.cartKey === action.payload.id);
      if (p) {
        if (action.payload.type === "increment") p.quantity += 1;
        if (action.payload.type === "decrement" && p.quantity > 1) p.quantity -= 1;
      }
      state.selectedItems = setSelectedItems(state);
      state.totalPrice = setTotalPrice(state);
      saveState(state);
    },

    removeFromCart: (state, action) => {
      state.products = state.products.filter((p) => p.cartKey !== action.payload.id);
      state.selectedItems = setSelectedItems(state);
      state.totalPrice = setTotalPrice(state);
      saveState(state);
    },

    clearCart: (state) => {
      state.products = [];
      state.selectedItems = 0;
      state.totalPrice = 0;
      saveState(state);
    },

    setCountry: (state, action) => {
      state.country = action.payload;
      state.shippingFee = action.payload === "الإمارات" ? 4 : 2;
      saveState(state);
    },

    loadCart: (state, action) => action.payload,
  },
});

const saveState = (state) => {
  try {
    localStorage.setItem("cartState", JSON.stringify(state));
  } catch {}
};

export const setSelectedItems = (state) => state.products.reduce((t, p) => t + p.quantity, 0);
export const setTotalPrice = (state) => state.products.reduce((t, p) => t + p.quantity * p.price, 0);

export const { addToCart, updateQuantity, removeFromCart, clearCart, setCountry, loadCart } =
  cartSlice.actions;

export default cartSlice.reducer;
