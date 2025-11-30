import { useState } from 'react';
import { useLocalStorage } from './useLocalStorage';

export function useNotes() {
  const [notes, setNotes] = useLocalStorage('healthNotes', []);
  const [searchText, setSearchText] = useState('');

  // إضافة ملاحظة جديدة
  const addNote = (noteData) => {
    const newNote = {
      id: Date.now(),
      text: noteData.text,
      date: noteData.date,
      time: noteData.time,
      done: false,
      notifiedToday: false,
    };
    setNotes([...notes, newNote]);
  };

  // تحديث ملاحظة
  const updateNote = (id, noteData) => {
    setNotes(notes.map(n => 
      n.id === id 
        ? { ...n, text: noteData.text, date: noteData.date, time: noteData.time, notifiedToday: false }
        : n
    ));
  };

  // حذف ملاحظة
  const deleteNote = (id) => {
    setNotes(notes.filter(n => n.id !== id));
  };

  // تبديل حالة الإنجاز
  const toggleDone = (id) => {
    setNotes(notes.map(n => 
      n.id === id ? { ...n, done: !n.done } : n
    ));
  };

  // تحديث حالة الإشعار
  const markAsNotified = (id) => {
    setNotes(prevNotes => prevNotes.map(n => 
      n.id === id ? { ...n, notifiedToday: true } : n
    ));
  };

  // تصفية وفرز الملاحظات
  const getFilteredNotes = () => {
    let filtered = notes;
    if (searchText.trim()) {
      filtered = notes.filter(n => 
        n.text.toLowerCase().includes(searchText.toLowerCase())
      );
    }
    return filtered.sort((a, b) => {
      if (a.done !== b.done) return a.done ? 1 : -1;
      const aDate = new Date(`${a.date}T${a.time}`);
      const bDate = new Date(`${b.date}T${b.time}`);
      return aDate - bDate;
    });
  };

  // حساب الإحصائيات
  const stats = {
    all: notes.length,
    done: notes.filter(n => n.done).length,
    left: notes.filter(n => !n.done).length
  };

  return {
    notes,
    addNote,
    updateNote,
    deleteNote,
    toggleDone,
    markAsNotified,
    searchText,
    setSearchText,
    getFilteredNotes,
    stats
  };
}
