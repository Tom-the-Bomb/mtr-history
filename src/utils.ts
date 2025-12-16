
import { type State } from './schemas';

export const MIN_DATE = new Date(1970, 0, 1);
export const MAX_DATE = new Date(2025, 0, 1);

export function formatDate(date: Date, end: number = 10): string {
    return date.toISOString().slice(0, end).replace(/-/g, '/');
}

export function parseLabelDates(label: string): State[] {
    const parts = label.split(',');

    return parts.map(part => {
        const [name, rawInterval] = part.split('=');
        const interval = rawInterval.split('-');

        const appear = new Date(interval[0].replace(/_/g, '-'));
        const removed = interval[1]
            ? new Date(interval[1].replace(/_/g, '-'))
            : MAX_DATE;

        return {
            name,
            dateRange: { appear, removed }
        };
    });
}