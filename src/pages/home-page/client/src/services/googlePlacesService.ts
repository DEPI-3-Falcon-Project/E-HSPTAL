import axios, { AxiosResponse } from 'axios';

// Google Places API configuration
const GOOGLE_PLACES_API_KEY = 'AIzaSyAMKNzEGcjceP1HtmaphYjhTfr0BGMGnE0';
const GOOGLE_PLACES_BASE_URL = 'https://maps.googleapis.com/maps/api/place';

// Types for Google Places API
export interface LocationData {
  latitude: number;
  longitude: number;
}

export interface GooglePlace {
  place_id: string;
  name: string;
  formatted_address: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  types: string[];
  rating?: number;
  user_ratings_total?: number;
  price_level?: number;
  opening_hours?: {
    open_now: boolean;
  };
  photos?: Array<{
    photo_reference: string;
    height: number;
    width: number;
  }>;
  business_status?: string;
  vicinity?: string;
}

export interface GooglePlacesResponse {
  results: GooglePlace[];
  status: string;
  next_page_token?: string;
}

export interface EnhancedPlace {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  placeType: 'hospital' | 'clinic' | 'pharmacy' | 'emergency';
  rating?: number;
  userRatingsTotal?: number;
  priceLevel?: number;
  isOpen?: boolean;
  distance?: number;
  businessStatus?: string;
  vicinity?: string;
}

// Medical facility types for Google Places - using exact Google Places types
export enum MedicalFacilityType {
  HOSPITALS = 'hospital',
  CLINICS = 'doctor',
  PHARMACIES = 'pharmacy',
  ALL = 'all'
}

class GooglePlacesService {
  private apiKey: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || GOOGLE_PLACES_API_KEY;
  }

  /**
   * Search for nearby medical places using Google Places API
   */
  async searchNearbyPlaces(
    location: LocationData,
    facilityType: MedicalFacilityType,
    radius: number = 10000, // 10km radius for rural areas
    maxResults: number = 30
  ): Promise<EnhancedPlace[]> {
    try {
      console.log(`Searching for ${facilityType} near ${location.latitude}, ${location.longitude}`);
      
      const url = `${GOOGLE_PLACES_BASE_URL}/nearbysearch/json`;
      const params: any = {
        location: `${location.latitude},${location.longitude}`,
        radius: radius.toString(),
        key: this.apiKey,
        language: 'ar', // Arabic language
        region: 'eg' // Egypt region
      };

      // Add type parameter only if not searching for all
      if (facilityType !== MedicalFacilityType.ALL) {
        params.type = facilityType;
      }

      console.log('Google Places API request:', params);

      const response: AxiosResponse<GooglePlacesResponse> = await axios.get(url, { params });
      
      console.log('Google Places API response:', response.data);
      console.log('Number of places found:', response.data.results?.length || 0);

      if (response.data.status !== 'OK' && response.data.status !== 'ZERO_RESULTS') {
        throw new Error(`Google Places API error: ${response.data.status}`);
      }

      if (!response.data.results || response.data.results.length === 0) {
        console.log('No places found for this search');
        return [];
      }

      // Process and enhance the places data
      const enhancedPlaces = response.data.results
        .slice(0, maxResults)
        .map(place => this.enhancePlace(place, location, facilityType));

      // Sort by distance
      const sortedPlaces = enhancedPlaces.sort((a, b) => (a.distance || 0) - (b.distance || 0));

      console.log(`Enhanced and sorted ${sortedPlaces.length} places`);
      return sortedPlaces;

    } catch (error) {
      console.error('Error searching nearby places:', error);
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 403) {
          throw new Error('Google Places API key is invalid or quota exceeded');
        } else if (error.response?.status === 400) {
          throw new Error('Invalid request parameters');
        }
      }
      throw new Error('Failed to search nearby places. Please try again.');
    }
  }

  /**
   * Search for all types of medical facilities with custom radius
   */
  async searchAllMedicalFacilities(location: LocationData, radius: number = 15000): Promise<{
    hospitals: EnhancedPlace[];
    clinics: EnhancedPlace[];
    pharmacies: EnhancedPlace[];
    all: EnhancedPlace[];
  }> {
    try {
      console.log(`Starting comprehensive medical facilities search with radius: ${radius}m...`);
      
      const [hospitals, clinics, pharmacies, allPlaces] = await Promise.all([
        this.searchNearbyPlaces(location, MedicalFacilityType.HOSPITALS, radius, 20).catch(err => {
          console.error('Hospitals search failed:', err);
          return [];
        }),
        this.searchNearbyPlaces(location, MedicalFacilityType.CLINICS, radius, 20).catch(err => {
          console.error('Clinics search failed:', err);
          return [];
        }),
        this.searchNearbyPlaces(location, MedicalFacilityType.PHARMACIES, radius, 20).catch(err => {
          console.error('Pharmacies search failed:', err);
          return [];
        }),
        this.searchNearbyPlaces(location, MedicalFacilityType.ALL, radius, 30).catch(err => {
          console.error('All places search failed:', err);
          return [];
        })
      ]);

      console.log('Search results - Hospitals:', hospitals.length, 'Clinics:', clinics.length, 'Pharmacies:', pharmacies.length, 'All:', allPlaces.length);

      // Use the comprehensive search results for 'all'
      const uniqueAllPlaces = this.removeDuplicatePlaces(allPlaces);
      const sortedAllPlaces = uniqueAllPlaces.sort((a, b) => (a.distance || 0) - (b.distance || 0));

      console.log('Final results - Total unique places:', sortedAllPlaces.length);

      return {
        hospitals,
        clinics,
        pharmacies,
        all: sortedAllPlaces
      };
    } catch (error) {
      console.error('Error searching all medical facilities:', error);
      throw error;
    }
  }

  /**
   * Get place details by place_id
   */
  async getPlaceDetails(placeId: string): Promise<any> {
    try {
      const url = `${GOOGLE_PLACES_BASE_URL}/details/json`;
      const params = {
        place_id: placeId,
        fields: 'name,formatted_address,geometry,formatted_phone_number,opening_hours,rating,user_ratings_total,website,url',
        key: this.apiKey,
        language: 'ar'
      };

      const response = await axios.get(url, { params });
      return response.data.result;
    } catch (error) {
      console.error('Error getting place details:', error);
      throw error;
    }
  }

  /**
   * Enhance place data with additional information
   */
  private enhancePlace(place: GooglePlace, userLocation: LocationData, facilityType: MedicalFacilityType): EnhancedPlace {
    const distance = this.calculateDistance(
      userLocation.latitude,
      userLocation.longitude,
      place.geometry.location.lat,
      place.geometry.location.lng
    );

    return {
      id: place.place_id,
      name: place.name,
      address: place.formatted_address || place.vicinity || 'Address not available',
      latitude: place.geometry.location.lat,
      longitude: place.geometry.location.lng,
      placeType: this.determinePlaceType(place.types, facilityType),
      rating: place.rating,
      userRatingsTotal: place.user_ratings_total,
      priceLevel: place.price_level,
      isOpen: place.opening_hours?.open_now,
      distance: distance,
      businessStatus: place.business_status,
      vicinity: place.vicinity
    };
  }

  /**
   * Determine place type based on Google Places types and search type
   */
  private determinePlaceType(types: string[], searchType: MedicalFacilityType): 'hospital' | 'clinic' | 'pharmacy' | 'emergency' {
    const typesLower = types.map(t => t.toLowerCase());
    
    console.log('Determining type for Google Places types:', typesLower, 'Search type:', searchType);
    
    // Check for hospitals - exact Google Places types
    if (typesLower.includes('hospital') || 
        typesLower.includes('general_hospital') ||
        typesLower.includes('emergency_room') ||
        searchType === MedicalFacilityType.HOSPITALS) {
      console.log('Classified as hospital');
      return 'hospital';
    }
    
    // Check for pharmacies - exact Google Places types
    if (typesLower.includes('pharmacy') || 
        typesLower.includes('drugstore') ||
        typesLower.includes('chemist') ||
        searchType === MedicalFacilityType.PHARMACIES) {
      console.log('Classified as pharmacy');
      return 'pharmacy';
    }
    
    // Check for clinics/medical centers - exact Google Places types
    if (typesLower.includes('doctor') || 
        typesLower.includes('physician') ||
        typesLower.includes('clinic') ||
        typesLower.includes('medical_clinic') ||
        typesLower.includes('health') ||
        typesLower.includes('dentist') ||
        typesLower.includes('veterinary_care') ||
        searchType === MedicalFacilityType.CLINICS) {
      console.log('Classified as clinic');
      return 'clinic';
    }
    
    // Default based on search type
    const searchTypeStr = searchType as string;
    if (searchTypeStr === 'hospital') return 'hospital';
    if (searchTypeStr === 'pharmacy') return 'pharmacy';
    if (searchTypeStr === 'doctor') return 'clinic';
    if (searchTypeStr === 'all') return 'clinic'; // Default for all search
    
    console.log('Defaulting to clinic');
    return 'clinic';
  }

  /**
   * Calculate distance between two coordinates using Haversine formula
   */
  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI/180);
  }

  /**
   * Remove duplicate places based on coordinates and name similarity
   */
  private removeDuplicatePlaces(places: EnhancedPlace[]): EnhancedPlace[] {
    const seen = new Set<string>();
    return places.filter(place => {
      const key = `${place.latitude.toFixed(4)},${place.longitude.toFixed(4)}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }
}

// Export singleton instance
export const googlePlacesService = new GooglePlacesService();
export default GooglePlacesService;
