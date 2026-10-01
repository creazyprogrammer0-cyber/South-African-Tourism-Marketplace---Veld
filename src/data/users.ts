import type { User } from '../types/marketplace';

export const ADMIN_ID = 'u-admin';

export const seedUsers: User[] = [
{ id: 'u-sarah', role: 'traveller', name: 'Sarah Morgan', email: 'sarah.morgan@example.com', phone: '+44 7700 900412', country: 'United Kingdom', status: 'active', createdAt: '2025-11-02T09:00:00Z' },
{ id: 'u-t1', role: 'traveller', name: 'Daniel Okafor', email: 'daniel.okafor@example.com', country: 'Nigeria', status: 'active', createdAt: '2025-08-14T09:00:00Z' },
{ id: 'u-t2', role: 'traveller', name: 'Emma Lindqvist', email: 'emma.l@example.com', country: 'Sweden', status: 'active', createdAt: '2025-09-01T09:00:00Z' },
{ id: 'u-t3', role: 'traveller', name: 'Rajesh Pillay', email: 'rajesh.p@example.com', country: 'South Africa', status: 'active', createdAt: '2025-06-21T09:00:00Z' },
{ id: 'u-t4', role: 'traveller', name: 'Claire Dubois', email: 'claire.dubois@example.com', country: 'France', status: 'active', createdAt: '2025-10-11T09:00:00Z' },
{ id: 'u-t5', role: 'traveller', name: 'Michael Chen', email: 'm.chen@example.com', country: 'Australia', status: 'active', createdAt: '2025-07-30T09:00:00Z' },
{ id: 'u-t6', role: 'traveller', name: 'Naledi Sithole', email: 'naledi.s@example.com', country: 'South Africa', status: 'active', createdAt: '2026-01-05T09:00:00Z' },
{ id: 'u-t7', role: 'traveller', name: 'Jonas Becker', email: 'jonas.becker@example.com', country: 'Germany', status: 'active', createdAt: '2026-02-18T09:00:00Z' },
{ id: 'u-t8', role: 'traveller', name: 'Olivia Hart', email: 'olivia.hart@example.com', country: 'United States', status: 'active', createdAt: '2026-03-09T09:00:00Z' },
{ id: 'u-thabo', role: 'provider', name: 'Thabo Mokoena', email: 'thabo@mokoenatrails.co.za', phone: '+27 82 555 0141', status: 'active', createdAt: '2024-03-12T09:00:00Z' },
{ id: 'u-annelie', role: 'provider', name: 'Annelie van der Merwe', email: 'annelie@winelandstable.co.za', status: 'active', createdAt: '2024-05-02T09:00:00Z' },
{ id: 'u-sipho', role: 'provider', name: 'Sipho Ndlovu', email: 'sipho@bushveldtracker.co.za', status: 'active', createdAt: '2024-01-20T09:00:00Z' },
{ id: 'u-priya', role: 'provider', name: 'Priya Naidoo', email: 'priya@spiceroutedbn.co.za', status: 'active', createdAt: '2024-07-15T09:00:00Z' },
{ id: 'u-lerato', role: 'provider', name: 'Lerato Khumalo', email: 'lerato@jozistreets.co.za', status: 'active', createdAt: '2024-09-03T09:00:00Z' },
{ id: 'u-marco', role: 'provider', name: 'Marco Ferreira', email: 'marco@tsitsikammaedge.co.za', status: 'active', createdAt: '2024-04-27T09:00:00Z' },
{ id: 'u-jenna', role: 'provider', name: 'Jenna Pieterse', email: 'jenna@walkerbayocean.co.za', status: 'active', createdAt: '2024-06-08T09:00:00Z' },
{ id: 'u-lindiwe', role: 'provider', name: 'Lindiwe Dube', email: 'lindiwe@capekitchen.co.za', phone: '+27 73 555 0198', status: 'active', createdAt: '2026-09-10T09:00:00Z' },
{ id: 'u-kagiso', role: 'provider', name: 'Kagiso Molefe', email: 'kagiso@highveldphoto.co.za', status: 'active', createdAt: '2026-09-18T09:00:00Z' },
{ id: 'u-ruan', role: 'provider', name: 'Ruan Botha', email: 'ruan@karoooverland.co.za', status: 'active', createdAt: '2026-09-26T09:00:00Z' },
{ id: 'u-zanele', role: 'provider', name: 'Zanele Mthembu', email: 'zanele@coastalquads.co.za', status: 'active', createdAt: '2026-08-02T09:00:00Z' },
{ id: ADMIN_ID, role: 'admin', name: 'Platform Administrator', email: 'ops@veld.co.za', status: 'active', createdAt: '2024-01-01T09:00:00Z' }];