import React from 'react';

export default function Layout({ children }) {
  return (
    <>
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-30px) rotate(180deg); }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        @keyframes sparkle {
          0%, 100% { transform: scale(1) rotate(0deg); }
          50% { transform: scale(1.2) rotate(180deg); }
        }
        .float-animation {
          animation: float 20s infinite ease-in-out;
        }
        .float-animation-delayed {
          animation: float 20s infinite ease-in-out;
          animation-delay: 3s;
        }
      `}</style>
      <div className="min-h-screen bg-transparent p-5 font-['Cairo'] overflow-x-hidden" dir="rtl">
        {/* خلفية متحركة */}
        <div className="fixed top-[-100px] right-[-100px] w-[300px] h-[300px] rounded-full bg-red-600/5 float-animation"></div>
        <div className="fixed bottom-[-150px] left-[-150px] w-[400px] h-[400px] rounded-full bg-red-600/5 float-animation-delayed"></div>

        <div className="max-w-5xl mx-auto relative z-10">
          {children}
        </div>
      </div>
    </>
  );
}