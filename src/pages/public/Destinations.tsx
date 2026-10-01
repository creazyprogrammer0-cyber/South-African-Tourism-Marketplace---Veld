import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightIcon } from 'lucide-react';
import { useMarketplace } from '../../contexts/MarketplaceContext';
import { categories, destinations } from '../../data/catalog';
import { publicExperiences } from '../../utils/selectors';
import { formatZAR } from '../../utils/format';

export function Destinations() {
  const { state } = useMarketplace();
  const live = publicExperiences(state);
  return (
    <div className="mx-auto w-full max-w-7xl px-4 pt-10 sm:px-6 lg:px-8">
      <h1 className="font-display text-4xl font-medium text-ink">Destinations</h1>
      <p className="mt-2 max-w-xl text-sm text-ink-500">Seven regions, each with local providers who know them first-hand.</p>
      <div className="mt-10 space-y-6">
        {destinations.map((d, i) => {
          const list = live.filter((e) => e.destination === d.id);
          const from = list.length ? Math.min(...list.map((e) => e.price)) : 0;
          const cats = Array.from(new Set(list.map((e) => e.category))).map((c) => categories.find((x) => x.id === c)?.name).filter(Boolean);
          return (
            <Link key={d.id} to={`/explore?destination=${d.id}`} className={`group grid overflow-hidden rounded-2xl bg-surface shadow-card ring-1 ring-line/60 md:grid-cols-2 ${i % 2 ? 'md:[&>*:first-child]:order-2' : ''}`}>
              <div className="relative h-56 overflow-hidden md:h-72">
                <img src={d.image} alt="" className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]" />
              </div>
              <div className="flex flex-col justify-center p-6 md:p-10">
                <p className="text-sm text-ink-500">{d.region}</p>
                <h2 className="mt-1 font-display text-3xl text-ink">{d.name}</h2>
                <p className="mt-3 text-sm leading-relaxed text-ink-600">{d.blurb}</p>
                <p className="mt-4 text-sm text-ink-700">
                  {list.length} experience{list.length === 1 ? '' : 's'}
                  {from > 0 && <> · from {formatZAR(from)}</>}
                  {cats.length > 0 && <span className="text-ink-500"> · {cats.slice(0, 3).join(', ')}</span>}
                </p>
                <span className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-clay">
                  Explore {d.name} <ArrowRightIcon className="h-4 w-4 transition-transform duration-150 ease-out group-hover:translate-x-0.5" aria-hidden />
                </span>
              </div>
            </Link>);

        })}
      </div>
    </div>);

}