import type { Driver, ServiceId, VehicleClass } from '@/types';

export const SERVICES: Record<
  ServiceId,
  {
    id: ServiceId;
    label: string;
    blurb: string;
    classId: VehicleClass['id'];
    icon: 'car' | 'star' | 'users' | 'route' | 'plane' | 'package' | 'truck';
    accent: string;
    kind: 'ride' | 'courier';
  }
> = {
  taxi: { id: 'taxi', label: 'Taxi', blurb: 'City rides, upfront fare', classId: 'standard', icon: 'car', accent: '#F5C542', kind: 'ride' },
  comfort: { id: 'comfort', label: 'Comfort', blurb: 'Premium cars, top drivers', classId: 'comfort', icon: 'star', accent: '#17D1B0', kind: 'ride' },
  van6: { id: 'van6', label: 'Van 6+', blurb: 'Groups & luggage', classId: 'van6', icon: 'users', accent: '#5EC5FF', kind: 'ride' },
  transfer: { id: 'transfer', label: 'Transfer', blurb: 'Intercity, fixed price', classId: 'standard', icon: 'route', accent: '#17D1B0', kind: 'ride' },
  airport: { id: 'airport', label: 'Airport', blurb: 'TGD & TIV pickups', classId: 'standard', icon: 'plane', accent: '#8FA3FF', kind: 'ride' },
  courier: { id: 'courier', label: 'Courier', blurb: 'Parcels, Glovo-style', classId: 'courier', icon: 'package', accent: '#FF9F5A', kind: 'courier' },
  vanxl: { id: 'vanxl', label: 'Van XL', blurb: 'Furniture & appliances', classId: 'vanxl', icon: 'truck', accent: '#FF7A7A', kind: 'courier' },
};

export const VEHICLE_CLASSES: Record<VehicleClass['id'], VehicleClass> = {
  standard: { id: 'standard', name: 'Standard', tagline: 'Affordable everyday rides', seats: 4, sample: 'Škoda Octavia · VW Golf', multiplier: 1 },
  comfort: { id: 'comfort', name: 'Comfort', tagline: 'Newer cars, extra space', seats: 4, sample: 'Mercedes C-Class · Audi A4', multiplier: 1.35 },
  van6: { id: 'van6', name: 'Van 6+', tagline: 'Room for the whole crew', seats: 6, sample: 'Opel Vivaro · Mercedes Vito', multiplier: 1.7 },
  courier: { id: 'courier', name: 'Courier', tagline: 'Bikes, scooters & small cars', seats: 1, sample: 'Yamaha NMAX · Fiat Doblo', multiplier: 1 },
  vanxl: { id: 'vanxl', name: 'Van XL', tagline: 'Fiat Ducato class for big stuff', seats: 2, sample: 'Fiat Ducato · Iveco Daily', multiplier: 1 },
};

const FIRST = ['Marko', 'Nikola', 'Jovan', 'Stefan', 'Petar', 'Darko', 'Vuk', 'Luka', 'Bojan', 'Miloš', 'Filip', 'Andrej', 'Ana', 'Milica', 'Katarina', 'Ivana', 'Tamara', 'Jelena'];
const LAST = ['Petrović', 'Jovanović', 'Nikolić', 'Vukčević', 'Popović', 'Ivanović', 'Marković', 'Djurić', 'Radulović', 'Knežević', 'Šćepanović', 'Lakušić'];
const CARS: Record<VehicleClass['id'], string[]> = {
  standard: ['Škoda Octavia', 'VW Golf 8', 'Toyota Corolla', 'Ford Focus', 'Dacia Logan'],
  comfort: ['Mercedes C 220d', 'Audi A4', 'BMW 320d', 'Volvo S60'],
  van6: ['Opel Vivaro', 'Mercedes Vito', 'VW Transporter'],
  courier: ['Yamaha NMAX', 'Honda PCX', 'Fiat Doblo', 'Piaggio Porter'],
  vanxl: ['Fiat Ducato L3H2', 'Iveco Daily', 'Ford Transit', 'Peugeot Boxer'],
};
const COLORS = ['White', 'Black', 'Silver', 'Graphite', 'Blue'];
const PLATE_CITIES = ['PG', 'BD', 'KO', 'TV', 'BR', 'UL', 'HN', 'NK'];

function mulberry(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function makePool(): Driver[] {
  const rnd = mulberry(42);
  const drivers: Driver[] = [];
  for (let i = 0; i < 26; i++) {
    const classId = (['standard', 'standard', 'standard', 'comfort', 'van6', 'courier', 'courier', 'vanxl'] as const)[
      Math.floor(rnd() * 8)
    ];
    const cars = CARS[classId];
    const first = FIRST[Math.floor(rnd() * FIRST.length)];
    const last = LAST[Math.floor(rnd() * LAST.length)];
    const city = PLATE_CITIES[Math.floor(rnd() * PLATE_CITIES.length)];
    drivers.push({
      id: 'd' + i,
      name: `${first} ${last[0]}.`,
      rating: Math.round((4.75 + rnd() * 0.24) * 100) / 100,
      trips: 400 + Math.floor(rnd() * 4200),
      car: cars[Math.floor(rnd() * cars.length)],
      plate: `${city} ${Math.floor(100 + rnd() * 899)}-${['AB', 'CD', 'EK', 'MK', 'NP', 'TR'][Math.floor(rnd() * 6)]}`,
      color: COLORS[Math.floor(rnd() * COLORS.length)],
      classId,
      yearsExp: 2 + Math.floor(rnd() * 12),
    });
  }
  return drivers;
}

export const DRIVER_POOL: Driver[] = makePool();

export function driversFor(classId: VehicleClass['id']): Driver[] {
  const pool = DRIVER_POOL.filter((d) => d.classId === classId);
  return pool.length > 0 ? pool : DRIVER_POOL;
}
