import type { AvailabilitySlot, CancellationPolicy, Experience, MarketplaceState } from '../types/marketplace';
import { ADMIN_ID } from '../data/users';
import { dateFromToday, nowISO, todayISO, weekday } from './dates';
import { addActivity, addNotification, assert, Op, patch, requireRole, uid } from './serviceCore';
import { futureSlots, providerByUserId, userById } from './selectors';

export interface ExperienceInput {
  id?: string;
  title: string;
  summary: string;
  description: string;
  images: string[];
  destination: string;
  category: string;
  durationHours: number;
  price: number;
  maxGuests: number;
  meetingPoint: string;
  inclusions: string[];
  exclusions: string[];
  cancellationPolicy: CancellationPolicy;
  languages: string[];
  times: string[];
  weekdays: number[];
}

export function validateExperience(e: ExperienceInput): Record<string, string> {
  const err: Record<string, string> = {};
  if (e.title.trim().length < 8) err.title = 'Title should be at least 8 characters.';
  if (e.title.trim().length > 110) err.title = 'Keep the title under 110 characters.';
  if (e.summary.trim().length < 20) err.summary = 'Add a one-line summary (20+ characters).';
  if (e.description.trim().length < 80) err.description = 'Describe the experience in at least 80 characters.';
  if (!e.destination) err.destination = 'Choose a destination.';
  if (!e.category) err.category = 'Choose a category.';
  if (!(e.durationHours > 0) || e.durationHours > 72) err.durationHours = 'Enter a duration between 0.5 and 72 hours.';
  if (!(e.price >= 50)) err.price = 'Price per person must be at least R 50.';
  if (!Number.isInteger(e.maxGuests) || e.maxGuests < 1 || e.maxGuests > 40) err.maxGuests = 'Between 1 and 40 guests.';
  if (e.meetingPoint.trim().length < 5) err.meetingPoint = 'Tell guests where to meet.';
  if (!e.languages.length) err.languages = 'Choose at least one language.';
  if (!e.inclusions.length) err.inclusions = 'List at least one inclusion.';
  if (!e.times.length || e.times.some((t) => !/^\d{2}:\d{2}$/.test(t))) err.times = 'Add at least one start time (HH:MM).';
  if (!e.weekdays.length) err.weekdays = 'Choose the days you run this experience.';
  return err;
}

function ownerContext(s: MarketplaceState, actor: Parameters<Op<unknown>>[1]) {
  const user = requireRole(actor, 'provider');
  const provider = providerByUserId(s, user.id);
  assert(provider, 'Provider profile not found.');
  return { user, provider };
}

export function generateSlots(experienceId: string, weekdays: number[], times: string[], capacity: number, days = 45, existing: AvailabilitySlot[] = []): AvailabilitySlot[] {
  const out: AvailabilitySlot[] = [];
  for (let d = 1; d <= days; d++) {
    const date = dateFromToday(d);
    if (!weekdays.includes(weekday(date))) continue;
    times.forEach((time) => {
      if (existing.some((x) => x.experienceId === experienceId && x.date === date && x.time === time)) return;
      out.push({ id: `s-${experienceId}-${date}-${time.replace(':', '')}`, experienceId, date, time, capacity, bookedCapacity: 0, status: 'open' });
    });
  }
  return out;
}

export const saveExperience: Op<ExperienceInput, string> = (s, actor, input) => {
  const { user, provider } = ownerContext(s, actor);
  assert(Object.keys(validateExperience(input)).length === 0, 'Please fix the highlighted fields.');
  const clean = { ...input, title: input.title.trim(), summary: input.summary.trim(), description: input.description.trim(), meetingPoint: input.meetingPoint.trim() };
  if (input.id) {
    const existing = s.experiences.find((e) => e.id === input.id);
    assert(existing && existing.providerId === provider.id, 'You can only edit your own experiences.');
    const maxBooked = Math.max(0, ...futureSlots(s, existing.id).map((x) => x.bookedCapacity));
    assert(clean.maxGuests >= maxBooked, `You already have ${maxBooked} guests booked on one date. Max guests can’t go below that.`);
    const slots = s.slots.map((x) => x.experienceId === existing.id && x.date > todayISO() ? { ...x, capacity: clean.maxGuests } : x);
    const { id: _id, ...rest } = clean;
    return { state: { ...s, slots, experiences: patch(s.experiences, existing.id, { ...rest, updatedAt: nowISO() }) }, result: existing.id };
  }
  const id = uid('e');
  const { id: _omit, ...rest } = clean;
  const exp: Experience = { ...rest, id, providerId: provider.id, status: 'draft', createdAt: nowISO(), updatedAt: nowISO() };
  let next = { ...s, experiences: [exp, ...s.experiences], slots: [...s.slots, ...generateSlots(id, clean.weekdays, clean.times, clean.maxGuests)] };
  next = addActivity(next, { type: 'experience', actorId: user.id, message: `${provider.businessName} created a draft: ${exp.title}` });
  return { state: next, result: id };
};

export const setExperienceStatus: Op<{id: string;status: 'published' | 'unpublished';}> = (s, actor, p) => {
  const { user, provider } = ownerContext(s, actor);
  const exp = s.experiences.find((e) => e.id === p.id);
  assert(exp && exp.providerId === provider.id, 'You can only manage your own experiences.');
  if (p.status === 'published') {
    assert(provider.verificationStatus === 'approved', 'Only verified providers can publish experiences. Complete your verification first.');
    assert(userById(s, user.id)?.status === 'active', 'Your account is suspended.');
    assert(!exp.moderationNote, 'This listing was unpublished by our team. Contact support to have it reviewed before republishing.');
    assert(futureSlots(s, exp.id).some((x) => x.status === 'open'), 'Add at least one available date before publishing.');
  }
  let next = { ...s, experiences: patch(s.experiences, exp.id, { status: p.status, updatedAt: nowISO() }) };
  next = addActivity(next, { type: 'experience', actorId: user.id, message: `${provider.businessName} ${p.status} “${exp.title}”`, link: '/admin/experiences' });
  return { state: next, result: undefined };
};

export const deleteExperience: Op<{id: string;}> = (s, actor, p) => {
  const { provider } = ownerContext(s, actor);
  const exp = s.experiences.find((e) => e.id === p.id);
  assert(exp && exp.providerId === provider.id, 'You can only manage your own experiences.');
  assert(exp.status === 'draft', 'Only drafts can be deleted. Unpublish this experience instead.');
  assert(!s.bookings.some((b) => b.experienceId === exp.id), 'This experience has bookings and can’t be deleted.');
  return { state: { ...s, experiences: s.experiences.filter((e) => e.id !== exp.id), slots: s.slots.filter((x) => x.experienceId !== exp.id) }, result: undefined };
};

export const moderateExperience: Op<{id: string;action: 'unpublish' | 'restore';note: string;}> = (s, actor, p) => {
  requireRole(actor, 'admin');
  const exp = s.experiences.find((e) => e.id === p.id);
  assert(exp, 'Experience not found.');
  const providerUser = s.providers.find((x) => x.id === exp.providerId)?.userId;
  let next = s;
  if (p.action === 'unpublish') {
    assert(exp.status === 'published', 'Only published experiences can be unpublished.');
    assert(p.note.trim().length >= 10, 'Explain the reason so the provider can fix it.');
    next = { ...s, experiences: patch(s.experiences, exp.id, { status: 'unpublished' as const, moderationNote: p.note.trim() }) };
    if (providerUser) next = addNotification(next, { userId: providerUser, type: 'experience', title: 'Listing unpublished by Veld', message: `“${exp.title}” was removed from discovery: ${p.note.trim()}`, link: '/provider/experiences' });
  } else {
    assert(exp.moderationNote, 'This experience has no moderation hold.');
    next = { ...s, experiences: patch(s.experiences, exp.id, { moderationNote: undefined }) };
    if (providerUser) next = addNotification(next, { userId: providerUser, type: 'experience', title: 'Moderation hold lifted', message: `You can republish “${exp.title}” whenever you’re ready.`, link: '/provider/experiences' });
  }
  next = addActivity(next, { type: 'experience', actorId: ADMIN_ID, message: `Admin ${p.action === 'unpublish' ? 'unpublished' : 'lifted hold on'} “${exp.title}”` });
  return { state: next, result: undefined };
};

// ——— Availability

function ownedExperience(s: MarketplaceState, actor: Parameters<Op<unknown>>[1], experienceId: string) {
  const { provider } = ownerContext(s, actor);
  const exp = s.experiences.find((e) => e.id === experienceId);
  assert(exp && exp.providerId === provider.id, 'You can only manage availability for your own experiences.');
  return exp;
}

export const addSlots: Op<{experienceId: string;dates: string[];times: string[];capacity: number;}, number> = (s, actor, p) => {
  const exp = ownedExperience(s, actor, p.experienceId);
  assert(p.dates.length > 0, 'Choose at least one date.');
  assert(p.dates.every((d) => d > todayISO()), 'Dates must be in the future.');
  assert(p.times.length > 0 && p.times.every((t) => /^\d{2}:\d{2}$/.test(t)), 'Add at least one start time.');
  assert(Number.isInteger(p.capacity) && p.capacity >= 1 && p.capacity <= exp.maxGuests, `Capacity must be between 1 and ${exp.maxGuests}.`);
  const created: AvailabilitySlot[] = [];
  p.dates.forEach((date) =>
  p.times.forEach((time) => {
    if (s.slots.some((x) => x.experienceId === exp.id && x.date === date && x.time === time)) return;
    created.push({ id: `s-${exp.id}-${date}-${time.replace(':', '')}`, experienceId: exp.id, date, time, capacity: p.capacity, bookedCapacity: 0, status: 'open' });
  })
  );
  assert(created.length > 0, 'Those dates and times already exist.');
  return { state: { ...s, slots: [...s.slots, ...created] }, result: created.length };
};

export const updateSlot: Op<{slotId: string;capacity?: number;status?: 'open' | 'blocked';}> = (s, actor, p) => {
  const slot = s.slots.find((x) => x.id === p.slotId);
  assert(slot, 'Time slot not found.');
  const exp = ownedExperience(s, actor, slot.experienceId);
  const changes: Partial<AvailabilitySlot> = {};
  if (p.capacity !== undefined) {
    assert(p.capacity >= slot.bookedCapacity, `${slot.bookedCapacity} guests are already booked — capacity can’t go lower.`);
    assert(p.capacity >= 1 && p.capacity <= exp.maxGuests, `Capacity must be between 1 and ${exp.maxGuests}.`);
    changes.capacity = p.capacity;
  }
  if (p.status) {
    if (p.status === 'blocked') assert(slot.bookedCapacity === 0, 'This slot has bookings. Cancel or move them before blocking the date.');
    changes.status = p.status;
  }
  return { state: { ...s, slots: patch(s.slots, slot.id, changes) }, result: undefined };
};

export const deleteSlot: Op<{slotId: string;}> = (s, actor, p) => {
  const slot = s.slots.find((x) => x.id === p.slotId);
  assert(slot, 'Time slot not found.');
  ownedExperience(s, actor, slot.experienceId);
  assert(slot.bookedCapacity === 0, 'Slots with bookings can’t be removed.');
  return { state: { ...s, slots: s.slots.filter((x) => x.id !== slot.id) }, result: undefined };
};