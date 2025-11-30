import { MedicalCenter } from '../types';

// Google Places API configuration
const GOOGLE_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY || '';
const PLACES_API_BASE = 'https://maps.googleapis.com/maps/api/place';

interface GooglePlace {
  place_id: string;
  name: string;
  vicinity: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  types: string[];
  rating?: number;
  user_ratings_total?: number;
  opening_hours?: {
    open_now: boolean;
  };
  photos?: Array<{
    photo_reference: string;
    height: number;
    width: number;
  }>;
}

interface GooglePlaceDetails {
  place_id: string;
  name: string;
  formatted_address: string;
  formatted_phone_number?: string;
  international_phone_number?: string;
  website?: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  types: string[];
  rating?: number;
  user_ratings_total?: number;
  opening_hours?: {
    open_now: boolean;
    weekday_text: string[];
  };
}

class GooglePlacesService {
  private apiKey: string;

  constructor() {
    this.apiKey = GOOGLE_API_KEY;
    if (!this.apiKey) {
      console.warn('Google Maps API key is not configured');
    }
  }

  // البحث عن الأماكن الطبية القريبة
  async searchNearbyMedicalCenters(
    latitude: number,
    longitude: number,
    radius: number = 10000, // 10km default
    type: 'hospital' | 'pharmacy' | 'doctor' = 'hospital'
  ): Promise<MedicalCenter[]> {
    if (!this.apiKey) {
      throw new Error('Google Maps API key is required');
    }

    try {
      const placeTypes = this.getPlaceTypes(type);
      const url = `${PLACES_API_BASE}/nearbysearch/json?location=${latitude},${longitude}&radius=${radius}&type=${placeTypes}&key=${this.apiKey}`;
      
      const response = await fetch(url);
      const data = await response.json();

      if (data.status !== 'OK') {
        throw new Error(`Google Places API error: ${data.status}`);
      }

      // تحويل البيانات من Google إلى تنسيقنا
      const medicalCenters = await Promise.all(
        data.results.map(async (place: GooglePlace) => {
          const details = await this.getPlaceDetails(place.place_id);
          return this.convertGooglePlaceToMedicalCenter(place, details, latitude, longitude);
        })
      );

      return medicalCenters.filter(center => center !== null) as MedicalCenter[];
    } catch (error) {
      console.error('Error fetching medical centers:', error);
      throw error;
    }
  }

  // الحصول على تفاصيل مكان معين
  private async getPlaceDetails(placeId: string): Promise<GooglePlaceDetails | null> {
    try {
      const fields = 'place_id,name,formatted_address,formatted_phone_number,international_phone_number,website,geometry,types,rating,user_ratings_total,opening_hours';
      const url = `${PLACES_API_BASE}/details/json?place_id=${placeId}&fields=${fields}&key=${this.apiKey}`;
      
      const response = await fetch(url);
      const data = await response.json();

      if (data.status === 'OK') {
        return data.result;
      }
      return null;
    } catch (error) {
      console.error('Error fetching place details:', error);
      return null;
    }
  }

  // تحويل أنواع الأماكن
  private getPlaceTypes(type: string): string {
    const typeMap = {
      hospital: 'hospital',
      pharmacy: 'pharmacy',
      doctor: 'doctor'
    };
    return typeMap[type as keyof typeof typeMap] || 'hospital';
  }

  // تحويل بيانات Google إلى تنسيقنا
  private convertGooglePlaceToMedicalCenter(
    place: GooglePlace,
    details: GooglePlaceDetails | null,
    userLat: number,
    userLng: number
  ): MedicalCenter {
    const distance = this.calculateDistance(
      userLat,
      userLng,
      place.geometry.location.lat,
      place.geometry.location.lng
    );

    // تحديد نوع المكان الطبي
    const medicalType = this.determineMedicalType(place.types);
    
    // تحديد المحافظة من العنوان
    const governorate = this.extractGovernorateFromAddress(details?.formatted_address || place.vicinity);

    // استخراج الخدمات المتاحة من الأنواع
    const services = this.extractServicesFromTypes(place.types);

    return {
      _id: place.place_id,
      name: place.name,
      type: medicalType,
      governorate: governorate,
      city: this.extractCityFromAddress(details?.formatted_address || place.vicinity),
      address: details?.formatted_address || place.vicinity,
      location: {
        type: 'Point',
        coordinates: [place.geometry.location.lng, place.geometry.location.lat]
      },
      phone: details?.formatted_phone_number || details?.international_phone_number || 'غير متوفر',
      emergencyPhone: '123', // رقم الطوارئ المصري
      services: services,
      isActive: true,
      distance: distance,
      rating: place.rating,
      totalRatings: place.user_ratings_total,
      website: details?.website,
      isOpen: place.opening_hours?.open_now,
      openingHours: details?.opening_hours?.weekday_text
    };
  }

  // حساب المسافة بين نقطتين
  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
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

  // تحديد نوع المكان الطبي
  private determineMedicalType(types: string[]): 'hospital' | 'clinic' | 'pharmacy' | 'emergency' {
    if (types.includes('hospital')) return 'hospital';
    if (types.includes('pharmacy')) return 'pharmacy';
    if (types.includes('doctor') || types.includes('dentist')) return 'clinic';
    return 'hospital'; // افتراضي
  }

  // استخراج المحافظة من العنوان
  private extractGovernorateFromAddress(address: string): string {
    const governorates = [
      'القاهرة', 'الجيزة', 'القليوبية', 'الإسكندرية', 'مطروح', 'البحيرة',
      'كفر الشيخ', 'الغربية', 'المنوفية', 'الدقهلية', 'دمياط', 'الشرقية',
      'بورسعيد', 'الإسماعيلية', 'السويس', 'شمال سيناء', 'جنوب سيناء',
      'بني سويف', 'الفيوم', 'المنيا', 'أسيوط', 'سوهاج', 'قنا', 'الأقصر',
      'أسوان', 'البحر الأحمر', 'الوادي الجديد'
    ];

    for (const gov of governorates) {
      if (address.includes(gov)) {
        return gov;
      }
    }
    return 'غير محدد';
  }

  // استخراج المدينة من العنوان
  private extractCityFromAddress(address: string): string {
    const parts = address.split(',');
    return parts[0]?.trim() || 'غير محدد';
  }

  // استخراج الخدمات من الأنواع
  private extractServicesFromTypes(types: string[]): string[] {
    const services = ['طوارئ']; // خدمة أساسية

    if (types.includes('hospital')) {
      services.push('جراحة', 'باطنة', 'أطفال', 'نساء وولادة');
    }
    if (types.includes('pharmacy')) {
      services.push('صيدلية', 'أدوية');
    }
    if (types.includes('dentist')) {
      services.push('أسنان');
    }
    if (types.includes('doctor')) {
      services.push('عيادات خارجية');
    }

    return services;
  }
}

export const googlePlacesService = new GooglePlacesService();
export default googlePlacesService;












