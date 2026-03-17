

Here is the complete frontend prompt for your Healthpedia mobile application that you can use in any no-code tool:

---

# HEALTHPEDIA — Complete Mobile Health Application Frontend Prompt

## APPLICATION OVERVIEW

Build a mobile-first health management application called **Healthpedia**. It is a personal health companion that allows users to track symptoms, measurements, medications, upload medical reports, set reminders, and view a unified health timeline.

The app is designed as a single-page mobile web application with a maximum width of 448px (max-w-md), centered on screen. All screens scroll vertically. A persistent bottom navigation bar is present on all main screens.

---

## DESIGN SYSTEM

### Typography
- **Headlines (h1, h2, h3)**: Playfair Display (serif), bold
- **Body text**: Inter (sans-serif), weights 300–700

### Color Palette (HSL)
- **Primary (Indigo)**: hsl(243, 75%, 59%) — #4F46E5
- **Secondary**: hsl(239, 84%, 67%) — #6366F1
- **Accent (Cyan)**: hsl(187, 92%, 53%) — #22D3EE
- **Background**: hsl(228, 25%, 97%) — light gray #F6F7F9
- **Card Background**: hsl(0, 0%, 100%) — white
- **Foreground**: hsl(222, 47%, 11%) — dark navy
- **Muted Text**: hsl(215, 16%, 37%)
- **Border**: hsl(220, 20%, 91%)
- **Health Good (Green)**: hsl(142, 71%, 45%)
- **Health Watch (Amber)**: hsl(38, 92%, 50%)
- **Health Alert (Red)**: hsl(0, 84%, 60%)
- **Destructive**: hsl(0, 84%, 60%)

### Gradients
- **Primary Gradient**: linear-gradient(135deg, Primary, Secondary) — used for buttons, active elements
- **Accent Gradient**: linear-gradient(135deg, Secondary, Accent)

### Cards
- **Glass Card**: white background, rounded-2xl (20px), subtle border at 50% opacity, backdrop-blur-20px, soft box-shadow (0 4px 24px -4px primary/8%)
- **Elevated Glass Card**: same as glass card but with stronger shadow (0 8px 32px -8px primary/15%)

### Buttons
- **Primary Gradient Button**: gradient background, white text, font-semibold, rounded-2xl, px-8 py-4, hover lifts up 1px with stronger shadow
- Standard rounded-md buttons with variants: default, destructive, outline, secondary, ghost, link

### Spacing
- Page horizontal padding: 20px (px-5)
- Page top padding: 24px (pt-6)
- Bottom padding on all pages: 96px (pb-24) to account for bottom nav
- Section vertical spacing: 20px (space-y-5)
- Card internal padding: 12–20px

### Animations
- Use Framer Motion throughout
- Staggered entrance animations (delay: index * 0.05–0.08s)
- Fade-up for content, slide-in for cards
- Spring transitions for tab indicators (stiffness: 400, damping: 30)
- Accordion animations for expandable sections

---

## NAVIGATION

### Bottom Navigation Bar
Fixed at bottom of screen, max-w-md centered. Background: card color at 90% opacity with backdrop blur. 5 tabs:

1. **Chat** (MessageCircle icon) — path: /chat
2. **Dashboard** (LayoutDashboard icon) — path: /dashboard
3. **Track** (Activity icon) — path: /track
4. **Records** (FileText icon) — path: /records
5. **Profile** (User icon) — path: /profile

Active tab shows:
- An animated indicator bar above the icon (gradient-primary, 32px wide, 4px tall, rounded)
- Icon and label in primary color
- Inactive tabs use muted-foreground color

Label text: 10px font-medium

### Routes
- `/` — Onboarding (redirects to /chat if completed)
- `/chat` — AI Chat
- `/dashboard` — Dashboard
- `/track` — Health Tracking
- `/records` — Medical Records
- `/reminders` — Reminders (no bottom nav tab, accessed from Dashboard)
- `/timeline` — Health Timeline (accessed from Dashboard)
- `/profile` — Profile & Settings

---

## SCREEN 1: ONBOARDING FLOW

An 8-step guided setup shown only on first visit. Stored in localStorage as `healthpedia_onboarded`. Slides animate horizontally (enter from right, exit to left).

**Progress bar** appears on steps 1–6: thin gradient bar at top showing percentage.

### Step 0 — Welcome
- Large gradient icon (Activity) in rounded-3xl container
- App name "Healthpedia" in 3xl serif bold
- Tagline: "Your personal health companion. Track, understand, and manage your health — all in one place."
- "Continue with Google" button (glass-card-elevated, full width, Google SVG icon)
- "Skip sign-in for now" link below

### Step 1 — Basic Profile
- Title: "Basic Profile" (serif)
- Fields: Full Name, Date of Birth (date picker), Gender (3 toggle buttons: Male/Female/Other — selected shows gradient-primary), Height (cm), Weight (kg)
- All inputs use glass-card style with rounded-xl

### Step 2 — Health Conditions
- Title: "Health Conditions"
- Search input to filter conditions
- Pill-shaped toggle buttons for: Diabetes, Hypertension, Thyroid Disorder, Asthma, Heart Disease, Migraine, PCOS, Arthritis, Anxiety, Depression, Anemia, None
- Selected conditions show gradient-primary background
- Custom condition input with + button
- Selected conditions shown as small primary-colored chips with X to remove

### Step 3 — Medications
- Title: "Current Medications"
- Cards for each medication with fields: Medicine name, Dosage, Frequency dropdown (Daily/Twice Daily/Weekly/As Needed), optional condition link dropdown
- "Add Medication" dashed border button
- "Skip for now" link

### Step 4 — Health Trackers
- Title: "Health Trackers"
- 2-column grid of tracker options: Blood Sugar (Droplets icon), Blood Pressure (Heart), Weight (Weight), Sleep (Moon), Heart Rate (Activity), Mood (Smile), Energy Level (Zap), Water Intake (GlassWater)
- Selected trackers show elevated card with primary border, gradient icon background, and checkmark
- Default selected: Blood Sugar, Weight

### Step 5 — Health Integrations
- Google Fit and Apple Health cards with connect buttons
- "Skip for now" link

### Step 6 — Notifications
- Large Bell icon in primary/10 background
- Title: "Stay On Track"
- "Enable Notifications" gradient button
- "Not now" link

### Step 7 — Done
- Gradient checkmark icon
- Title: "Your Health Profile is Ready"
- Feature list: Chat with assistant, Upload reports, Track symptoms
- "Start Using Healthpedia" gradient button

**Navigation**: Continue button (gradient) at bottom on steps 1–4. Back link below Continue on steps 2+.

---

## SCREEN 2: AI CHAT (/chat)

### Header
- Gradient icon (Sparkles) with "Health Assistant" title (serif)
- Green pulsing dot with "Your personal health companion" subtitle
- History button (opens session list) and Settings button (navigates to /profile)

### Quick Actions Bar
- Horizontal scrollable row below header: Log Symptom, Upload Report, Add Reminder, Measurement, View Reports
- Each is a small glass-card chip with icon + label

### Empty State (no messages)
- Centered gradient MessageCircle icon
- "Hello! 👋" greeting
- Description text
- 4 suggested prompt buttons: "Log a symptom", "Upload a medical report", "Ask a health question", "Add a medication reminder"
- Each has icon, text, and ChevronRight arrow

### Chat Messages
- **User messages**: gradient-primary background, white text, rounded-2xl with rounded-br-md (bottom-right less rounded)
- **AI messages**: glass-card background, rounded-2xl with rounded-bl-md
- AI messages support markdown: bold text (**text**), bullet points (•), line breaks
- Timestamps below each message (relative: "Just now", "5m ago")
- Error state with retry button

### Typing Indicator
- 3 bouncing dots in glass-card bubble, staggered animation delay

### Attachments
- Users can attach PDF, image, or document files
- Pending attachments shown as horizontal scrollable chips above input
- Attachment menu slides up with 3 options: PDF, Photo, Document

### Input Area
- Auto-resizing textarea (max 120px)
- Paperclip button for attachments
- Send button (gradient-primary circle) — disabled when empty

### Chat History Sidebar
- Slides in from bottom as a sheet
- Lists past sessions with title, last message preview, timestamp, message count
- "New Chat" button at bottom

### Smart Responses
- Pre-configured responses for common health queries (blood reports, diet, heart rate, food suggestions)
- Fallback response lists capabilities

---

## SCREEN 3: DASHBOARD (/dashboard)

### Greeting Section
- Dynamic greeting based on time: "Good Morning/Afternoon/Evening, {Name}"
- Current date formatted: "Tuesday, March 11"
- Profile avatar button (gradient circle with User icon) linking to /profile

### Health Summary Cards
- Horizontal scrollable row, each card 140px wide
- Metrics: Steps (Footprints icon), Heart Rate (Heart), Sleep (Moon), Calories (Flame), Blood Sugar (Droplets), Weight (Weight)
- Each card shows: icon + trend arrow (TrendingUp green / TrendingDown red), large value with unit, metric label, change percentage
- Cards animate in from right with stagger

### Today's Reminders
- "View All" link to /reminders
- Up to 4 reminder cards showing:
  - Toggle circle (tap to mark complete): empty = upcoming, green check = completed, red alert = missed
  - Title (line-through when completed)
  - Time with Clock icon, status badge (colored pill: Done/Missed/Upcoming)
  - Category icon on right (Pill for medication, Calendar for appointment, Ruler for measurement, Flame for food, Bell for custom)
- Completed reminders show at 60% opacity

### Quick Log Section
- 3-column grid of 6 tracker shortcuts: Blood Sugar, Blood Pressure, Weight, Mood, Symptom, Energy
- Each card: colored icon in rounded container + label
- Tapping navigates to /track

### Recent Activity
- Section header with "Full Timeline" link to /timeline
- Shows 4 most recent events using the HealthTimeline component (vertical timeline with date grouping, event type icons, timestamps)

### Quick Actions
- 4-column grid: Upload Report (/records), Add Reminder (/reminders), Log Symptom (/track), View Records (/records)
- Each: primary/10 icon + small label

---

## SCREEN 4: HEALTH TRACKING (/track)

### Header
- PageHeader component: "Health Tracking" with Activity icon, search button
- GlobalSearch overlay when search is tapped

### Tab Navigation
- 4 tabs in a pill-shaped container: Symptoms (Activity icon), Measures (Ruler), Meds (Pill), Notes (StickyNote)
- Tab labels are 10px with icons

### Symptoms Tab
- "Log a new symptom" button (glass-card, Plus icon, primary text)
- **Symptom Form** (expandable, animated):
  - Common symptom suggestion chips: Headache, Fatigue, Dizziness, Nausea, Pain, Fever, Cough, Insomnia
  - Custom symptom text input
  - Severity slider 0–10 with color-coded badge (0-3 green "Low", 4-6 amber "Medium", 7-10 red "High")
  - Notes textarea
  - Tag selector (toggle chips from tag list)
  - "Save Symptom" gradient button
- **History**: chronological list of symptom entries. Each card shows: name, severity badge, notes preview, timestamp, tags

### Measurements Tab
- Measurement type selector: horizontal scrollable chips (Blood Sugar, Blood Pressure, Weight, Heart Rate, Sleep, Mood, Energy, Temperature)
- **Chart View**: Line chart (recharts) with time range toggle (Daily/Weekly/Monthly), shows trend data
- **Log Form**: value input with unit label, notes, tags, save button
- **History**: list of measurement entries with value, unit, timestamp, trend indicator

### Medications Tab
- Active medications list showing: name, purpose, routine schedule (morning/afternoon/evening/night with icons), prescribed by, tags
- **Log Form**: medication name (quick-select from active meds), dosage, notes, tags
- Medication detail view with full routine schedule

### Notes Tab
- Category selector: General health note, Side effect, Allergy reaction, Stressful event, Doctor advice
- **Note Form**: category dropdown, title, description textarea, tags
- **History**: chronological note list with content preview, timestamp, tags

### Detail View
- Full-screen overlay with back button
- Shows complete entry information, all tags, timestamps
- Specific layouts per type (symptom shows severity, measurement shows large value, medication shows routine schedule)

### Floating Action Button
- Fixed bottom-right (above bottom nav)
- Gradient-primary 56px rounded-2xl button with Plus icon (rotates 45° when open)
- Opens action menu with scrim overlay: Log Symptom, Record Measurement, Add Medication Log, Add Health Note
- Each action item: label chip + icon button

---

## SCREEN 5: MEDICAL RECORDS (/records)

### Header
- PageHeader: "Medical Records" with Shield icon, search button
- Privacy banner: "Your records are encrypted and stored securely" with shield icon

### Search & Filter
- Inline search input
- Category filter chips: All, Blood Tests, Scans & Imaging, Prescriptions, Doctor Notes, Other Documents
- Active filter highlighted with primary color

### Recent Reports
- Horizontal scrollable carousel of recent report cards
- Each card: gradient background based on category, title, date, type badge

### Categories Grid
- Cards showing category name, icon, and document count badge
- Tap to filter by category

### All Reports List
- Filtered by search query and active category
- Each report card shows: category icon in colored circle, title, date, type badge, tag chips
- Tap to open detail view

### Upload Flow
- **Floating Action Button** with options: Upload File, Take Photo, Upload Image
- Upload form: title input, category dropdown, date picker, notes, tag selector
- File input (hidden) triggered by buttons

### Report Detail View
- Back button
- Document preview area with zoom controls (ZoomIn/ZoomOut buttons, scale transform)
- **Key Findings** section: table of highlight values with name, value, reference range, and color-coded flag (green normal, red high, blue low)
- Metadata: title, date, category, notes, tags
- Edit mode: inline editing of title, category, notes, tags
- Delete button (destructive)

### Empty State
- Shield icon
- "No medical reports yet"
- Suggested actions: Upload your first report, Take a photo of a lab report, Import medical records

---

## SCREEN 6: REMINDERS (/reminders)

### Header
- "Reminders" title with Bell icon
- Stats bar: 3 metric cards showing Upcoming count, Completed count, Missed count (color-coded)

### Category Filter
- Horizontal chips: All, Medication, Food, Appointment, Health Check, Custom
- Each category has icon and specific color

### View Toggle
- Two tabs: Active / History
- Active shows current reminders
- History shows completed and missed reminders with timestamps

### Reminder Cards
- Each shows: category icon in colored circle, title, time(s), repeat frequency, status badge
- Action buttons: Mark Complete (check), Snooze (timer), Edit, Delete
- Completed: green check, 60% opacity, line-through title
- Missed: red alert icon

### Snooze Sheet
- Bottom sheet with options: 5 min, 10 min, 30 min, 1 hour
- Each option is a button card

### 5-Step Creation Flow (animated wizard)
1. **Title**: text input with quick suggestions (Take Metformin, Drink Water, Doctor Appointment, Blood Sugar Check, Evening Walk)
2. **Category**: 5 category buttons with icons and colors
3. **Time**: time input(s) with add/remove capability for multiple daily times
4. **Repeat**: frequency options (Daily, Weekly, Monthly, Custom)
5. **Summary**: review all details, optional notes textarea, Save button

- Progress indicator: "Step X of 5"
- Continue/Back navigation buttons
- Animated step transitions

### Floating Action Button
- Opens creation flow

### Empty State
- Bell icon, "No reminders yet", create first reminder button

---

## SCREEN 7: HEALTH TIMELINE (/timeline)

### Header
- Back button (navigates to /dashboard)
- "Health Timeline" title
- Search button

### Search Bar
- Expandable search input filtering events by title, description, tags

### Filter Chips
- Toggle chips with counts: Symptoms, Measurements, Medications, Reports, Notes, Appointments, Reminders
- Multiple filters can be active simultaneously
- Each chip shows event count

### Timeline Feed
- Events grouped by date with sticky date headers
- Date labels: "Today", "Yesterday", or formatted date (e.g., "March 9")
- Each date group has a vertical timeline line connecting events

### Event Cards
- Left: colored icon circle (type-specific icon and color)
- Right: glass-card with title, description, timestamp, tag chips
- Tap to expand detail view

### Event Detail View
- Full overlay with back button
- Complete event information, associated tags, notes
- Links to related entities (e.g., linked medication, symptom)

### Pagination
- "Load older events" button at bottom
- Shows visible count / total count

### Empty State
- "Your health timeline will appear here"
- Suggested actions: Log first symptom, Record a measurement, Upload a medical report

---

## SCREEN 8: PROFILE (/profile)

### Profile Header
- User avatar (gradient circle with initial or User icon)
- Name, email, member since date
- **Health Profile Completion** progress bar with percentage
- Suggestions for missing data

### Expandable Sections (accordion-style with ChevronDown animation)

#### Account
- Fields: Name, Email, Phone, Date of Birth, Gender, Blood Group, ABHA ID
- Sign Out button

#### Health Profile
- Subsections for: Conditions, Medications, Allergies, Doctors
- Each shows list of entries with status indicators
- Add new entry button per subsection
- Entry management: add, edit, remove
- For conditions: name + status (Active green, Monitoring amber, Resolved)
- For medications: name + Active/Inactive badge
- For allergies: name + severity (Mild/Moderate/Severe color-coded)
- For doctors: name + specialty

#### Health Integrations
- Toggle switches for: Google Fit, Apple Health, Samsung Health
- Shows Connected/Not Connected status

#### Reminder Settings
- Toggles: Notification Sound, Vibration
- Default Snooze Time selector (5/10/15/30 min)

#### App Preferences
- Dark Mode toggle
- Language selector
- Units: kg/lb toggle
- Temperature: °C/°F toggle

#### Privacy & Security
- Data encryption info
- Local storage explanation
- Privacy policy link
- Delete Account button (destructive, with confirmation)

#### Support
- Send Feedback, Report a Problem, Help Center action rows

#### About
- App version (1.0.0)
- Terms of Service, Privacy Policy links

### Section Header Design
- Glass-card with icon (primary/10 background), label, optional badge, expand/collapse chevron
- Content animates in/out with framer-motion

---

## REUSABLE COMPONENTS

### Floating Action Button
- Fixed position bottom-right, above bottom nav (bottom: 96px, right: 20px)
- 56px gradient-primary rounded-2xl button with Plus icon
- Opens upward action menu with scrim backdrop
- Actions: label chip + icon, staggered animation

### Page Header
- Title (serif bold), optional subtitle, optional icon, optional search button, optional action slot

### Global Search
- Full-screen overlay with backdrop blur
- Search input with cancel button
- Results as glass-cards with entity type icon, title, subtitle, date
- Entity types: report, medication, symptom, note, doctor, tracker

### Health Timeline Component
- Vertical timeline with date grouping
- Left-aligned icon circles connected by vertical line
- Event cards with title, description, timestamp, tags

### Tag System
- Tags are small pills (10px text, rounded-full)
- Types: condition, medication, doctor, measurement, symptom_category, custom
- Tag selector: grid of toggleable tag chips
- Selected tags show primary background, unselected show muted

### Privacy Badge
- Small shield icon with "Encrypted" or "Secure" label
- Privacy banner with security message

---

## DATA TYPES

### Tag
- id, type (condition/medication/doctor/measurement/symptom_category/custom), label

### Medication
- id, name, dosage, purpose, conditionId, prescribedBy, startDate, endDate, active, routine (time/dose/withFood), tags

### Symptom
- id, name, severity (0-10), conditionId, notes, loggedAt, tags

### Report
- id, title, type (lab_report/prescription/imaging/doctor_notes/other), date, fileUrl, highlights (name/value/range/flag), tags

### Tracker (Measurement)
- id, measurementType, value, unit, recordedAt, notes, tags

### Reminder
- id, title, time, category (medication/appointment/measurement/food/custom), repeat (once/daily/weekly/monthly), done, tags

### Health Event
- id, type (medication_taken/symptom_logged/measurement_recorded/report_uploaded/appointment/note_added/allergy_added/reminder_completed), timestamp, title, description, tags, linkedEntityId, linkedEntityType

### Note
- id, content, symptomId, conditionId, createdAt, tags

---

## SAMPLE DATA

Include demo data for all types:
- 3 medications (Metformin 500mg, Atorvastatin 10mg, Vitamin D3)
- 4 symptoms (Fatigue, Headache, Dizziness, Fatigue)
- 3 reports (Blood Count, Prescription, Thyroid Panel) with highlight values
- 3 tracker entries (blood sugar, blood pressure, weight)
- 5 reminders (medication, health check, appointment, food, custom)
- 7 health timeline events
- 4 health notes
- 6 tags (Diabetes, Migraine, Metformin, Dr. Sharma, Blood Sugar, Neurological)

---

## EMPTY STATE PATTERN

All screens follow the same empty state pattern:
- Centered icon in primary/10 rounded-2xl container
- Title message
- Subtitle: "Start building your health history"
- 2-3 suggested action buttons (glass-card style)

---

## RESPONSIVE BEHAVIOR

- App container: max-width 448px (max-w-md), centered horizontally
- All content adapts within this mobile container
- Bottom nav sticks to bottom within the container
- Scrollable areas: health metric cards (horizontal), quick actions bar (horizontal)
- Vertical scroll for all main content areas

---

End of Healthpedia application frontend prompt.

