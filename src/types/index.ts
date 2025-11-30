export type ReportType = "crime" | "accident" | "health" | "missing" | "help";

export interface ReportData {
  name: string;
  contact: string;
  location: string;
  description: string;
  type: ReportType;
  extras?: Record<string, any>;
}

export interface CrimeFormData {
  crimeType: string;
  place: string;
  involvedCount: number;
  attachment?: string;
}

export interface AccidentFormData {
  accidentType: string;
  injuredCount: number;
  severity: string;
}

export interface HealthFormData {
  problemType: string;
  affectedCount: number;
  attachment?: string;
}

export interface MissingFormData {
  missingName: string;
  age: string;
  gender: string;
  lastSeenPlace: string;
  photo?: string;
  caregiverName?: string;
  caregiverContact?: string;
}

export interface HelpFormData {
  helpType: string;
  quantityOrType: string;
  patientCondition: string;
}

export interface Doctor {
  id: number;
  name: string;
  email: string;
  specialization: string;
  licenseNumber: string;
}

export interface Question {
  id: number;
  patientName: string;
  patientId: string;
  question: string;
  category: string;
  status: "new" | "pending" | "answered" | "follow-up";
  timestamp: Date;
  attachments: string[];
  response: string | null;
  specialization: string;
  respondedAt?: Date;
}

export interface ProblemReport {
  fullName: string;
  contactType: "email" | "phone";
  contact: string;
  problemType: "website" | "emergency" | "other";
  description: string;
  attachment?: File;
}

export interface EmergencyCenter {
  name: string;
  type: string;
  distance: string;
  time: string;
  phone: string;
}

export interface Suggestion {
  type: "hospital" | "ambulance" | "improvement";
  title: string;
  details: string;
  location?: string;
}

export interface UserLocation {
  lat: number;
  lng: number;
}

export type AuthTab = "login" | "register";
export type QuestionFilter = "all" | "new" | "pending" | "answered";
export type QuestionStatus = "new" | "pending" | "answered" | "follow-up";
export type ProblemType = "website" | "emergency" | "other";
export type ContactType = "email" | "phone";
export type Specialization =
  | "general"
  | "pediatrics"
  | "cardiology"
  | "dermatology"
  | "orthopedics"
  | "neurology"
  | "gynecology"
  | "psychiatry";
