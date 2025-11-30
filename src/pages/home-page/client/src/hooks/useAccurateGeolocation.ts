import { useState, useCallback } from 'react';

interface LocationData {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

interface GeolocationState {
  location: LocationData | null;
  loading: boolean;
  error: string | null;
  permissionGranted: boolean;
}

interface GeolocationOptions {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
  forceRefresh?: boolean;
}

export const useAccurateGeolocation = (options: GeolocationOptions = {}) => {
  const [state, setState] = useState<GeolocationState>({
    location: null,
    loading: false,
    error: null,
    permissionGranted: false
  });

  const {
    enableHighAccuracy = true,
    timeout = 20000, // زيادة المهلة إلى 20 ثانية
    maximumAge = 0, // عدم استخدام الموقع المخزن - تحديد موقع جديد دائماً
    forceRefresh = false
  } = options;

  const getCurrentPosition = useCallback(async () => {
    if (!navigator.geolocation) {
      setState(prev => ({
        ...prev,
        error: 'متصفحك لا يدعم تحديد الموقع الجغرافي',
        loading: false
      }));
      return;
    }

    setState(prev => ({
      ...prev,
      loading: true,
      error: null
    }));

    let bestLocation: LocationData | null = null;
    const maxAttempts = forceRefresh ? 5 : 3;

    try {
      // Perform multiple attempts for better accuracy
      for (let attempt = 0; attempt < maxAttempts; attempt++) {
        console.log(`📍 محاولة تحديد الموقع ${attempt + 1}/${maxAttempts}`);
        
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          const geolocationOptions: PositionOptions = {
            enableHighAccuracy: true,
            timeout: timeout,
            maximumAge: forceRefresh ? 0 : maximumAge
          };

          navigator.geolocation.getCurrentPosition(resolve, reject, geolocationOptions);
        });

        const accuracy = position.coords.accuracy;
        console.log(`🎯 دقة المحاولة ${attempt + 1}: ${accuracy.toFixed(1)} متر`);

        const location: LocationData = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy
        };

        // Keep track of best location
        if (!bestLocation || accuracy < (bestLocation.accuracy || Infinity)) {
          bestLocation = location;
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

      if (bestLocation) {
        console.log(`✅ أفضل موقع: دقة ${bestLocation.accuracy?.toFixed(1)} متر`);
        setState({
          location: bestLocation,
          loading: false,
          error: null,
          permissionGranted: true
        });
      } else {
        throw new Error('لم يتم الحصول على موقع دقيق');
      }

    } catch (error) {
      let errorMessage = 'حدث خطأ غير متوقع';
      
      if (error instanceof GeolocationPositionError) {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'تم رفض الإذن للوصول للموقع. يرجى السماح بالوصول للموقع في إعدادات المتصفح';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'معلومات الموقع غير متاحة حالياً. تأكد من تفعيل GPS';
            break;
          case error.TIMEOUT:
            errorMessage = 'انتهت مهلة طلب تحديد الموقع. حاول مرة أخرى';
            break;
          default:
            errorMessage = 'حدث خطأ غير متوقع في تحديد الموقع';
            break;
        }
      }

      console.error('❌ خطأ في تحديد الموقع:', errorMessage);

      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
        permissionGranted: false
      }));
    }
  }, [enableHighAccuracy, timeout, maximumAge, forceRefresh]);

  const requestPermission = useCallback(() => {
    getCurrentPosition();
  }, [getCurrentPosition]);

  const clearLocation = useCallback(() => {
    setState({
      location: null,
      loading: false,
      error: null,
      permissionGranted: false
    });
  }, []);

  const refreshLocation = useCallback(() => {
    console.log('🔄 تحديث الموقع...');
    getCurrentPosition();
  }, [getCurrentPosition]);

  return {
    ...state,
    getCurrentPosition,
    requestPermission,
    clearLocation,
    refreshLocation
  };
};

export default useAccurateGeolocation;


