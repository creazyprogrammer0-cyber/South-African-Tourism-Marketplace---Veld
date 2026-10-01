import type { Experience, MarketplaceState } from '../types/marketplace';
import { experienceRating, nextAvailable, slotRemaining, providerById } from './selectors';

export type SortKey = 'recommended' | 'rating' | 'price_asc' | 'price_desc' | 'duration';
export type DurationBucket = 'any' | 'short' | 'half' | 'full';

export interface ExperienceFilters {
  q: string;
  destination: string;
  categories: string[];
  maxPrice: number;
  duration: DurationBucket;
  minRating: number;
  date: string;
  guests: number;
  sort: SortKey;
}

export const defaultFilters: ExperienceFilters = {
  q: '',
  destination: '',
  categories: [],
  maxPrice: 0,
  duration: 'any',
  minRating: 0,
  date: '',
  guests: 1,
  sort: 'recommended'
};

export const durationBuckets: {value: DurationBucket;label: string;test: (h: number) => boolean;}[] = [
{ value: 'any', label: 'Any length', test: () => true },
{ value: 'short', label: 'Up to 3 hours', test: (h) => h <= 3 },
{ value: 'half', label: '3–6 hours', test: (h) => h > 3 && h <= 6 },
{ value: 'full', label: 'Full day (6h+)', test: (h) => h > 6 }];


export const priceOptions = [
{ value: 0, label: 'Any price' },
{ value: 750, label: 'Up to R 750' },
{ value: 1250, label: 'Up to R 1 250' },
{ value: 2000, label: 'Up to R 2 000' }];


export function countActiveFilters(f: ExperienceFilters): number {
  return [f.q, f.destination, f.categories.length, f.maxPrice, f.duration !== 'any', f.minRating, f.date, f.guests > 1].filter(Boolean).length;
}

export function applyFilters(s: MarketplaceState, list: Experience[], f: ExperienceFilters): Experience[] {
  const q = f.q.trim().toLowerCase();
  const out = list.filter((e) => {
    if (q) {
      const provider = providerById(s, e.providerId);
      const hay = `${e.title} ${e.summary} ${e.destination} ${provider?.businessName ?? ''}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    if (f.destination && e.destination !== f.destination) return false;
    if (f.categories.length && !f.categories.includes(e.category)) return false;
    if (f.maxPrice && e.price > f.maxPrice) return false;
    if (!durationBuckets.find((d) => d.value === f.duration)!.test(e.durationHours)) return false;
    if (f.minRating && experienceRating(s, e.id).average < f.minRating) return false;
    if (f.guests > e.maxGuests) return false;
    if (f.date) {
      const ok = s.slots.some((x) => x.experienceId === e.id && x.date === f.date && x.status === 'open' && slotRemaining(x) >= f.guests);
      if (!ok) return false;
    } else if (!nextAvailable(s, e.id, f.guests)) {
      return false;
    }
    return true;
  });

  const score = (e: Experience) => {
    const r = experienceRating(s, e.id);
    return r.average * Math.log(2 + r.count);
  };
  const sorters: Record<SortKey, (a: Experience, b: Experience) => number> = {
    recommended: (a, b) => score(b) - score(a),
    rating: (a, b) => experienceRating(s, b.id).average - experienceRating(s, a.id).average || experienceRating(s, b.id).count - experienceRating(s, a.id).count,
    price_asc: (a, b) => a.price - b.price,
    price_desc: (a, b) => b.price - a.price,
    duration: (a, b) => a.durationHours - b.durationHours
  };
  return [...out].sort(sorters[f.sort]);
}