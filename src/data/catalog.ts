import type { Category, Destination } from '../types/marketplace';

export const images = {
  capeTown: "/6b98a33b-0564-43d1-b365-b030cca6edc0.jpg",
  kruger: "/52f56826-0472-44b5-ba7d-c2c499fe3a97.jpg",
  stellenbosch: "/634f18c7-55d9-413b-afc6-feb328ed22b9.jpg",
  hermanus: "/32f7af88-9047-447e-8c13-0ccb591e3d86.jpg",
  gardenRoute: "/53cc5f78-98fb-499b-ba91-f5de4eeb1e28.jpg",
  soweto: "/fd225e71-0603-49b2-8b04-3ad22b0a110f.jpg",
  durbanFood: "/fd73a91e-c88f-4091-97e1-b4b8cec71ba6.jpg",
  boKaap: "/dda6539c-02f2-4f49-8b6f-e329e291e4a3.jpg",
  capePoint: "/a6115ca6-c478-49d0-806c-61811ed6f68a.jpg",
  lionsHead: "/bc739794-4398-45e0-93bc-9f306be58a0e.jpg"
};

export const imageLibrary = Object.values(images);

export const destinations: Destination[] = [
{ id: 'cape-town', name: 'Cape Town', region: 'Western Cape', blurb: 'Mountain trails, Atlantic light and a food scene shaped by centuries of trade.', image: images.capeTown },
{ id: 'kruger', name: 'Kruger National Park', region: 'Mpumalanga & Limpopo', blurb: 'Two million hectares of bushveld with tracker-led drives and walking safaris.', image: images.kruger },
{ id: 'stellenbosch', name: 'Stellenbosch', region: 'Cape Winelands', blurb: 'Oak-lined streets, historic estates and small-batch cellars an hour from the city.', image: images.stellenbosch },
{ id: 'johannesburg', name: 'Johannesburg', region: 'Gauteng', blurb: 'Soweto heritage, Maboneng street art and the stories that built the city.', image: images.soweto },
{ id: 'garden-route', name: 'Garden Route', region: 'Western & Eastern Cape', blurb: 'Indigenous forest, river gorges and coastal hikes along the N2.', image: images.gardenRoute },
{ id: 'durban', name: 'Durban', region: 'KwaZulu-Natal', blurb: 'Warm Indian Ocean beaches and the country’s most celebrated curry houses.', image: images.durbanFood },
{ id: 'hermanus', name: 'Hermanus', region: 'Overberg', blurb: 'Land- and boat-based whale watching in Walker Bay from June to November.', image: images.hermanus }];


export const categories: Category[] = [
{ id: 'wildlife-safari', name: 'Wildlife & Safari' },
{ id: 'adventure', name: 'Adventure' },
{ id: 'food-culture', name: 'Food & Culture' },
{ id: 'nature', name: 'Nature' },
{ id: 'wine-culinary', name: 'Wine & Culinary' },
{ id: 'photography', name: 'Photography' },
{ id: 'city', name: 'City Experiences' },
{ id: 'outdoor', name: 'Outdoor Activities' }];


export const languageOptions = ['English', 'Afrikaans', 'isiZulu', 'isiXhosa', 'Sesotho', 'Setswana', 'German', 'French', 'Portuguese'];

export const specialtyOptions = ['Photography', 'Hiking', 'Wildlife tracking', 'Birding', 'Food & markets', 'Wine', 'History & heritage', 'Street art', 'Marine life', 'Adventure sports', 'Family trips', 'Accessible travel'];

export const interestOptions = ['Photography', 'Nature', 'Local food', 'Wine', 'Wildlife', 'Hiking', 'History & heritage', 'Beaches', 'Adventure', 'Art & design', 'Markets', 'Whale watching'];

export const preferenceOptions = ['Private group only', 'Hotel pick-up', 'Early starts are fine', 'Vegetarian meals', 'Child-friendly', 'Wheelchair accessible', 'Small walking distances'];

export const documentTypes: {type: 'identity' | 'guide_registration' | 'business_registration' | 'liability_insurance';label: string;hint: string;required: boolean;}[] = [
{ type: 'identity', label: 'Identity document', hint: 'SA ID, passport or driver’s licence', required: true },
{ type: 'guide_registration', label: 'Tourist guide registration', hint: 'Provincial registration or FGASA certificate', required: true },
{ type: 'business_registration', label: 'Business registration', hint: 'CIPC document, if trading as a company', required: false },
{ type: 'liability_insurance', label: 'Public liability insurance', hint: 'Current policy schedule', required: false }];