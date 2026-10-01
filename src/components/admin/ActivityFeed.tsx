import React from 'react';
import { Link } from 'react-router-dom';
import { TicketIcon, CreditCardIcon, InboxIcon, FileTextIcon, StarIcon, ShieldCheckIcon, MapIcon, InfoIcon, BellIcon } from 'lucide-react';
import type { ActivityEvent, NotificationType } from '../../types/marketplace';
import { relativeTime } from '../../utils/dates';

const icons: Record<NotificationType, typeof BellIcon> = {
  application: ShieldCheckIcon,
  booking: TicketIcon,
  payment: CreditCardIcon,
  request: InboxIcon,
  proposal: FileTextIcon,
  review: StarIcon,
  experience: MapIcon,
  system: InfoIcon
};

export function ActivityFeed({ events }: {events: ActivityEvent[];}) {
  if (!events.length) return <p className="py-6 text-center text-sm text-ink-500">No activity matches this filter.</p>;
  return (
    <ul className="space-y-0">
      {events.map((e) => {
        const Icon = icons[e.type];
        const body =
        <>
            <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sand-100 text-ink-600"><Icon className="h-3.5 w-3.5" aria-hidden /></span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm text-ink-700">{e.message}</span>
              <span className="text-xs text-ink-500">{relativeTime(e.createdAt)}</span>
            </span>
          </>;

        return (
          <li key={e.id}>
            {e.link ? <Link to={e.link} className="flex gap-3 rounded-lg px-2 py-2.5 hover:bg-sand-50">{body}</Link> : <div className="flex gap-3 px-2 py-2.5">{body}</div>}
          </li>);

      })}
    </ul>);

}