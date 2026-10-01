import React from 'react';
import { Link } from 'react-router-dom';
import { destinations } from '../../data/catalog';
import { Logo } from './Logo';

export function Footer() {
  return (
    <footer className="mt-24 bg-ink text-white/80">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr_1fr] lg:px-8">
        <div>
          <Logo inverted />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/70">Book experiences with verified local guides across South Africa — or ask them to design one just for you.</p>
        </div>
        <div>
          <h2 className="text-sm font-semibold text-white">Destinations</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {destinations.slice(0, 5).map((d) =>
            <li key={d.id}>
                <Link to={`/explore?destination=${d.id}`} className="hover:text-white">
                  {d.name}
                </Link>
              </li>
            )}
          </ul>
        </div>
        <div>
          <h2 className="text-sm font-semibold text-white">Travellers</h2>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link to="/explore" className="hover:text-white">Explore experiences</Link></li>
            <li><Link to="/account/requests/new" className="hover:text-white">Request a custom experience</Link></li>
            <li><Link to="/account/bookings" className="hover:text-white">My bookings</Link></li>
          </ul>
        </div>
        <div>
          <h2 className="text-sm font-semibold text-white">Guides & providers</h2>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link to="/login?mode=provider" className="hover:text-white">Apply as a provider</Link></li>
            <li><Link to="/provider" className="hover:text-white">Provider workspace</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-5 text-xs text-white/60 sm:flex-row sm:justify-between sm:px-6 lg:px-8">
          <p>© 2026 Veld Experiences (Pty) Ltd · Prototype with simulated data and payments</p>
          <p>Prices in South African Rand (ZAR), including VAT</p>
        </div>
      </div>
    </footer>);

}