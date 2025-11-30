// Medical Places List Component

import React from 'react';
import { PlaceDetails } from '../services/googleMapsService';
import { MapPin, Clock, Star, Navigation, ExternalLink } from 'lucide-react';

interface MedicalPlacesListProps {
  places: PlaceDetails[];
  onPlaceClick?: (place: PlaceDetails) => void;
  className?: string;
}

const MedicalPlacesList: React.FC<MedicalPlacesListProps> = ({
  places,
  onPlaceClick,
  className = ''
}) => {
  console.log('🏥 MedicalPlacesList received places:', places);
  console.log('🏥 Places count:', places.length);
  console.log('🏥 Pharmacy places in list:', places.filter(p => p.types.includes('pharmacy') || p.types.includes('drugstore')));
  const getTypeIcon = (types: string[]): string => {
    if (types.includes('hospital') || types.includes('health')) {
      return '🏥';
    } else if (types.includes('pharmacy') || types.includes('drugstore')) {
      return '💊';
    } else {
      return '🏥';
    }
  };

  const getTypeName = (types: string[]): string => {
    if (types.includes('hospital') || types.includes('health')) {
      return 'مستشفى';
    } else if (types.includes('pharmacy') || types.includes('drugstore')) {
      return 'صيدلية';
    } else {
      return 'مركز طبي';
    }
  };

  const getTypeColor = (types: string[]): string => {
    if (types.includes('hospital') || types.includes('health')) {
      return 'bg-red-100 text-red-800 border-red-200';
    } else if (types.includes('pharmacy') || types.includes('drugstore')) {
      return 'bg-purple-100 text-purple-800 border-purple-200';
    } else {
      return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  const handleDirections = (place: PlaceDetails) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${place.latitude},${place.longitude}`;
    window.open(url, '_blank');
  };

  const handleViewOnMap = (place: PlaceDetails) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name + ' ' + place.address)}`;
    window.open(url, '_blank');
  };

  if (places.length === 0) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <div className="text-6xl mb-4">🏥</div>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">
          لم يتم العثور على مراكز طبية
        </h3>
        <p className="text-gray-500">
          جرب توسيع نطاق البحث أو تحقق من اتصالك بالإنترنت
        </p>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800">
          المراكز الطبية القريبة
        </h2>
        <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
          {places.length} مركز
        </div>
      </div>

      <div className="space-y-3">
        {places
          .sort((a, b) => {
            // ترتيب إضافي حسب المسافة إذا كانت متوفرة
            if (a.distance && b.distance) {
              return a.distance - b.distance;
            }
            return 0;
          })
          .map((place, index) => (
          <div
            key={place.placeId}
            className="bg-white rounded-lg shadow-md border border-gray-200 p-4 hover:shadow-lg transition-shadow duration-200 cursor-pointer"
            onClick={() => onPlaceClick?.(place)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                {/* Place Header */}
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{getTypeIcon(place.types)}</span>
                    <span className="bg-red-100 text-red-800 text-xs font-bold px-2 py-1 rounded-full">
                      #{index + 1}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 text-lg leading-tight">
                      {place.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getTypeColor(place.types)}`}>
                        {getTypeName(place.types)}
                      </span>
                      {place.rating && (
                        <div className="flex items-center gap-1 text-yellow-600">
                          <Star className="w-3 h-3 fill-current" />
                          <span className="text-xs font-medium">
                            {place.rating.toFixed(1)}
                          </span>
                          {place.userRatingsTotal && (
                            <span className="text-xs text-gray-500">
                              ({place.userRatingsTotal})
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start gap-2 mb-3">
                  <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {place.address}
                  </p>
                </div>

                {/* Distance and Travel Time */}
                <div className="flex items-center gap-4 mb-3">
                  {place.distance && (
                    <div className="flex items-center gap-1 text-blue-600">
                      <Navigation className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        {place.distance.toFixed(1)} كم
                      </span>
                    </div>
                  )}
                  {place.travelTime && (
                    <div className="flex items-center gap-1 text-green-600">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        {place.travelTime}
                      </span>
                    </div>
                  )}
                  {place.isOpen !== undefined && (
                    <div className={`flex items-center gap-1 text-sm font-medium ${
                      place.isOpen ? 'text-green-600' : 'text-red-600'
                    }`}>
                      <div className={`w-2 h-2 rounded-full ${
                        place.isOpen ? 'bg-green-500' : 'bg-red-500'
                      }`}></div>
                      {place.isOpen ? 'مفتوح الآن' : 'مغلق الآن'}
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDirections(place);
                    }}
                    className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors duration-200"
                  >
                    <Navigation className="w-4 h-4" />
                    التوجيه
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewOnMap(place);
                    }}
                    className="flex items-center gap-2 px-3 py-2 bg-gray-600 text-white rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors duration-200"
                  >
                    <ExternalLink className="w-4 h-4" />
                    عرض على الخريطة
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <div className="text-sm text-gray-600 text-center">
          <p className="mb-1">
            تم العثور على <span className="font-semibold text-gray-800">{places.length}</span> مركز طبي
          </p>
          <p>
            في نطاق 15 كم من موقعك الحالي
          </p>
        </div>
      </div>
    </div>
  );
};

export default MedicalPlacesList;
