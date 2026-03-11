// Core health data types, events, tags, and relationships for the Healthpedia app

// ─── Tags ───────────────────────────────────────────────────────────────────────

export interface Tag {
  id: string;
  type: "condition" | "medication" | "doctor" | "measurement" | "symptom_category" | "custom";
  label: string;
}

// ─── Core Data Objects ──────────────────────────────────────────────────────────

export interface User {
  id: string;
  name: string;
  email: string;
  dateOfBirth: string;
  gender: string;
  height: number; // cm
  weight: number; // kg
  bloodGroup: string;
  abhaId?: string;
  abhaAddress?: string;
  healthpediaId: string;
  createdAt: string;
}

export interface Condition {
  id: string;
  name: string;
  diagnosedDate?: string;
  status: "active" | "resolved" | "monitoring";
  notes?: string;
  tags: Tag[];
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  purpose: string;
  conditionId?: string; // linked to Condition
  prescribedBy?: string; // doctor name or Doctor.id
  startDate: string;
  endDate?: string;
  active: boolean;
  routine: MedicationRoutine[];
  photoUrl?: string;
  tags: Tag[];
}

export interface MedicationRoutine {
  time: "morning" | "afternoon" | "evening" | "night";
  dose: string;
  withFood: boolean;
}

export interface Symptom {
  id: string;
  name: string;
  severity: number; // 1-10
  conditionId?: string;
  notes?: string;
  loggedAt: string;
  tags: Tag[];
}

export interface Report {
  id: string;
  title: string;
  type: "lab_report" | "prescription" | "imaging" | "doctor_notes" | "other";
  date: string;
  conditionId?: string;
  fileUrl?: string;
  highlights: ReportHighlight[];
  tags: Tag[];
}

export interface ReportHighlight {
  name: string;
  value: string;
  range: string;
  flag: "normal" | "high" | "low";
}

export interface Tracker {
  id: string;
  measurementType: string; // e.g., "blood_sugar", "blood_pressure", "weight"
  value: number;
  unit: string;
  recordedAt: string;
  notes?: string;
  tags: Tag[];
}

export interface Reminder {
  id: string;
  title: string;
  time: string;
  category: "medication" | "appointment" | "measurement" | "food" | "custom";
  repeat: "once" | "daily" | "weekly" | "monthly";
  medicationId?: string;
  done: boolean;
  tags: Tag[];
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  phone?: string;
  hospital?: string;
  tags: Tag[];
}

export interface Note {
  id: string;
  content: string;
  symptomId?: string;
  conditionId?: string;
  createdAt: string;
  tags: Tag[];
}

export interface Allergy {
  id: string;
  name: string;
  severity: "mild" | "moderate" | "severe";
  reaction?: string;
  diagnosedDate?: string;
  tags: Tag[];
}

// ─── Health Events ──────────────────────────────────────────────────────────────

export type HealthEventType =
  | "medication_taken"
  | "symptom_logged"
  | "measurement_recorded"
  | "report_uploaded"
  | "appointment"
  | "note_added"
  | "allergy_added"
  | "reminder_completed";

export interface HealthEvent {
  id: string;
  type: HealthEventType;
  timestamp: string;
  title: string;
  description?: string;
  tags: Tag[];
  linkedEntityId?: string; // ID of the related object
  linkedEntityType?: string;
  notes?: string;
}

// ─── Timeline ───────────────────────────────────────────────────────────────────

export interface TimelineDay {
  date: string;
  events: HealthEvent[];
}

// ─── Search ─────────────────────────────────────────────────────────────────────

export type SearchableEntityType = "report" | "medication" | "symptom" | "note" | "doctor" | "tracker";

export interface SearchResult {
  id: string;
  entityType: SearchableEntityType;
  title: string;
  subtitle?: string;
  date?: string;
  tags: Tag[];
}
