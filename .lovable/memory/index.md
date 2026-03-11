# Memory: index.md
Updated: now

# Healthpedia - Health App Design System

## Colors (HSL in index.css)
- Primary: indigo `243 75% 59%` (#4F46E5)
- Secondary: `239 84% 67%` (#6366F1)  
- Accent: cyan `187 92% 53%` (#22D3EE)
- Background: `228 25% 97%` (#F6F7F9)
- Health status: good (green), watch (amber), alert (red)

## Typography
- Headlines: Playfair Display (serif)
- Body: Inter (sans-serif)

## Design
- Glass cards, rounded 2xl, soft shadows
- Gradient buttons, mobile-first (max-w-md)
- Onboarding stored in localStorage

## Navigation (5 tabs)
- Chat (default landing) → /chat
- Dashboard → /dashboard
- Track → /track (symptoms, measurements, medicines, timeline)
- Records → /records (reports, documents)
- Profile → /profile

## Authentication
- Google Sign-In via Supabase Auth (AuthContext)
- Sign out clears localStorage onboarding flag
- AuthProvider wraps app inside BrowserRouter

## Onboarding (8 steps)
- Welcome (Google sign-in) → Basic Profile → Conditions → Medications → Trackers → Integrations → Notifications → Complete

## Profile
- Profile completion indicator (percentage bar)
- Sections: Account, Health Profile, Integrations, Preferences
- Editable fields marked with edit icon

## Architecture
- Types: src/types/health.ts
- Sample data: src/data/sampleData.ts  
- Auth: src/contexts/AuthContext.tsx
- Shared: PageHeader, FAB, GlobalSearch, HealthTimeline, TagBadge, PrivacyBadge
