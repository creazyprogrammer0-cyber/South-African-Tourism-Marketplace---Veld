import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { MarketplaceState, User } from '../types/marketplace';
import { buildInitialState, STATE_VERSION } from '../utils/seed';
import { ApiError, Op } from '../utils/serviceCore';

const STORAGE_KEY = 'veld-marketplace-state';

interface MarketplaceContextValue {
  state: MarketplaceState;
  currentUser: User | null;
  /** Runs a mock backend operation with simulated latency against the latest state. */
  call: <P, R>(op: Op<P, R>, payload: P, options?: {latency?: number;}) => Promise<R>;
  resetDemo: () => void;
}

const MarketplaceContext = createContext<MarketplaceContextValue | null>(null);

function loadState(): MarketplaceState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as MarketplaceState;
      if (parsed.version === STATE_VERSION) return parsed;
    }
  } catch {

    // ignore corrupted storage
  }return buildInitialState();
}

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function MarketplaceProvider({ children }: {children: React.ReactNode;}) {
  const [state, setState] = useState<MarketplaceState>(loadState);
  const ref = useRef(state);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {

      // storage full or unavailable — state remains in memory
    }}, [state]);

  const call = useCallback(async <P, R>(op: Op<P, R>, payload: P, options?: {latency?: number;}): Promise<R> => {
    await wait(options?.latency ?? 550);
    const current = ref.current;
    if (current.settings.simulateNetworkErrors && Math.random() < 0.25) {
      throw new ApiError('We couldn’t reach the server. Check your connection and try again.');
    }
    const actor = current.users.find((u) => u.id === current.currentUserId) ?? null;
    const { state: next, result } = op(current, actor, payload);
    ref.current = next;
    setState(next);
    return result;
  }, []);

  const resetDemo = useCallback(() => {
    const fresh = buildInitialState();
    fresh.currentUserId = ref.current.currentUserId && fresh.users.some((u) => u.id === ref.current.currentUserId) ? ref.current.currentUserId : null;
    ref.current = fresh;
    setState(fresh);
  }, []);

  const currentUser = useMemo(() => state.users.find((u) => u.id === state.currentUserId) ?? null, [state.users, state.currentUserId]);

  const value = useMemo(() => ({ state, currentUser, call, resetDemo }), [state, currentUser, call, resetDemo]);
  return <MarketplaceContext.Provider value={value}>{children}</MarketplaceContext.Provider>;
}

export function useMarketplace(): MarketplaceContextValue {
  const ctx = useContext(MarketplaceContext);
  if (!ctx) throw new Error('useMarketplace must be used inside MarketplaceProvider');
  return ctx;
}