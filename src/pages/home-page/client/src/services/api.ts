import axios from 'axios';
import { MedicalCenter, FirstAid, AuthResponse, LocationData } from '../types';
import { allMedicalCenters } from '../data/egyptianHospitals';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// بيانات وهمية للمستشفيات المصرية
const mockHospitals: MedicalCenter[] = [
  // القاهرة
  {
    _id: '1',
    name: 'مستشفى القصر العيني',
    type: 'hospital',
    governorate: 'القاهرة',
    city: 'المنيرة',
    address: 'شارع القصر العيني، المنيرة، القاهرة',
    location: { type: 'Point', coordinates: [31.2357, 30.0444] },
    phone: '0223654000',
    emergencyPhone: '123',
    services: ['طوارئ', 'جراحة', 'باطنة', 'قلب'],
    isActive: true,
    distance: 0
  },
  {
    _id: '2',
    name: 'مستشفى عين شمس الجامعي',
    type: 'hospital',
    governorate: 'القاهرة',
    city: 'العباسية',
    address: 'العباسية، القاهرة',
    location: { type: 'Point', coordinates: [31.2812, 30.0808] },
    phone: '0224828200',
    emergencyPhone: '123',
    services: ['طوارئ', 'جراحة', 'أطفال', 'نساء وولادة'],
    isActive: true,
    distance: 0
  },
  {
    _id: '3',
    name: 'مستشفى الدمرداش',
    type: 'hospital',
    governorate: 'القاهرة',
    city: 'العباسية',
    address: 'شارع الدمرداش، العباسية، القاهرة',
    location: { type: 'Point', coordinates: [31.2756, 30.0756] },
    phone: '0224828300',
    emergencyPhone: '123',
    services: ['طوارئ', 'جراحة عامة', 'عظام', 'مخ وأعصاب'],
    isActive: true,
    distance: 0
  },
  // الإسكندرية
  {
    _id: '4',
    name: 'المستشفى الجامعي الرئيسي بالإسكندرية',
    type: 'hospital',
    governorate: 'الإسكندرية',
    city: 'الشاطبي',
    address: 'الشاطبي، الإسكندرية',
    location: { type: 'Point', coordinates: [29.9187, 31.2001] },
    phone: '0034869000',
    emergencyPhone: '123',
    services: ['طوارئ', 'جراحة', 'قلب', 'كلى'],
    isActive: true,
    distance: 0
  },
  {
    _id: '5',
    name: 'مستشفى الإسكندرية الدولي',
    type: 'hospital',
    governorate: 'الإسكندرية',
    city: 'سيدي جابر',
    address: 'سيدي جابر، الإسكندرية',
    location: { type: 'Point', coordinates: [29.9342, 31.2156] },
    phone: '0034567890',
    emergencyPhone: '123',
    services: ['طوارئ', 'جراحة تجميلية', 'عيون', 'أنف وأذن'],
    isActive: true,
    distance: 0
  },
  // الجيزة
  {
    _id: '6',
    name: 'مستشفى أحمد ماهر التعليمي',
    type: 'hospital',
    governorate: 'الجيزة',
    city: 'العجوزة',
    address: 'العجوزة، الجيزة',
    location: { type: 'Point', coordinates: [31.2089, 30.0131] },
    phone: '0233456789',
    emergencyPhone: '123',
    services: ['طوارئ', 'جراحة', 'باطنة', 'أطفال'],
    isActive: true,
    distance: 0
  },
  // الأقصر
  {
    _id: '7',
    name: 'مستشفى الأقصر الدولي',
    type: 'hospital',
    governorate: 'الأقصر',
    city: 'الأقصر',
    address: 'طريق الكرنك، الأقصر',
    location: { type: 'Point', coordinates: [32.6396, 25.6872] },
    phone: '0952345678',
    emergencyPhone: '123',
    services: ['طوارئ', 'جراحة', 'باطنة'],
    isActive: true,
    distance: 0
  },
  // أسوان
  {
    _id: '8',
    name: 'مستشفى أسوان الجامعي',
    type: 'hospital',
    governorate: 'أسوان',
    city: 'أسوان',
    address: 'كورنيش النيل، أسوان',
    location: { type: 'Point', coordinates: [32.8998, 24.0889] },
    phone: '0972345678',
    emergencyPhone: '123',
    services: ['طوارئ', 'جراحة', 'باطنة', 'أمراض صدرية'],
    isActive: true,
    distance: 0
  },
  // بورسعيد
  {
    _id: '9',
    name: 'المستشفى العام ببورسعيد',
    type: 'hospital',
    governorate: 'بورسعيد',
    city: 'بورسعيد',
    address: 'شارع الجمهورية، بورسعيد',
    location: { type: 'Point', coordinates: [32.3019, 31.2653] },
    phone: '0662345678',
    emergencyPhone: '123',
    services: ['طوارئ', 'جراحة', 'باطنة', 'نساء وولادة'],
    isActive: true,
    distance: 0
  },
  // طنطا
  {
    _id: '10',
    name: 'مستشفى طنطا الجامعي',
    type: 'hospital',
    governorate: 'الغربية',
    city: 'طنطا',
    address: 'شارع الجيش، طنطا',
    location: { type: 'Point', coordinates: [31.0004, 30.7865] },
    phone: '0402345678',
    emergencyPhone: '123',
    services: ['طوارئ', 'جراحة', 'قلب', 'كبد'],
    isActive: true,
    distance: 0
  }
];

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // نصف قطر الأرض بالكيلومتر
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

export const locationAPI = {
  getNearestCenters: async (location: LocationData, type?: string, userGovernorate?: string, userCity?: string): Promise<MedicalCenter[]> => {
    // محاكاة تأخير الشبكة قصير
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // استخدام البيانات الحقيقية للمستشفيات المصرية
    let centers = [...allMedicalCenters];
    
    // فلترة حسب النوع إذا تم تحديده
    if (type) {
      if (type === 'pharmacies') {
        // إضافة صيدليات وهمية واقعية
        const pharmacies: MedicalCenter[] = [
          {
            _id: 'ph1',
            name: 'صيدلية النهضة',
            type: 'pharmacy',
            governorate: userGovernorate || 'القاهرة',
            city: userCity || 'القاهرة',
            address: 'شارع التحرير، وسط البلد',
            location: { 
              type: 'Point', 
              coordinates: [
                location.longitude + (Math.random() - 0.5) * 0.01, 
                location.latitude + (Math.random() - 0.5) * 0.01
              ] 
            },
            phone: '02' + Math.floor(Math.random() * 90000000 + 10000000),
            emergencyPhone: undefined,
            services: ['أدوية عامة', 'مستلزمات طبية', 'تحاليل سريعة'],
            isActive: true,
            distance: 0
          },
          {
            _id: 'ph2',
            name: 'صيدلية الشفاء',
            type: 'pharmacy',
            governorate: userGovernorate || 'القاهرة',
            city: userCity || 'القاهرة',
            address: 'شارع الهرم، الجيزة',
            location: { 
              type: 'Point', 
              coordinates: [
                location.longitude + (Math.random() - 0.5) * 0.015, 
                location.latitude + (Math.random() - 0.5) * 0.015
              ] 
            },
            phone: '02' + Math.floor(Math.random() * 90000000 + 10000000),
            emergencyPhone: undefined,
            services: ['أدوية عامة', 'مستلزمات طبية', 'خدمة 24 ساعة'],
            isActive: true,
            distance: 0
          },
          {
            _id: 'ph3',
            name: 'صيدلية الحياة',
            type: 'pharmacy',
            governorate: userGovernorate || 'القاهرة',
            city: userCity || 'القاهرة',
            address: 'شارع النيل، المعادي',
            location: { 
              type: 'Point', 
              coordinates: [
                location.longitude + (Math.random() - 0.5) * 0.02, 
                location.latitude + (Math.random() - 0.5) * 0.02
              ] 
            },
            phone: '02' + Math.floor(Math.random() * 90000000 + 10000000),
            emergencyPhone: undefined,
            services: ['أدوية عامة', 'مستلزمات طبية', 'استشارة صيدلانية'],
            isActive: true,
            distance: 0
          }
        ];
        centers = [...centers, ...pharmacies];
      } else if (type === 'clinics') {
        // إضافة مراكز طبية وهمية واقعية
        const clinics: MedicalCenter[] = [
          {
            _id: 'cl1',
            name: 'مركز النور الطبي',
            type: 'clinic',
            governorate: userGovernorate || 'القاهرة',
            city: userCity || 'القاهرة',
            address: 'شارع الهرم، الجيزة',
            location: { 
              type: 'Point', 
              coordinates: [
                location.longitude + (Math.random() - 0.5) * 0.012, 
                location.latitude + (Math.random() - 0.5) * 0.012
              ] 
            },
            phone: '02' + Math.floor(Math.random() * 90000000 + 10000000),
            emergencyPhone: '123',
            services: ['باطنة', 'أطفال', 'نساء وولادة', 'أشعة'],
            isActive: true,
            distance: 0
          },
          {
            _id: 'cl2',
            name: 'عيادة الأمل',
            type: 'clinic',
            governorate: userGovernorate || 'القاهرة',
            city: userCity || 'القاهرة',
            address: 'شارع التحرير، وسط البلد',
            location: { 
              type: 'Point', 
              coordinates: [
                location.longitude + (Math.random() - 0.5) * 0.018, 
                location.latitude + (Math.random() - 0.5) * 0.018
              ] 
            },
            phone: '02' + Math.floor(Math.random() * 90000000 + 10000000),
            emergencyPhone: '123',
            services: ['باطنة', 'عظام', 'جلدية', 'أنف وأذن'],
            isActive: true,
            distance: 0
          },
          {
            _id: 'cl3',
            name: 'مركز الشفاء الطبي',
            type: 'clinic',
            governorate: userGovernorate || 'القاهرة',
            city: userCity || 'القاهرة',
            address: 'شارع النيل، المعادي',
            location: { 
              type: 'Point', 
              coordinates: [
                location.longitude + (Math.random() - 0.5) * 0.025, 
                location.latitude + (Math.random() - 0.5) * 0.025
              ] 
            },
            phone: '02' + Math.floor(Math.random() * 90000000 + 10000000),
            emergencyPhone: '123',
            services: ['باطنة', 'قلب', 'عيون', 'أسنان'],
            isActive: true,
            distance: 0
          }
        ];
        centers = [...centers, ...clinics];
      } else {
        centers = centers.filter(center => center.type === type);
      }
    }
    
    // حساب المسافة لكل مركز طبي
    const centersWithDistance = centers.map(center => ({
      ...center,
      distance: calculateDistance(
        location.latitude,
        location.longitude,
        center.location.coordinates[1],
        center.location.coordinates[0]
      )
    })) as MedicalCenter[];
    
    // ترتيب ذكي: أولوية للمراكز في نفس المحافظة والمدينة
    return centersWithDistance.sort((a, b) => {
      // إذا كان لدينا معلومات عن محافظة المستخدم
      if (userGovernorate && userGovernorate !== 'غير محدد') {
        const aInSameGovernorate = a.governorate === userGovernorate;
        const bInSameGovernorate = b.governorate === userGovernorate;
        
        // إذا كان لدينا معلومات عن مدينة المستخدم
        if (userCity && userCity !== 'غير محدد') {
          const aInSameCity = a.city === userCity;
          const bInSameCity = b.city === userCity;
          
          // أولوية: نفس المدينة > نفس المحافظة > المسافة
          if (aInSameCity && !bInSameCity) return -1;
          if (!aInSameCity && bInSameCity) return 1;
          if (aInSameGovernorate && !bInSameGovernorate) return -1;
          if (!aInSameGovernorate && bInSameGovernorate) return 1;
        } else {
          // أولوية: نفس المحافظة > المسافة
          if (aInSameGovernorate && !bInSameGovernorate) return -1;
          if (!aInSameGovernorate && bInSameGovernorate) return 1;
        }
      }
      
      // في النهاية، ترتيب حسب المسافة
      const aDistance = a.distance || 0;
      const bDistance = b.distance || 0;
      return aDistance - bDistance;
    });
  },

  getGovernorates: async (): Promise<string[]> => {
    // محاكاة تأخير الشبكة
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // استخراج المحافظات من البيانات الحقيقية
    const governorateSet = new Set(allMedicalCenters.map(center => center.governorate));
    const governorates = Array.from(governorateSet);
    return governorates.sort();
  },

  getCentersByGovernorate: async (governorate: string, type?: string): Promise<MedicalCenter[]> => {
    // محاكاة تأخير الشبكة
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let filteredCenters = allMedicalCenters.filter(center => 
      center.governorate.toLowerCase().includes(governorate.toLowerCase())
    );
    
    if (type) {
      filteredCenters = filteredCenters.filter(center => center.type === type);
    }
    
    return filteredCenters;
  },
};

export const firstAidAPI = {
  getInstructions: async (category?: string, severity?: string): Promise<FirstAid[]> => {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (severity) params.append('severity', severity);
    
    const response = await api.get(`/firstaid?${params}`);
    return response.data.data;
  },

  getCategories: async (): Promise<string[]> => {
    const response = await api.get('/firstaid/categories');
    return response.data.data;
  },

  getInstructionById: async (id: string): Promise<FirstAid> => {
    const response = await api.get(`/firstaid/${id}`);
    return response.data.data;
  },
};

export const authAPI = {
  register: async (userData: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    governorate?: string;
  }): Promise<AuthResponse> => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  login: async (credentials: { email: string; password: string }): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get('/auth/me');
    return response.data.user;
  },
};

export default api;



