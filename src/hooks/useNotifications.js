import { useState, useEffect } from 'react';

export function useNotifications(notes) {
  const [dailyReminder, setDailyReminder] = useState(false);
  const [reminderValue, setReminderValue] = useState(10);
  const [reminderUnit, setReminderUnit] = useState('minutes');
  const [notificationStatus, setNotificationStatus] = useState('default');

  // فحص صلاحيات الإشعارات
  useEffect(() => {
    if ('Notification' in window) {
      setNotificationStatus(Notification.permission);
    }
  }, []);

  // فحص التذكيرات كل 60 ثانية
  useEffect(() => {
    const interval = setInterval(() => {
      checkReminders();
    }, 60000);
    return () => clearInterval(interval);
  }, [notes, dailyReminder, reminderValue, reminderUnit]);

  // طلب صلاحيات الإشعارات
  const requestNotificationPermission = () => {
    if (!('Notification' in window)) {
      alert('المتصفح لا يدعم الإشعارات');
      return;
    }
    if (Notification.permission === 'default') {
      Notification.requestPermission().then(permission => {
        setNotificationStatus(permission);
        if (permission === 'granted') {
          new Notification('تم التفعيل بنجاح', { 
            body: 'ستصلك الآن تذكيراتك الصحية في موعدها!' 
          });
        }
      });
    } else if (Notification.permission === 'granted') {
      alert('الإشعارات مفعلة بالفعل!');
    } else {
      alert('للأسف، لا يمكن تفعيل الإشعارات إلا عبر إعدادات المتصفح.');
    }
  };

  // فحص موعد التذكير
  const checkReminders = () => {
    if (!('Notification' in window) || Notification.permission !== 'granted') return;

    notes.forEach(note => {
      if (note.done || !note.date || !note.time) return;

      const noteTimeObj = new Date(`${note.date}T${note.time}`);
      const now = Date.now();

      // حساب وقت التذكير المسبق
      let remindBeforeMs = 0;
      if (reminderUnit === 'minutes') remindBeforeMs = reminderValue * 60 * 1000;
      else if (reminderUnit === 'hours') remindBeforeMs = reminderValue * 60 * 60 * 1000;
      else if (reminderUnit === 'days') remindBeforeMs = reminderValue * 24 * 60 * 60 * 1000;

      const dueTime = noteTimeObj.getTime() - remindBeforeMs;
      const isTimeDue = now >= dueTime && now < (dueTime + 60000);

      // التذكير اليومي
      if (dailyReminder) {
        const currentTime = new Date();
        const noteTargetTime = new Date();
        noteTargetTime.setHours(noteTimeObj.getHours(), noteTimeObj.getMinutes(), 0, 0);

        const dailyDue = currentTime >= noteTargetTime && 
                        currentTime.getTime() < (noteTargetTime.getTime() + 5 * 60000);
        
        if (dailyDue && !note.notifiedToday) {
          new Notification('تذكير صحي هام!', {
            body: `${note.text} - الموعد: ${note.date} الساعة ${note.time}`
          });
        }
      }

      // التذكير حسب الإعدادات
      if (isTimeDue && !note.notifiedToday) {
        new Notification('تذكير صحي هام!', {
          body: `${note.text} - الموعد: ${note.date} الساعة ${note.time}`
        });
      }
    });
  };

  return {
    dailyReminder,
    setDailyReminder,
    reminderValue,
    setReminderValue,
    reminderUnit,
    setReminderUnit,
    notificationStatus,
    requestNotificationPermission
  };
}
