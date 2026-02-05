import React from 'react';
import { useSelector } from 'react-redux';
import { useGetAdminStatsQuery } from '../../../../redux/features/stats/statsApi';
import AdminStats from './AdminStats';
import AdminStatsChart from './AdminStatsChart';

const AdminDMain = () => {
  const { user } = useSelector((state) => state.auth);
  const lang = useSelector((state) => state.locale.lang);
  const isRTL = lang === 'ar';

  const { data: stats, error, isLoading } = useGetAdminStatsQuery();

  if (isLoading) {
    return <div>{lang === 'ar' ? 'جاري التحميل…' : 'Loading…'}</div>;
  }

  if (!stats) {
    return <div>{lang === 'ar' ? 'لم يتم العثور على أي إحصائيات' : 'No statistics found'}</div>;
  }

  if (error) {
    return <div>{lang === 'ar' ? 'فشل تحميل الإحصائيات!' : 'Failed to load statistics!'}</div>;
  }

  return (
    <div className="p-6" dir={isRTL ? 'rtl' : 'ltr'}>
      <div>
        <h1 className="text-2xl font-semibold mb-4">
          {lang === 'ar' ? 'لوحة تحكم المشرف' : 'Admin Dashboard'}
        </h1>

        <p className="text-gray-500">
          {lang === 'ar'
            ? `مرحبًا ${user?.username} في لوحة تحكم الإدارة.`
            : `Welcome ${user?.username} to the admin dashboard.`}
        </p>

        <AdminStats stats={stats} />
        <AdminStatsChart stats={stats} />
      </div>
    </div>
  );
};

export default AdminDMain;
