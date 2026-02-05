import React, { useEffect, useState } from 'react';

const UpdateImag = ({ name, id, initialImages = [], setImages, setKeepImages }) => {
  const [currentImages, setCurrentImages] = useState([]); // روابط حالية
  const [newFiles, setNewFiles] = useState([]);           // ملفات جديدة
  const [newPreviews, setNewPreviews] = useState([]);     // معاينات

  useEffect(() => {
    const curr = Array.isArray(initialImages) ? initialImages : [];
    setCurrentImages(curr);
    if (typeof setKeepImages === 'function') setKeepImages(curr);
  }, [initialImages, setKeepImages]);

  const handleFilesChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const updatedFiles = [...newFiles, ...files];
    setNewFiles(updatedFiles);
    if (typeof setImages === 'function') setImages(updatedFiles);

    const previews = files.map((f) => URL.createObjectURL(f));
    setNewPreviews((prev) => [...prev, ...previews]);

    e.target.value = '';
  };

  const removeCurrentImage = (url) => {
    const updated = currentImages.filter((u) => u !== url);
    setCurrentImages(updated);
    if (typeof setKeepImages === 'function') setKeepImages(updated);
  };

  // 🔼 تحريك الصورة للأعلى
  const moveImageUp = (index) => {
    if (index === 0) return;
    const updated = [...currentImages];
    [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
    setCurrentImages(updated);
    setKeepImages(updated);
  };

  // 🔽 تحريك الصورة للأسفل
  const moveImageDown = (index) => {
    if (index === currentImages.length - 1) return;
    const updated = [...currentImages];
    [updated[index + 1], updated[index]] = [updated[index], updated[index + 1]];
    setCurrentImages(updated);
    setKeepImages(updated);
  };

  const removeNewFileByIndex = (idx) => {
    const updatedFiles = newFiles.filter((_, i) => i !== idx);
    setNewFiles(updatedFiles);
    if (typeof setImages === 'function') setImages(updatedFiles);

    setNewPreviews((prev) => prev.filter((_, i) => i !== idx));
  };

  return (
    <div className="text-right">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        الصور
      </label>

      {/* الصور الحالية */}
      {currentImages.length > 0 && (
        <div className="mb-3">
          <p className="text-sm text-gray-600 mb-1">
            الصور الحالية (يمكنك حذفها أو تغيير ترتيبها):
          </p>

          <div className="flex flex-wrap gap-3">
            {currentImages.map((url, idx) => (
              <div key={`curr-${idx}`} className="relative w-24">
                <img
                  src={url}
                  alt={`current-${idx}`}
                  className="w-24 h-24 object-cover rounded border"
                  onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/100')}
                />

                {/* حذف */}
                <button
                  type="button"
                  onClick={() => removeCurrentImage(url)}
                  className="absolute -top-2 -left-2 w-7 h-7 rounded-full bg-red-600 text-white text-sm font-bold flex items-center justify-center shadow"
                >
                  ×
                </button>

                {/* أزرار الترتيب */}
                <div className="flex justify-center gap-1 mt-1">
                  <button
                    type="button"
                    onClick={() => moveImageUp(idx)}
                    disabled={idx === 0}
                    className="px-1 text-xs border rounded disabled:opacity-40"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => moveImageDown(idx)}
                    disabled={idx === currentImages.length - 1}
                    className="px-1 text-xs border rounded disabled:opacity-40"
                  >
                    ↓
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* اختيار ملفات جديدة */}
      <input
        type="file"
        accept="image/*"
        multiple
        name={name}
        id={id}
        onChange={handleFilesChange}
        className="block w-full text-sm text-gray-900 border border-gray-300 rounded-md cursor-pointer
          file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm
          file:bg-gray-100 hover:file:bg-gray-200"
      />

      {/* معاينة الصور الجديدة */}
      {newPreviews.length > 0 && (
        <div className="mt-3">
          <p className="text-sm text-gray-600 mb-1">
            معاينة الصور الجديدة (يمكنك إزالة أي صورة قبل الحفظ):
          </p>
          <div className="flex flex-wrap gap-3">
            {newPreviews.map((src, idx) => (
              <div key={`new-${idx}`} className="relative">
                <img
                  src={src}
                  alt={`new-${idx}`}
                  className="w-24 h-24 object-cover rounded border"
                />
                <button
                  type="button"
                  onClick={() => removeNewFileByIndex(idx)}
                  className="absolute -top-2 -left-2 w-7 h-7 rounded-full bg-red-600 text-white text-sm font-bold flex items-center justify-center shadow"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UpdateImag;
