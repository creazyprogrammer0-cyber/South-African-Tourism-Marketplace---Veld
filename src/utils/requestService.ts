import type { Booking, CustomRequest, ItineraryItem, Proposal, TravelPace } from '../types/marketplace';
import { ADMIN_ID } from '../data/users';
import { destinations } from '../data/catalog';
import { dateFromToday, nowISO, todayISO } from './dates';
import { formatZAR } from './format';
import { addActivity, addNotification, assert, bookingReference, Op, patch, requireRole, uid } from './serviceCore';
import { isProposalExpired, isProviderLive, isRequestOpen, priceBreakdown, providerById, providerByUserId, userById } from './selectors';

const destName = (id: string) => destinations.find((d) => d.id === id)?.name ?? id;

export interface RequestInput {
  destination: string;
  startDate: string;
  endDate: string;
  flexibleDates: boolean;
  guestCount: number;
  interests: string[];
  pace: TravelPace;
  preferences: string[];
  budgetMin: number;
  budgetMax: number;
  requirements: string;
}

export function validateRequest(p: RequestInput): Partial<Record<keyof RequestInput, string>> {
  const e: Partial<Record<keyof RequestInput, string>> = {};
  if (!p.destination) e.destination = 'Choose a destination.';
  if (!p.startDate) e.startDate = 'Choose a start date.';else
  if (p.startDate <= todayISO()) e.startDate = 'Start date must be in the future.';
  if (!p.endDate) e.endDate = 'Choose an end date.';else
  if (p.startDate && p.endDate < p.startDate) e.endDate = 'End date must be on or after the start date.';
  if (!Number.isInteger(p.guestCount) || p.guestCount < 1 || p.guestCount > 20) e.guestCount = 'Between 1 and 20 travellers.';
  if (p.interests.length === 0) e.interests = 'Pick at least one interest so providers know what to plan.';
  if (!p.budgetMax || p.budgetMax < 500) e.budgetMax = 'Enter a budget of at least R 500.';else
  if (p.budgetMin > p.budgetMax) e.budgetMin = 'Minimum can’t be more than maximum.';
  return e;
}

export const submitRequest: Op<RequestInput, string> = (s, actor, p) => {
  const user = requireRole(actor, 'traveller');
  assert(Object.keys(validateRequest(p)).length === 0, 'Please complete the highlighted fields.');
  const days = Math.round((new Date(p.endDate).getTime() - new Date(p.startDate).getTime()) / 864e5) + 1;
  const req: CustomRequest = {
    id: uid('cr'),
    travellerId: user.id,
    title: `${days}-day ${destName(p.destination)} trip: ${p.interests.slice(0, 3).join(', ').toLowerCase()}`,
    ...p,
    requirements: p.requirements.trim(),
    status: 'submitted',
    interestedProviderIds: [],
    createdAt: nowISO(),
    updatedAt: nowISO()
  };
  let next: typeof s = { ...s, requests: [req, ...s.requests] };
  next = addNotification(next, { userId: user.id, type: 'request', title: 'Request submitted', message: `We’ve shared your ${destName(p.destination)} request with verified local providers. Proposals usually arrive within 48 hours.`, link: `/account/requests/${req.id}` });
  next = addNotification(next, { userId: ADMIN_ID, type: 'request', title: 'New custom request', message: `${user.name} · ${destName(p.destination)} · ${p.guestCount} guests · up to ${formatZAR(p.budgetMax)}`, link: '/admin/requests' });
  s.providers.
  filter((pr) => isProviderLive(s, pr) && pr.destinations.includes(p.destination)).
  forEach((pr) => {
    next = addNotification(next, { userId: pr.userId, type: 'request', title: `New request in ${destName(p.destination)}`, message: `${p.guestCount} travellers interested in ${p.interests.join(', ').toLowerCase()}.`, link: '/provider/requests' });
  });
  next = addActivity(next, { type: 'request', actorId: user.id, message: `${user.name} submitted a custom request for ${destName(p.destination)}`, link: '/admin/requests' });
  return { state: next, result: req.id };
};

export const adminSetRequestStatus: Op<{requestId: string;status: 'under_review' | 'closed';}> = (s, actor, p) => {
  requireRole(actor, 'admin');
  const r = s.requests.find((x) => x.id === p.requestId);
  assert(r, 'Request not found.');
  assert(isRequestOpen(r), 'Only open requests can be updated.');
  if (p.status === 'under_review') assert(r.status === 'submitted', 'This request is already being handled.');
  let next = { ...s, requests: patch(s.requests, r.id, { status: p.status, updatedAt: nowISO() }) };
  if (p.status === 'closed') {
    next = { ...next, proposals: next.proposals.map((x) => x.requestId === r.id && x.status === 'sent' ? { ...x, status: 'withdrawn' as const } : x) };
  }
  next = addNotification(next, {
    userId: r.travellerId, type: 'request',
    title: p.status === 'closed' ? 'Request closed' : 'Request under review',
    message: p.status === 'closed' ? `Your request “${r.title}” has been closed by our team. You can submit a new request at any time.` : `Our team is matching “${r.title}” with suitable local providers.`,
    link: `/account/requests/${r.id}`
  });
  next = addActivity(next, { type: 'request', actorId: ADMIN_ID, message: `Request “${r.title}” set to ${p.status.replace('_', ' ')}` });
  return { state: next, result: undefined };
};

export const cancelRequest: Op<{requestId: string;}> = (s, actor, p) => {
  const user = requireRole(actor, 'traveller');
  const r = s.requests.find((x) => x.id === p.requestId);
  assert(r && r.travellerId === user.id, 'Request not found.');
  assert(isRequestOpen(r), 'This request can no longer be cancelled here.');
  let next = { ...s, requests: patch(s.requests, r.id, { status: 'cancelled' as const, updatedAt: nowISO() }) };
  next = { ...next, proposals: next.proposals.map((x) => x.requestId === r.id && x.status === 'sent' ? { ...x, status: 'withdrawn' as const } : x) };
  next = addActivity(next, { type: 'request', actorId: user.id, message: `${user.name} cancelled request “${r.title}”` });
  return { state: next, result: undefined };
};

function requireActiveProvider(s: Parameters<Op<unknown>>[0], actor: Parameters<Op<unknown>>[1]) {
  const user = requireRole(actor, 'provider');
  const provider = providerByUserId(s, user.id);
  assert(provider, 'Provider profile not found.');
  assert(provider.verificationStatus === 'approved', 'Only verified providers can respond to custom requests.');
  return { user, provider };
}

export const expressInterest: Op<{requestId: string;}> = (s, actor, p) => {
  const { provider } = requireActiveProvider(s, actor);
  const r = s.requests.find((x) => x.id === p.requestId);
  assert(r && isRequestOpen(r), 'This request is no longer accepting responses.');
  assert(provider.destinations.includes(r.destination), 'This request is outside your listed destinations.');
  assert(!r.interestedProviderIds.includes(provider.id), 'You’ve already shown interest in this request.');
  const status = r.status === 'submitted' || r.status === 'under_review' ? 'matched' : r.status;
  let next = { ...s, requests: patch(s.requests, r.id, { interestedProviderIds: [...r.interestedProviderIds, provider.id], status, updatedAt: nowISO() }) };
  next = addNotification(next, { userId: r.travellerId, type: 'request', title: 'A provider is interested', message: `${provider.businessName} is preparing a proposal for “${r.title}”.`, link: `/account/requests/${r.id}` });
  next = addActivity(next, { type: 'request', actorId: provider.userId, message: `${provider.businessName} matched with “${r.title}”` });
  return { state: next, result: undefined };
};

export interface ProposalInput {
  requestId: string;
  title: string;
  itinerary: ItineraryItem[];
  price: number;
  date: string;
  duration: string;
  notes: string;
  availabilityNote: string;
}

export function validateProposal(p: ProposalInput): Partial<Record<'title' | 'itinerary' | 'price' | 'date' | 'duration', string>> {
  const e: Partial<Record<'title' | 'itinerary' | 'price' | 'date' | 'duration', string>> = {};
  if (p.title.trim().length < 6) e.title = 'Give your proposal a descriptive title.';
  if (!p.itinerary.length || p.itinerary.some((i) => !i.title.trim() || !i.detail.trim())) e.itinerary = 'Add a title and description for every itinerary day.';
  if (!p.price || p.price < 100) e.price = 'Enter a total price.';
  if (!p.date) e.date = 'Choose a start date.';else
  if (p.date <= todayISO()) e.date = 'Start date must be in the future.';
  if (!p.duration.trim()) e.duration = 'Enter a duration, e.g. 4 days.';
  return e;
}

export const submitProposal: Op<ProposalInput, string> = (s, actor, p) => {
  const { user, provider } = requireActiveProvider(s, actor);
  const r = s.requests.find((x) => x.id === p.requestId);
  assert(r, 'This request no longer exists.');
  assert(isRequestOpen(r), 'This request is closed and can’t receive new proposals.');
  assert(provider.destinations.includes(r.destination), 'This request is outside your listed destinations.');
  assert(!s.proposals.some((x) => x.requestId === r.id && x.providerId === provider.id && x.status === 'sent'), 'You already have a proposal awaiting a response on this request.');
  assert(Object.keys(validateProposal(p)).length === 0, 'Please complete the highlighted fields.');
  const proposal: Proposal = {
    id: uid('pr'), requestId: r.id, providerId: provider.id, title: p.title.trim(), itinerary: p.itinerary, price: Math.round(p.price),
    date: p.date, duration: p.duration.trim(), notes: p.notes.trim(), availabilityNote: p.availabilityNote.trim(), status: 'sent',
    validUntil: dateFromToday(s.settings.proposalValidityDays), createdAt: nowISO()
  };
  const interested = r.interestedProviderIds.includes(provider.id) ? r.interestedProviderIds : [...r.interestedProviderIds, provider.id];
  let next = { ...s, proposals: [proposal, ...s.proposals], requests: patch(s.requests, r.id, { status: 'proposal_received' as const, interestedProviderIds: interested, updatedAt: nowISO() }) };
  next = addNotification(next, { userId: r.travellerId, type: 'proposal', title: 'New proposal received', message: `${provider.businessName} sent “${proposal.title}” for ${formatZAR(proposal.price)}.`, link: `/account/requests/${r.id}` });
  next = addActivity(next, { type: 'proposal', actorId: user.id, message: `${provider.businessName} sent a proposal on “${r.title}” (${formatZAR(proposal.price)})`, link: '/admin/requests' });
  return { state: next, result: proposal.id };
};

export const markReviewing: Op<{requestId: string;}> = (s, actor, p) => {
  const user = requireRole(actor, 'traveller');
  const r = s.requests.find((x) => x.id === p.requestId);
  if (!r || r.travellerId !== user.id || r.status !== 'proposal_received') return { state: s, result: undefined };
  return { state: { ...s, requests: patch(s.requests, r.id, { status: 'customer_reviewing' as const }) }, result: undefined };
};

export const declineProposal: Op<{proposalId: string;}> = (s, actor, p) => {
  const user = requireRole(actor, 'traveller');
  const pr = s.proposals.find((x) => x.id === p.proposalId);
  const r = pr && s.requests.find((x) => x.id === pr.requestId);
  assert(pr && r && r.travellerId === user.id, 'Proposal not found.');
  assert(pr.status === 'sent', 'This proposal has already been answered.');
  let next = { ...s, proposals: patch(s.proposals, pr.id, { status: 'declined' as const }) };
  const othersOpen = next.proposals.some((x) => x.requestId === r.id && x.status === 'sent' && !isProposalExpired(x));
  if (!othersOpen) next = { ...next, requests: patch(next.requests, r.id, { status: r.interestedProviderIds.length ? 'matched' : 'under_review', updatedAt: nowISO() }) };
  const provider = providerById(s, pr.providerId);
  if (provider) next = addNotification(next, { userId: provider.userId, type: 'proposal', title: 'Proposal declined', message: `${user.name} declined “${pr.title}”.`, link: '/provider/requests' });
  return { state: next, result: undefined };
};

/** Accepting a proposal converts the request into a booking awaiting payment. */
export const acceptProposal: Op<{proposalId: string;}, string> = (s, actor, p) => {
  const user = requireRole(actor, 'traveller');
  const pr = s.proposals.find((x) => x.id === p.proposalId);
  const r = pr && s.requests.find((x) => x.id === pr.requestId);
  assert(pr && r && r.travellerId === user.id, 'Proposal not found.');
  assert(pr.status === 'sent', 'This proposal is no longer available.');
  assert(!isProposalExpired(pr), 'This proposal has expired. Ask the provider to send an updated one.');
  assert(isRequestOpen(r), 'This request is no longer open.');
  const provider = providerById(s, pr.providerId);
  assert(provider && isProviderLive(s, provider), 'This provider is not currently accepting bookings.');
  const traveller = userById(s, user.id)!;

  const price = priceBreakdown(pr.price, s.settings.serviceFeePercent);
  const booking: Booking = {
    id: uid('b'), reference: bookingReference(), travellerId: user.id, providerId: pr.providerId, customRequestId: r.id, proposalId: pr.id,
    title: pr.title, date: pr.date, time: '09:00', guestCount: r.guestCount, ...price, paymentStatus: 'unpaid', bookingStatus: 'pending_payment',
    contact: { name: traveller.name, email: traveller.email, phone: traveller.phone ?? '' }, meetingPoint: 'Confirmed with your provider after payment',
    cancellationPolicy: 'moderate', createdAt: nowISO()
  };
  let next = {
    ...s,
    bookings: [booking, ...s.bookings],
    proposals: s.proposals.map((x) => x.id === pr.id ? { ...x, status: 'accepted' as const } : x.requestId === r.id && x.status === 'sent' ? { ...x, status: 'declined' as const } : x),
    requests: patch(s.requests, r.id, { status: 'accepted' as const, bookingId: booking.id, updatedAt: nowISO() })
  };
  next = addNotification(next, { userId: provider.userId, type: 'proposal', title: 'Proposal accepted', message: `${user.name} accepted “${pr.title}”. The booking is confirmed once payment is complete.`, link: '/provider/requests' });
  next = addActivity(next, { type: 'proposal', actorId: user.id, message: `${user.name} accepted ${provider.businessName}’s proposal (${formatZAR(pr.price)})`, link: '/admin/requests' });
  return { state: next, result: booking.id };
};