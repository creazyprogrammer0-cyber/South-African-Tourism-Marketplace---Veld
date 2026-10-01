import React from 'react';
import { Link } from 'react-router-dom';
import { BellIcon } from 'lucide-react';
import { useMarketplace } from '../../contexts/MarketplaceContext';

export function NotificationBell({ to }: {to: string;}) {
  const { state, currentUser } = useMarketplace();
  const unread = state.notifications.filter((n) => n.userId === currentUser?.id && !n.read).length;
  return (
    <Link to={to} className="relative rounded-lg p-2 text-ink-700 hover:bg-sand-100" aria-label={unread ? `Notifications, ${unread} unread` : 'Notifications'}>
      <BellIcon className="h-5 w-5" aria-hidden />
      {unread > 0 &&
      <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-clay px-1 text-[10px] font-semibold text-white tabular-nums">{unread > 9 ? '9+' : unread}</span>
      }
    </Link>);

}