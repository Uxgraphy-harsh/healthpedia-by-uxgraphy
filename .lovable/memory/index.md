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

## Architecture
- Types: src/types/health.ts (all health data models)
- Sample data: src/data/sampleData.ts
- Shared components: PageHeader, FloatingActionButton, GlobalSearch, HealthTimeline, TagBadge, PrivacyBadge
- Health events feed into timeline automatically
- Universal tagging system across all entries
- Legacy routes (/stats, /symptoms, /vault) redirect to new paths
