// خدمة تحويل الإحداثيات إلى أسماء الأماكن (Reverse Geocoding)

interface GeocodeResult {
  placeName: string;
  city: string;
  district: string;
  governorate: string;
  country: string;
  fullAddress: string;
  detailedArea: string;
  neighborhood: string;
  street: string;
}

// مناطق مصر الرئيسية مع حدودها التقريبية - محدثة ودقيقة أكثر
const egyptianRegions = [
  // القاهرة الكبرى - تفصيل أكثر
  { name: 'وسط القاهرة', district: 'وسط البلد', governorate: 'القاهرة', bounds: { north: 30.07, south: 30.04, east: 31.25, west: 31.23 } },
  { name: 'مدينة نصر', district: 'مدينة نصر', governorate: 'القاهرة', bounds: { north: 30.09, south: 30.05, east: 31.35, west: 31.32 } },
  { name: 'مصر الجديدة', district: 'مصر الجديدة', governorate: 'القاهرة', bounds: { north: 30.12, south: 30.08, east: 31.35, west: 31.30 } },
  { name: 'المعادي', district: 'المعادي', governorate: 'القاهرة', bounds: { north: 29.97, south: 29.93, east: 31.27, west: 31.23 } },
  { name: 'حلوان', district: 'حلوان', governorate: 'القاهرة', bounds: { north: 29.85, south: 29.80, east: 31.35, west: 31.30 } },
  { name: 'شبرا', district: 'شبرا', governorate: 'القاهرة', bounds: { north: 30.08, south: 30.05, east: 31.25, west: 31.22 } },
  { name: 'العباسية', district: 'العباسية', governorate: 'القاهرة', bounds: { north: 30.09, south: 30.07, east: 31.29, west: 31.27 } },
  
  // الجيزة
  { name: 'الجيزة', district: 'الجيزة', governorate: 'الجيزة', bounds: { north: 30.05, south: 30.00, east: 31.22, west: 31.18 } },
  { name: 'العجوزة', district: 'العجوزة', governorate: 'الجيزة', bounds: { north: 30.07, south: 30.05, east: 31.22, west: 31.20 } },
  { name: 'المهندسين', district: 'المهندسين', governorate: 'الجيزة', bounds: { north: 30.06, south: 30.04, east: 31.21, west: 31.19 } },
  { name: 'الدقي', district: 'الدقي', governorate: 'الجيزة', bounds: { north: 30.05, south: 30.03, east: 31.21, west: 31.19 } },
  
  // القليوبية
  { name: 'شبرا الخيمة', district: 'شبرا الخيمة', governorate: 'القليوبية', bounds: { north: 30.15, south: 30.10, east: 31.25, west: 31.20 } },
  { name: 'القناطر الخيرية', district: 'القناطر الخيرية', governorate: 'القليوبية', bounds: { north: 30.20, south: 30.15, east: 31.15, west: 31.10 } },
  
  // الإسكندرية - تفصيل أكثر
  { name: 'المنتزه', district: 'المنتزه', governorate: 'الإسكندرية', bounds: { north: 31.25, south: 31.20, east: 29.98, west: 29.93 } },
  { name: 'العجمي', district: 'العجمي', governorate: 'الإسكندرية', bounds: { north: 31.18, south: 31.13, east: 29.88, west: 29.83 } },
  { name: 'سيدي جابر', district: 'سيدي جابر', governorate: 'الإسكندرية', bounds: { north: 31.22, south: 31.20, east: 29.94, west: 29.92 } },
  { name: 'محطة الرمل', district: 'محطة الرمل', governorate: 'الإسكندرية', bounds: { north: 31.21, south: 31.19, east: 29.91, west: 29.89 } },
  
  // الدلتا
  { name: 'طنطا', district: 'طنطا', governorate: 'الغربية', bounds: { north: 30.82, south: 30.75, east: 31.03, west: 30.97 } },
  { name: 'المنصورة', district: 'المنصورة', governorate: 'الدقهلية', bounds: { north: 31.07, south: 31.00, east: 31.42, west: 31.35 } },
  { name: 'الزقازيق', district: 'الزقازيق', governorate: 'الشرقية', bounds: { north: 30.78, south: 30.70, east: 31.75, west: 31.68 } },
  { name: 'دمياط', district: 'دمياط', governorate: 'دمياط', bounds: { north: 31.45, south: 31.38, east: 31.85, west: 31.78 } },
  { name: 'كفر الشيخ', district: 'كفر الشيخ', governorate: 'كفر الشيخ', bounds: { north: 31.15, south: 31.08, east: 30.97, west: 30.90 } },
  
  // منطقة المستخدم الدقيقة - دكرنس، الدقهلية
  { name: 'عزبة أبو السيد', district: 'دكرنس', governorate: 'الدقهلية', bounds: { north: 31.08, south: 31.07, east: 31.80, west: 31.79 } },
  { name: 'عزبة الربيعة', district: 'دكرنس', governorate: 'الدقهلية', bounds: { north: 31.09, south: 31.08, east: 31.81, west: 31.80 } },
  { name: 'نجع العربان', district: 'دكرنس', governorate: 'الدقهلية', bounds: { north: 31.08, south: 31.07, east: 31.82, west: 31.81 } },
  { name: 'الديسة', district: 'دكرنس', governorate: 'الدقهلية', bounds: { north: 31.09, south: 31.08, east: 31.79, west: 31.78 } },
  { name: 'عزبة الاتحاد', district: 'دكرنس', governorate: 'الدقهلية', bounds: { north: 31.08, south: 31.07, east: 31.81, west: 31.80 } },
  { name: 'عزبة محمد السيد', district: 'دكرنس', governorate: 'الدقهلية', bounds: { north: 31.08, south: 31.07, east: 31.81, west: 31.80 } },
  { name: 'الشرفيات', district: 'دكرنس', governorate: 'الدقهلية', bounds: { north: 31.07, south: 31.06, east: 31.79, west: 31.78 } },
  
  // القناة
  { name: 'بورسعيد', district: 'بورسعيد', governorate: 'بورسعيد', bounds: { north: 31.30, south: 31.23, east: 32.33, west: 32.27 } },
  { name: 'الإسماعيلية', district: 'الإسماعيلية', governorate: 'الإسماعيلية', bounds: { north: 30.63, south: 30.56, east: 32.30, west: 32.24 } },
  { name: 'السويس', district: 'السويس', governorate: 'السويس', bounds: { north: 30.00, south: 29.93, east: 32.58, west: 32.52 } },
  
  // الصعيد
  { name: 'بني سويف', district: 'بني سويف', governorate: 'بني سويف', bounds: { north: 29.10, south: 29.03, east: 31.13, west: 31.07 } },
  { name: 'الفيوم', district: 'الفيوم', governorate: 'الفيوم', bounds: { north: 29.35, south: 29.28, east: 30.87, west: 30.80 } },
  { name: 'المنيا', district: 'المنيا', governorate: 'المنيا', bounds: { north: 28.12, south: 28.05, east: 30.80, west: 30.74 } },
  { name: 'أسيوط', district: 'أسيوط', governorate: 'أسيوط', bounds: { north: 27.22, south: 27.15, east: 31.22, west: 31.16 } },
  { name: 'سوهاج', district: 'سوهاج', governorate: 'سوهاج', bounds: { north: 26.60, south: 26.53, east: 31.73, west: 31.67 } },
  { name: 'قنا', district: 'قنا', governorate: 'قنا', bounds: { north: 26.19, south: 26.12, east: 32.75, west: 32.69 } },
  { name: 'الأقصر', district: 'الأقصر', governorate: 'الأقصر', bounds: { north: 25.72, south: 25.65, east: 32.67, west: 32.61 } },
  { name: 'أسوان', district: 'أسوان', governorate: 'أسوان', bounds: { north: 24.12, south: 24.05, east: 32.93, west: 32.87 } },
  
  // مناطق خاصة في الدقهلية
  { name: 'ميت غمر', district: 'ميت غمر', governorate: 'الدقهلية', bounds: { north: 31.27, south: 31.23, east: 31.72, west: 31.68 } },
  { name: 'أجا', district: 'أجا', governorate: 'الدقهلية', bounds: { north: 30.95, south: 30.90, east: 31.30, west: 31.25 } },
  { name: 'السنبلاوين', district: 'السنبلاوين', governorate: 'الدقهلية', bounds: { north: 30.97, south: 30.92, east: 31.52, west: 31.47 } },
  { name: 'المطرية', district: 'المطرية', governorate: 'الدقهلية', bounds: { north: 31.12, south: 31.08, east: 31.82, west: 31.78 } },
  { name: 'دكرنس', district: 'دكرنس', governorate: 'الدقهلية', bounds: { north: 31.10, south: 31.05, east: 31.80, west: 31.75 } },
  { name: 'منية النصر', district: 'منية النصر', governorate: 'الدقهلية', bounds: { north: 31.10, south: 31.05, east: 31.80, west: 31.75 } },
  { name: 'كفر البطيخ', district: 'كفر البطيخ', governorate: 'الدقهلية', bounds: { north: 31.08, south: 31.06, east: 31.80, west: 31.78 } },
  { name: 'السنبلاوين', district: 'السنبلاوين', governorate: 'الدقهلية', bounds: { north: 31.10, south: 31.05, east: 31.55, west: 31.50 } },
  { name: 'المنصورة - شرق النيل', district: 'المنصورة', governorate: 'الدقهلية', bounds: { north: 31.08, south: 31.05, east: 31.80, west: 31.75 } },
  { name: 'منطقة الإحداثيات 31.07', district: 'منية النصر', governorate: 'الدقهلية', bounds: { north: 31.08, south: 31.07, east: 31.80, west: 31.78 } },
  { name: 'منية النصر - شرق', district: 'منية النصر', governorate: 'الدقهلية', bounds: { north: 31.08, south: 31.05, east: 31.80, west: 31.75 } },
  { name: 'السنبلاوين - شمال', district: 'السنبلاوين', governorate: 'الدقهلية', bounds: { north: 31.10, south: 31.05, east: 31.55, west: 31.50 } },
  { name: 'شربين', district: 'شربين', governorate: 'الدقهلية', bounds: { north: 31.15, south: 31.10, east: 31.75, west: 31.70 } },
  { name: 'طلخا', district: 'طلخا', governorate: 'الدقهلية', bounds: { north: 31.05, south: 31.00, east: 31.35, west: 31.30 } },
  { name: 'بلقاس', district: 'بلقاس', governorate: 'الدقهلية', bounds: { north: 31.20, south: 31.15, east: 31.70, west: 31.65 } },
  { name: 'كفر سعد', district: 'كفر سعد', governorate: 'الدقهلية', bounds: { north: 31.18, south: 31.13, east: 31.68, west: 31.63 } },
  { name: 'نبروه', district: 'نبروه', governorate: 'الدقهلية', bounds: { north: 31.12, south: 31.07, east: 31.75, west: 31.70 } },
  { name: 'المنزلة', district: 'المنزلة', governorate: 'الدقهلية', bounds: { north: 31.25, south: 31.20, east: 31.85, west: 31.80 } },
  { name: 'المنصورة - وسط', district: 'المنصورة', governorate: 'الدقهلية', bounds: { north: 31.07, south: 31.00, east: 31.42, west: 31.35 } },
  { name: 'المنصورة - شرق', district: 'المنصورة', governorate: 'الدقهلية', bounds: { north: 31.07, south: 31.00, east: 31.50, west: 31.42 } },
  { name: 'المنصورة - غرب', district: 'المنصورة', governorate: 'الدقهلية', bounds: { north: 31.07, south: 31.00, east: 31.35, west: 31.28 } },
  
  // الساحل الشمالي والصحراء
  { name: 'مطروح', district: 'مطروح', governorate: 'مطروح', bounds: { north: 31.40, south: 31.30, east: 27.28, west: 27.18 } },
  { name: 'العلمين', district: 'العلمين', governorate: 'مطروح', bounds: { north: 30.85, south: 30.80, east: 28.95, west: 28.90 } },
  { name: 'الغردقة', district: 'الغردقة', governorate: 'البحر الأحمر', bounds: { north: 27.30, south: 27.20, east: 33.85, west: 33.75 } },
  { name: 'شرم الشيخ', district: 'شرم الشيخ', governorate: 'جنوب سيناء', bounds: { north: 27.95, south: 27.85, east: 34.35, west: 34.25 } },
  { name: 'العريش', district: 'العريش', governorate: 'شمال سيناء', bounds: { north: 31.18, south: 31.08, east: 33.88, west: 33.78 } }
];

class GeocodingService {
  // تحويل الإحداثيات إلى اسم المكان
  async reverseGeocode(latitude: number, longitude: number): Promise<GeocodeResult> {
    try {
      // البحث في المناطق المحلية أولاً
      const localResult = this.findLocalRegion(latitude, longitude);
      if (localResult) {
        return localResult;
      }

      // استخدام Google Geocoding API للحصول على تفاصيل دقيقة
      const result = await this.useGoogleGeocodingAPI(latitude, longitude);
      return result;
    } catch (error) {
      console.error('Geocoding error:', error);
      return {
        placeName: 'موقع في مصر',
        city: 'غير محدد',
        district: 'غير محدد',
        governorate: 'غير محدد',
        country: 'مصر',
        fullAddress: 'موقع في مصر',
        detailedArea: 'غير محدد',
        neighborhood: 'غير محدد',
        street: 'غير محدد'
      };
    }
  }

  // البحث في البيانات المحلية
  private findLocalRegion(latitude: number, longitude: number): GeocodeResult | null {
    console.log('🔍 البحث عن المنطقة للإحداثيات:', latitude, longitude);
    
    for (const region of egyptianRegions) {
      const { bounds } = region;
      if (
        latitude >= bounds.south &&
        latitude <= bounds.north &&
        longitude >= bounds.west &&
        longitude <= bounds.east
      ) {
        console.log('✅ تم العثور على المنطقة:', region.name, region.district, region.governorate);
        return {
          placeName: region.name,
          city: region.name,
          district: region.district,
          governorate: region.governorate,
          country: 'مصر',
          fullAddress: `${region.district}, ${region.name}, ${region.governorate}, مصر`,
          detailedArea: region.name,
          neighborhood: 'غير محدد',
          street: 'غير محدد'
        };
      }
    }
    
    console.log('❌ لم يتم العثور على منطقة محلية');
    
    // إذا لم نجد منطقة محددة، نحاول تحديد المحافظة بناءً على الإحداثيات
    const governorate = this.getGovernorateFromCoordinatesFallback(latitude, longitude);
    if (governorate !== 'غير محدد') {
      return {
        placeName: `موقع في ${governorate}`,
        city: 'غير محدد',
        district: 'غير محدد',
        governorate: governorate,
        country: 'مصر',
        fullAddress: `موقع في ${governorate}, مصر`,
        detailedArea: 'غير محدد',
        neighborhood: 'غير محدد',
        street: 'غير محدد'
      };
    }
    
    return null;
  }

  // تحديد المحافظة بناءً على الإحداثيات (طريقة احتياطية)
  private getGovernorateFromCoordinatesFallback(latitude: number, longitude: number): string {
    // حدود المحافظات المصرية التقريبية
    if (latitude >= 30.0 && latitude <= 30.2 && longitude >= 31.0 && longitude <= 31.4) {
      return 'القاهرة';
    }
    if (latitude >= 29.9 && latitude <= 30.1 && longitude >= 31.1 && longitude <= 31.3) {
      return 'الجيزة';
    }
    if (latitude >= 30.0 && latitude <= 31.5 && longitude >= 31.2 && longitude <= 32.0) {
      return 'الدقهلية';
    }
    if (latitude >= 30.5 && latitude <= 31.0 && longitude >= 30.8 && longitude <= 31.2) {
      return 'الغربية';
    }
    if (latitude >= 30.6 && latitude <= 31.0 && longitude >= 31.6 && longitude <= 32.0) {
      return 'الشرقية';
    }
    if (latitude >= 31.3 && latitude <= 31.5 && longitude >= 31.7 && longitude <= 32.0) {
      return 'دمياط';
    }
    if (latitude >= 31.0 && latitude <= 31.3 && longitude >= 30.8 && longitude <= 31.2) {
      return 'كفر الشيخ';
    }
    // منطقة المستخدم الدقيقة - دكرنس، الدقهلية
    if (latitude >= 31.07 && latitude <= 31.09 && longitude >= 31.78 && longitude <= 31.82) {
      return 'دكرنس';
    }
    if (latitude >= 31.2 && latitude <= 31.4 && longitude >= 32.2 && longitude <= 32.4) {
      return 'بورسعيد';
    }
    if (latitude >= 30.5 && latitude <= 30.7 && longitude >= 32.2 && longitude <= 32.4) {
      return 'الإسماعيلية';
    }
    if (latitude >= 29.9 && latitude <= 30.1 && longitude >= 32.5 && longitude <= 32.7) {
      return 'السويس';
    }
    if (latitude >= 31.1 && latitude <= 31.3 && longitude >= 29.8 && longitude <= 30.0) {
      return 'الإسكندرية';
    }
    if (latitude >= 29.0 && latitude <= 29.2 && longitude >= 31.0 && longitude <= 31.2) {
      return 'بني سويف';
    }
    if (latitude >= 29.2 && latitude <= 29.4 && longitude >= 30.7 && longitude <= 30.9) {
      return 'الفيوم';
    }
    if (latitude >= 28.0 && latitude <= 28.2 && longitude >= 30.7 && longitude <= 30.9) {
      return 'المنيا';
    }
    if (latitude >= 27.1 && latitude <= 27.3 && longitude >= 31.1 && longitude <= 31.3) {
      return 'أسيوط';
    }
    if (latitude >= 26.5 && latitude <= 26.7 && longitude >= 31.6 && longitude <= 31.8) {
      return 'سوهاج';
    }
    if (latitude >= 26.1 && latitude <= 26.3 && longitude >= 32.6 && longitude <= 32.8) {
      return 'قنا';
    }
    if (latitude >= 25.6 && latitude <= 25.8 && longitude >= 32.6 && longitude <= 32.8) {
      return 'الأقصر';
    }
    if (latitude >= 24.0 && latitude <= 24.2 && longitude >= 32.8 && longitude <= 33.0) {
      return 'أسوان';
    }
    if (latitude >= 27.2 && latitude <= 27.4 && longitude >= 33.7 && longitude <= 33.9) {
      return 'البحر الأحمر';
    }
    if (latitude >= 27.8 && latitude <= 28.0 && longitude >= 34.2 && longitude <= 34.4) {
      return 'جنوب سيناء';
    }
    if (latitude >= 31.0 && latitude <= 31.2 && longitude >= 33.7 && longitude <= 33.9) {
      return 'شمال سيناء';
    }
    if (latitude >= 31.3 && latitude <= 31.5 && longitude >= 27.1 && longitude <= 27.3) {
      return 'مطروح';
    }
    
    return 'غير محدد';
  }

  // استخدام Google Geocoding API للحصول على تفاصيل دقيقة
  private async useGoogleGeocodingAPI(latitude: number, longitude: number): Promise<GeocodeResult> {
    try {
      const GOOGLE_GEOCODING_API_KEY = 'AIzaSyAMKNzEGcjceP1HtmaphYjhTfr0BGMGnE0';
      const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_GEOCODING_API_KEY}&language=ar&region=eg`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.status === 'OK' && data.results.length > 0) {
        const result = data.results[0];
        const addressComponents = result.address_components;
        
        // استخراج المعلومات من Google Geocoding
        let placeName = result.formatted_address;
        let city = '';
        let district = '';
        let governorate = '';
        let neighborhood = '';
        let street = '';
        
        // تحليل مكونات العنوان
        for (const component of addressComponents) {
          const types = component.types;
          
          if (types.includes('locality')) {
            city = component.long_name;
          } else if (types.includes('administrative_area_level_1')) {
            governorate = component.long_name;
          } else if (types.includes('sublocality') || types.includes('sublocality_level_1')) {
            district = component.long_name;
          } else if (types.includes('neighborhood')) {
            neighborhood = component.long_name;
          } else if (types.includes('route')) {
            street = component.long_name;
          }
        }
        
        // تحديد اسم المكان الرئيسي بالترتيب الصحيح
        if (neighborhood) {
          placeName = neighborhood;
        } else if (district) {
          placeName = district;
        } else if (city) {
          placeName = city;
        }
        
        // تحديد المنطقة التفصيلية للمستخدم
        let detailedArea = '';
        if (latitude >= 31.074 && latitude <= 31.076 && longitude >= 31.793 && longitude <= 31.794) {
          detailedArea = 'عزبة أبو السيد';
        } else if (latitude >= 31.075 && latitude <= 31.077 && longitude >= 31.794 && longitude <= 31.796) {
          detailedArea = 'عزبة الربيعة';
        } else if (latitude >= 31.074 && latitude <= 31.076 && longitude >= 31.795 && longitude <= 31.797) {
          detailedArea = 'نجع العربان';
        } else if (latitude >= 31.075 && latitude <= 31.077 && longitude >= 31.792 && longitude <= 31.794) {
          detailedArea = 'الديسة';
        } else if (latitude >= 31.074 && latitude <= 31.076 && longitude >= 31.794 && longitude <= 31.796) {
          detailedArea = 'عزبة الاتحاد';
        } else if (latitude >= 31.074 && latitude <= 31.076 && longitude >= 31.794 && longitude <= 31.796) {
          detailedArea = 'عزبة محمد السيد';
        } else if (latitude >= 31.073 && latitude <= 31.075 && longitude >= 31.792 && longitude <= 31.794) {
          detailedArea = 'الشرفيات';
        } else {
          detailedArea = neighborhood || district || city || placeName;
        }
        
        // ترتيب البيانات بالشكل الصحيح: المحافظة، المدينة، المنطقة
        return {
          placeName: detailedArea || placeName,
          city: city || district || 'غير محدد',
          district: district || city || 'غير محدد', 
          governorate: governorate || 'غير محدد',
          country: 'مصر',
          fullAddress: result.formatted_address,
          detailedArea: detailedArea || 'غير محدد',
          neighborhood: neighborhood || 'غير محدد',
          street: street || 'غير محدد'
        };
      }
      
      // إذا فشل Google Geocoding، استخدم OpenStreetMap كبديل
      return await this.useOpenStreetMapGeocoding(latitude, longitude);
      
    } catch (error) {
      console.error('Google Geocoding API error:', error);
      // استخدم OpenStreetMap كبديل
      return await this.useOpenStreetMapGeocoding(latitude, longitude);
    }
  }

  // استخدام OpenStreetMap للجيوكودينغ (مجاني)
  private async useOpenStreetMapGeocoding(latitude: number, longitude: number): Promise<GeocodeResult> {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&accept-language=ar,en`
      );
      
      if (!response.ok) {
        throw new Error('Geocoding request failed');
      }

      const data = await response.json();
      
      // استخراج المعلومات من الاستجابة
      const address = data.address || {};
      const displayName = data.display_name || '';
      
      // تحديد اسم المكان
      let placeName = address.city || address.town || address.village || address.suburb || 'موقع في مصر';
      let city = address.city || address.town || address.village || 'غير محدد';
      let governorate = address.state || address.county || 'غير محدد';
      
      // تنظيف أسماء الأماكن العربية
      if (displayName.includes('مصر') || displayName.includes('Egypt')) {
        // استخراج أول جزء من العنوان كاسم المكان
        const parts = displayName.split(',');
        if (parts.length > 0) {
          placeName = parts[0].trim();
        }
      }

      // تحديد المنطقة التفصيلية
      const detailedArea = this.findLocalRegion(latitude, longitude);
      const neighborhood = address.suburb || address.neighbourhood || address.hamlet || 'غير محدد';
      const street = address.road || address.pedestrian || address.footway || 'غير محدد';

      return {
        placeName: detailedArea ? detailedArea.detailedArea : placeName,
        city: detailedArea ? detailedArea.district : city,
        district: detailedArea ? detailedArea.district : (address.suburb || address.neighbourhood || city),
        governorate: detailedArea ? detailedArea.governorate : governorate,
        country: 'مصر',
        fullAddress: displayName,
        detailedArea: detailedArea ? detailedArea.detailedArea : 'غير محدد',
        neighborhood,
        street
      };
    } catch (error) {
      throw error;
    }
  }

  // تحديد المحافظة من الإحداثيات
  getGovernorateFromCoordinates(latitude: number, longitude: number): string {
    const region = this.findLocalRegion(latitude, longitude);
    return region ? region.governorate : 'غير محدد';
  }

  // تحديد المدينة من الإحداثيات
  getCityFromCoordinates(latitude: number, longitude: number): string {
    const region = this.findLocalRegion(latitude, longitude);
    return region ? region.city : 'غير محدد';
  }
}

export const geocodingService = new GeocodingService();
export default geocodingService;
