import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './HorizontalScroll.css';

interface HorizontalScrollProps {
  children: React.ReactNode;
  className?: string;
}

const HorizontalScroll: React.FC<HorizontalScrollProps> = ({ children, className = '' }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* أسهم التنقل - تظهر فقط على الموبايل */}
      <div className="md:hidden">
        <button
          onClick={scrollLeft}
          className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 bg-red-600 hover:bg-red-700 text-white p-2 rounded-full shadow-lg transition-colors"
          aria-label="تمرير لليسار"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        
        <button
          onClick={scrollRight}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 bg-red-600 hover:bg-red-700 text-white p-2 rounded-full shadow-lg transition-colors"
          aria-label="تمرير لليمين"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* المحتوى القابل للتمرير */}
      <div
        ref={scrollRef}
        className="flex md:grid md:grid-cols-3 lg:grid-cols-4 gap-6 overflow-x-auto md:overflow-x-visible scrollbar-hide px-12 md:px-0"
        style={{
          touchAction: 'pan-x',
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default HorizontalScroll;
