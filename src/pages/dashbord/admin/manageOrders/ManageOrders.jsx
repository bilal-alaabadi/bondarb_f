import React, { useState } from 'react';
import { useDeleteOrderMutation, useGetAllOrdersQuery } from '../../../../redux/features/orders/orderApi';
import { formatDate } from '../../../../utils/formateDate';
import html2pdf from 'html2pdf.js';
import { useSelector } from 'react-redux';

const ManageOrders = () => {
    const { data: orders, error, isLoading, refetch } = useGetAllOrdersQuery();
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [viewOrder, setViewOrder] = useState(null);
    const [deleteOrder] = useDeleteOrderMutation();
    
    const lang = useSelector((state) => state.locale.lang);
    const isRTL = lang === 'ar';

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedOrder(null);
    };

    const handleDeleteOder = async (orderId) => {
        try {
            await deleteOrder(orderId).unwrap();
            alert(lang === 'ar' ? "تم حذف الطلب بنجاح" : "Order deleted successfully");
            refetch();
        } catch (error) {
            console.error(lang === 'ar' ? "فشل حذف الطلب:" : "Failed to delete order:", error);
        }
    };

    const handleViewOrder = (order) => {
        setViewOrder(order);
    };

    const handleCloseViewModal = () => {
        setViewOrder(null);
    };

    const handlePrintOrder = () => {
        window.print();
    };

    const handleDownloadPDF = () => {
        const element = document.getElementById('order-details');
        const options = {
            margin: [10, 10],
            filename: lang === 'ar' ? `طلب_${viewOrder._id}.pdf` : `order_${viewOrder._id}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        };
        html2pdf().from(element).set(options).save();
    };

    const handleContactWhatsApp = (phone) => {
        if (!phone) {
            alert(lang === 'ar' ? 'رقم الهاتف غير متوفر' : 'Phone number not available');
            return;
        }
        
        const cleanedPhone = phone.replace(/\D/g, '');
        
        const message = lang === 'ar' 
            ? `مرحباً ${viewOrder.customerName || 'عميلنا العزيز'}،
        
تفاصيل طلبك رقم: ${viewOrder.orderId}
تاريخ الطلب: ${formatDate(viewOrder.createdAt)}
المجموع النهائي: ${(viewOrder.amount || 0).toFixed(2)} ر.ع

المنتجات:
${viewOrder.products?.map(p => `- ${p.name} (${p.quantity}x ${(p.price || 0).toFixed(2)} ر.ع)`).join('\n')}

الرجاء تأكيد استلامك للطلب. شكراً لثقتكم بنا!`
            : `Hello ${viewOrder.customerName || 'Dear Customer'},
        
Your order details - Order ID: ${viewOrder.orderId}
Order Date: ${formatDate(viewOrder.createdAt)}
Total Amount: ${(viewOrder.amount || 0).toFixed(2)} OMR

Products:
${viewOrder.products?.map(p => `- ${p.name} (${p.quantity}x ${(p.price || 0).toFixed(2)} OMR)`).join('\n')}

Please confirm your order receipt. Thank you for your trust!`;
        
        window.open(`https://wa.me/${cleanedPhone}?text=${encodeURIComponent(message)}`, '_blank');
    };

    const formatPrice = (price) => {
        return (parseFloat(price) || 0).toFixed(2);
    };

    // الترجمة الديناميكية
    const translations = {
        // حالة التحميل والأخطاء
        loading: lang === 'ar' ? 'جار التحميل...' : 'Loading...',
        noOrders: lang === 'ar' ? 'لا توجد طلبات' : 'No orders available',
        
        // العناوين
        manageOrders: lang === 'ar' ? 'إدارة الطلبات' : 'Manage Orders',
        customer: lang === 'ar' ? 'العميل' : 'Customer',
        date: lang === 'ar' ? 'التاريخ' : 'Date',
        actions: lang === 'ar' ? 'الإجراءات' : 'Actions',
        orderNumber: lang === 'ar' ? 'رقم الطلب' : 'Order Number',
        
        // الأزرار
        viewDetails: lang === 'ar' ? 'عرض التفاصيل' : 'View Details',
        delete: lang === 'ar' ? 'حذف' : 'Delete',
        close: lang === 'ar' ? 'إغلاق' : 'Close',
        print: lang === 'ar' ? 'طباعة' : 'Print',
        downloadPDF: lang === 'ar' ? 'تحميل PDF' : 'Download PDF',
        contactWhatsApp: lang === 'ar' ? 'واتساب العميل' : 'Contact via WhatsApp',
        
        // نصوص المودال
        invoice: lang === 'ar' ? 'فاتورة الطلب' : 'Order Invoice',
        thankYou: lang === 'ar' ? 'شكراً لاختياركم متجرنا' : 'Thank you for choosing our store',
        invoiceNumber: lang === 'ar' ? 'رقم الفاتورة' : 'Invoice Number',
        invoiceDate: lang === 'ar' ? 'تاريخ الفاتورة' : 'Invoice Date',
        customerInfo: lang === 'ar' ? 'معلومات العميل' : 'Customer Information',
        shippingInfo: lang === 'ar' ? 'معلومات التوصيل' : 'Shipping Information',
        products: lang === 'ar' ? 'المنتجات المطلوبة' : 'Requested Products',
        invoiceSummary: lang === 'ar' ? 'ملخص الفاتورة' : 'Invoice Summary',
        
        // التفاصيل
        name: lang === 'ar' ? 'الاسم' : 'Name',
        phone: lang === 'ar' ? 'رقم الهاتف' : 'Phone Number',
        country: lang === 'ar' ? 'البلد' : 'Country',
        state: lang === 'ar' ? 'الولاية' : 'State',
        notes: lang === 'ar' ? 'ملاحظات' : 'Notes',
        noNotes: lang === 'ar' ? 'لا توجد ملاحظات' : 'No notes',
        item: lang === 'ar' ? '#' : '#',
        image: lang === 'ar' ? 'الصورة' : 'Image',
        product: lang === 'ar' ? 'المنتج' : 'Product',
        quantity: lang === 'ar' ? 'الكمية' : 'Quantity',
        price: lang === 'ar' ? 'السعر' : 'Price',
        total: lang === 'ar' ? 'المجموع' : 'Total',
        size: lang === 'ar' ? 'الحجم' : 'Size',
        color: lang === 'ar' ? 'اللون' : 'Color',
        
        // ملخص الفاتورة
        subtotal: lang === 'ar' ? 'الإجمالي الجزئي' : 'Subtotal',
        shippingFee: lang === 'ar' ? 'رسوم الشحن' : 'Shipping Fee',
        discount: lang === 'ar' ? 'خصم' : 'Discount',
        finalTotal: lang === 'ar' ? 'الإجمالي النهائي' : 'Final Total',
        
        // النصوص العامة
        notSpecified: lang === 'ar' ? 'غير محدد' : 'Not specified',
        imageNotAvailable: lang === 'ar' ? 'صورة غير متوفرة' : 'Image not available',
        productNotSpecified: lang === 'ar' ? 'منتج غير محدد' : 'Product not specified',
    };

    if (isLoading) return <div className="p-4 text-center">{translations.loading}</div>;
    if (error) return <div className="p-4 text-center text-red-500">{translations.noOrders}</div>;

    return (
        <div className="w-full p-2 md:p-4" dir={isRTL ? 'rtl' : 'ltr'}>
            <div className="bg-white rounded-lg shadow-md p-4 w-full">
                <h2 className="text-xl md:text-2xl font-semibold mb-4 text-center md:text-right">
                    {translations.manageOrders}
                </h2>
                
                {/* Mobile View - Cards */}
                <div className="md:hidden space-y-3">
                    {orders?.length > 0 ? (
                        orders.map((order, index) => (
                            <div key={index} className="border rounded-lg p-3 shadow-sm">
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <p className="text-xs text-gray-500">
                                            {translations.customer}: {order?.customerName || order?.email || translations.notSpecified}
                                        </p>
                                    </div>
                                    <div className={isRTL ? 'text-right' : 'text-left'}>
                                        <p className="text-xs text-gray-500">{formatDate(order?.updatedAt)}</p>
                                    </div>
                                </div>
                                
                                <div className="mt-3 flex justify-end gap-2">
                                    <button
                                        className="text-blue-500 hover:underline text-xs px-2 py-1 border border-blue-200 rounded"
                                        onClick={() => handleViewOrder(order)}
                                    >
                                        {translations.viewDetails}
                                    </button>
                                    <button
                                        className="text-red-500 hover:underline text-xs px-2 py-1 border border-red-200 rounded"
                                        onClick={() => handleDeleteOder(order?._id)}
                                    >
                                        {translations.delete}
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-4 text-gray-500">
                            {translations.noOrders}
                        </div>
                    )}
                </div>

                {/* Desktop View - Table */}
                <div className="hidden md:block w-full overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="py-3 px-4 border-b text-right w-1/6">
                                    {translations.orderNumber}
                                </th>
                                <th className="py-3 px-4 border-b text-right w-2/6">
                                    {translations.customer}
                                </th>
                                <th className="py-3 px-4 border-b text-right w-1/6">
                                    {translations.date}
                                </th>
                                <th className="py-3 px-4 border-b text-right w-2/6">
                                    {translations.actions}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders?.length > 0 ? (
                                orders.map((order, index) => (
                                    <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                                        <td className="py-3 px-4 border-b">{order?.orderId || '--'}</td>
                                        <td className="py-3 px-4 border-b">
                                            {order?.customerName || order?.email || translations.notSpecified}
                                        </td>
                                        <td className="py-3 px-4 border-b">{formatDate(order?.updatedAt)}</td>
                                        <td className="py-3 px-4 border-b">
                                            <div className="flex gap-3 justify-end">
                                                <button
                                                    className="text-blue-500 hover:underline text-sm px-3 py-1 border border-blue-200 rounded"
                                                    onClick={() => handleViewOrder(order)}
                                                >
                                                    {translations.viewDetails}
                                                </button>
                                                <button
                                                    className="text-red-500 hover:underline text-sm px-3 py-1 border border-red-200 rounded"
                                                    onClick={() => handleDeleteOder(order?._id)}
                                                >
                                                    {translations.delete}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="py-4 text-center text-gray-500">
                                        {translations.noOrders}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Order Details Modal */}
                {viewOrder && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 md:p-4 z-50">
                        <div className="bg-white p-4 md:p-6 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto print-modal" id="order-details" dir={isRTL ? 'rtl' : 'ltr'}>
                            <style>
                                {`
                                    @media print {
                                        body * {
                                            visibility: hidden;
                                        }
                                        .print-modal, .print-modal * {
                                            visibility: visible;
                                        }
                                        .print-modal {
                                            position: absolute;
                                            left: 0;
                                            top: 0;
                                            width: 100%;
                                            max-width: 100%;
                                            box-shadow: none;
                                            border: none;
                                            padding: 20px;
                                        }
                                        .print-modal button {
                                            display: none;
                                        }
                                        .print-header {
                                            display: flex;
                                            justify-content: space-between;
                                            align-items: center;
                                            margin-bottom: 20px;
                                            border-bottom: 1px solid #eee;
                                            padding-bottom: 10px;
                                        }
                                        .invoice-title {
                                            font-size: 24px;
                                            font-weight: bold;
                                            color: #333;
                                        }
                                        .invoice-meta {
                                            text-align: ${isRTL ? 'right' : 'left'};
                                        }
                                    }
                                `}
                            </style>
                            
                            <div className="print-header">
                                <div>
                                    <h1 className="invoice-title">{translations.invoice}</h1>
                                    <p className="text-gray-600">{translations.thankYou}</p>
                                </div>
                                <div className="invoice-meta">
                                    <p><strong>{translations.invoiceNumber}:</strong> #{viewOrder.orderId}</p>
                                    <p><strong>{translations.invoiceDate}:</strong> {formatDate(viewOrder.createdAt)}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <h3 className="font-bold text-base md:text-lg mb-2 border-b pb-2">
                                        {translations.customerInfo}
                                    </h3>
                                    <div className="space-y-1 text-sm">
                                        <p><strong>{translations.name}:</strong> {viewOrder.customerName || translations.notSpecified}</p>
                                        <p><strong>{translations.phone}:</strong> {viewOrder.customerPhone || translations.notSpecified}</p>
                                    </div>
                                </div>
                                
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <h3 className="font-bold text-base md:text-lg mb-2 border-b pb-2">
                                        {translations.shippingInfo}
                                    </h3>
                                    <div className="space-y-1 text-sm">
                                        <p><strong>{translations.country}:</strong> {viewOrder.country || translations.notSpecified}</p>
                                        <p><strong>{translations.state}:</strong> {viewOrder.wilayat || translations.notSpecified}</p>
                                        <p><strong>{translations.notes}:</strong> {viewOrder.description || translations.noNotes}</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="mb-6">
                                <h3 className="font-bold text-base md:text-lg mb-2 border-b pb-2">
                                    {translations.products}
                                </h3>
                                <div className="border rounded-lg overflow-hidden">
                                    <div className="hidden md:block">
                                        <table className="min-w-full">
                                            <thead className="bg-gray-100">
                                                <tr>
                                                    <th className="py-2 px-3 text-center w-12">{translations.item}</th>
                                                    <th className="py-2 px-3 text-center">{translations.image}</th>
                                                    <th className="py-2 px-3 text-right">{translations.product}</th>
                                                    <th className="py-2 px-3 text-center">{translations.quantity}</th>
                                                    <th className="py-2 px-3 text-left">{translations.price}</th>
                                                    <th className="py-2 px-3 text-left">{translations.total}</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {viewOrder.products?.map((product, index) => (
                                                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                                        <td className="py-2 px-3 text-center">{index + 1}</td>
                                                        <td className="py-2 px-3">
                                                            <img 
                                                                src={product.image || '/images/placeholder.jpg'} 
                                                                alt={product.name || translations.productNotSpecified} 
                                                                className="w-12 h-12 object-cover rounded mx-auto"
                                                                onError={(e) => {
                                                                    e.target.src = '/images/placeholder.jpg';
                                                                    e.target.alt = translations.imageNotAvailable;
                                                                }}
                                                            />
                                                        </td>
                                                        <td className="py-2 px-3">
                                                            <div>
                                                                <p className="font-medium text-sm">{product.name || translations.productNotSpecified}</p>
                                                                {product.selectedSize && (
                                                                    <p className="text-xs text-gray-500">{translations.size}: {product.selectedSize}</p>
                                                                )}
                                                                {product.selectedColor && (
                                                                    <p className="text-xs text-gray-500">{translations.color}: {product.selectedColor}</p>
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td className="py-2 px-3 text-center">{product.quantity || 0}</td>
                                                        <td className="py-2 px-3 text-left">{formatPrice(product.price)} {lang === 'ar' ? 'ر.ع' : 'OMR'}</td>
                                                        <td className="py-2 px-3 text-left font-medium">
                                                            {formatPrice((product.price || 0) * (product.quantity || 0))} {lang === 'ar' ? 'ر.ع' : 'OMR'}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Mobile Products View */}
                                    <div className="md:hidden">
                                        {viewOrder.products?.map((product, index) => (
                                            <div key={index} className="border-b p-3 last:border-b-0">
                                                <div className="flex gap-3">
                                                    <div className="flex-shrink-0">
                                                        <img 
                                                            src={product.image || '/images/placeholder.jpg'} 
                                                            alt={product.name || translations.productNotSpecified} 
                                                            className="w-12 h-12 object-cover rounded"
                                                            onError={(e) => {
                                                                e.target.src = '/images/placeholder.jpg';
                                                                e.target.alt = translations.imageNotAvailable;
                                                            }}
                                                        />
                                                    </div>
                                                    <div className="flex-grow">
                                                        <p className="font-medium text-sm">{product.name || translations.productNotSpecified}</p>
                                                        {product.selectedSize && (
                                                            <p className="text-xs text-gray-500">{translations.size}: {product.selectedSize}</p>
                                                        )}
                                                        {product.selectedColor && (
                                                            <p className="text-xs text-gray-500">{translations.color}: {product.selectedColor}</p>
                                                        )}
                                                        <div className="flex justify-between mt-1">
                                                            <span className="text-xs">{translations.quantity}: {product.quantity || 0}</span>
                                                            <span className="text-xs font-medium">{formatPrice((product.price || 0) * (product.quantity || 0))} {lang === 'ar' ? 'ر.ع' : 'OMR'}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            
                            <div className="bg-gray-50 p-4 rounded-lg mb-6">
                                <h3 className="font-bold text-base md:text-lg mb-3 border-b pb-2">
                                    {translations.invoiceSummary}
                                </h3>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between items-center">
                                        <span>{translations.subtotal}:</span>
                                        <span>{formatPrice(viewOrder.amount - viewOrder.shippingFee)} {lang === 'ar' ? 'ر.ع' : 'OMR'}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span>{translations.shippingFee}:</span>
                                        <span>{viewOrder.shippingFee} {lang === 'ar' ? 'ر.ع' : 'OMR'}</span>
                                    </div>
                                    {viewOrder.discount > 0 && (
                                        <div className="flex justify-between items-center text-red-600">
                                            <span>{translations.discount}:</span>
                                            <span>-{formatPrice(viewOrder.discount)} {lang === 'ar' ? 'ر.ع' : 'OMR'}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between items-center pt-2 border-t">
                                        <span className="font-bold">{translations.finalTotal}:</span>
                                        <span className="font-bold text-blue-600">{formatPrice(viewOrder.amount)} {lang === 'ar' ? 'ر.ع' : 'OMR'}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-2 justify-end">
                                <button
                                    className="bg-gray-500 text-white px-3 py-1 md:px-4 md:py-2 rounded-md hover:bg-gray-600 text-xs md:text-sm flex items-center gap-1"
                                    onClick={handleCloseViewModal}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z"/>
                                    </svg>
                                    {translations.close}
                                </button>
                                <button
                                    className="bg-blue-500 text-white px-3 py-1 md:px-4 md:py-2 rounded-md hover:bg-blue-600 text-xs md:text-sm flex items-center gap-1"
                                    onClick={handlePrintOrder}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M18 17v4h-12v-4h-4v-9c0-2.761 2.239-5 5-5h10c2.761 0 5 2.239 5 5v9h-4zm-10-1h8v1h-8v-1zm0-2h8v1h-8v-1zm-5-6v5h18v-5c0-1.656-1.344-3-3-3h-12c-1.656 0-3 1.344-3 3zm18 2h-2v-1h2v1z"/>
                                    </svg>
                                    {translations.print}
                                </button>
                                <button
                                    className="bg-green-500 text-white px-3 py-1 md:px-4 md:py-2 rounded-md hover:bg-green-600 text-xs md:text-sm flex items-center gap-1"
                                    onClick={handleDownloadPDF}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M14 2v17h2v-7h3v7h2v-17h-7zm-9 0v17h2v-7h3v7h2v-17h-9z"/>
                                    </svg>
                                    {translations.downloadPDF}
                                </button>
                                <button
                                    className="bg-green-600 text-white px-3 py-1 md:px-4 md:py-2 rounded-md hover:bg-green-700 text-xs md:text-sm flex items-center gap-1"
                                    onClick={() => handleContactWhatsApp(viewOrder.customerPhone)}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M17.507 14.307l-.009.075c-2.199-1.096-2.429-1.242-2.713-.816-.197.295-.771.964-.944 1.162-.175.195-.349.21-.646.075-.3-.15-1.263-.465-2.403-1.485-.888-.795-1.484-1.77-1.66-2.07-.293-.506.32-.578.878-1.634.1-.21.049-.375-.025-.524-.075-.15-.672-1.62-.922-2.206-.24-.584-.487-.51-.672-.51-.576-.05-.997-.042-1.368.344-1.614 1.774-1.207 3.604.174 5.55 2.714 3.552 4.16 4.206 6.804 5.114.714.227 1.365.195 1.88.121.574-.091 1.754-.721 2.002-1.426.255-.705.255-1.29.18-1.425-.074-.135-.279-.21-.574-.345z"/>
                                        <path d="M20.52 3.449c-7.689-7.433-20.414-2.042-20.419 8.444 0 2.096.549 4.14 1.595 5.945l-1.696 6.162 6.335-1.652c7.905 4.27 17.661-1.4 17.661-10.447 0-3.176-1.24-6.165-3.495-8.411zm1.482 8.417c0 7.133-8.72 11.3-14.172 6.346l-.336-.209-3.548.925.964-3.504-.239-.375c-4.124-6.565 3.185-15.19 10.042-13.282 3.096.85 5.609 3.431 6.352 6.646.544 2.322.177 4.691-.959 6.657z"/>
                                    </svg>
                                    {translations.contactWhatsApp}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageOrders;