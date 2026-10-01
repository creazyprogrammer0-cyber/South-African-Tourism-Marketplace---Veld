import { useMarketplace } from '../contexts/MarketplaceContext';
import { providerByUserId } from '../utils/selectors';

export function useCurrentProvider() {
  const { state, currentUser } = useMarketplace();
  const provider = providerByUserId(state, currentUser?.id);
  return { provider, approved: provider?.verificationStatus === 'approved', state };
}