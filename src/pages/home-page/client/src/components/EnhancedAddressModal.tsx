import React from "react";
import { MapPin, Building, Navigation, CheckCircle } from "lucide-react";

interface EnhancedAddressModalProps {
  isOpen: boolean;
  address: {
    placeName: string;
    city: string;
    district: string;
    governorate: string;
    detailedArea?: string;
    neighborhood?: string;
    street?: string;
  };
  onContinue: () => void;
}

const EnhancedAddressModal: React.FC<EnhancedAddressModalProps> = ({
  isOpen,
  address,
  onContinue,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white/20 backdrop-blur-md bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              تم تحديد موقعك بنجاح
            </h2>
            <p className="text-gray-600">تأكد من صحة العنوان المحدد</p>
          </div>

          {/* Address Details */}
          <div className="bg-linear-to-br from-red-50 to-red-100 rounded-xl p-6 mb-8">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center shrink-0">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-red-800 mb-3">
                  عنوانك المحدد
                </h3>

                <div className="space-y-3">
                  {address.placeName && (
                    <div className="flex items-center space-x-3">
                      <Building className="w-4 h-4 text-red-600" />
                      <span className="text-red-800 font-medium">
                        {address.placeName}
                      </span>
                    </div>
                  )}

                  {address.district && (
                    <div className="flex items-center space-x-3">
                      <Navigation className="w-4 h-4 text-red-600" />
                      <span className="text-red-700">{address.district}</span>
                    </div>
                  )}

                  {address.city && (
                    <div className="flex items-center space-x-3">
                      <MapPin className="w-4 h-4 text-red-600" />
                      <span className="text-red-700">{address.city}</span>
                    </div>
                  )}

                  {address.governorate && (
                    <div className="flex items-center space-x-3">
                      <MapPin className="w-4 h-4 text-red-600" />
                      <span className="text-red-700">
                        {address.governorate}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Additional Details */}
          {(address.detailedArea || address.neighborhood || address.street) && (
            <div className="bg-gray-50 rounded-lg p-4 mb-8">
              <h4 className="font-semibold text-gray-800 mb-3">
                تفاصيل إضافية
              </h4>
              <div className="space-y-2">
                {address.detailedArea && (
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">المنطقة:</span>{" "}
                    {address.detailedArea}
                  </p>
                )}
                {address.neighborhood && (
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">الحي:</span>{" "}
                    {address.neighborhood}
                  </p>
                )}
                {address.street && (
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">الشارع:</span>{" "}
                    {address.street}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Info Box */}
          <div className="bg-blue-50 rounded-lg p-4 mb-8">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center shrink-0">
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-blue-800 mb-1">
                  معلومات مهمة
                </h4>
                <p className="text-sm text-blue-700">
                  سنستخدم هذا العنوان للبحث عن أقرب المستشفيات والمراكز الطبية
                  لك. يمكنك تغيير نطاق البحث في الخطوة التالية.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={onContinue}
              className="flex-1 bg-red-600 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:bg-red-700 transition-colors shadow-lg hover:shadow-xl"
            >
              متابعة البحث
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedAddressModal;
