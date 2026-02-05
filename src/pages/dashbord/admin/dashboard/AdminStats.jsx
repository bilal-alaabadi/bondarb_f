import React from 'react';
import { useSelector } from 'react-redux';

const AdminStats = ({ stats }) => {
  const lang = useSelector((state) => state.locale.lang);
  const isRTL = lang === 'ar';

  return (
    <div className="my-5 space-y-4" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4 sm:grid-cols-2 grid-cols-1">
        <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200 hover:scale-105 transition-all duration-200 cursor-pointer">
          <h2 className="text-xl font-semibold mb-2">
            {lang === 'ar' ? 'جميع المستخدمين' : 'Total Users'}
          </h2>
          <p className="text-2xl font-bold">{stats?.totalUsers}</p>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200 hover:scale-105 transition-all duration-200 cursor-pointer">
          <h2 className="text-xl font-semibold mb-2">
            {lang === 'ar' ? 'إجمالي المنتجات' : 'Total Products'}
          </h2>
          <p className="text-2xl font-bold">{stats?.totalProducts}</p>
        </div>
      </div>
    </div>
  );
};

export default AdminStats;
