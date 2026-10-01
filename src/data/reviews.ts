export interface ReviewSeed {
  id: string;
  /** Links to an existing operational booking; otherwise a historical completed booking is generated. */
  bookingId?: string;
  travellerId: string;
  experienceId?: string;
  providerId?: string;
  rating: number;
  comment: string;
  daysAgo: number;
  guests: number;
  status?: 'published' | 'flagged' | 'removed';
}

export const seedReviews: ReviewSeed[] = [
{ id: 'r-1', bookingId: 'b-1002', travellerId: 'u-sarah', experienceId: 'e-lionshead', rating: 5, comment: 'Thabo timed everything perfectly — we reached the top ten minutes before sunrise. He was patient on the chains section and the coffee at the summit was a lovely touch.', daysAgo: 19, guests: 2 },
{ id: 'r-2', bookingId: 'b-1011', travellerId: 'u-t5', experienceId: 'e-bokaap', rating: 5, comment: 'The best food tour we did in South Africa. The spice shop owner’s stories were fascinating and the bredie was outstanding.', daysAgo: 4, guests: 2 },
{ id: 'r-3', bookingId: 'b-1016', travellerId: 'u-t2', experienceId: 'e-maboneng', rating: 4, comment: 'Great energy and lovely artists. Would have liked a little more time on the rooftop at the end.', daysAgo: 2, guests: 2 },
{ id: 'r-4', bookingId: 'b-1022', travellerId: 'u-t4', providerId: 'p-lerato', rating: 5, comment: 'Lerato designed exactly the day we asked for. Moving, well-paced and full of personal stories.', daysAgo: 11, guests: 2 },
{ id: 'r-5', travellerId: 'u-t1', experienceId: 'e-lionshead', rating: 5, comment: 'Challenging but worth every step. Thabo knows the mountain inside out.', daysAgo: 48, guests: 2 },
{ id: 'r-6', travellerId: 'u-t3', experienceId: 'e-lionshead', rating: 4, comment: 'Beautiful sunrise, a bit crowded at the top on a Saturday but the guiding was excellent.', daysAgo: 66, guests: 3 },
{ id: 'r-7', travellerId: 'u-t4', experienceId: 'e-peninsula-photo', rating: 5, comment: 'I learned more about light in one day than in a year of YouTube. Cape Point at golden hour was unforgettable.', daysAgo: 30, guests: 1 },
{ id: 'r-8', travellerId: 'u-t8', experienceId: 'e-peninsula-photo', rating: 5, comment: 'Small group, plenty of time at every stop, and Thabo helped me finally understand manual mode.', daysAgo: 80, guests: 2 },
{ id: 'r-9', travellerId: 'u-t6', experienceId: 'e-bokaap', rating: 4, comment: 'Delicious and informative. The koesisters were a highlight.', daysAgo: 55, guests: 2 },
{ id: 'r-10', travellerId: 'u-t2', experienceId: 'e-golden-hour', rating: 5, comment: 'Only four of us, so it felt like a private lesson. The Twelve Apostles at sunset are magic.', daysAgo: 21, guests: 2 },
{ id: 'r-11', travellerId: 'u-t5', experienceId: 'e-stellenbosch-wine', rating: 5, comment: 'Annelie took us to cellars we would never have found. Lunch was superb.', daysAgo: 40, guests: 2 },
{ id: 'r-12', travellerId: 'u-t7', experienceId: 'e-stellenbosch-wine', rating: 4, comment: 'Lovely wines and very knowledgeable guide. The drive between estates was longer than expected.', daysAgo: 72, guests: 4 },
{ id: 'r-13', travellerId: 'u-t1', experienceId: 'e-franschhoek-cycle', rating: 5, comment: 'E-bikes made it easy and fun. A perfect lazy day in the valley.', daysAgo: 26, guests: 2 },
{ id: 'r-14', travellerId: 'u-t3', experienceId: 'e-winelands-cooking', rating: 4, comment: 'Great malva pudding recipe! Pairings were thoughtful.', daysAgo: 90, guests: 2 },
{ id: 'r-15', travellerId: 'u-t2', experienceId: 'e-kruger-sunrise', rating: 5, comment: 'Lions within 20 minutes of the gate opening. Sipho’s tracking skills are remarkable.', daysAgo: 33, guests: 2 },
{ id: 'r-16', travellerId: 'u-t4', experienceId: 'e-kruger-sunrise', rating: 5, comment: 'Calm, respectful sightings and a guide who clearly loves the bush.', daysAgo: 61, guests: 2 },
{ id: 'r-17', travellerId: 'u-t5', experienceId: 'e-kruger-walk', rating: 5, comment: 'Seeing a white rhino on foot is something I will never forget. Felt very safe with the two guides.', daysAgo: 44, guests: 2 },
{ id: 'r-18', travellerId: 'u-t8', experienceId: 'e-kruger-fullday', rating: 4, comment: 'A long day but we saw four of the Big Five. Lunch at Lower Sabie was lovely.', daysAgo: 52, guests: 2 },
{ id: 'r-19', travellerId: 'u-t1', experienceId: 'e-durban-curry', rating: 5, comment: 'Priya is a brilliant storyteller and the bunny chow lived up to the hype.', daysAgo: 37, guests: 2 },
{ id: 'r-20', travellerId: 'u-t7', experienceId: 'e-durban-curry', rating: 5, comment: 'Blending our own masala was such a fun idea. We cook with it at home now.', daysAgo: 70, guests: 2 },
{ id: 'r-21', travellerId: 'u-t6', experienceId: 'e-durban-beachfront', rating: 4, comment: 'Easy ride with good stops. Go in the morning before it gets hot.', daysAgo: 29, guests: 2 },
{ id: 'r-22', travellerId: 'u-t3', experienceId: 'e-thousand-hills', rating: 4, comment: 'Beautiful views and a warm welcome at the homestead.', daysAgo: 85, guests: 3 },
{ id: 'r-23', travellerId: 'u-t5', experienceId: 'e-soweto', rating: 5, comment: 'Lerato’s personal stories made Vilakazi Street come alive. The shisa nyama was a feast.', daysAgo: 23, guests: 2 },
{ id: 'r-24', travellerId: 'u-t2', experienceId: 'e-soweto', rating: 5, comment: 'Honest, thoughtful and fun. A must in Johannesburg.', daysAgo: 58, guests: 2 },
{ id: 'r-25', travellerId: 'u-t8', experienceId: 'e-constitution-hill', rating: 5, comment: 'An emotional, important day. Very well guided.', daysAgo: 47, guests: 1 },
{ id: 'r-26', travellerId: 'u-t4', experienceId: 'e-storms-river', rating: 5, comment: 'Floating through the gorge on lilos was the highlight of our Garden Route trip.', daysAgo: 35, guests: 2 },
{ id: 'r-27', travellerId: 'u-t6', experienceId: 'e-storms-river', rating: 4, comment: 'Cold water but wetsuits helped. Instructors were great with our teenagers.', daysAgo: 64, guests: 4 },
{ id: 'r-28', travellerId: 'u-t7', experienceId: 'e-otter-day', rating: 5, comment: 'Stunning coastline and a great pace. Marco knew every tidal pool.', daysAgo: 42, guests: 2 },
{ id: 'r-29', travellerId: 'u-t1', experienceId: 'e-hermanus-boat', rating: 5, comment: 'A mother and calf came right alongside the boat. Jenna’s commentary was fascinating.', daysAgo: 18, guests: 2 },
{ id: 'r-30', travellerId: 'u-t3', experienceId: 'e-hermanus-boat', rating: 4, comment: 'Choppy sea but excellent sightings. Bring a warm layer.', daysAgo: 50, guests: 2 },
{ id: 'r-31', travellerId: 'u-t8', experienceId: 'e-cliff-path', rating: 4, comment: 'Relaxed walk with whales close to shore, and the fynbos gin was a nice finish.', daysAgo: 27, guests: 2 },
{ id: 'r-32', travellerId: 'u-t5', experienceId: 'e-overberg-photo', rating: 5, comment: 'Gorgeous light and great tips on photographing seabirds.', daysAgo: 39, guests: 1 },
{ id: 'r-33', travellerId: 'u-t6', experienceId: 'e-maboneng', rating: 2, comment: 'Worst tour ever, total waste of money, the guide is a scam artist!!! Call me on 082 000 0000 for a better deal.', daysAgo: 6, guests: 2, status: 'flagged' }];