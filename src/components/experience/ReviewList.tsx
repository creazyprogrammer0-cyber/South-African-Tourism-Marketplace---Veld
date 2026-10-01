import React, { useState } from 'react';
import { MessageSquareIcon } from 'lucide-react';
import type { Review } from '../../types/marketplace';
import { useMarketplace } from '../../contexts/MarketplaceContext';
import { userById, experienceById } from '../../utils/selectors';
import { relativeTime } from '../../utils/dates';
import { Avatar } from '../ui/Avatar';
import { Stars } from '../ui/Stars';
import { EmptyState } from '../ui/EmptyState';

export function ReviewList({ reviews, showExperience, pageSize = 4 }: {reviews: Review[];showExperience?: boolean;pageSize?: number;}) {
  const { state } = useMarketplace();
  const [count, setCount] = useState(pageSize);
  const list = reviews.filter((r) => r.status === 'published').sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  if (!list.length) {
    return <EmptyState icon={<MessageSquareIcon className="h-5 w-5" />} title="No reviews yet" message="Reviews appear here once travellers complete this experience. Only verified bookings can leave a review." />;
  }
  return (
    <div>
      <ul className="divide-y divide-line">
        {list.slice(0, count).map((r) => {
          const author = userById(state, r.travellerId);
          const exp = experienceById(state, r.experienceId);
          return (
            <li key={r.id} className="py-5 first:pt-0">
              <div className="flex items-center gap-3">
                <Avatar name={author?.name ?? 'Traveller'} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-ink">{author?.name.split(' ')[0] ?? 'Traveller'} <span className="font-normal text-ink-500">· {author?.country ?? 'Verified traveller'}</span></p>
                  <div className="flex items-center gap-2 text-xs text-ink-500">
                    <Stars value={r.rating} /> <span>{relativeTime(r.createdAt)}</span>
                  </div>
                </div>
              </div>
              {showExperience && exp && <p className="mt-2 text-xs font-medium text-ink-600">{exp.title}</p>}
              {showExperience && !exp && <p className="mt-2 text-xs font-medium text-ink-600">Custom experience</p>}
              <p className="mt-2 text-sm leading-relaxed text-ink-700">{r.comment}</p>
            </li>);

        })}
      </ul>
      {count < list.length &&
      <button onClick={() => setCount((c) => c + pageSize)} className="mt-2 text-sm font-medium text-clay hover:underline">
          Show more reviews ({list.length - count})
        </button>
      }
    </div>);

}