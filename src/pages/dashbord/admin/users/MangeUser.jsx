import React, { useState } from 'react';
import { useDeleteUserMutation, useGetUserQuery } from '../../../../redux/features/auth/authApi';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import UpdateUserModal from './UpdateUserModal';

const ManageUser = () => {
  const lang = useSelector((state) => state.locale.lang);
  const isRTL = lang === 'ar';

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const { data: users = [], error, isLoading, refetch } = useGetUserQuery();
  const [deleteUser] = useDeleteUserMutation();

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      lang === 'ar'
        ? 'هل أنت متأكد أنك تريد حذف هذا المستخدم؟'
        : 'Are you sure you want to delete this user?'
    );
    if (!confirmDelete) return;

    try {
      await deleteUser(id).unwrap();
      alert(
        lang === 'ar'
          ? 'تم حذف المستخدم بنجاح!'
          : 'User deleted successfully!'
      );
      refetch();
    } catch (error) {
      console.error('Failed to delete user', error);
    }
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  return (
    <>
      {isLoading && (
        <div>
          {lang === 'ar' ? 'جاري التحميل...' : 'Loading...'}
        </div>
      )}

      {error && (
        <div>
          {lang === 'ar'
            ? 'حدث خطأ أثناء تحميل بيانات المستخدمين.'
            : 'Error loading users data.'}
        </div>
      )}

      <section
        className="py-4 bg-gray-100 w-full"
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        <div className="container mx-auto px-2 sm:px-4">
          <div className="bg-white shadow-lg rounded-lg">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
              <h3 className="text-lg font-semibold mb-2 sm:mb-0">
                {lang === 'ar' ? 'جميع المستخدمين' : 'All Users'}
              </h3>

              <button className="bg-blue-500 text-white px-3 py-1 rounded text-sm">
                {lang === 'ar' ? 'عرض الكل' : 'View All'}
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse bg-white shadow-md rounded-lg text-xs sm:text-sm">
                <thead>
                  <tr className="bg-gray-200 text-center">
                    <th className="p-2">
                      {lang === 'ar' ? 'رقم' : '#'}
                    </th>
                    <th className="p-2">
                      {lang === 'ar' ? 'البريد الإلكتروني' : 'Email'}
                    </th>
                    <th className="p-2">
                      {lang === 'ar' ? 'الدور' : 'Role'}
                    </th>
                    <th className="p-2">
                      {lang === 'ar' ? 'تعديل' : 'Edit'}
                    </th>
                    <th className="p-2">
                      {lang === 'ar' ? 'إجراء' : 'Action'}
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {users &&
                    users.map((user, index) => (
                      <tr key={index} className="border-b text-center">
                        <td className="p-2">{index + 1}</td>

                        <td className="p-2">
                          {user?.email ||
                            (lang === 'ar' ? 'غير متوفر' : 'N/A')}
                        </td>

                        <td className="p-2">
                          <span
                            className={`rounded-full py-1 px-3 ${
                              user?.role === 'admin'
                                ? 'bg-indigo-500 text-white'
                                : 'bg-amber-300'
                            }`}
                          >
                            {user?.role === 'admin'
                              ? lang === 'ar'
                                ? 'مسؤول'
                                : 'Admin'
                              : lang === 'ar'
                              ? 'مستخدم'
                              : 'User'}
                          </span>
                        </td>

                        <td className="p-2 font-bold text-lg text-blue-500 cursor-pointer">
                          <button
                            onClick={() => handleEdit(user)}
                            className="hover:text-red-500"
                          >
                            {lang === 'ar' ? 'تعديل' : 'Edit'}
                          </button>
                        </td>

                        <td className="p-2">
                          <button
                            onClick={() => handleDelete(user?._id)}
                            className="bg-red-500 text-white px-2 py-1 rounded text-xs sm:text-sm"
                          >
                            {lang === 'ar' ? 'حذف' : 'Delete'}
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {isModalOpen && (
        <UpdateUserModal
          user={selectedUser}
          onClose={handleCloseModal}
          onRoleUpdate={refetch}
        />
      )}
    </>
  );
};

export default ManageUser;
