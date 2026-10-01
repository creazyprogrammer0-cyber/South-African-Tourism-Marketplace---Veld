import type { Experience } from '../types/marketplace';
import { images as i } from './catalog';

const T = '2026-01-10T09:00:00Z';
const ALL = [0, 1, 2, 3, 4, 5, 6];
const WEEKDAYS = [1, 2, 3, 4, 5];

export const seedExperiences: Experience[] = [
// ——— Thabo · Cape Town
{
  id: 'e-lionshead', providerId: 'p-thabo', title: 'Lion’s Head Sunrise Hike', category: 'outdoor', destination: 'cape-town',
  summary: 'Reach the summit for first light over Table Mountain and the Atlantic seaboard.',
  description: 'We start in the dark from Signal Hill Road and climb the spiralling path to the summit of Lion’s Head, using chains and ladders on the final section (an easier route is available). At the top you’ll watch the sun rise behind Table Mountain while the city wakes below. I carry hot coffee and rusks, and share the stories of the mountain on the way down. Moderate fitness required; the climb is around 2.5 hours return.',
  images: [i.lionsHead, i.capeTown, i.capePoint], durationHours: 3.5, price: 650, maxGuests: 8,
  meetingPoint: 'Lion’s Head parking area, Signal Hill Road. Head torches provided.',
  inclusions: ['Registered mountain guide', 'Head torch', 'Coffee, rooibos and rusks', 'Safety briefing and first aid kit'],
  exclusions: ['Transport to the trailhead', 'Gratuities'], cancellationPolicy: 'flexible',
  languages: ['English', 'isiZulu', 'Afrikaans'], times: ['05:00'], weekdays: ALL, status: 'published', createdAt: T, updatedAt: T
},
{
  id: 'e-peninsula-photo', providerId: 'p-thabo', title: 'Cape Peninsula Photography Safari', category: 'photography', destination: 'cape-town',
  summary: 'A full day chasing light from Chapman’s Peak to Cape Point with a working photographer.',
  description: 'Designed for photographers of every level, this day follows the best light around the peninsula: Chapman’s Peak at mid-morning, the penguins at Boulders Beach, the cliffs of Cape Point and a sunset stop at Kommetjie lighthouse. Expect practical coaching on composition and exposure, plus time to simply shoot. Small group, comfortable vehicle, flexible pacing.',
  images: [i.capePoint, i.capeTown, i.lionsHead], durationHours: 10, price: 2450, maxGuests: 6,
  meetingPoint: 'Hotel pick-up within the City Bowl, Sea Point and Green Point.',
  inclusions: ['Hotel pick-up and drop-off', 'Cape Point and Boulders entrance fees', 'Picnic lunch', 'One-on-one photo coaching'],
  exclusions: ['Camera equipment', 'Dinner'], cancellationPolicy: 'moderate',
  languages: ['English', 'Afrikaans'], times: ['07:30'], weekdays: [2, 4, 6], status: 'published', createdAt: T, updatedAt: T
},
{
  id: 'e-bokaap', providerId: 'p-thabo', title: 'Bo-Kaap Food & Stories Walk', category: 'food-culture', destination: 'cape-town',
  summary: 'Cape Malay tastings, spice shops and the history behind the colourful houses.',
  description: 'Walk the cobbled streets of the Bo-Kaap with tastings at four family-run spots: koesisters, samoosas, a bredie lunch and a spice merchant who has been blending masalas for three generations. Along the way we talk about the community’s history from slavery to District Six to today, and how the neighbourhood is protecting its heritage.',
  images: [i.boKaap, i.capeTown], durationHours: 3, price: 780, maxGuests: 10,
  meetingPoint: 'Corner of Wale and Rose Street, outside the Bo-Kaap Museum.',
  inclusions: ['Five tastings including lunch', 'Bo-Kaap Museum entry', 'Local guide'],
  exclusions: ['Additional drinks', 'Hotel transfers'], cancellationPolicy: 'flexible',
  languages: ['English', 'isiZulu'], times: ['10:00', '14:30'], weekdays: [1, 2, 3, 4, 5, 6], status: 'published', createdAt: T, updatedAt: T
},
{
  id: 'e-golden-hour', providerId: 'p-thabo', title: 'Table Mountain Golden Hour Photo Walk', category: 'photography', destination: 'cape-town',
  summary: 'An intimate evening walk on the Pipe Track timed for the last light of the day.',
  description: 'A gentle contour walk on the Pipe Track above Camps Bay with the Twelve Apostles glowing at sunset. Limited to four guests so everyone gets personal coaching. Suitable for phones and cameras.',
  images: [i.capeTown, i.lionsHead], durationHours: 2.5, price: 890, maxGuests: 4,
  meetingPoint: 'Kloof Nek round-about parking.',
  inclusions: ['Photo coaching', 'Sundowner drink'], exclusions: ['Transport'], cancellationPolicy: 'moderate',
  languages: ['English'], times: ['17:00'], weekdays: [5, 6], status: 'published', createdAt: T, updatedAt: T
},
// ——— Annelie · Stellenbosch
{
  id: 'e-stellenbosch-wine', providerId: 'p-annelie', title: 'Stellenbosch Small-Cellar Wine Tour', category: 'wine-culinary', destination: 'stellenbosch',
  summary: 'Three family estates, cellar-door tastings and a long lunch among the vines.',
  description: 'Skip the coach crowds and visit three family-owned cellars in the Jonkershoek and Banghoek valleys. Taste Chenin Blanc, Pinotage and Cape blends with the winemakers, then sit down for a seasonal two-course lunch on a historic farm. Transport from Stellenbosch or Cape Town is included.',
  images: [i.stellenbosch, i.capeTown], durationHours: 7, price: 1850, maxGuests: 8,
  meetingPoint: 'Pick-up from Stellenbosch town or Cape Town CBD hotels.',
  inclusions: ['Return transport', 'Three tastings', 'Two-course lunch', 'Bottled water'],
  exclusions: ['Wine purchases', 'Gratuities'], cancellationPolicy: 'moderate',
  languages: ['English', 'Afrikaans', 'German'], times: ['09:30'], weekdays: [1, 2, 3, 4, 5, 6], status: 'published', createdAt: T, updatedAt: T
},
{
  id: 'e-franschhoek-cycle', providerId: 'p-annelie', title: 'Franschhoek Cellar Cycling', category: 'outdoor', destination: 'stellenbosch',
  summary: 'E-bike between four Franschhoek estates on quiet farm roads.',
  description: 'An easy e-bike route linking four estates in the Franschhoek valley, with tastings at each and a stop for cheese and charcuterie. Suitable for anyone comfortable on a bicycle.',
  images: [i.stellenbosch], durationHours: 5, price: 1350, maxGuests: 10,
  meetingPoint: 'Franschhoek Huguenot Monument.',
  inclusions: ['E-bike and helmet', 'Four tastings', 'Cheese platter'], exclusions: ['Transport to Franschhoek'], cancellationPolicy: 'flexible',
  languages: ['English', 'Afrikaans'], times: ['10:00'], weekdays: [3, 4, 5, 6, 0], status: 'published', createdAt: T, updatedAt: T
},
{
  id: 'e-winelands-cooking', providerId: 'p-annelie', title: 'Cape Winelands Cooking Class & Pairing', category: 'wine-culinary', destination: 'stellenbosch',
  summary: 'Cook a Cape country menu and pair each course with estate wines.',
  description: 'In a farmhouse kitchen outside Stellenbosch, cook bobotie, roosterkoek and malva pudding alongside a local chef, then sit down to eat with matched wines.',
  images: [i.stellenbosch, i.boKaap], durationHours: 4, price: 1450, maxGuests: 12,
  meetingPoint: 'Lanzerac Road farm kitchen, Stellenbosch.',
  inclusions: ['All ingredients', 'Three-course meal', 'Wine pairings', 'Recipe cards'], exclusions: ['Transport'], cancellationPolicy: 'strict',
  languages: ['English', 'Afrikaans'], times: ['11:00'], weekdays: [2, 4, 6], status: 'published', createdAt: T, updatedAt: T
},
// ——— Sipho · Kruger
{
  id: 'e-kruger-sunrise', providerId: 'p-sipho', title: 'Kruger Sunrise Game Drive', category: 'wildlife-safari', destination: 'kruger',
  summary: 'Enter at gate opening in an open vehicle with a tracker-trained guide.',
  description: 'We enter Phabeni Gate as it opens, when predators are still active and the light is soft. Four hours in an open safari vehicle searching for the Big Five, with coffee in the bush. Sightings are never guaranteed, but our guides read tracks and radio sightings to give you the best chance.',
  images: [i.kruger], durationHours: 4.5, price: 1150, maxGuests: 9,
  meetingPoint: 'Phabeni Gate, Hazyview. Lodge pick-ups in Hazyview available.',
  inclusions: ['Open safari vehicle', 'Field guide', 'Coffee and snacks', 'Binoculars'],
  exclusions: ['Kruger conservation fee (paid at gate)', 'Gratuities'], cancellationPolicy: 'moderate',
  languages: ['English', 'isiZulu'], times: ['05:30'], weekdays: ALL, status: 'published', createdAt: T, updatedAt: T
},
{
  id: 'e-kruger-walk', providerId: 'p-sipho', title: 'Guided Bush Walk with Armed Trails Guides', category: 'wildlife-safari', destination: 'kruger',
  summary: 'Track on foot with two armed trails guides in the southern Kruger.',
  description: 'Experience the bush at walking pace: dung beetles, tracks, medicinal plants and, sometimes, the thrill of a rhino at a respectful distance. Groups of up to six with two qualified trails guides. Minimum age 16.',
  images: [i.kruger, i.gardenRoute], durationHours: 4, price: 1290, maxGuests: 6,
  meetingPoint: 'Skukuza Rest Camp reception.',
  inclusions: ['Two armed trails guides', 'Breakfast pack', 'Transfer to walk site'], exclusions: ['Conservation fee'], cancellationPolicy: 'strict',
  languages: ['English', 'Setswana'], times: ['05:00'], weekdays: [1, 3, 5, 6], status: 'published', createdAt: T, updatedAt: T
},
{
  id: 'e-kruger-fullday', providerId: 'p-sipho', title: 'Full-Day Kruger Safari from Hazyview', category: 'wildlife-safari', destination: 'kruger',
  summary: 'Gate-open to gate-close in the southern Kruger with lunch at Lower Sabie.',
  description: 'A full day exploring the Sabie River and the open plains around Lower Sabie, prime country for lion, elephant and buffalo. Lunch overlooking the river.',
  images: [i.kruger], durationHours: 11, price: 2650, maxGuests: 9,
  meetingPoint: 'Hazyview lodge pick-up.',
  inclusions: ['Open vehicle', 'Guide', 'Lunch', 'Conservation fee'], exclusions: ['Drinks at lunch'], cancellationPolicy: 'moderate',
  languages: ['English', 'isiZulu'], times: ['05:30'], weekdays: ALL, status: 'published', createdAt: T, updatedAt: T
},
// ——— Priya · Durban
{
  id: 'e-durban-curry', providerId: 'p-priya', title: 'Durban Curry Trail & Victoria Street Market', category: 'food-culture', destination: 'durban',
  summary: 'Bunny chow, spice blending and the stories of Durban’s Indian community.',
  description: 'From the Victoria Street Market spice stalls to a 70-year-old curry house, taste your way through Durban’s Indian heritage. You’ll blend your own masala to take home and finish with the city’s best bunny chow.',
  images: [i.durbanFood], durationHours: 3.5, price: 720, maxGuests: 10,
  meetingPoint: 'Victoria Street Market main entrance.',
  inclusions: ['Six tastings', 'Spice-blending session', 'Take-home masala'], exclusions: ['Drinks', 'Transfers'], cancellationPolicy: 'flexible',
  languages: ['English', 'isiZulu'], times: ['10:00'], weekdays: [1, 2, 3, 4, 5, 6], status: 'published', createdAt: T, updatedAt: T
},
{
  id: 'e-durban-beachfront', providerId: 'p-priya', title: 'Golden Mile Beachfront & Markets by Bike', category: 'city', destination: 'durban',
  summary: 'Cycle the promenade from uShaka to Blue Lagoon with local stops.',
  description: 'An easy ride along Durban’s Golden Mile with stops for fresh sugar cane juice, surf culture at New Pier and the fishermen of Blue Lagoon.',
  images: [i.durbanFood, i.hermanus], durationHours: 3, price: 560, maxGuests: 12,
  meetingPoint: 'uShaka Marine World main gate.',
  inclusions: ['Bike and helmet', 'Guide', 'Juice stop'], exclusions: ['Food'], cancellationPolicy: 'flexible',
  languages: ['English'], times: ['08:00', '15:00'], weekdays: ALL, status: 'published', createdAt: T, updatedAt: T
},
{
  id: 'e-thousand-hills', providerId: 'p-priya', title: 'Valley of a Thousand Hills Cultural Day', category: 'nature', destination: 'durban',
  summary: 'Rolling hills, a Zulu homestead visit and a traditional lunch.',
  description: 'Drive inland to the Valley of a Thousand Hills for viewpoints, a visit to a family homestead in the valley and a home-cooked lunch.',
  images: [i.gardenRoute, i.durbanFood], durationHours: 7, price: 1380, maxGuests: 8,
  meetingPoint: 'Durban hotel pick-up.',
  inclusions: ['Transport', 'Lunch', 'Community visit contribution'], exclusions: ['Gratuities'], cancellationPolicy: 'moderate',
  languages: ['English', 'isiZulu'], times: ['08:30'], weekdays: [2, 4, 6], status: 'published', createdAt: T, updatedAt: T
},
// ——— Lerato · Johannesburg
{
  id: 'e-soweto', providerId: 'p-lerato', title: 'Soweto Heritage & Shisa Nyama Lunch', category: 'city', destination: 'johannesburg',
  summary: 'Vilakazi Street, the Hector Pieterson Memorial and lunch at a local shisa nyama.',
  description: 'Walk Vilakazi Street, the only street in the world home to two Nobel Peace Prize winners, visit the Hector Pieterson Memorial and finish with braai at a neighbourhood shisa nyama. Told from the perspective of people who grew up here.',
  images: [i.soweto], durationHours: 5, price: 950, maxGuests: 12,
  meetingPoint: 'Hotel pick-up in Rosebank, Sandton or Braamfontein.',
  inclusions: ['Transport', 'Memorial entrance', 'Shisa nyama lunch'], exclusions: ['Mandela House entry'], cancellationPolicy: 'flexible',
  languages: ['English', 'isiZulu', 'Sesotho'], times: ['09:00'], weekdays: ALL, status: 'published', createdAt: T, updatedAt: T
},
{
  id: 'e-maboneng', providerId: 'p-lerato', title: 'Maboneng & Inner-City Street Art Walk', category: 'city', destination: 'johannesburg',
  summary: 'Murals, studios and rooftop views in Johannesburg’s creative district.',
  description: 'A walking tour of Maboneng and the surrounding inner city, meeting artists, discovering murals and ending at a rooftop with a view of the skyline.',
  images: [i.soweto], durationHours: 3, price: 520, maxGuests: 10,
  meetingPoint: 'Arts on Main, Fox Street.',
  inclusions: ['Guide', 'Coffee stop'], exclusions: ['Food and drinks'], cancellationPolicy: 'flexible',
  languages: ['English', 'Setswana'], times: ['10:00', '14:00'], weekdays: [2, 3, 4, 5, 6, 0], status: 'published', createdAt: T, updatedAt: T
},
{
  id: 'e-constitution-hill', providerId: 'p-lerato', title: 'Constitution Hill & Apartheid Museum: A Day of South African History, Struggle and Democracy', category: 'city', destination: 'johannesburg',
  summary: 'A full day through two of the country’s most important museums.',
  description: 'Guided visits to Constitution Hill, the former prison where Mandela and Gandhi were held and now home to the Constitutional Court, and the Apartheid Museum. A thoughtful, sometimes emotional day.',
  images: [i.soweto, i.capeTown], durationHours: 7, price: 1250, maxGuests: 12,
  meetingPoint: 'Hotel pick-up in northern suburbs.',
  inclusions: ['Transport', 'Museum entry', 'Lunch'], exclusions: ['Gratuities'], cancellationPolicy: 'moderate',
  languages: ['English', 'isiZulu'], times: ['08:30'], weekdays: [2, 3, 4, 5, 6], status: 'published', createdAt: T, updatedAt: T
},
// ——— Marco · Garden Route
{
  id: 'e-storms-river', providerId: 'p-marco', title: 'Storms River Kayak & Lilo Gorge', category: 'adventure', destination: 'garden-route',
  summary: 'Paddle and float through the towering Storms River gorge.',
  description: 'Kayak up the Storms River mouth beneath the suspension bridge, then switch to lilos to float deep into the narrow gorge. Wetsuits and all gear provided. Swimming ability required.',
  images: [i.gardenRoute], durationHours: 3, price: 890, maxGuests: 10,
  meetingPoint: 'Storms River Mouth Rest Camp, Tsitsikamma.',
  inclusions: ['Kayak, lilo and wetsuit', 'Instructor', 'Snack'], exclusions: ['SANParks conservation fee'], cancellationPolicy: 'flexible',
  languages: ['English', 'Portuguese'], times: ['09:00', '13:00'], weekdays: ALL, status: 'published', createdAt: T, updatedAt: T
},
{
  id: 'e-otter-day', providerId: 'p-marco', title: 'Otter Trail Waterfall Day Hike', category: 'nature', destination: 'garden-route',
  summary: 'The first stretch of the famous Otter Trail to a beach waterfall.',
  description: 'Hike the coastal section of the Otter Trail to a waterfall tumbling onto the beach. Rocky scrambles, tidal pools and fynbos. Moderate fitness.',
  images: [i.gardenRoute, i.hermanus], durationHours: 4, price: 690, maxGuests: 8,
  meetingPoint: 'Storms River Mouth Rest Camp.',
  inclusions: ['Guide', 'Packed lunch'], exclusions: ['Conservation fee'], cancellationPolicy: 'flexible',
  languages: ['English'], times: ['08:30'], weekdays: [1, 3, 5, 6, 0], status: 'published', createdAt: T, updatedAt: T
},
{
  id: 'e-knysna-canopy', providerId: 'p-marco', title: 'Knysna Forest Canopy & Elephant Walk', category: 'nature', destination: 'garden-route',
  summary: 'Ancient yellowwoods and the search for the forest’s elusive elephants.',
  description: 'A slow walk through the Knysna forest following historic woodcutter paths. Currently being updated for the new season.',
  images: [i.gardenRoute], durationHours: 3, price: 640, maxGuests: 8,
  meetingPoint: 'Diepwalle Forest Station.',
  inclusions: ['Guide'], exclusions: ['Transport'], cancellationPolicy: 'flexible',
  languages: ['English'], times: ['09:00'], weekdays: ALL, status: 'unpublished', createdAt: T, updatedAt: T
},
// ——— Jenna · Hermanus
{
  id: 'e-hermanus-boat', providerId: 'p-jenna', title: 'Walker Bay Boat-Based Whale Watching', category: 'wildlife-safari', destination: 'hermanus',
  summary: 'Permitted close encounters with southern right whales in season.',
  description: 'Two hours on Walker Bay aboard a permitted vessel that can approach whales to 50 metres. A marine biologist narrates behaviour and conservation. Season runs June to December, with peak sightings in September and October.',
  images: [i.hermanus], durationHours: 2.5, price: 1100, maxGuests: 12,
  meetingPoint: 'New Harbour, Hermanus.',
  inclusions: ['Permitted vessel', 'Marine biologist guide', 'Rain jackets', 'Hot drinks'], exclusions: ['Transport to Hermanus'], cancellationPolicy: 'moderate',
  languages: ['English', 'Afrikaans', 'French'], times: ['09:00', '12:00'], weekdays: ALL, status: 'published', createdAt: T, updatedAt: T
},
{
  id: 'e-cliff-path', providerId: 'p-jenna', title: 'Cliff Path Whale Walk & Fynbos Tasting', category: 'nature', destination: 'hermanus',
  summary: 'Land-based whale spotting along the cliffs with a fynbos gin tasting.',
  description: 'Walk the Hermanus cliff path with binoculars and a biologist, then finish with a tasting of fynbos-infused gins at a local distillery.',
  images: [i.hermanus, i.capePoint], durationHours: 3, price: 620, maxGuests: 10,
  meetingPoint: 'Gearing’s Point, Hermanus.',
  inclusions: ['Binoculars', 'Gin tasting'], exclusions: ['Food'], cancellationPolicy: 'flexible',
  languages: ['English', 'French'], times: ['10:00'], weekdays: [1, 2, 3, 4, 5, 6], status: 'published', createdAt: T, updatedAt: T
},
{
  id: 'e-overberg-photo', providerId: 'p-jenna', title: 'Overberg Coast Photography Morning', category: 'photography', destination: 'hermanus',
  summary: 'Sunrise at the coast, seabirds and the old harbour.',
  description: 'A morning shoot along the Overberg coastline from Onrus to the Old Harbour, with tips for wildlife and seascape photography.',
  images: [i.capePoint, i.hermanus], durationHours: 3.5, price: 790, maxGuests: 6,
  meetingPoint: 'Onrus beach car park.',
  inclusions: ['Photo coaching', 'Breakfast'], exclusions: ['Camera equipment'], cancellationPolicy: 'moderate',
  languages: ['English'], times: ['06:00'], weekdays: WEEKDAYS, status: 'published', createdAt: T, updatedAt: T
},
// ——— Pending providers (cannot publish)
{
  id: 'e-langa-kitchen', providerId: 'p-lindiwe', title: 'Langa Home Kitchen Cooking Class', category: 'food-culture', destination: 'cape-town',
  summary: 'Cook umngqusho and Cape Malay curry in a family kitchen in Langa.',
  description: 'Join me in my kitchen in Langa, Cape Town’s oldest township, to cook umngqusho (samp and beans), a Cape Malay chicken curry and dombolo. We eat together and talk about food and family.',
  images: [i.boKaap], durationHours: 3.5, price: 690, maxGuests: 8,
  meetingPoint: 'Langa Quarter, Washington Street.',
  inclusions: ['All ingredients', 'Meal'], exclusions: ['Transport'], cancellationPolicy: 'flexible',
  languages: ['English', 'isiXhosa'], times: ['11:00'], weekdays: [2, 4, 6], status: 'draft', createdAt: T, updatedAt: T
},
{
  id: 'e-joburg-skyline', providerId: 'p-kagiso', title: 'Johannesburg Skyline Night Photo Walk', category: 'photography', destination: 'johannesburg',
  summary: 'Long-exposure photography from rooftops in the inner city.',
  description: 'Night photography from three rooftops in Braamfontein and the CBD.',
  images: [], durationHours: 3, price: 750, maxGuests: 6,
  meetingPoint: 'Braamfontein, Juta Street.',
  inclusions: ['Rooftop access', 'Tripod loan'], exclusions: ['Transport'], cancellationPolicy: 'moderate',
  languages: ['English'], times: ['18:00'], weekdays: [5, 6], status: 'draft', createdAt: T, updatedAt: T
}];