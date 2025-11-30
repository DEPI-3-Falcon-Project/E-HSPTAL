import React, { useState, useEffect } from 'react';
import './CustomTimePicker.css';

const CustomTimePicker = ({ value, onChange, className = "" }) => {
  const [hours, setHours] = useState("");
  const [minutes, setMinutes] = useState("");
  const [amPm, setAmPm] = useState("AM");

  useEffect(() => {
    if (value) {
      const [time, period] = value.split(' ');
      if (time && period) {
        const [h, m] = time.split(':');
        setHours(h || "");
        setMinutes(m || "");
        setAmPm(period || "AM");
      }
    } else {
      setHours("");
      setMinutes("");
      setAmPm("AM");
    }
  }, [value]);

  const handleHoursChange = (e) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val === '') {
      setHours("");
      onChange("");
      return;
    }
    
    const num = parseInt(val, 10);
    if (num > 12) val = "12";
    if (num < 1) val = "01";
    
    setHours(val);
    if (minutes && amPm) {
      onChange(`${val}:${minutes} ${amPm}`);
    }
  };

  const handleMinutesChange = (e) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val === '') {
      setMinutes("");
      onChange("");
      return;
    }
    
    const num = parseInt(val, 10);
    if (num > 59) val = "59";
    if (num < 0) val = "00";
    
    if (val.length === 1 && num > 5) val = "0" + val;
    if (val.length === 2 && num < 10) val = "0" + num;
    
    setMinutes(val);
    if (hours && amPm) {
      onChange(`${hours}:${val} ${amPm}`);
    }
  };

  const handleAmPmChange = (newAmPm) => {
    setAmPm(newAmPm);
    if (hours && minutes) {
      onChange(`${hours}:${minutes} ${newAmPm}`);
    }
  };

  return (
    <div className={`flex items-center justify-between gap-3 ${className}`}>
      <div className="w-full flex flex-row-reverse items-center justify-center border-2 border-gray-200 rounded-2xl bg-white shadow-sm hover:border-gray-300 transition-all duration-300">
        <input
          type="text"
          value={hours}
          onChange={handleHoursChange}
          placeholder="12"
          maxLength="2"
          className="w-14 px-3 py-4 text-center text-[15px] bg-transparent focus:outline-none focus:border-red-600 rounded-l-2xl transition-all duration-300 cursor-pointer hover:cursor-pointer"
        />
        <span className="text-gray-400 text-lg font-medium">:</span>
        <input
          type="text"
          value={minutes}
          onChange={handleMinutesChange}
          placeholder="59"
          maxLength="2"
          className="w-14 px-3 py-4 text-center text-[15px] bg-transparent focus:outline-none focus:border-red-600 rounded-r-2xl transition-all duration-300 cursor-pointer hover:cursor-pointer"
        />
      </div>

      <div className="am-pm-buttons flex gap-2">
        <button
          type="button"
          onClick={() => handleAmPmChange("AM")}
          className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 border-2 cursor-pointer hover:cursor-pointer ${
            amPm === "AM"
              ? "bg-red-600 text-white border-red-600 shadow-md"
              : "bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
          }`}
        >
          AM
        </button>
        <button
          type="button"
          onClick={() => handleAmPmChange("PM")}
          className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 border-2 cursor-pointer hover:cursor-pointer ${
            amPm === "PM"
              ? "bg-red-600 text-white border-red-600 shadow-md"
              : "bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
          }`}
        >
          PM
        </button>
      </div>
    </div>
  );
};

export default CustomTimePicker;