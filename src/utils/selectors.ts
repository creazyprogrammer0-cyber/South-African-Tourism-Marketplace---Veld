import type {
  AvailabilitySlot,
  Booking,
  CustomRequest,
  Experience,
  MarketplaceState,
  Proposal,
  ProviderProfile,
  Review } from
'../types/marketplace';
import { todayISO } from './dates';
import { OPEN_REQUEST_STATUSES } from './status';

export const userById = (s: MarketplaceState, id?: string) => s.users.find((u) => u.id === id);
export const providerById = (s: MarketplaceState, id?: string) => s.providers.find((p) => p.id === id);
export const providerByUserId = (s: MarketplaceState, userId?: string | null) => s.providers.find((p) => p.userId === userId);
export const experienceById = (s: MarketplaceState, id?: string) => s.experiences.find((e) => e.id === id);
export const requestById = (s: MarketplaceState, id?: string) => s.requests.find((r) => r.id === id);
export const bookingById = (s: MarketplaceState, id?: string) => s.bookings.find((b) => b.id === id);

export interface RatingSummary {
  average: number;
  count: number;
}

export function summarize(reviews: Review[]): RatingSummary {
  const published = reviews.filter((r) => r.status === 'published');
  if (!published.length) return { average: 0, count: 0 };
  const avg = published.reduce((a, r) => a + r.rating, 0) / published.length;
  return { average: Math.round(avg * 10) / 10, count: published.length };
}

export const providerRating = (s: MarketplaceState, providerId: string) =>
summarize(s.reviews.filter((r) => r.providerId === providerId));

export const experienceRating = (s: MarketplaceState, experienceId: string) =>
summarize(s.reviews.filter((r) => r.experienceId === experienceId));

export function isProviderLive(s: MarketplaceState, provider?: ProviderProfile): boolean {
  if (!provider || provider.verificationStatus !== 'approved') return false;
  return userById(s, provider.userId)?.status === 'active';
}

export function isExperiencePublic(s: MarketplaceState, e?: Experience): boolean {
  return !!e && e.status === 'published' && isProviderLive(s, providerById(s, e.providerId));
}

export const publicExperiences = (s: MarketplaceState) => s.experiences.filter((e) => isExperiencePublic(s, e));

export const slotRemaining = (slot: AvailabilitySlot) => Math.max(0, slot.capacity - slot.bookedCapacity);

export function futureSlots(s: MarketplaceState, experienceId: string): AvailabilitySlot[] {
  const today = todayISO();
  return s.slots.
  filter((x) => x.experienceId === experienceId && x.date > today).
  sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
}

export function bookableSlots(s: MarketplaceState, experienceId: string): AvailabilitySlot[] {
  return futureSlots(s, experienceId).filter((x) => x.status === 'open');
}

export function nextAvailable(s: MarketplaceState, experienceId: string, guests = 1): AvailabilitySlot | undefined {
  return bookableSlots(s, experienceId).find((x) => slotRemaining(x) >= guests);
}

export function priceBreakdown(subtotal: number, feePercent: number) {
  const fees = Math.round(subtotal * feePercent / 100);
  return { subtotal, fees, total: subtotal + fees };
}

export const isUpcoming = (b: Booking) => b.bookingStatus === 'confirmed' && b.date >= todayISO();

export const isRequestOpen = (r: CustomRequest) => OPEN_REQUEST_STATUSES.includes(r.status);

export const isProposalExpired = (p: Proposal) => p.status === 'sent' && p.validUntil < todayISO();

export function requestsForProvider(s: MarketplaceState, provider: ProviderProfile): CustomRequest[] {
  return s.requests.filter((r) => {
    const proposed = s.proposals.some((p) => p.requestId === r.id && p.providerId === provider.id);
    return proposed || isRequestOpen(r) && provider.destinations.includes(r.destination);
  });
}

export const reviewForBooking = (s: MarketplaceState, bookingId: string) =>
s.reviews.find((r) => r.bookingId === bookingId && r.status !== 'removed');

export function bookingTitle(s: MarketplaceState, b: Booking): string {
  return b.title || experienceById(s, b.experienceId)?.title || 'Booking';
}

export function bookingImage(s: MarketplaceState, b: Booking): string | undefined {
  return experienceById(s, b.experienceId)?.images[0];
}