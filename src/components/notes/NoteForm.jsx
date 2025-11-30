import React, { useState, useEffect, useRef } from "react";
import DatePicker from "react-datepicker";
import CustomTimePicker from "./CustomTimePicker";
import "react-datepicker/dist/react-datepicker.css";

export default function NoteForm({
  mode = "add",
  initialData = null,
  onSubmit,
  onCancel,
}) {
  const [noteText, setNoteText] = useState("");
  const [noteDate, setNoteDate] = useState(null);
  const [noteTime, setNoteTime] = useState("");
  const [borderError, setBorderError] = useState(false);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (mode === "edit" && initialData) {
      setNoteText(initialData.text || "");
      setNoteDate(initialData.date ? new Date(initialData.date) : null);
      setNoteTime(initialData.time || "");
    } else {
      clearForm();
    }
  }, [mode, initialData]);

  const clearForm = () => {
    setNoteText("");
    setNoteDate(null);
    setNoteTime("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleSubmit = () => {
    const text = noteText.trim();
    if (!text) {
      setBorderError(true);
      setTimeout(() => setBorderError(false), 500);
      return;
    }

    const formattedDate = noteDate
      ? new Date(noteDate.getTime() - noteDate.getTimezoneOffset() * 60000)
          .toISOString()
          .split("T")[0]
      : "";

    onSubmit({ text, date: formattedDate, time: noteTime }); // time now in 12-hour format like "2:30 PM"
    if (mode === "add") clearForm();
  };

  const handleAutoResize = (e) => {
    const textarea = textareaRef.current;
    textarea.style.height = "auto";
    const lineHeight = 24;
    const maxHeight = 4 * lineHeight + 32;
    textarea.style.height = `${Math.min(textarea.scrollHeight, maxHeight)}px`;
    textarea.style.overflowY =
      textarea.scrollHeight > maxHeight ? "auto" : "hidden";
    setNoteText(e.target.value);
  };

  return (
    <div className="bg-white rounded-3xl py-6 px-8 mb-[25px] shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-0.5">
      <h2 className="mb-5 text-gray-900 text-2xl flex items-center gap-3 font-bold">
        <div className="w-10 h-10 bg-linear-to-br from-red-600 to-red-700 rounded-xl flex items-center justify-center">
          <i
            className={`fas fa-${
              mode === "edit" ? "edit" : "plus-circle"
            } text-white text-xl`}
          ></i>
        </div>
        {mode === "edit" ? "تعديل الملاحظة" : "إضافة ملاحظة جديدة"}
      </h2>

      <div className="relative mb-[15px]">
        <textarea
          ref={textareaRef}
          value={noteText}
          onChange={handleAutoResize}
          placeholder="اكتب الملاحظة هنا..."
          rows={1}
          className={`w-full p-4 pr-[50px] pl-4 border-2 rounded-2xl text-[15px] resize-none transition-all duration-300 
            focus:outline-none focus:border-red-600 focus:shadow-[0_0_0_4px_rgba(220,38,38,0.15)] 
            ${
              borderError ? "border-red-500" : "border-gray-200"
            } custom-scrollbar`}
          style={{ lineHeight: "24px", overflowY: "hidden" }}
        ></textarea>
        <i className="fas fa-pen absolute right-[15px] top-5 text-gray-400 text-lg pointer-events-none"></i>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-[15px] mt-[15px]">
        <div className="relative">
          <DatePicker
            selected={noteDate}
            onChange={(date) => setNoteDate(date)}
            dateFormat="yyyy-MM-dd"
            placeholderText="اختر التاريخ"
            className="w-full p-4 pl-[50px] pr-4 border-2 border-gray-200 rounded-2xl text-[15px] transition-all duration-300 focus:outline-none focus:border-red-600 focus:shadow-[0_0_0_4px_rgba(220,38,38,0.15)] cursor-pointer hover:cursor-pointer"
            calendarClassName="notes-datepicker"
            popperClassName="notes-datepicker"
            wrapperClassName="w-full"
          />
          <i className="fas fa-calendar absolute left-[15px] top-1/2 -translate-y-1/2 text-gray-400 text-lg cursor-pointer hover:cursor-pointer"></i>
        </div>

        <div className="relative custom-time-picker-container">
          <CustomTimePicker
            onChange={(value) => setNoteTime(value || "")}
            value={noteTime || ""}
            className="w-full"
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mt-[15px]">
        <button
          onClick={handleSubmit}
          className={`flex-1 p-[14px_24px] rounded-2xl text-white text-base font-semibold flex items-center justify-center gap-2 
          transition-all duration-300 hover:-translate-y-[3px] hover:shadow-xl active:scale-95 cursor-pointer hover:cursor-pointer
          ${
            mode === "edit"
              ? "bg-linear-to-r from-orange-500 to-orange-600"
              : "bg-linear-to-r from-red-600 to-red-700"
          }
          `}
        >
          <i className={`fas fa-${mode === "edit" ? "save" : "plus"}`}></i>
          {mode === "edit" ? "حفظ التعديل" : "إضافة الملاحظة"}
        </button>

        {mode === "edit" && (
          <button
            onClick={onCancel}
            className="px-6 p-[14px_24px] rounded-2xl bg-gray-500 text-white text-base font-semibold flex items-center justify-center gap-2
            transition-all duration-300 hover:-translate-y-[3px] hover:shadow-xl active:scale-95 cursor-pointer hover:cursor-pointer"
          >
            <i className="fas fa-times"></i>
            إلغاء
          </button>
        )}
      </div>
    </div>
  );
}
