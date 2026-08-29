import type { PackageSize, ServiceId } from '@/types';

export type Quote = {
  total: number;
  fixed: boolean;
  lines: { label: string; amount: number }[];
};

type Rates = {
  base: number;
  perKm: number;
  perMin: number;
  min: number;
  fixed: boolean;
};

const RATES: Record<ServiceId, Rates> = {
  taxi: { base: 1.9, perKm: 0.85, perMin: 0.12, min: 3.5, fixed: false },
  comfort: { base: 2.6, perKm: 1.15, perMin: 0.15, min: 5, fixed: false },
  van6: { base: 3.2, perKm: 1.45, perMin: 0.18, min: 6.5, fixed: false },
  transfer: { base: 2, perKm: 0.95, perMin: 0, min: 24, fixed: true },
  airport: { base: 2, perKm: 0.95, perMin: 0, min: 24, fixed: true },
  courier: { base: 2.2, perKm: 0.65, perMin: 0, min: 3.9, fixed: true },
  vanxl: { base: 18, perKm: 1.15, perMin: 0.2, min: 29, fixed: true },
};

const SIZE_MULT: Record<PackageSize, number> = { S: 1, M: 1.35, L: 1.7, XL: 1 };
const HELPER_FEE = 10;
const AIRPORT_FEE = 4.99;

export function quote(opts: {
  service: ServiceId;
  km: number;
  min: number;
  size?: PackageSize;
  express?: boolean;
  helpers?: number;
  rounded?: boolean;
}): Quote {
  const r = RATES[opts.service];
  const lines: { label: string; amount: number }[] = [];

  let total = r.base;
  lines.push({ label: 'Base fare', amount: r.base });

  const kmCost = r.perKm * opts.km;
  if (kmCost > 0) {
    total += kmCost;
    lines.push({ label: `Distance (${opts.km.toFixed(1)} km)`, amount: kmCost });
  }
  const minCost = r.perMin * opts.min;
  if (minCost > 0) {
    total += minCost;
    lines.push({ label: `Time (${Math.round(opts.min)} min)`, amount: minCost });
  }

  if (opts.service === 'courier' && opts.size) {
    const mult = SIZE_MULT[opts.size];
    total *= mult;
    if (mult !== 1) lines.push({ label: `Package ${opts.size}`, amount: total - total / mult });
  }
  if (opts.express) {
    lines.push({ label: 'Express', amount: total * 0.25 });
    total *= 1.25;
  }
  if (opts.helpers) {
    lines.push({ label: `Helpers ×${opts.helpers}`, amount: opts.helpers * HELPER_FEE });
    total += opts.helpers * HELPER_FEE;
  }
  if (opts.service === 'airport') {
    lines.push({ label: 'Airport fee', amount: AIRPORT_FEE });
    total += AIRPORT_FEE;
  }

  if (total < r.min) total = r.min;

  if (opts.rounded !== false && r.fixed) {
    total = Math.round(total * 2) / 2;
  }

  return { total, fixed: r.fixed, lines };
}

export const SERVICE_SUPPORTS_SCHEDULE: ServiceId[] = ['transfer', 'airport', 'vanxl'];
