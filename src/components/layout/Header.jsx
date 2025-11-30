import React from "react";

export default function Header() {
  return (
    <header className="bg-white py-6 px-4 sm:px-8 rounded-3xl shadow-2xl text-center mb-7 animate-[slideDown_0.6s_ease-out]">
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-[15px] mb-2.5">
        <div className="inline-flex w-[60px] h-[60px] sm:w-[70px] sm:h-[70px] bg-linear-to-br from-red-600 to-red-700 rounded-full items-center justify-center animate-[pulse_2s_infinite] shrink-0">
          <i className="fas fa-heart-pulse text-white text-[28px] sm:text-[35px]"></i>
        </div>

        <h1 className="text-[26px] sm:text-[36px] m-0 bg-linear-to-br from-red-600 to-red-700 bg-clip-text text-transparent font-bold leading-tight text-center sm:text-left">
          ملاحظاتي الصحية
        </h1>
      </div>
    </header>
  );
}
