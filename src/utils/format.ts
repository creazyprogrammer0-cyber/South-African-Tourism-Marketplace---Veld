const zar = new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR', maximumFractionDigits: 0 });

export function formatZAR(amount: number): string {
  return zar.format(Math.round(amount)).replace(/\u00a0/g, ' ');
}

export function formatDuration(hours: number): string {
  if (hours >= 24) {
    const days = Math.round(hours / 24);
    return `${days} day${days === 1 ? '' : 's'}`;
  }
  if (Number.isInteger(hours)) return `${hours} hour${hours === 1 ? '' : 's'}`;
  return `${hours} hours`;
}

export function initials(name: string): string {
  return name.
  split(' ').
  filter(Boolean).
  slice(0, 2).
  map((p) => p[0]?.toUpperCase()).
  join('');
}

export function pluralize(count: number, singular: string, plural = `${singular}s`): string {
  return `${count} ${count === 1 ? singular : plural}`;
}

export function formatRating(avg: number): string {
  return avg.toFixed(1);
}