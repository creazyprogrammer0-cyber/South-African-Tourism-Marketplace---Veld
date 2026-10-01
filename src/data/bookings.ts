import type { BookingStatus, PaymentStatus } from '../types/marketplace';

export interface BookingSeed {
  id: string;
  travellerId: string;
  experienceId?: string;
  customRequestId?: string;
  proposalId?: string;
  providerId?: string;
  title?: string;
  subtotal?: number;
  meetingPoint?: string;
  dayOffset: number;
  time: string;
  guestCount: number;
  bookingStatus: BookingStatus;
  paymentStatus: PaymentStatus;
  createdDaysAgo: number;
  failureReason?: string;
}

/** Operational bookings. Historical completed bookings behind older reviews are generated from data/reviews.ts. */
export const seedBookings: BookingSeed[] = [
// Sarah Morgan
{ id: 'b-1001', travellerId: 'u-sarah', experienceId: 'e-stellenbosch-wine', dayOffset: 6, time: '09:30', guestCount: 2, bookingStatus: 'confirmed', paymentStatus: 'paid', createdDaysAgo: 12 },
{ id: 'b-1002', travellerId: 'u-sarah', experienceId: 'e-lionshead', dayOffset: -20, time: '05:00', guestCount: 2, bookingStatus: 'completed', paymentStatus: 'paid', createdDaysAgo: 34 },
{ id: 'b-1003', travellerId: 'u-sarah', experienceId: 'e-kruger-sunrise', dayOffset: -9, time: '05:30', guestCount: 2, bookingStatus: 'completed', paymentStatus: 'paid', createdDaysAgo: 40 },
{ id: 'b-1004', travellerId: 'u-sarah', experienceId: 'e-hermanus-boat', dayOffset: 10, time: '09:00', guestCount: 2, bookingStatus: 'payment_failed', paymentStatus: 'failed', createdDaysAgo: 1, failureReason: 'Your bank declined the transaction (insufficient funds).' },
{ id: 'b-1005', travellerId: 'u-sarah', experienceId: 'e-durban-curry', dayOffset: 15, time: '10:00', guestCount: 2, bookingStatus: 'cancelled', paymentStatus: 'refunded', createdDaysAgo: 22 },
{ id: 'b-1006', travellerId: 'u-sarah', customRequestId: 'cr-2', proposalId: 'pr-1', providerId: 'p-marco', title: 'Garden Route 3-Day Adventure: Kayak, Forest & Coast', subtotal: 14400, meetingPoint: 'Plettenberg Bay accommodation pick-up', dayOffset: 25, time: '08:00', guestCount: 2, bookingStatus: 'confirmed', paymentStatus: 'paid', createdDaysAgo: 6 },
// Thabo's operational bookings (Lion's Head +3 is 6/8 full)
{ id: 'b-1007', travellerId: 'u-t1', experienceId: 'e-lionshead', dayOffset: 3, time: '05:00', guestCount: 4, bookingStatus: 'confirmed', paymentStatus: 'paid', createdDaysAgo: 9 },
{ id: 'b-1008', travellerId: 'u-t2', experienceId: 'e-lionshead', dayOffset: 3, time: '05:00', guestCount: 2, bookingStatus: 'confirmed', paymentStatus: 'paid', createdDaysAgo: 5 },
{ id: 'b-1009', travellerId: 'u-t3', experienceId: 'e-bokaap', dayOffset: 2, time: '10:00', guestCount: 3, bookingStatus: 'confirmed', paymentStatus: 'paid', createdDaysAgo: 7 },
{ id: 'b-1010', travellerId: 'u-t4', experienceId: 'e-peninsula-photo', dayOffset: 8, time: '07:30', guestCount: 2, bookingStatus: 'confirmed', paymentStatus: 'paid', createdDaysAgo: 11 },
{ id: 'b-1011', travellerId: 'u-t5', experienceId: 'e-bokaap', dayOffset: -5, time: '14:30', guestCount: 2, bookingStatus: 'completed', paymentStatus: 'paid', createdDaysAgo: 19 },
{ id: 'b-1012', travellerId: 'u-t6', experienceId: 'e-peninsula-photo', dayOffset: 12, time: '07:30', guestCount: 1, bookingStatus: 'pending_payment', paymentStatus: 'unpaid', createdDaysAgo: 0 },
{ id: 'b-1013', travellerId: 'u-t7', experienceId: 'e-golden-hour', dayOffset: 4, time: '17:00', guestCount: 3, bookingStatus: 'confirmed', paymentStatus: 'paid', createdDaysAgo: 8 },
// Other providers
{ id: 'b-1014', travellerId: 'u-t7', experienceId: 'e-kruger-walk', dayOffset: 4, time: '05:00', guestCount: 2, bookingStatus: 'confirmed', paymentStatus: 'paid', createdDaysAgo: 14 },
{ id: 'b-1015', travellerId: 'u-t8', experienceId: 'e-soweto', dayOffset: 5, time: '09:00', guestCount: 4, bookingStatus: 'confirmed', paymentStatus: 'paid', createdDaysAgo: 10 },
{ id: 'b-1016', travellerId: 'u-t2', experienceId: 'e-maboneng', dayOffset: -3, time: '10:00', guestCount: 2, bookingStatus: 'completed', paymentStatus: 'paid', createdDaysAgo: 16 },
{ id: 'b-1017', travellerId: 'u-t3', experienceId: 'e-storms-river', dayOffset: 9, time: '09:00', guestCount: 4, bookingStatus: 'confirmed', paymentStatus: 'paid', createdDaysAgo: 3 },
{ id: 'b-1018', travellerId: 'u-t1', experienceId: 'e-cliff-path', dayOffset: 7, time: '10:00', guestCount: 2, bookingStatus: 'confirmed', paymentStatus: 'paid', createdDaysAgo: 4 },
{ id: 'b-1019', travellerId: 'u-t4', experienceId: 'e-durban-curry', dayOffset: 11, time: '10:00', guestCount: 2, bookingStatus: 'confirmed', paymentStatus: 'paid', createdDaysAgo: 6 },
{ id: 'b-1020', travellerId: 'u-t5', experienceId: 'e-winelands-cooking', dayOffset: 6, time: '11:00', guestCount: 2, bookingStatus: 'cancelled', paymentStatus: 'not_refunded', createdDaysAgo: 18 },
{ id: 'b-1021', travellerId: 'u-t6', experienceId: 'e-kruger-fullday', dayOffset: -2, time: '05:30', guestCount: 3, bookingStatus: 'completed', paymentStatus: 'paid', createdDaysAgo: 25 },
{ id: 'b-1022', travellerId: 'u-t4', customRequestId: 'cr-6', proposalId: 'pr-3', providerId: 'p-lerato', title: 'Johannesburg History in a Day: Private Tour', subtotal: 4200, meetingPoint: 'Hotel pick-up, Rosebank', dayOffset: -12, time: '08:30', guestCount: 2, bookingStatus: 'completed', paymentStatus: 'paid', createdDaysAgo: 30 }];