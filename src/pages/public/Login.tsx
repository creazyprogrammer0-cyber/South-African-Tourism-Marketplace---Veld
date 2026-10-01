import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowRightIcon } from 'lucide-react';
import { toast } from 'sonner';
import { useMarketplace } from '../../contexts/MarketplaceContext';
import { useAction } from '../../hooks/useAction';
import { login, loginWithEmail, registerTraveller } from '../../utils/accountService';
import { registerProvider } from '../../utils/providerService';
import { homeForRole } from '../../utils/permissions';
import { demoAccounts } from '../../data/demoAccounts';
import { images } from '../../data/catalog';
import { Tabs } from '../../components/ui/Tabs';
import { Field, Input } from '../../components/ui/FormControls';
import { Button } from '../../components/ui/Button';
import { Avatar } from '../../components/ui/Avatar';
import type { Role } from '../../types/marketplace';

type Mode = 'signin' | 'signup' | 'provider';

export function Login() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { state } = useMarketplace();
  const { run, pending } = useAction();
  const [mode, setMode] = useState<Mode>(params.get('mode') as Mode === 'provider' ? 'provider' : 'signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const next = params.get('next');

  const go = (role: Role) => {
    const target = next && (role === 'traveller' ? !next.startsWith('/provider') && !next.startsWith('/admin') : next.startsWith(`/${role}`)) ? next : homeForRole(role);
    navigate(target, { replace: true });
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (mode === 'signin') {
      const res = await run(loginWithEmail, { email }, { silentError: true, latency: 400 });
      if (!res.ok) return setError(res.error);
      const user = state.users.find((u) => u.id === res.data)!;
      toast.success(`Welcome back, ${user.name.split(' ')[0]}`);
      go(user.role);
    } else if (mode === 'signup') {
      const res = await run(registerTraveller, { name, email }, { silentError: true, latency: 500 });
      if (!res.ok) return setError(res.error);
      toast.success('Account created');
      go('traveller');
    } else {
      const res = await run(registerProvider, { name, email }, { silentError: true, latency: 500 });
      if (!res.ok) return setError(res.error);
      toast.success('Account created — let’s set up your application');
      navigate('/provider/verification', { replace: true });
    }
  };

  const quick = async (userId: string, role: Role) => {
    const res = await run(login, { userId }, { latency: 200 });
    if (res.ok) go(role);
  };

  const copy = {
    signin: { title: 'Sign in to Veld', text: 'Manage bookings, track custom requests and keep your trip details in one place.', cta: 'Sign in' },
    signup: { title: 'Create a traveller account', text: 'Book experiences and request personalised proposals from local providers.', cta: 'Create account' },
    provider: { title: 'Apply as a provider', text: 'Create your account, then complete a short application. Our trust team reviews every provider before they can publish experiences.', cta: 'Start application' }
  }[mode];

  return (
    <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-2 lg:py-16">
      <div>
        <Tabs<Mode>
          items={[
          { value: 'signin', label: 'Sign in' },
          { value: 'signup', label: 'Create account' },
          { value: 'provider', label: 'Become a provider' }]
          }
          value={mode}
          onChange={(m) => {
            setMode(m);
            setError('');
          }} />
        
        <h1 className="mt-8 font-display text-3xl font-medium text-ink">{copy.title}</h1>
        <p className="mt-2 text-sm leading-relaxed text-ink-500">{copy.text}</p>
        <form onSubmit={submit} className="mt-6 space-y-4" noValidate>
          {mode !== 'signin' &&
          <Field label="Full name">{(p) => <Input {...p} value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />}</Field>
          }
          <Field label="Email" error={error || undefined} hint={mode === 'signin' ? 'Prototype: no password needed. Try sarah.morgan@example.com' : undefined}>
            {(p) => <Input {...p} type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />}
          </Field>
          <Button type="submit" size="lg" block loading={pending} variant={mode === 'provider' ? 'accent' : 'primary'}>
            {copy.cta}
          </Button>
        </form>

        {mode === 'signin' &&
        <div className="mt-10">
            <h2 className="text-sm font-semibold text-ink">Or continue with a demo account</h2>
            <ul className="mt-3 divide-y divide-line rounded-xl border border-line bg-surface">
              {demoAccounts.map((a) =>
            <li key={a.userId}>
                  <button onClick={() => quick(a.userId, a.role)} disabled={pending} className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-sand-50 disabled:opacity-60">
                    <Avatar name={a.name} size="sm" />
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-medium text-ink">{a.name}</span>
                      <span className="block text-xs text-ink-500">{a.description}</span>
                    </span>
                    <ArrowRightIcon className="h-4 w-4 text-ink-400" aria-hidden />
                  </button>
                </li>
            )}
            </ul>
          </div>
        }
      </div>
      <div className="relative hidden overflow-hidden rounded-3xl lg:block">
        <img src={mode === 'provider' ? images.soweto : images.lionsHead} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-ink/30" />
        <blockquote className="absolute bottom-0 p-10 text-white">
          <p className="font-display text-2xl leading-snug">{mode === 'provider' ? '“Verification took two days. Within a month most of my weekends were booked.”' : '“Thabo timed everything perfectly — we reached the top ten minutes before sunrise.”'}</p>
          <footer className="mt-3 text-sm text-white/80">{mode === 'provider' ? 'Lerato Khumalo, Jozi Streets' : 'Sarah M., Lion’s Head Sunrise Hike'}</footer>
        </blockquote>
      </div>
    </div>);

}