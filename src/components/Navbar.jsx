// src/components/Navbar.jsx
import React, { useState, useEffect } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Search, ShoppingBag, Menu, X as CloseIcon, User } from "lucide-react";
import CartModal from "../pages/shop/CartModal";
import avatarImg from "../assets/avatar.png";
import logo from "../assets/ChatGPT Image Jan 29, 2026, 11_48_59 PM.png";
import { useLogoutUserMutation } from "../redux/features/auth/authApi";
import { logout } from "../redux/features/auth/authSlice";
import { toggleLang } from "../redux/features/locale/localeSlice";

const Navbar = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isDropOpen, setIsDropOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const { user } = useSelector((s) => s.auth);
  const products = useSelector((s) => s.cart.products);
  const totalCartItems = products.reduce((t, i) => t + i.quantity, 0);
  const lang = useSelector((s) => s.locale.lang);
  const isRTL = lang === "ar";

  const [logoutUser] = useLogoutUserMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser().unwrap();
      dispatch(logout());
      setMobileOpen(false);
      navigate("/");
    } catch (e) {
      console.error("Logout failed", e);
    }
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-white" dir={isRTL ? "rtl" : "ltr"}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          className={`relative flex items-center ${
            scrolled ? "h-[56px]" : "h-[72px]"
          } transition-[height] duration-300`}
        >
          {/* زر القائمة في الموبايل */}
          <button
            onClick={() => setMobileOpen((p) => !p)}
            className="md:hidden mr-3 text-[#0E161B] hover:opacity-70 transition"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? (
              <CloseIcon size={26} strokeWidth={1.5} />
            ) : (
              <Menu size={26} strokeWidth={1.5} />
            )}
          </button>

          {/* روابط الديسكتوب */}
          <nav className="flex-1">
            <ul className="hidden md:flex items-center gap-10">
              <NavItem to="/" label={lang === "en" ? "HOME" : "الرئيسية"} />
              <NavItem to="/shop" label={lang === "en" ? "PRODUCTS" : "المنتجات"} />
              <NavItem to="/about" label={lang === "en" ? "ABOUT" : "من نحن"} />
            </ul>
          </nav>

          {/* الشعار */}
<div className="absolute left-1/2 -translate-x-1/2">
  <Link to="/" aria-label="Home">
    <img
      src={logo}
      alt="BOND"
      className={`${
        scrolled ? "h-32" : "h-32"
      } w-auto object-contain select-none transition-all duration-300`}
      draggable="false"
    />
  </Link>
</div>


          {/* أيقونات اليمين */}
          <div className="ml-auto flex items-center gap-4 sm:gap-6 text-[#0E161B]">
            {/* زر تبديل اللغة — يظهر على الديسكتوب فقط */}
            <button
              onClick={() => dispatch(toggleLang())}
              className="hidden md:inline-flex rounded border px-2 py-1 text-xs hover:bg-gray-50"
              aria-label="Toggle language"
              title="Toggle language"
            >
              {lang === "en" ? "EN" : "AR"}
            </button>

            <Link to="/search" aria-label="Search" className="hover:opacity-70 transition">
              <Search size={22} strokeWidth={1.5} />
            </Link>

            {/* 👤 يظهر فقط على md↑ */}
            <div className="hidden md:block">
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setIsDropOpen((p) => !p)}
                    className="rounded-full"
                    aria-label="User Menu"
                  >
                    <img
                      src={user?.profileImage || avatarImg}
                      alt="Avatar"
                      className="h-7 w-7 rounded-full object-cover"
                    />
                  </button>

                  {isDropOpen && (
                    <div
                      className={`absolute mt-2 w-56 rounded-md border border-gray-200 bg-white py-1 shadow-lg ${
                        isRTL ? "left-0" : "right-0"
                      }`}
                      dir={isRTL ? "rtl" : "ltr"}
                    >
                      {user?.role === "admin" ? (
                        <>
                          <DropItem to="/dashboard/admin">{lang === "en" ? "Dashboard" : "لوحة التحكم"}</DropItem>
                          <DropItem to="/dashboard/manage-products">
                            {lang === "en" ? "Manage Products" : "إدارة المنتجات"}
                          </DropItem>
                          <DropItem to="/dashboard/add-product">
                            {lang === "en" ? "Add Product" : "إضافة منتج"}
                          </DropItem>
                        </>
                      ) : (
                        <DropItem to="/dashboard">{lang === "en" ? "Dashboard" : "لوحة التحكم"}</DropItem>
                      )}

                      <button
                        onClick={handleLogout}
                        className={`block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 ${
                          isRTL ? "text-right" : "text-left"
                        }`}
                      >
                        {lang === "en" ? "Logout" : "تسجيل الخروج"}
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/login" aria-label="Login" className="hover:opacity-70 transition">
                  <User size={22} strokeWidth={1.5} />
                </Link>
              )}
            </div>

            {/* 🛍️ السلة */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative hover:opacity-70 transition"
              aria-label="Cart"
              title={lang === "en" ? "Cart" : "السلة"}
            >
              <ShoppingBag size={22} strokeWidth={1.5} />
              {totalCartItems > 0 && (
                <span className="absolute -right-2 -top-2 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#0E161B] px-1 text-[10px] font-medium text-white">
                  {totalCartItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* قائمة الموبايل — مع اتجاه وتموضع مناسبين للعربية */}
      <div
        className={`md:hidden fixed inset-y-0 z-40 w-[78%] max-w-xs transform bg-white shadow-xl transition-transform duration-300 ${
          isRTL ? "right-0" : "left-0"
        } ${mobileOpen ? "translate-x-0" : isRTL ? "translate-x-full" : "-translate-x-full"}`}
        dir={isRTL ? "rtl" : "ltr"}
      >
        <div className="pt-[72px] flex flex-col h-full">
          {/* 🔤 تبديل اللغة للموبايل داخل اللوح المنزلق */}
          <div className="px-6 pb-3 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">{lang === "en" ? "Language" : "اللغة"}</span>
              <button
                onClick={() => dispatch(toggleLang())}
                className="rounded border px-3 py-1 text-xs text-gray-800 hover:bg-gray-50"
                aria-label="Toggle language"
                title="Toggle language"
              >
                {lang === "en" ? "EN" : "AR"}
              </button>
            </div>
          </div>

          {/* روابط علوية */}
          <ul className="py-2 flex-1">
            <MobileItem to="/" onClick={() => setMobileOpen(false)}>
              {lang === "en" ? "Home" : "الرئيسية"}
            </MobileItem>
            <MobileItem to="/shop" onClick={() => setMobileOpen(false)}>
              {lang === "en" ? "Products" : "المنتجات"}
            </MobileItem>
            <MobileItem to="/about" onClick={() => setMobileOpen(false)}>
              {lang === "en" ? "About" : "من نحن"}
            </MobileItem>
          </ul>

          {/* أسفل القائمة */}
          <div className="border-t border-gray-200 bg-gray-50 p-4 space-y-3">
            {!user ? (
              <Link to="/login" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 text-sm text-gray-700">
                <User size={18} strokeWidth={1.5} />
                <span>{lang === "en" ? "Login" : "تسجيل الدخول"}</span>
              </Link>
            ) : (
              <>
                <div className="flex items-center gap-3">
                  <img src={user?.profileImage || avatarImg} alt="Avatar" className="h-8 w-8 rounded-full object-cover" />
                  <span className="text-sm font-medium text-gray-800">
                    {user?.username || (lang === "en" ? "My Account" : "حسابي")}
                  </span>
                </div>

                {user?.role === "admin" ? (
                  <MobileBottomLink to="/dashboard/admin" onClick={() => setMobileOpen(false)}>
                    {lang === "en" ? "Dashboard" : "لوحة التحكم"}
                  </MobileBottomLink>
                ) : (
                  <MobileBottomLink to="/dashboard" onClick={() => setMobileOpen(false)}>
                    {lang === "en" ? "Dashboard" : "لوحة التحكم"}
                  </MobileBottomLink>
                )}

                <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-gray-700">
                  <User size={18} strokeWidth={1.5} />
                  <span>{lang === "en" ? "Logout" : "تسجيل الخروج"}</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Overlay */}
      {mobileOpen && <button onClick={() => setMobileOpen(false)} className="fixed inset-0 z-30 bg-black/20 md:hidden" />}

      {/* مودال السلة */}
      {isCartOpen && (
        <CartModal products={products} isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      )}
    </header>
  );
};

const NavItem = ({ to, label }) => {
  const lang = useSelector((s) => s.locale.lang);
  const isRTL = lang === "ar";
  return (
    <li>
      <NavLink
        to={to}
        end={to === "/"}
        className={({ isActive }) =>
          [
            "text-[14px]",
            isRTL ? "tracking-normal" : "tracking-[0.16em] uppercase",
            "text-[#0E161B]",
            isActive
              ? "font-semibold underline underline-offset-[10px] decoration-2"
              : "hover:opacity-70",
          ].join(" ")
        }
      >
        {label}
      </NavLink>
    </li>
  );
};

const MobileItem = ({ to, children, onClick }) => {
  const lang = useSelector((s) => s.locale.lang);
  const isRTL = lang === "ar";
  return (
    <li>
      <NavLink
        to={to}
        end={to === "/"}
        onClick={onClick}
        className={({ isActive }) =>
          [
            "block px-6 py-4 text-lg",
            isRTL ? "text-right" : "text-left",
            "text-[#0E161B]",
            isActive ? "bg-gray-50 font-semibold" : "hover:bg-gray-50",
          ].join(" ")
        }
      >
        {children}
      </NavLink>
    </li>
  );
};

const MobileBottomLink = ({ to, children, onClick }) => {
  const lang = useSelector((s) => s.locale.lang);
  const isRTL = lang === "ar";
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={`block px-1 py-2 text-sm text-gray-700 hover:underline ${isRTL ? "text-right" : "text-left"}`}
    >
      {children}
    </NavLink>
  );
};

const DropItem = ({ to, children }) => {
  const lang = useSelector((s) => s.locale.lang);
  const isRTL = lang === "ar";
  return (
    <NavLink
      to={to}
      className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 ${isRTL ? "text-right" : "text-left"}`}
    >
      {children}
    </NavLink>
  );
};

export default Navbar;
