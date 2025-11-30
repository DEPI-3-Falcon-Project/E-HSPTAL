import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Hospital from '../models/Hospital.model.js';
import FirstAid from '../models/FirstAid.model.js';

dotenv.config();

const hospitals = [
  {
    name: 'مستشفى القصر العيني',
    type: 'hospital',
    governorate: 'القاهرة',
    city: 'المنيل',
    address: 'شارع القصر العيني، المنيل، القاهرة',
    location: {
      type: 'Point',
      coordinates: [31.2286, 30.0254]
    },
    phone: '0223654321',
    emergencyPhone: '123',
    services: ['طوارئ', 'جراحة', 'باطنة', 'أطفال'],
    rating: 4.5,
    isActive: true
  },
  {
    name: 'مستشفى عين شمس التخصصي',
    type: 'hospital',
    governorate: 'القاهرة',
    city: 'عين شمس',
    address: 'العباسية، القاهرة',
    location: {
      type: 'Point',
      coordinates: [31.2854, 30.0730]
    },
    phone: '0224821234',
    emergencyPhone: '123',
    services: ['طوارئ', 'جراحة', 'قلب', 'عظام'],
    rating: 4.3,
    isActive: true
  },
  {
    name: 'صيدلية النهار',
    type: 'pharmacy',
    governorate: 'القاهرة',
    city: 'مدينة نصر',
    address: 'شارع عباس العقاد، مدينة نصر',
    location: {
      type: 'Point',
      coordinates: [31.3398, 30.0626]
    },
    phone: '0222748888',
    services: ['أدوية', 'مستلزمات طبية'],
    rating: 4.0,
    isActive: true
  }
];

const firstAids = [
  {
    title: 'إسعاف الحروق',
    description: 'خطوات التعامل مع الحروق البسيطة والمتوسطة',
    category: 'burn',
    severity: 'moderate',
    steps: [
      {
        stepNumber: 1,
        instruction: 'ابعد المصاب عن مصدر الحرارة فوراً',
        warning: 'لا تلمس الحرق بيديك'
      },
      {
        stepNumber: 2,
        instruction: 'ضع المنطقة المحروقة تحت الماء البارد لمدة 10-15 دقيقة',
        warning: 'لا تستخدم الثلج مباشرة'
      },
      {
        stepNumber: 3,
        instruction: 'غطِّ المنطقة بضمادة نظيفة غير لاصقة',
        warning: 'لا تضع أي كريمات أو معجون أسنان'
      }
    ],
    warnings: ['لا تفتح البثور', 'لا تستخدم القطن مباشرة على الحرق'],
    whenToSeekHelp: ['حروق من الدرجة الثالثة', 'حروق تغطي مساحة كبيرة', 'حروق في الوجه أو اليدين'],
    isActive: true
  },
  {
    title: 'إسعاف الجروح والنزيف',
    description: 'كيفية التعامل مع الجروح البسيطة والنزيف',
    category: 'bleeding',
    severity: 'moderate',
    steps: [
      {
        stepNumber: 1,
        instruction: 'اغسل يديك جيداً قبل لمس الجرح',
        warning: 'استخدم قفازات طبية إن أمكن'
      },
      {
        stepNumber: 2,
        instruction: 'اضغط على الجرح بشاش نظيف لإيقاف النزيف',
        warning: 'لا ترفع الشاش لمدة 5-10 دقائق'
      },
      {
        stepNumber: 3,
        instruction: 'نظف الجرح بماء نظيف',
        warning: 'لا تستخدم الكحول مباشرة على الجرح العميق'
      },
      {
        stepNumber: 4,
        instruction: 'ضع مرهم مضاد حيوي وغطِّ الجرح',
        warning: 'غيّر الضمادة يومياً'
      }
    ],
    warnings: ['راقب علامات العدوى', 'لا تستخدم القطن مباشرة على الجرح'],
    whenToSeekHelp: ['نزيف غزير لا يتوقف', 'جرح عميق', 'جرح من حيوان أو إنسان'],
    isActive: true
  },
  {
    title: 'الإسعافات الأولية للكسور',
    description: 'كيفية التعامل مع الكسور المشتبه بها',
    category: 'fracture',
    severity: 'severe',
    steps: [
      {
        stepNumber: 1,
        instruction: 'لا تحرك المصاب إلا للضرورة القصوى',
        warning: 'تحريك المصاب قد يزيد الإصابة'
      },
      {
        stepNumber: 2,
        instruction: 'ثبّت المنطقة المصابة باستخدام جبيرة مؤقتة',
        warning: 'لا تحاول إعادة العظم لموضعه'
      },
      {
        stepNumber: 3,
        instruction: 'ضع كمادات باردة لتقليل التورم',
        warning: 'لا تضع الثلج مباشرة على الجلد'
      },
      {
        stepNumber: 4,
        instruction: 'اطلب المساعدة الطبية فوراً',
        warning: 'الكسور تحتاج عناية طبية فورية'
      }
    ],
    warnings: ['لا تعطي المصاب أي طعام أو شراب', 'راقب علامات الصدمة'],
    whenToSeekHelp: ['كسر مفتوح', 'ألم شديد', 'تورم أو تشوه واضح'],
    isActive: true
  }
];

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    await connectDB();

    await Hospital.deleteMany();
    console.log('🗑️  Cleared hospitals collection');

    await FirstAid.deleteMany();
    console.log('🗑️  Cleared firstAid collection');

    await Hospital.insertMany(hospitals);
    console.log('✅ Hospitals seeded successfully');

    await FirstAid.insertMany(firstAids);
    console.log('✅ First Aid seeded successfully');

    console.log('🎉 Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedData();



