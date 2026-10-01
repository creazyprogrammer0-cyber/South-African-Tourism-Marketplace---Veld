import type { CustomRequest, Proposal } from '../types/marketplace';
import { dateFromToday, isoDaysAgo } from '../utils/dates';

export const seedRequests: CustomRequest[] = [
{
  id: 'cr-1', travellerId: 'u-sarah', title: '4 days in Cape Town: photography, nature and local food', destination: 'cape-town',
  startDate: dateFromToday(34), endDate: dateFromToday(37), flexibleDates: true, guestCount: 4,
  interests: ['Photography', 'Nature', 'Local food'], pace: 'balanced', preferences: ['Private group only', 'Hotel pick-up', 'Early starts are fine'],
  budgetMin: 18000, budgetMax: 26000,
  requirements: 'Two of us shoot with full-frame cameras, the other two are casual phone photographers. We’d love one sunrise and one sunset shoot, a market or food walk, and at least one day out of the city. One person is vegetarian.',
  status: 'under_review', interestedProviderIds: [], createdAt: isoDaysAgo(2), updatedAt: isoDaysAgo(1)
},
{
  id: 'cr-2', travellerId: 'u-sarah', title: 'Active Garden Route long weekend for two', destination: 'garden-route',
  startDate: dateFromToday(25), endDate: dateFromToday(27), flexibleDates: false, guestCount: 2,
  interests: ['Adventure', 'Hiking', 'Nature'], pace: 'active', preferences: ['Private group only'],
  budgetMin: 10000, budgetMax: 16000, requirements: 'We’re fit and keen on kayaking and a proper hike. Staying in Plettenberg Bay.',
  status: 'booking_created', interestedProviderIds: ['p-marco'], bookingId: 'b-1006', createdAt: isoDaysAgo(14), updatedAt: isoDaysAgo(6)
},
{
  id: 'cr-3', travellerId: 'u-t1', title: 'Family safari in Kruger with young kids', destination: 'kruger',
  startDate: dateFromToday(40), endDate: dateFromToday(42), flexibleDates: true, guestCount: 5,
  interests: ['Wildlife', 'Nature'], pace: 'relaxed', preferences: ['Child-friendly', 'Hotel pick-up'],
  budgetMin: 15000, budgetMax: 22000, requirements: 'Kids are 6 and 9. Shorter drives please, and somewhere to stop for lunch.',
  status: 'proposal_received', interestedProviderIds: ['p-sipho'], createdAt: isoDaysAgo(8), updatedAt: isoDaysAgo(3)
},
{
  id: 'cr-4', travellerId: 'u-t2', title: 'Honeymoon day in the Winelands', destination: 'stellenbosch',
  startDate: dateFromToday(20), endDate: dateFromToday(20), flexibleDates: false, guestCount: 2,
  interests: ['Wine', 'Local food'], pace: 'relaxed', preferences: ['Private group only', 'Hotel pick-up'],
  budgetMin: 5000, budgetMax: 9000, requirements: 'Something special and private. We love sparkling wine (MCC).',
  status: 'matched', interestedProviderIds: ['p-annelie'], createdAt: isoDaysAgo(5), updatedAt: isoDaysAgo(4)
},
{
  id: 'cr-5', travellerId: 'u-t3', title: 'Durban food deep-dive for a food writer', destination: 'durban',
  startDate: dateFromToday(18), endDate: dateFromToday(19), flexibleDates: true, guestCount: 1,
  interests: ['Local food', 'Markets', 'History & heritage'], pace: 'balanced', preferences: [],
  budgetMin: 3000, budgetMax: 6000, requirements: 'I’m writing a feature on Durban curry. Would love kitchen access and interviews with cooks.',
  status: 'submitted', interestedProviderIds: [], createdAt: isoDaysAgo(1), updatedAt: isoDaysAgo(1)
},
{
  id: 'cr-6', travellerId: 'u-t4', title: 'Johannesburg history in a day', destination: 'johannesburg',
  startDate: dateFromToday(-12), endDate: dateFromToday(-12), flexibleDates: false, guestCount: 2,
  interests: ['History & heritage'], pace: 'balanced', preferences: ['Hotel pick-up'],
  budgetMin: 3000, budgetMax: 5000, requirements: 'Private guide for Constitution Hill and Soweto.',
  status: 'completed', interestedProviderIds: ['p-lerato'], bookingId: 'b-1022', createdAt: isoDaysAgo(35), updatedAt: isoDaysAgo(12)
},
{
  id: 'cr-7', travellerId: 'u-t5', title: 'Hermanus whales and photography', destination: 'hermanus',
  startDate: dateFromToday(-4), endDate: dateFromToday(-3), flexibleDates: false, guestCount: 2,
  interests: ['Whale watching', 'Photography'], pace: 'relaxed', preferences: [],
  budgetMin: 4000, budgetMax: 7000, requirements: 'Plans changed. Cancelling.',
  status: 'cancelled', interestedProviderIds: ['p-jenna'], createdAt: isoDaysAgo(28), updatedAt: isoDaysAgo(20)
},
{
  id: 'cr-8', travellerId: 'u-t6', title: 'Wheelchair-accessible Cape Town highlights', destination: 'cape-town',
  startDate: dateFromToday(30), endDate: dateFromToday(31), flexibleDates: true, guestCount: 3,
  interests: ['Nature', 'History & heritage', 'Local food'], pace: 'relaxed', preferences: ['Wheelchair accessible', 'Hotel pick-up', 'Small walking distances'],
  budgetMin: 6000, budgetMax: 10000, requirements: 'My father uses a wheelchair. We need an accessible vehicle and step-free stops.',
  status: 'submitted', interestedProviderIds: [], createdAt: isoDaysAgo(9), updatedAt: isoDaysAgo(9)
},
{
  id: 'cr-9', travellerId: 'u-t7', title: 'Cape Town street food evening', destination: 'cape-town',
  startDate: dateFromToday(16), endDate: dateFromToday(16), flexibleDates: false, guestCount: 3,
  interests: ['Local food', 'Markets'], pace: 'balanced', preferences: [],
  budgetMin: 2000, budgetMax: 4000, requirements: 'Evening food crawl, not too touristy.',
  status: 'proposal_received', interestedProviderIds: ['p-thabo'], createdAt: isoDaysAgo(6), updatedAt: isoDaysAgo(2)
},
{
  id: 'cr-10', travellerId: 'u-t8', title: 'Kruger wildlife photography, 2 days', destination: 'kruger',
  startDate: dateFromToday(-15), endDate: dateFromToday(-14), flexibleDates: false, guestCount: 1,
  interests: ['Wildlife', 'Photography'], pace: 'active', preferences: ['Early starts are fine'],
  budgetMin: 2000, budgetMax: 3000, requirements: 'Budget is tight.',
  status: 'closed', interestedProviderIds: [], createdAt: isoDaysAgo(40), updatedAt: isoDaysAgo(16)
}];


export const seedProposals: Proposal[] = [
{
  id: 'pr-1', requestId: 'cr-2', providerId: 'p-marco', title: 'Garden Route 3-Day Adventure: Kayak, Forest & Coast',
  itinerary: [
  { day: 1, title: 'Storms River gorge', detail: 'Kayak and lilo the gorge, lunch at the river mouth, sunset at the suspension bridge.' },
  { day: 2, title: 'Otter Trail & waterfall', detail: 'Full coastal hike to the waterfall and beyond, packed lunch on the rocks.' },
  { day: 3, title: 'Knysna forest & lagoon', detail: 'Morning forest walk, afternoon paddle on the Knysna lagoon.' }],

  price: 14400, date: dateFromToday(25), duration: '3 days', notes: 'All gear, lunches and transfers from Plettenberg Bay included.',
  availabilityNote: 'Confirmed for your dates.', status: 'accepted', validUntil: dateFromToday(-2), createdAt: isoDaysAgo(10)
},
{
  id: 'pr-2', requestId: 'cr-3', providerId: 'p-sipho', title: 'Kruger Family Safari: Short Drives, Big Sightings',
  itinerary: [
  { day: 1, title: 'Afternoon drive', detail: '3-hour drive from Phabeni Gate with a junior ranger activity book for the kids.' },
  { day: 2, title: 'Morning drive & Lake Panic hide', detail: 'Early drive, breakfast picnic, then the bird hide at Lake Panic.' },
  { day: 3, title: 'Sabie River loop', detail: 'Relaxed drive along the river and lunch at Skukuza.' }],

  price: 19800, date: dateFromToday(40), duration: '3 days', notes: 'Child seats available. Drives capped at 3.5 hours.',
  availabilityNote: 'Available on your preferred dates.', status: 'sent', validUntil: dateFromToday(9), createdAt: isoDaysAgo(3)
},
{
  id: 'pr-3', requestId: 'cr-6', providerId: 'p-lerato', title: 'Johannesburg History in a Day: Private Tour',
  itinerary: [{ day: 1, title: 'Constitution Hill & Soweto', detail: 'Morning at Constitution Hill, lunch in Soweto, afternoon at Hector Pieterson Memorial.' }],
  price: 4200, date: dateFromToday(-12), duration: '1 day', notes: 'Private vehicle.', availabilityNote: 'Confirmed.',
  status: 'accepted', validUntil: dateFromToday(-20), createdAt: isoDaysAgo(32)
},
{
  id: 'pr-4', requestId: 'cr-9', providerId: 'p-thabo', title: 'Woodstock to Bree Street: An Evening Food Crawl',
  itinerary: [{ day: 1, title: 'Evening crawl', detail: 'Woodstock Exchange, a gatsby in Athlone, and dessert on Bree Street.' }],
  price: 3150, date: dateFromToday(16), duration: '4 hours', notes: 'Includes all food; drinks at your own cost.',
  availabilityNote: 'Free on the 16th from 17:30.', status: 'sent', validUntil: dateFromToday(5), createdAt: isoDaysAgo(2)
},
{
  id: 'pr-5', requestId: 'cr-7', providerId: 'p-jenna', title: 'Whales & Lenses Weekend',
  itinerary: [{ day: 1, title: 'Boat & cliffs', detail: 'Boat trip and cliff path photography.' }],
  price: 5600, date: dateFromToday(-4), duration: '2 days', notes: '', availabilityNote: '', status: 'withdrawn',
  validUntil: dateFromToday(-15), createdAt: isoDaysAgo(24)
}];