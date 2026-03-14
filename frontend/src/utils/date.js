import { format, formatDistanceToNow } from 'date-fns';

export const fmtDate = (d) => format(new Date(d), 'dd MMM yyyy');
export const fmtDateTime = (d) => format(new Date(d), 'dd MMM yyyy, HH:mm');
export const fmtRelative = (d) => formatDistanceToNow(new Date(d), { addSuffix: true });
export const nowISO = () => new Date().toISOString();
