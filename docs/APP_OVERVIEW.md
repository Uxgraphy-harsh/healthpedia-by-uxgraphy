# Healthpedia — App Overview

> Internal reference doc. Read this before making cross-page changes so context stays consistent.

---

## 1. What is this app?

**Healthpedia** is a mobile-first (max-width `md`, 100dvh) personal & family health companion built as a React SPA. It helps a user (and their loved ones) centralize everything about their health in one place: vitals, symptoms, medications, reports, reminders, and an AI assistant for questions.

**Positioning line (from onboarding):** *"Track and manage your loved one's health with AI."*

**Primary user goals**
- Get a daily at-a-glance **health summary** (score, vitals, watchlist).
- **Track** symptoms, measurements, medications, notes.
- Store and search **medical records / reports** securely (with OCR-style highlights).
- Never miss a **reminder** (medicines, appointments, report collection, food).
- Ask an **AI assistant** health questions, log symptoms conversationally, analyze reports.
- Manage a rich **health profile** (personal info, ABHA ID, conditions, meds, allergies, doctors, family history, integrations, settings).
- View a chronological **timeline** of all health activity.

**Target market cues:** India-first (₹ / IST locale via `en-IN`, ABHA ID integration, doctors like "Dr. Meena Sharma – Apollo Clinic Pune", SRL Diagnostics).

---

## 2. Tech stack

- **Framework:** React 18 + Vite + TypeScript
- **Routing:** react-router-dom
- **Styling:** Tailwind CSS v3, HSL design tokens in `src/index.css`, shadcn/ui components under `src/components/ui/`
- **Font:** Geist (both `sans` and `serif` map to Geist)
- **Icons:** lucide-react + @phosphor-icons/react (Phosphor primarily in BottomNav & AI chat)
- **Animation:** framer-motion
- **Charts:** recharts (Track → measurements)
- **Data layer:** @tanstack/react-query set up; all data currently mocked from `src/data/sampleData.ts`
- **Backend (Lovable Cloud / Supabase):** used for Google OAuth in `AuthContext`. No tables/RLS yet — feature data is not persisted.
- **State:** local `useState` per page; onboarding completion stored in `localStorage["healthpedia_onboarded"]`.

---

## 3. Global structure

### `src/App.tsx`
- Wraps app in `QueryClientProvider` → `TooltipProvider` → `BrowserRouter` → `AuthProvider`.
- `AppContent` renders `<Routes>` and conditionally shows `<BottomNav />` only on: `/dashboard`, `/track`, `/records`, `/reminders`, `/profile`, `/timeline`.
- **Chat (`/chat`) and Index (`/`) intentionally hide the nav** (chat is a fullscreen overlay; index is onboarding).
- Legacy redirects: `/stats → /dashboard`, `/symptoms → /track`, `/vault → /records`.

### `src/index.css` (design system)
- Warm off-white background (`40 33% 97%`), maroon-ish foreground (`25 63% 11%`).
- **Primary** = pink `340 100% 80%` (used with `#F66B9A` accent in onboarding CTAs).
- **Secondary** = deeper pink `340 80% 70%`.
- Health status tokens: `--health-good` (green), `--health-watch` (amber), `--health-alert` (red).
- Utility classes: `.glass-card`, `.glass-card-elevated`, `.gradient-primary`, `.btn-primary-gradient`, `.mobile-container` (max-w-md, min-h-screen, mx-auto).
- Scrollbars hidden globally for native-app feel; `html, body { overflow-x: hidden }`.

### `src/contexts/AuthContext.tsx`
- Wraps Supabase auth. Exposes `session`, `user`, `loading`, `signInWithGoogle`, `signOut`.
- Uses `onAuthStateChange` + `getSession()`. Redirects OAuth back to `window.location.origin`.

### `src/components/BottomNav.tsx`
- 5 tabs in order: **Summary** (Stack icon), **Reminders** (ListChecks), **Ask AI** (center, floating flower icon — `askAiFlower` SVG, blue `#60A5FA` label), **Records** (FolderOpen), **Profile** (UserCircle).
- Fixed bottom, `max-w-md`, pink radial gradient glow at top edge, `bg-card/90 backdrop-blur-xl`.
- Center Ask AI button overflows above the nav (absolute `-top-10`).
- Active tab: filled Phosphor weight + tiny top bar via `layoutId="activeTab"`.

### Shared components
- `PageHeader` — title/subtitle/icon + optional search button.
- `GlobalSearch` — modal search across entities.
- `FloatingActionButton` — expandable FAB (used on Track, Records).
- `HealthTimeline` — reusable timeline block.
- `TagBadge` / `TagList` — colored pill for `Tag` objects.
- `PrivacyBadge` — `PrivacyBanner` + `SecureBadge` (used on Records for reassurance).
- `LoadingScreen` — post-onboarding transition (rotating flower + falling petal physics, ~4.5s).
- `OnboardingFlow` — full onboarding stack (see §5).

---

## 4. Data model (`src/types/health.ts`)

Central types (all mocked in `src/data/sampleData.ts`):

| Type | Purpose | Key fields |
|---|---|---|
| `Tag` | Cross-entity label | `type` (condition / medication / doctor / measurement / symptom_category / custom), `label` |
| `User` | Profile identity | name, dob, gender, height, weight, bloodGroup, `abhaId`, `abhaAddress`, `healthpediaId` |
| `Condition` | Chronic/active dx | status: active / resolved / monitoring |
| `Medication` | Drug + schedule | `routine: MedicationRoutine[]` (morning/afternoon/evening/night + dose + withFood), `prescribedBy`, `active` |
| `Symptom` | Logged symptom | `severity` 1–10, `loggedAt`, notes |
| `Report` | Uploaded document | type: lab_report / prescription / imaging / doctor_notes / other; `highlights: ReportHighlight[]` with normal/high/low flag |
| `Tracker` | Measurement reading | `measurementType`, `value`, `unit`, `recordedAt` |
| `Reminder` | Scheduled reminder | category: medication / appointment / measurement / food / custom; `repeat`: once / daily / weekly / monthly; `done` |
| `Doctor` | Care team | specialty, phone, hospital |
| `Note` | Free-form health note | may link `symptomId` or `conditionId` |
| `Allergy` | Allergy record | severity: mild / moderate / severe |
| `HealthEvent` | Timeline event | `type: HealthEventType`, `timestamp`, `linkedEntityId/Type` |

`HealthEventType` unions: `medication_taken | symptom_logged | measurement_recorded | report_uploaded | appointment | note_added | allergy_added | reminder_completed`.

Sample data seeds all pages so the app is fully browsable without a backend.

---

## 5. Onboarding flow (`src/components/OnboardingFlow.tsx`)

Only shown when `localStorage["healthpedia_onboarded"] !== "true"`. On complete → sets flag → loading screen → `/dashboard`.

**Sequence**
1. **Splash** (~2.3s): full-bleed `splashScreen` SVG with blur-fade exit.
2. **Step 0 — Welcome slider** (light bg, watermark flower top): 3 auto-advancing slides (4s interval, swipe supported).
   - Slide 0: `onboardingSlide1` + floating badges (Reminders / Reports / Notifications).
   - Slide 1: flower bg + Symptoms card + Doctor card.
   - Slide 2: iPhone mock + medication notification.
   - CTAs: **Sign in with Google** (`signInWithGoogle`) OR **Explore as Guest** (advances to step 1).
3. **Step 1 — Basic details** (dark maroon `#49001E` bg, dark flower watermark, pink progress bar `#F66B9A`): Name, DOB, Gender, Height, Weight. Continue disabled until Name + DOB filled.
4. **Step 2 — Health conditions:** searchable pill grid (Diabetes, Hypertension, Thyroid Disorder, Asthma, Heart Disease, Migraine, PCOS, Arthritis, Anxiety, Depression, Anemia) + `+ Custom` chip that shows inline input.
5. **Step 3 — Health trackers:** two connection cards (Google Fit, Apple Health). Toggle → "Connected • Syncing…" (green) or "Not connected".
6. **Step 4 — Permissions (Last Step!):** three glass cards — contacts, notifications, location — each with a `#60A5FA` blue toggle.
7. **Loading screen:** rotating flower + gravity-based falling petals (start above viewport) for ~4.5s, then `onComplete` → dashboard.

Total steps constant: `TOTAL_ONBOARDING_STEPS = 4`. Progress bar = `step / 4 * 100%`.

---

## 6. Pages

### `/` — `src/pages/Index.tsx`
Renders `OnboardingFlow` if not yet onboarded; otherwise redirects to `/dashboard`.

### `/dashboard` — Summary (`src/pages/Dashboard.tsx`)
The default post-onboarding screen. Dark maroon (`#2C0011`) header + white content.

**Header ("Today's Summary")**
- "Customise" pill (top right).
- ~~Health score number and change pill (removed per latest request).~~
- **Vitals horizontal scroller** (4 cards, no scrollbar visible): Heart Rate, Steps, Sleep, Calories — each shows icon, value+unit, label, status pill ("Normal" green / "Below Goal" amber).

**Body sections**
- **Reminders** (max ~3 shown, "View all" → `/reminders`): checkable circles, colored left border by type, category badge. Toggling flips `done` state (adds line-through + opacity). "+ Add a reminder" dashed button → `/reminders`.
- **Family**: horizontal cards (avatar image + name + age chip) with "+ Add a member" dashed slot.
- **Watchlist**: card list of clinical metrics (TSH, Fasting Blood Sugar, BP, Cholesterol, HbA1c) with date, value + unit, status ("Above range" red / "Normal" green). "Customise" pill in header.
- **Upload CTA**: green banner prompting to upload latest report → `/records`.

Local mutable state: only the reminders `done` toggle.

### `/reminders` — `src/pages/Reminders.tsx`
Two views + a bottom sheet.

**Main list view**
- Header: title + "History" link (opens history view) + settings icon.
- `TODAY • {day} {MON}` date label.
- Horizontal tab strip: All / Appointments / Medicines / Reports / Food / General (gap-5, scrollable).
- Cards: dashed circle (pending) / blue filled check (completed) / orange filled bang (missed). Meta line (`repeat or date • time`), title, note, colored category badge (Appointment=blue, Medicine=orange, Report=green, Food=green, General=gray).
- Toggling the circle switches between pending ↔ completed.
- Floating "+" button opens `AddReminderSheet`.

**History view** (`showHistory`)
- Same tabs and card style but read-only, dimmed opacity, statuses locked.

**Add Reminder bottom sheet**
- Fields: Title (required), Date, Time + AM/PM toggle, Repeat (opens day-of-week picker sub-sheet with checkboxes), Type (chip select — Appointment/Medicine/Report collection/Food/General reminder), Description.
- Save disabled unless title filled. Appends to `reminders` state.

### `/chat` — Ask AI (`src/pages/AIChat.tsx`)
Fullscreen overlay (`fixed inset-0`, hides bottom nav).

- **Header:** X close (→ `/dashboard`), "Chat history" pill (opens right-side drawer).
- **Background:** Apple-glass style with pink gradient across bottom 34% of page.
- **Empty state:** grayscale flower watermark centered; two glass quick-action chips ("Log symptoms" / "Analyze Reports"); glass composer input at bottom.
- **Chat state:** message bubbles (user right = pink primary, AI left = card w/ border), timestamps, "Failed · Retry" state, animated typing dots.
- **GlassComposer:** rounded textarea (auto-grow ≤ 120px), Enter to send, Paperclip + Microphone circle buttons. Apple-glass look — no gradient inside the composer.
- **Chat history drawer:** slides in from right, "New Conversation" card + sample past sessions (title, last message, relative time, message count).
- Responses driven by `smartResponses` map + default fallback (mocked; no LLM call yet).

### `/track` — Health Tracking (`src/pages/Track.tsx`)
Four tabs: **Symptoms**, **Measures**, **Meds**, **Notes**. Uses `sampleSymptoms / sampleTrackers / sampleMedications / sampleNotes / sampleTags`.

- **Symptoms tab:** inline form (common symptom chips, custom name input, severity 0–10 slider with color-coded label, notes textarea, tag selector). History list with severity pill + tags; opens detail overlay.
- **Measurements tab:** measurement type picker (blood sugar, BP, weight, HR, sleep, mood, energy, temperature), value input, notes, tags. Also renders a **line chart** (recharts) with daily/weekly/monthly range switcher, using synthetic data around per-type baselines.
- **Medications tab:** add form + list of active meds with routine breakdown (morning/afternoon/evening/night icon + dose + withFood).
- **Notes tab:** category dropdown (General / Side effect / Allergy reaction / Stressful event / Doctor advice), title, description, tags.
- Global: `PageHeader`, `GlobalSearch`, `FloatingActionButton` with 4 quick-log actions.
- Detail view swaps the whole page (`if (detailItem) return …`) with a back button.

### `/records` — Health Records (`src/pages/Records.tsx`)
Medical documents vault.

- Search bar + filter chips (All / Blood Tests / Scans & Imaging / Prescriptions / Doctor Notes / Other).
- Upload flow: hidden file inputs for File / Camera (capture=environment) / Image. Upload form: title, category select, note, tags.
- Report list with title, category chip, date, `SecureBadge`, tags.
- Recent reports section (top 3).
- **Detail view:** document preview placeholder with zoom in/out; metadata + **Key Findings** table using `ReportHighlight` (value colored by flag — high=red, low=amber, normal=default), tags, `SecureBadge`. Edit mode swaps to a form (title, category, note, tags) + Save / Cancel.
- FAB actions: Upload File, Take Photo, Upload Image.

### `/profile` — `src/pages/Profile.tsx`
Manage health identity. Uses `useAuth` for user info; sign-out clears the onboarded flag and returns to `/`.

Structure = header card + completion bar + collapsible sections grouped under labels:

- **Account:** Personal Information (name, email, age, DOB, gender, height, weight, blood group), ABHA ID (number, address, verified status).
- **Health Profile:** Conditions, Medications, Allergies, Doctors, Family Medical History (`GeneticRecord[]`), Contacts & Guardians.
- **Integrations:** Google Fit, Apple Health, Samsung Health, Google Calendar — toggle switches.
- **Reminder Settings:** sound, vibration, default snooze, lock-screen visibility.
- **App Preferences:** dark mode, units (Metric/Imperial), language, temperature unit.
- **Notifications:** daily summary, reminder notifs, report alerts.
- Actions: Help, Feedback, About, Delete Account (danger), **Sign out** (danger).

`SectionHeader` uses an animated chevron; each expanded section renders `InfoRow`, `SettingToggle`, `ActionRow`, or `HealthEntryList` (with inline "Add …" button).

Completion % is computed from booleans in `calculateCompletion({...})`. Suggests filling missing chunks (e.g., "Add allergies", "Add doctors").

### `/timeline` — `src/pages/Timeline.tsx`
Chronological feed of all `HealthEvent`s (from `sampleEvents` + note-derived events).

- Header + search toggle + filter chips per event type (with counts, hidden if 0).
- Grouped by date (`Today` / `Yesterday` / weekday+date).
- Sticky date headers, vertical connector line, event tiles (icon + title + description + time + tags).
- Pagination: "Load older events (N remaining)" chunks of 20.
- Tap event → detail card with metadata + linked entity + notes + tags.
- Empty state links back to `/track` and `/records`.

### `/404` — `src/pages/NotFound.tsx`
Standard not-found page.

---

## 7. Assets

Under `src/assets/`:
- Brand: `healthpedia-logo.svg`, `healthpedia-flower.svg`, `splash-screen.svg`.
- Flower variants: `onboarding-flower-watermark.png` (light bg), `onboarding-flower-dark.png` (maroon steps), `ask-ai-flower.svg` (nav + chat empty state, grayscaled in chat), preloaded via `<link rel="preload">` in `index.html`.
- Onboarding slides: `onboarding-slide-1.png`, `onboarding-slide-2-bg.png`, `onboarding-card-symptoms.svg`, `onboarding-card-doctor.svg`, `onboarding-iphone-only.png`, `onboarding-notification-float.svg`, `onboarding-notification.svg`.
- Integrations: `google-fit-icon.png`, `apple-health-icon.png`.
- Nav reference: `bottom-nav-ref.svg`.

---

## 8. Notable design/UX rules already agreed with the user

- **Font is Geist everywhere** — both `font-serif` and `font-sans` classes map to Geist. Don't reintroduce Instrument Serif or others.
- **CTA / accent pink is `#F66B9A`.** Blue used for AI/permission toggles / Ask AI label is `#60A5FA`.
- **Onboarding dark bg is `#49001E`;** Dashboard header dark bg is `#2C0011`.
- **Mobile-only frame** (`max-w-md`). Hide scrollbars, prevent horizontal overflow.
- **Bottom nav hidden** on `/` and `/chat`.
- **Ask AI is a fullscreen page** (X to close → `/dashboard`), Apple glass composer, no internal gradient in the chat box (gradient lives on the page bg).
- **First page after onboarding = Summary (`/dashboard`)**.
- **Loading screen** must run ~4.5s with real physics for petals, entering from above viewport.
- **Preload the Ask AI flower** so it doesn't pop in on nav mount.

---

## 9. Known gaps / future work

- No real backend for feature data — everything is `sampleData`. Adding Lovable Cloud tables would need `user_roles`-style patterns and RLS + GRANTs (see cloud guidance).
- AI chat uses a lookup map, not the AI Gateway. A real integration should stream from Lovable AI Gateway.
- File uploads on Records don't persist — no storage bucket wired up.
- Reminders don't fire real notifications; no scheduler.
- Health integrations (Google Fit / Apple Health / Samsung Health / Google Calendar) are UI-only toggles.
- Family members, doctors, contacts, guardians, genetic records are hardcoded.
- Search (`GlobalSearch`) currently searches sample data only.
