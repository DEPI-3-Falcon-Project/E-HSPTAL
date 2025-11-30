import React from "react";
import "./notes.css";
import "react-datepicker/dist/react-datepicker.css";
import "react-time-picker/dist/TimePicker.css";
import "react-clock/dist/Clock.css";
import Layout from "../../components/layout/Layout";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import NoteForm from "../../components/notes/NoteForm";
import ReminderSettings from "../../components/reminder/ReminderSettings";
import NotesList from "../../components/notes/NotesList";
import { useNotes } from "../../hooks/useNotes";
import { useNotifications } from "../../hooks/useNotifications";

export default function NotesPage() {
  const {
    notes,
    addNote,
    updateNote,
    deleteNote,
    toggleDone,
    searchText,
    setSearchText,
    getFilteredNotes,
    stats,
  } = useNotes();

  const {
    dailyReminder,
    setDailyReminder,
    reminderValue,
    setReminderValue,
    reminderUnit,
    setReminderUnit,
    notificationStatus,
    requestNotificationPermission,
  } = useNotifications(notes);

  const [editMode, setEditMode] = React.useState(false);
  const [currentEditNote, setCurrentEditNote] = React.useState(null);
  const formSectionRef = React.useRef(null);

  const handleAdd = (noteData) => {
    addNote(noteData);
  };

  const handleEdit = (noteData) => {
    updateNote(currentEditNote.id, noteData);
    setEditMode(false);
    setCurrentEditNote(null);
  };

  const handleStartEdit = (note) => {
    setEditMode(true);
    setCurrentEditNote(note);
    requestAnimationFrame(() => {
      if (formSectionRef.current) {
        formSectionRef.current.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    });
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setCurrentEditNote(null);
  };

  return (
    <Layout>
      <div className="mt-24">
        <Header />
      </div>

      <div ref={formSectionRef} className="scroll-mt-28">
        <NoteForm
          mode={editMode ? "edit" : "add"}
          initialData={currentEditNote}
          onSubmit={editMode ? handleEdit : handleAdd}
          onCancel={handleCancelEdit}
        />
      </div>

      <ReminderSettings
        dailyReminder={dailyReminder}
        setDailyReminder={setDailyReminder}
        reminderValue={reminderValue}
        setReminderValue={setReminderValue}
        reminderUnit={reminderUnit}
        setReminderUnit={setReminderUnit}
        notificationStatus={notificationStatus}
        requestNotificationPermission={requestNotificationPermission}
      />

      <NotesList
        notes={getFilteredNotes()}
        searchText={searchText}
        setSearchText={setSearchText}
        onEdit={handleStartEdit}
        onDelete={deleteNote}
        onToggleDone={toggleDone}
        stats={stats}
      />

      <Footer />
    </Layout>
  );
}
