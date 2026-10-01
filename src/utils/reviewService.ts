import type { Review } from '../types/marketplace';
import { ADMIN_ID } from '../data/users';
import { nowISO } from './dates';
import { addActivity, addNotification, assert, Op, patch, requireRole, uid } from './serviceCore';
import { providerById } from './selectors';

export const submitReview: Op<{bookingId: string;rating: number;comment: string;}, string> = (s, actor, p) => {
  const user = requireRole(actor, 'traveller');
  const b = s.bookings.find((x) => x.id === p.bookingId);
  assert(b && b.travellerId === user.id, 'You can only review experiences you have booked.');
  assert(b.bookingStatus === 'completed', 'You can review this experience once it has been completed.');
  assert(!s.reviews.some((r) => r.bookingId === b.id), 'You’ve already reviewed this booking.');
  assert(Number.isInteger(p.rating) && p.rating >= 1 && p.rating <= 5, 'Choose a rating from 1 to 5 stars.');
  assert(p.comment.trim().length >= 20, 'Write at least 20 characters so other travellers know what to expect.');
  const review: Review = { id: uid('r'), bookingId: b.id, travellerId: user.id, providerId: b.providerId, experienceId: b.experienceId, rating: p.rating, comment: p.comment.trim(), status: 'published', createdAt: nowISO() };
  let next = { ...s, reviews: [review, ...s.reviews] };
  const provider = providerById(s, b.providerId);
  if (provider) next = addNotification(next, { userId: provider.userId, type: 'review', title: `New ${p.rating}-star review`, message: `${user.name} reviewed ${b.title}: “${review.comment.slice(0, 80)}${review.comment.length > 80 ? '…' : ''}”`, link: '/provider/reviews' });
  next = addActivity(next, { type: 'review', actorId: user.id, message: `${user.name} left a ${p.rating}-star review for ${b.title}`, link: '/admin/reviews' });
  return { state: next, result: review.id };
};

export const moderateReview: Op<{reviewId: string;action: 'remove' | 'restore';note?: string;}> = (s, actor, p) => {
  requireRole(actor, 'admin');
  const r = s.reviews.find((x) => x.id === p.reviewId);
  assert(r, 'Review not found.');
  if (p.action === 'remove') assert(r.status !== 'removed', 'This review is already removed.');else
  assert(r.status !== 'published', 'This review is already published.');
  let next = { ...s, reviews: patch(s.reviews, r.id, { status: p.action === 'remove' ? 'removed' as const : 'published' as const, moderationNote: p.note?.trim() || undefined }) };
  next = addActivity(next, { type: 'review', actorId: ADMIN_ID, message: `Review ${p.action === 'remove' ? 'removed' : 'restored'}${p.note ? `: ${p.note}` : ''}` });
  return { state: next, result: undefined };
};