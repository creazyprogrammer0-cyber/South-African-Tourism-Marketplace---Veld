import React, { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { MenuIcon, XIcon, LayoutDashboardIcon, LogOutIcon, UserIcon } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useMarketplace } from '../../contexts/MarketplaceContext';
import { useAction } from '../../hooks/useAction';
import { logout } from '../../utils/accountService';
import { homeForRole } from '../../utils/permissions';
import { cn } from '../../utils/cn';
import { Logo } from './Logo';
import { NotificationBell } from './NotificationBell';
import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';

const publicLinks = [
{ to: '/explore', label: 'Explore' },
{ to: '/destinations', label: 'Destinations' },
{ to: '/account/requests/new', label: 'Custom trips' }];


const travellerLinks = [
{ to: '/account/bookings', label: 'My bookings' },
{ to: '/account/requests', label: 'My requests' }];


export function PublicHeader() {
  const { currentUser } = useMarketplace();
  const { run } = useAction();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const isTraveller = currentUser?.role === 'traveller';

  useEffect(() => {
    setMenuOpen(false);
    setProfileOpen(false);
  }, [location.pathname]);

  const signOut = async () => {
    await run(logout, undefined, { latency: 100 });
    navigate('/');
  };

  const linkCls = ({ isActive }: {isActive: boolean;}) => cn('rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-150 ease-out', isActive ? 'text-ink' : 'text-ink-600 hover:text-ink');

  return (
    <header className="sticky top-0 z-30 border-b border-line/70 bg-canvas/95 backdrop-blur supports-[backdrop-filter]:bg-canvas/85">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-4 sm:px-6 lg:px-8">
        <Logo />
        <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
          {publicLinks.map((l) =>
          <NavLink key={l.to} to={l.to} end className={linkCls}>
              {l.label}
            </NavLink>
          )}
        </nav>
        <div className="ml-auto flex items-center gap-1">
          {isTraveller &&
          <nav aria-label="Account" className="hidden items-center gap-1 lg:flex">
              {travellerLinks.map((l) =>
            <NavLink key={l.to} to={l.to} end className={linkCls}>
                  {l.label}
                </NavLink>
            )}
            </nav>
          }
          {currentUser && currentUser.role !== 'traveller' &&
          <Button size="sm" variant="secondary" to={homeForRole(currentUser.role)} icon={<LayoutDashboardIcon className="h-4 w-4" />} className="hidden sm:inline-flex">
              {currentUser.role === 'admin' ? 'Admin console' : 'Provider workspace'}
            </Button>
          }
          {isTraveller && <NotificationBell to="/notifications" />}
          {currentUser ?
          <div className="relative hidden md:block">
              <button onClick={() => setProfileOpen((o) => !o)} aria-expanded={profileOpen} aria-haspopup="menu" className="ml-1 flex items-center rounded-full p-0.5 hover:ring-2 hover:ring-sand-200" aria-label="Account menu">
                <Avatar name={currentUser.name} size="sm" />
              </button>
              <AnimatePresence>
                {profileOpen &&
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15 }}
                role="menu"
                className="absolute right-0 mt-2 w-56 rounded-xl border border-line bg-surface p-1.5 shadow-pop">
                
                    <div className="px-3 py-2">
                      <p className="truncate text-sm font-medium text-ink">{currentUser.name}</p>
                      <p className="truncate text-xs text-ink-500">{currentUser.email}</p>
                    </div>
                    {isTraveller &&
                <Link role="menuitem" to="/account/profile" className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-ink-700 hover:bg-sand-50">
                        <UserIcon className="h-4 w-4" aria-hidden /> Profile
                      </Link>
                }
                    <button role="menuitem" onClick={signOut} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-ink-700 hover:bg-sand-50">
                      <LogOutIcon className="h-4 w-4" aria-hidden /> Sign out
                    </button>
                  </motion.div>
              }
              </AnimatePresence>
            </div> :

          <div className="hidden items-center gap-2 md:flex">
              <Button size="sm" variant="ghost" to="/login?mode=provider">
                Become a provider
              </Button>
              <Button size="sm" to="/login">
                Sign in
              </Button>
            </div>
          }
          <button className="rounded-lg p-2 text-ink-700 hover:bg-sand-100 md:hidden" onClick={() => setMenuOpen((o) => !o)} aria-expanded={menuOpen} aria-label={menuOpen ? 'Close menu' : 'Open menu'}>
            {menuOpen ? <XIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
          </button>
        </div>
      </div>
      <AnimatePresence>
        {menuOpen &&
        <motion.nav
          aria-label="Mobile"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
          className="overflow-hidden border-t border-line bg-canvas md:hidden">
          
            <div className="flex flex-col gap-1 px-4 py-3">
              {[...publicLinks, ...(isTraveller ? [...travellerLinks, { to: '/account/profile', label: 'Profile' }] : [])].map((l) =>
            <NavLink key={l.to} to={l.to} end className={({ isActive }) => cn('rounded-lg px-3 py-2.5 text-[15px] font-medium', isActive ? 'bg-sand-100 text-ink' : 'text-ink-700')}>
                  {l.label}
                </NavLink>
            )}
              {currentUser && currentUser.role !== 'traveller' &&
            <Link to={homeForRole(currentUser.role)} className="rounded-lg px-3 py-2.5 text-[15px] font-medium text-ink-700">
                  {currentUser.role === 'admin' ? 'Admin console' : 'Provider workspace'}
                </Link>
            }
              <div className="mt-2 border-t border-line pt-3">
                {currentUser ?
              <Button variant="secondary" block onClick={signOut}>
                    Sign out
                  </Button> :

              <div className="grid grid-cols-2 gap-2">
                    <Button variant="secondary" to="/login?mode=provider">
                      Become a provider
                    </Button>
                    <Button to="/login">Sign in</Button>
                  </div>
              }
              </div>
            </div>
          </motion.nav>
        }
      </AnimatePresence>
    </header>);

}