import type { ActivityEvent, AvailabilitySlot, Booking, MarketplaceState, Notification, Review } from '../types/marketplace';
import { seedUsers, ADMIN_ID } from '../data/users';
import { seedProviders } from '../data/providers';
import { seedExperiences } from '../data/experiences';
import { seedBookings } from '../data/bookings';
import { seedRequests, seedProposals } from '../data/requests';
import { seedReviews } from '../data/reviews';
import { dateFromToday, isoDaysAgo } from './dates';
import { generateSlots } from './experienceService';
import { priceBreakdown } from './selectors';

export const STATE_VERSION = 3;
const FEE = 8;

export function buildInitialState(): MarketplaceState {
  const experiences = seedExperiences.map((e) => ({ ...e }));
  let slots: AvailabilitySlot[] = [];
  experiences.
  filter((e) => e.status !== 'draft').
  forEach((e) => {
    slots = slots.concat(generateSlots(e.id, e.weekdays, e.times, e.maxGuests, 45));
  });
  // Blocked dates & a provider holiday
  slots = slots.map((s, i): AvailabilitySlot => s.experienceId === 'e-peninsula-photo' && s.date === dateFromToday(10) ? { ...s, status: 'blocked' } : i % 37 === 0 && s.experienceId !== 'e-lionshead' ? { ...s, status: 'blocked' } : s);

  const userMap = new Map(seedUsers.map((u) => [u.id, u]));
  const bookings: Booking[] = seedBookings.map((sb) => {
    const exp = experiences.find((e) => e.id === sb.experienceId);
    const traveller = userMap.get(sb.travellerId)!;
    const date = dateFromToday(sb.dayOffset);
    let slotId: string | undefined;
    if (exp && sb.dayOffset > 0) {
      let slot = slots.find((s) => s.experienceId === exp.id && s.date === date && s.time === sb.time);
      if (!slot) {
        slot = { id: `s-${exp.id}-${date}-${sb.time.replace(':', '')}`, experienceId: exp.id, date, time: sb.time, capacity: exp.maxGuests, bookedCapacity: 0, status: 'open' };
        slots.push(slot);
      }
      slot.status = 'open';
      if (sb.bookingStatus === 'confirmed') slot.bookedCapacity += sb.guestCount;
      slotId = slot.id;
    }
    const subtotal = sb.subtotal ?? (exp ? exp.price * sb.guestCount : 0);
    return {
      id: sb.id,
      reference: `VLD-${sb.id.replace(/\D/g, '').padStart(6, '4')}`,
      travellerId: sb.travellerId,
      providerId: sb.providerId ?? exp!.providerId,
      experienceId: sb.experienceId,
      customRequestId: sb.customRequestId,
      proposalId: sb.proposalId,
      slotId,
      title: sb.title ?? exp!.title,
      date,
      time: sb.time,
      guestCount: sb.guestCount,
      ...priceBreakdown(subtotal, FEE),
      paymentStatus: sb.paymentStatus,
      bookingStatus: sb.bookingStatus,
      contact: { name: traveller.name, email: traveller.email, phone: traveller.phone ?? '+27 21 555 0100' },
      meetingPoint: sb.meetingPoint ?? exp!.meetingPoint,
      cancellationPolicy: exp?.cancellationPolicy ?? 'moderate',
      paymentLast4: sb.paymentStatus === 'unpaid' ? undefined : sb.paymentStatus === 'failed' ? '0002' : '4242',
      failureReason: sb.failureReason,
      cancelledBy: sb.bookingStatus === 'cancelled' ? 'traveller' : undefined,
      createdAt: isoDaysAgo(sb.createdDaysAgo)
    };
  });

  const reviews: Review[] = seedReviews.map((rs) => {
    let bookingId = rs.bookingId;
    const exp = experiences.find((e) => e.id === rs.experienceId);
    const providerId = rs.providerId ?? exp!.providerId;
    if (!bookingId) {
      const traveller = userMap.get(rs.travellerId)!;
      const subtotal = exp ? exp.price * rs.guests : 0;
      bookingId = `hb-${rs.id}`;
      bookings.push({
        id: bookingId, reference: `VLD-3${rs.id.replace(/\D/g, '').padStart(5, '0')}`, travellerId: rs.travellerId, providerId,
        experienceId: rs.experienceId, title: exp?.title ?? 'Experience', date: dateFromToday(-(rs.daysAgo + 1)), time: exp?.times[0] ?? '09:00',
        guestCount: rs.guests, ...priceBreakdown(subtotal, FEE), paymentStatus: 'paid', bookingStatus: 'completed',
        contact: { name: traveller.name, email: traveller.email, phone: '+27 21 555 0100' }, meetingPoint: exp?.meetingPoint ?? '',
        cancellationPolicy: exp?.cancellationPolicy ?? 'moderate', paymentLast4: '4242', createdAt: isoDaysAgo(rs.daysAgo + 20)
      });
    }
    return { id: rs.id, bookingId, travellerId: rs.travellerId, providerId, experienceId: rs.experienceId, rating: rs.rating, comment: rs.comment, status: rs.status ?? 'published', createdAt: isoDaysAgo(rs.daysAgo) };
  });

  const n = (id: string, userId: string, type: Notification['type'], title: string, message: string, link: string, days: number, read = false): Notification => ({ id, userId, type, title, message, link, read, createdAt: isoDaysAgo(days, 9) });
  const notifications: Notification[] = [
  n('n-1', 'u-sarah', 'payment', 'Payment failed', 'Your payment for Walker Bay Boat-Based Whale Watching was declined. Your booking details are saved — try again with another card.', '/account/bookings', 1),
  n('n-2', 'u-sarah', 'request', 'Request under review', 'Our team is matching your Cape Town photography trip with suitable local providers.', '/account/requests/cr-1', 1),
  n('n-3', 'u-sarah', 'review', 'How was Kruger Sunrise Game Drive?', 'Your experience is complete. Share a review to help other travellers choose.', '/account/bookings', 8, true),
  n('n-4', 'u-sarah', 'booking', 'Booking confirmed', 'Garden Route 3-Day Adventure is confirmed for 2 guests.', '/account/bookings', 6, true),
  n('n-5', 'u-thabo', 'booking', 'New booking', 'Emma Lindqvist booked Lion’s Head Sunrise Hike for 2. Only 2 spots remain on that date.', '/provider/bookings', 5),
  n('n-6', 'u-thabo', 'request', 'New request in Cape Town', '4 travellers interested in photography, nature, local food.', '/provider/requests', 2),
  n('n-7', 'u-thabo', 'review', 'New 5-star review', 'Michael Chen reviewed Bo-Kaap Food & Stories Walk.', '/provider/reviews', 4, true),
  n('n-8', 'u-thabo', 'request', 'New request in Cape Town', '3 travellers need a wheelchair-accessible itinerary.', '/provider/requests', 9, true),
  n('n-9', 'u-lindiwe', 'application', 'Changes requested', 'Please upload your tourist guide registration or a letter confirming your registration is in progress, and add a profile photo.', '/provider/verification', 15),
  n('n-10', ADMIN_ID, 'application', 'New provider application', 'Karoo Overland (Ruan Botha) is ready for review.', '/admin/applications', 4),
  n('n-11', ADMIN_ID, 'review', 'Review flagged', 'A review on Maboneng & Inner-City Street Art Walk was flagged for containing contact details.', '/admin/reviews', 6),
  n('n-12', ADMIN_ID, 'request', 'Request waiting 9 days', 'Wheelchair-accessible Cape Town highlights has no proposals yet.', '/admin/requests', 1)];


  const a = (id: string, type: ActivityEvent['type'], actorId: string, message: string, days: number, hour = 10): ActivityEvent => ({ id, type, actorId, message, createdAt: isoDaysAgo(days, hour) });
  const activity: ActivityEvent[] = [
  a('a-1', 'payment', 'u-sarah', 'Payment declined for VLD-441004 (Walker Bay Boat-Based Whale Watching)', 1, 16),
  a('a-2', 'request', 'u-sarah', 'Sarah Morgan submitted a custom request for Cape Town', 2, 11),
  a('a-3', 'proposal', 'u-thabo', 'Mokoena Trails & Tables sent a proposal on “Cape Town street food evening” (R 3 150)', 2, 9),
  a('a-4', 'booking', 'u-t3', 'Rajesh Pillay booked Storms River Kayak & Lilo Gorge · VLD-441017', 3, 14),
  a('a-5', 'application', 'u-ruan', 'Karoo Overland submitted a provider application', 4, 10),
  a('a-6', 'booking', 'u-t2', 'Emma Lindqvist booked Lion’s Head Sunrise Hike · VLD-441008', 5, 8),
  a('a-7', 'review', 'u-t6', 'Review flagged automatically: contains a phone number', 6, 12),
  a('a-8', 'proposal', 'u-sarah', 'Sarah Morgan accepted Tsitsikamma Edge Adventures’ proposal (R 14 400)', 6, 18),
  a('a-9', 'application', ADMIN_ID, 'Under review: Highveld Photo Walks', 9, 9),
  a('a-10', 'application', ADMIN_ID, 'Lindiwe’s Cape Kitchen: changes requested', 15, 15)];


  return {
    version: STATE_VERSION,
    currentUserId: null,
    users: seedUsers.map((u) => ({ ...u })),
    providers: seedProviders.map((p) => ({ ...p })),
    experiences,
    slots,
    bookings,
    requests: seedRequests.map((r) => ({ ...r })),
    proposals: seedProposals.map((p) => ({ ...p })),
    reviews,
    notifications,
    activity,
    settings: { serviceFeePercent: FEE, proposalValidityDays: 7, simulateNetworkErrors: false }
  };
}