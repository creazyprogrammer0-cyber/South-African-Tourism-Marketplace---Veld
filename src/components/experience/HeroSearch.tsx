import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPinIcon, CalendarIcon, UsersIcon, SearchIcon } from 'lucide-react';
import { destinations } from '../../data/catalog';
import { dateFromToday } from '../../utils/dates';

export function HeroSearch() {
  const navigate = useNavigate();
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const [guests, setGuests] = useState(2);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (destination) params.set('destination', destination);
    if (date) params.set('date', date);
    if (guests > 1) params.set('guests', String(guests));
    navigate(`/explore?${params.toString()}`);
  };

  const cell = 'flex items-center gap-3 px-4 py-3 md:py-0';
  return (
    <form onSubmit={submit} role="search" aria-label="Find experiences" className="grid gap-px overflow-hidden rounded-2xl bg-line shadow-pop md:grid-cols-[1.4fr_1fr_0.8fr_auto] md:rounded-full">
      <label className={`${cell} bg-surface md:h-16 md:pl-6`}>
        <MapPinIcon className="h-5 w-5 shrink-0 text-ink-500" aria-hidden />
        <span className="flex min-w-0 flex-1 flex-col">
          <span className="text-xs font-medium text-ink-500">Where</span>
          <select value={destination} onChange={(e) => setDestination(e.target.value)} className="w-full appearance-none bg-transparent text-sm font-medium text-ink focus:outline-none">
            <option value="">All of South Africa</option>
            {destinations.map((d) =>
            <option key={d.id} value={d.id}>
                {d.name}
              </option>
            )}
          </select>
        </span>
      </label>
      <label className={`${cell} bg-surface md:h-16`}>
        <CalendarIcon className="h-5 w-5 shrink-0 text-ink-500" aria-hidden />
        <span className="flex min-w-0 flex-1 flex-col">
          <span className="text-xs font-medium text-ink-500">When</span>
          <input type="date" value={date} min={dateFromToday(1)} onChange={(e) => setDate(e.target.value)} className="w-full bg-transparent text-sm font-medium text-ink focus:outline-none" />
        </span>
      </label>
      <label className={`${cell} bg-surface md:h-16`}>
        <UsersIcon className="h-5 w-5 shrink-0 text-ink-500" aria-hidden />
        <span className="flex min-w-0 flex-1 flex-col">
          <span className="text-xs font-medium text-ink-500">Travellers</span>
          <select value={guests} onChange={(e) => setGuests(Number(e.target.value))} className="w-full appearance-none bg-transparent text-sm font-medium text-ink focus:outline-none">
            {Array.from({ length: 10 }, (_, i) => i + 1).map((n) =>
            <option key={n} value={n}>
                {n} {n === 1 ? 'traveller' : 'travellers'}
              </option>
            )}
          </select>
        </span>
      </label>
      <div className="bg-surface p-2 md:flex md:items-center md:pr-2">
        <button type="submit" className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-clay px-6 text-sm font-semibold text-white transition-colors duration-150 ease-out hover:bg-clay-700 md:rounded-full">
          <SearchIcon className="h-4 w-4" aria-hidden />
          Explore Experiences
        </button>
      </div>
    </form>);

}