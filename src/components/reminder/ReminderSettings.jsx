import React, { useEffect } from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import "./ReminderSettings.css";

export default function ReminderSettings({
  dailyReminder,
  setDailyReminder,
  reminderValue,
  setReminderValue,
  reminderUnit,
  setReminderUnit,
  notificationStatus,
  requestNotificationPermission,
}) {
  const getNotificationButtonStyle = () => {
    if (!("Notification" in window)) {
      return {
        text: "المتصفح لا يدعم الإشعارات",
        color: "from-red-500 to-red-600",
      };
    }
    if (notificationStatus === "granted") {
      return { text: "الإشعارات مفعلة", color: "from-green-500 to-green-600" };
    }
    if (notificationStatus === "denied") {
      return { text: "الإشعارات محظورة", color: "from-red-500 to-red-600" };
    }
    return { text: "تفعيل الإشعارات", color: "from-red-600 to-red-700" };
  };

  const notifBtnStyle = getNotificationButtonStyle();

  // 🌟🌟🌟 تم تصحيح خطأ الاعتماديات (Dependencies) هنا 🌟🌟🌟
  useEffect(() => {
    if (dailyReminder) {
      setReminderValue(5);
      setReminderUnit("minutes"); // يمكن تغييره حسب الحاجة
    }
    // تم إضافة setReminderValue و setReminderUnit إلى مصفوفة الاعتماديات
  }, [dailyReminder, setReminderValue, setReminderUnit]);

  return (
    <div className="bg-white rounded-3xl py-6 px-8 mb-[25px] shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-0.5">
      <h2 className="mb-5 text-gray-900 text-2xl flex items-center gap-3 font-bold">
        <div className="w-10 h-10 bg-linear-to-br from-red-600 to-red-700 rounded-xl flex items-center justify-center">
          <i className="fas fa-bell text-white text-xl"></i>
        </div>
        إعدادات التذكير
      </h2>

      <div className="flex items-center gap-[10px] p-[15px] bg-gray-50 rounded-xl hover:bg-gray-100 transition-all duration-300">
        <input
          type="checkbox"
          id="dailyReminder"
          checked={dailyReminder}
          onChange={(e) => setDailyReminder(e.target.checked)}
          className="w-6 h-6 cursor-pointer accent-red-600 hover:cursor-pointer"
        />
        <label
          htmlFor="dailyReminder"
          className="cursor-pointer font-semibold text-gray-900 hover:cursor-pointer"
        >
          تفعيل تذكير يومي
        </label>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-[15px] mt-[15px]">
        <div className="relative">
          <input
            type="number"
            min="1"
            value={reminderValue}
            onChange={(e) => setReminderValue(parseInt(e.target.value) || 1)}
            placeholder="أدخل الرقم"
            className="w-full p-4 pr-[50px] pl-4 border-2 border-gray-200 rounded-2xl text-[15px] transition-all duration-300 focus:outline-none focus:border-red-600 focus:shadow-[0_0_0_4px_rgba(220,38,38,0.15)] focus:-translate-y-0.5 cursor-pointer"
          />
          <i className="fas fa-stopwatch absolute right-[15px] top-1/2 -translate-y-1/2 text-gray-400 text-lg"></i>
        </div>

        <div className="relative">
          <Menu as="div" className="relative w-full">
            <MenuButton className="reminder-dropdown-button">
              <span className="text-gray-900">
                {reminderUnit === "minutes" && "دقيقة"}
                {reminderUnit === "hours" && "ساعة"}
                {reminderUnit === "days" && "يوم"}
              </span>
              <svg
                className="w-5 h-5 text-gray-400 reminder-dropdown-arrow"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </MenuButton>

            <MenuItems className="reminder-dropdown-menu">
              <div className="py-1">
                <MenuItem>
                  {({ active }) => (
                    <button
                      onClick={() => setReminderUnit("minutes")}
                      className={`reminder-dropdown-item ${
                        active ? "bg-red-50 text-red-700" : "text-gray-900"
                      }`}
                    >
                      دقيقة
                    </button>
                  )}
                </MenuItem>
                <MenuItem>
                  {({ active }) => (
                    <button
                      onClick={() => setReminderUnit("hours")}
                      className={`reminder-dropdown-item ${
                        active ? "bg-red-50 text-red-700" : "text-gray-900"
                      }`}
                    >
                      ساعة
                    </button>
                  )}
                </MenuItem>
                <MenuItem>
                  {({ active }) => (
                    <button
                      onClick={() => setReminderUnit("days")}
                      className={`reminder-dropdown-item ${
                        active ? "bg-red-50 text-red-700" : "text-gray-900"
                      }`}
                    >
                      يوم
                    </button>
                  )}
                </MenuItem>
              </div>
            </MenuItems>
          </Menu>
          <i className="fas fa-clock absolute right-[15px] top-1/2 -translate-y-1/2 text-gray-400 text-lg pointer-events-none"></i>
        </div>
      </div>

      <button
        onClick={requestNotificationPermission}
        className={`w-full mt-[15px] p-[14px_24px] bg-linear-to-r ${notifBtnStyle.color} rounded-2xl text-white text-base font-semibold flex items-center justify-center gap-2 transition-all duration-300 hover:-translate-y-[3px] hover:shadow-xl active:scale-95 cursor-pointer hover:cursor-pointer`}
      >
        <i className="fas fa-bell-on"></i>
        {notifBtnStyle.text}
      </button>
    </div>
  );
}
