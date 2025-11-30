import React from "react";

export default function NoteStats({ stats }) {
  return (
    <div className="grid grid-cols-3 gap-2 sm:gap-[15px] mt-5">
      <div className="text-center p-3 sm:p-[20px] bg-linear-to-br from-red-600 to-red-700 rounded-[20px] text-white font-bold text-sm sm:text-base transition-transform duration-300 hover:scale-105 relative overflow-hidden group">
        <i className="fas fa-list text-lg sm:text-xl block mb-1"></i>
        <div>
          الكل <span>{stats.all}</span>
        </div>
        <div className="absolute top-[-50%] right-[-50%] w-[200%] h-[200%] bg-white/10 rotate-45 transition-all duration-600 group-hover:right-[-100%]"></div>
      </div>

      <div className="text-center p-3 sm:p-[20px] bg-linear-to-br from-green-500 to-green-600 rounded-[20px] text-white font-bold text-sm sm:text-base transition-transform duration-300 hover:scale-105 relative overflow-hidden group">
        <i className="fas fa-check-circle text-lg sm:text-xl block mb-1"></i>
        <div>
          تمت <span>{stats.done}</span>
        </div>
        <div className="absolute top-[-50%] right-[-50%] w-[200%] h-[200%] bg-white/10 rotate-45 transition-all duration-600 group-hover:right-[-100%]"></div>
      </div>

      <div className="text-center p-3 sm:p-[20px] bg-linear-to-br from-red-500 to-red-600 rounded-[20px] text-white font-bold text-sm sm:text-base transition-transform duration-300 hover:scale-105 relative overflow-hidden group">
        <i className="fas fa-hourglass-half text-lg sm:text-xl block mb-1"></i>
        <div>
          متبقية <span>{stats.left}</span>
        </div>
        <div className="absolute top-[-50%] right-[-50%] w-[200%] h-[200%] bg-white/10 rotate-45 transition-all duration-600 group-hover:right-[-100%]"></div>
      </div>
    </div>
  );
}
