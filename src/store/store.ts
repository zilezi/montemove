import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Booking, HistoryEntry, LatLng, PackageSize, Place, ServiceId } from '@/types';
import { buildRoute, jitterAround } from '@/lib/geo';

type BookingDraft = {
  service: ServiceId;
  pickup: Place | null;
  dropoff: Place | null;
  size: PackageSize;
  description: string;
  recipient: string;
  recipientPhone: string;
  express: boolean;
  helpers: number;
  payment: 'cash' | 'card';
  scheduledLabel: string;
};

const initialDraft: BookingDraft = {
  service: 'taxi',
  pickup: null,
  dropoff: null,
  size: 'M',
  description: '',
  recipient: '',
  recipientPhone: '',
  express: false,
  helpers: 0,
  payment: 'cash',
  scheduledLabel: 'Now',
};

type AppState = {
  homeLabel: string;
  homeCoord: LatLng;
  locationDenied: boolean;
  recents: Place[];
  draft: BookingDraft;
  active: Booking | null;
  history: HistoryEntry[];

  setHome: (label: string, coord: LatLng, denied: boolean) => void;
  setDraft: (patch: Partial<BookingDraft>) => void;
  addRecent: (p: Place) => void;
  createBooking: (
    b: Omit<Booking, 'id' | 'createdAt' | 'status' | 'progress' | 'phase' | 'driver' | 'routeDriver' | 'routeTrip'>
  ) => Booking;
  updateActive: (patch: Partial<Booking>) => void;
  completeActive: () => void;
  cancelActive: () => void;
};

export const useApp = create<AppState>()(
  persist(
    (set, get) => ({
      homeLabel: 'Podgorica',
      homeCoord: { latitude: 42.4408, longitude: 19.2639 },
      locationDenied: false,
      recents: [],
      draft: initialDraft,
      active: null,
      history: [],

      setHome: (label, coord, denied) => set({ homeLabel: label, homeCoord: coord, locationDenied: denied }),

      setDraft: (patch) => set((s) => ({ draft: { ...s.draft, ...patch } })),

      addRecent: (p) =>
        set((s) => ({
          recents: [p, ...s.recents.filter((r) => r.id !== p.id)].slice(0, 6),
        })),

      createBooking: (b) => {
        const routeTrip = buildRoute(
          { latitude: b.pickup.lat, longitude: b.pickup.lng },
          { latitude: b.dropoff.lat, longitude: b.dropoff.lng }
        );
        const seed = Math.floor(Math.random() * 100000);
        const start = jitterAround({ latitude: b.pickup.lat, longitude: b.pickup.lng }, 0.8, 2.4, seed);
        const routeDriver = buildRoute(start, { latitude: b.pickup.lat, longitude: b.pickup.lng }, 18);
        const booking: Booking = {
          ...b,
          id: 'bk_' + seed.toString(36) + Date.now().toString(36),
          createdAt: Date.now(),
          status: 'matching',
          progress: 0,
          phase: 'to_pickup',
          driver: null,
          routeDriver,
          routeTrip,
        };
        set({ active: booking });
        return booking;
      },

      updateActive: (patch) => set((s) => (s.active ? { active: { ...s.active, ...patch } } : {})),

      completeActive: () => {
        const a = get().active;
        if (!a) return;
        const entry: HistoryEntry = {
          id: a.id,
          kind: a.kind,
          serviceName: a.serviceName,
          from: a.pickup.name,
          to: a.dropoff.name,
          price: a.price,
          driverName: a.driver?.name ?? '—',
          car: a.driver ? `${a.driver.car} · ${a.driver.color}` : '—',
          rating: a.driver?.rating ?? 4.9,
          date: Date.now(),
        };
        set((s) => ({ active: null, history: [entry, ...s.history].slice(0, 30) }));
      },

      cancelActive: () => set({ active: null }),
    }),
    {
      name: 'montemove-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (s) => ({ recents: s.recents, history: s.history, draft: s.draft }),
    }
  )
);

export function distanceKm(a: Place, b: Place): number {
  const dx = (b.lng - a.lng) * 111 * Math.cos((a.lat * Math.PI) / 180);
  const dy = (b.lat - a.lat) * 111;
  return Math.max(1, Math.sqrt(dx * dx + dy * dy) * 1.32);
}
