import React from "react";
import emergency from "../assets/emergency.gif";

const EmergencySection: React.FC = () => {
  return (
    <section className="bg-white text-center py-10 mx-auto px-5">
      <div className="flex justify-center items-center gap-3">
        <img src={emergency} alt="logo" width={100} />
        <h2 className="text-4xl sm:text-3xl md:text-5xl font-bold text-[#d62828] mb-3 mt-5">
          أرقام الطوارئ السريعة
        </h2>
      </div>
      <p className="mr-10 text-[#777] text-[1.2rem] md:text-[1rem] sm:text-[0.9rem] font-semibold">
        اتصل مباشرة بخدمات الطوارئ
      </p>

      <div className="container mx-auto px-10 mt-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-[20px] shadow-md p-6 border-t-4 border-[#e85c0d] text-center transform transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_4px_15px_rgba(255,1,1,0.34)] opacity-0 animate-fade-in-up cursor-pointer">
            <div className="w-[75px] h-[75px] mx-auto mb-3 rounded-full bg-orange-500 flex items-center justify-center text-white text-3xl">
              <i className="fas fa-fire-extinguisher text-white"></i>
            </div>
            <div className="text-lg font-bold mb-4 mt-4">الحماية المدنية</div>
            <div className="text-[28px] font-extrabold text-[#e85c0d] mb-4">
              180
            </div>
            <div className="flex justify-center gap-3 mt-3">
              <button className="bg-gray-200 text-gray-700 px-4 py-4 rounded-lg flex items-center gap-2 hover:-translate-y-1 transition-all cursor-pointer hover:cursor-pointer">
                <i className="fas fa-map-marker-alt"></i> أقرب مركز
              </button>
              <button className="bg-[#e85c0d] text-white px-4 py-4 rounded-lg flex items-center gap-2 hover:-translate-y-1 transition-all cursor-pointer hover:cursor-pointer">
                <i className="fas fa-phone"></i> اتصال فوري
              </button>
            </div>
          </div>

          <div className="bg-white rounded-[30px] shadow-md p-6 border-t-4 border-blue-600 text-center transform transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_4px_15px_rgba(255,1,1,0.34)] opacity-0 animate-fade-in-up [animation-delay:0.2s] cursor-pointer">
            <div className="w-[75px] h-[75px] mx-auto mb-3 rounded-full bg-blue-600 flex items-center justify-center text-white text-3xl">
              <i className="fas fa-shield-alt text-white"></i>
            </div>
            <div className="text-lg font-bold mb-4 mt-4">الشرطة</div>
            <div className="text-[28px] font-extrabold text-blue-600 mb-4">
              122
            </div>
            <div className="flex justify-center gap-3 mt-3">
              <button className="bg-gray-200 text-gray-700 px-4 py-4 rounded-lg flex items-center gap-2 hover:-translate-y-1 transition-all cursor-pointer hover:cursor-pointer">
                <i className="fas fa-map-marker-alt"></i> أقرب مركز
              </button>
              <button className="bg-blue-600 text-white px-4 py-4 rounded-lg flex items-center gap-2 hover:-translate-y-1 transition-all cursor-pointer hover:cursor-pointer">
                <i className="fas fa-phone"></i> اتصال فوري
              </button>
            </div>
          </div>

          <div className="bg-white rounded-[30px] shadow-md p-6 border-t-4 border-red-600 text-center transform transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_4px_15px_rgba(255,1,1,0.34)] opacity-0 animate-fade-in-up [animation-delay:0.4s] cursor-pointer">
            <div className="w-[75px] h-[75px] mx-auto mb-3 rounded-full bg-red-600 flex items-center justify-center text-white text-3xl">
              <i className="fas fa-ambulance text-white"></i>
            </div>
            <div className="text-lg font-bold mb-4 mt-4">الإسعاف</div>
            <div className="text-[28px] font-extrabold text-red-600 mb-4">
              123
            </div>
            <div className="flex justify-center gap-3 mt-3">
              <button className="bg-gray-200 text-gray-700 px-4 py-4 rounded-lg flex items-center gap-2 hover:-translate-y-1 transition-all cursor-pointer hover:cursor-pointer">
                <i className="fas fa-map-marker-alt"></i> أقرب مركز
              </button>
              <button className="bg-red-600 text-white px-4 py-4 rounded-lg flex items-center gap-2 hover:-translate-y-1 transition-all cursor-pointer hover:cursor-pointer">
                <i className="fas fa-phone"></i> اتصال فوري
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EmergencySection;
