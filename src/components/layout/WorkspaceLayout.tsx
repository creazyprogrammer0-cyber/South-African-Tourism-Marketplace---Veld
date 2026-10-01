import React, { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  LayoutDashboardIcon,
  MapIcon,
  CalendarDaysIcon,
  TicketIcon,
  InboxIcon,
  StarIcon,
  UserCircleIcon,
  ShieldCheckIcon,
  BellIcon,
  UsersIcon,
  FileCheck2Icon,
  ActivityIcon,
  SettingsIcon,
  MenuIcon,
  ExternalLinkIcon,
  LogOutIcon,
  XIcon } from
'lucide-react';
import { useMarketplace } from '../../contexts/MarketplaceContext';
import { useAction } from '../../hooks/useAction';
import { logout } from '../../utils/accountService';
import { providerByUserId, requestsForProvider } from '../../utils/selectors';
import { verificationMeta } from '../../utils/status';
import { cn } from '../../utils/cn';
import { Logo } from './Logo';
import { NotificationBell } from './NotificationBell';
import { Avatar } from '../ui/Avatar';
import { StatusBadge } from '../ui/StatusBadge';

interface NavItem {
  to: string;
  label: string;
  icon: typeof MapIcon;
  count?: number;
  end?: boolean;
}

export function WorkspaceLayout({ role }: {role: 'provider' | 'admin';}) {
  const { state, currentUser } = useMarketplace();
  const { run } = useAction();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const provider = role === 'provider' ? providerByUserId(state, currentUser?.id) : undefined;
  const unread = state.notifications.filter((n) => n.userId === currentUser?.id && !n.read).length;

  let items: NavItem[];
  if (role === 'provider') {
    const openRequests = provider && provider.verificationStatus === 'approved' ?
    requestsForProvider(state, provider).filter((r) => ['submitted', 'under_review', 'matched'].includes(r.status) && !state.proposals.some((p) => p.requestId === r.id && p.providerId === provider.id)).length :
    0;
    items = [
    { to: '/provider', label: 'Dashboard', icon: LayoutDashboardIcon, end: true },
    { to: '/provider/experiences', label: 'Experiences', icon: MapIcon },
    { to: '/provider/availability', label: 'Availability', icon: CalendarDaysIcon },
    { to: '/provider/bookings', label: 'Bookings', icon: TicketIcon },
    { to: '/provider/requests', label: 'Custom requests', icon: InboxIcon, count: openRequests || undefined },
    { to: '/provider/reviews', label: 'Reviews', icon: StarIcon },
    { to: '/provider/profile', label: 'Profile', icon: UserCircleIcon },
    { to: '/provider/verification', label: 'Verification', icon: ShieldCheckIcon },
    { to: '/provider/notifications', label: 'Notifications', icon: BellIcon, count: unread || undefined }];

  } else {
    const pendingApps = state.providers.filter((p) => ['submitted', 'under_review'].includes(p.verificationStatus)).length;
    const flagged = state.reviews.filter((r) => r.status === 'flagged').length;
    items = [
    { to: '/admin', label: 'Dashboard', icon: LayoutDashboardIcon, end: true },
    { to: '/admin/applications', label: 'Applications', icon: FileCheck2Icon, count: pendingApps || undefined },
    { to: '/admin/providers', label: 'Providers', icon: UsersIcon },
    { to: '/admin/experiences', label: 'Experiences', icon: MapIcon },
    { to: '/admin/bookings', label: 'Bookings', icon: TicketIcon },
    { to: '/admin/requests', label: 'Custom requests', icon: InboxIcon },
    { to: '/admin/reviews', label: 'Reviews', icon: StarIcon, count: flagged || undefined },
    { to: '/admin/activity', label: 'Activity', icon: ActivityIcon },
    { to: '/admin/settings', label: 'Settings', icon: SettingsIcon },
    { to: '/admin/notifications', label: 'Notifications', icon: BellIcon, count: unread || undefined }];

  }

  const signOut = async () => {
    await run(logout, undefined, { latency: 100 });
    navigate('/');
  };

  const sidebar =
  <div className="flex h-full flex-col">
      <div className="flex h-16 items-center justify-between px-5">
        <div className="flex items-baseline gap-2">
          <Logo to={role === 'provider' ? '/provider' : '/admin'} />
          <span className="text-xs font-medium text-ink-500">{role === 'provider' ? 'Provider' : 'Admin'}</span>
        </div>
      </div>
      {provider &&
    <div className="mx-3 mb-3 rounded-xl bg-sand-100 px-3 py-2.5">
          <p className="truncate text-sm font-medium text-ink">{provider.businessName || 'Your business'}</p>
          <div className="mt-1">
            <StatusBadge tone={verificationMeta[provider.verificationStatus].tone} label={verificationMeta[provider.verificationStatus].label} />
          </div>
        </div>
    }
      <nav aria-label={`${role} navigation`} className="flex-1 space-y-0.5 overflow-y-auto px-3">
        {items.map((item) =>
      <NavLink
        key={item.to}
        to={item.to}
        end={item.end}
        className={({ isActive }) =>
        cn('flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-150 ease-out', isActive ? 'bg-ink text-white' : 'text-ink-700 hover:bg-sand-100')
        }>
        
            {({ isActive }) =>
        <>
                <item.icon className="h-4 w-4 shrink-0" aria-hidden />
                <span className="flex-1">{item.label}</span>
                {item.count !== undefined && <span className={cn('rounded-full px-1.5 text-[11px] tabular-nums', isActive ? 'bg-white/20 text-white' : 'bg-clay text-white')}>{item.count}</span>}
              </>
        }
          </NavLink>
      )}
      </nav>
      <div className="border-t border-line p-3">
        <NavLink to="/explore" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-ink-600 hover:bg-sand-100">
          <ExternalLinkIcon className="h-4 w-4" aria-hidden /> View marketplace
        </NavLink>
        <button onClick={signOut} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-ink-600 hover:bg-sand-100">
          <LogOutIcon className="h-4 w-4" aria-hidden /> Sign out
        </button>
      </div>
    </div>;


  return (
    <div className="flex min-h-screen w-full bg-canvas">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r border-line bg-surface lg:block">{sidebar}</aside>
      <AnimatePresence>
        {mobileOpen &&
        <div className="fixed inset-0 z-40 lg:hidden">
            <motion.div className="absolute inset-0 bg-ink/40" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setMobileOpen(false)} />
            <motion.aside initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }} transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }} className="absolute inset-y-0 left-0 w-72 bg-surface shadow-pop">
              <button onClick={() => setMobileOpen(false)} className="absolute right-3 top-4 rounded-lg p-2 text-ink-500 hover:bg-sand-100" aria-label="Close navigation">
                <XIcon className="h-4 w-4" />
              </button>
              {sidebar}
            </motion.aside>
          </div>
        }
      </AnimatePresence>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-line bg-canvas/95 px-4 backdrop-blur sm:px-6 lg:px-8">
          <button onClick={() => setMobileOpen(true)} className="rounded-lg p-2 text-ink-700 hover:bg-sand-100 lg:hidden" aria-label="Open navigation">
            <MenuIcon className="h-5 w-5" />
          </button>
          <div className="lg:hidden">
            <Logo to={role === 'provider' ? '/provider' : '/admin'} />
          </div>
          <div className="ml-auto flex items-center gap-2">
            <NotificationBell to={`/${role}/notifications`} />
            <div className="flex items-center gap-2.5 pl-1">
              <Avatar name={currentUser?.name ?? ''} size="sm" />
              <div className="hidden leading-tight sm:block">
                <p className="text-sm font-medium text-ink">{currentUser?.name}</p>
                <p className="text-xs text-ink-500">{role === 'provider' ? 'Provider account' : 'Trust & operations'}</p>
              </div>
            </div>
          </div>
        </header>
        <motion.main key={location.pathname} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.18 }} className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 pb-24 sm:px-6 lg:px-8 lg:py-8">
          <Outlet />
        </motion.main>
      </div>
    </div>);

}