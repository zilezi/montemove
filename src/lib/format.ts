export function eur(n: number): string {
  return '€' + n.toFixed(2);
}

export function km(n: number): string {
  return n < 10 ? n.toFixed(1) + ' km' : Math.round(n) + ' km';
}

export function mins(n: number): string {
  if (n < 1) return 'less than a min';
  if (n === 1) return '1 min';
  if (n < 60) return Math.round(n) + ' min';
  const h = Math.floor(n / 60);
  const m = Math.round(n % 60);
  return m === 0 ? `${h} h` : `${h} h ${m} min`;
}

export function dateLabel(ts: number): string {
  const d = new Date(ts);
  const today = new Date();
  const same = d.toDateString() === today.toDateString();
  if (same) return 'Today, ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  return (
    d.toLocaleDateString([], { day: 'numeric', month: 'short' }) +
    ', ' +
    d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  );
}
