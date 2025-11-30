import React from 'react';

interface LocationPermissionModalProps {
  isOpen: boolean;
  onAllow: () => void;
  onDeny: () => void;
}

const LocationPermissionModal: React.FC<LocationPermissionModalProps> = ({ isOpen, onAllow, onDeny }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white/20 backdrop-blur-md bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 max-w-md mx-4 text-center shadow-2xl">
        <div className="mb-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">تحديد موقعك</h3>
          <p className="text-gray-600 text-sm leading-relaxed mb-4">
            نحتاج إلى تحديد موقعك الحالي للعثور على أقرب المستشفيات والمراكز الطبية لك
          </p>
          
          {/* Simple info */}
          <div className="bg-red-50 rounded-lg p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
              <span className="text-red-700 font-medium text-sm">سيتم البحث عن أقرب المستشفيات لك</span>
            </div>
            <p className="text-red-600 text-xs">
              نحتاج إلى تحديد موقعك للعثور على أفضل الخدمات الطبية القريبة
            </p>
          </div>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={onDeny}
            className="flex-1 px-6 py-3 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
          >
            رفض
          </button>
          <button
            onClick={onAllow}
            className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            السماح
          </button>
        </div>
      </div>
    </div>
  );
};

export default LocationPermissionModal;