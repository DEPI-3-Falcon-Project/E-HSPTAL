import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Navigation, RefreshCw, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';

interface DynamicLocationDetectorProps {
  onLocationDetected: (location: { latitude: number; longitude: number }) => void;
  onError?: (error: string) => void;
  className?: string;
}

const DynamicLocationDetector: React.FC<DynamicLocationDetectorProps> = ({
  onLocationDetected,
  onError,
  className = ''
}) => {
  const [isDetecting, setIsDetecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [watchId, setWatchId] = useState<number | null>(null);
  const [attempts, setAttempts] = useState(0);
  const maxAttempts = 3;

  const detectLocation = async () => {
    if (!navigator.geolocation) {
      const errorMsg = 'متصفحك لا يدعم تحديد الموقع الجغرافي';
      setError(errorMsg);
      onError?.(errorMsg);
      return;
    }

    setIsDetecting(true);
    setError(null);
    setAttempts(prev => prev + 1);

    console.log(`🔍 محاولة تحديد الموقع #${attempts + 1}`);

    // إعدادات محسنة لتحديد الموقع الدقيق
    const options: PositionOptions = {
      enableHighAccuracy: true, // استخدام GPS عالي الدقة
      timeout: 30000, // 30 ثانية مهلة
      maximumAge: 0 // عدم استخدام الموقع المخزن
    };

    try {
      // استخدام getCurrentPosition مع Promise
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, options);
      });

      const newLocation = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      };

      const newAccuracy = position.coords.accuracy;

      console.log('📍 موقع محدد:', newLocation);
      console.log('🎯 دقة الموقع:', newAccuracy, 'متر');

      setLocation(newLocation);
      setAccuracy(newAccuracy);
      setIsDetecting(false);
      setAttempts(0);

      // التحقق من دقة الموقع
      const isAccurate = checkLocationAccuracy(newLocation, newAccuracy);
      if (isAccurate) {
        onLocationDetected(newLocation);
      } else {
        // عرض تحذير لكن السماح بالمتابعة
        console.log('⚠️ الموقع قد يكون غير دقيق، لكن سيتم المتابعة');
        setLocation(newLocation);
        setAccuracy(newAccuracy);
        setIsDetecting(false);
        setAttempts(0);
        onLocationDetected(newLocation);
      }

    } catch (err: any) {
      console.error('❌ خطأ في تحديد الموقع:', err);
      
      let errorMessage = 'حدث خطأ في تحديد الموقع';
      
      switch (err.code) {
        case err.PERMISSION_DENIED:
          errorMessage = 'تم رفض الإذن للوصول للموقع. يرجى السماح بالوصول للموقع في إعدادات المتصفح';
          break;
        case err.POSITION_UNAVAILABLE:
          errorMessage = 'معلومات الموقع غير متاحة. تأكد من تفعيل GPS';
          break;
        case err.TIMEOUT:
          errorMessage = 'انتهت مهلة طلب تحديد الموقع. حاول مرة أخرى';
          break;
        default:
          errorMessage = 'حدث خطأ غير متوقع في تحديد الموقع';
      }

      setError(errorMessage);
      setIsDetecting(false);
      onError?.(errorMessage);
    }
  };

  // التحقق من دقة الموقع
  const checkLocationAccuracy = (loc: { latitude: number; longitude: number }, acc: number): boolean => {
    // إحداثيات حلوان (الموقع الافتراضي المشكوك فيه)
    const helwanLat = 29.8549;
    const helwanLng = 31.3197;
    
    // حساب المسافة من حلوان
    const distance = calculateDistance(loc.latitude, loc.longitude, helwanLat, helwanLng);
    
    // التحقق من الدقة - معايير أكثر مرونة
    const isAccurate = distance > 0.5 && acc < 500; // أكثر من 500 متر من حلوان ودقة أقل من 500 متر
    
    console.log(`🎯 فحص الدقة: المسافة من حلوان: ${distance.toFixed(2)} كم، دقة GPS: ${acc} متر`);
    console.log(`🎯 النتيجة: ${isAccurate ? 'دقيق' : 'غير دقيق'}`);
    
    return isAccurate;
  };

  // حساب المسافة بين نقطتين
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // نصف قطر الأرض بالكيلومتر
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // بدء مراقبة الموقع المستمرة
  const startWatching = () => {
    if (!navigator.geolocation) return;

    const options: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 30000,
      maximumAge: 10000 // 10 ثواني للمراقبة المستمرة
    };

    const id = navigator.geolocation.watchPosition(
      (position) => {
        const newLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        };
        
        const newAccuracy = position.coords.accuracy;
        
        console.log('📍 موقع محدث:', newLocation, 'دقة:', newAccuracy);
        
        setLocation(newLocation);
        setAccuracy(newAccuracy);
        
        // التحقق من الدقة
        const isAccurate = checkLocationAccuracy(newLocation, newAccuracy);
        if (isAccurate) {
          onLocationDetected(newLocation);
          stopWatching();
        }
      },
      (err) => {
        console.error('خطأ في مراقبة الموقع:', err);
        stopWatching();
      },
      options
    );

    setWatchId(id);
  };

  // إيقاف مراقبة الموقع
  const stopWatching = () => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
    }
  };

  // تنظيف عند إلغاء التحميل
  useEffect(() => {
    return () => {
      stopWatching();
    };
  }, []);

  const handleRetry = () => {
    if (attempts < maxAttempts) {
      detectLocation();
    } else {
      // بعد 3 محاولات، ابدأ المراقبة المستمرة
      startWatching();
    }
  };

  return (
    <div className={`bg-white rounded-2xl shadow-2xl p-6 ${className}`}>
      <div className="text-center mb-6">
        <div className="flex items-center justify-center mb-3">
          <Navigation className="w-8 h-8 text-red-600 mr-2" />
          <h3 className="text-xl font-bold text-gray-800">تحديد الموقع</h3>
        </div>
        <p className="text-gray-600 text-sm">
          جاري تحديد موقعك بدقة عالية
        </p>
      </div>

      {/* حالة التحميل */}
      {isDetecting && (
        <div className="text-center py-8">
          <div className="relative mb-4">
            <Loader2 className="w-12 h-12 text-red-600 animate-spin mx-auto" />
            <div className="absolute inset-0 bg-red-600 rounded-full opacity-20 animate-ping"></div>
          </div>
          <p className="text-gray-700 font-medium mb-2">جاري تحديد موقعك...</p>
          <p className="text-gray-500 text-sm">المحاولة {attempts} من {maxAttempts}</p>
          {attempts >= maxAttempts && (
            <p className="text-red-600 text-sm mt-2">سيتم بدء المراقبة المستمرة...</p>
          )}
        </div>
      )}

      {/* حالة الخطأ */}
      {error && !isDetecting && (
        <div className="text-center py-6">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <p className="text-red-600 font-medium mb-2">خطأ في تحديد الموقع</p>
          <p className="text-gray-600 text-sm mb-4">{error}</p>
          <button
            onClick={handleRetry}
            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center mx-auto"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            {attempts < maxAttempts ? 'حاول مرة أخرى' : 'بدء المراقبة المستمرة'}
          </button>
        </div>
      )}

      {/* حالة النجاح */}
      {location && !isDetecting && !error && (
        <div className="text-center py-6">
          {accuracy && accuracy < 100 ? (
            <CheckCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          ) : (
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          )}
          <p className={`font-medium mb-2 ${accuracy && accuracy < 100 ? 'text-red-600' : 'text-red-500'}`}>
            {accuracy && accuracy < 100 ? 'تم تحديد موقعك بنجاح' : 'تم تحديد موقعك - تحقق من الدقة'}
          </p>
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <p className="text-gray-700 text-sm">
              الإحداثيات: {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
            </p>
            {accuracy && (
              <p className={`text-xs mt-1 ${accuracy < 100 ? 'text-green-600' : 'text-yellow-600'}`}>
                دقة GPS: {accuracy.toFixed(0)} متر
                {accuracy >= 100 && ' (دقة منخفضة)'}
              </p>
            )}
          </div>
          {accuracy && accuracy >= 100 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
              <p className="text-yellow-800 text-sm">
                ⚠️ دقة الموقع منخفضة. قد تحتاج إلى تحسين إعدادات GPS
              </p>
            </div>
          )}
          <button
            onClick={detectLocation}
            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center mx-auto"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            تحديث الموقع
          </button>
        </div>
      )}

      {/* زر البدء */}
      {!isDetecting && !location && !error && (
        <div className="text-center">
          <button
            onClick={detectLocation}
            className="bg-red-600 text-white px-8 py-3 rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center mx-auto"
          >
            <MapPin className="w-5 h-5 mr-2" />
            حدد موقعي
          </button>
        </div>
      )}

      {/* نصائح */}
      <div className="mt-6 p-4 bg-red-50 rounded-lg border border-red-200">
        <div className="flex items-start">
          <div className="text-red-600 mr-2 mt-0.5">💡</div>
          <div className="text-sm text-red-800">
            <p className="font-medium mb-1">لضمان دقة الموقع:</p>
            <ul className="list-disc list-inside text-xs space-y-1">
              <li>تأكد من تفعيل GPS في جهازك</li>
              <li>امنح الإذن للموقع في المتصفح</li>
              <li>تأكد من الاتصال بالإنترنت</li>
              <li>إذا فشلت المحاولات، سيتم بدء المراقبة المستمرة</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DynamicLocationDetector;

