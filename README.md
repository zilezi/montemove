# MonteMove 🇲🇪

Uber-style rides + Glovo-style courier for Montenegro — a concept demo built with
Expo (React Native, SDK 57, TypeScript). iOS-first, tested on-device via
**AltStore**.

## What's inside

| Service | What it does |
| --- | --- |
| **Taxi** | City rides with upfront fare, Standard / Comfort / Van 6+ |
| **Transfer** | Intercity rides with fixed price (Podgorica ↔ coast ↔ north) |
| **Airport** | Fixed-price transfers to/from TGD & TIV, schedulable |
| **Courier** | S/M/L parcels, express option, recipient details |
| **Van XL** | Fiat-Ducato-class vans for furniture & appliances, helpers option |

Everything is **simulated**: a driver pool (Montenegrin names, plates, ratings),
animated driver movement on a real Apple Map, live ETA, SOS sheet (112/122),
trip sharing, receipt + tip, and persisted trip history.

## Quick preview (no build)

```powershell
npm install
npx expo start
```

Scan the QR with **Expo Go** on the iPhone — Apple Maps render without any API
key. Note: the full experience needs the device build below.

## Install on iPhone via AltStore

See **[docs/ALTSTORE.md](docs/ALTSTORE.md)** — free Apple ID, unsigned IPA built
automatically by GitHub Actions, signed & installed by AltStore on your PC.

## Project layout

```
app/                 Expo Router screens
  (tabs)/            Home (map), Activity, Account
  search.tsx         Destination / pickup search
  ride.tsx           Ride booking flow (all ride services)
  courier.tsx        Courier + Van XL booking flow
  track.tsx          Live trip simulation, driver card, receipt
src/
  components/        RideMap, ServiceChips, VehicleOption, SOS sheet…
  data/              Places (cities, POIs, airports), driver fleet
  lib/               geo + pricing engine + formatting
  store/             Zustand store (booking state machine, history)
  theme.ts           Dark "Adriatic" design tokens
.github/workflows/   CI: unsigned iOS .ipa for AltStore
```

## Roadmap ideas

- Real backend (Supabase/Firebase) + driver app
- Montenegrin localization (UI is EN today)
- In-app chat with translation (like Montego)
- Stripe/aircash payments, real driver onboarding
