import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SearchIcon, SlidersHorizontalIcon, CompassIcon, XIcon } from 'lucide-react';
import { useMarketplace } from '../../contexts/MarketplaceContext';
import { categories, destinations } from '../../data/catalog';
import { publicExperiences } from '../../utils/selectors';
import { applyFilters, countActiveFilters, defaultFilters, ExperienceFilters, SortKey } from '../../utils/experienceFilters';
import { formatDate } from '../../utils/dates';
import { ExperienceCard, ExperienceCardSkeleton } from '../../components/experience/ExperienceCard';
import { FilterPanel } from '../../components/experience/FilterPanel';
import { Drawer } from '../../components/ui/Drawer';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/EmptyState';
import { Select } from '../../components/ui/FormControls';

const PAGE = 9;

function filtersFromParams(p: URLSearchParams): ExperienceFilters {
  return {
    ...defaultFilters,
    q: p.get('q') ?? '',
    destination: p.get('destination') ?? '',
    categories: p.get('category') ? p.get('category')!.split(',') : [],
    date: p.get('date') ?? '',
    guests: Number(p.get('guests') ?? 1) || 1,
    sort: p.get('sort') as SortKey || 'recommended'
  };
}

export function Explore() {
  const { state } = useMarketplace();
  const [params, setParams] = useSearchParams();
  const [filters, setFilters] = useState<ExperienceFilters>(() => filtersFromParams(params));
  const [visible, setVisible] = useState(PAGE);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Simulated fetch latency whenever the query changes
  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 380);
    return () => clearTimeout(t);
  }, [filters]);

  // Keep shareable params in the URL
  useEffect(() => {
    const next = new URLSearchParams();
    if (filters.q) next.set('q', filters.q);
    if (filters.destination) next.set('destination', filters.destination);
    if (filters.categories.length) next.set('category', filters.categories.join(','));
    if (filters.date) next.set('date', filters.date);
    if (filters.guests > 1) next.set('guests', String(filters.guests));
    if (filters.sort !== 'recommended') next.set('sort', filters.sort);
    setParams(next, { replace: true });
  }, [filters, setParams]);

  const update = (patch: Partial<ExperienceFilters>) => {
    setFilters((f) => ({ ...f, ...patch }));
    setVisible(PAGE);
  };
  const clear = () => {
    setFilters({ ...defaultFilters, sort: filters.sort });
    setVisible(PAGE);
  };

  const results = useMemo(() => applyFilters(state, publicExperiences(state), filters), [state, filters]);
  const active = countActiveFilters(filters);
  const destName = destinations.find((d) => d.id === filters.destination)?.name;

  const chips: {label: string;remove: () => void;}[] = [
  ...(filters.destination ? [{ label: destName ?? '', remove: () => update({ destination: '' }) }] : []),
  ...filters.categories.map((c) => ({ label: categories.find((x) => x.id === c)?.name ?? c, remove: () => update({ categories: filters.categories.filter((x) => x !== c) }) })),
  ...(filters.date ? [{ label: formatDate(filters.date, 'd MMM'), remove: () => update({ date: '' }) }] : []),
  ...(filters.guests > 1 ? [{ label: `${filters.guests} travellers`, remove: () => update({ guests: 1 }) }] : []),
  ...(filters.minRating ? [{ label: `${filters.minRating}+ rating`, remove: () => update({ minRating: 0 }) }] : []),
  ...(filters.maxPrice ? [{ label: `Up to R ${filters.maxPrice}`, remove: () => update({ maxPrice: 0 }) }] : []),
  ...(filters.duration !== 'any' ? [{ label: 'Duration', remove: () => update({ duration: 'any' }) }] : [])];


  return (
    <div className="mx-auto w-full max-w-7xl px-4 pb-8 pt-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="font-display text-3xl font-medium text-ink sm:text-4xl">{destName ? `Experiences in ${destName}` : 'Explore experiences'}</h1>
        <p className="mt-1 text-sm text-ink-500">Bookable experiences from verified local providers, with live availability.</p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-500" aria-hidden />
          <input
            type="search"
            value={filters.q}
            onChange={(e) => update({ q: e.target.value })}
            placeholder="Search experiences, places or providers"
            aria-label="Search experiences"
            className="h-11 w-full rounded-xl border border-line bg-surface pl-10 pr-3 text-sm text-ink placeholder:text-ink-400 focus:border-clay focus:outline-none focus:ring-2 focus:ring-clay/30" />
          
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" className="h-11 lg:hidden" onClick={() => setDrawerOpen(true)} icon={<SlidersHorizontalIcon className="h-4 w-4" />}>
            Filters{active ? ` (${active})` : ''}
          </Button>
          <div className="w-full sm:w-52">
            <label className="sr-only" htmlFor="sort">Sort by</label>
            <Select id="sort" value={filters.sort} onChange={(e) => update({ sort: e.target.value as SortKey })} className="h-11 rounded-xl">
              <option value="recommended">Sort: Recommended</option>
              <option value="rating">Sort: Highest rated</option>
              <option value="price_asc">Sort: Price, low to high</option>
              <option value="price_desc">Sort: Price, high to low</option>
              <option value="duration">Sort: Shortest first</option>
            </Select>
          </div>
        </div>
      </div>

      {chips.length > 0 &&
      <div className="mt-4 flex flex-wrap items-center gap-2">
          {chips.map((c) =>
        <button key={c.label} onClick={c.remove} className="inline-flex items-center gap-1.5 rounded-full bg-sand-100 px-3 py-1 text-xs font-medium text-ink-700 hover:bg-sand-200" aria-label={`Remove filter ${c.label}`}>
              {c.label} <XIcon className="h-3 w-3" aria-hidden />
            </button>
        )}
          <button onClick={clear} className="text-xs font-medium text-clay hover:underline">
            Clear all
          </button>
        </div>
      }

      <div className="mt-6 grid gap-8 lg:grid-cols-[260px_1fr]">
        <aside className="hidden lg:block" aria-label="Filters">
          <div className="sticky top-24">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-ink">Filters</h2>
              {active > 0 &&
              <button onClick={clear} className="text-xs font-medium text-clay hover:underline">
                  Clear filters
                </button>
              }
            </div>
            <FilterPanel filters={filters} onChange={update} />
          </div>
        </aside>

        <section aria-live="polite" aria-busy={loading}>
          <p className="mb-4 text-sm text-ink-500">{loading ? 'Finding experiences…' : `${results.length} experience${results.length === 1 ? '' : 's'} available`}</p>
          {loading ?
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) =>
            <ExperienceCardSkeleton key={i} />
            )}
            </div> :
          results.length === 0 ?
          <EmptyState
            icon={<CompassIcon className="h-5 w-5" />}
            title="No experiences match these filters"
            message={filters.date ? 'Nothing has space on that date for your group. Try another date, fewer filters — or ask local providers to plan something for you.' : 'Try widening your search or clearing a few filters. You can also ask local providers to plan something for you.'}
            action={
            <div className="flex flex-wrap justify-center gap-2">
                  <Button variant="secondary" onClick={clear}>Clear filters</Button>
                  <Button to="/account/requests/new">Request a Custom Experience</Button>
                </div>
            } /> :


          <>
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {results.slice(0, visible).map((e) =>
              <ExperienceCard key={e.id} experience={e} guests={filters.guests} />
              )}
              </div>
              {visible < results.length &&
            <div className="mt-8 flex flex-col items-center gap-2">
                  <Button variant="secondary" onClick={() => setVisible((v) => v + PAGE)}>
                    Show more experiences
                  </Button>
                  <p className="text-xs text-ink-500">Showing {visible} of {results.length}</p>
                </div>
            }
            </>
          }
        </section>
      </div>

      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title="Filters"
        footer={
        <>
            <Button variant="ghost" onClick={clear}>Clear all</Button>
            <Button onClick={() => setDrawerOpen(false)}>Show {results.length} results</Button>
          </>
        }>
        
        <FilterPanel filters={filters} onChange={update} />
      </Drawer>
    </div>);

}