import { allMedicalCenters } from '../data/egyptianHospitals';
import { MedicalCenter } from '../types';

export interface SearchOptions {
  radius?: number; // في الكيلومتر
  limit?: number; // عدد النتائج
  type?: 'hospital' | 'clinic' | 'pharmacy' | 'emergency' | 'all';
  governorate?: string;
  city?: string;
  services?: string[]; // الخدمات المطلوبة
  openNow?: boolean; // مفتوح الآن (سيتم تطويره لاحقاً)
}

export interface SearchResult {
  place: MedicalCenter;
  distance: number;
  relevanceScore: number;
}

export interface LocationData {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

class MedicalPlacesService {
  private medicalCenters: MedicalCenter[] = allMedicalCenters;

  /**
   * البحث عن المرافق الطبية القريبة (مثل Google Places API)
   */
  async searchNearby(
    location: LocationData,
    options: SearchOptions = {}
  ): Promise<SearchResult[]> {
    const {
      radius = 50,
      limit = 20,
      type = 'all',
      governorate,
      city,
      services = [],
      openNow = false
    } = options;

    try {
      // 1. تصفية المرافق حسب النوع
      let filteredCenters = this.filterByType(this.medicalCenters, type);

      // 2. تصفية حسب المحافظة والمدينة
      if (governorate) {
        filteredCenters = filteredCenters.filter(center => 
          center.governorate.toLowerCase().includes(governorate.toLowerCase())
        );
      }

      if (city) {
        filteredCenters = filteredCenters.filter(center => 
          center.city.toLowerCase().includes(city.toLowerCase())
        );
      }

      // 3. تصفية حسب الخدمات المطلوبة
      if (services.length > 0) {
        filteredCenters = filteredCenters.filter(center =>
          services.some(service => 
            center.services.some(centerService => 
              centerService.toLowerCase().includes(service.toLowerCase())
            )
          )
        );
      }

      // 4. حساب المسافات والنتائج
      const results: SearchResult[] = filteredCenters
        .map(center => {
          const [lng, lat] = center.location.coordinates;
          const distance = this.calculateDistance(
            location.latitude, 
            location.longitude, 
            lat, 
            lng
          );

          return {
            place: center,
            distance,
            relevanceScore: this.calculateRelevanceScore(center, distance, services)
          };
        })
        .filter(result => result.distance <= radius) // تصفية حسب النطاق
        .sort((a, b) => {
          // ترتيب حسب المسافة أولاً، ثم حسب نقاط الصلة
          if (Math.abs(a.distance - b.distance) < 0.1) {
            return b.relevanceScore - a.relevanceScore;
          }
          return a.distance - b.distance;
        })
        .slice(0, limit);

      // 5. إذا لم نجد نتائج في النطاق المحدد، نعيد الأقرب بغض النظر عن النطاق
      if (results.length === 0) {
        const allResults: SearchResult[] = filteredCenters
          .map(center => {
            const [lng, lat] = center.location.coordinates;
            const distance = this.calculateDistance(
              location.latitude, 
              location.longitude, 
              lat, 
              lng
            );

            return {
              place: center,
              distance,
              relevanceScore: this.calculateRelevanceScore(center, distance, services)
            };
          })
          .sort((a, b) => a.distance - b.distance)
          .slice(0, limit);

        return allResults;
      }

      return results;

    } catch (error) {
      console.error('Error searching medical places:', error);
      throw new Error('فشل في البحث عن المرافق الطبية');
    }
  }

  /**
   * البحث النصي (مثل Google Places API)
   */
  async searchByText(
    query: string,
    location?: LocationData,
    options: SearchOptions = {}
  ): Promise<SearchResult[]> {
    const { limit = 20, type = 'all' } = options;

    try {
      let filteredCenters = this.filterByType(this.medicalCenters, type);

      // البحث في الأسماء والعناوين والمدن
      const searchQuery = query.toLowerCase();
      filteredCenters = filteredCenters.filter(center =>
        center.name.toLowerCase().includes(searchQuery) ||
        center.address.toLowerCase().includes(searchQuery) ||
        center.city.toLowerCase().includes(searchQuery) ||
        center.governorate.toLowerCase().includes(searchQuery) ||
        center.services.some(service => 
          service.toLowerCase().includes(searchQuery)
        )
      );

      const results: SearchResult[] = filteredCenters
        .map(center => {
          const distance = location ? (() => {
            const [lng, lat] = center.location.coordinates;
            return this.calculateDistance(
              location.latitude, 
              location.longitude, 
              lat, 
              lng
            );
          })() : 0;

          return {
            place: center,
            distance,
            relevanceScore: this.calculateTextRelevanceScore(center, query)
          };
        })
        .sort((a, b) => b.relevanceScore - a.relevanceScore)
        .slice(0, limit);

      return results;

    } catch (error) {
      console.error('Error in text search:', error);
      throw new Error('فشل في البحث النصي');
    }
  }

  /**
   * الحصول على تفاصيل مرفق معين
   */
  async getPlaceDetails(placeId: string): Promise<MedicalCenter | null> {
    return this.medicalCenters.find(center => center._id === placeId) || null;
  }

  /**
   * الحصول على المرافق المفتوحة الآن (سيتم تطويره)
   */
  async getOpenNow(location: LocationData, options: SearchOptions = {}): Promise<SearchResult[]> {
    // في الوقت الحالي، نعيد جميع المرافق
    // يمكن تطوير هذا لاحقاً لإضافة أوقات العمل
    return this.searchNearby(location, { ...options, openNow: true });
  }

  /**
   * تصفية المرافق حسب النوع
   */
  private filterByType(centers: MedicalCenter[], type: string): MedicalCenter[] {
    if (type === 'all') return centers;
    return centers.filter(center => center.type === type);
  }

  /**
   * حساب المسافة بين نقطتين (Haversine formula)
   */
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

  /**
   * حساب نقاط الصلة للمرفق
   */
  private calculateRelevanceScore(
    center: MedicalCenter, 
    distance: number, 
    requiredServices: string[]
  ): number {
    let score = 100;

    // تقليل النقاط حسب المسافة
    score -= distance * 2;

    // زيادة النقاط إذا كان المرفق نشط
    if (center.isActive) score += 10;

    // زيادة النقاط إذا كان يحتوي على الخدمات المطلوبة
    if (requiredServices.length > 0) {
      const matchingServices = requiredServices.filter(service =>
        center.services.some(centerService => 
          centerService.toLowerCase().includes(service.toLowerCase())
        )
      );
      score += matchingServices.length * 5;
    }

    // زيادة النقاط للمستشفيات الكبيرة
    if (center.type === 'hospital' && center.services.length > 5) {
      score += 15;
    }

    // زيادة النقاط إذا كان له رقم طوارئ
    if (center.emergencyPhone) score += 5;

    return Math.max(0, score);
  }

  /**
   * حساب نقاط الصلة للبحث النصي
   */
  private calculateTextRelevanceScore(center: MedicalCenter, query: string): number {
    let score = 0;
    const searchQuery = query.toLowerCase();

    // مطابقة في الاسم (أعلى نقاط)
    if (center.name.toLowerCase().includes(searchQuery)) {
      score += 50;
    }

    // مطابقة في العنوان
    if (center.address.toLowerCase().includes(searchQuery)) {
      score += 30;
    }

    // مطابقة في المدينة
    if (center.city.toLowerCase().includes(searchQuery)) {
      score += 20;
    }

    // مطابقة في المحافظة
    if (center.governorate.toLowerCase().includes(searchQuery)) {
      score += 15;
    }

    // مطابقة في الخدمات
    const serviceMatches = center.services.filter(service =>
      service.toLowerCase().includes(searchQuery)
    );
    score += serviceMatches.length * 10;

    return score;
  }

  /**
   * الحصول على إحصائيات سريعة
   */
  getStatistics(location?: LocationData, radius: number = 50): {
    total: number;
    hospitals: number;
    clinics: number;
    pharmacies: number;
    emergencies: number;
    nearest?: { name: string; distance: number };
  } {
    let centers = this.medicalCenters;

    // إذا تم توفير الموقع، نركز على المرافق القريبة
    if (location) {
      centers = centers.filter(center => {
        const [lng, lat] = center.location.coordinates;
        const distance = this.calculateDistance(
          location.latitude, 
          location.longitude, 
          lat, 
          lng
        );
        return distance <= radius;
      });
    }

    const hospitals = centers.filter(c => c.type === 'hospital').length;
    const clinics = centers.filter(c => c.type === 'clinic').length;
    const pharmacies = centers.filter(c => c.type === 'pharmacy').length;
    const emergencies = centers.filter(c => c.type === 'emergency').length;

    let nearest = undefined;
    if (location && centers.length > 0) {
      const nearestCenter = centers.reduce((closest, current) => {
        const [lng1, lat1] = closest.location.coordinates;
        const [lng2, lat2] = current.location.coordinates;
        const dist1 = this.calculateDistance(location.latitude, location.longitude, lat1, lng1);
        const dist2 = this.calculateDistance(location.latitude, location.longitude, lat2, lng2);
        return dist1 < dist2 ? closest : current;
      });

      const [lng, lat] = nearestCenter.location.coordinates;
      const distance = this.calculateDistance(location.latitude, location.longitude, lat, lng);
      nearest = { name: nearestCenter.name, distance };
    }

    return {
      total: centers.length,
      hospitals,
      clinics,
      pharmacies,
      emergencies,
      nearest
    };
  }
}

export const medicalPlacesService = new MedicalPlacesService();


