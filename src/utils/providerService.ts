import type { DocumentType, ProviderProfile, User, VerificationDocument } from '../types/marketplace';
import { ADMIN_ID } from '../data/users';
import { documentTypes } from '../data/catalog';
import { nowISO } from './dates';
import { addActivity, addNotification, assert, isEmail, Op, patch, requireRole, uid } from './serviceCore';
import { providerByUserId } from './selectors';

export const registerProvider: Op<{name: string;email: string;}, string> = (s, _actor, p) => {
  assert(p.name.trim().length >= 2, 'Enter your full name.');
  assert(isEmail(p.email), 'Enter a valid email address.');
  assert(!s.users.some((u) => u.email.toLowerCase() === p.email.trim().toLowerCase()), 'An account with this email already exists. Sign in instead.');
  const user: User = { id: uid('u'), role: 'provider', name: p.name.trim(), email: p.email.trim(), status: 'active', createdAt: nowISO() };
  const profile: ProviderProfile = {
    id: uid('p'), userId: user.id, businessName: '', contactName: user.name, phone: '', bio: '', background: '', yearsExperience: 0,
    destinations: [], languages: [], specialties: [], verificationStatus: 'draft', verificationDocuments: [], createdAt: nowISO()
  };
  return { state: { ...s, users: [...s.users, user], providers: [...s.providers, profile], currentUserId: user.id }, result: user.id };
};

export type ApplicationDraft = Pick<
  ProviderProfile,
  'businessName' | 'contactName' | 'phone' | 'bio' | 'background' | 'yearsExperience' | 'destinations' | 'languages' | 'specialties' | 'photo'> &
{verificationDocuments: VerificationDocument[];};

export function validateApplication(d: ApplicationDraft): Record<string, string> {
  const e: Record<string, string> = {};
  if (d.businessName.trim().length < 2) e.businessName = 'Enter your trading or business name.';
  if (d.contactName.trim().length < 2) e.contactName = 'Enter the main contact’s name.';
  if (d.phone.replace(/\D/g, '').length < 9) e.phone = 'Enter a valid phone number.';
  if (!d.destinations.length) e.destinations = 'Choose at least one destination.';
  if (!d.languages.length) e.languages = 'Choose at least one guiding language.';
  if (!d.specialties.length) e.specialties = 'Choose at least one specialty.';
  if (d.bio.trim().length < 60) e.bio = 'Tell travellers about yourself in at least 60 characters.';
  if (d.background.trim().length < 20) e.background = 'Describe your guiding experience and qualifications.';
  if (!d.photo) e.photo = 'Add a profile photo so travellers can recognise you.';
  documentTypes.
  filter((t) => t.required).
  forEach((t) => {
    if (!d.verificationDocuments.some((doc) => doc.type === t.type)) e[`doc_${t.type}`] = `${t.label} is required.`;
  });
  return e;
}

function ownProfile(s: Parameters<Op<unknown>>[0], actor: Parameters<Op<unknown>>[1]) {
  const user = requireRole(actor, 'provider');
  const profile = providerByUserId(s, user.id);
  assert(profile, 'Provider profile not found.');
  return { user, profile };
}

export const saveApplication: Op<ApplicationDraft> = (s, actor, d) => {
  const { profile } = ownProfile(s, actor);
  assert(['draft', 'changes_requested'].includes(profile.verificationStatus), 'Your application is with our team and can’t be edited right now.');
  return { state: { ...s, providers: patch(s.providers, profile.id, { ...d }) }, result: undefined };
};

export const submitApplication: Op<ApplicationDraft> = (s, actor, d) => {
  const { user, profile } = ownProfile(s, actor);
  assert(['draft', 'changes_requested'].includes(profile.verificationStatus), 'This application has already been submitted.');
  assert(Object.keys(validateApplication(d)).length === 0, 'Please complete all required sections before submitting.');
  const resubmission = profile.verificationStatus === 'changes_requested';
  let next = { ...s, providers: patch(s.providers, profile.id, { ...d, verificationStatus: 'submitted' as const, submittedAt: nowISO() }) };
  next = addNotification(next, { userId: user.id, type: 'application', title: 'Application submitted', message: 'Your application is under review. We’ll notify you when your verification status changes — usually within 2 working days.', link: '/provider/verification' });
  next = addNotification(next, { userId: ADMIN_ID, type: 'application', title: resubmission ? 'Application resubmitted' : 'New provider application', message: `${d.businessName} (${user.name}) is ready for review.`, link: '/admin/applications' });
  next = addActivity(next, { type: 'application', actorId: user.id, message: `${d.businessName} ${resubmission ? 'resubmitted' : 'submitted'} a provider application`, link: '/admin/applications' });
  return { state: next, result: undefined };
};

export function simulatedDocument(type: DocumentType, fileName: string, sizeKb: number): VerificationDocument {
  return { id: uid('doc'), type, fileName, sizeKb, uploadedAt: nowISO() };
}

export const startApplicationReview: Op<{providerId: string;}> = (s, actor, p) => {
  requireRole(actor, 'admin');
  const profile = s.providers.find((x) => x.id === p.providerId);
  assert(profile && profile.verificationStatus === 'submitted', 'Only newly submitted applications can be moved to review.');
  let next = { ...s, providers: patch(s.providers, profile.id, { verificationStatus: 'under_review' as const }) };
  next = addNotification(next, { userId: profile.userId, type: 'application', title: 'Application under review', message: 'A member of our trust team is reviewing your documents.', link: '/provider/verification' });
  next = addActivity(next, { type: 'application', actorId: ADMIN_ID, message: `Started review of ${profile.businessName}` });
  return { state: next, result: undefined };
};

export type ApplicationDecision = 'approved' | 'rejected' | 'changes_requested';

export const decideApplication: Op<{providerId: string;decision: ApplicationDecision;note: string;}> = (s, actor, p) => {
  requireRole(actor, 'admin');
  const profile = s.providers.find((x) => x.id === p.providerId);
  assert(profile, 'Application not found.');
  assert(['submitted', 'under_review'].includes(profile.verificationStatus), 'This application is not awaiting a decision.');
  if (p.decision !== 'approved') assert(p.note.trim().length >= 10, 'Add a note explaining what the provider needs to know.');
  let next = { ...s, providers: patch(s.providers, profile.id, { verificationStatus: p.decision, adminNote: p.note.trim() || undefined, reviewedAt: nowISO() }) };
  const copy = {
    approved: { title: 'You’re verified', message: 'Your provider profile is approved. You can now publish experiences to the marketplace.' },
    changes_requested: { title: 'Changes requested', message: `Our team needs a few updates before approving your profile: ${p.note.trim()}` },
    rejected: { title: 'Application not approved', message: `We couldn’t approve your application: ${p.note.trim()}` }
  }[p.decision];
  next = addNotification(next, { userId: profile.userId, type: 'application', ...copy, link: '/provider/verification' });
  next = addActivity(next, { type: 'application', actorId: ADMIN_ID, message: `${profile.businessName}: ${p.decision.replace('_', ' ')}` });
  return { state: next, result: undefined };
};

export const setProviderSuspended: Op<{providerId: string;suspended: boolean;}> = (s, actor, p) => {
  requireRole(actor, 'admin');
  const profile = s.providers.find((x) => x.id === p.providerId);
  assert(profile, 'Provider not found.');
  let next = { ...s, users: patch(s.users, profile.userId, { status: p.suspended ? 'suspended' as const : 'active' as const }) };
  next = addActivity(next, { type: 'system', actorId: ADMIN_ID, message: `${profile.businessName} ${p.suspended ? 'suspended — listings hidden from discovery' : 'reinstated'}` });
  return { state: next, result: undefined };
};

export type ProfileUpdate = Pick<ProviderProfile, 'businessName' | 'phone' | 'bio' | 'destinations' | 'languages' | 'specialties' | 'photo'>;

export const updateProviderProfile: Op<ProfileUpdate> = (s, actor, d) => {
  const { profile } = ownProfile(s, actor);
  assert(d.businessName.trim().length >= 2, 'Business name is required.');
  assert(d.bio.trim().length >= 60, 'Your bio should be at least 60 characters.');
  assert(d.destinations.length && d.languages.length && d.specialties.length, 'Keep at least one destination, language and specialty.');
  return { state: { ...s, providers: patch(s.providers, profile.id, d) }, result: undefined };
};