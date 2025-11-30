import React, { useState } from "react";
import { reverseGeocode } from "../utils/geocode";

interface LocationInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

const LocationInput: React.FC<LocationInputProps> = ({
  value,
  onChange,
  error,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [detectionError, setDetectionError] = useState<string | null>(null);

  const handleDetectLocation = () => {
    setIsLoading(true);
    setDetectionError(null);

    if (!navigator.geolocation) {
      setDetectionError("المتصفح لا يدعم تحديد الموقع الجغرافي.");
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const address = await reverseGeocode(latitude, longitude);
          onChange(address);
        } catch (err) {
          setDetectionError(
            "فشل في الحصول على عنوان الموقع. يرجى المحاولة مرة أخرى."
          );
        } finally {
          setIsLoading(false);
        }
      },
      (err) => {
        setDetectionError(`غير قادر على استرداد موقعك: ${err.message}`);
        setIsLoading(false);
      }
    );
  };

  return (
    <div className="space-y-2" dir="rtl">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        الموقع <span className="text-red-500">*</span>
      </label>

      <div className="flex">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`flex-1 border ${
            error ? "border-red-500" : "border-gray-300"
          } rounded-r-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent`}
          placeholder="أدخل الموقع أو اكتشفه تلقائيًا"
        />

        <button
          onClick={handleDetectLocation}
          disabled={isLoading}
          className="bg-red-600 text-white px-4 py-2 rounded-l-lg hover:bg-red-700 transition-colors flex items-center disabled:opacity-50"
        >
          {isLoading ? (
            <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          ) : (
            <span>اكتشف</span>
          )}
        </button>
      </div>

      {(error || detectionError) && (
        <p className="text-red-500 text-sm">{error || detectionError}</p>
      )}
    </div>
  );
};

export default LocationInput;