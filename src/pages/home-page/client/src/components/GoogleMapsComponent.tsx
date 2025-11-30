// Google Maps Component with Places API integration

/// <reference path="../types/google-maps.d.ts" />

import React, { useEffect, useRef, useState } from 'react';
import { googleMapsService, LocationData, PlaceDetails, GeocodeResult } from '../services/googleMapsService';

interface GoogleMapsComponentProps {
  userLocation: LocationData | null;
  onLocationDetails?: (details: GeocodeResult) => void;
  onPlacesFound?: (places: PlaceDetails[]) => void;
  onMapLoaded?: () => void;
  className?: string;
  // New props for integration with the new system
  mapPlaces?: PlaceDetails[];
  showResults?: boolean;
  mapLoaded?: boolean; // Add mapLoaded prop from parent
}

const GoogleMapsComponent: React.FC<GoogleMapsComponentProps> = ({
  userLocation,
  onLocationDetails,
  onPlacesFound,
  onMapLoaded,
  className = '',
  mapPlaces = [],
  showResults = false,
  mapLoaded: parentMapLoaded = false
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [places, setPlaces] = useState<PlaceDetails[]>([]);
  const [locationDetails, setLocationDetails] = useState<GeocodeResult | null>(null);

  // Update places when mapPlaces prop changes
  useEffect(() => {
    if (mapPlaces.length > 0 && showResults) {
      setPlaces(mapPlaces);
      console.log('🗺️ GoogleMapsComponent received new places:', mapPlaces.length);
      
      // Add markers to the map when places are received
      if (mapLoaded || parentMapLoaded) {
        console.log('📍 Adding markers to map for', mapPlaces.length, 'places');
        // Add markers immediately
        googleMapsService.addMedicalPlaceMarkers(mapPlaces);
        
        // Call onMapLoaded when markers are added
        setTimeout(() => {
          console.log('🗺️ Calling onMapLoaded from GoogleMapsComponent');
          onMapLoaded?.();
        }, 200);
      } else {
        console.log('⚠️ Map not loaded yet, waiting...');
      }
    }
  }, [mapPlaces, showResults, mapLoaded, parentMapLoaded]);

  // Add markers when map is loaded and we have places
  useEffect(() => {
    if ((mapLoaded || parentMapLoaded) && places.length > 0 && showResults) {
      console.log('📍 Adding markers to map for', places.length, 'places');
      // Add markers immediately
      googleMapsService.addMedicalPlaceMarkers(places);
    }
  }, [mapLoaded, parentMapLoaded, places, showResults]);

  // Load Google Maps script
  useEffect(() => {
    const loadGoogleMapsScript = () => {
      if (typeof window !== 'undefined' && (window as any).google && (window as any).google.maps) {
        setMapLoaded(true);
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyAMKNzEGcjceP1HtmaphYjhTfr0BGMGnE0&libraries=places&language=ar&region=eg`;
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        // Add a small delay to ensure Google Maps API is fully loaded
        setTimeout(() => {
          setMapLoaded(true);
          onMapLoaded?.();
        }, 100);
      };
      
      script.onerror = () => {
        console.error('Failed to load Google Maps script');
      };

      document.head.appendChild(script);
    };

    loadGoogleMapsScript();
  }, []);

  // Initialize map when loaded and user location is available
  useEffect(() => {
    console.log('🎯 useEffect triggered:', { mapLoaded, userLocation: !!userLocation, mapRef: !!mapRef.current });
    if (mapLoaded && userLocation && mapRef.current) {
      console.log('🎯 Initializing map');
      initializeMapWithoutSearch();
    }
  }, [mapLoaded, userLocation]);

  // Initialize map when mapLoaded prop changes from parent
  useEffect(() => {
    console.log('🎯 parentMapLoaded prop changed:', parentMapLoaded);
    if (parentMapLoaded && userLocation && mapRef.current) {
      console.log('🎯 Initializing map from parent mapLoaded prop');
      initializeMapWithoutSearch();
    }
  }, [parentMapLoaded]);

  const initializeMapWithoutSearch = async () => {
    if (!userLocation || !mapRef.current) return;

    // Check if Google Maps API is loaded
    if (typeof window === 'undefined' || !(window as any).google || !(window as any).google.maps) {
      console.error('Google Maps API is not loaded yet');
      return;
    }

    try {
      // Initialize the map
      const map = googleMapsService.initializeMap(mapRef.current, userLocation, 16);
      
      // Add user location marker
      googleMapsService.addUserLocationMarker(userLocation, 'موقعك الحالي');

      // Call onMapLoaded when map is initialized with data
      setTimeout(() => {
        onMapLoaded?.();
      }, 1000);

      // Get location details using reverse geocoding
      const details = await googleMapsService.reverseGeocode(userLocation);
      setLocationDetails(details);
      onLocationDetails?.(details);

      console.log('Map initialized successfully without auto-search');
      console.log('Location details:', details);

    } catch (error) {
      console.error('Error initializing map:', error);
    }
  };

  // handleRadiusSelected function removed - now handled by the new system

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      googleMapsService.destroy();
    };
  }, []);

  if (!mapLoaded) {
    return (
      <div className={`flex items-center justify-center h-96 bg-gray-100 rounded-lg ${className}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل الخريطة...</p>
        </div>
      </div>
    );
  }

  if (!userLocation) {
    return (
      <div className={`flex items-center justify-center h-96 bg-gray-100 rounded-lg ${className}`}>
        <div className="text-center">
          <div className="text-6xl mb-4">📍</div>
          <p className="text-gray-600">في انتظار تحديد الموقع...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {/* Results will be displayed from the new system */}

      {/* Map Container */}
      <div 
        ref={mapRef} 
        className="w-full h-96 rounded-lg shadow-lg"
        style={{ minHeight: '400px' }}
      />
      
      {/* Location Info Overlay */}
      {locationDetails && (
        <div className="absolute top-4 right-4 bg-white p-3 rounded-lg shadow-lg max-w-xs">
          <div className="text-sm font-semibold text-gray-800 mb-1">
            📍 {locationDetails.placeName}
          </div>
          <div className="text-xs text-gray-600">
            {locationDetails.district}, {locationDetails.governorate}
          </div>
          <div className="text-xs text-gray-500">
            {locationDetails.country}
          </div>
        </div>
      )}

      {/* Places Count Overlay */}
      {places.length > 0 && showResults && (
        <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow-lg">
          <div className="text-sm font-semibold text-gray-800">
            🏥 تم العثور على {places.length} مركز طبي
          </div>
          <div className="text-xs text-gray-600 mt-1">
            في نطاق البحث المحدد
          </div>
        </div>
      )}
    </div>
  );
};

export default GoogleMapsComponent;
