import React from 'react';
import { Link } from 'react-router-dom';

export function Logo({ to = '/', inverted }: {to?: string;inverted?: boolean;}) {
  return (
    <Link to={to} className="flex items-baseline gap-1.5" aria-label="Veld home">
      <span className={`font-display text-2xl font-semibold tracking-tight ${inverted ? 'text-white' : 'text-ink'}`}>Veld</span>
      <span className="h-1.5 w-1.5 rounded-full bg-clay" aria-hidden />
    </Link>);

}