import type { ActivityEvent, MarketplaceState, Notification, Role, User } from '../types/marketplace';
import { nowISO } from './dates';

export class ApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

export function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new ApiError(message);
}

export interface OpResult<R> {
  state: MarketplaceState;
  result: R;
}

/** A mock backend operation: pure function of current state, the acting user and a payload. */
export type Op<P, R = void> = (state: MarketplaceState, actor: User | null, payload: P) => OpResult<R>;

export function uid(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}

export function bookingReference(): string {
  return `VLD-${Math.floor(100000 + Math.random() * 900000)}`;
}

export function requireRole(actor: User | null, ...roles: Role[]): User {
  if (!actor) throw new ApiError('Please sign in to continue.');
  if (actor.status !== 'active') throw new ApiError('Your account is suspended. Contact support.');
  if (roles.length && !roles.includes(actor.role)) throw new ApiError('You don’t have permission to do that.');
  return actor;
}

export function addNotification(
s: MarketplaceState,
n: Omit<Notification, 'id' | 'read' | 'createdAt'>)
: MarketplaceState {
  return { ...s, notifications: [{ ...n, id: uid('n'), read: false, createdAt: nowISO() }, ...s.notifications] };
}

export function addActivity(s: MarketplaceState, a: Omit<ActivityEvent, 'id' | 'createdAt'>): MarketplaceState {
  return { ...s, activity: [{ ...a, id: uid('a'), createdAt: nowISO() }, ...s.activity] };
}

export function patch<T extends {id: string;}>(list: T[], id: string, changes: Partial<T>): T[] {
  return list.map((item) => item.id === id ? { ...item, ...changes } : item);
}

export function isEmail(v: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
}