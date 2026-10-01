import type { Booking, BookingContact } from '../types/marketplace';
import { ADMIN_ID } from '../data/users';
import { hoursUntil, nowISO, todayISO } from './dates';
import { formatZAR } from './format';
import { cancellationPolicies } from './policies';
import {
  addActivity,
  addNotification,
  assert,
  bookingReference,
  isEmail,
  Op,
  patch,
  requireRole,
  uid } from
'./serviceCore';
import {
  experienceById,
  isExperiencePublic,
  priceBreakdown,
  providerById,
  providerByUserId,
  requestById,
  slotRemaining } from
'./selectors';

export interface CreateBookingInput {
  experienceId: string;
  slotId: string;
  guestCount: number;
  contact: BookingContact;
}

export function validateContact(c: BookingContact): string | null {
  if (c.name.trim().length < 2) return 'Enter the lead traveller’s full name.';
  if (!isEmail(c.email)) return 'Enter a valid email address for your confirmation.';
  if (c.phone.replace(/\D/g, '').length < 9) return 'Enter a phone number your guide can reach you on.';
  return null;
}

/** Creates a booking in Pending Payment. Capacity is only held once payment succeeds. */
export const createBooking: Op<CreateBookingInput, string> = (s, actor, p) => {
  const user = requireRole(actor, 'traveller');
  const exp = experienceById(s, p.experienceId);
  assert(exp && isExperiencePublic(s, exp), 'This experience is no longer available for booking.');
  const slot = s.slots.find((x) => x.id === p.slotId);
  assert(slot && slot.experienceId === exp.id, 'Please choose an available date and time.');
  assert(slot.status === 'open' && slot.date > todayISO(), 'That date is no longer available. Please choose another date.');
  assert(Number.isInteger(p.guestCount) && p.guestCount >= 1, 'Add at least one traveller.');
  assert(p.guestCount <= exp.maxGuests, `This experience takes a maximum of ${exp.maxGuests} guests per booking.`);
  const remaining = slotRemaining(slot);
  assert(remaining > 0, 'This time slot is fully booked. Please choose another time.');
  assert(p.guestCount <= remaining, `Only ${remaining} spot${remaining === 1 ? '' : 's'} left for this time.`);
  const contactError = validateContact(p.contact);
  assert(!contactError, contactError ?? '');

  const price = priceBreakdown(exp.price * p.guestCount, s.settings.serviceFeePercent);
  const booking: Booking = {
    id: uid('b'),
    reference: bookingReference(),
    travellerId: user.id,
    providerId: exp.providerId,
    experienceId: exp.id,
    slotId: slot.id,
    title: exp.title,
    date: slot.date,
    time: slot.time,
    guestCount: p.guestCount,
    ...price,
    paymentStatus: 'unpaid',
    bookingStatus: 'pending_payment',
    contact: p.contact,
    meetingPoint: exp.meetingPoint,
    cancellationPolicy: exp.cancellationPolicy,
    createdAt: nowISO()
  };
  return { state: { ...s, bookings: [booking, ...s.bookings] }, result: booking.id };
};

export interface PaymentInput {
  bookingId: string;
  cardName: string;
  cardNumber: string;
  expiry: string;
  cvc: string;
}

export interface PaymentResult {
  ok: boolean;
  reason?: string;
}

export function validateCard(p: Omit<PaymentInput, 'bookingId'>): Partial<Record<'cardName' | 'cardNumber' | 'expiry' | 'cvc', string>> {
  const errors: Partial<Record<'cardName' | 'cardNumber' | 'expiry' | 'cvc', string>> = {};
  if (p.cardName.trim().length < 2) errors.cardName = 'Enter the name on the card.';
  if (p.cardNumber.replace(/\D/g, '').length !== 16) errors.cardNumber = 'Card number must be 16 digits.';
  const m = p.expiry.match(/^(\d{2})\s*\/\s*(\d{2})$/);
  if (!m || Number(m[1]) < 1 || Number(m[1]) > 12) errors.expiry = 'Use MM/YY.';
  if (!/^\d{3,4}$/.test(p.cvc)) errors.cvc = '3 or 4 digits.';
  return errors;
}

export const processPayment: Op<PaymentInput, PaymentResult> = (s, actor, p) => {
  const user = requireRole(actor, 'traveller');
  const b = s.bookings.find((x) => x.id === p.bookingId);
  assert(b && b.travellerId === user.id, 'We couldn’t find that booking.');
  assert(b.bookingStatus === 'pending_payment' || b.bookingStatus === 'payment_failed', 'This booking has already been processed.');
  const cardErrors = validateCard(p);
  assert(Object.keys(cardErrors).length === 0, 'Please check your card details.');

  const slot = b.slotId ? s.slots.find((x) => x.id === b.slotId) : undefined;
  if (b.slotId) {
    assert(
      slot && slot.status === 'open' && slotRemaining(slot) >= b.guestCount,
      'This time slot filled up before your payment went through. You have not been charged — please choose another time.'
    );
  }
  if (b.customRequestId) {
    const req = requestById(s, b.customRequestId);
    assert(req && req.status === 'accepted', 'This custom request is no longer awaiting payment.');
  }

  const digits = p.cardNumber.replace(/\D/g, '');
  const provider = providerById(s, b.providerId);
  let next = s;

  if (digits.endsWith('0002')) {
    const reason = 'Your card was declined by the issuing bank. No money was taken.';
    next = { ...next, bookings: patch(next.bookings, b.id, { bookingStatus: 'payment_failed', paymentStatus: 'failed', failureReason: reason, paymentLast4: digits.slice(-4) }) };
    next = addNotification(next, { userId: user.id, type: 'payment', title: 'Payment failed', message: `Your payment for ${b.title} was declined. Your booking details are saved — try again with another card.`, link: '/account/bookings' });
    next = addActivity(next, { type: 'payment', actorId: user.id, message: `Payment declined for ${b.reference} (${b.title})` });
    return { state: next, result: { ok: false, reason } };
  }

  next = { ...next, bookings: patch(next.bookings, b.id, { bookingStatus: 'confirmed', paymentStatus: 'paid', failureReason: undefined, paymentLast4: digits.slice(-4) }) };
  if (slot) next = { ...next, slots: patch(next.slots, slot.id, { bookedCapacity: slot.bookedCapacity + b.guestCount }) };
  if (b.customRequestId) {
    next = { ...next, requests: patch(next.requests, b.customRequestId, { status: 'booking_created', bookingId: b.id, updatedAt: nowISO() }) };
  }
  next = addNotification(next, { userId: user.id, type: 'booking', title: 'Booking confirmed', message: `${b.title} on ${b.date} for ${b.guestCount} guest${b.guestCount === 1 ? '' : 's'} is confirmed. Reference ${b.reference}.`, link: '/account/bookings' });
  if (provider) {
    next = addNotification(next, { userId: provider.userId, type: 'booking', title: 'New booking', message: `${b.contact.name} booked ${b.title} for ${b.guestCount} on ${b.date} (${formatZAR(b.subtotal)}).`, link: '/provider/bookings' });
  }
  next = addActivity(next, { type: 'booking', actorId: user.id, message: `${user.name} booked ${b.title} · ${b.reference}`, link: '/admin/bookings' });
  return { state: next, result: { ok: true } };
};

export interface CancelInput {
  bookingId: string;
}

export function refundOutcome(b: Booking, byRole: 'traveller' | 'provider' | 'admin'): 'refunded' | 'not_refunded' | null {
  if (b.paymentStatus !== 'paid') return null;
  if (byRole !== 'traveller') return 'refunded';
  return hoursUntil(b.date, b.time) >= cancellationPolicies[b.cancellationPolicy].hours ? 'refunded' : 'not_refunded';
}

export const cancelBooking: Op<CancelInput> = (s, actor, p) => {
  const user = requireRole(actor, 'traveller', 'provider', 'admin');
  const b = s.bookings.find((x) => x.id === p.bookingId);
  assert(b, 'We couldn’t find that booking.');
  const ownProvider = providerByUserId(s, user.id);
  const allowed = user.role === 'admin' || b.travellerId === user.id || user.role === 'provider' && ownProvider?.id === b.providerId;
  assert(allowed, 'You don’t have permission to cancel this booking.');
  assert(['confirmed', 'pending_payment', 'payment_failed'].includes(b.bookingStatus), 'Only active bookings can be cancelled.');
  assert(b.date >= todayISO(), 'This experience has already taken place.');

  const refund = refundOutcome(b, user.role);
  let next = { ...s, bookings: patch(s.bookings, b.id, { bookingStatus: 'cancelled' as const, paymentStatus: refund ?? b.paymentStatus, cancelledBy: user.role }) };
  if (b.bookingStatus === 'confirmed' && b.slotId) {
    const slot = next.slots.find((x) => x.id === b.slotId);
    if (slot) next = { ...next, slots: patch(next.slots, slot.id, { bookedCapacity: Math.max(0, slot.bookedCapacity - b.guestCount) }) };
  }
  if (b.customRequestId) next = { ...next, requests: patch(next.requests, b.customRequestId, { status: 'cancelled', updatedAt: nowISO() }) };

  const provider = providerById(s, b.providerId);
  const refundText = refund === 'refunded' ? ` A full refund of ${formatZAR(b.total)} is on its way.` : refund === 'not_refunded' ? ' This cancellation was outside the free cancellation window, so it is not refunded.' : '';
  next = addNotification(next, { userId: b.travellerId, type: 'booking', title: 'Booking cancelled', message: `${b.title} on ${b.date} was cancelled.${refundText}`, link: '/account/bookings' });
  if (provider && user.role !== 'provider') {
    next = addNotification(next, { userId: provider.userId, type: 'booking', title: 'Booking cancelled', message: `${b.contact.name} cancelled ${b.title} on ${b.date}. ${b.guestCount} spot${b.guestCount === 1 ? '' : 's'} released.`, link: '/provider/bookings' });
  }
  if (user.role !== 'admin') next = addActivity(next, { type: 'booking', actorId: user.id, message: `${b.reference} cancelled by ${user.role}` });else
  next = addActivity(next, { type: 'booking', actorId: ADMIN_ID, message: `${b.reference} cancelled by admin` });
  return { state: next, result: undefined };
};

export const completeBooking: Op<{bookingId: string;}> = (s, actor, p) => {
  const user = requireRole(actor, 'traveller', 'provider', 'admin');
  const b = s.bookings.find((x) => x.id === p.bookingId);
  assert(b, 'We couldn’t find that booking.');
  const ownProvider = providerByUserId(s, user.id);
  const allowed = user.role === 'admin' || b.travellerId === user.id || ownProvider?.id === b.providerId;
  assert(allowed, 'You don’t have permission to update this booking.');
  assert(b.bookingStatus === 'confirmed', 'Only confirmed bookings can be marked as completed.');

  let next = { ...s, bookings: patch(s.bookings, b.id, { bookingStatus: 'completed' as const }) };
  if (b.customRequestId) next = { ...next, requests: patch(next.requests, b.customRequestId, { status: 'completed', updatedAt: nowISO() }) };
  next = addNotification(next, { userId: b.travellerId, type: 'review', title: `How was ${b.title}?`, message: 'Your experience is complete. Share a review to help other travellers choose.', link: '/account/bookings' });
  next = addActivity(next, { type: 'booking', actorId: user.id, message: `${b.reference} marked completed` });
  return { state: next, result: undefined };
};