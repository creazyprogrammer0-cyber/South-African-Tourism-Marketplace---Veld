import type { CancellationPolicy } from '../types/marketplace';

export const cancellationPolicies: Record<CancellationPolicy, {label: string;hours: number;text: string;}> = {
  flexible: { label: 'Flexible', hours: 24, text: 'Free cancellation up to 24 hours before the start time. Cancellations within 24 hours are not refunded.' },
  moderate: { label: 'Moderate', hours: 72, text: 'Free cancellation up to 3 days before the start time. Cancellations within 3 days are not refunded.' },
  strict: { label: 'Strict', hours: 168, text: 'Free cancellation up to 7 days before the start time. Cancellations within 7 days are not refunded.' }
};

export function freeCancellationLabel(policy: CancellationPolicy): string {
  const h = cancellationPolicies[policy].hours;
  return h >= 48 ? `Free cancellation up to ${h / 24} days before` : `Free cancellation up to ${h} hours before`;
}