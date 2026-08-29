import type { Place } from '@/types';

export const PODGORICA: Place = {
  id: 'podgorica',
  name: 'Podgorica',
  detail: 'City center',
  city: 'Podgorica',
  lat: 42.4408,
  lng: 19.2639,
  kind: 'city',
};

export const PLACES: Place[] = [
  { id: 'podgorica', name: 'Podgorica', detail: 'City center', city: 'Podgorica', lat: 42.4408, lng: 19.2639, kind: 'city' },
  { id: 'budva', name: 'Budva', detail: 'Old Town', city: 'Budva', lat: 42.2881, lng: 18.8428, kind: 'city' },
  { id: 'kotor', name: 'Kotor', detail: 'Old Town', city: 'Kotor', lat: 42.4247, lng: 18.7712, kind: 'city' },
  { id: 'tivat', name: 'Tivat', detail: 'Porto Montenegro area', city: 'Tivat', lat: 42.4366, lng: 18.7053, kind: 'city' },
  { id: 'herceg_novi', name: 'Herceg Novi', detail: 'Kanli Kula area', city: 'Herceg Novi', lat: 42.4531, lng: 18.5333, kind: 'city' },
  { id: 'bar', name: 'Bar', detail: 'City center', city: 'Bar', lat: 42.0938, lng: 19.1009, kind: 'city' },
  { id: 'ulcinj', name: 'Ulcinj', detail: 'Old Town', city: 'Ulcinj', lat: 41.9281, lng: 19.2064, kind: 'city' },
  { id: 'cetinje', name: 'Cetinje', detail: 'King Nikola Palace', city: 'Cetinje', lat: 42.3906, lng: 18.9147, kind: 'city' },
  { id: 'niksic', name: 'Nikšić', detail: 'City center', city: 'Nikšić', lat: 42.7733, lng: 18.9736, kind: 'city' },
  { id: 'danilovgrad', name: 'Danilovgrad', detail: 'City center', city: 'Danilovgrad', lat: 42.5517, lng: 19.1061, kind: 'city' },
  { id: 'kolasin', name: 'Kolašin', detail: 'Ski resort area', city: 'Kolašin', lat: 42.8231, lng: 19.5189, kind: 'city' },
  { id: 'zabljak', name: 'Žabljak', detail: 'Durmitor gateway', city: 'Žabljak', lat: 43.1544, lng: 19.1236, kind: 'city' },
  { id: 'bijelo_polje', name: 'Bijelo Polje', detail: 'City center', city: 'Bijelo Polje', lat: 43.0328, lng: 19.7467, kind: 'city' },
  { id: 'berane', name: 'Berane', detail: 'City center', city: 'Berane', lat: 42.8458, lng: 19.8686, kind: 'city' },
  { id: 'pljevlja', name: 'Pljevlja', detail: 'City center', city: 'Pljevlja', lat: 43.3594, lng: 19.3258, kind: 'city' },
  { id: 'tgd', name: 'Podgorica Airport (TGD)', detail: 'Podgorica, Golubovci', city: 'Podgorica', lat: 42.3594, lng: 19.2519, kind: 'airport' },
  { id: 'tiv', name: 'Tivat Airport (TIV)', detail: 'Tivat, Đorđevići', city: 'Tivat', lat: 42.4036, lng: 18.7219, kind: 'airport' },
  { id: 'porto_montenegro', name: 'Porto Montenegro', detail: 'Marina, Tivat', city: 'Tivat', lat: 42.435, lng: 18.6947, kind: 'poi' },
  { id: 'sveti_stefan', name: 'Sveti Stefan', detail: 'Islet resort', city: 'Budva', lat: 42.2614, lng: 18.8936, kind: 'poi' },
  { id: 'perast', name: 'Perast', detail: 'Bay of Kotor', city: 'Kotor', lat: 42.4858, lng: 18.6972, kind: 'poi' },
  { id: 'becici', name: 'Bečići', detail: 'Beach promenade', city: 'Budva', lat: 42.2936, lng: 18.865, kind: 'poi' },
  { id: 'petrovac', name: 'Petrovac', detail: 'Seafront', city: 'Bar', lat: 42.2097, lng: 18.9386, kind: 'poi' },
  { id: 'virpazar', name: 'Virpazar', detail: 'Skadar Lake', city: 'Bar', lat: 42.2431, lng: 19.05, kind: 'poi' },
  { id: 'lustica_bay', name: 'Luštica Bay', detail: 'Marina village', city: 'Tivat', lat: 42.4217, lng: 18.6281, kind: 'poi' },
  { id: 'ada_bojana', name: 'Ada Bojana', detail: 'River island beach', city: 'Ulcinj', lat: 41.8611, lng: 19.3483, kind: 'poi' },
  { id: 'hilton_pg', name: 'Hilton Podgorica', detail: 'Bulevar Svetog Petra', city: 'Podgorica', lat: 42.4461, lng: 19.2536, kind: 'poi' },
  { id: 'delta_city', name: 'Delta City', detail: 'Shopping mall, Podgorica', city: 'Podgorica', lat: 42.4261, lng: 19.2392, kind: 'poi' },
  { id: 'stadium_pg', name: 'Stadion Pod Goricom', detail: 'Football stadium', city: 'Podgorica', lat: 42.4357, lng: 19.2611, kind: 'poi' },
  { id: 'durmitor', name: 'Durmitor National Park', detail: 'Entrance, Žabljak', city: 'Žabljak', lat: 43.1461, lng: 19.1136, kind: 'poi' },
  { id: 'ostrog', name: 'Ostrog Monastery', detail: 'Upper monastery', city: 'Nikšić', lat: 42.6758, lng: 19.0214, kind: 'poi' },
];

export function searchPlaces(query: string): Place[] {
  const q = query.trim().toLowerCase();
  if (!q) return PLACES.slice(0, 8);
  return PLACES.filter(
    (p) => p.name.toLowerCase().includes(q) || p.city.toLowerCase().includes(q) || p.detail.toLowerCase().includes(q)
  ).slice(0, 12);
}

export function placeById(id: string): Place | undefined {
  return PLACES.find((p) => p.id === id);
}
