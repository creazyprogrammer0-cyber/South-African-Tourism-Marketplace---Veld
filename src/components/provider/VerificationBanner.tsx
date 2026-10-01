import React from 'react';
import type { ProviderProfile } from '../../types/marketplace';
import { Alert } from '../ui/Alert';
import { Button } from '../ui/Button';

/** Communicates verification status and the provider's next required action. */
export function VerificationBanner({ provider }: {provider: ProviderProfile;}) {
  switch (provider.verificationStatus) {
    case 'approved':
      return null;
    case 'draft':
      return (
        <Alert tone="info" title="Finish your application to start publishing" action={<Button size="sm" to="/provider/verification">Continue application</Button>}>
          You can prepare draft experiences now. They’ll become bookable once our team verifies your profile.
        </Alert>);

    case 'submitted':
    case 'under_review':
      return (
        <Alert tone="info" title="Your application is under review">
          We’ll notify you when your verification status changes. In the meantime you can prepare draft experiences.
        </Alert>);

    case 'changes_requested':
      return (
        <Alert tone="warning" title="Changes requested on your application" action={<Button size="sm" to="/provider/verification">Update application</Button>}>
          {provider.adminNote}
        </Alert>);

    case 'rejected':
      return (
        <Alert tone="danger" title="Your application wasn’t approved">
          {provider.adminNote} Contact partners@veld.co.za if you’d like to discuss this decision.
        </Alert>);

  }
}