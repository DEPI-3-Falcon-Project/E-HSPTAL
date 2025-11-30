// Custom hook for Google Geolocation functionality

import { useState, useEffect, useCallback } from 'react';
import { LocationData } from '../services/googleMapsService';

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
}

export const useGoogleGeolocation = (options: GeolocationOptions = {}) => {
  const [state, setState] = useState<GeolocationState>({
    location: null,
    loading: false,
    error: null,
    permissionGranted: false
  });

  const {
    enableHighAccuracy = true,
    timeout = 20000, // زيادة المهلة إلى 20 ثانية
    maximumAge = 0 // عدم استخدام الموقع المخزن - تحديد موقع جديد دائماً
  } = options;

  const getCurrentPosition = useCallback(() => {
    if (!navigator.geolocation) {
      setState(prev => ({
        ...prev,
        error: 'Geolocation is not supported by this browser',
        loading: false
      }));
      return;
    }

    setState(prev => ({
      ...prev,
      loading: true,
      error: null
    }));

    const successCallback = (position: GeolocationPosition) => {
      const location: LocationData = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      };

      setState({
        location,
        loading: false,
        error: null,
        permissionGranted: true
      });
    };

    const errorCallback = (error: GeolocationPositionError) => {
      let errorMessage = 'Unknown error occurred';
      
      switch (error.code) {
        case error.PERMISSION_DENIED:
          errorMessage = 'Location access denied by user';
          break;
        case error.POSITION_UNAVAILABLE:
          errorMessage = 'Location information is unavailable';
          break;
        case error.TIMEOUT:
          errorMessage = 'Location request timed out';
          break;
        default:
          errorMessage = 'An unknown error occurred while retrieving location';
          break;
      }

      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
        permissionGranted: false
      }));
    };

    navigator.geolocation.getCurrentPosition(
      successCallback,
      errorCallback,
      {
        enableHighAccuracy,
        timeout,
        maximumAge
      }
    );
  }, [enableHighAccuracy, timeout, maximumAge]);

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

  // Check if geolocation is supported
  useEffect(() => {
    if (!navigator.geolocation) {
      setState(prev => ({
        ...prev,
        error: 'Geolocation is not supported by this browser'
      }));
    }
  }, []);

  return {
    ...state,
    getCurrentPosition,
    requestPermission,
    clearLocation
  };
};

export default useGoogleGeolocation;
