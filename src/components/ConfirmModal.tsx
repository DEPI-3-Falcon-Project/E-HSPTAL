import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ReportData } from '../types';
import { useNavigate } from 'react-router-dom';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
  onConfirm: (data: ReportData) => void;
  data: ReportData;
}

// ترجمة للمفاتيح الإضافية التي قد تظهر في البلاغ
const extrasKeyTranslations: { [key: string]: string } = {
  crimeType: 'نوع الجريمة',
  place: 'مكان الحادث',
  involvedCount: 'عدد المتورطين',
  attachment: 'المرفق',
  otherCrimeType: 'نوع الجريمة (أخرى)',
  otherPlace: 'مكان الحادث (أخرى)',
  // يمكنك إضافة المزيد من الترجمات حسب الحاجة
};

const ConfirmModal: React.FC<ConfirmModalProps> = ({ 
  isOpen, 
  onClose, 
  onEdit, 
  onConfirm, 
  data 
}) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm(data);
  };

  const handleCancel = () => {
    onClose();
    navigate('/report');
  };

  const getTranslatedKey = (key: string): string => {
    return extrasKeyTranslations[key] || key.replace(/([A-Z])/g, ' $1').trim();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-white/60 backdrop-blur-md bg-opacity-50 flex items-center justify-center z-50 p-4">
        <motion.div 
          className="bg-white rounded-2xl shadow-xl w-full max-w-md"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.2 }}
        >
          <div className="p-6" dir="rtl">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">تأكيد البلاغ</h2>
            
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <h3 className="font-semibold text-gray-700 mb-2">تفاصيل البلاغ</h3>
              
              <div className="space-y-2">
                <div>
                  <span className="text-gray-600 text-sm">الاسم:</span>
                  <p className="font-medium">{data.name}</p>
                </div>
                
                <div>
                  <span className="text-gray-600 text-sm">وسيلة الاتصال:</span>
                  <p className="font-medium">{data.contact}</p>
                </div>
                
                <div>
                  <span className="text-gray-600 text-sm">الموقع:</span>
                  <p className="font-medium">{data.location}</p>
                </div>
                
                <div>
                  <span className="text-gray-600 text-sm">الوصف:</span>
                  <p className="font-medium">{data.description}</p>
                </div>
                
                <div>
                  <span className="text-gray-600 text-sm">النوع:</span>
                  <p className="font-medium">{data.type}</p>
                </div>
                
                {data.extras && Object.keys(data.extras).length > 0 && (
                  <div>
                    <span className="text-gray-600 text-sm">معلومات إضافية:</span>
                    <div className="mt-1">
                      {Object.entries(data.extras).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span className="text-gray-600">{getTranslatedKey(key)}:</span>
                          <span className="font-medium">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row-reverse gap-3">
              <button
                onClick={handleConfirm}
                className="flex-1 bg-red-600 text-white py-3 px-4 rounded-xl font-medium hover:bg-red-700 transition-colors"
              >
                تأكيد
              </button>
              
              <button
                onClick={onEdit}
                className="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-xl font-medium hover:bg-gray-300 transition-colors"
              >
                تعديل
              </button>
              
              <button
                onClick={handleCancel}
                className="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-xl font-medium hover:bg-gray-300 transition-colors"
              >
                إلغاء
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ConfirmModal;