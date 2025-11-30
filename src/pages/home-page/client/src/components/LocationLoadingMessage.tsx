import React from "react";
import { MapPin, Search, Heart } from "lucide-react";
import HeartbeatLine from "./HeartbeatLine";

interface LocationLoadingMessageProps {
  isVisible: boolean;
}

const LocationLoadingMessage: React.FC<LocationLoadingMessageProps> = ({
  isVisible,
}) => {
  if (!isVisible) return null;

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-linear-to-r from-red-600 to-red-700 text-white rounded-2xl shadow-2xl p-6 mx-4 max-w-md w-full">
        {/* Loading header */}
        <div className="flex items-center mb-4">
          <div className="relative">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <MapPin className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div className="absolute inset-0 bg-white rounded-full opacity-20 animate-ping"></div>
          </div>
          <div className="mr-3">
            <div className="flex items-center">
              <Search className="w-5 h-5 text-white mr-2" />
              <h3 className="text-lg font-bold">جاري تحديد موقعك...</h3>
            </div>
            <p className="text-red-200 text-sm">يرجى الانتظار قليلاً</p>
          </div>
        </div>

        {/* Heartbeat animation */}
        <div className="mb-4">
          <HeartbeatLine color="#fca5a5" height="50px" />
        </div>

        {/* Loading text */}
        <div className="text-center">
          <div className="flex items-center justify-center">
            <Heart className="w-4 h-4 text-red-200 mr-2" />
            <p className="text-red-100 text-sm">
              نحدد موقعك لنعرض لك أقرب المراكز الطبية
            </p>
          </div>
        </div>

        {/* Animated dots */}
        <div className="flex justify-center mt-4 space-x-1">
          <div
            className="w-2 h-2 bg-white rounded-full animate-bounce"
            style={{ animationDelay: "0ms" }}
          ></div>
          <div
            className="w-2 h-2 bg-white rounded-full animate-bounce"
            style={{ animationDelay: "150ms" }}
          ></div>
          <div
            className="w-2 h-2 bg-white rounded-full animate-bounce"
            style={{ animationDelay: "300ms" }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default LocationLoadingMessage;
