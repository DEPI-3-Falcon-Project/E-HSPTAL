import mapboxgl from 'mapbox-gl';
import { allMedicalCenters } from '../data/egyptianHospitals';
import { MedicalCenter } from '../types';

const MAPBOX_TOKEN = 'pk.eyJ1IjoiYWJkYWxsYWgtbmFyMTEiLCJhIjoiY21mNzRlaXh5MGpiZzJqczRtb2g0dHYxbSJ9.DMUI3c0IZZmvj4dPQYDxXg';

export interface Hospital {
  id: string;
  name: string;
  address: string;
  coordinates: [number, number]; // [longitude, latitude]
  distance?: number;
  category?: string;
  phone?: string;
  website?: string;
  type?: string;
  governorate?: string;
  city?: string;
  services?: string[];
  emergencyPhone?: string;
}

export interface LocationData {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

class MapboxHospitalService {
  private map: mapboxgl.Map | null = null;
  private hospitalMarkers: mapboxgl.Marker[] = [];

  /**
   * Get user's current location using browser Geolocation API
   */
  async getCurrentLocation(): Promise<LocationData> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'));
        return;
      }

      const options: PositionOptions = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      };

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy
          });
        },
        (error) => {
          let errorMessage = 'Unable to get your location';
          
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location access denied. Please allow location access.';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information unavailable.';
              break;
            case error.TIMEOUT:
              errorMessage = 'Location request timed out.';
              break;
            default:
              errorMessage = 'An unknown error occurred while retrieving location.';
          }
          
          reject(new Error(errorMessage));
        },
        options
      );
    });
  }

  /**
   * Search for nearby hospitals using local Egyptian hospital data
   */
  async searchNearbyHospitals(
    location: LocationData, 
    limit: number = 10,
    radiusKm: number = 50
  ): Promise<Hospital[]> {
    try {
      const { latitude, longitude } = location;
      
      // Filter hospitals within the specified radius
      const nearbyHospitals: Hospital[] = allMedicalCenters
        .filter(center => {
          const [lng, lat] = center.location.coordinates;
          const distance = this.calculateDistance(latitude, longitude, lat, lng);
          return distance <= radiusKm;
        })
        .map(center => {
          const [lng, lat] = center.location.coordinates;
          const distance = this.calculateDistance(latitude, longitude, lat, lng);
          
          return {
            id: center._id,
            name: center.name,
            address: center.address,
            coordinates: [lng, lat] as [number, number],
            distance: distance,
            type: center.type,
            governorate: center.governorate,
            city: center.city,
            phone: center.phone,
            emergencyPhone: center.emergencyPhone,
            services: center.services,
            category: center.type
          };
        })
        .sort((a, b) => (a.distance || 0) - (b.distance || 0))
        .slice(0, limit);

      if (nearbyHospitals.length === 0) {
        // If no hospitals found within radius, return the closest ones regardless of distance
        const allHospitals: Hospital[] = allMedicalCenters
          .map(center => {
            const [lng, lat] = center.location.coordinates;
            const distance = this.calculateDistance(latitude, longitude, lat, lng);
            
            return {
              id: center._id,
              name: center.name,
              address: center.address,
              coordinates: [lng, lat] as [number, number],
              distance: distance,
              type: center.type,
              governorate: center.governorate,
              city: center.city,
              phone: center.phone,
              emergencyPhone: center.emergencyPhone,
              services: center.services,
              category: center.type
            };
          })
          .sort((a, b) => (a.distance || 0) - (b.distance || 0))
          .slice(0, limit);
        
        return allHospitals;
      }

      return nearbyHospitals;

    } catch (error) {
      console.error('Error searching for hospitals:', error);
      throw new Error('Failed to fetch nearby hospitals. Please try again.');
    }
  }

  /**
   * Calculate distance between two coordinates using Haversine formula
   */
  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth's radius in kilometers
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
   * Initialize Mapbox map
   */
  initializeMap(container: string | HTMLElement): mapboxgl.Map {
    this.map = new mapboxgl.Map({
      container,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [31.2001, 30.0444], // Cairo, Egypt
      zoom: 12,
      accessToken: MAPBOX_TOKEN
    });

    // Add navigation controls
    this.map.addControl(new mapboxgl.NavigationControl(), 'top-right');
    
    // Add geolocate control
    this.map.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true
        },
        trackUserLocation: true,
        showUserHeading: true
      }),
      'top-right'
    );

    return this.map;
  }

  /**
   * Add hospital markers to the map
   */
  addHospitalMarkers(hospitals: Hospital[]): void {
    if (!this.map) return;

    // Clear existing markers
    this.clearMarkers();

    hospitals.forEach((hospital, index) => {
      // Get icon and color based on hospital type
      const { icon, color, bgColor } = this.getHospitalIconAndColor(hospital.type || 'hospital');
      
      // Create custom marker element
      const el = document.createElement('div');
      el.className = 'hospital-marker';
      el.style.cssText = `
        width: 35px;
        height: 35px;
        border-radius: 50%;
        background-color: ${bgColor};
        border: 3px solid white;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        color: white;
        font-size: 16px;
        transition: transform 0.2s ease;
      `;
      el.innerHTML = icon;
      
      // Add hover effect
      el.addEventListener('mouseenter', () => {
        el.style.transform = 'scale(1.1)';
      });
      el.addEventListener('mouseleave', () => {
        el.style.transform = 'scale(1)';
      });

      // Create marker
      const marker = new mapboxgl.Marker(el)
        .setLngLat(hospital.coordinates)
        .addTo(this.map!);

      // Create popup content
      const popupContent = `
        <div style="font-family: 'Cairo', sans-serif; direction: rtl; text-align: right; max-width: 280px;">
          <div style="background: linear-gradient(135deg, ${color}, ${bgColor}); color: white; padding: 10px 12px; border-radius: 8px 8px 0 0; margin: -10px -10px 10px -10px;">
            <strong>${icon} ${hospital.name}</strong>
          </div>
          <div style="padding: 10px 0;">
            <p style="margin: 0 0 8px 0; font-size: 14px; line-height: 1.4;">
              <strong>العنوان:</strong><br/>
              ${hospital.address}
            </p>
            ${hospital.governorate ? `
              <p style="margin: 0 0 8px 0; font-size: 12px; color: #666;">
                <strong>المحافظة:</strong> ${hospital.governorate}
              </p>
            ` : ''}
            ${hospital.distance ? `
              <p style="margin: 0 0 8px 0; font-size: 12px; color: #666;">
                <strong>المسافة:</strong> ${hospital.distance.toFixed(1)} كم
              </p>
            ` : ''}
            ${hospital.phone ? `
              <p style="margin: 0 0 8px 0; font-size: 12px;">
                <strong>الهاتف:</strong> 
                <a href="tel:${hospital.phone}" style="color: ${color}; text-decoration: none;">
                  ${hospital.phone}
                </a>
              </p>
            ` : ''}
            ${hospital.emergencyPhone ? `
              <p style="margin: 0 0 8px 0; font-size: 12px;">
                <strong>الطوارئ:</strong> 
                <a href="tel:${hospital.emergencyPhone}" style="color: #dc2626; text-decoration: none; font-weight: bold;">
                  ${hospital.emergencyPhone}
                </a>
              </p>
            ` : ''}
            ${hospital.services && hospital.services.length > 0 ? `
              <p style="margin: 0 0 8px 0; font-size: 11px; color: #666;">
                <strong>الخدمات:</strong> ${hospital.services.slice(0, 3).join('، ')}${hospital.services.length > 3 ? '...' : ''}
              </p>
            ` : ''}
            <div style="margin-top: 10px; display: flex; gap: 8px;">
              <button onclick="window.open('https://www.google.com/maps/search/?api=1&query=${hospital.coordinates[1]},${hospital.coordinates[0]}', '_blank')" 
                      style="background: ${color}; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 11px; flex: 1;">
                خرائط جوجل
              </button>
              ${hospital.phone ? `
                <button onclick="window.open('tel:${hospital.phone}', '_self')" 
                        style="background: #10b981; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 11px; flex: 1;">
                  اتصل
                </button>
              ` : ''}
            </div>
          </div>
        </div>
      `;

      // Add popup
      const popup = new mapboxgl.Popup({ 
        offset: 25,
        closeButton: true,
        closeOnClick: false,
        maxWidth: '320px'
      }).setHTML(popupContent);

      marker.setPopup(popup);
      this.hospitalMarkers.push(marker);
    });

    // Fit map to show all hospitals
    if (hospitals.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      hospitals.forEach(hospital => {
        bounds.extend(hospital.coordinates);
      });
      this.map.fitBounds(bounds, { padding: 50 });
    }
  }

  /**
   * Get icon and color based on hospital type
   */
  private getHospitalIconAndColor(type: string): { icon: string; color: string; bgColor: string } {
    switch (type) {
      case 'hospital':
        return { icon: 'H', color: '#dc2626', bgColor: '#ef4444' };
      case 'clinic':
        return { icon: 'C', color: '#2563eb', bgColor: '#3b82f6' };
      case 'pharmacy':
        return { icon: 'P', color: '#059669', bgColor: '#10b981' };
      case 'emergency':
        return { icon: 'E', color: '#dc2626', bgColor: '#f59e0b' };
      default:
        return { icon: 'H', color: '#6b7280', bgColor: '#9ca3af' };
    }
  }

  /**
   * Clear all hospital markers
   */
  clearMarkers(): void {
    this.hospitalMarkers.forEach(marker => marker.remove());
    this.hospitalMarkers = [];
  }

  /**
   * Get the current map instance
   */
  getMap(): mapboxgl.Map | null {
    return this.map;
  }

  /**
   * Clean up resources
   */
  destroy(): void {
    this.clearMarkers();
    if (this.map) {
      this.map.remove();
      this.map = null;
    }
  }
}

export const mapboxHospitalService = new MapboxHospitalService();
