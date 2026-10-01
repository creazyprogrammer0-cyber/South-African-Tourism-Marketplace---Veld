import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { LockIcon } from 'lucide-react';
import { useMarketplace } from '../../contexts/MarketplaceContext';
import type { Role } from '../../types/marketplace';
import { homeForRole, roleLabel } from '../../utils/permissions';
import { Button } from '../ui/Button';

/** Route guard enforcing role-based access. */
export function RequireRole({ role, children }: {role: Role;children: React.ReactNode;}) {
  const { currentUser } = useMarketplace();
  const location = useLocation();
  if (!currentUser) {
    return <Navigate to={`/login?next=${encodeURIComponent(location.pathname + location.search)}${role === 'provider' ? '&mode=provider' : ''}`} replace />;
  }
  if (currentUser.role !== role) {
    return (
      <div className="flex min-h-[70vh] w-full items-center justify-center bg-canvas px-4">
        <div className="max-w-md text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-sand-100 text-ink-600">
            <LockIcon className="h-5 w-5" aria-hidden />
          </div>
          <h1 className="text-xl font-semibold text-ink">This area is for {roleLabel[role].toLowerCase()}s</h1>
          <p className="mt-2 text-sm leading-relaxed text-ink-500">
            You’re signed in as {currentUser.name} ({roleLabel[currentUser.role].toLowerCase()}). Switch to a {roleLabel[role].toLowerCase()} account from the Demo menu, or head back to your own workspace.
          </p>
          <div className="mt-6 flex justify-center">
            <Button to={homeForRole(currentUser.role)}>Go to my {currentUser.role === 'traveller' ? 'homepage' : 'workspace'}</Button>
          </div>
        </div>
      </div>);

  }
  return <>{children}</>;
}