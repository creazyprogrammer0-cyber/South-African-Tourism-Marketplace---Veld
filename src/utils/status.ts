import type {
  Booking,
  ExperienceStatus,
  PaymentStatus,
  ProposalStatus,
  RequestStatus,
  VerificationStatus } from
'../types/marketplace';
import { todayISO } from './dates';

export type Tone = 'neutral' | 'success' | 'warning' | 'danger' | 'info' | 'accent';

export interface StatusMeta {
  label: string;
  tone: Tone;
}

export const verificationMeta: Record<VerificationStatus, StatusMeta> = {
  draft: { label: 'Draft', tone: 'neutral' },
  submitted: { label: 'Submitted', tone: 'info' },
  under_review: { label: 'Under review', tone: 'info' },
  changes_requested: { label: 'Changes requested', tone: 'warning' },
  approved: { label: 'Verified', tone: 'success' },
  rejected: { label: 'Rejected', tone: 'danger' }
};

export const experienceMeta: Record<ExperienceStatus, StatusMeta> = {
  draft: { label: 'Draft', tone: 'neutral' },
  published: { label: 'Published', tone: 'success' },
  unpublished: { label: 'Unpublished', tone: 'warning' }
};

export const paymentMeta: Record<PaymentStatus, StatusMeta> = {
  unpaid: { label: 'Awaiting payment', tone: 'warning' },
  paid: { label: 'Paid', tone: 'success' },
  failed: { label: 'Payment failed', tone: 'danger' },
  refunded: { label: 'Refunded', tone: 'info' },
  not_refunded: { label: 'Not refunded', tone: 'neutral' }
};

export const requestMeta: Record<RequestStatus, StatusMeta> = {
  submitted: { label: 'Submitted', tone: 'neutral' },
  under_review: { label: 'Under review', tone: 'info' },
  matched: { label: 'Provider interested', tone: 'info' },
  proposal_received: { label: 'Proposal received', tone: 'accent' },
  customer_reviewing: { label: 'Reviewing proposals', tone: 'accent' },
  accepted: { label: 'Accepted · awaiting payment', tone: 'warning' },
  booking_created: { label: 'Booked', tone: 'success' },
  completed: { label: 'Completed', tone: 'success' },
  cancelled: { label: 'Cancelled', tone: 'danger' },
  closed: { label: 'Closed', tone: 'neutral' }
};

export const proposalMeta: Record<ProposalStatus | 'expired', StatusMeta> = {
  sent: { label: 'Awaiting response', tone: 'accent' },
  accepted: { label: 'Accepted', tone: 'success' },
  declined: { label: 'Declined', tone: 'neutral' },
  withdrawn: { label: 'Withdrawn', tone: 'neutral' },
  expired: { label: 'Expired', tone: 'neutral' }
};

export type BookingDisplayKey = 'pending_payment' | 'upcoming' | 'awaiting_completion' | 'completed' | 'cancelled' | 'payment_failed';

export const bookingDisplayMeta: Record<BookingDisplayKey, StatusMeta> = {
  pending_payment: { label: 'Pending payment', tone: 'warning' },
  upcoming: { label: 'Upcoming', tone: 'info' },
  awaiting_completion: { label: 'Confirmed', tone: 'info' },
  completed: { label: 'Completed', tone: 'success' },
  cancelled: { label: 'Cancelled', tone: 'neutral' },
  payment_failed: { label: 'Payment failed', tone: 'danger' }
};

export function bookingDisplayKey(b: Booking): BookingDisplayKey {
  if (b.bookingStatus === 'confirmed') return b.date >= todayISO() ? 'upcoming' : 'awaiting_completion';
  return b.bookingStatus;
}

export const OPEN_REQUEST_STATUSES: RequestStatus[] = ['submitted', 'under_review', 'matched', 'proposal_received', 'customer_reviewing'];

export const REQUEST_FLOW: {key: RequestStatus;label: string;}[] = [
{ key: 'submitted', label: 'Submitted' },
{ key: 'under_review', label: 'Under review' },
{ key: 'matched', label: 'Provider matched' },
{ key: 'proposal_received', label: 'Proposal received' },
{ key: 'accepted', label: 'Accepted' },
{ key: 'booking_created', label: 'Booked' },
{ key: 'completed', label: 'Completed' }];