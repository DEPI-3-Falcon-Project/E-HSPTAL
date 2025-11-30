import React from 'react';
import { MapPin, Phone, Navigation, Heart, Hospital, Stethoscope, Pill, AlertTriangle } from 'lucide-react';
import { MedicalCenter } from '../types';

interface MedicalCenterCardProps {
  center: MedicalCenter;
  showDistance?: boolean;
}

const MedicalCenterCard: React.FC<MedicalCenterCardProps> = ({ 
  center, 
  showDistance = false 
}) => {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'hospital':
      case 'hospitals':
        return <Hospital className="w-6 h-6 text-red-600" />;
      case 'clinic':
      case 'clinics':
        return <Stethoscope className="w-6 h-6 text-blue-600" />;
      case 'pharmacy':
      case 'pharmacies':
        return <Pill className="w-6 h-6 text-green-600" />;
      case 'emergency_center':
        return <AlertTriangle className="w-6 h-6 text-orange-600" />;
      default:
        return <Hospital className="w-6 h-6 text-red-600" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'hospital':
      case 'hospitals':
        return 'مستشفى';
      case 'clinic':
      case 'clinics':
        return 'مركز طبي';
      case 'pharmacy':
      case 'pharmacies':
        return 'صيدلية';
      case 'emergency_center':
        return 'مركز طوارئ';
      default:
        return 'مركز طبي';
    }
  };

  const openInMaps = () => {
    const [lng, lat] = center.location.coordinates;
    
    // استخدام الإحداثيات مباشرة مع العنوان كبديل
    const fullAddress = `${center.address}, ${center.city}, ${center.governorate}, مصر`;
    const encodedAddress = encodeURIComponent(fullAddress);
    
    // استخدام الإحداثيات مع العنوان للدقة الأفضل
    const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}&query_place_id=${encodedAddress}`;
    
    // بديل: استخدام الإحداثيات فقط إذا فشل العنوان
    const fallbackUrl = `https://www.google.com/maps/@${lat},${lng},15z`;
    
    try {
      window.open(url, '_blank');
    } catch (error) {
      // استخدام الإحداثيات كبديل
      window.open(fallbackUrl, '_blank');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">{getTypeIcon(center.type)}</div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{center.name}</h3>
            <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
              {getTypeLabel(center.type)}
            </span>
          </div>
        </div>
        {showDistance && center.distance && (
          <div className="text-right">
            <span className="text-sm text-gray-600">المسافة</span>
            <p className="text-lg font-semibold text-emergency-600">
              {center.distance.toFixed(1)} كم
            </p>
          </div>
        )}
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center space-x-2 text-gray-700">
          <MapPin size={16} className="text-gray-500" />
          <span className="text-sm">
            {center.address}, {center.city}, {center.governorate}
          </span>
        </div>

        {center.phone && (
          <div className="flex items-center space-x-2 text-gray-700">
            <Phone size={16} className="text-gray-500" />
            <a 
              href={`tel:${center.phone}`}
              className="text-sm hover:text-emergency-600 transition-colors"
            >
              {center.phone}
            </a>
          </div>
        )}

        {center.emergencyPhone && (
          <div className="flex items-center space-x-2 text-red-600">
            <Heart size={16} className="text-red-500" />
            <a 
              href={`tel:${center.emergencyPhone}`}
              className="text-sm font-medium hover:text-red-700 transition-colors"
            >
              طوارئ: {center.emergencyPhone}
            </a>
          </div>
        )}
      </div>

      {center.services && center.services.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">الخدمات:</h4>
          <div className="flex flex-wrap gap-2">
            {center.services.slice(0, 4).map((service, index) => (
              <span
                key={index}
                className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded"
              >
                {service}
              </span>
            ))}
            {center.services.length > 4 && (
              <span className="text-xs text-gray-500">
                +{center.services.length - 4} المزيد
              </span>
            )}
          </div>
        </div>
      )}

      <div className="flex gap-2">
        <button
          onClick={openInMaps}
          className="flex-1 flex items-center justify-center space-x-2 bg-emergency-600 text-white py-2 px-4 rounded-md hover:bg-emergency-700 transition-colors"
        >
          <MapPin size={16} />
          <span>عرض على الخريطة</span>
        </button>
        
        <button
          onClick={() => {
            const [lng, lat] = center.location.coordinates;
            const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
            window.open(url, '_blank');
          }}
          className="flex-1 flex items-center justify-center space-x-2 bg-white text-black border border-gray-300 py-2 px-4 rounded-md hover:bg-gray-50 transition-colors"
        >
          <Navigation size={16} />
          <span>التوجيه</span>
        </button>
      </div>
    </div>
  );
};

export default MedicalCenterCard;




