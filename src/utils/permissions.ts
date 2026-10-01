import type { Role } from '../types/marketplace';

export function homeForRole(role?: Role | null): string {
  if (role === 'provider') return '/provider';
  if (role === 'admin') return '/admin';
  return '/';
}

export const roleLabel: Record<Role, string> = {
  traveller: 'Traveller',
  provider: 'Provider',
  admin: 'Admin'
};