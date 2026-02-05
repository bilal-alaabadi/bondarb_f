import React from 'react';
import { useLogoutUserMutation } from '../../redux/features/auth/authApi';
import { useDispatch, useSelector } from 'react-redux';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { logout } from '../../redux/features/auth/authSlice';

const AdminDashboard = () => {
  const lang = useSelector((s) => s.locale.lang);
  const isRTL = lang === 'ar';

  const navItems = [
    {
      path: '/dashboard/admin',
      label: lang === 'ar' ? 'لوحة القيادة' : 'Dashboard',
    },
    {
      path: '/dashboard/add-product',
      label: lang === 'ar' ? 'إضافة منتج' : 'Add Product',
    },
    {
      path: '/dashboard/manage-products',
      label: lang === 'ar' ? 'إدارة المنتجات' : 'Manage Products',
    },
    {
      path: '/dashboard/users',
      label: lang === 'ar' ? 'المستخدمين' : 'Users',
    },
    {
      path: '/dashboard/manage-orders',
      label: lang === 'ar' ? 'إدارة الطلبات' : 'Manage Orders',
    },
  ];

  const [logoutUser] = useLogoutUserMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutUser().unwrap();
      dispatch(logout());
      navigate('/');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  return (
    <div
      className="space-y-5 bg-white p-8 md:h-screen flex flex-col justify-between"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div>
        <div className="nav__logo">
          <Link to="/">
            <span>.</span>
            {lang === 'ar' ? 'متجر' : 'Store'}
          </Link>
          <p className="text-xs italic">
            {lang === 'ar' ? 'لوحة تحكم المشرف' : 'Admin Control Panel'}
          </p>
        </div>

        <hr className="mt-5" />

        <ul className="space-y-5 pt-5">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                end
                className={({ isActive }) =>
                  isActive
                    ? 'text-blue-600 font-bold'
                    : 'text-black'
                }
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>

      <div className="mb-3">
        <hr className="mb-3" />
        <button
          onClick={handleLogout}
          className="text-white bg-[#3D4B2E] font-medium px-5 py-1 rounded-sm"
        >
          {lang === 'ar' ? 'تسجيل الخروج' : 'Logout'}
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;
