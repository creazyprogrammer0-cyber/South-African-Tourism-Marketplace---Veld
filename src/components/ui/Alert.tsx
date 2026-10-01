import React from 'react';
import { AlertTriangleIcon, CheckCircle2Icon, InfoIcon, XCircleIcon } from 'lucide-react';
import { cn } from '../../utils/cn';

type AlertTone = 'info' | 'success' | 'warning' | 'danger';

const styles: Record<AlertTone, {box: string;Icon: typeof InfoIcon;}> = {
  info: { box: 'bg-info-bg text-info', Icon: InfoIcon },
  success: { box: 'bg-success-bg text-success', Icon: CheckCircle2Icon },
  warning: { box: 'bg-warning-bg text-warning', Icon: AlertTriangleIcon },
  danger: { box: 'bg-danger-bg text-danger', Icon: XCircleIcon }
};

export function Alert({ tone = 'info', title, children, action, className }: {tone?: AlertTone;title: string;children?: React.ReactNode;action?: React.ReactNode;className?: string;}) {
  const { box, Icon } = styles[tone];
  return (
    <div role={tone === 'danger' ? 'alert' : 'status'} className={cn('flex flex-col gap-3 rounded-xl px-4 py-3.5 sm:flex-row sm:items-start', box, className)}>
      <Icon className="mt-0.5 h-5 w-5 shrink-0" aria-hidden />
      <div className="flex-1">
        <p className="text-sm font-semibold">{title}</p>
        {children && <div className="mt-0.5 text-sm text-ink-700">{children}</div>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>);

}