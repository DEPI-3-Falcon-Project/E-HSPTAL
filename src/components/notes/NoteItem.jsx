import React, { useRef, useEffect, useState } from "react";

export default function NoteItem({ note, onEdit, onDelete, onToggleDone }) {
  const textRef = useRef(null);
  const [needsScroll, setNeedsScroll] = useState(false);

  useEffect(() => {
    if (textRef.current) {
      const lineHeight = parseFloat(
        getComputedStyle(textRef.current).lineHeight
      );
      const maxHeight = lineHeight * 3;
      setNeedsScroll(textRef.current.scrollHeight > maxHeight);
    }
  }, [note.text]);

  return (
    <div
      className={`flex flex-col sm:flex-row sm:justify-between sm:items-center p-3 sm:p-4 rounded-[20px] border-2 transition-all duration-300 ${
        note.done
          ? "bg-linear-to-r from-green-50 to-green-100 border-green-200 opacity-60"
          : "bg-linear-to-r from-gray-50 to-gray-100 border-gray-200 hover:border-red-600 hover:shadow-md sm:hover:-translate-y-[3px]"
      }`}
    >
      <div className="flex-1 min-w-0 mb-3 sm:mb-0">
        <div
          className={`flex items-start gap-2 sm:gap-2.5 text-[14px] sm:text-[16px] font-semibold mb-2 ${
            note.done ? "line-through text-gray-400" : "text-gray-900"
          }`}
        >
          <i
            className={`fas fa-${
              note.done ? "check-circle" : "circle"
            } text-red-600 text-sm sm:text-base shrink-0 mt-1`}
          ></i>

          <span
            ref={textRef}
            className={`wrap-break-words leading-relaxed pr-1 ${
              needsScroll
                ? "overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
                : "overflow-hidden"
            }`}
            style={{
              maxHeight: "4.5em",
              display: "block",
            }}
          >
            {note.text}
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-[12px] sm:text-[13px] text-gray-600 flex-wrap mr-6">
          {note.date && (
            <span className="flex items-center gap-1.5 sm:gap-1.5">
              <i className="fas fa-calendar text-[11px] sm:text-[12px]"></i>
              {note.date}
            </span>
          )}
          {note.time && (
            <span className="flex items-center gap-1 sm:gap-1.5">
              <i className="fas fa-clock text-[11px] sm:text-[12px]"></i>
              {note.time}
            </span>
          )}
        </div>
      </div>

      <div className="flex gap-2 w-full sm:w-auto sm:mr-2 shrink-0">
        <button
          onClick={() => onToggleDone(note.id)}
          title={note.done ? "إلغاء الإكمال" : "تمت"}
          className="flex-1 sm:flex-none px-3 py-2.5 sm:py-2 bg-linear-to-r from-green-500 to-green-600 text-white rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 hover:scale-105 hover:cursor-pointer hover:shadow-[0_6px_16px_rgba(16,185,129,0.3)] active:scale-95"
        >
          <i className="fas fa-check"></i>
        </button>

        <button
          onClick={() => onEdit(note)}
          title="تعديل"
          className="flex-1 sm:flex-none px-3 py-2.5 sm:py-2 bg-linear-to-r from-orange-500 to-orange-600 text-white rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 hover:scale-105 hover:cursor-pointer hover:shadow-[0_6px_16px_rgba(249,115,22,0.3)] active:scale-95"
        >
          <i className="fas fa-edit"></i>
        </button>

        <button
          onClick={() => onDelete(note.id)}
          title="حذف"
          className="flex-1 sm:flex-none px-3 py-2.5 sm:py-2 bg-linear-to-r from-red-500 to-red-600 text-white rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 hover:scale-105 hover:cursor-pointer hover:shadow-[0_6px_16px_rgba(239,68,68,0.3)] active:scale-95"
        >
          <i className="fas fa-trash"></i>
        </button>
      </div>
    </div>
  );
}
