import mapboxgl from 'mapbox-gl';
import { EnhancedPlace } from './googlePlacesService';

// Mapbox configuration
const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw';

class GoogleMapboxService {
  private map: mapboxgl.Map | null = null;
  private userLocationMarker: mapboxgl.Marker | null = null;
  private medicalMarkers: mapboxgl.Marker[] = [];

  constructor() {
    if (!mapboxgl.accessToken) {
      mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;
    }
  }

  /**
   * Initialize Mapbox map
   */
  initializeMap(container: string | HTMLElement, options?: Partial<mapboxgl.MapboxOptions>): mapboxgl.Map {
    const defaultOptions: mapboxgl.MapboxOptions = {
      container,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [31.7935447, 31.0748982], // User's exact location
      zoom: 16,
      minZoom: 6,
      maxZoom: 20,
      touchZoomRotate: true,
      doubleClickZoom: true,
      scrollZoom: true,
      boxZoom: false,
      dragRotate: false,
      dragPan: true,
      keyboard: false,
      renderWorldCopies: false
    };

    const mapOptions = { ...defaultOptions, ...options };
    this.map = new mapboxgl.Map(mapOptions);

    // Add detailed labels for better area visibility like Google Maps
    this.map.on('load', () => {
      if (this.map && !this.map.getSource('country-boundaries')) {
        // Add country boundaries
        this.map.addSource('country-boundaries', {
          type: 'vector',
          url: 'mapbox://mapbox.country-boundaries-v1'
        });

        // Add country labels
        this.map.addLayer({
          id: 'country-labels',
          type: 'symbol',
          source: 'country-boundaries',
          'source-layer': 'country_boundaries',
          layout: {
            'text-field': ['get', 'name_en'],
            'text-font': ['Open Sans Regular', 'Arial Unicode MS Regular'],
            'text-size': 12,
            'text-transform': 'uppercase',
            'text-letter-spacing': 0.1
          },
          paint: {
            'text-color': '#666',
            'text-halo-color': '#fff',
            'text-halo-width': 1
          }
        });

        // Add detailed place labels for villages and neighborhoods
        this.map.addLayer({
          id: 'place-labels',
          type: 'symbol',
          source: 'mapbox',
          'source-layer': 'place_label',
          layout: {
            'text-field': ['get', 'name'],
            'text-font': ['Open Sans Regular', 'Arial Unicode MS Regular'],
            'text-size': 11,
            'text-transform': 'none'
          },
          paint: {
            'text-color': '#333',
            'text-halo-color': '#fff',
            'text-halo-width': 1
          }
        });

        // Add locality labels for neighborhoods and villages
        this.map.addLayer({
          id: 'locality-labels',
          type: 'symbol',
          source: 'mapbox',
          'source-layer': 'place_label',
          filter: ['==', ['get', 'class'], 'locality'],
          layout: {
            'text-field': ['get', 'name'],
            'text-font': ['Open Sans Regular', 'Arial Unicode MS Regular'],
            'text-size': 10,
            'text-transform': 'none'
          },
          paint: {
            'text-color': '#555',
            'text-halo-color': '#fff',
            'text-halo-width': 1
          }
        });

        // Add neighborhood labels for detailed areas
        this.map.addLayer({
          id: 'neighborhood-labels',
          type: 'symbol',
          source: 'mapbox',
          'source-layer': 'place_label',
          filter: ['==', ['get', 'class'], 'neighbourhood'],
          layout: {
            'text-field': ['get', 'name'],
            'text-font': ['Open Sans Regular', 'Arial Unicode MS Regular'],
            'text-size': 9,
            'text-transform': 'none'
          },
          paint: {
            'text-color': '#666',
            'text-halo-color': '#fff',
            'text-halo-width': 1
          }
        });

        // Add road labels for better navigation
        this.map.addLayer({
          id: 'road-labels',
          type: 'symbol',
          source: 'mapbox',
          'source-layer': 'road_label',
          layout: {
            'text-field': ['get', 'name'],
            'text-font': ['Open Sans Regular', 'Arial Unicode MS Regular'],
            'text-size': 8,
            'text-transform': 'none'
          },
          paint: {
            'text-color': '#777',
            'text-halo-color': '#fff',
            'text-halo-width': 1
          }
        });
      }
    });

    return this.map;
  }

  /**
   * Get the map instance
   */
  getMap(): mapboxgl.Map | null {
    return this.map;
  }

  /**
   * Add user location marker
   */
  addUserLocationMarker(location: { latitude: number; longitude: number }, title: string = 'موقعك الحالي'): void {
    if (!this.map) return;

    // Remove existing user location marker
    if (this.userLocationMarker) {
      this.userLocationMarker.remove();
    }

    // Create user location marker
    const userLocationEl = document.createElement('div');
    userLocationEl.className = 'user-location-marker';
    userLocationEl.style.cssText = `
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background-color: #3b82f6;
      border: 3px solid #ffffff;
      box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      cursor: pointer;
    `;

    this.userLocationMarker = new mapboxgl.Marker({
      element: userLocationEl,
      anchor: 'center'
    })
      .setLngLat([location.longitude, location.latitude])
      .addTo(this.map);

    // Add popup
    const popup = new mapboxgl.Popup({
      offset: 25,
      closeButton: true,
      closeOnClick: false,
      maxWidth: '300px'
    }).setHTML(`
      <div style="padding: 8px; text-align: center;">
        <div style="font-weight: bold; color: #3b82f6; margin-bottom: 4px;">
          📍 ${title}
        </div>
        <div style="font-size: 12px; color: #666;">
          ${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}
        </div>
        <button onclick="this.parentElement.parentElement.remove()" 
                style="margin-top: 8px; padding: 4px 8px; background: #3b82f6; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;">
          إغلاق
        </button>
      </div>
    `);

    this.userLocationMarker.setPopup(popup);
  }

  /**
   * Get user location marker
   */
  getUserLocationMarker(): mapboxgl.Marker | null {
    return this.userLocationMarker;
  }

  /**
   * Add medical places markers to the map
   */
  addMedicalPlacesMarkers(places: EnhancedPlace[]): void {
    if (!this.map) {
      console.error('Map not initialized');
      return;
    }

    console.log('Adding Google Places markers for places:', places.length);
    console.log('Places data:', places);

    // Clear existing markers
    this.clearMedicalMarkers();

    places.forEach((place, index) => {
      if (!place.latitude || !place.longitude) {
        console.log('Skipping place without coordinates:', place.name);
        return;
      }
      
      console.log(`Adding marker ${index + 1}:`, place.name, 'at', place.latitude, place.longitude);

      // Get marker style based on place type
      const markerStyle = this.getMarkerStyle(place.placeType);
      
      // Create marker element
      const markerEl = document.createElement('div');
      markerEl.className = 'medical-place-marker';
      markerEl.style.cssText = `
        width: 30px;
        height: 30px;
        border-radius: 50%;
        background-color: ${markerStyle.color};
        border: 2px solid #ffffff;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        color: white;
        font-size: 14px;
        cursor: pointer;
        transition: transform 0.2s ease;
      `;
      markerEl.textContent = markerStyle.icon;

      // Add hover effect
      markerEl.addEventListener('mouseenter', () => {
        markerEl.style.transform = 'scale(1.1)';
      });
      markerEl.addEventListener('mouseleave', () => {
        markerEl.style.transform = 'scale(1)';
      });

      // Create marker
      const marker = new mapboxgl.Marker({
        element: markerEl,
        anchor: 'center'
      })
        .setLngLat([place.longitude, place.latitude])
        .addTo(this.map!);

      // Create popup content
      const popupContent = this.createPopupContent(place);
      
      // Add popup
      const popup = new mapboxgl.Popup({
        offset: 25,
        closeButton: true,
        closeOnClick: false,
        maxWidth: '320px'
      }).setHTML(popupContent);

      marker.setPopup(popup);
      this.medicalMarkers.push(marker);
      
      console.log(`Marker added successfully for: ${place.name}`);
    });
    
    console.log(`Total markers added: ${this.medicalMarkers.length}`);

    // Fit map to show all markers if there are places
    if (places.length > 0) {
      this.fitMapToMarkers(places);
    }
  }

  /**
   * Create popup content for a place
   */
  private createPopupContent(place: EnhancedPlace): string {
    const typeIcon = this.getTypeIcon(place.placeType);
    const rating = place.rating ? `⭐ ${place.rating.toFixed(1)} (${place.userRatingsTotal || 0} تقييم)` : 'لا توجد تقييمات';
    const distance = place.distance ? `📍 ${place.distance.toFixed(1)} كم` : '';
    const status = place.isOpen !== undefined ? (place.isOpen ? '🟢 مفتوح الآن' : '🔴 مغلق الآن') : '';
    
    return `
      <div style="padding: 12px; font-family: 'Cairo', sans-serif; direction: rtl;">
        <div style="display: flex; align-items: center; margin-bottom: 8px;">
          <span style="font-size: 18px; margin-left: 8px;">${typeIcon}</span>
          <div>
            <div style="font-weight: bold; color: #1f2937; font-size: 14px; margin-bottom: 2px;">
              ${place.name}
            </div>
            <div style="font-size: 12px; color: #6b7280;">
              ${this.getTypeName(place.placeType)}
            </div>
          </div>
        </div>
        
        <div style="font-size: 12px; color: #4b5563; margin-bottom: 8px; line-height: 1.4;">
          ${place.address}
        </div>
        
        <div style="display: flex; flex-direction: column; gap: 4px; margin-bottom: 12px;">
          ${rating ? `<div style="font-size: 11px; color: #059669;">${rating}</div>` : ''}
          ${distance ? `<div style="font-size: 11px; color: #3b82f6;">${distance}</div>` : ''}
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
   * Get marker style based on place type
   */
  private getMarkerStyle(placeType: string): { icon: string; color: string } {
    switch (placeType) {
      case 'hospital':
        return { icon: 'H', color: '#dc2626' }; // Red
      case 'clinic':
        return { icon: 'C', color: '#059669' }; // Green
      case 'pharmacy':
        return { icon: 'P', color: '#7c3aed' }; // Purple
      case 'emergency':
        return { icon: 'E', color: '#ea580c' }; // Orange
      default:
        return { icon: 'M', color: '#6b7280' }; // Gray
    }
  }

  /**
   * Get type icon for popup
   */
  private getTypeIcon(placeType: string): string {
    switch (placeType) {
      case 'hospital':
        return '🏥';
      case 'clinic':
        return '🏥';
      case 'pharmacy':
        return '💊';
      case 'emergency':
        return '🚨';
      default:
        return '🏥';
    }
  }

  /**
   * Get type name in Arabic
   */
  private getTypeName(placeType: string): string {
    switch (placeType) {
      case 'hospital':
        return 'مستشفى';
      case 'clinic':
        return 'عيادة طبية';
      case 'pharmacy':
        return 'صيدلية';
      case 'emergency':
        return 'طوارئ';
      default:
        return 'مركز طبي';
    }
  }

  /**
   * Clear all medical markers
   */
  clearMedicalMarkers(): void {
    this.medicalMarkers.forEach(marker => marker.remove());
    this.medicalMarkers = [];
  }

  /**
   * Fit map to show all markers
   */
  private fitMapToMarkers(places: EnhancedPlace[]): void {
    if (!this.map || places.length === 0) return;

    const bounds = new mapboxgl.LngLatBounds();
    
    places.forEach(place => {
      bounds.extend([place.longitude, place.latitude]);
    });

    // Add user location to bounds if available
    if (this.userLocationMarker) {
      const userLngLat = this.userLocationMarker.getLngLat();
      bounds.extend([userLngLat.lng, userLngLat.lat]);
    }

    this.map.fitBounds(bounds, {
      padding: 50,
      maxZoom: 16
    });
  }

  /**
   * Fly to a specific location
   */
  flyToLocation(location: { latitude: number; longitude: number }, zoom: number = 16): void {
    if (!this.map) return;

    this.map.flyTo({
      center: [location.longitude, location.latitude],
      zoom: zoom,
      duration: 2000
    });
  }

  /**
   * Destroy the map
   */
  destroy(): void {
    if (this.map) {
      this.map.remove();
      this.map = null;
    }
    this.clearMedicalMarkers();
    if (this.userLocationMarker) {
      this.userLocationMarker.remove();
      this.userLocationMarker = null;
    }
  }
}

// Export singleton instance
export const googleMapboxService = new GoogleMapboxService();
export default GoogleMapboxService;
