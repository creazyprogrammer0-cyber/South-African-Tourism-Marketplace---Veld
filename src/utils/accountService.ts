import type { MarketplaceSettings } from '../types/marketplace';
import { ADMIN_ID } from '../data/users';
import { addActivity, assert, isEmail, Op, patch, requireRole } from './serviceCore';

export const login: Op<{userId: string;}> = (s, _actor, p) => {
  const user = s.users.find((u) => u.id === p.userId);
  assert(user, 'Account not found.');
  return { state: { ...s, currentUserId: user.id }, result: undefined };
};

export const loginWithEmail: Op<{email: string;}, string> = (s, _actor, p) => {
  assert(isEmail(p.email), 'Enter a valid email address.');
  const user = s.users.find((u) => u.email.toLowerCase() === p.email.trim().toLowerCase());
  assert(user, 'No account uses that email. Check for typos, or create an account.');
  assert(user.status === 'active', 'This account is suspended. Contact support@veld.co.za.');
  return { state: { ...s, currentUserId: user.id }, result: user.id };
};

export const registerTraveller: Op<{name: string;email: string;}, string> = (s, _actor, p) => {
  assert(p.name.trim().length >= 2, 'Enter your full name.');
  assert(isEmail(p.email), 'Enter a valid email address.');
  assert(!s.users.some((u) => u.email.toLowerCase() === p.email.trim().toLowerCase()), 'An account with this email already exists. Sign in instead.');
  const id = `u-${Date.now().toString(36)}`;
  const user = { id, role: 'traveller' as const, name: p.name.trim(), email: p.email.trim(), status: 'active' as const, createdAt: new Date().toISOString() };
  return { state: { ...s, users: [...s.users, user], currentUserId: id }, result: id };
};

export const logout: Op<void> = (s) => ({ state: { ...s, currentUserId: null }, result: undefined });

export const markNotificationRead: Op<{id: string;}> = (s, actor, p) => {
  const user = requireRole(actor);
  const n = s.notifications.find((x) => x.id === p.id);
  if (!n || n.userId !== user.id) return { state: s, result: undefined };
  return { state: { ...s, notifications: patch(s.notifications, n.id, { read: true }) }, result: undefined };
};

export const markAllNotificationsRead: Op<void> = (s, actor) => {
  const user = requireRole(actor);
  return { state: { ...s, notifications: s.notifications.map((n) => n.userId === user.id ? { ...n, read: true } : n) }, result: undefined };
};

export const updateTravellerProfile: Op<{name: string;email: string;phone: string;country: string;}> = (s, actor, p) => {
  const user = requireRole(actor, 'traveller');
  assert(p.name.trim().length >= 2, 'Enter your name.');
  assert(isEmail(p.email), 'Enter a valid email address.');
  return { state: { ...s, users: patch(s.users, user.id, { name: p.name.trim(), email: p.email.trim(), phone: p.phone.trim(), country: p.country.trim() }) }, result: undefined };
};

export const updateSettings: Op<MarketplaceSettings> = (s, actor, p) => {
  requireRole(actor, 'admin');
  assert(p.serviceFeePercent >= 0 && p.serviceFeePercent <= 25, 'Service fee must be between 0% and 25%.');
  assert(p.proposalValidityDays >= 1 && p.proposalValidityDays <= 30, 'Proposal validity must be 1–30 days.');
  let next = { ...s, settings: p };
  next = addActivity(next, { type: 'system', actorId: ADMIN_ID, message: `Settings updated · service fee ${p.serviceFeePercent}% · proposals valid ${p.proposalValidityDays} days` });
  return { state: next, result: undefined };
};