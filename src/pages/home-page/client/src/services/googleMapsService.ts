// Google Maps Service - Complete implementation with Places, Geocoding, and Distance Matrix APIs

/// <reference path="../types/google-maps.d.ts" />

const GOOGLE_API_KEY = 'AIzaSyAMKNzEGcjceP1HtmaphYjhTfr0BGMGnE0';

export interface LocationData {
  latitude: number;
  longitude: number;
}

export interface GeocodeResult {
  placeName: string;
  city: string;
  district: string;
  governorate: string;
  country: string;
  fullAddress: string;
  detailedArea?: string;
  neighborhood?: string;
  street?: string;
}

export interface PlaceDetails {
  placeId: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  rating?: number;
  userRatingsTotal?: number;
  isOpen?: boolean;
  types: string[];
  distance?: number;
  travelTime?: string;
}

export interface DistanceMatrixResult {
  distance: string;
  duration: string;
  durationValue: number; // in seconds
}

class GoogleMapsService {
  private map: any = null;
  private userMarker: any = null;
  private placeMarkers: any[] = [];
  private infoWindow: any = null;
  private isApiBlocked: boolean = false;

  constructor() {
    // Don't initialize InfoWindow in constructor - wait for Google Maps to load
    this.infoWindow = null;
  }

  /**
   * Check if Google Maps API is available
   */
  isApiAvailable(): boolean {
    try {
      return typeof window !== 'undefined' && 
             !!(window as any).google && 
             !!(window as any).google.maps &&
             !this.isApiBlocked;
    } catch {
      return false;
    }
  }

  /**
   * Initialize Google Map with error handling
   */
  initializeMap(container: HTMLElement, center: LocationData, zoom: number = 15): any {
    try {
      // Check if Google Maps API is loaded
      if (!this.isApiAvailable()) {
        console.warn('Google Maps API is not available. It may be blocked by an ad blocker.');
        this.isApiBlocked = true;
        return null;
      }

      // Initialize InfoWindow if not already initialized
      if (!this.infoWindow) {
        this.infoWindow = new (window as any).google.maps.InfoWindow();
      }

      this.map = new (window as any).google.maps.Map(container, {
        center: { lat: center.latitude, lng: center.longitude },
        zoom: zoom,
        mapTypeId: (window as any).google.maps.MapTypeId.ROADMAP,
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'on' }]
          }
        ]
      });

      return this.map;
    } catch (error) {
      console.error('Error initializing Google Maps:', error);
      this.isApiBlocked = true;
      return null;
    }
  }

  /**
   * Get current map instance
   */
  getMap(): any {
    return this.map;
  }

  /**
   * Add user location marker
   */
  addUserLocationMarker(location: LocationData, title: string = 'موقعك الحالي'): void {
    if (!this.map) return;

    // Remove existing user marker
    if (this.userMarker) {
      this.userMarker.setMap(null);
    }

    // Create custom user location icon
    const userIcon = {
      path: (window as any).google.maps.SymbolPath.CIRCLE,
      scale: 8,
      fillColor: '#FF0000',
      fillOpacity: 1,
      strokeColor: '#FFFFFF',
      strokeWeight: 3
    };

    this.userMarker = new (window as any).google.maps.Marker({
      position: { lat: location.latitude, lng: location.longitude },
      map: this.map,
      title: title,
      icon: userIcon,
      animation: (window as any).google.maps.Animation.DROP
    });

    // Add info window for user location
    const userInfoContent = `
      <div style="padding: 10px; text-align: center; font-family: 'Cairo', sans-serif;">
        <div style="font-weight: bold; color: #FF0000; margin-bottom: 5px;">
          📍 ${title}
        </div>
        <div style="font-size: 12px; color: #666;">
          ${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}
        </div>
      </div>
    `;

    this.userMarker.addListener('click', () => {
      this.infoWindow?.setContent(userInfoContent);
      this.infoWindow?.open(this.map, this.userMarker);
    });
  }

  /**
   * Reverse geocoding to get location details
   */
  async reverseGeocode(location: LocationData): Promise<GeocodeResult> {
    try {
      console.log('🔍 Starting reverse geocoding for location:', location);
      
      // Check if Google Maps API is loaded
      if (typeof window === 'undefined' || !(window as any).google || !(window as any).google.maps) {
        console.error('❌ Google Maps API is not loaded');
        throw new Error('Google Maps API is not loaded.');
      }

      const geocoder = new (window as any).google.maps.Geocoder();
      
      const result = await new Promise<any[]>((resolve, reject) => {
        geocoder.geocode(
          { 
            location: { lat: location.latitude, lng: location.longitude },
            language: 'ar',
            region: 'eg'
          },
          (results: any, status: any) => {
            console.log('🗺️ Geocoding status:', status);
            console.log('🗺️ Geocoding results:', results);
            
            if (status === 'OK' && results && results.length > 0) {
              resolve(results);
            } else {
              console.error('❌ Geocoding failed:', status);
              reject(new Error(`Geocoding failed: ${status}`));
            }
          }
        );
      });

      if (result.length === 0) {
        throw new Error('No geocoding results found');
      }

      const addressComponents = result[0].address_components;
      let placeName = '';
      let city = '';
      let district = '';
      let governorate = '';
      let country = '';

      // Parse address components
      let detailedArea = '';
      let neighborhood = '';
      let street = '';
      
      console.log('🔍 Address components from Google:', addressComponents);
      
      for (const component of addressComponents) {
        const types = component.types;
        console.log('📍 Component:', component.long_name, 'Types:', types);
        
        if (types.includes('locality')) {
          city = component.long_name;
          console.log('🏙️ City found:', city);
        } else if (types.includes('administrative_area_level_1')) {
          governorate = component.long_name;
          console.log('🏛️ Governorate found:', governorate);
        } else if (types.includes('administrative_area_level_2')) {
          district = component.long_name;
          console.log('🏘️ District found:', district);
        } else if (types.includes('country')) {
          country = component.long_name;
          console.log('🌍 Country found:', country);
        } else if (types.includes('sublocality') || types.includes('neighborhood')) {
          neighborhood = component.long_name;
          placeName = component.long_name;
          console.log('🏠 Neighborhood found:', neighborhood);
        } else if (types.includes('route')) {
          street = component.long_name;
          console.log('🛣️ Street found:', street);
        }
      }

      // تحديد المنطقة التفصيلية للمستخدم
      if (location.latitude >= 31.074 && location.latitude <= 31.076 && location.longitude >= 31.793 && location.longitude <= 31.794) {
        detailedArea = 'عزبة أبو السيد';
      } else if (location.latitude >= 31.075 && location.latitude <= 31.077 && location.longitude >= 31.794 && location.longitude <= 31.796) {
        detailedArea = 'عزبة الربيعة';
      } else if (location.latitude >= 31.074 && location.latitude <= 31.076 && location.longitude >= 31.795 && location.longitude <= 31.797) {
        detailedArea = 'نجع العربان';
      } else if (location.latitude >= 31.075 && location.latitude <= 31.077 && location.longitude >= 31.792 && location.longitude <= 31.794) {
        detailedArea = 'الديسة';
      } else {
        detailedArea = neighborhood || district || city || placeName;
      }

      // Set place name if not found
      if (!placeName) {
        placeName = detailedArea || city || district || governorate || 'موقع غير محدد';
      }

      const finalResult = {
        placeName,
        city: city || 'غير محدد',
        district: district || city || 'غير محدد',
        governorate: governorate || 'غير محدد',
        country: country || 'مصر',
        fullAddress: result[0].formatted_address,
        detailedArea: detailedArea || 'غير محدد',
        neighborhood: neighborhood || 'غير محدد',
        street: street || 'غير محدد'
      };
      
      console.log('🎯 Final geocoding result:', finalResult);
      return finalResult;
    } catch (error) {
      console.error('❌ Reverse geocoding error:', error);
      
      // Fallback: Try to determine location based on coordinates
      let fallbackCity = 'غير محدد';
      let fallbackGovernorate = 'غير محدد';
      let fallbackDistrict = 'غير محدد';
      
      // Basic coordinate-based fallback for Egypt
      if (location.latitude >= 30 && location.latitude <= 32 && location.longitude >= 29 && location.longitude <= 33) {
        // Cairo area
        if (location.latitude >= 30.0 && location.latitude <= 30.2 && location.longitude >= 31.1 && location.longitude <= 31.4) {
          fallbackCity = 'القاهرة';
          fallbackGovernorate = 'القاهرة';
          fallbackDistrict = 'القاهرة';
        }
        // Alexandria area
        else if (location.latitude >= 31.1 && location.latitude <= 31.3 && location.longitude >= 29.8 && location.longitude <= 30.0) {
          fallbackCity = 'الإسكندرية';
          fallbackGovernorate = 'الإسكندرية';
          fallbackDistrict = 'الإسكندرية';
        }
        // Dakahlia area (based on your coordinates)
        else if (location.latitude >= 31.0 && location.latitude <= 31.2 && location.longitude >= 31.7 && location.longitude <= 31.9) {
          fallbackCity = 'المنصورة';
          fallbackGovernorate = 'الدقهلية';
          fallbackDistrict = 'المنصورة';
        }
      }
      
      return {
        placeName: 'موقع غير محدد',
        city: fallbackCity,
        district: fallbackDistrict,
        governorate: fallbackGovernorate,
        country: 'مصر',
        fullAddress: `موقع في ${fallbackGovernorate}`,
        detailedArea: 'غير محدد',
        neighborhood: 'غير محدد',
        street: 'غير محدد'
      };
    }
  }

  /**
   * Search for nearby pharmacies only
   */
  async searchNearbyPharmacies(location: LocationData, radius: number = 30000): Promise<PlaceDetails[]> {
    try {
      // Search for pharmacies with multiple keywords and types
      const pharmacy1 = await this.searchPlacesByType(location, 'pharmacy', radius);
      const pharmacy2 = await this.searchPlacesByType(location, 'drugstore', radius);
      const pharmacy3 = await this.searchPlacesByKeyword(location, 'صيدلية', radius);
      const pharmacy4 = await this.searchPlacesByKeyword(location, 'صيدليات', radius);
      
      // Combine results
      const allPharmacies = [...pharmacy1, ...pharmacy2, ...pharmacy3, ...pharmacy4];
      
      // Remove duplicates based on place_id
      const uniquePharmacies = allPharmacies.filter((place, index, self) => 
        index === self.findIndex(p => p.placeId === place.placeId)
      );
      
      // Calculate distances and travel times
      const placesWithDistance = await this.calculateDistancesAndTimes(location, uniquePharmacies);
      
      // Sort by distance (closest first)
      return placesWithDistance.sort((a, b) => (a.distance || 0) - (b.distance || 0));
    } catch (error) {
      console.error('Error searching pharmacies:', error);
      return [];
    }
  }

  /**
   * Search for nearby medical places
   */
  async searchNearbyMedicalPlaces(location: LocationData, radius: number = 30000): Promise<PlaceDetails[]> {
    try {
      // Check if Google Maps API is available
      if (!this.isApiAvailable()) {
        console.warn('⚠️ Google Maps API is not available (may be blocked by ad blocker)');
        return [];
      }
      
      console.log('🔍 Starting comprehensive medical places search...');
      console.log('🔍 User location:', location);
      console.log('🔍 Search radius:', radius, 'meters');
      console.log('🔍 Radius in km:', radius / 1000, 'km');
      
      // Step 1: Search with single radius for better speed
      const radiusLevels = [radius]; // استخدام النطاق المطلوب فقط لتحسين السرعة
      const allResults: PlaceDetails[] = [];
      
      console.log('🔍 Radius to search:', `${radius/1000}km`);
      console.log('🔍 Final radius:', `${radius/1000}km - will show results from 0 to ${radius/1000}km`);
      
      for (const currentRadius of radiusLevels) {
        console.log(`🔍 Searching with radius: ${currentRadius}m (${currentRadius/1000}km)`);
        
        // Search for hospitals with improved coverage
        console.log('🏥 Searching for hospitals...');
        const hospitals1 = await this.searchPlacesByType(location, 'hospital', currentRadius);
        console.log(`🏥 Found ${hospitals1.length} hospitals by type`);
        
        const hospitals2 = await this.searchPlacesByKeyword(location, 'مستشفى', currentRadius);
        console.log(`🏥 Found ${hospitals2.length} hospitals by keyword (مستشفى)`);
        
        const hospitals3 = await this.searchPlacesByText(location, 'مستشفى', currentRadius);
        console.log(`🏥 Found ${hospitals3.length} hospitals by text search`);
        
        const hospitals4 = await this.searchPlacesByText(location, 'hospital', currentRadius);
        console.log(`🏥 Found ${hospitals4.length} hospitals by text search (hospital)`);
        
        // Search for medical centers and clinics with improved coverage
        console.log('🏥 Searching for medical centers and clinics...');
        const medicalCenters1 = await this.searchPlacesByType(location, 'health', currentRadius);
        console.log(`🏥 Found ${medicalCenters1.length} medical centers by type`);
        
        const medicalCenters2 = await this.searchPlacesByType(location, 'doctor', currentRadius);
        console.log(`🏥 Found ${medicalCenters2.length} doctors by type`);
        
        const medicalCenters3 = await this.searchPlacesByKeyword(location, 'عيادة', currentRadius);
        console.log(`🏥 Found ${medicalCenters3.length} clinics by keyword`);
        
        const medicalCenters4 = await this.searchPlacesByKeyword(location, 'مركز طبي', currentRadius);
        console.log(`🏥 Found ${medicalCenters4.length} medical centers by keyword`);
        
        const medicalCenters5 = await this.searchPlacesByKeyword(location, 'طبيب', currentRadius);
        console.log(`🏥 Found ${medicalCenters5.length} doctors by keyword`);
        
        const medicalCenters6 = await this.searchPlacesByText(location, 'عيادة', currentRadius);
        console.log(`🏥 Found ${medicalCenters6.length} clinics by text search`);
        
        // Search for pharmacies with improved coverage
        console.log('💊 Searching for pharmacies...');
        const pharmacies1 = await this.searchPlacesByType(location, 'pharmacy', currentRadius);
        console.log(`💊 Found ${pharmacies1.length} pharmacies by type`);
        
        const pharmacies2 = await this.searchPlacesByType(location, 'drugstore', currentRadius);
        console.log(`💊 Found ${pharmacies2.length} drugstores by type`);
        
        const pharmacies3 = await this.searchPlacesByKeyword(location, 'صيدلية', currentRadius);
        console.log(`💊 Found ${pharmacies3.length} pharmacies by keyword`);
        
        const pharmacies4 = await this.searchPlacesByKeyword(location, 'صيدليات', currentRadius);
        console.log(`💊 Found ${pharmacies4.length} pharmacies (plural) by keyword`);
        
        const pharmacies5 = await this.searchPlacesByText(location, 'صيدلية', currentRadius);
        console.log(`💊 Found ${pharmacies5.length} pharmacies by text search`);
        
        const pharmacies6 = await this.searchPlacesByText(location, 'pharmacy', currentRadius);
        console.log(`💊 Found ${pharmacies6.length} pharmacies by text search (pharmacy)`);
        
        
        // Combine results for this radius level
        const radiusResults = [
          ...hospitals1, ...hospitals2, ...hospitals3, ...hospitals4,
          ...medicalCenters1, ...medicalCenters2, ...medicalCenters3, ...medicalCenters4, ...medicalCenters5, ...medicalCenters6,
          ...pharmacies1, ...pharmacies2, ...pharmacies3, ...pharmacies4, ...pharmacies5, ...pharmacies6
        ];
        
        allResults.push(...radiusResults);
        console.log(`🔍 Found ${radiusResults.length} places at radius ${currentRadius}m (${currentRadius/1000}km)`);
        console.log(`🔍 Breakdown: ${hospitals1.length + hospitals2.length + hospitals3.length + hospitals4.length} hospitals, ${medicalCenters1.length + medicalCenters2.length + medicalCenters3.length + medicalCenters4.length + medicalCenters5.length + medicalCenters6.length} medical centers/clinics, ${pharmacies1.length + pharmacies2.length + pharmacies3.length + pharmacies4.length + pharmacies5.length + pharmacies6.length} pharmacies`);
      }
      
      // Step 2: Search from multiple strategic points around the user location
      const searchPoints = this.generateSearchPoints(location, radius);
      console.log('🔍 Generated search points:', searchPoints.length);
      
      // Search from multiple points for comprehensive coverage
      const hospitalsFromPoints = await this.searchFromMultiplePoints(searchPoints, 'hospital', radius);
      console.log('🔍 Hospitals from multiple points:', hospitalsFromPoints.length);
      
      const clinicsFromPoints = await this.searchFromMultiplePoints(searchPoints, 'doctor', radius);
      console.log('🔍 Clinics from multiple points:', clinicsFromPoints.length);
      
      const pharmaciesFromPoints = await this.searchFromMultiplePoints(searchPoints, 'pharmacy', radius);
      console.log('🔍 Pharmacies from multiple points:', pharmaciesFromPoints.length);

      // Combine all results
      const allPlaces = [
        ...allResults,
        ...hospitalsFromPoints,
        ...clinicsFromPoints,
        ...pharmaciesFromPoints
      ];

      console.log('🔍 Total places before deduplication:', allPlaces.length);
      
      // Remove duplicates based on place_id
      const uniquePlaces = allPlaces.filter((place, index, self) => 
        index === self.findIndex(p => p.placeId === place.placeId)
      );
      
      console.log('🔍 Total unique places found:', uniquePlaces.length);
      console.log('🔍 Places by type:', {
        hospitals: uniquePlaces.filter(p => p.types.includes('hospital')).length,
        clinics: uniquePlaces.filter(p => p.types.includes('doctor') || p.types.includes('clinic')).length,
        pharmacies: uniquePlaces.filter(p => p.types.includes('pharmacy') || p.types.includes('drugstore')).length
      });
      
      console.log('🔍 Unique places after deduplication:', uniquePlaces.length);
      console.log('🔍 Unique places:', uniquePlaces.map(p => ({ name: p.name, types: p.types })));

      // Calculate distances and travel times
      const placesWithDistance = await this.calculateDistancesAndTimes(location, uniquePlaces);
      
      console.log('🔍 Places with distance calculated:', placesWithDistance.length);

      // Sort by distance (closest first)
      const sortedPlaces = placesWithDistance.sort((a, b) => (a.distance || 0) - (b.distance || 0));
      
      console.log('🔍 Final sorted places:', sortedPlaces.length);
      console.log('🔍 Final places:', sortedPlaces.map(p => ({ name: p.name, types: p.types, distance: p.distance })));
      
      return sortedPlaces;
    } catch (error) {
      console.error('Error searching medical places:', error);
      return [];
    }
  }

  /**
   * Search places by keyword
   */
  private async searchPlacesByKeyword(location: LocationData, keyword: string, radius: number): Promise<PlaceDetails[]> {
    return new Promise((resolve) => {
      // Check if Google Maps API is loaded
      if (!this.isApiAvailable() || !this.map) {
        console.warn('⚠️ Google Maps API not available for keyword search');
        resolve([]);
        return;
      }

      try {
        const placesService = new (window as any).google.maps.places.PlacesService(this.map!);
      
      const request: any = {
        location: { lat: location.latitude, lng: location.longitude },
        radius: radius,
        keyword: keyword
      };

      placesService.nearbySearch(request, (results: any, status: any) => {
        if (status === (window as any).google.maps.places.PlacesServiceStatus.OK && results) {
          const places: PlaceDetails[] = results.map((place: any) => ({
            placeId: place.place_id!,
            name: place.name!,
            address: place.vicinity || 'عنوان غير محدد',
            latitude: place.geometry?.location?.lat() || 0,
            longitude: place.geometry?.location?.lng() || 0,
            rating: place.rating,
            userRatingsTotal: place.user_ratings_total,
            isOpen: place.opening_hours?.open_now,
            types: place.types || []
          }));
          resolve(places);
        } else {
          console.warn(`Places search failed for keyword ${keyword}:`, status);
          resolve([]);
        }
      });
      } catch (error) {
        console.error('Error in searchPlacesByKeyword:', error);
        resolve([]);
      }
    });
  }

  /**
   * Search places by text search (more comprehensive)
   */
  private async searchPlacesByText(location: LocationData, query: string, radius: number): Promise<PlaceDetails[]> {
    return new Promise((resolve) => {
      // Check if Google Maps API is loaded
      if (!this.isApiAvailable() || !this.map) {
        console.warn('⚠️ Google Maps API not available for text search');
        resolve([]);
        return;
      }

      try {
        const placesService = new (window as any).google.maps.places.PlacesService(this.map!);
      
        const request: any = {
          query: query,
          location: { lat: location.latitude, lng: location.longitude },
          radius: radius
        };

        placesService.textSearch(request, (results: any, status: any) => {
          if (status === (window as any).google.maps.places.PlacesServiceStatus.OK && results) {
            const places: PlaceDetails[] = results.map((place: any) => ({
              placeId: place.place_id!,
              name: place.name!,
              address: place.formatted_address || place.vicinity || 'عنوان غير محدد',
              latitude: place.geometry?.location?.lat() || 0,
              longitude: place.geometry?.location?.lng() || 0,
              rating: place.rating,
              userRatingsTotal: place.user_ratings_total,
              isOpen: place.opening_hours?.open_now,
              types: place.types || []
            }));
            resolve(places);
          } else {
            console.warn(`Text search failed for query ${query}:`, status);
            resolve([]);
          }
        });
      } catch (error) {
        console.error('Error in searchPlacesByText:', error);
        resolve([]);
      }
    });
  }

  /**
   * Enhanced search using autocomplete for better results
   */
  private async searchPlacesByAutocomplete(location: LocationData, query: string, radius: number): Promise<PlaceDetails[]> {
    return new Promise((resolve) => {
      // Check if Google Maps API is loaded
      if (!this.isApiAvailable() || !this.map) {
        console.warn('⚠️ Google Maps API not available for autocomplete search');
        resolve([]);
        return;
      }

      try {
        const autocompleteService = new (window as any).google.maps.places.AutocompleteService();
        const placesService = new (window as any).google.maps.places.PlacesService(this.map!);
      
      const request: any = {
        input: query,
        location: new (window as any).google.maps.LatLng(location.latitude, location.longitude),
        radius: radius,
        types: ['establishment']
      };

        autocompleteService.getPlacePredictions(request, async (predictions: any, status: any) => {
          if (status === (window as any).google.maps.places.PlacesServiceStatus.OK && predictions) {
            const places: PlaceDetails[] = [];
            
            // Get details for each prediction
            for (const prediction of predictions.slice(0, 10)) { // Limit to 10 to avoid rate limiting
              try {
                const details = await this.getPlaceDetails(prediction.place_id);
                if (details) {
                  places.push(details);
                }
              } catch (error) {
                console.warn('Error getting place details:', error);
              }
            }
            
            resolve(places);
          } else {
            console.warn(`Autocomplete search failed for query ${query}:`, status);
            resolve([]);
          }
        });
      } catch (error) {
        console.error('Error in searchPlacesByAutocomplete:', error);
        resolve([]);
      }
    });
  }

  /**
   * Get detailed information about a place
   */
  private async getPlaceDetails(placeId: string): Promise<PlaceDetails | null> {
    return new Promise((resolve) => {
      if (!this.isApiAvailable() || !this.map) {
        resolve(null);
        return;
      }
      
      try {
        const placesService = new (window as any).google.maps.places.PlacesService(this.map!);
      
        const request: any = {
          placeId: placeId,
          fields: ['place_id', 'name', 'formatted_address', 'geometry', 'rating', 'user_ratings_total', 'opening_hours', 'types']
        };

        placesService.getDetails(request, (place: any, status: any) => {
          if (status === (window as any).google.maps.places.PlacesServiceStatus.OK && place) {
            const placeDetails: PlaceDetails = {
              placeId: place.place_id!,
              name: place.name!,
              address: place.formatted_address || 'عنوان غير محدد',
              latitude: place.geometry?.location?.lat() || 0,
              longitude: place.geometry?.location?.lng() || 0,
              rating: place.rating,
              userRatingsTotal: place.user_ratings_total,
              isOpen: place.opening_hours?.open_now,
              types: place.types || []
            };
            resolve(placeDetails);
          } else {
            resolve(null);
          }
        });
      } catch (error) {
        console.error('Error in getPlaceDetails:', error);
        resolve(null);
      }
    });
  }

  /**
   * Search places by specific type
   */
  private async searchPlacesByType(location: LocationData, type: string, radius: number): Promise<PlaceDetails[]> {
    return new Promise((resolve) => {
      // Check if Google Maps API is loaded
      if (!this.isApiAvailable() || !this.map) {
        console.warn('⚠️ Google Maps API not available for type search');
        resolve([]);
        return;
      }

      try {
        const placesService = new (window as any).google.maps.places.PlacesService(this.map!);
      
      const request: any = {
        location: { lat: location.latitude, lng: location.longitude },
        radius: radius,
        type: type,
        keyword: type === 'doctor' ? 'عيادة طبية' : type === 'hospital' ? 'مستشفى' : type === 'pharmacy' ? 'صيدلية' : 'صيدلية'
      };

        placesService.nearbySearch(request, (results: any, status: any) => {
          if (status === (window as any).google.maps.places.PlacesServiceStatus.OK && results) {
            const places: PlaceDetails[] = results.map((place: any) => ({
              placeId: place.place_id!,
              name: place.name!,
              address: place.vicinity || 'عنوان غير محدد',
              latitude: place.geometry?.location?.lat() || 0,
              longitude: place.geometry?.location?.lng() || 0,
              rating: place.rating,
              userRatingsTotal: place.user_ratings_total,
              isOpen: place.opening_hours?.open_now,
              types: place.types || []
            }));
            resolve(places);
          } else {
            console.warn(`Places search failed for ${type}:`, status);
            resolve([]);
          }
        });
      } catch (error) {
        console.error('Error in searchPlacesByType:', error);
        resolve([]);
      }
    });
  }

  /**
   * Calculate distance between two points using Haversine formula
   */
  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c; // Distance in kilometers
    return distance;
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI/180);
  }

  /**
   * Sort places by distance from user location
   */
  sortPlacesByDistance(userLocation: LocationData, places: PlaceDetails[]): PlaceDetails[] {
    return places.sort((a, b) => {
      const distanceA = this.calculateDistance(
        userLocation.latitude, 
        userLocation.longitude, 
        a.latitude, 
        a.longitude
      );
      const distanceB = this.calculateDistance(
        userLocation.latitude, 
        userLocation.longitude, 
        b.latitude, 
        b.longitude
      );
      return distanceA - distanceB; // Sort from closest to farthest
    });
  }

  /**
   * Calculate distances and travel times using Distance Matrix API
   */
  private async calculateDistancesAndTimes(userLocation: LocationData, places: PlaceDetails[]): Promise<PlaceDetails[]> {
    if (places.length === 0) return places;

    try {
      // Check if Google Maps API is loaded
      if (typeof window === 'undefined' || !(window as any).google || !(window as any).google.maps) {
        throw new Error('Google Maps API is not loaded.');
      }

      const service = new (window as any).google.maps.DistanceMatrixService();
      
      const origins = [{ lat: userLocation.latitude, lng: userLocation.longitude }];
      const destinations = places.map(place => ({ lat: place.latitude, lng: place.longitude }));

      const result = await new Promise<any>((resolve, reject) => {
        service.getDistanceMatrix(
          {
            origins: origins,
            destinations: destinations,
            travelMode: (window as any).google.maps.TravelMode.DRIVING,
            unitSystem: (window as any).google.maps.UnitSystem.METRIC,
            avoidHighways: false,
            avoidTolls: false
          },
          (response: any, status: any) => {
            if (status === 'OK' && response) {
              resolve(response);
            } else {
              reject(new Error(`Distance Matrix failed: ${status}`));
            }
          }
        );
      });

      // Update places with distance and travel time
      const updatedPlaces = places.map((place, index) => {
        const element = result.rows[0].elements[index];
        if (element.status === 'OK') {
          return {
            ...place,
            distance: element.distance.value / 1000, // Convert to kilometers
            travelTime: element.duration.text
          };
        } else {
          // If Distance Matrix fails, calculate distance manually
          const manualDistance = this.calculateDistance(
            userLocation.latitude,
            userLocation.longitude,
            place.latitude,
            place.longitude
          );
          return {
            ...place,
            distance: manualDistance,
            travelTime: 'غير محدد'
          };
        }
      });

      return updatedPlaces;
    } catch (error) {
      console.error('Distance Matrix error:', error);
      return places;
    }
  }

  /**
   * Add markers for medical places
   */
  addMedicalPlaceMarkers(places: PlaceDetails[]): void {
    if (!this.map) {
      console.error('❌ Map not initialized, cannot add markers');
      return;
    }

    console.log('📍 Adding markers for places:', places.length);
    console.log('📍 Places to mark:', places);

    // Clear existing place markers
    this.clearPlaceMarkers();

    places.forEach((place, index) => {
      console.log(`📍 Adding marker ${index + 1}:`, place.name, place.types);
      
      const markerIcon = this.getMarkerIcon(place.types);
      console.log('📍 Marker icon:', markerIcon);
      
      const marker = new (window as any).google.maps.Marker({
        position: { lat: place.latitude, lng: place.longitude },
        map: this.map,
        title: place.name,
        icon: markerIcon,
        animation: (window as any).google.maps.Animation.DROP
      });

      console.log('📍 Marker created:', marker);

      // Create info window content
      const infoContent = this.createInfoWindowContent(place);
      
      marker.addListener('click', () => {
        this.infoWindow?.setContent(infoContent);
        this.infoWindow?.open(this.map, marker);
      });

      this.placeMarkers.push(marker);
    });

    console.log('📍 Total markers added:', this.placeMarkers.length);

    // Fit map to show all markers
    this.fitMapToMarkers(places);
  }

  /**
   * Get marker icon based on place type
   */
  private getMarkerIcon(types: string[]): any {
    console.log('🎨 Getting marker icon for types:', types);
    
    const isHospital = types.includes('hospital') || types.includes('health');
    const isPharmacy = types.includes('pharmacy') || types.includes('drugstore');
    
    console.log('🎨 Is hospital:', isHospital);
    console.log('🎨 Is pharmacy:', isPharmacy);
    
    if (isHospital) {
      console.log('🎨 Using hospital icon (red)');
      return {
        path: (window as any).google.maps.SymbolPath.CIRCLE,
        scale: 10,
        fillColor: '#DC2626',
        fillOpacity: 1,
        strokeColor: '#FFFFFF',
        strokeWeight: 2
      };
    } else if (isPharmacy) {
      console.log('🎨 Using pharmacy icon (purple)');
      return {
        path: (window as any).google.maps.SymbolPath.CIRCLE,
        scale: 10,
        fillColor: '#7C3AED',
        fillOpacity: 1,
        strokeColor: '#FFFFFF',
        strokeWeight: 2
      };
    } else {
      console.log('🎨 Using clinic icon (green)');
      return {
        path: (window as any).google.maps.SymbolPath.CIRCLE,
        scale: 10,
        fillColor: '#059669',
        fillOpacity: 1,
        strokeColor: '#FFFFFF',
        strokeWeight: 2
      };
    }
  }

  /**
   * Create info window content for a place
   */
  private createInfoWindowContent(place: PlaceDetails): string {
    const typeIcon = this.getTypeIcon(place.types);
    const rating = place.rating ? `⭐ ${place.rating.toFixed(1)} (${place.userRatingsTotal || 0} تقييم)` : 'لا توجد تقييمات';
    const distance = place.distance ? `📍 ${place.distance.toFixed(1)} كم` : '';
    const travelTime = place.travelTime ? `⏱️ ${place.travelTime}` : '';
    const status = place.isOpen !== undefined ? (place.isOpen ? '🟢 مفتوح الآن' : '🔴 مغلق الآن') : '';
    
    return `
      <div style="padding: 12px; font-family: 'Cairo', sans-serif; direction: rtl; max-width: 300px;">
        <div style="display: flex; align-items: center; margin-bottom: 8px;">
          <span style="font-size: 18px; margin-left: 8px;">${typeIcon}</span>
          <div>
            <div style="font-weight: bold; color: #1f2937; font-size: 14px; margin-bottom: 2px;">
              ${place.name}
            </div>
            <div style="font-size: 12px; color: #6b7280;">
              ${this.getTypeName(place.types)}
            </div>
          </div>
        </div>
        
        <div style="font-size: 12px; color: #4b5563; margin-bottom: 8px; line-height: 1.4;">
          ${place.address}
        </div>
        
        <div style="display: flex; flex-direction: column; gap: 4px; margin-bottom: 12px;">
          ${rating ? `<div style="font-size: 11px; color: #059669;">${rating}</div>` : ''}
          ${distance ? `<div style="font-size: 11px; color: #3b82f6;">${distance}</div>` : ''}
          ${travelTime ? `<div style="font-size: 11px; color: #3b82f6;">${travelTime}</div>` : ''}
          ${status ? `<div style="font-size: 11px; color: ${place.isOpen ? '#059669' : '#dc2626'};">${status}</div>` : ''}
        </div>
        
        <div style="display: flex; gap: 8px;">
          <button onclick="window.open('https://www.google.com/maps/dir/?api=1&destination=${place.latitude},${place.longitude}', '_blank')" 
                  style="flex: 1; padding: 6px 12px; background: #3b82f6; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 11px; font-weight: 500;">
            🗺️ التوجيه
          </button>
          <button onclick="window.open('https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name + ' ' + place.address)}', '_blank')" 
                  style="flex: 1; padding: 6px 12px; background: #059669; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 11px; font-weight: 500;">
            📍 عرض على الخريطة
          </button>
        </div>
      </div>
    `;
  }

  /**
   * Get type icon
   */
  private getTypeIcon(types: string[]): string {
    if (types.includes('hospital') || types.includes('health')) {
      return '🏥';
    } else if (types.includes('pharmacy') || types.includes('drugstore')) {
      return '💊';
    } else {
      return '🏥';
    }
  }

  /**
   * Get type name in Arabic
   */
  private getTypeName(types: string[]): string {
    if (types.includes('hospital') || types.includes('health')) {
      return 'مستشفى';
    } else if (types.includes('pharmacy') || types.includes('drugstore')) {
      return 'صيدلية';
    } else {
      return 'مركز طبي';
    }
  }

  /**
   * Clear all place markers
   */
  clearPlaceMarkers(): void {
    console.log('🗑️ Clearing existing markers:', this.placeMarkers.length);
    this.placeMarkers.forEach(marker => marker.setMap(null));
    this.placeMarkers = [];
    console.log('🗑️ Markers cleared');
  }

  /**
   * Fit map to show all markers
   */
  private fitMapToMarkers(places: PlaceDetails[]): void {
    if (!this.map || places.length === 0) return;

    const bounds = new (window as any).google.maps.LatLngBounds();
    
    // Add user location to bounds
    if (this.userMarker) {
      const userPosition = this.userMarker.getPosition();
      if (userPosition) {
        bounds.extend(userPosition);
      }
    }
    
    // Add all place locations to bounds
    places.forEach(place => {
      bounds.extend({ lat: place.latitude, lng: place.longitude });
    });

    this.map.fitBounds(bounds, { padding: 50 });
  }

  /**
   * Generate multiple search points around the user location for better coverage
   */
  private generateSearchPoints(centerLocation: LocationData, radius: number): LocationData[] {
    const points: LocationData[] = [];
    const radiusKm = radius / 1000; // Convert to kilometers
    
    // Add center point
    points.push(centerLocation);
    
    // Generate points in a grid pattern around the center
    const step = radiusKm / 3; // Divide radius into 3 steps
    
    for (let latOffset = -radiusKm; latOffset <= radiusKm; latOffset += step) {
      for (let lngOffset = -radiusKm; lngOffset <= radiusKm; lngOffset += step) {
        if (latOffset === 0 && lngOffset === 0) continue; // Skip center point (already added)
        
        const newLat = centerLocation.latitude + (latOffset / 111); // Approximate km to degrees
        const newLng = centerLocation.longitude + (lngOffset / (111 * Math.cos(centerLocation.latitude * Math.PI / 180)));
        
        // Check if point is within radius
        const distance = this.calculateDistance(centerLocation.latitude, centerLocation.longitude, newLat, newLng);
        if (distance <= radiusKm) {
          points.push({ latitude: newLat, longitude: newLng });
        }
      }
    }
    
    console.log('📍 Generated search points:', points.length);
    return points;
  }

  /**
   * Search from multiple points for better coverage
   */
  private async searchFromMultiplePoints(points: LocationData[], type: string, radius: number): Promise<PlaceDetails[]> {
    const allResults: PlaceDetails[] = [];
    
    // Search from each point (limit to avoid too many API calls)
    const limitedPoints = points.slice(0, 8); // Limit to 8 points to avoid rate limiting
    
    for (const point of limitedPoints) {
      try {
        const results = await this.searchPlacesByType(point, type, radius);
        allResults.push(...results);
      } catch (error) {
        console.warn('Error searching from point:', point, error);
      }
    }
    
    return allResults;
  }

  /**
   * Destroy the map and clean up
   */
  destroy(): void {
    this.clearPlaceMarkers();
    if (this.userMarker) {
      this.userMarker.setMap(null);
      this.userMarker = null;
    }
    if (this.infoWindow) {
      this.infoWindow.close();
    }
    this.map = null;
  }
}

// Export singleton instance
export const googleMapsService = new GoogleMapsService();
export default GoogleMapsService;
