import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const FloatingEmergencyButton: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const emergencyNumbers = [
    { 
      name: 'الشرطة', 
      number: '122',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      )
    },
    { 
      name: 'الإسعاف', 
      number: '123',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
    { 
      name: 'الإطفاء', 
      number: '180',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
        </svg>
      )
    },
    { 
      name: 'الإنقاذ العام', 
      number: '112',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      )
    },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleNumberClick = (number: string) => {
    window.location.href = `tel:${number}`;
  };

  return (
    <div ref={containerRef} className="fixed flex flex-col items-center bottom-6 right-3 z-50">
      <motion.div
        className="mb-4 space-y-2 "
        animate={{ opacity: isExpanded ? 1 : 0, height: isExpanded ? 'auto' : 0 }}
        transition={{ duration: 0.3 }}
      >
        {emergencyNumbers.map((item, index) => (
          <motion.div
            key={index}
            className="bg-white p-3 rounded-lg shadow-lg flex items-center cursor-pointer"
            onClick={() => handleNumberClick(item.number)}
            style={{ pointerEvents: isExpanded ? 'auto' : 'none' }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="bg-red-100 p-2 rounded-full ml-3">
              {item.icon}
            </div>
            <div className="text-right">
              <div className="font-medium">{item.name}</div>
              <div className="text-gray-600">{item.number}</div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <motion.button
        className="bg-red-600 text-white rounded-full w-20 h-20 flex items-center justify-center shadow-lg border-4 border-white motion-btn"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={{ 
          scale: [1, 1.2, 1],
          boxShadow: [
            "0 0 0 0 rgba(220, 38, 38, 0.7)",
            "0 0 0 20px rgba(220, 38, 38, 0)",
            "0 0 0 0 rgba(220, 38, 38, 0)"
          ]
        }}
        transition={{ 
          repeat: Infinity, 
          repeatType: "loop", 
          duration: 2 
        }}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </motion.button>
    </div>
  );
};

export default FloatingEmergencyButton;