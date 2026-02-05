import React from 'react';
import { useSelector } from 'react-redux';
import { Pie, Line } from 'react-chartjs-2';
import 'chart.js/auto';

const AdminStatsChart = ({ stats }) => {
  const lang = useSelector((state) => state.locale.lang);
  const isRTL = lang === 'ar';

  const pieData = {
    labels:
      lang === 'ar'
        ? ['إجمالي الطلبات', 'إجمالي المنتجات', 'إجمالي التقييمات', 'إجمالي المستخدمين']
        : ['Total Orders', 'Total Products', 'Total Reviews', 'Total Users'],
    datasets: [
      {
        label: lang === 'ar' ? 'إحصائيات الإدارة' : 'Admin Statistics',
        data: [
          stats?.totalOrders,
          stats?.totalProducts,
          stats?.totalReviews,
          stats?.totalUsers,
        ],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
      },
    ],
  };

  const data = new Array(12).fill(0);
  stats?.monthlyEarnings.forEach((entry) => {
    data[entry.month - 1] = entry.earnings;
  });

  const lineData = {
    labels:
      lang === 'ar'
        ? ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر']
        : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    datasets: [
      {
        label: lang === 'ar' ? 'الأرباح الشهرية' : 'Monthly Earnings',
        data,
        fill: false,
        backgroundColor: '#36A2EB',
        borderColor: '#36A2EB',
        tension: 0.1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div className="mt-12 space-y-12" dir={isRTL ? 'rtl' : 'ltr'}>
      <h2 className="text-xl font-semibold mb-4">
        {lang === 'ar' ? 'نظرة عامة على إحصائيات المسؤول' : 'Admin Statistics Overview'}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="max-h-96 md:h-96 w-full">
          <Pie data={pieData} options={options} />
        </div>

        <div className="max-h-96 md:h-96 w-full">
          <Line data={lineData} options={options} />
        </div>
      </div>
    </div>
  );
};

export default AdminStatsChart;
