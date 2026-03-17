Healthpedia - Health App Design System and Architecture

## Colors (HSL in index.css)
- Primary: pink `340 100% 80%` (#FF96BE)
- Secondary: `340 80% 70%`
- Accent: cyan `187 92% 53%` (#22D3EE)
- Foreground/Dark: `25 63% 11%` (#2C180A)
- Background: `228 25% 97%` (#F6F7F9)
- Health status: good (green), watch (amber), alert (red)

## Typography
- Headlines: Playfair Display (serif)
- Body: Inter (sans-serif)

## Logo
- Official SVG logo: src/assets/healthpedia-logo.svg
- Favicon: public/favicon.svg (same SVG)
- Logo contains flower/petal icon + "Healthpedia" text in #2C180A

## Design
- Glass cards, rounded 2xl, soft shadows
- Gradient buttons (pink), mobile-first (max-w-md)
- Onboarding welcome: full-screen photo slideshow (4 images, 2s interval)

## Navigation (5 tabs)
- Chat → /chat, Dashboard → /dashboard, Track → /track, Records → /records, Profile → /profile

## Authentication
- Google Sign-In via Supabase Auth (AuthContext)
- AuthProvider wraps app inside BrowserRouter

## Architecture
- Types: src/types/health.ts
- Sample data: src/data/sampleData.ts
- Auth: src/contexts/AuthContext.tsx
- Shared: PageHeader, FAB, GlobalSearch, HealthTimeline, TagBadge, PrivacyBadge
