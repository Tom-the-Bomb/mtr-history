
import { type State } from './schemas';

export const MIN_DATE = new Date(1972, 0, 1);
export const MAX_DATE = new Date(2023, 0, 1);

export function playPause(
    setPlaying: (f: (playing: boolean) => boolean) => void,
    time: number,
    setTime: (time: number) => void
): void {
    setPlaying(playing => {
        const next = !playing;
        if (next && time >= MAX_DATE.getTime()) {
            setTime(MIN_DATE.getTime());
        }
        return next;
    })
}

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

export function processStationName(stationName: string, time: number): string | null {
    const states = parseLabelDates(stationName);

    for (const state of states) {
        if (time >= state.dateRange.appear.getTime() && time <= state.dateRange.removed.getTime()) {
            return state.name
                .split('_')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');
        }
    }
    return null;
}