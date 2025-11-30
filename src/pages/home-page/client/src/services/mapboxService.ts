import mapboxgl from 'mapbox-gl';

const MAPBOX_TOKEN = 'pk.eyJ1IjoiYWJkYWxsYWgtbmFyMTEiLCJhIjoiY21mNzRlaXh5MGpiZzJqczRtb2g0dHYxbSJ9.DMUI3c0IZZmvj4dPQYDxXg';

mapboxgl.accessToken = MAPBOX_TOKEN;

export interface MapboxLocationResult {
  latitude: number;
  longitude: number;
  address: string;
  street?: string;
  city?: string;
  governorate?: string;
  country: string;
  accuracy?: number;
}

export interface MapboxGeocodeResult {
  place_name: string;
  context?: Array<{
    id: string;
    text: string;
    short_code?: string;
  }>;
}

class MapboxService {
  private map: mapboxgl.Map | null = null;
  private userLocationMarker: mapboxgl.Marker | null = null;

  // Initialize map
  initializeMap(container: string | HTMLElement, options?: mapboxgl.MapboxOptions): mapboxgl.Map {
    this.map = new mapboxgl.Map({
      container,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [31.2001, 30.0444], // Cairo, Egypt
      zoom: 10,
      // Mobile-optimized default options
      touchZoomRotate: true,
      doubleClickZoom: true,
      scrollZoom: true,
      boxZoom: false,
      dragRotate: false,
      dragPan: true,
      keyboard: false,
      minZoom: 6, // تقليل الحد الأدنى لإظهار أسماء البلاد
      maxZoom: 18,
      renderWorldCopies: false,
      ...options
    });

    // Add navigation controls (mobile-optimized)
    this.map.addControl(new mapboxgl.NavigationControl({
      showCompass: false, // Hide compass on mobile
      showZoom: true,
      visualizePitch: false
    }), 'top-right');
    
    // Add geolocate control (mobile-optimized)
    this.map.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000
        },
        trackUserLocation: true,
        showUserHeading: false, // Disable heading on mobile for better performance
        showAccuracyCircle: true
      }),
      'top-right'
    );

    // تحسين إظهار أسماء البلاد والمدن
    this.map.on('load', () => {
      // إضافة طبقة أسماء البلاد
      if (this.map && !this.map.getLayer('country-labels')) {
        this.map.addSource('country-labels', {
          type: 'vector',
          url: 'mapbox://mapbox.country-boundaries-v1'
        });

        this.map.addLayer({
          id: 'country-labels',
          type: 'symbol',
          source: 'country-labels',
          'source-layer': 'country_boundaries',
          layout: {
            'text-field': ['get', 'name_ar'],
            'text-font': ['Cairo', 'Arial Unicode MS Regular'],
            'text-size': 12,
            'text-transform': 'uppercase',
            'text-letter-spacing': 0.05,
            'text-max-width': 9,
            'text-line-height': 1.2
          },
          paint: {
            'text-color': '#333333',
            'text-halo-color': '#ffffff',
            'text-halo-width': 1
          },
          minzoom: 3,
          maxzoom: 8
        });
      }
    });

    return this.map;
  }

  // Get user's current location with high accuracy
  async getCurrentLocation(): Promise<MapboxLocationResult> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'));
        return;
      }

      const options: PositionOptions = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      };

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude, accuracy } = position.coords;
          
          try {
            // Get detailed address using Mapbox Geocoding
            const addressDetails = await this.reverseGeocode(latitude, longitude);
            
            resolve({
              latitude,
              longitude,
              address: addressDetails.place_name,
              street: this.extractStreet(addressDetails),
              city: this.extractCity(addressDetails),
              governorate: this.extractGovernorate(addressDetails),
              country: 'Egypt',
              accuracy
            });
          } catch (error) {
            // If geocoding fails, still return coordinates
            resolve({
              latitude,
              longitude,
              address: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
              country: 'Egypt',
              accuracy
            });
          }
        },
        (error) => {
          reject(new Error(`Geolocation error: ${error.message}`));
        },
        options
      );
    });
  }

  // Reverse geocoding using Mapbox Geocoding API
  async reverseGeocode(latitude: number, longitude: number): Promise<MapboxGeocodeResult> {
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${MAPBOX_TOKEN}&language=ar&country=EG`;
    
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.features && data.features.length > 0) {
        return data.features[0];
      } else {
        throw new Error('No location found');
      }
    } catch (error) {
      console.error('Mapbox geocoding error:', error);
      throw error;
    }
  }

  // Add user location marker to map
  addUserLocationMarker(latitude: number, longitude: number, popupText?: string): void {
    if (!this.map) return;

    // Remove existing marker
    if (this.userLocationMarker) {
      this.userLocationMarker.remove();
    }

    // Create custom marker element (mobile-optimized)
    const el = document.createElement('div');
    el.className = 'user-location-marker';
    el.style.cssText = `
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background-color: #ef4444;
      border: 4px solid white;
      box-shadow: 0 4px 8px rgba(0,0,0,0.4);
      cursor: pointer;
      transition: transform 0.2s ease;
    `;

    // Add hover effect for desktop
    el.addEventListener('mouseenter', () => {
      el.style.transform = 'scale(1.2)';
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = 'scale(1)';
    });

    // Create marker
    this.userLocationMarker = new mapboxgl.Marker(el)
      .setLngLat([longitude, latitude])
      .addTo(this.map);

    // Add popup if text provided (mobile-optimized)
    if (popupText) {
      const popup = new mapboxgl.Popup({ 
        offset: 25,
        closeButton: true,
        closeOnClick: false,
        maxWidth: '300px',
        className: 'custom-popup'
      })
        .setHTML(`
          <div style="font-family: 'Cairo', sans-serif; direction: rtl; font-size: 14px; line-height: 1.4; text-align: right;">
            <div style="background: linear-gradient(135deg, #ef4444, #dc2626); color: white; padding: 8px 12px; border-radius: 8px 8px 0 0; margin: -10px -10px 10px -10px;">
              <strong>📍 موقعك الحالي</strong>
            </div>
            ${popupText}
          </div>
        `);
      
      this.userLocationMarker.setPopup(popup);
    }

    // Center map on user location with smooth animation
    this.map.flyTo({
      center: [longitude, latitude],
      zoom: 16, // Higher zoom for better detail
      essential: true,
      duration: 2000 // Smooth 2-second animation
    });
  }

  // Extract street from geocoding result
  private extractStreet(result: MapboxGeocodeResult): string {
    if (result.context) {
      const street = result.context.find(ctx => 
        ctx.id.startsWith('street') || 
        ctx.id.startsWith('address') ||
        ctx.id.startsWith('poi')
      );
      return street?.text || '';
    }
    return '';
  }

  // Extract city from geocoding result
  private extractCity(result: MapboxGeocodeResult): string {
    if (result.context) {
      const city = result.context.find(ctx => 
        ctx.id.startsWith('place') && 
        !ctx.id.startsWith('place.region')
      );
      return city?.text || '';
    }
    return '';
  }

  // Extract governorate from geocoding result
  private extractGovernorate(result: MapboxGeocodeResult): string {
    if (result.context) {
      const governorate = result.context.find(ctx => 
        ctx.id.startsWith('region') ||
        ctx.id.startsWith('place.region')
      );
      return governorate?.text || '';
    }
    return '';
  }

  // Get the current map instance
  getMap(): mapboxgl.Map | null {
    return this.map;
  }

  // Get the user location marker
  getUserLocationMarker(): mapboxgl.Marker | null {
    return this.userLocationMarker;
  }

  // Clean up map resources
  destroy(): void {
    if (this.userLocationMarker) {
      this.userLocationMarker.remove();
      this.userLocationMarker = null;
    }
    if (this.map) {
      this.map.remove();
      this.map = null;
    }
  }
}

export const mapboxService = new MapboxService();

