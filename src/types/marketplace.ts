export type Role = 'traveller' | 'provider' | 'admin';

export interface User {
  id: string;
  role: Role;
  name: string;
  email: string;
  avatar?: string;
  phone?: string;
  country?: string;
  status: 'active' | 'suspended';
  createdAt: string;
}

export type VerificationStatus =
'draft' |
'submitted' |
'under_review' |
'changes_requested' |
'approved' |
'rejected';

export type DocumentType =
'identity' |
'guide_registration' |
'business_registration' |
'liability_insurance';

export interface VerificationDocument {
  id: string;
  type: DocumentType;
  fileName: string;
  sizeKb: number;
  uploadedAt: string;
}

export interface ProviderProfile {
  id: string;
  userId: string;
  businessName: string;
  contactName: string;
  phone: string;
  bio: string;
  background: string;
  yearsExperience: number;
  destinations: string[];
  languages: string[];
  specialties: string[];
  photo?: string;
  verificationStatus: VerificationStatus;
  verificationDocuments: VerificationDocument[];
  adminNote?: string;
  submittedAt?: string;
  reviewedAt?: string;
  createdAt: string;
}

export type ExperienceStatus = 'draft' | 'published' | 'unpublished';
export type CancellationPolicy = 'flexible' | 'moderate' | 'strict';

export interface Experience {
  id: string;
  providerId: string;
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
  status: ExperienceStatus;
  moderationNote?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AvailabilitySlot {
  id: string;
  experienceId: string;
  date: string;
  time: string;
  capacity: number;
  bookedCapacity: number;
  status: 'open' | 'blocked';
}

export type BookingStatus =
'pending_payment' |
'confirmed' |
'completed' |
'cancelled' |
'payment_failed';

export type PaymentStatus = 'unpaid' | 'paid' | 'failed' | 'refunded' | 'not_refunded';

export interface BookingContact {
  name: string;
  email: string;
  phone: string;
}

export interface Booking {
  id: string;
  reference: string;
  travellerId: string;
  providerId: string;
  experienceId?: string;
  customRequestId?: string;
  proposalId?: string;
  slotId?: string;
  title: string;
  date: string;
  time: string;
  guestCount: number;
  subtotal: number;
  fees: number;
  total: number;
  paymentStatus: PaymentStatus;
  bookingStatus: BookingStatus;
  contact: BookingContact;
  meetingPoint: string;
  cancellationPolicy: CancellationPolicy;
  paymentLast4?: string;
  failureReason?: string;
  cancelledBy?: Role;
  createdAt: string;
}

export type RequestStatus =
'submitted' |
'under_review' |
'matched' |
'proposal_received' |
'customer_reviewing' |
'accepted' |
'booking_created' |
'completed' |
'cancelled' |
'closed';

export type TravelPace = 'relaxed' | 'balanced' | 'active';

export interface CustomRequest {
  id: string;
  travellerId: string;
  title: string;
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
  status: RequestStatus;
  interestedProviderIds: string[];
  bookingId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ItineraryItem {
  day: number;
  title: string;
  detail: string;
}

export type ProposalStatus = 'sent' | 'accepted' | 'declined' | 'withdrawn';

export interface Proposal {
  id: string;
  requestId: string;
  providerId: string;
  title: string;
  itinerary: ItineraryItem[];
  price: number;
  date: string;
  duration: string;
  notes: string;
  availabilityNote: string;
  status: ProposalStatus;
  validUntil: string;
  createdAt: string;
}

export interface Review {
  id: string;
  bookingId: string;
  travellerId: string;
  providerId: string;
  experienceId?: string;
  rating: number;
  comment: string;
  status: 'published' | 'flagged' | 'removed';
  moderationNote?: string;
  createdAt: string;
}

export type NotificationType =
'application' |
'booking' |
'payment' |
'request' |
'proposal' |
'review' |
'experience' |
'system';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
  read: boolean;
  createdAt: string;
}

export interface ActivityEvent {
  id: string;
  type: NotificationType;
  actorId: string;
  message: string;
  link?: string;
  createdAt: string;
}

export interface MarketplaceSettings {
  serviceFeePercent: number;
  proposalValidityDays: number;
  simulateNetworkErrors: boolean;
}

export interface MarketplaceState {
  version: number;
  currentUserId: string | null;
  users: User[];
  providers: ProviderProfile[];
  experiences: Experience[];
  slots: AvailabilitySlot[];
  bookings: Booking[];
  requests: CustomRequest[];
  proposals: Proposal[];
  reviews: Review[];
  notifications: Notification[];
  activity: ActivityEvent[];
  settings: MarketplaceSettings;
}

export interface Destination {
  id: string;
  name: string;
  region: string;
  blurb: string;
  image: string;
}

export interface Category {
  id: string;
  name: string;
}