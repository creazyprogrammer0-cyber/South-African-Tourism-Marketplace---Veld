import React from 'react';
import { useCurrentProvider } from '../../hooks/useCurrentProvider';
import { experienceRating, providerRating } from '../../utils/selectors';
import { PageHeader } from '../../components/ui/PageHeader';
import { Stars } from '../../components/ui/Stars';
import { ReviewList } from '../../components/experience/ReviewList';

export function ProviderReviews() {
  const { provider, state } = useCurrentProvider();
  if (!provider) return null;
  const reviews = state.reviews.filter((r) => r.providerId === provider.id);
  const published = reviews.filter((r) => r.status === 'published');
  const rating = providerRating(state, provider.id);
  const dist = [5, 4, 3, 2, 1].map((n) => ({ n, count: published.filter((r) => r.rating === n).length }));
  const exps = state.experiences.filter((e) => e.providerId === provider.id).map((e) => ({ e, r: experienceRating(state, e.id) })).filter((x) => x.r.count > 0);

  return (
    <div>
      <PageHeader title="Reviews" description="Ratings are calculated from published reviews by travellers who completed a booking." />
      <div className="grid gap-8 lg:grid-cols-[320px_1fr]">
        <aside className="space-y-6">
          <div className="rounded-2xl bg-surface p-6 shadow-card ring-1 ring-line/60">
            <p className="text-4xl font-semibold text-ink">{rating.count ? rating.average.toFixed(1) : '—'}</p>
            <div className="mt-1"><Stars value={rating.average} size="md" /></div>
            <p className="mt-1 text-sm text-ink-500">{rating.count} published review{rating.count === 1 ? '' : 's'}</p>
            <ul className="mt-5 space-y-1.5">
              {dist.map((d) =>
              <li key={d.n} className="flex items-center gap-2 text-xs text-ink-600">
                  <span className="w-3">{d.n}</span>
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-sand-100"><div className="h-full rounded-full bg-clay" style={{ width: `${published.length ? d.count / published.length * 100 : 0}%` }} /></div>
                  <span className="w-6 text-right tabular-nums">{d.count}</span>
                </li>
              )}
            </ul>
          </div>
          {exps.length > 0 &&
          <div className="rounded-2xl bg-surface p-6 shadow-card ring-1 ring-line/60">
              <h2 className="text-sm font-semibold text-ink">By experience</h2>
              <ul className="mt-3 space-y-2.5">
                {exps.map(({ e, r }) =>
              <li key={e.id} className="flex items-start justify-between gap-3 text-sm">
                    <span className="line-clamp-2 text-ink-700">{e.title}</span>
                    <span className="shrink-0 font-medium text-ink">{r.average.toFixed(1)} <span className="font-normal text-ink-500">({r.count})</span></span>
                  </li>
              )}
              </ul>
            </div>
          }
        </aside>
        <div className="rounded-2xl bg-surface p-6 shadow-card ring-1 ring-line/60">
          <ReviewList reviews={reviews} showExperience pageSize={8} />
        </div>
      </div>
    </div>);

}