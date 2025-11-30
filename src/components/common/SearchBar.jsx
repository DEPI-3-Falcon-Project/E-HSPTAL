import React from 'react';

export default function SearchBar({ value, onChange }) {
  return (
    <div className="relative mb-5">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="البحث في الملاحظات..."
        className="w-full p-4 pr-[50px] pl-4 border-2 border-gray-200 rounded-2xl text-[15px] transition-all duration-300 focus:outline-none focus:border-red-600 focus:shadow-[0_0_0_4px_rgba(220,38,38,0.15)] focus:-translate-y-0.5"
      />
      <i className="fas fa-search absolute right-[15px] top-1/2 -translate-y-1/2 text-gray-400 text-lg"></i>
    </div>
  );
}