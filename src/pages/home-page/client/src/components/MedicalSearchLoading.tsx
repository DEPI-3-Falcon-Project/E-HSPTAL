import React, { useState, useEffect } from 'react';
import { Heart, MapPin, Shield, CheckCircle, X } from 'lucide-react';

interface MedicalSearchLoadingProps {
  isVisible: boolean;
  onComplete: () => void;
  onCancel?: () => void;
  radius: number;
  isLoading?: boolean;
  dataLoaded?: boolean;
  mapLoaded?: boolean;
  hasResults?: boolean;
}

const MedicalSearchLoading: React.FC<MedicalSearchLoadingProps> = ({
  isVisible,
  onComplete,
  onCancel,
  radius,
  isLoading = true,
  dataLoaded = false,
  mapLoaded = false,
  hasResults = false
}) => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const steps = [
    {
      icon: MapPin,
      title: "البحث عن المراكز الطبية",
      description: "نبحث في نطاق " + radius + " كم عن أفضل الخدمات الطبية"
    },
    {
      icon: Shield,
      title: "فحص جودة الخدمات",
      description: "نتأكد من جودة وموثوقية المراكز الطبية"
    },
    {
      icon: Heart,
      title: "ترتيب النتائج",
      description: "نرتب النتائج حسب المسافة وجودة الخدمة"
    }
  ];

  const quranicVerses = [
    "وَنُنَزِّلُ مِنَ الْقُرْآنِ مَا هُوَ شِفَاءٌ وَرَحْمَةٌ لِّلْمُؤْمِنِينَ",
    "وَإِذَا مَرِضْتُ فَهُوَ يَشْفِينِ",
    "وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا",
    "وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ"
  ];

  const [currentVerse, setCurrentVerse] = useState(0);

  useEffect(() => {
    if (!isVisible) return;

    const verseInterval = setInterval(() => {
      setCurrentVerse(prev => (prev + 1) % quranicVerses.length);
    }, 4000);

    return () => {
      clearInterval(verseInterval);
    };
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) return;

    const stepInterval = setInterval(() => {
      setCurrentStep(prev => prev === 3 ? 1 : prev + 1);
    }, 3000);

    return () => {
      clearInterval(stepInterval);
    };
  }, [isVisible]);

  // Watch for loading completion
  useEffect(() => {
    console.log('🔄 MedicalSearchLoading useEffect:', { 
      isLoading, 
      isVisible, 
      showSuccess, 
      dataLoaded, 
      mapLoaded, 
      hasResults,
      radius
    });
    
    // Only show success when data and map are actually loaded AND we have results
    if (isVisible && !showSuccess && dataLoaded && mapLoaded && hasResults) {
      console.log('✅ Data and map loaded with results, showing success message...');
      setShowSuccess(true);
      setTimeout(() => {
        onComplete();
      }, 1500); // Reduced time for faster completion
    } else if (isVisible && !showSuccess && dataLoaded && mapLoaded && !hasResults) {
      console.log('⚠️ Data and map loaded but no results found, hiding loading...');
      // If no results found, hide loading immediately without success message
      setTimeout(() => {
        onComplete();
      }, 500);
    } else if (isVisible && !showSuccess && !isLoading && dataLoaded) {
      console.log('⚠️ Loading completed but map not loaded yet, waiting...');
      // If loading is done but map is not loaded, wait a bit more
      setTimeout(() => {
        if (!mapLoaded) {
          console.log('⚠️ Map still not loaded, forcing completion...');
          onComplete();
        }
      }, 1000); // Further reduced timeout
    }
    
    // Force completion if loading screen has been visible for too long
    if (isVisible && !showSuccess) {
      const forceTimeout = setTimeout(() => {
        console.log('⚠️ Force completing loading screen after maximum timeout');
        onComplete();
      }, 8000); // Maximum 8 seconds
      
      return () => clearTimeout(forceTimeout);
    }
  }, [isVisible, showSuccess, dataLoaded, mapLoaded, hasResults, onComplete]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-white/20 backdrop-blur-md bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-lg mx-4 text-center shadow-2xl relative">
        {/* Cancel Button */}
        {onCancel && !showSuccess && (
          <button
            onClick={onCancel}
            className="absolute top-4 left-4 w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 transition-all duration-200 shadow-md hover:shadow-lg"
            title="إلغاء البحث"
          >
            <X className="w-5 h-5" />
          </button>
        )}
        {/* Heartbeat Animation */}
        <div className="relative mb-8">
          <div className="heartbeat-pulse">
            <Heart className="w-20 h-20 text-red-600 mx-auto" />
          </div>
          
          {/* Pulse Lines */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="pulse-ring"></div>
            <div className="pulse-ring delay-1"></div>
            <div className="pulse-ring delay-2"></div>
          </div>
        </div>

        {/* Loading Message */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-red-800 mb-4">
            {showSuccess ? "تم التحميل بنجاح!" : "جاري البحث عن المراكز الطبية..."}
          </h2>
          <p className="text-red-600 mb-6">
            {showSuccess 
              ? `تم العثور على المراكز الطبية في نطاق ${radius} كم من موقعك` 
              : hasResults === false && dataLoaded && mapLoaded
                ? "لم يتم العثور على مراكز طبية في هذا النطاق"
                : "يرجى الانتظار بينما نبحث عن أفضل الخدمات الطبية لك"
            }
          </p>
        </div>

        {/* Progress Steps */}
        {!showSuccess && (
          <div className="mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="flex space-x-2">
                {[1, 2, 3].map((stepNum) => (
                  <div
                    key={stepNum}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      stepNum === currentStep ? 'bg-red-600' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                {React.createElement(steps[currentStep - 1].icon, {
                  className: "w-6 h-6 text-red-600 mr-2"
                })}
                <span className="font-semibold text-gray-900">
                  {steps[currentStep - 1].title}
                </span>
              </div>
              <p className="text-sm text-gray-600">
                {steps[currentStep - 1].description}
              </p>
            </div>
          </div>
        )}

        {/* Quranic Verse */}
        {!showSuccess && (
          <div className="bg-red-50 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">ق</span>
              </div>
              <span className="text-red-700 font-medium text-sm">آية قرآنية</span>
            </div>
            <p className="text-red-800 text-sm leading-relaxed">
              {quranicVerses[currentVerse]}
            </p>
          </div>
        )}

        {/* Success Checkmark */}
        {showSuccess && (
          <div className="success-checkmark">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto" />
          </div>
        )}

        {/* Cancel Button at Bottom */}
        {onCancel && !showSuccess && (
          <div className="mt-6">
            <button
              onClick={onCancel}
              className="px-6 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md"
            >
              إلغاء البحث
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicalSearchLoading;
