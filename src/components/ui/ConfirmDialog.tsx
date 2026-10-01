import React from 'react';
import { Modal } from './Modal';
import { Button } from './Button';

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description?: string;
  confirmLabel: string;
  tone?: 'danger' | 'primary';
  loading?: boolean;
  children?: React.ReactNode;
}

export function ConfirmDialog({ open, onClose, onConfirm, title, description, confirmLabel, tone = 'primary', loading, children }: ConfirmDialogProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      description={description}
      size="sm"
      footer={
      <>
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Keep as is
          </Button>
          <Button variant={tone === 'danger' ? 'danger' : 'primary'} onClick={onConfirm} loading={loading}>
            {confirmLabel}
          </Button>
        </>
      }>
      
      {children ?? <p className="text-sm text-ink-600">This action can’t be undone.</p>}
    </Modal>);

}