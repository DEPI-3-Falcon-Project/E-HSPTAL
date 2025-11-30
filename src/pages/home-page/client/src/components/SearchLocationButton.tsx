import React, { useState } from 'react';
import { Search, MapPin } from 'lucide-react';

interface SearchLocationButtonProps {
  onClick: () => void;
  hasLocation?: boolean;
}

const SearchLocationButton: React.FC<SearchLocationButtonProps> = ({ 
  onClick, 
  hasLocation = false 
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <>
      {/* Animated Search Button - Fixed Position on Right Side */}
      <button
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="fixed right-6 bottom-32 z-40 group"
        title="ابحث عن أقرب مستشفى"
      >
        {/* Text Label - Only visible on hover */}
        <div className={`absolute right-28 top-1/2 -translate-y-1/2 transition-all duration-500 pointer-events-none ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'}`}>
          <div className="bg-gradient-to-r from-red-600 to-red-700 text-white px-5 py-2.5 rounded-xl shadow-2xl backdrop-blur-sm border border-red-400/30">
            <p className="text-base font-bold whitespace-nowrap text-center">
              اكتشف أقرب مكان طبي
            </p>
            <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-red-600 rotate-45 border-r border-b border-red-400/30" />
          </div>
        </div>

        {/* Outer animated ring */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-red-500 via-red-600 to-red-700 animate-spin-slow opacity-0 group-hover:opacity-100 transition-opacity duration-300" 
          style={{
            animation: 'pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
          }}
        />

        {/* Inner pulse ring */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-red-400 to-red-600 opacity-20 animate-pulse" />

        {/* Main Button */}
        <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-red-600 via-red-700 to-red-800 shadow-2xl flex items-center justify-center cursor-pointer transform transition-all duration-300 hover:scale-110 hover:shadow-3xl"
          style={{
            boxShadow: hasLocation 
              ? '0 0 30px rgba(220, 38, 38, 0.6), 0 0 60px rgba(220, 38, 38, 0.3)'
              : '0 0 20px rgba(220, 38, 38, 0.4)'
          }}
        >
          {/* Icon Container with animation */}
          <div className={`relative transition-all duration-500 ${isHovered ? 'scale-125 rotate-12' : 'scale-100 rotate-0'}`}>
            {hasLocation ? (
              <MapPin className="w-10 h-10 text-white drop-shadow-lg animate-bounce" />
            ) : (
              <Search className="w-10 h-10 text-white drop-shadow-lg" 
                style={{
                  animation: 'search-pulse 2s ease-in-out infinite'
                }}
              />
            )}
          </div>

          {/* Animated indicator dots */}
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full animate-ping opacity-100" />
          <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-red-300 rounded-full animate-pulse" />
          
          {/* Glow effect on hover */}
          <div className={`absolute inset-0 rounded-full bg-red-400 opacity-0 group-hover:opacity-30 transition-opacity duration-300 blur-xl`} />
        </div>
      </button>

      {/* Floating animation background elements */}
      <style>{`
        @keyframes search-pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.7;
            transform: scale(1.15);
          }
        }

        @keyframes pulse-ring {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          100% {
            transform: scale(1.3);
            opacity: 0;
          }
        }

        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
      `}</style>
    </>
  );
};

export default SearchLocationButton;
