import React from 'react';
import { CompassIcon } from 'lucide-react';
import { EmptyState } from '../../components/ui/EmptyState';
import { Button } from '../../components/ui/Button';

export function NotFound() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 pt-16">
      <EmptyState icon={<CompassIcon className="h-5 w-5" />} title="We couldn’t find that page" message="The link may be out of date. Head back to discovery to find your next experience." action={<Button to="/explore">Explore Experiences</Button>} />
    </div>);

}