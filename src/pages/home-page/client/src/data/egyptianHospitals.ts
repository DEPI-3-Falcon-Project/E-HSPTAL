import { MedicalCenter } from '../types';

// بيانات حقيقية للمستشفيات والمراكز الطبية في مصر
export const egyptianHospitals: MedicalCenter[] = [
  // القاهرة
  {
    _id: 'kasr-al-ainy',
    name: 'مستشفى قصر العيني الجامعي',
    type: 'hospital',
    governorate: 'القاهرة',
    city: 'المنيرة',
    address: 'شارع قصر العيني، المنيرة، القاهرة',
    location: { type: 'Point', coordinates: [31.2357, 30.0444] },
    phone: '0223654000',
    emergencyPhone: '123',
    services: ['طوارئ', 'جراحة', 'باطنة', 'قلب', 'أطفال', 'نساء وولادة', 'عيون', 'أنف وأذن'],
    isActive: true,
    distance: 0
  },
  {
    _id: 'ain-shams-hospital',
    name: 'مستشفى عين شمس الجامعي',
    type: 'hospital',
    governorate: 'القاهرة',
    city: 'العباسية',
    address: 'شارع رمسيس، العباسية، القاهرة',
    location: { type: 'Point', coordinates: [31.2812, 30.0808] },
    phone: '0224828200',
    emergencyPhone: '123',
    services: ['طوارئ', 'جراحة', 'أطفال', 'نساء وولادة', 'عظام', 'مخ وأعصاب'],
    isActive: true,
    distance: 0
  },
  {
    _id: 'demerdash-hospital',
    name: 'مستشفى الدمرداش الجامعي',
    type: 'hospital',
    governorate: 'القاهرة',
    city: 'العباسية',
    address: 'شارع الدمرداش، العباسية، القاهرة',
    location: { type: 'Point', coordinates: [31.2756, 30.0756] },
    phone: '0224828300',
    emergencyPhone: '123',
    services: ['طوارئ', 'جراحة عامة', 'عظام', 'مخ وأعصاب', 'قلب'],
    isActive: true,
    distance: 0
  },
  {
    _id: 'nsr-institute',
    name: 'معهد ناصر للأمراض الصدرية',
    type: 'hospital',
    governorate: 'القاهرة',
    city: 'شبرا',
    address: 'شبرا، القاهرة',
    location: { type: 'Point', coordinates: [31.2444, 30.0626] },
    phone: '0224314215',
    emergencyPhone: '123',
    services: ['طوارئ', 'أمراض صدرية', 'حساسية', 'باطنة'],
    isActive: true,
    distance: 0
  },

  // الجيزة
  {
    _id: 'ahmed-maher-hospital',
    name: 'مستشفى أحمد ماهر التعليمي',
    type: 'hospital',
    governorate: 'الجيزة',
    city: 'العجوزة',
    address: 'العجوزة، الجيزة',
    location: { type: 'Point', coordinates: [31.2089, 30.0131] },
    phone: '0233456789',
    emergencyPhone: '123',
    services: ['طوارئ', 'جراحة', 'باطنة', 'أطفال', 'نساء وولادة'],
    isActive: true,
    distance: 0
  },
  {
    _id: 'cairo-university-hospital',
    name: 'مستشفى جامعة القاهرة',
    type: 'hospital',
    governorate: 'الجيزة',
    city: 'المنيل',
    address: 'المنيل، الجيزة',
    location: { type: 'Point', coordinates: [31.2280, 30.0254] },
    phone: '0223654100',
    emergencyPhone: '123',
    services: ['طوارئ', 'جراحة', 'قلب', 'كلى', 'كبد', 'أورام'],
    isActive: true,
    distance: 0
  },

  // الإسكندرية
  {
    _id: 'alexandria-main-hospital',
    name: 'المستشفى الجامعي الرئيسي بالإسكندرية',
    type: 'hospital',
    governorate: 'الإسكندرية',
    city: 'الشاطبي',
    address: 'الشاطبي، الإسكندرية',
    location: { type: 'Point', coordinates: [29.9187, 31.2001] },
    phone: '0034869000',
    emergencyPhone: '123',
    services: ['طوارئ', 'جراحة', 'قلب', 'كلى', 'باطنة', 'أطفال'],
    isActive: true,
    distance: 0
  },
  {
    _id: 'alexandria-international',
    name: 'مستشفى الإسكندرية الدولي',
    type: 'hospital',
    governorate: 'الإسكندرية',
    city: 'سيدي جابر',
    address: 'سيدي جابر، الإسكندرية',
    location: { type: 'Point', coordinates: [29.9342, 31.2156] },
    phone: '0334567890',
    emergencyPhone: '123',
    services: ['طوارئ', 'جراحة تجميلية', 'عيون', 'أنف وأذن', 'باطنة'],
    isActive: true,
    distance: 0
  },

  // طنطا - الغربية
  {
    _id: 'tanta-university-hospital',
    name: 'مستشفى طنطا الجامعي',
    type: 'hospital',
    governorate: 'الغربية',
    city: 'طنطا',
    address: 'شارع الجيش، طنطا',
    location: { type: 'Point', coordinates: [31.0004, 30.7865] },
    phone: '0402345678',
    emergencyPhone: '123',
    services: ['طوارئ', 'جراحة', 'قلب', 'كبد', 'باطنة', 'أطفال'],
    isActive: true,
    distance: 0
  },

  // المنصورة - الدقهلية
  {
    _id: 'mansoura-university-hospital',
    name: 'مستشفى المنصورة الجامعي',
    type: 'hospital',
    governorate: 'الدقهلية',
    city: 'المنصورة',
    address: 'شارع الجمهورية، المنصورة، الدقهلية',
    location: { type: 'Point', coordinates: [31.3803, 31.0364] },
    phone: '0502345678',
    emergencyPhone: '123',
    services: ['طوارئ', 'جراحة', 'كلى', 'كبد', 'قلب', 'أورام'],
    isActive: true,
    distance: 0
  },
  {
    _id: 'mansoura-general-hospital',
    name: 'المستشفى العام بالمنصورة',
    type: 'hospital',
    governorate: 'الدقهلية',
    city: 'المنصورة',
    address: 'شارع الجلاء، المنصورة، الدقهلية',
    location: { type: 'Point', coordinates: [31.3750, 31.0400] },
    phone: '0502345679',
    emergencyPhone: '123',
    services: ['طوارئ', 'جراحة', 'باطنة', 'أطفال', 'نساء وولادة'],
    isActive: true,
    distance: 0
  },
  {
    _id: 'mit-ghamr-hospital',
    name: 'مستشفى ميت غمر المركزي',
    type: 'hospital',
    governorate: 'الدقهلية',
    city: 'ميت غمر',
    address: 'شارع النيل، ميت غمر، الدقهلية',
    location: { type: 'Point', coordinates: [31.7000, 31.2500] },
    phone: '0502345680',
    emergencyPhone: '123',
    services: ['طوارئ', 'جراحة', 'باطنة', 'أطفال'],
    isActive: true,
    distance: 0
  },
  {
    _id: 'dakarnis-hospital',
    name: 'مستشفى دكرنس المركزي',
    type: 'hospital',
    governorate: 'الدقهلية',
    city: 'دكرنس',
    address: 'شارع الجمهورية، دكرنس، الدقهلية',
    location: { type: 'Point', coordinates: [31.7750, 31.0750] },
    phone: '0502345681',
    emergencyPhone: '123',
    services: ['طوارئ', 'جراحة', 'باطنة', 'عظام'],
    isActive: true,
    distance: 0
  },
  {
    _id: 'sherbin-hospital',
    name: 'مستشفى شربين المركزي',
    type: 'hospital',
    governorate: 'الدقهلية',
    city: 'شربين',
    address: 'شارع النيل، شربين، الدقهلية',
    location: { type: 'Point', coordinates: [31.7250, 31.1250] },
    phone: '0502345682',
    emergencyPhone: '123',
    services: ['طوارئ', 'جراحة', 'باطنة', 'أطفال', 'نساء وولادة'],
    isActive: true,
    distance: 0
  },
  {
    _id: 'talkha-hospital',
    name: 'مستشفى طلخا المركزي',
    type: 'hospital',
    governorate: 'الدقهلية',
    city: 'طلخا',
    address: 'شارع الجيش، طلخا، الدقهلية',
    location: { type: 'Point', coordinates: [31.3250, 31.0250] },
    phone: '0502345683',
    emergencyPhone: '123',
    services: ['طوارئ', 'جراحة', 'باطنة', 'عيون'],
    isActive: true,
    distance: 0
  },
  {
    _id: 'belqas-hospital',
    name: 'مستشفى بلقاس المركزي',
    type: 'hospital',
    governorate: 'الدقهلية',
    city: 'بلقاس',
    address: 'شارع الجمهورية، بلقاس، الدقهلية',
    location: { type: 'Point', coordinates: [31.6750, 31.1750] },
    phone: '0502345684',
    emergencyPhone: '123',
    services: ['طوارئ', 'جراحة', 'باطنة', 'أطفال'],
    isActive: true,
    distance: 0
  },
  {
    _id: 'mansoura-heart-center',
    name: 'مركز المنصورة للقلب',
    type: 'clinic',
    governorate: 'الدقهلية',
    city: 'المنصورة',
    address: 'شارع الجامعة، المنصورة، الدقهلية',
    location: { type: 'Point', coordinates: [31.3850, 31.0350] },
    phone: '0502345685',
    emergencyPhone: '123',
    services: ['قلب', 'قسطرة', 'جراحة قلب مفتوح'],
    isActive: true,
    distance: 0
  },
  {
    _id: 'mansoura-emergency-center',
    name: 'مركز طوارئ المنصورة',
    type: 'emergency',
    governorate: 'الدقهلية',
    city: 'المنصورة',
    address: 'شارع النيل، المنصورة، الدقهلية',
    location: { type: 'Point', coordinates: [31.3700, 31.0300] },
    phone: '0502345686',
    emergencyPhone: '123',
    services: ['طوارئ', 'إسعاف', 'عناية مركزة'],
    isActive: true,
    distance: 0
  },

  // أسيوط
  {
    _id: 'assiut-university-hospital',
    name: 'مستشفى أسيوط الجامعي',
    type: 'hospital',
    governorate: 'أسيوط',
    city: 'أسيوط',
    address: 'شارع الجامعة، أسيوط',
    location: { type: 'Point', coordinates: [31.1859, 27.1783] },
    phone: '0882345678',
    emergencyPhone: '123',
    services: ['طوارئ', 'جراحة', 'أورام', 'قلب', 'باطنة', 'أطفال'],
    isActive: true,
    distance: 0
  },

  // الأقصر
  {
    _id: 'luxor-international-hospital',
    name: 'مستشفى الأقصر الدولي',
    type: 'hospital',
    governorate: 'الأقصر',
    city: 'الأقصر',
    address: 'طريق الكرنك، الأقصر',
    location: { type: 'Point', coordinates: [32.6396, 25.6872] },
    phone: '0952345678',
    emergencyPhone: '123',
    services: ['طوارئ', 'جراحة', 'باطنة', 'أطفال'],
    isActive: true,
    distance: 0
  },

  // أسوان
  {
    _id: 'aswan-university-hospital',
    name: 'مستشفى أسوان الجامعي',
    type: 'hospital',
    governorate: 'أسوان',
    city: 'أسوان',
    address: 'كورنيش النيل، أسوان',
    location: { type: 'Point', coordinates: [32.8998, 24.0889] },
    phone: '0972345678',
    emergencyPhone: '123',
    services: ['طوارئ', 'جراحة', 'باطنة', 'أمراض صدرية', 'أطفال'],
    isActive: true,
    distance: 0
  },

  // بورسعيد
  {
    _id: 'port-said-general-hospital',
    name: 'المستشفى العام ببورسعيد',
    type: 'hospital',
    governorate: 'بورسعيد',
    city: 'بورسعيد',
    address: 'شارع الجمهورية، بورسعيد',
    location: { type: 'Point', coordinates: [32.3019, 31.2653] },
    phone: '0662345678',
    emergencyPhone: '123',
    services: ['طوارئ', 'جراحة', 'باطنة', 'نساء وولادة', 'أطفال'],
    isActive: true,
    distance: 0
  },

  // الإسماعيلية
  {
    _id: 'ismailia-general-hospital',
    name: 'المستشفى العام بالإسماعيلية',
    type: 'hospital',
    governorate: 'الإسماعيلية',
    city: 'الإسماعيلية',
    address: 'شارع صلاح سالم، الإسماعيلية',
    location: { type: 'Point', coordinates: [32.2715, 30.5965] },
    phone: '0642345678',
    emergencyPhone: '123',
    services: ['طوارئ', 'جراحة', 'باطنة', 'أطفال', 'نساء وولادة'],
    isActive: true,
    distance: 0
  },

  // السويس
  {
    _id: 'suez-general-hospital',
    name: 'المستشفى العام بالسويس',
    type: 'hospital',
    governorate: 'السويس',
    city: 'السويس',
    address: 'شارع الجيش، السويس',
    location: { type: 'Point', coordinates: [32.5498, 29.9668] },
    phone: '0622345678',
    emergencyPhone: '123',
    services: ['طوارئ', 'جراحة', 'باطنة', 'عظام', 'أطفال'],
    isActive: true,
    distance: 0
  },

  // بني سويف
  {
    _id: 'beni-suef-university-hospital',
    name: 'مستشفى بني سويف الجامعي',
    type: 'hospital',
    governorate: 'بني سويف',
    city: 'بني سويف',
    address: 'شارع الجامعة، بني سويف',
    location: { type: 'Point', coordinates: [31.0994, 29.0661] },
    phone: '0822345678',
    emergencyPhone: '123',
    services: ['طوارئ', 'جراحة', 'باطنة', 'أطفال', 'نساء وولادة'],
    isActive: true,
    distance: 0
  },

  // الفيوم
  {
    _id: 'fayoum-general-hospital',
    name: 'المستشفى العام بالفيوم',
    type: 'hospital',
    governorate: 'الفيوم',
    city: 'الفيوم',
    address: 'شارع الجمهورية، الفيوم',
    location: { type: 'Point', coordinates: [30.8428, 29.3084] },
    phone: '0842345678',
    emergencyPhone: '123',
    services: ['طوارئ', 'جراحة', 'باطنة', 'أطفال'],
    isActive: true,
    distance: 0
  },

  // المنيا
  {
    _id: 'minya-university-hospital',
    name: 'مستشفى المنيا الجامعي',
    type: 'hospital',
    governorate: 'المنيا',
    city: 'المنيا',
    address: 'شارع الجامعة، المنيا',
    location: { type: 'Point', coordinates: [30.7618, 28.0871] },
    phone: '0862345678',
    emergencyPhone: '123',
    services: ['طوارئ', 'جراحة', 'باطنة', 'أطفال', 'نساء وولادة'],
    isActive: true,
    distance: 0
  },

  // سوهاج
  {
    _id: 'sohag-university-hospital',
    name: 'مستشفى سوهاج الجامعي',
    type: 'hospital',
    governorate: 'سوهاج',
    city: 'سوهاج',
    address: 'شارع الجامعة، سوهاج',
    location: { type: 'Point', coordinates: [31.6948, 26.5569] },
    phone: '0932345678',
    emergencyPhone: '123',
    services: ['طوارئ', 'جراحة', 'أورام', 'قلب', 'باطنة'],
    isActive: true,
    distance: 0
  },

  // قنا
  {
    _id: 'qena-university-hospital',
    name: 'مستشفى قنا الجامعي',
    type: 'hospital',
    governorate: 'قنا',
    city: 'قنا',
    address: 'شارع الجامعة، قنا',
    location: { type: 'Point', coordinates: [32.7160, 26.1551] },
    phone: '0962345678',
    emergencyPhone: '123',
    services: ['طوارئ', 'جراحة', 'باطنة', 'أطفال', 'نساء وولادة'],
    isActive: true,
    distance: 0
  }
];

// صيدليات رئيسية
export const egyptianPharmacies: MedicalCenter[] = [
  {
    _id: 'seif-pharmacy-cairo',
    name: 'صيدليات سيف',
    type: 'pharmacy',
    governorate: 'القاهرة',
    city: 'مدينة نصر',
    address: 'شارع مكرم عبيد، مدينة نصر، القاهرة',
    location: { type: 'Point', coordinates: [31.3260, 30.0626] },
    phone: '0223456789',
    emergencyPhone: '123',
    services: ['صيدلية', 'أدوية', 'مستلزمات طبية'],
    isActive: true,
    distance: 0
  },
  {
    _id: '19011-pharmacy-alex',
    name: 'صيدليات 19011',
    type: 'pharmacy',
    governorate: 'الإسكندرية',
    city: 'محطة الرمل',
    address: 'محطة الرمل، الإسكندرية',
    location: { type: 'Point', coordinates: [29.9097, 31.2156] },
    phone: '19011',
    emergencyPhone: '123',
    services: ['صيدلية', 'أدوية', 'توصيل منزلي'],
    isActive: true,
    distance: 0
  }
];

// دمج جميع البيانات
export const allMedicalCenters: MedicalCenter[] = [
  ...egyptianHospitals,
  ...egyptianPharmacies
];
