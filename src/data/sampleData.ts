// Sample/mock data for the Healthpedia app

import type { HealthEvent, Medication, Symptom, Report, Tracker, Reminder, Tag, Note } from "@/types/health";

// ─── Sample Tags ────────────────────────────────────────────────────────────────

export const sampleTags: Tag[] = [
  { id: "t1", type: "condition", label: "Diabetes" },
  { id: "t2", type: "condition", label: "Migraine" },
  { id: "t3", type: "medication", label: "Metformin" },
  { id: "t4", type: "doctor", label: "Dr. Sharma" },
  { id: "t5", type: "measurement", label: "Blood Sugar" },
  { id: "t6", type: "symptom_category", label: "Neurological" },
];

// ─── Medications ────────────────────────────────────────────────────────────────

export const sampleMedications: Medication[] = [
  {
    id: "med1",
    name: "Metformin 500mg",
    dosage: "500mg",
    purpose: "Blood Sugar Control",
    conditionId: "cond1",
    prescribedBy: "Dr. Sharma",
    startDate: "2026-02-28",
    active: true,
    routine: [
      { time: "morning", dose: "1 tablet", withFood: true },
      { time: "night", dose: "1 tablet", withFood: true },
    ],
    tags: [
      { id: "t1", type: "condition", label: "Diabetes" },
      { id: "t4", type: "doctor", label: "Dr. Sharma" },
    ],
  },
  {
    id: "med2",
    name: "Atorvastatin 10mg",
    dosage: "10mg",
    purpose: "Cholesterol Management",
    prescribedBy: "Dr. Mehta",
    startDate: "2026-01-10",
    active: true,
    routine: [{ time: "night", dose: "1 tablet", withFood: false }],
    tags: [{ id: "t7", type: "doctor", label: "Dr. Mehta" }],
  },
  {
    id: "med3",
    name: "Vitamin D3 60K IU",
    dosage: "60K IU",
    purpose: "Vitamin Deficiency",
    prescribedBy: "Dr. Sharma",
    startDate: "2026-03-01",
    active: true,
    routine: [{ time: "morning", dose: "1 sachet (weekly)", withFood: true }],
    tags: [{ id: "t4", type: "doctor", label: "Dr. Sharma" }],
  },
];

// ─── Symptoms ───────────────────────────────────────────────────────────────────

export const sampleSymptoms: Symptom[] = [
  { id: "sym1", name: "Fatigue", severity: 6, loggedAt: "2026-03-09T14:00:00", notes: "Felt tired after lunch", tags: [{ id: "t1", type: "condition", label: "Diabetes" }] },
  { id: "sym2", name: "Headache", severity: 4, loggedAt: "2026-03-08T10:00:00", notes: "Mild, went away after rest", tags: [{ id: "t2", type: "condition", label: "Migraine" }] },
  { id: "sym3", name: "Dizziness", severity: 3, loggedAt: "2026-03-06T08:30:00", notes: "Brief episode in morning", tags: [] },
  { id: "sym4", name: "Fatigue", severity: 7, loggedAt: "2026-03-05T09:00:00", notes: "All day, low energy", tags: [{ id: "t1", type: "condition", label: "Diabetes" }] },
];

// ─── Reports ────────────────────────────────────────────────────────────────────

export const sampleReports: Report[] = [
  {
    id: "rep1",
    title: "Complete Blood Count",
    type: "lab_report",
    date: "2026-03-02",
    highlights: [
      { name: "HbA1c", value: "6.8%", range: "4.0-5.6%", flag: "high" },
      { name: "Fasting Glucose", value: "118 mg/dL", range: "70-100 mg/dL", flag: "high" },
      { name: "Cholesterol", value: "185 mg/dL", range: "<200 mg/dL", flag: "normal" },
    ],
    tags: [{ id: "t1", type: "condition", label: "Diabetes" }],
  },
  {
    id: "rep2",
    title: "Dr. Sharma — Endocrinology",
    type: "prescription",
    date: "2026-02-28",
    highlights: [{ name: "Metformin", value: "500mg", range: "Twice daily", flag: "normal" }],
    tags: [{ id: "t4", type: "doctor", label: "Dr. Sharma" }],
  },
  {
    id: "rep3",
    title: "Thyroid Panel",
    type: "lab_report",
    date: "2026-01-15",
    highlights: [
      { name: "TSH", value: "3.2 mIU/L", range: "0.4-4.0 mIU/L", flag: "normal" },
      { name: "Free T4", value: "1.1 ng/dL", range: "0.8-1.8 ng/dL", flag: "normal" },
    ],
    tags: [],
  },
];

// ─── Trackers ───────────────────────────────────────────────────────────────────

export const sampleTrackers: Tracker[] = [
  { id: "tr1", measurementType: "blood_sugar", value: 118, unit: "mg/dL", recordedAt: "2026-03-11T08:30:00", tags: [{ id: "t5", type: "measurement", label: "Blood Sugar" }] },
  { id: "tr2", measurementType: "blood_pressure", value: 120, unit: "mmHg", recordedAt: "2026-03-11T09:00:00", notes: "Systolic", tags: [] },
  { id: "tr3", measurementType: "weight", value: 62, unit: "kg", recordedAt: "2026-03-10T07:00:00", tags: [] },
];

// ─── Reminders ──────────────────────────────────────────────────────────────────

export const sampleReminders: Reminder[] = [
  { id: "rem1", title: "Metformin", time: "08:00", category: "medication", repeat: "daily", medicationId: "med1", done: false, tags: [{ id: "t3", type: "medication", label: "Metformin" }] },
  { id: "rem2", title: "Blood Pressure Check", time: "09:00", category: "measurement", repeat: "daily", done: true, tags: [] },
  { id: "rem3", title: "Dr. Sharma Appointment", time: "14:30", category: "appointment", repeat: "once", done: false, tags: [{ id: "t4", type: "doctor", label: "Dr. Sharma" }] },
  { id: "rem4", title: "Eat Low-GI Snack", time: "16:00", category: "food", repeat: "daily", done: false, tags: [] },
  { id: "rem5", title: "Evening Walk", time: "18:00", category: "custom", repeat: "daily", done: false, tags: [] },
];

// ─── Health Events (Timeline) ───────────────────────────────────────────────────

export const sampleEvents: HealthEvent[] = [
  { id: "ev1", type: "medication_taken", timestamp: "2026-03-11T07:00:00", title: "Metformin taken", tags: [{ id: "t3", type: "medication", label: "Metformin" }], linkedEntityId: "med1", linkedEntityType: "medication" },
  { id: "ev2", type: "measurement_recorded", timestamp: "2026-03-11T08:30:00", title: "Blood sugar recorded — 118 mg/dL", tags: [{ id: "t5", type: "measurement", label: "Blood Sugar" }], linkedEntityId: "tr1", linkedEntityType: "tracker" },
  { id: "ev3", type: "symptom_logged", timestamp: "2026-03-11T09:15:00", title: "Fatigue symptom logged", description: "Severity: 6/10", tags: [{ id: "t1", type: "condition", label: "Diabetes" }], linkedEntityId: "sym1", linkedEntityType: "symptom" },
  { id: "ev4", type: "report_uploaded", timestamp: "2026-03-11T11:00:00", title: "Blood report uploaded", tags: [], linkedEntityId: "rep1", linkedEntityType: "report" },
  { id: "ev5", type: "medication_taken", timestamp: "2026-03-10T07:00:00", title: "Metformin taken", tags: [{ id: "t3", type: "medication", label: "Metformin" }] },
  { id: "ev6", type: "appointment", timestamp: "2026-03-10T14:30:00", title: "Dr. Sharma appointment", description: "Endocrinology checkup", tags: [{ id: "t4", type: "doctor", label: "Dr. Sharma" }] },
  { id: "ev7", type: "note_added", timestamp: "2026-03-09T20:00:00", title: "Health note added", description: "Feeling better after adjusting diet", tags: [] },
];

// ─── Health Notes ───────────────────────────────────────────────────────────────

export const sampleNotes: Note[] = [
  { id: "note1", content: "Noticed improved energy after switching to low-GI meals for a week. Will continue this diet plan.", createdAt: "2026-03-10T20:00:00", conditionId: "cond1", tags: [{ id: "t1", type: "condition", label: "Diabetes" }] },
  { id: "note2", content: "Mild nausea after taking Metformin on empty stomach. Must remember to eat first.", createdAt: "2026-03-08T09:30:00", symptomId: "sym1", tags: [{ id: "t3", type: "medication", label: "Metformin" }] },
  { id: "note3", content: "Dr. Sharma advised increasing water intake to at least 3L daily and reducing salt.", createdAt: "2026-03-06T15:00:00", tags: [{ id: "t4", type: "doctor", label: "Dr. Sharma" }] },
  { id: "note4", content: "Stressful week at work — sleep quality dropped. Headaches returning.", createdAt: "2026-03-04T22:00:00", tags: [{ id: "t2", type: "condition", label: "Migraine" }] },
];
