import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLinkIcon, FlaskConicalIcon } from 'lucide-react';
import type { Booking, Role } from '../../types/marketplace';
import { useMarketplace } from '../../contexts/MarketplaceContext';
import { useAction } from '../../hooks/useAction';
import { cancelBooking, completeBooking, refundOutcome } from '../../utils/bookingService';
import { providerById, requestById, reviewForBooking, userById } from '../../utils/selectors';
import { bookingDisplayKey, bookingDisplayMeta, paymentMeta } from '../../utils/status';
import { formatDate, formatDateTime, todayISO } from '../../utils/dates';
import { formatZAR } from '../../utils/format';
import { cancellationPolicies } from '../../utils/policies';
import { Drawer } from '../ui/Drawer';
import { StatusBadge } from '../ui/StatusBadge';
import { Button } from '../ui/Button';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { Stars } from '../ui/Stars';

interface Props {
  booking: Booking | null;
  viewer: Role;
  onClose: () => void;
  onReview?: (b: Booking) => void;
}

function Row({ label, children }: {label: string;children: React.ReactNode;}) {
  return (
    <div className="grid grid-cols-[120px_1fr] gap-3 py-2 text-sm">
      <dt className="text-ink-500">{label}</dt>
      <dd className="min-w-0 text-ink">{children}</dd>
    </div>);

}

export function BookingDetailDrawer({ booking, viewer, onClose, onReview }: Props) {
  const { state } = useMarketplace();
  const { run, pending } = useAction();
  const [confirm, setConfirm] = useState<'cancel' | 'complete' | null>(null);
  const b = booking ? state.bookings.find((x) => x.id === booking.id) ?? booking : null;
  if (!b) return <Drawer open={false} onClose={onClose} title="">{null}</Drawer>;

  const traveller = userById(state, b.travellerId);
  const provider = providerById(state, b.providerId);
  const request = requestById(state, b.customRequestId);
  const review = reviewForBooking(state, b.id);
  const display = bookingDisplayMeta[bookingDisplayKey(b)];
  const pay = paymentMeta[b.paymentStatus];
  const refund = refundOutcome(b, viewer);
  const canCancel = ['confirmed', 'pending_payment', 'payment_failed'].includes(b.bookingStatus) && b.date >= todayISO();
  const canComplete = b.bookingStatus === 'confirmed';
  const showProviderContact = viewer !== 'traveller' || b.bookingStatus === 'confirmed' || b.bookingStatus === 'completed';

  const doCancel = async () => {
    const res = await run(cancelBooking, { bookingId: b.id }, { success: 'Booking cancelled' });
    if (res.ok) setConfirm(null);
  };
  const doComplete = async () => {
    const res = await run(completeBooking, { bookingId: b.id }, { success: 'Marked as completed' });
    if (res.ok) setConfirm(null);
  };

  const footer =
  <>
      {viewer === 'traveller' && ['pending_payment', 'payment_failed'].includes(b.bookingStatus) &&
    <Button variant="accent" to={`/checkout?booking=${b.id}`}>Complete payment</Button>
    }
      {viewer === 'traveller' && b.bookingStatus === 'completed' && !review && onReview && <Button onClick={() => onReview(b)}>Write a review</Button>}
      {canComplete &&
    <Button variant="secondary" onClick={() => setConfirm('complete')} icon={viewer === 'traveller' ? <FlaskConicalIcon className="h-4 w-4" /> : undefined}>
          {viewer === 'traveller' ? 'Simulate completion' : 'Mark as completed'}
        </Button>
    }
      {canCancel && <Button variant="ghost" className="text-danger hover:bg-danger-bg" onClick={() => setConfirm('cancel')}>Cancel booking</Button>}
    </>;


  return (
    <>
      <Drawer
        open={!!booking}
        onClose={onClose}
        title={b.title}
        subtitle={<span className="flex flex-wrap items-center gap-2"><StatusBadge tone={display.tone} label={display.label} /><StatusBadge tone={pay.tone} label={pay.label} /><span className="text-xs">{b.reference}</span></span>}
        footer={footer}>
        
        {b.bookingStatus === 'payment_failed' && b.failureReason &&
        <p className="mb-4 rounded-lg bg-danger-bg px-3 py-2 text-sm text-danger">{b.failureReason}</p>
        }
        <dl className="divide-y divide-line">
          <Row label={b.customRequestId ? 'Custom request' : 'Experience'}>
            {b.experienceId ?
            <Link to={`/experiences/${b.experienceId}`} className="inline-flex items-center gap-1 text-clay hover:underline">View listing <ExternalLinkIcon className="h-3.5 w-3.5" aria-hidden /></Link> :
            request ?
            viewer === 'traveller' ? <Link to={`/account/requests/${request.id}`} className="text-clay hover:underline">{request.title}</Link> : <span>{request.title}</span> :
            '—'}
          </Row>
          <Row label="Date & time">{formatDate(b.date)} · {b.time}</Row>
          <Row label="Guests">{b.guestCount}</Row>
          <Row label="Meeting point">{b.meetingPoint}</Row>
          {viewer !== 'traveller' &&
          <Row label="Traveller">
              <p>{b.contact.name}{traveller && traveller.name !== b.contact.name ? ` (account: ${traveller.name})` : ''}</p>
              <p className="text-ink-500">{b.contact.email}</p>
              {b.contact.phone && <p className="text-ink-500">{b.contact.phone}</p>}
            </Row>
          }
          {viewer !== 'provider' && provider &&
          <Row label="Provider">
              <p>{provider.businessName}</p>
              {showProviderContact ? <p className="text-ink-500">{provider.contactName} · {provider.phone}</p> : <p className="text-ink-500">Contact details shared after payment</p>}
            </Row>
          }
        </dl>

        <h3 className="mt-6 text-sm font-semibold text-ink">Payment</h3>
        <dl className="mt-1 divide-y divide-line">
          <Row label="Subtotal">{formatZAR(b.subtotal)}</Row>
          {viewer !== 'provider' && <Row label="Service fee">{formatZAR(b.fees)}</Row>}
          <Row label={viewer === 'provider' ? 'Your payout' : 'Total'}><span className="font-semibold">{formatZAR(viewer === 'provider' ? b.subtotal : b.total)}</span></Row>
          <Row label="Status">{pay.label}{b.paymentLast4 ? ` · card •••• ${b.paymentLast4}` : ''}</Row>
          <Row label="Booked">{formatDateTime(b.createdAt)}</Row>
        </dl>

        <h3 className="mt-6 text-sm font-semibold text-ink">Cancellation · {cancellationPolicies[b.cancellationPolicy].label}</h3>
        <p className="mt-1 text-sm leading-relaxed text-ink-600">{cancellationPolicies[b.cancellationPolicy].text}</p>
        {b.bookingStatus === 'cancelled' && <p className="mt-2 text-sm text-ink-600">Cancelled by {b.cancelledBy ?? 'traveller'}.</p>}

        {review &&
        <div className="mt-6 rounded-xl bg-sand-50 p-4">
            <p className="flex items-center gap-2 text-sm font-semibold text-ink">Review <Stars value={review.rating} /></p>
            <p className="mt-1 text-sm text-ink-700">{review.comment}</p>
            {review.status !== 'published' && <p className="mt-1 text-xs text-ink-500">Status: {review.status}</p>}
          </div>
        }
        {viewer === 'traveller' && canComplete &&
        <p className="mt-6 text-xs text-ink-500">Demo control: “Simulate completion” fast-forwards this booking to Completed so you can leave a review.</p>
        }
      </Drawer>

      <ConfirmDialog
        open={confirm === 'cancel'}
        onClose={() => setConfirm(null)}
        onConfirm={doCancel}
        loading={pending}
        tone="danger"
        title="Cancel this booking?"
        confirmLabel="Cancel booking">
        
        <p className="text-sm text-ink-700">{b.title} · {formatDate(b.date)} · {b.guestCount} guest{b.guestCount > 1 ? 's' : ''}</p>
        <p className="mt-3 rounded-lg bg-sand-50 px-3 py-2 text-sm text-ink-700">
          {refund === 'refunded' && `${viewer === 'traveller' ? 'You’re within the free cancellation window.' : 'Cancellations by providers or Veld are always refunded.'} ${formatZAR(b.total)} will be refunded to card •••• ${b.paymentLast4}.`}
          {refund === 'not_refunded' && `This is outside the free cancellation window (${cancellationPolicies[b.cancellationPolicy].label}), so the ${formatZAR(b.total)} paid will not be refunded.`}
          {refund === null && 'No payment has been taken for this booking.'}
        </p>
        <p className="mt-3 text-xs text-ink-500">{viewer === 'traveller' ? 'Your provider will be notified and the spots released.' : 'The traveller will be notified immediately.'}</p>
      </ConfirmDialog>
      <ConfirmDialog
        open={confirm === 'complete'}
        onClose={() => setConfirm(null)}
        onConfirm={doComplete}
        loading={pending}
        title="Mark this booking as completed?"
        confirmLabel="Mark completed">
        
        <p className="text-sm text-ink-700">The traveller will be invited to leave a review. {b.date > todayISO() && 'This booking is in the future — this is a demo shortcut.'}</p>
      </ConfirmDialog>
    </>);

}