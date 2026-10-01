import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ClockIcon, UsersIcon, MapPinIcon, LanguagesIcon, CheckIcon, XIcon, StarIcon, BadgeCheckIcon, ChevronLeftIcon, EyeIcon, CompassIcon } from 'lucide-react';
import { useMarketplace } from '../../contexts/MarketplaceContext';
import { categories, destinations } from '../../data/catalog';
import { experienceById, experienceRating, isExperiencePublic, providerById, providerByUserId, providerRating } from '../../utils/selectors';
import { formatDuration, formatZAR } from '../../utils/format';
import { cancellationPolicies } from '../../utils/policies';
import { Gallery } from '../../components/experience/Gallery';
import { BookingPanel } from '../../components/experience/BookingPanel';
import { ReviewList } from '../../components/experience/ReviewList';
import { Avatar } from '../../components/ui/Avatar';
import { Button } from '../../components/ui/Button';
import { Drawer } from '../../components/ui/Drawer';
import { EmptyState } from '../../components/ui/EmptyState';
import { Skeleton } from '../../components/ui/Skeleton';
import { Alert } from '../../components/ui/Alert';

export function ExperienceDetail() {
  const { id } = useParams();
  const { state, currentUser } = useMarketplace();
  const [loading, setLoading] = useState(true);
  const [sheetOpen, setSheetOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 320);
    return () => clearTimeout(t);
  }, [id]);

  const e = experienceById(state, id);
  const isPublic = isExperiencePublic(state, e);
  const ownProvider = providerByUserId(state, currentUser?.id);
  const canPreview = !!e && (currentUser?.role === 'admin' || ownProvider?.id === e.providerId);

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-7xl px-4 pt-8 sm:px-6 lg:px-8" aria-busy>
        <Skeleton className="h-6 w-40" />
        <Skeleton className="mt-4 h-10 w-2/3" />
        <Skeleton className="mt-6 h-[360px] w-full rounded-2xl" />
        <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_380px]">
          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/6" />
          </div>
          <Skeleton className="h-80 w-full rounded-2xl" />
        </div>
      </div>);

  }

  if (!e || !isPublic && !canPreview) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 pt-16 sm:px-6">
        <EmptyState
          icon={<CompassIcon className="h-5 w-5" />}
          title="This experience isn’t available"
          message="It may have been unpublished by its provider or is no longer running. Explore similar experiences from verified local providers."
          action={<Button to="/explore">Explore Experiences</Button>} />
        
      </div>);

  }

  const provider = providerById(state, e.providerId);
  const rating = experienceRating(state, e.id);
  const pRating = provider ? providerRating(state, provider.id) : { average: 0, count: 0 };
  const dest = destinations.find((d) => d.id === e.destination);
  const cat = categories.find((c) => c.id === e.category);
  const reviews = state.reviews.filter((r) => r.experienceId === e.id);
  const policy = cancellationPolicies[e.cancellationPolicy];

  const facts = [
  { icon: ClockIcon, label: 'Duration', value: formatDuration(e.durationHours) },
  { icon: UsersIcon, label: 'Group size', value: `Up to ${e.maxGuests} guests` },
  { icon: LanguagesIcon, label: 'Languages', value: e.languages.join(', ') },
  { icon: MapPinIcon, label: 'Start time', value: e.times.join(' · ') }];


  return (
    <div className="mx-auto w-full max-w-7xl px-4 pb-24 pt-6 sm:px-6 lg:px-8 lg:pb-8">
      <Link to={`/explore?destination=${e.destination}`} className="inline-flex items-center gap-1 text-sm text-ink-600 hover:text-ink">
        <ChevronLeftIcon className="h-4 w-4" aria-hidden /> {dest?.name} experiences
      </Link>

      {!isPublic &&
      <Alert tone="warning" title="Preview — not visible to travellers" className="mt-4">
          This listing is {e.status}{provider?.verificationStatus !== 'approved' ? ' and the provider is not yet verified' : ''}. Travellers can’t find or book it.
        </Alert>
      }

      <header className="mt-4">
        <p className="text-sm text-ink-500">{cat?.name} · {dest?.name}, {dest?.region}</p>
        <h1 className="mt-1 max-w-4xl font-display text-3xl font-medium leading-tight text-ink sm:text-4xl">{e.title}</h1>
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
          {rating.count > 0 ?
          <a href="#reviews" className="flex items-center gap-1 font-medium text-ink hover:underline">
              <StarIcon className="h-4 w-4 fill-clay text-clay" aria-hidden /> {rating.average.toFixed(1)} <span className="font-normal text-ink-500">({rating.count} reviews)</span>
            </a> :

          <span className="text-ink-500">New experience · no reviews yet</span>
          }
          {provider &&
          <Link to={`/providers/${provider.id}`} className="flex items-center gap-1 text-ink-700 hover:underline">
              <BadgeCheckIcon className="h-4 w-4 text-olive" aria-hidden /> {provider.businessName}
            </Link>
          }
        </div>
      </header>

      <div className="mt-6">
        <Gallery images={e.images} title={e.title} />
      </div>

      <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_380px]">
        <div className="min-w-0">
          <dl className="grid grid-cols-2 gap-x-6 gap-y-5 border-b border-line pb-8 sm:grid-cols-4">
            {facts.map((f) =>
            <div key={f.label}>
                <dt className="flex items-center gap-1.5 text-xs text-ink-500"><f.icon className="h-3.5 w-3.5" aria-hidden />{f.label}</dt>
                <dd className="mt-1 text-sm font-medium text-ink">{f.value}</dd>
              </div>
            )}
          </dl>

          <section className="border-b border-line py-8">
            <p className="text-lg leading-relaxed text-ink">{e.summary}</p>
            <p className="mt-4 whitespace-pre-line text-[15px] leading-relaxed text-ink-700">{e.description}</p>
          </section>

          <section className="grid gap-8 border-b border-line py-8 sm:grid-cols-2">
            <div>
              <h2 className="text-base font-semibold text-ink">What’s included</h2>
              <ul className="mt-3 space-y-2">
                {e.inclusions.map((x) =>
                <li key={x} className="flex gap-2 text-sm text-ink-700"><CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-olive" aria-hidden />{x}</li>
                )}
              </ul>
            </div>
            <div>
              <h2 className="text-base font-semibold text-ink">Not included</h2>
              <ul className="mt-3 space-y-2">
                {e.exclusions.length ? e.exclusions.map((x) =>
                <li key={x} className="flex gap-2 text-sm text-ink-700"><XIcon className="mt-0.5 h-4 w-4 shrink-0 text-ink-400" aria-hidden />{x}</li>
                ) : <li className="text-sm text-ink-500">Nothing extra to pay.</li>}
              </ul>
            </div>
          </section>

          <section className="grid gap-8 border-b border-line py-8 sm:grid-cols-2">
            <div>
              <h2 className="text-base font-semibold text-ink">Meeting point</h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-700">{e.meetingPoint}</p>
              <p className="mt-2 text-xs text-ink-500">Exact details and your guide’s phone number are included in your confirmation.</p>
            </div>
            <div>
              <h2 className="text-base font-semibold text-ink">Cancellation policy · {policy.label}</h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-700">{policy.text}</p>
              <p className="mt-2 text-xs text-ink-500">If your provider cancels, you always receive a full refund.</p>
            </div>
          </section>

          {provider &&
          <section className="border-b border-line py-8" aria-labelledby="host-h">
              <h2 id="host-h" className="text-base font-semibold text-ink">Your provider</h2>
              <div className="mt-4 flex flex-col gap-5 sm:flex-row">
                <Avatar name={provider.contactName} src={provider.photo} size="xl" />
                <div className="min-w-0 flex-1">
                  <p className="text-lg font-semibold text-ink">{provider.businessName}</p>
                  <p className="text-sm text-ink-500">Hosted by {provider.contactName} · {provider.yearsExperience} years guiding</p>
                  <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-ink-700">
                    {provider.verificationStatus === 'approved' && <span className="flex items-center gap-1"><BadgeCheckIcon className="h-4 w-4 text-olive" aria-hidden />Identity & guide registration verified</span>}
                    {pRating.count > 0 && <span className="flex items-center gap-1"><StarIcon className="h-4 w-4 fill-clay text-clay" aria-hidden />{pRating.average.toFixed(1)} across {pRating.count} reviews</span>}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-ink-700">{provider.bio}</p>
                  <p className="mt-3 text-sm text-ink-600"><span className="font-medium text-ink">Specialties:</span> {provider.specialties.join(', ')}</p>
                  <Button variant="secondary" size="sm" className="mt-4" to={`/providers/${provider.id}`}>View provider profile</Button>
                </div>
              </div>
            </section>
          }

          <section id="reviews" className="py-8" aria-labelledby="rev-h">
            <div className="mb-5 flex items-baseline gap-3">
              <h2 id="rev-h" className="text-base font-semibold text-ink">Reviews</h2>
              {rating.count > 0 && <p className="text-sm text-ink-500"><span className="font-semibold text-ink">{rating.average.toFixed(1)}</span> average · {rating.count} verified reviews</p>}
            </div>
            <ReviewList reviews={reviews} />
          </section>
        </div>

        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <BookingPanel experience={e} preview={!isPublic} />
          </div>
        </aside>
      </div>

      {/* Mobile booking bar */}
      <div className="fixed inset-x-0 bottom-0 z-30 flex items-center justify-between gap-4 border-t border-line bg-surface px-4 py-3 lg:hidden">
        <div>
          <p className="text-base font-semibold text-ink">{formatZAR(e.price)} <span className="text-xs font-normal text-ink-500">/ person</span></p>
          {rating.count > 0 && <p className="text-xs text-ink-500">★ {rating.average.toFixed(1)} · {rating.count} reviews</p>}
        </div>
        <Button variant="accent" onClick={() => setSheetOpen(true)} icon={!isPublic ? <EyeIcon className="h-4 w-4" /> : undefined}>
          Check Availability
        </Button>
      </div>
      <Drawer open={sheetOpen} onClose={() => setSheetOpen(false)} title="Choose date & travellers">
        <BookingPanel experience={e} preview={!isPublic} />
      </Drawer>
    </div>);

}