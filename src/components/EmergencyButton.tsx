export default function EmergencyButton() {
  const handleClick = () => {
    alert("🚑 جاري الاتصال بالإسعاف...");
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 left-6 bg-red-600 text-white px-5 py-4 rounded-full shadow-lg hover:bg-red-700 transition font-bold text-lg cursor-pointer hover:cursor-pointer"
    >
      🚑 اتصل بالطوارئ
    </button>
  );
}
