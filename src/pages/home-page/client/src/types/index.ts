export interface MedicalCenter {
  _id: string;
  name: string;
  type: 'hospital' | 'clinic' | 'pharmacy' | 'emergency';
  governorate: string;
  city: string;
  address: string;
  location: {
    type: 'Point';
    coordinates: [number, number];
  };
  phone?: string;
  emergencyPhone?: string;
  services: string[];
  distance?: number;
  isActive: boolean;
  rating?: number;
  totalRatings?: number;
  website?: string;
  isOpen?: boolean;
  openingHours?: string[];
}

export interface FirstAid {
  _id: string;
  title: string;
  category: 'bleeding' | 'burns' | 'fainting' | 'fractures' | 'choking' | 'heart_attack' | 'stroke' | 'allergic_reaction';
  severity: 'mild' | 'moderate' | 'severe';
  symptoms: string[];
  instructions: {
    step: number;
    description: string;
    warning?: string;
  }[];
  warnings: string[];
  whenToCallEmergency: string[];
  estimatedTime: string;
  isActive: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  governorate?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LocationData {
  latitude: number;
  longitude: number;
  accuracy?: number;
}




