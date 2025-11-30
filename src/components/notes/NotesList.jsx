import React from "react";
import SearchBar from "../common/SearchBar";
import NoteItem from "./NoteItem";
import NoteStats from "./NoteStats";

export default function NotesList({
  notes,
  searchText,
  setSearchText,
  onEdit,
  onDelete,
  onToggleDone,
  stats,
}) {
  return (
    <div className="bg-white rounded-3xl py-6 px-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-0.5">
      <h2 className="mb-5 text-gray-900 text-2xl flex items-center gap-3 font-bold">
        <div className="w-10 h-10 bg-linear-to-br from-red-600 to-red-700 rounded-xl flex items-center justify-center">
          <i className="fas fa-clipboard-list text-white text-xl"></i>
        </div>
        قائمة الملاحظات
      </h2>

      <SearchBar value={searchText} onChange={setSearchText} />

      <div className="max-h-[400px] overflow-y-auto overflow-x-hidden pr-[5px] mb-5 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-red-600 [&::-webkit-scrollbar-thumb]:rounded-full">
        {notes.length === 0 ? (
          <div className="text-center py-5 text-gray-400">
            <i className="fas fa-clipboard text-[80px] mb-5 opacity-30 animate-[float_3s_infinite_ease-in-out]"></i>
            <p className="text-lg font-semibold">
              لا توجد ملاحظات مطابقة أو ملاحظات حتى الآن
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-[15px] py-6">
            {notes.map((note) => (
              <NoteItem
                key={note.id}
                note={note}
                onEdit={onEdit}
                onDelete={onDelete}
                onToggleDone={onToggleDone}
              />
            ))}
          </div>
        )}
      </div>

      <NoteStats stats={stats} />
    </div>
  );
}
