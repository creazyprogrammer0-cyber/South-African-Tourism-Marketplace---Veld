import type { ProviderProfile } from '../types/marketplace';
import { isoDaysAgo } from '../utils/dates';

const docs = (prefix: string, days: number) => [
{ id: `${prefix}-d1`, type: 'identity' as const, fileName: 'id-document.pdf', sizeKb: 412, uploadedAt: isoDaysAgo(days) },
{ id: `${prefix}-d2`, type: 'guide_registration' as const, fileName: 'guide-registration-certificate.pdf', sizeKb: 860, uploadedAt: isoDaysAgo(days) },
{ id: `${prefix}-d3`, type: 'liability_insurance' as const, fileName: 'liability-policy-schedule.pdf', sizeKb: 1290, uploadedAt: isoDaysAgo(days) }];


export const seedProviders: ProviderProfile[] = [
{
  id: 'p-thabo', userId: 'u-thabo', businessName: 'Mokoena Trails & Tables', contactName: 'Thabo Mokoena', phone: '+27 82 555 0141',
  bio: 'Born in Gugulethu and raised on Table Mountain’s trails, I guide small groups through the Cape’s best light, longest views and most honest food. Registered Western Cape tourist guide since 2014.',
  background: 'Western Cape registered guide (culture & nature), Wilderness First Aid Level 3, former Getaway magazine photographer.',
  yearsExperience: 12, destinations: ['cape-town'], languages: ['English', 'isiZulu', 'Sesotho', 'Afrikaans'],
  specialties: ['Photography', 'Hiking', 'Food & markets'], verificationStatus: 'approved', verificationDocuments: docs('p-thabo', 900),
  submittedAt: isoDaysAgo(905), reviewedAt: isoDaysAgo(900), createdAt: isoDaysAgo(910)
},
{
  id: 'p-annelie', userId: 'u-annelie', businessName: 'Winelands Table', contactName: 'Annelie van der Merwe', phone: '+27 83 555 0177',
  bio: 'Third-generation Stellenbosch local and Cape Wine Academy diploma holder. I take guests to the small family cellars that rarely appear on bus routes.',
  background: 'Cape Wine Academy Diploma, 9 years as cellar-door manager in Jonkershoek Valley.',
  yearsExperience: 9, destinations: ['stellenbosch', 'cape-town'], languages: ['English', 'Afrikaans', 'German'],
  specialties: ['Wine', 'Food & markets', 'History & heritage'], verificationStatus: 'approved', verificationDocuments: docs('p-annelie', 820),
  submittedAt: isoDaysAgo(825), reviewedAt: isoDaysAgo(820), createdAt: isoDaysAgo(830)
},
{
  id: 'p-sipho', userId: 'u-sipho', businessName: 'Bushveld Tracker Safaris', contactName: 'Sipho Ndlovu', phone: '+27 72 555 0112',
  bio: 'FGASA Level 3 field guide and trails guide based in Hazyview. Two decades reading tracks in the southern Kruger, with a focus on slow, respectful sightings.',
  background: 'FGASA Field Guide Level 3, Trails Guide, SKS Dangerous Game. 20 years in the Greater Kruger.',
  yearsExperience: 20, destinations: ['kruger'], languages: ['English', 'isiZulu', 'Setswana'],
  specialties: ['Wildlife tracking', 'Birding', 'Photography'], verificationStatus: 'approved', verificationDocuments: docs('p-sipho', 960),
  submittedAt: isoDaysAgo(965), reviewedAt: isoDaysAgo(960), createdAt: isoDaysAgo(970)
},
{
  id: 'p-priya', userId: 'u-priya', businessName: 'Spice Route Durban', contactName: 'Priya Naidoo', phone: '+27 84 555 0163',
  bio: 'Durban born, curry obsessed. I run walking food tours through Grey Street, the Victoria Street Market and the family kitchens behind them.',
  background: 'KZN registered culture guide, trained chef (Christina Martin School of Food & Wine).',
  yearsExperience: 7, destinations: ['durban'], languages: ['English', 'isiZulu'],
  specialties: ['Food & markets', 'History & heritage'], verificationStatus: 'approved', verificationDocuments: docs('p-priya', 700),
  submittedAt: isoDaysAgo(705), reviewedAt: isoDaysAgo(700), createdAt: isoDaysAgo(710)
},
{
  id: 'p-lerato', userId: 'u-lerato', businessName: 'Jozi Streets', contactName: 'Lerato Khumalo', phone: '+27 76 555 0124',
  bio: 'Soweto local and history graduate from Wits. My tours connect the landmarks of the struggle with the neighbourhoods, artists and kitchens of today’s Johannesburg.',
  background: 'Gauteng registered tourist guide, BA History (Wits).',
  yearsExperience: 8, destinations: ['johannesburg'], languages: ['English', 'isiZulu', 'Sesotho', 'Setswana'],
  specialties: ['History & heritage', 'Street art', 'Food & markets'], verificationStatus: 'approved', verificationDocuments: docs('p-lerato', 640),
  submittedAt: isoDaysAgo(645), reviewedAt: isoDaysAgo(640), createdAt: isoDaysAgo(650)
},
{
  id: 'p-marco', userId: 'u-marco', businessName: 'Tsitsikamma Edge Adventures', contactName: 'Marco Ferreira', phone: '+27 82 555 0189',
  bio: 'Kayak instructor and mountain guide on the Garden Route. We keep groups small so we can go where the big operators can’t.',
  background: 'SA Canoe Federation instructor, Mountain Club of SA leader, 11 years guiding in Tsitsikamma.',
  yearsExperience: 11, destinations: ['garden-route'], languages: ['English', 'Portuguese', 'Afrikaans'],
  specialties: ['Adventure sports', 'Hiking', 'Family trips'], verificationStatus: 'approved', verificationDocuments: docs('p-marco', 880),
  submittedAt: isoDaysAgo(885), reviewedAt: isoDaysAgo(880), createdAt: isoDaysAgo(890)
},
{
  id: 'p-jenna', userId: 'u-jenna', businessName: 'Walker Bay Ocean Safaris', contactName: 'Jenna Pieterse', phone: '+27 79 555 0150',
  bio: 'Marine biologist turned skipper. Permitted boat-based whale watching operator in Walker Bay, with land-based cliff walks for those who prefer solid ground.',
  background: 'MSc Marine Biology (UCT), DEFF boat-based whale watching permit holder, SAMSA skipper licence.',
  yearsExperience: 10, destinations: ['hermanus'], languages: ['English', 'Afrikaans', 'French'],
  specialties: ['Marine life', 'Photography', 'Birding'], verificationStatus: 'approved', verificationDocuments: docs('p-jenna', 760),
  submittedAt: isoDaysAgo(765), reviewedAt: isoDaysAgo(760), createdAt: isoDaysAgo(770)
},
{
  id: 'p-lindiwe', userId: 'u-lindiwe', businessName: 'Lindiwe’s Cape Kitchen', contactName: 'Lindiwe Dube', phone: '+27 73 555 0198',
  bio: 'Home cook and caterer from Langa hosting hands-on cooking classes of Xhosa and Cape Malay dishes in my family kitchen.',
  background: 'Caterer for 6 years. Completing tourist guide registration.',
  yearsExperience: 6, destinations: ['cape-town'], languages: ['English', 'isiXhosa'],
  specialties: ['Food & markets'], verificationStatus: 'changes_requested',
  verificationDocuments: [{ id: 'p-lindiwe-d1', type: 'identity', fileName: 'id-document.jpg', sizeKb: 2240, uploadedAt: isoDaysAgo(18) }],
  adminNote: 'Thanks for applying, Lindiwe. Please upload your tourist guide registration or a letter confirming your registration is in progress, and add a profile photo.',
  submittedAt: isoDaysAgo(18), reviewedAt: isoDaysAgo(15), createdAt: isoDaysAgo(21)
},
{
  id: 'p-kagiso', userId: 'u-kagiso', businessName: 'Highveld Photo Walks', contactName: 'Kagiso Molefe', phone: '+27 71 555 0133',
  bio: 'Documentary photographer leading small-group photo walks through Johannesburg’s inner city and Soweto at golden hour.',
  background: 'Market Photo Workshop graduate, 5 years commercial photography.',
  yearsExperience: 5, destinations: ['johannesburg'], languages: ['English', 'Setswana', 'Sesotho'],
  specialties: ['Photography', 'Street art'], verificationStatus: 'under_review', verificationDocuments: docs('p-kagiso', 10).slice(0, 2),
  submittedAt: isoDaysAgo(10), createdAt: isoDaysAgo(13)
},
{
  id: 'p-ruan', userId: 'u-ruan', businessName: 'Karoo Overland', contactName: 'Ruan Botha', phone: '+27 82 555 0175',
  bio: 'Overland guide running small-group 4x4 routes from the Garden Route into the Klein Karoo and Swartberg Pass.',
  background: 'Registered nature guide, 4x4 instructor, 14 years overland touring.',
  yearsExperience: 14, destinations: ['garden-route', 'cape-town'], languages: ['English', 'Afrikaans'],
  specialties: ['Adventure sports', 'Photography', 'Hiking'], verificationStatus: 'submitted', verificationDocuments: docs('p-ruan', 4),
  photo: undefined, submittedAt: isoDaysAgo(4), createdAt: isoDaysAgo(5)
},
{
  id: 'p-zanele', userId: 'u-zanele', businessName: 'Coastal Quads', contactName: 'Zanele Mthembu', phone: '+27 61 555 0110',
  bio: 'Quad bike trips on the dunes north of Durban.',
  background: 'Quad operator.',
  yearsExperience: 2, destinations: ['durban'], languages: ['English', 'isiZulu'],
  specialties: ['Adventure sports'], verificationStatus: 'rejected',
  verificationDocuments: [{ id: 'p-zanele-d1', type: 'identity', fileName: 'id.png', sizeKb: 840, uploadedAt: isoDaysAgo(55) }],
  adminNote: 'Off-road dune driving in this area requires a coastal vehicle permit we could not verify. You are welcome to reapply with the permit.',
  submittedAt: isoDaysAgo(55), reviewedAt: isoDaysAgo(50), createdAt: isoDaysAgo(58)
}];