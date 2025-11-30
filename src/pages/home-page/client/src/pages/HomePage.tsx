import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../components/EmergencyLoadingScreen.css";
import "../index.css";
import {
  MapPin,
  Heart,
  Phone,
  ArrowRight,
  Clock,
  Stethoscope,
  Hospital as HospitalIcon,
  Mail,
  MessageCircle,
  MapIcon,
  Building,
  Settings,
  BarChart3,
  AlertTriangle,
  Bandage,
  HeartHandshake,
  UserCheck,
  PhoneCall,
  Pill,
  Building2,
  Droplets,
  Apple,
  Activity,
  Moon,
  Smile,
  ClipboardCheck,
  ChevronDown,
  ChevronUp,
  FileText,
  Shield,
  BookOpen,
  Users,
  Bell,
} from "lucide-react";
import MedicalCenterCard from "../components/MedicalCenterCard";
import HorizontalScroll from "../components/HorizontalScroll";
import HeartbeatLine from "../components/HeartbeatLine";
import SearchLocationButton from "../components/SearchLocationButton";
import LocationPermissionModal from "../components/LocationPermissionModal";
import LocationSuccessMessage from "../components/LocationSuccessMessage";
import LocationLoadingMessage from "../components/LocationLoadingMessage";
import GoogleMapsComponent from "../components/GoogleMapsComponent";
import MedicalPlacesList from "../components/MedicalPlacesList";
import DynamicLocationDetector from "../components/DynamicLocationDetector";
import RadiusSelectorWithLoading from "../components/RadiusSelectorWithLoading";
import AddressDisplayModal from "../components/AddressDisplayModal";
import MedicalLocationDetector from "../components/MedicalLocationDetector";
import EnhancedAddressModal from "../components/EnhancedAddressModal";
import MedicalSearchLoading from "../components/MedicalSearchLoading";
import MedicalResultsSection from "../components/MedicalResultsSection";
import { MedicalCenter } from "../types";
import { locationAPI } from "../services/api";
import { geocodingService } from "../services/geocoding";
import { mapboxService, MapboxLocationResult } from "../services/mapboxService";
import {
  googleMapsService,
  LocationData,
  PlaceDetails,
  GeocodeResult,
} from "../services/googleMapsService";
import { egyptianHospitals } from "../data/egyptianHospitals";
import coverImage from "../../../../../assets/cover.jpg";

const HomePage: React.FC = () => {
  const [nearestCenters, setNearestCenters] = useState<MedicalCenter[]>([]);
  const [loading, setLoading] = useState(false);
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [mapboxLocation, setMapboxLocation] =
    useState<MapboxLocationResult | null>(null);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [showLocationSuccess, setShowLocationSuccess] = useState(false);
  const [showLocationLoading, setShowLocationLoading] = useState(false);
  const [showMapboxMap, setShowMapboxMap] = useState(false);
  const [locationDetails, setLocationDetails] = useState<{
    placeName: string;
    city: string;
    district: string;
    governorate: string;
    detailedArea?: string;
    neighborhood?: string;
    street?: string;
  }>({ placeName: "", city: "", district: "", governorate: "" });
  const [hasShownSuccess, setHasShownSuccess] = useState(false);
  const [selectedFacilityType, setSelectedFacilityType] = useState<
    "all" | "hospitals" | "pharmacies" | "clinics"
  >("all");
  const [filteredCenters, setFilteredCenters] = useState<MedicalCenter[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [mapPlaces, setMapPlaces] = useState<PlaceDetails[]>([]);
  const [useDynamicLocation, setUseDynamicLocation] = useState(false);
  const [showRadiusSelector, setShowRadiusSelector] = useState(false);
  const [selectedRadius, setSelectedRadius] = useState<number | null>(null);
  const [showAddressDisplay, setShowAddressDisplay] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [showMedicalLocationDetector, setShowMedicalLocationDetector] =
    useState(false);
  const [showEnhancedAddress, setShowEnhancedAddress] = useState(false);
  const [showMedicalSearchLoading, setShowMedicalSearchLoading] =
    useState(false);
  const [searchCompleted, setSearchCompleted] = useState(false);
  const [openSection, setOpenSection] = useState<string | null>(null);

  // Debug: Log mapPlaces changes
  useEffect(() => {
    if (mapPlaces.length > 0) {
      // Map places updated
    }
  }, [mapPlaces]);

  // Filter centers based on selected facility type and search query
  useEffect(() => {
    let filtered: MedicalCenter[];

    // First filter by facility type
    if (selectedFacilityType === "all") {
      filtered = nearestCenters;
    } else {
      filtered = nearestCenters.filter((center) => {
        switch (selectedFacilityType) {
          case "hospitals":
            return center.type === "hospital";
          case "pharmacies":
            return center.type === "pharmacy";
          case "clinics":
            return center.type === "clinic";
          default:
            return true;
        }
      });
    }

    // Then filter by search query if provided
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (center) =>
          center.name.toLowerCase().includes(query) ||
          center.address.toLowerCase().includes(query) ||
          center.governorate.toLowerCase().includes(query) ||
          center.city.toLowerCase().includes(query) ||
          center.services.some((service) =>
            service.toLowerCase().includes(query)
          )
      );
    }

    setFilteredCenters(filtered);

    // Update map places to show only filtered results
    const filteredMapPlaces = filtered.map((center) => {
      let types = ["hospital"];
      if (center.type === "pharmacy") {
        types = ["pharmacy", "drugstore"];
      } else if (center.type === "clinic") {
        types = ["doctor", "health"];
      }

      return {
        placeId: center._id,
        name: center.name,
        address: center.address,
        latitude: center.location.coordinates[1],
        longitude: center.location.coordinates[0],
        rating: center.rating || 0,
        userRatingsTotal: 0,
        isOpen: true,
        types: types,
        distance: center.distance || 0,
        travelTime: "غير محدد",
      };
    });

    setMapPlaces(filteredMapPlaces);
  }, [nearestCenters, selectedFacilityType, searchQuery]);

  // Monitor when both map and data are loaded and results are displayed
  useEffect(() => {
    if (
      mapLoaded &&
      dataLoaded &&
      (nearestCenters.length > 0 || mapPlaces.length > 0)
    ) {
      // Wait a bit for results to actually appear on screen before hiding loading
      setTimeout(() => {
        setShowMedicalSearchLoading(false);
        setLoading(false);
      }, 1000); // Give time for results to render
    }
  }, [
    mapLoaded,
    dataLoaded,
    loading,
    showMedicalSearchLoading,
    nearestCenters.length,
    mapPlaces.length,
  ]);

  // Force hide medical search loading after maximum time
  useEffect(() => {
    if (showMedicalSearchLoading) {
      const timeout = setTimeout(() => {
        setShowMedicalSearchLoading(false);
        setLoading(false);
        setDataLoaded(true);
        setMapLoaded(true);
        setSearchCompleted(true); // Mark search as completed

        // If no results found, try to use fallback data
        if (
          nearestCenters.length === 0 &&
          mapPlaces.length === 0 &&
          userLocation
        ) {
          const fallbackCenters = egyptianHospitals
            .map((hospital) => ({
              ...hospital,
              distance: calculateDistance(
                userLocation.latitude,
                userLocation.longitude,
                hospital.location.coordinates[1],
                hospital.location.coordinates[0]
              ),
            }))
            .filter((hospital) => hospital.distance <= (selectedRadius || 20))
            .sort((a, b) => a.distance - b.distance)
            .slice(0, 10); // Limit to 10 results

          if (fallbackCenters.length > 0) {
            setNearestCenters(fallbackCenters);

            const fallbackMapPlaces = fallbackCenters.map((center) => ({
              placeId: center._id,
              name: center.name,
              address: center.address,
              latitude: center.location.coordinates[1],
              longitude: center.location.coordinates[0],
              rating: center.rating || 0,
              userRatingsTotal: 0,
              isOpen: true,
              types: center.services || ["hospital"],
              distance: center.distance || 0,
              travelTime: "غير محدد",
            }));
            setMapPlaces(fallbackMapPlaces);
          }
        }
      }, 10000); // 10 seconds maximum

      return () => clearTimeout(timeout);
    }
  }, [
    showMedicalSearchLoading,
    nearestCenters.length,
    mapPlaces.length,
    userLocation,
    selectedRadius,
  ]);

  // Load Google Maps API on component mount
  React.useEffect(() => {
    const loadGoogleMapsScript = () => {
      if (
        typeof window !== "undefined" &&
        (window as any).google &&
        (window as any).google.maps
      ) {        return;
      }

      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyAMKNzEGcjceP1HtmaphYjhTfr0BGMGnE0&libraries=places&language=ar&region=eg`;
      script.async = true;
      script.defer = true;

      script.onload = () => {};

      script.onerror = () => {};

      document.head.appendChild(script);
    };

    loadGoogleMapsScript();
  }, []);

  // لا نعرض رسالة طلب الإذن تلقائياً عند تحميل الصفحة
  // بدلاً من ذلك، المستخدم يمكنه النقر على زر البحث لتفعيل الموقع
  React.useEffect(() => {
    // Removed automatic permission modal display
    // User can trigger location detection by clicking the search button
  }, []);

  const handleLocationDetected = async (location: {
    latitude: number;
    longitude: number;
  }) => {
    setUserLocation(location);

    try {
      // الحصول على تفاصيل المكان من الإحداثيات
      const geocodeResult = await geocodingService.reverseGeocode(
        location.latitude,
        location.longitude
      );
      setLocationDetails({
        placeName: geocodeResult.placeName,
        city: geocodeResult.city,
        district: geocodeResult.district,
        governorate: geocodeResult.governorate,
      });

      // إخفاء رسالة التحميل
      setShowLocationLoading(false);

      // عرض رسالة النجاح مرة واحدة فقط
      if (!hasShownSuccess) {
        setShowLocationSuccess(true);
        setHasShownSuccess(true);

        // إخفاء رسالة النجاح تلقائياً بعد 6 ثوان
        setTimeout(() => {
          setShowLocationSuccess(false);
        }, 6000);
      }

      // فتح الخريطة التفاعلية مباشرة بعد تحديد الموقع
      setShowMapboxMap(true);
      // تمرير الموقع إلى الخريطة التفاعلية مباشرة
      const mapboxLocation: MapboxLocationResult = {
        latitude: location.latitude,
        longitude: location.longitude,
        address: geocodeResult.placeName,
        street: geocodeResult.district,
        city: geocodeResult.city,
        governorate: geocodeResult.governorate,
        country: "Egypt",
        accuracy: undefined,
      };
      // تمرير الموقع بعد تحميل الخريطة
      setTimeout(() => {
        handleGooglePlacesLocationDetected({
          latitude: mapboxLocation.latitude,
          longitude: mapboxLocation.longitude,
        });
      }, 1000);

      // لا نقوم بالبحث التلقائي - سننتظر اختيار المستخدم للنطاق
      // سيتم البحث من خلال GoogleMapsComponent بعد اختيار النطاق
    } catch (error) {
      setLoading(false);
      setShowLocationLoading(false);
    }
  };

  const handlePermissionAccept = () => {
    setShowPermissionModal(false);
    setShowMedicalLocationDetector(true); // استخدام المكون الجديد
  };

  const handleMedicalLocationDetected = async (location: {
    latitude: number;
    longitude: number;
  }) => {
    setShowMedicalLocationDetector(false);
    setUserLocation(location);

    // Get address details and show enhanced address modal
    try {
      const geocodeResult = await geocodingService.reverseGeocode(
        location.latitude,
        location.longitude
      );
      setLocationDetails({
        placeName: geocodeResult.placeName || "موقع غير محدد",
        city: geocodeResult.city || "مدينة غير محددة",
        district: geocodeResult.district || "مركز غير محدد",
        governorate: geocodeResult.governorate || "محافظة غير محددة",
        detailedArea: geocodeResult.detailedArea,
        neighborhood: geocodeResult.neighborhood,
        street: geocodeResult.street,
      });
      setShowEnhancedAddress(true);
    } catch (error) {
      // Show default address
      setLocationDetails({
        placeName: "موقع غير محدد",
        city: "مدينة غير محددة",
        district: "مركز غير محدد",
        governorate: "محافظة غير محددة",
      });
      setShowEnhancedAddress(true);
    }
  };

  const handleMedicalLocationError = (error: string) => {
    setShowMedicalLocationDetector(false);
    alert(`خطأ في تحديد الموقع: ${error}`);
  };

  const handleCancelLocationDetection = () => {
    setShowMedicalLocationDetector(false);
    setUserLocation(null);
    setMapboxLocation(null);
    setNearestCenters([]);
    setMapPlaces([]);
    setShowMapboxMap(false);
    setLoading(false);
    setDataLoaded(false);
    setMapLoaded(false);
    setSearchCompleted(false);
  };

  const handleDynamicLocationDetected = async (location: {
    latitude: number;
    longitude: number;
  }) => {
    setUseDynamicLocation(false);
    setUserLocation(location);

    // Get address details and show address display modal
    try {
      const geocodeResult = await geocodingService.reverseGeocode(
        location.latitude,
        location.longitude
      );
      setLocationDetails({
        placeName: geocodeResult.placeName || "موقع غير محدد",
        city: geocodeResult.city || "مدينة غير محددة",
        district: geocodeResult.district || "مركز غير محدد",
        governorate: geocodeResult.governorate || "محافظة غير محددة",
        detailedArea: geocodeResult.detailedArea,
        neighborhood: geocodeResult.neighborhood,
        street: geocodeResult.street,
      });
      setShowAddressDisplay(true);
    } catch (error) {
      // Show default address
      setLocationDetails({
        placeName: "موقع غير محدد",
        city: "مدينة غير محددة",
        district: "مركز غير محدد",
        governorate: "محافظة غير محددة",
      });
      setShowAddressDisplay(true);
    }
  };

  const handleDynamicLocationError = (error: string) => {
    setUseDynamicLocation(false);
    setShowLocationLoading(false);
    alert(`خطأ في تحديد الموقع: ${error}`);
  };

  // Handle Mapbox location detection
  const handleGooglePlacesLocationDetected = async (location: {
    latitude: number;
    longitude: number;
  }) => {
    setUserLocation(location);

    // Get address using geocoding
    try {
      const geocodeResult = await geocodingService.reverseGeocode(
        location.latitude,
        location.longitude
      );
      setLocationDetails({
        placeName: geocodeResult.placeName,
        city: geocodeResult.city,
        district: geocodeResult.district,
        governorate: geocodeResult.governorate,
        detailedArea: geocodeResult.detailedArea,
        neighborhood: geocodeResult.neighborhood,
        street: geocodeResult.street,
      });
    } catch (error) {
      console.error("Error handling address continue:", error);
    }

    // Hide loading and show success
    setShowLocationLoading(false);
    setShowLocationSuccess(true);
    setHasShownSuccess(true);

    // Auto-navigate to map after a short delay
    setTimeout(() => {
      setShowMapboxMap(true);
      // Scroll to map section
      const mapSection = document.getElementById("interactive-map-section");
      if (mapSection) {
        mapSection.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 2000); // 2 seconds delay to show success message first
  };

  const handleGooglePlacesFound = (places: PlaceDetails[]) => {
    // ترتيب الأماكن حسب المسافة من الأقرب للأبعد
    const sortedPlaces = userLocation
      ? googleMapsService.sortPlacesByDistance(userLocation, places)
      : places;
    // Convert to MedicalCenter format for compatibility
    const centers: MedicalCenter[] = sortedPlaces.map((place) => ({
      _id: place.placeId,
      name: place.name,
      type: place.types.includes("hospital")
        ? "hospital"
        : place.types.includes("pharmacy")
        ? "pharmacy"
        : "clinic",
      governorate: locationDetails.governorate || "",
      city: locationDetails.city || "",
      address: place.address,
      location: {
        type: "Point" as const,
        coordinates: [place.longitude, place.latitude],
      },
      phone: undefined,
      emergencyPhone: undefined,
      services: [],
      distance: place.distance,
      isActive: true,
    }));
    setNearestCenters(centers);
    setMapPlaces(sortedPlaces);
  };

  const handlePermissionDecline = () => {
    setShowPermissionModal(false);
    // Show a message that location is required
    alert(
      "نحتاج إلى تحديد موقعك للعثور على أقرب المستشفيات. يرجى إعادة تحميل الصفحة والسماح بتحديد الموقع."
    );
  };

  // دالة خاصة للبحث عن الصيدليات فقط
  const searchPharmaciesOnly = async () => {
    if (!userLocation) return;

    setLoading(true);
    try {
      // البحث عن الصيدليات فقط في نطاق 30 كم
      const pharmacies = await googleMapsService.searchNearbyPharmacies(
        userLocation,
        30000
      );

      // ترتيب الصيدليات حسب المسافة
      const sortedPharmacies = googleMapsService.sortPlacesByDistance(
        userLocation,
        pharmacies
      );

      // حفظ الصيدليات في state
      setMapPlaces(sortedPharmacies);

      // تحويل الصيدليات إلى تنسيق MedicalCenter للتوافق مع باقي النظام
      const centers: MedicalCenter[] = sortedPharmacies.map((place) => ({
        _id: place.placeId,
        name: place.name,
        type: "pharmacy",
        governorate: locationDetails.governorate || "",
        city: locationDetails.city || "",
        address: place.address,
        location: {
          type: "Point" as const,
          coordinates: [place.longitude, place.latitude],
        },
        phone: undefined,
        emergencyPhone: undefined,
        services: [],
        distance: place.distance,
        isActive: true,
      }));

      setNearestCenters(centers);
      setSelectedFacilityType("pharmacies");
    } catch (error) {
      console.error("Error getting pharmacies:", error);
    } finally {
      setLoading(false);
    }
  };

  // إعادة تحميل المرافق عند تغيير النوع
  const handleFacilityTypeChange = async (
    type: "all" | "hospitals" | "pharmacies" | "clinics"
  ) => {
    setSelectedFacilityType(type);
    if (userLocation) {
      setLoading(true);
      try {
        // البحث عن المراكز الطبية القريبة باستخدام Google Maps API (نطاق 30 كم)
        const places = await googleMapsService.searchNearbyMedicalPlaces(
          {
            latitude: userLocation.latitude,
            longitude: userLocation.longitude,
          },
          30000
        ); // 30 كم = 30000 متر

        // تصفية الأماكن حسب النوع المحدد
        let placesToShow: PlaceDetails[] = [];
        if (type === "all") {
          placesToShow = places;
        } else if (type === "hospitals") {
          placesToShow = places.filter(
            (place) =>
              place.types.includes("hospital") || place.types.includes("health")
          );
        } else if (type === "clinics") {
          placesToShow = places.filter(
            (place) =>
              place.types.includes("doctor") || place.types.includes("clinic")
          );
        } else if (type === "pharmacies") {
          placesToShow = places.filter(
            (place) =>
              place.types.includes("pharmacy") ||
              place.types.includes("drugstore")
          );
        }

        // ترتيب الأماكن حسب المسافة من الأقرب للأبعد
        placesToShow = googleMapsService.sortPlacesByDistance(
          userLocation,
          placesToShow
        );

        // حفظ الأماكن في state
        setMapPlaces(placesToShow);

        // تحويل الأماكن إلى تنسيق MedicalCenter للتوافق مع باقي النظام
        const centers: MedicalCenter[] = placesToShow.map((place) => ({
          _id: place.placeId,
          name: place.name,
          type: place.types.includes("hospital")
            ? "hospital"
            : place.types.includes("pharmacy")
            ? "pharmacy"
            : "clinic",
          governorate: locationDetails.governorate || "",
          city: locationDetails.city || "",
          address: place.address,
          location: {
            type: "Point" as const,
            coordinates: [place.longitude, place.latitude],
          },
          phone: undefined,
          emergencyPhone: undefined,
          services: [],
          distance: place.distance,
          isActive: true,
        }));

        setNearestCenters(centers);
      } catch (error) {
        console.error("Error getting google places:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleAddressContinue = () => {
    setShowAddressDisplay(false);
    setShowEnhancedAddress(false);
    setShowRadiusSelector(true); // إظهار اختيار النطاق
    setSearchCompleted(false); // Reset search completed state
  };

  const handleRadiusSelect = (radius: number) => {
    setSelectedRadius(radius);
    setShowRadiusSelector(false);
    setShowMedicalSearchLoading(true); // إظهار شاشة التحميل الطبية
    setSearchCompleted(false); // Reset search completed state

    // Start searching for hospitals with the selected radius immediately
    if (userLocation) {
      // Use setTimeout to ensure UI updates first
      setTimeout(() => {
        searchHospitals(userLocation.latitude, userLocation.longitude, radius);
      }, 100);
    } else {
      setShowMedicalSearchLoading(false);
      alert("خطأ: لم يتم تحديد الموقع. يرجى المحاولة مرة أخرى.");
    }
  };

  const handleLoadingComplete = () => {
    // Loading completed, hide success message and scroll to map
    setShowLocationSuccess(false);
    setShowMedicalSearchLoading(false);
    setSearchCompleted(true);
    setLoading(false); // Ensure loading is set to false
    setDataLoaded(true); // Ensure data is marked as loaded
    setMapLoaded(true); // Ensure map is marked as loaded
    setShowMapboxMap(true); // Show the interactive map and results section
    
    // Scroll to results section after a short delay
    setTimeout(() => {
      const mapSection = document.getElementById("interactive-map-section");
      if (mapSection) {
        mapSection.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 300);
  };

  const handleCancelSearch = () => {
    setShowMedicalSearchLoading(false);
    setLoading(false);
    setSearchCompleted(false);
    setNearestCenters([]);
    setMapPlaces([]);
    setDataLoaded(false);
    setMapLoaded(false);

    // Show map immediately
    setShowMapboxMap(true);

    // Wait a bit more to ensure results are displayed
    setTimeout(() => {
      const mapSection = document.getElementById("interactive-map-section");
      if (mapSection) {
        mapSection.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 500);
  };

  const handleMapLoaded = () => {
    setMapLoaded(true);
  };

  // Function to calculate distance between two points
  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in kilometers
  };

  const searchHospitals = async (
    lat: number,
    lng: number,
    radiusKm: number
  ) => {
    setLoading(true);
    setDataLoaded(false);
    setMapLoaded(false);
    setSearchCompleted(false); // Reset search completed state

    try {
      // Check if Google Maps API is loaded
      if (
        typeof window === "undefined" ||
        !(window as any).google ||
        !(window as any).google.maps
      ) {
        // Wait for Google Maps API to load
        await new Promise((resolve) => {
          const checkAPI = () => {
            if (
              typeof window !== "undefined" &&
              (window as any).google &&
              (window as any).google.maps
            ) {
              resolve(true);
            } else {
              setTimeout(checkAPI, 500);
            }
          };
          checkAPI();
        });
      }

      // Initialize a temporary map for searching if not already initialized
      if (!googleMapsService.getMap()) {
        const tempMapContainer = document.createElement("div");
        tempMapContainer.style.display = "none";
        document.body.appendChild(tempMapContainer);

        try {
          googleMapsService.initializeMap(
            tempMapContainer,
            {
              latitude: lat,
              longitude: lng,
            },
            15
          );
        } catch (error) {
          document.body.removeChild(tempMapContainer);
        }
      }

      const radiusMeters = radiusKm * 1000;
      const places = await googleMapsService.searchNearbyMedicalPlaces(
        {
          latitude: lat,
          longitude: lng,
        },
        radiusMeters
      );
      let centers: MedicalCenter[] = [];

      // Use Google Maps results if available
      if (places.length > 0) {
        centers = places
          .filter((place) => {
            // Filter out non-medical places first
            const name = place.name.toLowerCase();
            return !(
              name.includes("محطة") ||
              name.includes("معالجة") ||
              name.includes("صرف") ||
              name.includes("مياه") ||
              name.includes("شركة") ||
              name.includes("أدوات") ||
              name.includes("سيراميك") ||
              name.includes("رفع")
            );
          })
          .map((place) => {
            // Determine type based on place types and name
            let type = "hospital";

            // Check place name for specific keywords
            const name = place.name.toLowerCase();

            if (
              name.includes("صيدلية") ||
              name.includes("pharmacy") ||
              name.includes("دواء") ||
              place.types.includes("pharmacy") ||
              place.types.includes("drugstore")
            ) {
              type = "pharmacy";
            } else if (
              name.includes("عيادة") ||
              name.includes("مركز طبي") ||
              name.includes("مركز صحي") ||
              name.includes("عيادة طبية") ||
              name.includes("عيادات") ||
              place.types.includes("doctor") ||
              place.types.includes("physiotherapist")
            ) {
              type = "clinic";
            } else if (
              name.includes("مستشفى") ||
              name.includes("hospital") ||
              place.types.includes("hospital")
            ) {
              type = "hospital";
            } else {
              // Default to clinic for medical facilities that don't match specific criteria
              type = "clinic";
            }

            // Calculate distance if not provided
            const distance =
              place.distance ||
              calculateDistance(lat, lng, place.latitude, place.longitude);

            return {
              _id: place.placeId,
              name: place.name,
              address: place.address || "عنوان غير محدد",
              phone: "غير متوفر",
              distance: distance,
              rating: place.rating || 0,
              type: type as "hospital" | "pharmacy" | "clinic",
              governorate: "غير محدد",
              city: "غير محدد",
              location: {
                type: "Point" as const,
                coordinates: [place.longitude, place.latitude] as [
                  number,
                  number
                ],
              },
              services:
                type === "pharmacy" ? ["صيدلية"] : ["طوارئ", "عيادات خارجية"],
              isActive: true,
            };
          })
          .filter((center) => center.distance <= radiusKm) // Ensure results are within the selected radius
          .sort((a, b) => a.distance - b.distance); // Sort by distance from closest to farthest

      } else {
        // Fallback to Egyptian hospitals data only if no Google results
        console.log("⚠️ No results from Google Maps, using fallback data...");
        centers = egyptianHospitals
          .map((hospital) => ({
            ...hospital,
            distance: calculateDistance(
              lat,
              lng,
              hospital.location.coordinates[1],
              hospital.location.coordinates[0]
            ),
          }))
          .filter((hospital) => hospital.distance <= radiusKm)
          .sort((a, b) => a.distance - b.distance)
          .slice(0, 10); // Reduced limit for fallback
      }

      setNearestCenters(centers);

      // Convert centers to map places for display
      const mapPlacesForDisplay = centers.map((center) => {
        // Map center type to Google Maps types
        let types = ["hospital"];
        if (center.type === "pharmacy") {
          types = ["pharmacy", "drugstore"];
        } else if (center.type === "clinic") {
          types = ["doctor", "health"];
        }

        return {
          placeId: center._id,
          name: center.name,
          address: center.address,
          latitude: center.location.coordinates[1],
          longitude: center.location.coordinates[0],
          rating: center.rating || 0,
          userRatingsTotal: 0,
          isOpen: true,
          types: types,
          distance: center.distance || 0,
          travelTime: "غير محدد",
        };
      });

      setMapPlaces(mapPlacesForDisplay);

      // Mark data as loaded
      setDataLoaded(true);
      // Show map immediately
      setShowMapboxMap(true);

      // If we have results, set map as loaded immediately
      if (centers.length > 0) {
        setMapLoaded(true);
        setDataLoaded(true); // Mark data as loaded
        // Don't stop loading yet - wait for map to actually display results
        setSearchCompleted(true); // Mark search as completed to show results
        // Don't hide medical search loading yet - wait for results to appear
      } else {
        setLoading(false);
        setDataLoaded(true); // Mark data as loaded
        setMapLoaded(true); // Still mark map as loaded even with no results
        setSearchCompleted(true); // Mark search as completed even with no results
        setShowMedicalSearchLoading(false); // Hide medical search loading

        // Show a message to user about no results
        setTimeout(() => {
          alert(
            `لم يتم العثور على مراكز طبية في نطاق ${radiusKm} كم من موقعك. جرب نطاق أكبر.`
          );
        }, 500);
      }

      // Force completion after maximum wait time (shorter for larger radius)
      const maxWaitTime = radiusKm > 20 ? 3000 : radiusKm > 10 ? 4000 : 5000;
      setTimeout(() => {
        if (loading || showMedicalSearchLoading) {
          setLoading(false);
          setMapLoaded(true);
          setSearchCompleted(true); // Mark search as completed
          setShowMedicalSearchLoading(false); // Force hide medical search loading

          // If no results found, try to use fallback data
          if (nearestCenters.length === 0 && mapPlaces.length === 0) {
            const fallbackCenters = egyptianHospitals
              .map((hospital) => ({
                ...hospital,
                distance: calculateDistance(
                  lat,
                  lng,
                  hospital.location.coordinates[1],
                  hospital.location.coordinates[0]
                ),
              }))
              .filter((hospital) => hospital.distance <= radiusKm)
              .sort((a, b) => a.distance - b.distance)
              .slice(0, 10); // Limit to 10 results

            if (fallbackCenters.length > 0) {
              setNearestCenters(fallbackCenters);

              const fallbackMapPlaces = fallbackCenters.map((center) => ({
                placeId: center._id,
                name: center.name,
                address: center.address,
                latitude: center.location.coordinates[1],
                longitude: center.location.coordinates[0],
                rating: center.rating || 0,
                userRatingsTotal: 0,
                isOpen: true,
                types: center.services || ["hospital"],
                distance: center.distance || 0,
                travelTime: "غير محدد",
              }));

              setMapPlaces(fallbackMapPlaces);
            }
          }
        }
      }, maxWaitTime); // Dynamic maximum wait time based on radius
    } catch (error) {
      console.error("Error searching hospitals:", error);
      setLoading(false);
      setDataLoaded(true);
      setMapLoaded(true);
      setSearchCompleted(true);
      setShowMedicalSearchLoading(false);
      
      setTimeout(() => {
        alert("حدث خطأ في البحث عن المراكز الطبية. يرجى المحاولة مرة أخرى.");
      }, 500);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Animated Search Location Button */}
      <SearchLocationButton
        onClick={() => setShowPermissionModal(true)}
        hasLocation={!!userLocation}
      />

      {/* Location Permission Modal */}
      <LocationPermissionModal
        isOpen={showPermissionModal}
        onAllow={handlePermissionAccept}
        onDeny={handlePermissionDecline}
      />

      {/* Address Display Modal */}
      <AddressDisplayModal
        isOpen={showAddressDisplay}
        address={locationDetails}
        onContinue={handleAddressContinue}
      />

      {/* Radius Selector with Loading */}
      {showRadiusSelector && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/20 backdrop-blur-md bg-opacity-50 p-4">
              <RadiusSelectorWithLoading
                onRadiusSelect={handleRadiusSelect}
                onLoadingComplete={handleLoadingComplete}
                isLoading={loading}
              />
            </div>
      )}

      {/* Medical Location Detector */}
      {showMedicalLocationDetector && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/20 backdrop-blur-md bg-opacity-50 p-4">
          <MedicalLocationDetector
            onLocationDetected={handleMedicalLocationDetected}
            onError={handleMedicalLocationError}
            onCancel={handleCancelLocationDetection}
            className="max-w-lg w-full"
          />
        </div>
      )}

      {/* Enhanced Address Modal */}
      <EnhancedAddressModal
        isOpen={showEnhancedAddress}
        address={locationDetails}
        onContinue={handleAddressContinue}
      />

      {/* Medical Search Loading */}
      <MedicalSearchLoading
        isVisible={showMedicalSearchLoading}
        onComplete={handleLoadingComplete}
        onCancel={handleCancelSearch}
        radius={selectedRadius || 10}
        isLoading={loading}
        dataLoaded={dataLoaded}
        mapLoaded={mapLoaded}
        hasResults={nearestCenters.length > 0}
      />

      {/* Dynamic Location Detector */}
      {useDynamicLocation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/20 backdrop-blur-md bg-opacity-50 p-4">
          <DynamicLocationDetector
            onLocationDetected={handleDynamicLocationDetected}
            onError={handleDynamicLocationError}
            className="max-w-md w-full"
          />
        </div>
      )}

      {/* Location Loading Message */}
      <LocationLoadingMessage isVisible={showLocationLoading} />

      {/* Location Success Message */}
      {userLocation && (
        <LocationSuccessMessage
          location={userLocation}
          locationDetails={locationDetails}
          isVisible={showLocationSuccess}
          onHide={() => setShowLocationSuccess(false)}
          onRefresh={() => {
            // إعادة تعيين حالة النجاح للسماح بإظهار الرسالة مرة أخرى
            setHasShownSuccess(false);
            setShowLocationLoading(true);
            if (navigator.geolocation) {
              navigator.geolocation.getCurrentPosition(
                (position) => {
                  const location = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                  };
                  handleLocationDetected(location);
                },
                (error) => {
                  setShowLocationLoading(false);
                  alert("لم نتمكن من تحديد موقعك. يرجى المحاولة مرة أخرى.");
                }
              );
            }
          }}
        />
      )}

      {/* Hero Section - قسم البحث عن أقرب مستشفى */}
      <section
        id="home"
        className="bg-gradient-to-br from-red-600 via-red-700 to-red-900 text-white relative overflow-hidden pt-28 pb-16"
      >
        <div className="absolute inset-0">
          <div className="absolute top-12 left-16 w-24 h-24 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-16 right-20 w-40 h-40 bg-red-400/10 rounded-full blur-3xl animate-pulse delay-300"></div>
          <div className="absolute top-1/2 left-1/3 w-20 h-20 bg-white/5 rounded-full blur-2xl animate-pulse delay-700"></div>
        </div>
        <div className="absolute inset-0 bg-black/20"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="bg-white/10 backdrop-blur-lg border border-white/10 rounded-3xl shadow-2xl p-6 md:p-10">
            <div className="grid md:grid-cols-2 gap-10 lg:gap-16 items-center">
              {/* Image */}
              <div className="order-1 md:order-2 flex justify-center animate-slideInLeft">
                <div className="relative group">
                  <div className="absolute -inset-4 bg-gradient-to-r from-red-400 to-pink-600 rounded-full blur-2xl opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
                  <div className="absolute inset-0 rounded-full animate-spin-slow">
                    <div className="absolute top-0 left-1/2 w-3 h-3 bg-white rounded-full -translate-x-1/2"></div>
                    <div className="absolute bottom-0 left-1/2 w-3 h-3 bg-red-300 rounded-full -translate-x-1/2"></div>
                    <div className="absolute left-0 top-1/2 w-3 h-3 bg-red-200 rounded-full -translate-y-1/2"></div>
                    <div className="absolute right-0 top-1/2 w-3 h-3 bg-white rounded-full -translate-y-1/2"></div>
                  </div>
                  <div className="relative w-72 h-72 md:w-80 md:h-80 lg:w-[420px] lg:h-[420px] rounded-full overflow-hidden shadow-2xl border-4 border-white/30 transform group-hover:scale-105 transition-all duration-700 animate-float">
                    <img
                      src={coverImage}
                      alt="البحث عن أقرب مستشفى في مصر"
                      className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-red-900/20"></div>
                  </div>
                  <div className="absolute inset-4 rounded-full ring-2 ring-white/20 ring-offset-4 ring-offset-transparent animate-pulse"></div>
                  <div className="absolute -inset-2 rounded-full ring-2 ring-white/10 animate-ping-slow"></div>
                </div>
              </div>

              {/* Text */}
              <div className="order-2 md:order-1 text-center md:text-right space-y-4 animate-slideInRight">
                <p className="text-base md:text-lg text-red-100 font-semibold tracking-wide">
                  بسم الله الرحمن الرحيم
                </p>
                <p className="text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-relaxed">
                  "وَإِذَا مَرِضْتُ فَهُوَ يَشْفِينِ"
                </p>
                <p className="text-sm md:text-base text-red-100">
                  سورة الشعراء - الآية 80
                </p>

                <div className="pt-2 space-y-2">
                  <h1 className="text-3xl md:text-4xl font-bold text-white">
                    اكتشف أقرب مستشفى
                  </h1>
                  <h2 className="text-2xl md:text-3xl text-red-200 font-bold">
                    في مصر
                  </h2>
                </div>

                <p className="text-base md:text-lg text-red-100 leading-relaxed">
                  حدد موقعك واعثر على أقرب مستشفى أو مركز طبي مع معلومات شاملة
                </p>

                <div className="flex items-center justify-center md:justify-start gap-3 text-white pt-2">
                  <Heart className="w-6 h-6 animate-heartbeat" fill="currentColor" />
                  <span className="text-lg font-semibold">الشافي هو الله</span>
                  <Heart className="w-6 h-6 animate-heartbeat delay-300" fill="currentColor" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Health Tips Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              نصائح صحية مهمة
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              اتبع هذه النصائح للحفاظ على صحتك وصحة عائلتك
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-t-4 border-blue-500">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mb-4 mx-auto">
                <Droplets className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3 text-center">
                اشرب الماء بانتظام
              </h3>
              <p className="text-gray-700 text-center leading-relaxed">
                احرص على شرب 8 أكواب من الماء يومياً للحفاظ على رطوبة الجسم
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-t-4 border-green-500">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-4 mx-auto">
                <Apple className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3 text-center">
                تناول غذاء متوازن
              </h3>
              <p className="text-gray-700 text-center leading-relaxed">
                احرص على تناول الخضروات والفواكه الطازجة يومياً
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-t-4 border-purple-500">
              <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mb-4 mx-auto">
                <Activity className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3 text-center">
                مارس الرياضة
              </h3>
              <p className="text-gray-700 text-center leading-relaxed">
                مارس الرياضة 30 دقيقة يومياً للحفاظ على لياقتك
              </p>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-t-4 border-orange-500">
              <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mb-4 mx-auto">
                <Moon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3 text-center">
                نم جيداً
              </h3>
              <p className="text-gray-700 text-center leading-relaxed">
                احصل على 7-8 ساعات نوم يومياً لصحة أفضل
              </p>
            </div>

            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-t-4 border-red-500">
              <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mb-4 mx-auto">
                <Smile className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3 text-center">
                تجنب التوتر
              </h3>
              <p className="text-gray-700 text-center leading-relaxed">
                مارس تمارين الاسترخاء والتأمل للتخلص من التوتر
              </p>
            </div>

            <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-t-4 border-pink-500">
              <div className="w-16 h-16 bg-pink-500 rounded-full flex items-center justify-center mb-4 mx-auto">
                <ClipboardCheck className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3 text-center">
                الفحص الدوري
              </h3>
              <p className="text-gray-700 text-center leading-relaxed">
                قم بالفحص الطبي الدوري للاطمئنان على صحتك
              </p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <div className="bg-gradient-to-r from-red-100 to-pink-100 rounded-2xl p-8 max-w-4xl mx-auto border-2 border-red-200">
              <div className="flex items-center justify-center gap-4 mb-4">
                <AlertTriangle className="w-10 h-10 text-red-600" />
                <h3 className="text-2xl font-bold text-gray-800">في حالات الطوارئ</h3>
                <AlertTriangle className="w-10 h-10 text-red-600" />
              </div>
              <p className="text-lg text-gray-700 mb-4">
                اتصل بالإسعاف فوراً على الرقم
              </p>
              <div className="bg-white rounded-xl py-4 px-6 inline-block shadow-lg">
                <span className="text-4xl font-bold text-red-600">123</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Project Sections - أقسام الموقع */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              أقسام الموقع
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              اضغط على أي قسم لمعرفة المزيد من التفاصيل
            </p>
          </div>

          <div className="max-w-5xl mx-auto space-y-4">
            {/* Section 1: الصفحة الرئيسية */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-gray-200 hover:border-red-400 transition-all duration-300">
              <button
                onClick={() => setOpenSection(openSection === 'home' ? null : 'home')}
                className="w-full px-6 py-5 flex items-center justify-between text-right hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                    <HospitalIcon className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">الصفحة الرئيسية</h3>
                    <p className="text-sm text-gray-500">اكتشف المستشفيات القريبة منك</p>
                  </div>
                </div>
                {openSection === 'home' ? (
                  <ChevronUp className="w-6 h-6 text-red-600" />
                ) : (
                  <ChevronDown className="w-6 h-6 text-gray-400" />
                )}
              </button>
              {openSection === 'home' && (
                <div className="px-6 py-5 bg-gray-50 border-t-2 border-gray-200 animate-fadeIn">
                  <p className="text-gray-700 leading-relaxed mb-4">
                    الصفحة الرئيسية توفر لك إمكانية البحث عن أقرب المستشفيات والمراكز الطبية في جميع أنحاء مصر. باستخدام نظام تحديد الموقع الجغرافي، يمكنك:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 mr-4">
                    <li>تحديد موقعك الحالي تلقائياً</li>
                    <li>البحث عن المستشفيات والصيدليات والعيادات القريبة</li>
                    <li>عرض المسافة ووقت الوصول لكل مركز طبي</li>
                    <li>الحصول على معلومات تفصيلية عن كل مستشفى</li>
                    <li>خريطة تفاعلية مع جميع المواقع</li>
                  </ul>
                  <Link 
                    to="/"
                    className="inline-flex items-center gap-2 mt-4 text-red-600 hover:text-red-700 font-semibold"
                  >
                    <span>انتقل للصفحة الرئيسية</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              )}
            </div>

            {/* Section 2: لوحة التحكم */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-gray-200 hover:border-blue-400 transition-all duration-300">
              <button
                onClick={() => setOpenSection(openSection === 'dashboard' ? null : 'dashboard')}
                className="w-full px-6 py-5 flex items-center justify-between text-right hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">لوحة التحكم</h3>
                    <p className="text-sm text-gray-500">إدارة حسابك وبياناتك الطبية</p>
                  </div>
                </div>
                {openSection === 'dashboard' ? (
                  <ChevronUp className="w-6 h-6 text-blue-600" />
                ) : (
                  <ChevronDown className="w-6 h-6 text-gray-400" />
                )}
              </button>
              {openSection === 'dashboard' && (
                <div className="px-6 py-5 bg-gray-50 border-t-2 border-gray-200 animate-fadeIn">
                  <p className="text-gray-700 leading-relaxed mb-4">
                    لوحة التحكم الشخصية توفر لك نظرة شاملة على:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 mr-4">
                    <li>المعلومات الشخصية والملف الطبي</li>
                    <li>المواعيد القادمة مع الأطباء</li>
                    <li>السجل الطبي والتحاليل السابقة</li>
                    <li>الوصفات الطبية والأدوية</li>
                    <li>إحصائيات صحية وتنبيهات مهمة</li>
                  </ul>
                  <Link 
                    to="/dashboard"
                    className="inline-flex items-center gap-2 mt-4 text-blue-600 hover:text-blue-700 font-semibold"
                  >
                    <span>انتقل للوحة التحكم</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              )}
            </div>

            {/* Section 3: الإسعافات الأولية */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-gray-200 hover:border-green-400 transition-all duration-300">
              <button
                onClick={() => setOpenSection(openSection === 'firstaid' ? null : 'firstaid')}
                className="w-full px-6 py-5 flex items-center justify-between text-right hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <Bandage className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">الإسعافات الأولية</h3>
                    <p className="text-sm text-gray-500">تعلم كيفية التعامل مع الطوارئ</p>
                  </div>
                </div>
                {openSection === 'firstaid' ? (
                  <ChevronUp className="w-6 h-6 text-green-600" />
                ) : (
                  <ChevronDown className="w-6 h-6 text-gray-400" />
                )}
              </button>
              {openSection === 'firstaid' && (
                <div className="px-6 py-5 bg-gray-50 border-t-2 border-gray-200 animate-fadeIn">
                  <p className="text-gray-700 leading-relaxed mb-4">
                    قسم الإسعافات الأولية يوفر لك معلومات حيوية قد تنقذ حياة:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 mr-4">
                    <li>خطوات الإنعاش القلبي الرئوي (CPR)</li>
                    <li>التعامل مع الجروح والنزيف</li>
                    <li>إسعاف الحروق والكسور</li>
                    <li>التعامل مع حالات الاختناق</li>
                    <li>فيديوهات توضيحية وإرشادات مصورة</li>
                  </ul>
                  <Link 
                    to="/first-aid"
                    className="inline-flex items-center gap-2 mt-4 text-green-600 hover:text-green-700 font-semibold"
                  >
                    <span>تعلم الإسعافات الأولية</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              )}
            </div>

            {/* Section 4: الإبلاغات */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-gray-200 hover:border-orange-400 transition-all duration-300">
              <button
                onClick={() => setOpenSection(openSection === 'report' ? null : 'report')}
                className="w-full px-6 py-5 flex items-center justify-between text-right hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                    <FileText className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">الإبلاغات</h3>
                    <p className="text-sm text-gray-500">أبلغ عن حالة طارئة أو مشكلة</p>
                  </div>
                </div>
                {openSection === 'report' ? (
                  <ChevronUp className="w-6 h-6 text-orange-600" />
                ) : (
                  <ChevronDown className="w-6 h-6 text-gray-400" />
                )}
              </button>
              {openSection === 'report' && (
                <div className="px-6 py-5 bg-gray-50 border-t-2 border-gray-200 animate-fadeIn">
                  <p className="text-gray-700 leading-relaxed mb-4">
                    نظام الإبلاغات يسمح لك بـ:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 mr-4">
                    <li>الإبلاغ عن حالات الطوارئ الطبية</li>
                    <li>التبليغ عن حوادث أو إصابات</li>
                    <li>الشكاوى والاقتراحات للمستشفيات</li>
                    <li>متابعة حالة البلاغات المقدمة</li>
                    <li>استقبال تحديثات فورية عن البلاغ</li>
                  </ul>
                  <Link 
                    to="/report"
                    className="inline-flex items-center gap-2 mt-4 text-orange-600 hover:text-orange-700 font-semibold"
                  >
                    <span>قدم بلاغ الآن</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              )}
            </div>

            {/* Section 5: السلامة */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-gray-200 hover:border-purple-400 transition-all duration-300">
              <button
                onClick={() => setOpenSection(openSection === 'safety' ? null : 'safety')}
                className="w-full px-6 py-5 flex items-center justify-between text-right hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <Shield className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">السلامة والوقاية</h3>
                    <p className="text-sm text-gray-500">نصائح للحفاظ على صحتك</p>
                  </div>
                </div>
                {openSection === 'safety' ? (
                  <ChevronUp className="w-6 h-6 text-purple-600" />
                ) : (
                  <ChevronDown className="w-6 h-6 text-gray-400" />
                )}
              </button>
              {openSection === 'safety' && (
                <div className="px-6 py-5 bg-gray-50 border-t-2 border-gray-200 animate-fadeIn">
                  <p className="text-gray-700 leading-relaxed mb-4">
                    قسم السلامة يقدم لك:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 mr-4">
                    <li>نصائح الوقاية من الأمراض</li>
                    <li>إرشادات السلامة في المنزل والعمل</li>
                    <li>التطعيمات المهمة ومواعيدها</li>
                    <li>الوقاية من الحوادث المنزلية</li>
                    <li>برامج توعية صحية شاملة</li>
                  </ul>
                  <Link 
                    to="/safety"
                    className="inline-flex items-center gap-2 mt-4 text-purple-600 hover:text-purple-700 font-semibold"
                  >
                    <span>اعرف المزيد عن السلامة</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              )}
            </div>

            {/* Section 6: اتصل بنا */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-gray-200 hover:border-pink-400 transition-all duration-300">
              <button
                onClick={() => setOpenSection(openSection === 'contact' ? null : 'contact')}
                className="w-full px-6 py-5 flex items-center justify-between text-right hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center">
                    <Phone className="w-6 h-6 text-pink-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">اتصل بنا</h3>
                    <p className="text-sm text-gray-500">تواصل معنا في أي وقت</p>
                  </div>
                </div>
                {openSection === 'contact' ? (
                  <ChevronUp className="w-6 h-6 text-pink-600" />
                ) : (
                  <ChevronDown className="w-6 h-6 text-gray-400" />
                )}
              </button>
              {openSection === 'contact' && (
                <div className="px-6 py-5 bg-gray-50 border-t-2 border-gray-200 animate-fadeIn">
                  <p className="text-gray-700 leading-relaxed mb-4">
                    نحن هنا لمساعدتك! يمكنك:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 mr-4">
                    <li>إرسال استفسارات واقتراحات</li>
                    <li>طلب الدعم الفني</li>
                    <li>التواصل مع فريق العمل</li>
                    <li>الإبلاغ عن مشاكل تقنية</li>
                    <li>الحصول على معلومات إضافية</li>
                  </ul>
                  <Link 
                    to="/contact"
                    className="inline-flex items-center gap-2 mt-4 text-pink-600 hover:text-pink-700 font-semibold"
                  >
                    <span>تواصل معنا الآن</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Mapbox Interactive Map Section */}
      {showMapboxMap && (
        <section
          id="interactive-map-section"
          className="py-8 md:py-16 bg-gray-50 animate-fadeIn"
        >
          <div className="container mx-auto px-4">
            <div className="text-center mb-6 md:mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 md:mb-4">
                🗺️ خريطة تفاعلية لتحديد الموقع
              </h2>
              <p className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto">
                موقعك محدد على الخريطة مع معلومات مفصلة عن العنوان
              </p>
            </div>

            <div className="max-w-6xl mx-auto">
              <GoogleMapsComponent
                userLocation={userLocation}
                onLocationDetails={(details: GeocodeResult) => {
                  setLocationDetails({
                    placeName: details.placeName,
                    city: details.city,
                    district: details.district,
                    governorate: details.governorate,
                    detailedArea: details.detailedArea,
                    neighborhood: details.neighborhood,
                    street: details.street,
                  });
                }}
                onPlacesFound={handleGooglePlacesFound}
                onMapLoaded={handleMapLoaded}
                mapPlaces={mapPlaces}
                showResults={searchCompleted}
                mapLoaded={mapLoaded}
                className="rounded-xl shadow-xl border-2 border-red-200"
              />

              {/* Filter buttons */}
              {nearestCenters.length > 0 && (
                <div className="mt-8">
                  {/* Search Bar */}
                  <div className="mb-6">
                    <div className="max-w-md mx-auto">
                      <div className="relative">
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="ابحث في النتائج... (اسم، عنوان، محافظة، خدمات)"
                          className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-right"
                          dir="rtl"
                        />
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg
                            className="h-5 w-5 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                          </svg>
                        </div>
                        {searchQuery && (
                          <button
                            onClick={() => setSearchQuery("")}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          >
                            <svg
                              className="h-5 w-5 text-gray-400 hover:text-gray-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Filter Buttons */}
                  <div className="flex flex-wrap justify-center gap-3 mb-6">
                    <button
                      onClick={() => setSelectedFacilityType("all")}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        selectedFacilityType === "all"
                          ? "bg-red-600 text-white"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      الكل ({nearestCenters.length})
                    </button>
                    <button
                      onClick={() => setSelectedFacilityType("hospitals")}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        selectedFacilityType === "hospitals"
                          ? "bg-red-600 text-white"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      مستشفيات (
                      {
                        nearestCenters.filter((c) => c.type === "hospital")
                          .length
                      }
                      )
                    </button>
                    <button
                      onClick={() => setSelectedFacilityType("pharmacies")}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        selectedFacilityType === "pharmacies"
                          ? "bg-red-600 text-white"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      صيدليات (
                      {
                        nearestCenters.filter((c) => c.type === "pharmacy")
                          .length
                      }
                      )
                    </button>
                    <button
                      onClick={() => setSelectedFacilityType("clinics")}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        selectedFacilityType === "clinics"
                          ? "bg-red-600 text-white"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      عيادات (
                      {nearestCenters.filter((c) => c.type === "clinic").length}
                      )
                    </button>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
                    نتائج البحث ({filteredCenters.length} مركز)
                  </h3>

                  {filteredCenters.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredCenters.map((center) => (
                        <MedicalCenterCard
                          key={center._id}
                          center={center}
                          showDistance={true}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="text-gray-500 mb-4">
                        <svg
                          className="mx-auto h-12 w-12 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                          />
                        </svg>
                      </div>
                      <h4 className="text-lg font-medium text-gray-900 mb-2">
                        {searchQuery
                          ? "لم يتم العثور على نتائج"
                          : "لا توجد نتائج"}
                      </h4>
                      <p className="text-gray-500 mb-4">
                        {searchQuery
                          ? `لا توجد نتائج تطابق البحث عن "${searchQuery}"`
                          : "جرب تغيير نطاق البحث أو النوع"}
                      </p>
                      {searchQuery && (
                        <button
                          onClick={() => setSearchQuery("")}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                          مسح البحث
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Medical Places List */}
            {mapPlaces.length > 0 && (
              <div className="mt-8">
                <MedicalPlacesList places={mapPlaces} />
              </div>
            )}

            {/* Close Map Button */}
            <div className="text-center mt-6">
              <button
                onClick={() => setShowMapboxMap(false)}
                className="bg-gray-600 hover:bg-gray-700 active:bg-gray-800 text-white px-8 py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                إغلاق الخريطة
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Medical Results Section */}
      {userLocation && nearestCenters.length > 0 && searchCompleted && (
        <MedicalResultsSection
          centers={nearestCenters}
          loading={loading}
          onLoadMore={() => {}}
          hasMore={nearestCenters.length > 30}
        />
      )}
    </div>
  );
};

export default HomePage;
