// Native date helpers (no external date library) so formatting can never fail at module load.
const DAY_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const DAY_LONG = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTH_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTH_LONG = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const pad = (n: number) => String(n).padStart(2, '0');

function parseISO(value: string): Date {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (m) return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  const d = new Date(value);
  return isNaN(d.getTime()) ? new Date() : d;
}

function format(d: Date, pattern: string): string {
  return pattern.replace(/EEEE|EEE|MMMM|MMM|MM|yyyy|dd|d|HH|mm/g, (t) => {
    switch (t) {
      case 'EEEE':return DAY_LONG[d.getDay()];
      case 'EEE':return DAY_SHORT[d.getDay()];
      case 'MMMM':return MONTH_LONG[d.getMonth()];
      case 'MMM':return MONTH_SHORT[d.getMonth()];
      case 'MM':return pad(d.getMonth() + 1);
      case 'yyyy':return String(d.getFullYear());
      case 'dd':return pad(d.getDate());
      case 'd':return String(d.getDate());
      case 'HH':return pad(d.getHours());
      case 'mm':return pad(d.getMinutes());
      default:return t;
    }
  });
}

function differenceInCalendarDays(a: Date, b: Date): number {
  const ua = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  const ub = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
  return Math.round((ua - ub) / 864e5);
}

function formatDistanceToNowStrict(d: Date): string {
  const secs = Math.max(0, Math.round((Date.now() - d.getTime()) / 1000));
  const unit = (n: number, w: string) => `${n} ${w}${n === 1 ? '' : 's'}`;
  if (secs < 60) return unit(secs, 'second');
  const mins = Math.round(secs / 60);
  if (mins < 60) return unit(mins, 'minute');
  const hours = Math.round(mins / 60);
  if (hours < 24) return unit(hours, 'hour');
  const days = Math.round(hours / 24);
  if (days < 30) return unit(days, 'day');
  const months = Math.round(days / 30);
  if (months < 12) return unit(months, 'month');
  return unit(Math.round(days / 365), 'year');
}

export function toISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function todayISO(): string {
  return toISODate(new Date());
}

/** YYYY-MM-DD n days from today (negative for the past). */
export function dateFromToday(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return toISODate(d);
}

/** Full ISO timestamp n days ago. */
export function isoDaysAgo(n: number, hour = 10): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(hour, n * 7 % 60, 0, 0);
  return d.toISOString();
}

export function nowISO(): string {
  return new Date().toISOString();
}

export function isPastDate(date: string): boolean {
  return date < todayISO();
}

export function daysUntil(date: string): number {
  return differenceInCalendarDays(parseISO(date), new Date());
}

export function hoursUntil(date: string, time: string): number {
  const start = new Date(`${date}T${time || '09:00'}:00`);
  return (start.getTime() - Date.now()) / 36e5;
}

export function formatDate(date: string, pattern = 'EEE d MMM yyyy'): string {
  return format(parseISO(date), pattern);
}

export function formatDateShort(date: string): string {
  return format(parseISO(date), 'd MMM');
}

export function formatDateTime(iso: string): string {
  return format(parseISO(iso), 'd MMM yyyy, HH:mm');
}

export function relativeTime(iso: string): string {
  return `${formatDistanceToNowStrict(parseISO(iso))} ago`;
}

export function weekday(date: string): number {
  return parseISO(date).getDay();
}