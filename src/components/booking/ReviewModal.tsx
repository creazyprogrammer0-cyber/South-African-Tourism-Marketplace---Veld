import React, { useState } from 'react';
import type { Booking } from '../../types/marketplace';
import { useAction } from '../../hooks/useAction';
import { submitReview } from '../../utils/reviewService';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { StarInput } from '../ui/Stars';
import { Field, Textarea } from '../ui/FormControls';

export function ReviewModal({ booking, onClose }: {booking: Booking | null;onClose: () => void;}) {
  const { run, pending } = useAction();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [errors, setErrors] = useState<{rating?: string;comment?: string;}>({});

  const submit = async () => {
    const e: typeof errors = {};
    if (!rating) e.rating = 'Choose a star rating.';
    if (comment.trim().length < 20) e.comment = `Write at least 20 characters (${comment.trim().length}/20).`;
    setErrors(e);
    if (Object.keys(e).length || !booking) return;
    const res = await run(submitReview, { bookingId: booking.id, rating, comment }, { success: 'Thanks — your review is live' });
    if (res.ok) {
      setRating(0);
      setComment('');
      onClose();
    }
  };

  return (
    <Modal
      open={!!booking}
      onClose={onClose}
      title="Review your experience"
      description={booking?.title}
      footer={
      <>
          <Button variant="secondary" onClick={onClose} disabled={pending}>Cancel</Button>
          <Button onClick={submit} loading={pending}>Submit review</Button>
        </>
      }>
      
      <div className="space-y-5">
        <div>
          <p className="mb-1 text-sm font-medium text-ink">Overall rating</p>
          <StarInput value={rating} onChange={setRating} error={!!errors.rating} />
          {errors.rating && <p className="mt-1 text-xs font-medium text-danger" role="alert">{errors.rating}</p>}
        </div>
        <Field label="Your review" error={errors.comment} hint="What stood out? What should other travellers know?">
          {(p) => <Textarea {...p} rows={5} value={comment} onChange={(e) => setComment(e.target.value)} maxLength={1200} />}
        </Field>
        <p className="text-xs text-ink-500">Reviews are public and linked to your verified booking. Our team removes reviews containing contact details or abusive language.</p>
      </div>
    </Modal>);

}