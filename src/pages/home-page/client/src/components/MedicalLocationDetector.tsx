import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Heart, Shield, Clock, X } from 'lucide-react';

interface MedicalLocationDetectorProps {
  onLocationDetected: (location: { latitude: number; longitude: number; accuracy?: number }) => void;
  onError: (error: string) => void;
  onCancel?: () => void;
  className?: string;
}

const MedicalLocationDetector: React.FC<MedicalLocationDetectorProps> = ({
  onLocationDetected,
  onError,
  onCancel,
  className = ''
}) => {
  const [isDetecting, setIsDetecting] = useState(false);
  const [step, setStep] = useState(1);
  const detectionAborted = useRef(false);

  const steps = [
    {
      icon: Shield,
      title: "تحديد الموقع الآمن",
      description: "نحتاج لتحديد موقعك لتوفير أفضل الخدمات الطبية"
    },
    {
      icon: MapPin,
      title: "البحث عن المراكز القريبة",
      description: "سنجد أقرب المستشفيات والمراكز الطبية لك"
    },
    {
      icon: Heart,
      title: "توفير الرعاية الصحية",
      description: "نضمن لك الحصول على أفضل الخدمات الطبية"
    }
  ];

  const startLocationDetection = async () => {
    setIsDetecting(true);
    setStep(1);
    detectionAborted.current = false;

    if (!navigator.geolocation) {
      onError('المتصفح لا يدعم تحديد الموقع');
      setIsDetecting(false);
      return;
    }

    let bestLocation: { latitude: number; longitude: number; accuracy: number } | null = null;
    const maxAttempts = 3;

    try {
      // Perform multiple attempts for better accuracy
      for (let attempt = 0; attempt < maxAttempts; attempt++) {
        if (detectionAborted.current) {
          console.log('❌ تم إلغاء تحديد الموقع');
          setIsDetecting(false);
          return;
        }

        console.log(`📍 محاولة تحديد الموقع ${attempt + 1}/${maxAttempts}`);
        
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          const options = {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 0 // Always get fresh location
          };

          navigator.geolocation.getCurrentPosition(resolve, reject, options);
        });

        if (detectionAborted.current) {
          console.log('❌ تم إلغاء تحديد الموقع');
          setIsDetecting(false);
          return;
        }

        const accuracy = position.coords.accuracy;
        console.log(`🎯 دقة المحاولة ${attempt + 1}: ${accuracy.toFixed(1)} متر`);

        // Keep track of best location
        if (!bestLocation || accuracy < bestLocation.accuracy) {
          bestLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy
          };
        }

        // If we get very accurate location, use it immediately
        if (accuracy < 10) {
          console.log('✅ موقع دقيق جداً، استخدامه مباشرة');
          break;
        }

        // Wait between attempts for GPS to stabilize
        if (attempt < maxAttempts - 1) {
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }

      if (detectionAborted.current) {
        console.log('❌ تم إلغاء تحديد الموقع');
        setIsDetecting(false);
        return;
      }

      if (bestLocation) {
        console.log(`✅ أفضل موقع: دقة ${bestLocation.accuracy.toFixed(1)} متر`);
        setIsDetecting(false);
        onLocationDetected({
          latitude: bestLocation.latitude,
          longitude: bestLocation.longitude,
          accuracy: bestLocation.accuracy
        });
      } else {
        throw new Error('لم يتم الحصول على موقع دقيق');
      }

    } catch (error) {
      if (detectionAborted.current) {
        console.log('❌ تم إلغاء تحديد الموقع');
        setIsDetecting(false);
        return;
      }

      setIsDetecting(false);
      let errorMessage = 'حدث خطأ في تحديد الموقع';
      
      if (error instanceof GeolocationPositionError) {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'تم رفض الإذن لتحديد الموقع. يرجى السماح بالوصول للموقع في إعدادات المتصفح';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'معلومات الموقع غير متاحة. تأكد من تفعيل GPS';
            break;
          case error.TIMEOUT:
            errorMessage = 'انتهت مهلة تحديد الموقع. تحقق من اتصال الإنترنت';
            break;
        }
      }
      
      console.error('❌ خطأ في تحديد الموقع:', errorMessage);
      onError(errorMessage);
    }
  };

  const handleCancel = () => {
    detectionAborted.current = true;
    setIsDetecting(false);
    if (onCancel) {
      onCancel();
    }
  };

  useEffect(() => {
    if (isDetecting) {
      const interval = setInterval(() => {
        setStep(prev => prev === 3 ? 1 : prev + 1);
      }, 2000);
      
      return () => clearInterval(interval);
    }
  }, [isDetecting]);

  return (
    <div className={`bg-white rounded-2xl p-8 shadow-2xl max-w-lg mx-auto relative ${className}`}>
      {/* Cancel Button */}
      {onCancel && (
        <button
          onClick={handleCancel}
          className="absolute top-4 left-4 w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 transition-all duration-200 shadow-md hover:shadow-lg z-10"
          title="إلغاء"
        >
          <X className="w-5 h-5" />
        </button>
      )}

      <div className="text-center mb-8">
        <div className="relative mb-6">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="w-10 h-10 text-red-600 heartbeat-pulse" />
          </div>
          
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="pulse-ring"></div>
            <div className="pulse-ring delay-1"></div>
            <div className="pulse-ring delay-2"></div>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {isDetecting ? "جاري تحديد موقعك" : "تحديد الموقع الطبي"}
        </h2>
        <p className="text-gray-600">
          {isDetecting ? "يرجى الانتظار بينما نحدد موقعك بدقة" : "نحتاج لتحديد موقعك لتوفير أفضل الخدمات الطبية"}
        </p>
      </div>

      {isDetecting && (
        <div className="mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="flex space-x-2">
              {[1, 2, 3].map((stepNum) => (
                <div
                  key={stepNum}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    stepNum === step ? 'bg-red-600' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              {React.createElement(steps[step - 1].icon, {
                className: "w-6 h-6 text-red-600 mr-2"
              })}
              <span className="font-semibold text-gray-900">
                {steps[step - 1].title}
              </span>
            </div>
            <p className="text-sm text-gray-600">
              {steps[step - 1].description}
            </p>
          </div>
        </div>
      )}

      {!isDetecting && (
        <div className="space-y-4">
          <div className="bg-red-50 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Shield className="w-5 h-5 text-red-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-red-800 mb-1">أمان البيانات</h4>
                <p className="text-sm text-red-700">
                  موقعك محمي ولا يتم مشاركته مع أي طرف ثالث
                </p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Clock className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-blue-800 mb-1">سرعة الاستجابة</h4>
                <p className="text-sm text-blue-700">
                  تحديد الموقع يستغرق بضع ثوان فقط
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-8">
        {!isDetecting ? (
          <button
            onClick={startLocationDetection}
            className="w-full bg-red-600 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:bg-red-700 transition-colors shadow-lg hover:shadow-xl"
          >
            تحديد موقعي الآن
          </button>
        ) : (
          <div className="space-y-3">
            <div className="w-full bg-gray-100 py-4 px-6 rounded-xl text-center">
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-600"></div>
                <span className="text-gray-600">جاري التحديد...</span>
              </div>
            </div>
            {onCancel && (
              <button
                onClick={handleCancel}
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 px-6 rounded-xl font-medium transition-colors shadow-sm hover:shadow-md"
              >
                إلغاء
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicalLocationDetector;


