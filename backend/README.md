# E-HSPTL Backend API

نظام الباك اند للموقع الطبي E-HSPTL مبني بـ Node.js و MongoDB

## 🚀 التقنيات المستخدمة

- **Node.js** - بيئة التشغيل
- **Express.js** - إطار العمل
- **MongoDB** - قاعدة البيانات
- **Mongoose** - ODM للتعامل مع MongoDB
- **JWT** - المصادقة والتفويض
- **Bcrypt** - تشفير كلمات المرور

## 📁 هيكل المشروع

```
backend/
├── config/           # إعدادات قاعدة البيانات
├── controllers/      # Controllers منظمة حسب الصفحات
│   ├── home.controller.js
│   ├── report.controller.js
│   ├── note.controller.js
│   ├── firstAid.controller.js
│   ├── contact.controller.js
│   └── auth.controller.js
├── models/          # نماذج البيانات
│   ├── Hospital.model.js
│   ├── Report.model.js
│   ├── Note.model.js
│   ├── FirstAid.model.js
│   ├── Contact.model.js
│   └── User.model.js
├── routes/          # المسارات منظمة حسب الصفحات
│   ├── home.routes.js
│   ├── report.routes.js
│   ├── note.routes.js
│   ├── firstAid.routes.js
│   ├── contact.routes.js
│   └── auth.routes.js
├── middlewares/     # Middlewares
│   ├── auth.js
│   └── errorHandler.js
├── utils/          # Utilities
│   ├── ApiResponse.js
│   ├── ApiError.js
│   └── asyncHandler.js
├── .env.example    # مثال ملف المتغيرات
├── package.json
└── server.js       # نقطة الدخول الرئيسية
```

## 🔧 التثبيت والتشغيل

### 1. تثبيت الحزم
```bash
npm install
```

### 2. إعداد ملف .env
```bash
cp .env.example .env
```

ثم قم بتعديل القيم في ملف `.env`:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ehsptl
JWT_SECRET=your_secret_key_here
NODE_ENV=development
```

### 3. تشغيل قاعدة البيانات MongoDB
تأكد من تشغيل MongoDB على جهازك

### 4. تشغيل السيرفر
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## 📡 API Endpoints

### 🏠 Home (البحث عن المستشفيات)
- `GET /api/home/nearby?latitude=LAT&longitude=LNG&radius=RADIUS` - البحث عن مستشفيات قريبة
- `GET /api/home/search?query=SEARCH&governorate=GOV&type=TYPE` - البحث في المستشفيات

### 📋 Reports (البلاغات)
- `POST /api/reports` - إنشاء بلاغ جديد
- `GET /api/reports` - جلب جميع البلاغات (يتطلب تسجيل دخول)
- `GET /api/reports/nearby?latitude=LAT&longitude=LNG` - البلاغات القريبة
- `GET /api/reports/:id` - جلب بلاغ محدد
- `PATCH /api/reports/:id/status` - تحديث حالة البلاغ
- `DELETE /api/reports/:id` - حذف بلاغ

### 📝 Notes (الملاحظات)
- `POST /api/notes` - إنشاء ملاحظة (يتطلب تسجيل دخول)
- `GET /api/notes` - جلب ملاحظات المستخدم
- `GET /api/notes/:id` - جلب ملاحظة محددة
- `PUT /api/notes/:id` - تحديث ملاحظة
- `DELETE /api/notes/:id` - حذف ملاحظة
- `PATCH /api/notes/:id/archive` - أرشفة ملاحظة

### 🏥 First Aid (الإسعافات الأولية)
- `GET /api/first-aid` - جلب جميع الإسعافات
- `GET /api/first-aid/:id` - جلب إسعاف محدد
- `GET /api/first-aid/category/:category` - جلب إسعافات حسب الفئة
- `POST /api/first-aid` - إنشاء إسعاف (يتطلب تسجيل دخول)
- `PUT /api/first-aid/:id` - تحديث إسعاف
- `DELETE /api/first-aid/:id` - حذف إسعاف

### 📧 Contact (التواصل)
- `POST /api/contact` - إرسال رسالة
- `GET /api/contact` - جلب جميع الرسائل (يتطلب تسجيل دخول)
- `GET /api/contact/:id` - جلب رسالة محددة
- `PATCH /api/contact/:id/status` - تحديث حالة الرسالة
- `DELETE /api/contact/:id` - حذف رسالة

### 🔐 Auth (المصادقة)
- `POST /api/auth/register` - التسجيل
- `POST /api/auth/login` - تسجيل الدخول
- `GET /api/auth/profile` - جلب الملف الشخصي
- `PUT /api/auth/profile` - تحديث الملف الشخصي

### 👨‍⚕️ Doctor Requests (طلبات الأطباء)
- `POST /api/doctor-requests` - إرسال طلب إنشاء حساب طبي
- `GET /api/doctor-requests/my-request` - جلب طلبي
- `GET /api/doctor-requests` - جلب جميع الطلبات (Admin فقط)
- `GET /api/doctor-requests/:id` - جلب طلب محدد
- `POST /api/doctor-requests/:id/approve` - الموافقة على طلب
- `POST /api/doctor-requests/:id/reject` - رفض طلب
- `DELETE /api/doctor-requests/:id` - حذف طلب

### 🔔 Notifications (الإشعارات)
- `GET /api/notifications` - جلب إشعارات المستخدم
- `PATCH /api/notifications/:id/read` - تحديد إشعار كمقروء
- `PATCH /api/notifications/read-all` - تحديد الكل كمقروء
- `DELETE /api/notifications/:id` - حذف إشعار
- `DELETE /api/notifications` - حذف جميع الإشعارات

## 🎯 المميزات

### 1. خوارزميات محسّنة
- **البحث الجغرافي**: استخدام MongoDB Geospatial Queries للبحث السريع عن المستشفيات القريبة
- **Indexing**: فهرسة الحقول المهمة لتسريع عمليات البحث
- **Text Search**: البحث النصي الكامل في المحتوى

### 2. الأمان
- **JWT Authentication**: مصادقة آمنة باستخدام JWT
- **Password Hashing**: تشفير كلمات المرور باستخدام bcrypt
- **Rate Limiting**: حماية من الهجمات والطلبات الكثيرة
- **Helmet**: حماية HTTP headers
- **Input Validation**: التحقق من المدخلات

### 3. الأداء
- **Compression**: ضغط الاستجابات
- **Caching Ready**: جاهز لإضافة Redis للتخزين المؤقت
- **Optimized Queries**: استعلامات محسّنة مع Pagination
- **Connection Pooling**: تجميع الاتصالات لقاعدة البيانات

### 4. تنظيم الكود
- **MVC Pattern**: تطبيق نمط MVC
- **Error Handling**: معالجة أخطاء موحدة
- **Async/Await**: كود نظيف وسهل القراءة
- **Modular Structure**: هيكل معياري قابل للتوسع

## 🔄 Data Structures & Algorithms

### 1. Geospatial Indexing
استخدام 2dsphere index للبحث السريع عن المواقع القريبة:
```javascript
hospitalSchema.index({ location: '2dsphere' });
```

### 2. Text Search Indexing
فهرسة نصية للبحث السريع:
```javascript
hospitalSchema.index({ name: 'text', address: 'text', services: 'text' });
```

### 3. Haversine Formula
حساب المسافة بين نقطتين جغرافيتين:
```javascript
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // نصف قطر الأرض بالكيلومتر
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}
```

### 4. Sorting & Filtering
- **Priority Queue**: ترتيب البلاغات حسب الأولوية والوقت
- **Multi-field Sorting**: ترتيب متعدد المستويات
- **Efficient Filtering**: تصفية فعّالة باستخدام MongoDB aggregation

## 📝 أمثلة الاستخدام

### البحث عن مستشفيات قريبة
```javascript
GET /api/home/nearby?latitude=30.0444&longitude=31.2357&radius=10000&type=hospital
```

### إنشاء بلاغ
```javascript
POST /api/reports
{
  "type": "accident",
  "title": "حادث مروري",
  "description": "حادث على الطريق الدائري",
  "location": {
    "coordinates": [31.2357, 30.0444]
  },
  "address": "الطريق الدائري، القاهرة",
  "reporterName": "أحمد محمد",
  "reporterPhone": "01234567890",
  "urgency": "high"
}
```

## 👨‍💻 المطورون

E-HSPTL Team

## 📄 الترخيص

MIT License

