import { useState, useEffect } from 'react';
import { LocationData } from '../types';

interface GeolocationState {
  location: LocationData | null;
  loading: boolean;
  error: string | null;
}

const useGeolocation = () => {
  const [state, setState] = useState<GeolocationState>({
    location: null,
    loading: false,
    error: null,
  });

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setState(prev => ({
        ...prev,
        error: 'متصفحك لا يدعم تحديد الموقع الجغرافي',
        loading: false,
      }));
      return;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          location: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
          },
          loading: false,
          error: null,
        });
      },
      (error) => {
        let errorMessage = 'لا يمكن تحديد موقعك';
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'تم رفض الإذن للوصول للموقع. يرجى السماح بالوصول للموقع في إعدادات المتصفح';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'معلومات الموقع غير متاحة حالياً';
            break;
          case error.TIMEOUT:
            errorMessage = 'انتهت مهلة طلب تحديد الموقع';
            break;
          default:
            errorMessage = 'حدث خطأ غير متوقع في تحديد الموقع';
        }

        setState({
          location: null,
          loading: false,
          error: errorMessage,
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 20000, // زيادة المهلة إلى 20 ثانية
        maximumAge: 0, // عدم استخدام الموقع المخزن - تحديد موقع جديد دائماً
      }
    );
  };

  // لا نحدد الموقع تلقائياً - فقط عند طلبه يدوياً
  // useEffect(() => {
  //   getCurrentLocation();
  // }, []);

  return {
    ...state,
    refetch: getCurrentLocation,
  };
};

export default useGeolocation;



