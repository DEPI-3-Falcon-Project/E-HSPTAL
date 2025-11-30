import React, { useEffect, useState } from "react";
import {
  CheckCircle,
  MapPin,
  Navigation,
  RefreshCw,
  Building2,
  MapPinIcon,
  AlertTriangle,
} from "lucide-react";
import "./LocationSuccessMessage.css";

interface LocationSuccessMessageProps {
  location: {
    latitude: number;
    longitude: number;
  };
  placeName?: string;
  locationDetails?: {
    district: string;
    city: string;
    governorate: string;
    detailedArea?: string;
    neighborhood?: string;
    street?: string;
  };
  isVisible: boolean;
  onHide: () => void;
  onRefresh?: () => void;
}

const LocationSuccessMessage: React.FC<LocationSuccessMessageProps> = ({
  location,
  placeName,
  locationDetails,
  isVisible,
  onHide,
  onRefresh,
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  // التحقق من دقة الموقع
  const checkLocationAccuracy = () => {
    const { latitude, longitude } = location;

    // إحداثيات حلوان (الموقع الافتراضي المشكوك فيه)
    const helwanLat = 29.8549;
    const helwanLng = 31.3197;

    // التحقق من القرب من حلوان (نطاق 1 كم)
    const distance = calculateDistance(
      latitude,
      longitude,
      helwanLat,
      helwanLng
    );

    return {
      isAccurate: distance > 1, // أكثر من 1 كم من حلوان
      distance: distance,
      isDefaultLocation: distance < 0.1, // أقل من 100 متر من حلوان
    };
  };

  // حساب المسافة بين نقطتين
  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    const R = 6371; // نصف قطر الأرض بالكيلومتر
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const accuracy = checkLocationAccuracy();

  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true);
    }
  }, [isVisible]);

  if (!isVisible && !isAnimating) return null;

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
      <div
        className={`bg-linear-to-r from-red-600 to-red-700 text-white rounded-2xl shadow-2xl p-6 mx-4 max-w-md w-full transform transition-all duration-500 ${
          isAnimating && isVisible
            ? "translate-y-0 opacity-100 scale-100"
            : "-translate-y-full opacity-0 scale-95"
        }`}
      >
        {/* Header with success icon */}
        <div className="flex items-center mb-4">
          <div className="relative">
            {accuracy.isAccurate ? (
              <CheckCircle className="w-8 h-8 text-green-400" />
            ) : (
              <AlertTriangle className="w-8 h-8 text-yellow-400" />
            )}
            <div
              className={`absolute inset-0 rounded-full opacity-20 animate-ping ${
                accuracy.isAccurate ? "bg-green-400" : "bg-yellow-400"
              }`}
            ></div>
          </div>
          <div className="mr-3">
            <h3 className="text-lg font-bold">
              {accuracy.isAccurate
                ? "تم تحديد موقعك بنجاح"
                : "تم تحديد موقعك - تحقق من الدقة"}
            </h3>
            <p className="text-red-200 text-sm">
              {accuracy.isAccurate
                ? "سيتم عرض أقرب المراكز الطبية إليك"
                : "قد يكون الموقع غير دقيق - يرجى التحقق من إعدادات المتصفح"}
            </p>
          </div>
        </div>

        {/* Location accuracy warning */}
        {accuracy.isDefaultLocation && (
          <div className="bg-yellow-500/20 border border-yellow-400/30 rounded-lg p-3 mb-4">
            <div className="flex items-start">
              <AlertTriangle className="w-5 h-5 text-yellow-300 mr-2 mt-0.5 flex-shrink-0" />
              <div className="text-yellow-200 text-sm">
                <p className="font-medium mb-1">تحذير: موقع افتراضي</p>
                <p className="text-xs">
                  يبدو أن المتصفح يستخدم موقع افتراضي. المسافة من حلوان:{" "}
                  {accuracy.distance.toFixed(2)} كم
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Location details */}
        <div className="bg-black/20 rounded-xl p-4 mb-4">
          <div className="flex items-center mb-3">
            <MapPin className="w-5 h-5 text-red-200 ml-2" />
            <span className="text-red-100 text-sm font-medium">
              الموقع الحالي:
            </span>
          </div>

          <div className="mb-3">
            <div className="text-red-100 text-sm space-y-1">
              {locationDetails?.governorate &&
              locationDetails.governorate !== "غير محدد" ? (
                <>
                  <div className="flex items-center mb-2">
                    <MapPin className="w-5 h-5 text-white mr-2" />
                    <p className="text-white font-bold text-lg">
                      الموقع الحالي
                    </p>
                  </div>
                  <div className="flex items-center mb-1">
                    <Building2 className="w-4 h-4 text-green-300 mr-2" />
                    <p className="text-green-300 font-medium">
                      المحافظة: {locationDetails.governorate}
                    </p>
                  </div>
                  {locationDetails?.city &&
                    locationDetails.city !== "غير محدد" && (
                      <div className="flex items-center mb-1">
                        <Building2 className="w-4 h-4 text-green-200 mr-2" />
                        <p className="text-green-200">
                          المدينة: {locationDetails.city}
                        </p>
                      </div>
                    )}
                  {locationDetails?.detailedArea &&
                    locationDetails.detailedArea !== "غير محدد" && (
                      <div className="flex items-center mb-1">
                        <MapPin className="w-4 h-4 text-blue-300 mr-2" />
                        <p className="text-blue-300 font-semibold">
                          المنطقة التفصيلية: {locationDetails.detailedArea}
                        </p>
                      </div>
                    )}
                  {locationDetails?.district &&
                    locationDetails.district !== "غير محدد" && (
                      <div className="flex items-center mb-1">
                        <MapPin className="w-4 h-4 text-green-200 mr-2" />
                        <p className="text-green-200">
                          المنطقة: {locationDetails.district}
                        </p>
                      </div>
                    )}
                  {locationDetails?.neighborhood &&
                    locationDetails.neighborhood !== "غير محدد" && (
                      <div className="flex items-center mb-1">
                        <MapPinIcon className="w-4 h-4 text-yellow-300 mr-2" />
                        <p className="text-yellow-300">
                          الحي: {locationDetails.neighborhood}
                        </p>
                      </div>
                    )}
                  {locationDetails?.street &&
                    locationDetails.street !== "غير محدد" && (
                      <div className="flex items-center mb-1">
                        <Navigation className="w-4 h-4 text-purple-300 mr-2" />
                        <p className="text-purple-300">
                          الشارع: {locationDetails.street}
                        </p>
                      </div>
                    )}
                </>
              ) : (
                <>
                  <div className="flex items-center mb-2">
                    <MapPin className="w-5 h-5 text-white mr-2" />
                    <p className="text-white font-bold text-lg">
                      الموقع الحالي
                    </p>
                  </div>
                  <div className="flex items-center mb-1">
                    <AlertTriangle className="w-4 h-4 text-yellow-200 mr-2" />
                    <p className="text-yellow-200">
                      لم نتمكن من تحديد اسم المكان بدقة
                    </p>
                  </div>
                  <p className="text-red-200 text-xs">
                    سيتم عرض المراكز الطبية بناءً على الإحداثيات
                  </p>
                </>
              )}
            </div>
          </div>

          <div className="text-red-200 text-sm">
            <p>
              الإحداثيات: {location.latitude.toFixed(4)},{" "}
              {location.longitude.toFixed(4)}
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center justify-between">
          <button
            onClick={onHide}
            className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors text-sm font-medium"
          >
            إغلاق
          </button>

          {onRefresh && (
            <button
              onClick={onRefresh}
              className="px-4 py-2 bg-white text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              تحديث الموقع
            </button>
          )}
        </div>

        {/* Progress indicator */}
        <div className="mt-4 w-full bg-red-800 rounded-full h-1">
          <div
            className={`bg-white h-1 rounded-full transition-all ease-linear ${
              isVisible ? "animate-progress-countdown" : "w-full"
            }`}
            style={{
              animationDuration: isVisible ? "5s" : undefined,
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default LocationSuccessMessage;
