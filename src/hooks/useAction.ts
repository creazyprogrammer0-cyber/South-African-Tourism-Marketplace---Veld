import { useCallback, useRef, useState } from 'react';
import { toast } from 'sonner';
import { useMarketplace } from '../contexts/MarketplaceContext';
import type { Op } from '../utils/serviceCore';

export type ActionResult<R> = {ok: true;data: R;} | {ok: false;error: string;};

/**
 * Wraps a mock backend operation with pending state, duplicate-submission
 * protection and toast feedback.
 */
export function useAction() {
  const { call } = useMarketplace();
  const [pending, setPending] = useState(false);
  const inFlight = useRef(false);

  const run = useCallback(
    async <P, R>(op: Op<P, R>, payload: P, opts: {success?: string;latency?: number;silentError?: boolean;} = {}): Promise<ActionResult<R>> => {
      if (inFlight.current) return { ok: false, error: 'Already in progress' };
      inFlight.current = true;
      setPending(true);
      try {
        const data = await call(op, payload, { latency: opts.latency });
        if (opts.success) toast.success(opts.success);
        return { ok: true, data };
      } catch (e) {
        const error = e instanceof Error ? e.message : 'Something went wrong. Please try again.';
        if (!opts.silentError) toast.error(error);
        return { ok: false, error };
      } finally {
        inFlight.current = false;
        setPending(false);
      }
    },
    [call]
  );

  return { run, pending };
}