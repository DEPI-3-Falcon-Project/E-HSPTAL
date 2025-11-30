import React, { useState, useEffect, useCallback } from 'react';
import MedicalSearchLoading from './MedicalSearchLoading';

interface RadiusSelectorWithLoadingProps {
  onRadiusSelect: (radius: number) => void;
  onLoadingComplete?: () => void;
  isLoading?: boolean;
}

const RadiusSelectorWithLoading: React.FC<RadiusSelectorWithLoadingProps> = ({ onRadiusSelect, onLoadingComplete, isLoading = false }) => {
  const [showLoading, setShowLoading] = useState(false);
  const [selectedRadius, setSelectedRadius] = useState<number | null>(null);

  const handleLoadingComplete = useCallback(() => {
    console.log('✅ Loading completed, hiding loading screen');
    setShowLoading(false);
    onLoadingComplete?.();
  }, [onLoadingComplete]);

  // Monitor isLoading prop to control loading screen visibility
  useEffect(() => {
    if (isLoading && selectedRadius) {
      setShowLoading(true);
    } else if (!isLoading && showLoading) {
      // Keep loading screen visible until onLoadingComplete is called
      console.log('🔄 isLoading became false, but keeping loading screen visible');
      // Auto-complete after a short delay if loading is false
      setTimeout(() => {
        if (showLoading) {
          console.log('🔄 Auto-completing loading screen after timeout');
          handleLoadingComplete();
        }
      }, 3000);
    }
  }, [isLoading, selectedRadius, showLoading, handleLoadingComplete]);

  const handleRadiusClick = (radius: number) => {
    console.log('🎯 Radius selected:', radius);
    setSelectedRadius(radius);
    setShowLoading(true);
    console.log('🔄 Loading screen shown');
    // Call onRadiusSelect immediately to start the search
    onRadiusSelect(radius);
  };

  if (showLoading) {
    console.log('🔄 Rendering MedicalSearchLoading with isLoading:', isLoading);
    return <MedicalSearchLoading isVisible={true} onComplete={handleLoadingComplete} radius={selectedRadius!} isLoading={isLoading} />;
  }

  return (
    <div className="bg-white rounded-2xl p-8 shadow-xl max-w-md mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">اختر نطاق البحث</h3>
        <p className="text-gray-600">حدد المسافة للبحث عن المستشفيات القريبة منك</p>
      </div>

      <div className="space-y-4">
        {[10, 20, 30].map((radius) => (
          <button
            key={radius}
            onClick={() => handleRadiusClick(radius)}
            className="w-full p-4 border-2 border-red-200 rounded-xl hover:border-red-400 hover:bg-red-50 transition-all duration-200 group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center group-hover:bg-red-200 transition-colors">
                  <span className="text-red-600 font-bold">{radius}</span>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{radius} كيلومتر</p>
                  <p className="text-sm text-gray-500">نطاق البحث</p>
                </div>
              </div>
              <svg className="w-5 h-5 text-gray-400 group-hover:text-red-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>
        ))}
      </div>

      <div className="mt-6 p-4 bg-red-50 rounded-lg">
        <div className="flex items-center gap-2 text-red-700">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
          <span className="text-sm font-medium">سيتم البحث في جميع المستشفيات والمراكز الطبية</span>
        </div>
      </div>
    </div>
  );
};

export default RadiusSelectorWithLoading;
