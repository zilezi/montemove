import type { LatLng } from '@/types';

const R = 6371;
const toRad = (d: number) => (d * Math.PI) / 180;

export function haversineKm(a: LatLng, b: LatLng): number {
  const dLat = toRad(b.latitude - a.latitude);
  const dLng = toRad(b.longitude - a.longitude);
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.latitude)) * Math.cos(toRad(b.latitude)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}

/** Pseudo-road route: a gentle S-curve with jitter between two points. */
export function buildRoute(a: LatLng, b: LatLng, points = 28): LatLng[] {
  const pts: LatLng[] = [];
  const dx = b.longitude - a.longitude;
  const dy = b.latitude - a.latitude;
  const px = -dy;
  const py = dx;
  const seed = Math.abs(Math.sin(a.latitude * 977 + b.longitude * 613)) * 1000;
  for (let i = 0; i < points; i++) {
    const t = i / (points - 1);
    const curve = Math.sin(t * Math.PI) * (0.045 + (seed % 0.05));
    const wobble = Math.sin(t * Math.PI * 5 + seed) * 0.012 * Math.sin(t * Math.PI);
    const o = curve + wobble;
    pts.push({
      latitude: a.latitude + dy * t + py * o,
      longitude: a.longitude + dx * t + px * o,
    });
  }
  pts[0] = { ...a };
  pts[points - 1] = { ...b };
  return pts;
}

export function routeLengthKm(route: LatLng[]): number {
  let sum = 0;
  for (let i = 1; i < route.length; i++) sum += haversineKm(route[i - 1], route[i]);
  return sum;
}

/** Point at fraction t (0..1) along a polyline. */
export function pointAlong(route: LatLng[], t: number): LatLng {
  if (route.length === 0) return { latitude: 0, longitude: 0 };
  const clamped = Math.min(1, Math.max(0, t));
  const seg = clamped * (route.length - 1);
  const i = Math.floor(seg);
  const f = seg - i;
  if (i >= route.length - 1) return route[route.length - 1];
  return {
    latitude: route[i].latitude + (route[i + 1].latitude - route[i].latitude) * f,
    longitude: route[i].longitude + (route[i + 1].longitude - route[i].longitude) * f,
  };
}

export function jitterAround(c: LatLng, minKm: number, maxKm: number, seed: number): LatLng {
  const rnd = ((seed * 9301 + 49297) % 233280) / 233280;
  const r = minKm + (maxKm - minKm) * rnd;
  const bearing = ((seed * 7919) % 628) / 100;
  const dLat = (r / 111) * Math.cos(bearing);
  const dLng = (r / (111 * Math.cos(toRad(c.latitude)))) * Math.sin(bearing);
  return { latitude: c.latitude + dLat, longitude: c.longitude + dLng };
}

export function etaMinutes(km: number, city: boolean): number {
  const speed = city ? 26 : 74;
  return Math.max(2, Math.round((km / speed) * 60));
}
