import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightIcon, ShieldCheckIcon, LockIcon, RotateCcwIcon, StarIcon, BadgeCheckIcon } from 'lucide-react';
import { useMarketplace } from '../../contexts/MarketplaceContext';
import { categories, destinations, images } from '../../data/catalog';
import { experienceRating, providerRating, publicExperiences, isProviderLive } from '../../utils/selectors';
import { HeroSearch } from '../../components/experience/HeroSearch';
import { ExperienceCard } from '../../components/experience/ExperienceCard';
import { CategoryIcon } from '../../components/experience/CategoryIcon';
import { Avatar } from '../../components/ui/Avatar';
import { Button } from '../../components/ui/Button';

const steps = [
{ title: 'Choose a verified guide', text: 'Every provider is identity- and registration-checked by our trust team before they can list an experience.' },
{ title: 'Book a date and pay securely', text: 'See live availability and the full price up front. Your payment is only taken once your spot is confirmed.' },
{ title: 'Meet your guide, then review', text: 'Your booking includes meeting details and your guide’s contact. Reviews come only from travellers who went.' }];


export function Home() {
  const { state } = useMarketplace();
  const live = publicExperiences(state);

  const featured = useMemo(
    () =>
    [...live].
    map((e) => ({ e, r: experienceRating(state, e.id) })).
    sort((a, b) => b.r.average * Math.log(2 + b.r.count) - a.r.average * Math.log(2 + a.r.count)).
    slice(0, 4).
    map((x) => x.e),
    [live, state]
  );

  const topProviders = useMemo(
    () =>
    state.providers.
    filter((p) => isProviderLive(state, p)).
    map((p) => ({ p, r: providerRating(state, p.id) })).
    sort((a, b) => b.r.average - a.r.average || b.r.count - a.r.count).
    slice(0, 3),
    [state]
  );

  const countFor = (destId: string) => live.filter((e) => e.destination === destId).length;
  const [lead, ...rest] = destinations;

  return (
    <div className="w-full">
      {/* Hero */}
      <section className="relative">
        <div className="absolute inset-0">
          <img src={images.capeTown} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-ink/45" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-20 sm:px-6 md:pb-24 md:pt-32 lg:px-8">
          <h1 className="max-w-3xl font-display text-4xl font-medium leading-[1.08] text-white sm:text-5xl lg:text-6xl">South Africa, guided by the people who live it.</h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-white/85 sm:text-lg">Book sunrise hikes, tracker-led safaris and family-run food walks with verified local guides — or ask them to design a trip around you.</p>
          <div className="mt-9 max-w-4xl">
            <HeroSearch />
          </div>
          <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/85">
            <li className="flex items-center gap-2"><ShieldCheckIcon className="h-4 w-4" aria-hidden /> Verified local providers</li>
            <li className="flex items-center gap-2"><LockIcon className="h-4 w-4" aria-hidden /> Secure payment, confirmed instantly</li>
            <li className="flex items-center gap-2"><RotateCcwIcon className="h-4 w-4" aria-hidden /> Clear cancellation on every listing</li>
          </ul>
        </div>
      </section>

      {/* Categories */}
      <section aria-labelledby="cat-h" className="border-b border-line bg-surface">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 id="cat-h" className="sr-only">Browse by category</h2>
          <div className="scrollbar-none -mx-4 flex gap-2 overflow-x-auto px-4 py-4 sm:mx-0 sm:px-0">
            {categories.map((c) =>
            <Link key={c.id} to={`/explore?category=${c.id}`} className="flex shrink-0 items-center gap-2 rounded-full border border-line px-4 py-2 text-sm font-medium text-ink-700 transition-colors duration-150 ease-out hover:border-ink hover:text-ink">
                <CategoryIcon category={c.id} className="h-4 w-4" />
                {c.name}
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Featured */}
      <section aria-labelledby="feat-h" className="mx-auto max-w-7xl px-4 pt-16 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2 id="feat-h" className="font-display text-3xl font-medium text-ink">Highly rated this season</h2>
            <p className="mt-1 text-sm text-ink-500">Ranked by verified reviews from travellers who booked through Veld.</p>
          </div>
          <Link to="/explore?sort=rating" className="hidden shrink-0 items-center gap-1 text-sm font-medium text-clay hover:underline sm:flex">
            See all {live.length} experiences <ArrowRightIcon className="h-4 w-4" aria-hidden />
          </Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((e) =>
          <ExperienceCard key={e.id} experience={e} />
          )}
        </div>
      </section>

      {/* Destinations */}
      <section aria-labelledby="dest-h" className="mx-auto max-w-7xl px-4 pt-20 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-end justify-between">
          <h2 id="dest-h" className="font-display text-3xl font-medium text-ink">Where to go</h2>
          <Link to="/destinations" className="flex items-center gap-1 text-sm font-medium text-clay hover:underline">
            All destinations <ArrowRightIcon className="h-4 w-4" aria-hidden />
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-4 md:grid-rows-2">
          <Link to={`/explore?destination=${lead.id}`} className="group relative h-72 overflow-hidden rounded-2xl md:col-span-2 md:row-span-2 md:h-auto">
            <img src={lead.image} alt="" className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]" />
            <div className="absolute inset-0 bg-ink/35" />
            <div className="absolute bottom-0 p-6">
              <p className="text-sm text-white/80">{lead.region} · {countFor(lead.id)} experiences</p>
              <h3 className="mt-1 font-display text-3xl text-white">{lead.name}</h3>
              <p className="mt-2 max-w-sm text-sm text-white/85">{lead.blurb}</p>
            </div>
          </Link>
          {rest.slice(0, 4).map((d) =>
          <Link key={d.id} to={`/explore?destination=${d.id}`} className="group relative h-48 overflow-hidden rounded-2xl">
              <img src={d.image} alt="" className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]" />
              <div className="absolute inset-0 bg-ink/35" />
              <div className="absolute bottom-0 p-4">
                <h3 className="font-display text-xl text-white">{d.name}</h3>
                <p className="text-xs text-white/80">{countFor(d.id)} experiences</p>
              </div>
            </Link>
          )}
        </div>
      </section>

      {/* How it works */}
      <section aria-labelledby="how-h" className="mx-auto max-w-7xl px-4 pt-20 sm:px-6 lg:px-8">
        <div className="grid gap-10 border-y border-line py-14 lg:grid-cols-[1fr_2fr]">
          <div>
            <h2 id="how-h" className="font-display text-3xl font-medium text-ink">How booking works</h2>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-ink-500">Three steps from browsing to standing on the trail with your guide.</p>
          </div>
          <ol className="grid gap-8 sm:grid-cols-3">
            {steps.map((s, i) =>
            <li key={s.title}>
                <span className="font-display text-3xl text-clay">{i + 1}</span>
                <h3 className="mt-2 text-base font-semibold text-ink">{s.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-600">{s.text}</p>
              </li>
            )}
          </ol>
        </div>
      </section>

      {/* Custom request CTA */}
      <section aria-labelledby="custom-h" className="mx-auto max-w-7xl px-4 pt-20 sm:px-6 lg:px-8">
        <div className="grid overflow-hidden rounded-3xl bg-olive md:grid-cols-2">
          <div className="p-8 sm:p-12">
            <h2 id="custom-h" className="font-display text-3xl font-medium leading-tight text-white sm:text-4xl">Have something specific in mind?</h2>
            <p className="mt-4 max-w-md text-base leading-relaxed text-white/85">Tell us what kind of experience you’re looking for, and relevant local providers can respond with personalised proposals — itinerary, price and dates included.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button variant="secondary" size="lg" to="/account/requests/new" className="border-transparent">
                Request a Custom Experience
              </Button>
            </div>
            <p className="mt-4 text-sm text-white/70">Free to submit · No obligation to accept</p>
          </div>
          <img src={images.capePoint} alt="Photographer at Cape Point at sunrise" className="h-64 w-full object-cover md:h-full" />
        </div>
      </section>

      {/* Top providers */}
      <section aria-labelledby="prov-h" className="mx-auto max-w-7xl px-4 pt-20 sm:px-6 lg:px-8">
        <h2 id="prov-h" className="font-display text-3xl font-medium text-ink">Guides travellers rate highest</h2>
        <ul className="mt-6 divide-y divide-line border-y border-line">
          {topProviders.map(({ p, r }) =>
          <li key={p.id}>
              <Link to={`/providers/${p.id}`} className="flex flex-col gap-3 py-5 transition-colors duration-150 ease-out hover:bg-sand-50 sm:flex-row sm:items-center sm:gap-6 sm:px-2">
                <div className="flex items-center gap-4 sm:w-80">
                  <Avatar name={p.contactName} size="lg" />
                  <div className="min-w-0">
                    <p className="flex items-center gap-1.5 truncate font-semibold text-ink">
                      {p.businessName}
                      <BadgeCheckIcon className="h-4 w-4 shrink-0 text-olive" aria-label="Verified" />
                    </p>
                    <p className="text-sm text-ink-500">{p.contactName} · {p.yearsExperience} years guiding</p>
                  </div>
                </div>
                <p className="line-clamp-2 flex-1 text-sm text-ink-600">{p.bio}</p>
                <p className="flex shrink-0 items-center gap-1 text-sm font-medium text-ink">
                  <StarIcon className="h-4 w-4 fill-clay text-clay" aria-hidden /> {r.average.toFixed(1)} <span className="font-normal text-ink-500">· {r.count} reviews</span>
                </p>
              </Link>
            </li>
          )}
        </ul>
      </section>
    </div>);

}