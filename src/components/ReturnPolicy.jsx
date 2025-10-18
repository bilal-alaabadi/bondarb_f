import React from "react";
import { useSelector } from "react-redux";

const ReturnPolicy = () => {
  const lang = useSelector((s) => s.locale.lang);
  const isRTL = lang === "ar";

  const EMAIL = "Bondarabia1@gmail.com";
  const DISPLAY_PHONE = "+968 9271 2374"; // يُعرض كما هو
  const WHATSAPP_PHONE = "96892712374";   // للربط مع wa.me

  // نصوص حسب اللغة
  const t = isRTL
    ? {
        title: "سياسة الاسترجاع والاستبدال",
        intro1:
          "مرحبًا بكم في سياسة الاسترجاع والاستبدال الخاصة بعلامة BOND.",
        intro2:
          "نسعى لتقديم تجربة تسوق آمنة ومرضية. البنود التالية توضّح آلية الاسترجاع والاستبدال.",
        timeframe_h: "الفترة الزمنية",
        timeframe_p:
          "نقبل طلبات الاسترجاع أو الاستبدال خلال 15 يومًا من تاريخ استلام الطلب.",
        condition_h: "حالة المنتج",
        condition_list: [
          "أن يكون غير مفتوح ولم يتم استخدامه.",
          "في تغليفه الأصلي غير متضرر مع جميع الملحقات والملصقات.",
          "إرفاق إثبات الشراء (فاتورة/رقم الطلب).",
        ],
        exceptions_h: "الحالات غير المؤهلة",
        exceptions_p:
          "لأسباب صحية وسلامة، لا نقبل استرجاع/استبدال المنتجات المفتوحة أو المستخدمة، أو المتضررة بسبب سوء التخزين/الاستخدام.",
        damaged_h: "المنتجات التالفة أو غير المطابقة",
        damaged_p:
          "في حال استلام منتج تالف أو غير مطابق، يرجى التواصل خلال 48 ساعة من الاستلام مع صور واضحة للمشكلة ورقم الطلب.",
        shipping_h: "تكاليف الشحن",
        shipping_p:
          "إذا كان الخطأ من جانبنا (منتج تالف/خاطئ)، فإن BOND تتحمل تكاليف الشحن. في غير ذلك، يتحمل العميل تكاليف الشحن ذهابًا وإيابًا.",
        steps_h: "طريقة تقديم الطلب",
        steps_list: [
          "التواصل معنا عبر البريد أو الواتساب مع رقم الطلب والتفاصيل.",
          "نقوم بمراجعة الطلب وإبلاغكم بالقبول وتعليمات الشحن.",
          "بعد استلام المنتج وفحصه، يتم الاستبدال أو الاسترجاع حسب سياسة الدفع.",
        ],
        brand_line: "BOND — سلطنة عُمان | Oman",
        email_label: "البريد الإلكتروني",
        phone_label: "الهاتف",
      }
    : {
        title: "Return & Exchange Policy",
        intro1: "Welcome to BOND Return & Exchange Policy.",
        intro2:
          "We aim to provide a safe and satisfying shopping experience. The terms below explain how returns and exchanges work.",
        timeframe_h: "Timeframe",
        timeframe_p:
          "You may request a return or exchange within 15 days from the delivery date.",
        condition_h: "Item Condition",
        condition_list: [
          "Must be unopened and unused.",
          "In original, undamaged packaging with all accessories/tags.",
          "Include proof of purchase (invoice/order number).",
        ],
        exceptions_h: "Non-Returnable Items",
        exceptions_p:
          "For hygiene and safety reasons, opened or used items, or items damaged due to misuse/improper storage, cannot be returned/exchanged.",
        damaged_h: "Damaged or Incorrect Items",
        damaged_p:
          "If you receive a damaged or incorrect item, please contact us within 48 hours of delivery with clear photos and your order number.",
        shipping_h: "Shipping Costs",
        shipping_p:
          "If the issue is on our side (damaged/incorrect item), BOND will cover shipping costs. Otherwise, the customer covers round-trip shipping.",
        steps_h: "How to Request",
        steps_list: [
          "Contact us via email or WhatsApp with your order number and details.",
          "We’ll review and share approval plus shipping instructions.",
          "After we receive and inspect the item, we’ll process an exchange or refund per payment policy.",
        ],
        brand_line: "BOND — Sultanate of Oman | Oman",
        email_label: "Email",
        phone_label: "Phone",
      };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div
        className="max-w-3xl mx-auto bg-white p-6 md:p-8 rounded-lg shadow-sm"
        dir={isRTL ? "rtl" : "ltr"}
      >
        {/* العنوان */}
        <h1 className="text-2xl md:text-3xl font-bold text-center text-[#9B2D1F] mb-8">
          {t.title}
        </h1>

        {/* مقدمة */}
        <div className={`${isRTL ? "text-right" : "text-left"} mb-6`}>
          <p className="text-gray-800 text-lg mb-2">{t.intro1}</p>
          <p className="text-gray-600">{t.intro2}</p>
        </div>

        {/* البنود */}
        <div className={`${isRTL ? "text-right" : "text-left"} space-y-6`}>
          {/* 15 يوم */}
          <div className="border-b border-gray-100 pb-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {t.timeframe_h}
            </h3>
            <p className="text-gray-700 leading-relaxed">{t.timeframe_p}</p>
          </div>

          {/* غير مفتوح */}
          <div className="border-b border-gray-100 pb-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {t.condition_h}
            </h3>
            <ul
              className={`list-disc ${
                isRTL ? "pr-5" : "pl-5"
              } text-gray-700 leading-relaxed space-y-1`}
            >
              {t.condition_list.map((li, idx) => (
                <li key={idx}>{li}</li>
              ))}
            </ul>
          </div>

          {/* استثناءات */}
          <div className="border-b border-gray-100 pb-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {t.exceptions_h}
            </h3>
            <p className="text-gray-700 leading-relaxed">{t.exceptions_p}</p>
          </div>

          {/* تالف/خاطئ خلال 48 ساعة */}
          <div className="border-b border-gray-100 pb-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {t.damaged_h}
            </h3>
            <p className="text-gray-700 leading-relaxed">{t.damaged_p}</p>
          </div>

          {/* الشحن */}
          <div className="border-b border-gray-100 pb-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {t.shipping_h}
            </h3>
            <p className="text-gray-700 leading-relaxed">{t.shipping_p}</p>
          </div>

          {/* خطوات الطلب */}
          <div className="pb-2">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {t.steps_h}
            </h3>
            <ol
              className={`list-decimal ${
                isRTL ? "pr-5" : "pl-5"
              } text-gray-700 leading-relaxed space-y-1`}
            >
              {t.steps_list.map((li, idx) => (
                <li key={idx}>{li}</li>
              ))}
            </ol>
          </div>
        </div>

        {/* تواصل */}
        {/* <div className="mt-8 bg-gray-50 border border-gray-100 rounded-md p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="text-gray-700">{t.brand_line}</div>
          <div className="flex flex-wrap items-center gap-4">
            <a
              href={`mailto:${"Bondarabia1@gmail.com"}`}
              className="text-[#9B2D1F] hover:underline"
              title={t.email_label}
            >
              {EMAIL}
            </a>
            <span className="text-gray-300">|</span>
            <a
              href={`https://wa.me/${WHATSAPP_PHONE}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#0ea5e9] hover:underline"
              title={t.phone_label}
            >
              {DISPLAY_PHONE}
            </a>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default ReturnPolicy;
