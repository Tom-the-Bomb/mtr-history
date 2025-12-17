import { useEffect, useRef, useState, useMemo } from 'react'
import * as d3 from 'd3'

import { type LineWrapper, type StationWrapper, type RawTooltipData } from '../schemas'
import { MAX_DATE, MIN_DATE, formatDate, parseLabelDates, playPause, processStationName } from '../utils'
import { update, setupHoverEffect } from '../utils_d3'

import mtrLogo from '../assets/mtr.svg'
import mapSvg from '../assets/map.svg'
import pause from '../assets/pause.svg'
import play from '../assets/play.svg'

function renderTooltip(
    tooltip: RawTooltipData | null,
    time: number
): React.ReactElement | null {
    if (!tooltip) return null;
    const name = processStationName(tooltip.raw, time);

    if (name) {
        return (
            <div
                className="absolute px-3 py-2 bg-gray-900/90 text-white text-sm rounded-md shadow-lg pointer-events-none z-50 whitespace-nowrap backdrop-blur-sm"
                style={{
                    left: `${tooltip.x + 10}px`,
                    top: `${tooltip.y + 10}px`,
                    transform: 'translate(0, -50%)'
                }}
            >
                <div className="flex gap-2 items-center">
                    <img src={mtrLogo} alt="" className="h-4"/>
                    {name}
                </div>
                <div className="absolute w-2 h-2 bg-gray-900/90 rotate-45 -left-1 top-1/2 -translate-y-1/2"></div>
            </div>
        )
    }
    return null;
}

export default function Map({ setRenderArticle }: { setRenderArticle: (value: boolean) => void }) {
    const svgRef = useRef<HTMLObjectElement | null>(null);
    const linesRef = useRef<LineWrapper[]>([]);
    const stationsRef = useRef<StationWrapper[]>([]);

    const [svgLoaded, setSvgLoaded] = useState(false);
    const [time, setTime] = useState<number>(MIN_DATE.getTime());
    const [playing, setPlaying] = useState(false);
    const [tooltip, setTooltip] = useState<RawTooltipData | null>(null);

    const ticks = useMemo(() => {
        const startYear = MIN_DATE.getFullYear();
        const endYear = MAX_DATE.getFullYear();
        const tickDates = [];
        for (let year = Math.ceil(startYear/ 5) * 5; year < endYear; year += 5) {
            tickDates.push(new Date(year, 0, 1));
        }
        return tickDates;
    }, []);

    useEffect(() => {
        function handler(e: KeyboardEvent) {
            if (e.code === 'Space') {
                e.preventDefault();
                playPause(setPlaying, time, setTime);
            }
        }
        document.addEventListener('keydown', handler);

        return () => document.removeEventListener('keydown', handler);
    }, []);

    useEffect(() => {
        if (!(svgLoaded && svgRef.current)) return;

        const svgDoc = svgRef.current.contentDocument!;

        const lines = svgDoc.querySelector('g#layer4')!;
        const stations = svgDoc.querySelector('g#layer3')!;

        linesRef.current = Array.from(lines.querySelectorAll('path'))
            .map(el => {
                const length = el.getTotalLength();

                el.style.strokeDashoffset = String(length);
                el.style.strokeDasharray = String(length);

                return {
                    el,
                    dateRange: parseLabelDates(
                        el.getAttribute('inkscape:label')!
                    )[0].dateRange
                };
            });

        stationsRef.current = Array.from(stations.querySelectorAll<HTMLElement>('use, path'))
            .map(el => {
                el.style.opacity = '0';

                const wrappedEl = setupHoverEffect(svgDoc, el);

                wrappedEl.addEventListener('mouseenter', (e) => {
                    const rect = svgRef.current!.getBoundingClientRect();
                    setTooltip({
                        x: e.clientX - rect.left,
                        y: e.clientY - rect.top,
                        raw: el.getAttribute('inkscape:label')!,
                    });
                });
                wrappedEl.addEventListener('mousemove', (e) => {
                    const rect = svgRef.current!.getBoundingClientRect();
                    setTooltip(prev => prev ? {
                        ...prev,
                        x: e.clientX - rect.left,
                        y: e.clientY - rect.top
                    } : null);
                });
                wrappedEl.addEventListener('mouseleave', () => setTooltip(null));

                return {
                    el: wrappedEl,
                    states: parseLabelDates(
                        el.getAttribute('inkscape:label')!
                    )
                };
            });

        update(time, linesRef.current, stationsRef.current);

        const svgd3 = d3.select(svgDoc).select<SVGSVGElement>('svg');
        const zoomLayer = d3.select(svgDoc).select<SVGGElement>('#zoom-layer');
        const svgEl = svgd3.node()!;

        const viewBox = svgEl.viewBox.baseVal;

        const { width: viewportWidth, height: viewportHeight } = svgEl.getBoundingClientRect();

        const scaleWidth = viewportWidth / viewBox.width;
        const scaleHeight = viewportHeight / viewBox.height;

        const initialScale = viewportWidth < viewportHeight
            ? Math.max(scaleWidth, scaleHeight)
            : scaleWidth;

        const initialTranslateY = viewportHeight - viewBox.height * initialScale;
        const initialTranslateX = (viewportWidth - viewBox.width * initialScale) / 2;

        const zoom = d3
            .zoom<SVGSVGElement, unknown>()
            .scaleExtent([initialScale, initialScale * 4])
            .translateExtent([
                [0, 0],
                [viewBox.width, viewBox.height],
            ])
            .on('zoom', (event: d3.D3ZoomEvent<SVGSVGElement, unknown>) => {
                zoomLayer.attr('transform', event.transform.toString())
            });

        svgd3
            .call(zoom)
            .call(zoom.transform, d3.zoomIdentity.translate(initialTranslateX, initialTranslateY).scale(initialScale));

        svgEl.removeAttribute('viewBox');
        svgEl.style.width = '100%';
        svgEl.style.height = '100%';
    }, [svgLoaded]);

    useEffect(() => {
        update(time, linesRef.current, stationsRef.current);
    }, [time]);

    useEffect(() => {
        if (!playing) {
            return;
        }

        const timer = d3.interval(() => {
            setTime(prev => {
                const nextDate = d3.timeMonth.offset(new Date(prev), 1);
                const nextMs = nextDate.getTime();

                if (nextMs >= MAX_DATE.getTime()) {
                    setPlaying(false);
                    return MAX_DATE.getTime();
                }
                return nextMs;
            });
        }, 40);
        return () => timer.stop();
    }, [playing]);

    return (
        <>
            <main className="w-screen h-screen">
                <object
                    ref={svgRef}
                    data={mapSvg}
                    onLoad={() => setSvgLoaded(true)}
                    type="image/svg+xml"
                    className="absolute top-0 left-0 w-full h-full"
                />
                {renderTooltip(tooltip, time)}
            </main>
            <header className={
                `absolute top-0 left-0 w-screen pt-15 flex flex-col justify-center items-center gap-3 text-center pointer-events-none`
            }>
                <div>
                    <h1 className="text-5xl font-bold font-serif text-shadow-xl">MTR History</h1>
                    <h2 className="text-2xl font-zh">港铁历史</h2>
                </div>
                <div className="flex flex-col gap-5 justify-center items-center">
                    <h2 className="text-sm text-shadow-xl opacity-70">Explore the historical development of Hong Kong's MTR system</h2>
                    <button
                        type="button"
                        className="pointer-events-auto nav-btn"
                        onClick={() => setRenderArticle(true)}
                    >
                        Read more
                    </button>
                </div>
            </header>
            <footer className={
                `absolute bottom-0 left-0 w-screen p-4 pt-2 flex flex-col justify-center items-center gap-2
                bg-gray-400/50`
            }>
                <button
                    type="button"
                    onClick={() => playPause(setPlaying, time, setTime)}
                    className="absolute left-6 top-6 h-8 flex justify-center items-center"
                    aria-label={playing ? 'Pause timeline' : 'Play timeline'}
                >
                    <img src={playing ? pause : play} alt={playing ? 'Pause' : 'Play'} className="h-full"/>
                </button>
                <label
                    htmlFor="date-slider"
                    className="inline-block text-lg font-medium"
                >
                    {formatDate(new Date(time))}
                </label>
                <div className="relative w-full h-12 flex items-center px-4">
                    <input
                        id="date-slider"
                        type="range"
                        min={MIN_DATE.getTime()}
                        max={MAX_DATE.getTime()}
                        value={time}
                        onChange={(e) => setTime(Number(e.target.value))}
                        className="absolute left-4 right-4 top-1/2 -translate-y-1/2 z-10 opacity-80 cursor-pointer"
                    />
                    <div className="absolute top-1/2 left-4 right-4 h-full -translate-y-1/2 pointer-events-none">
                        {
                            ticks.map(date => {
                                const pct = (
                                    (date.getTime() - MIN_DATE.getTime())
                                    / (MAX_DATE.getTime() - MIN_DATE.getTime())
                                ) * 100;

                                return (
                                    <div
                                        key={date.getTime()}
                                        className="absolute top-1/2 flex flex-col items-center"
                                        style={{ left: `${pct}%`, transform: `translate(-50%, -50%)` }}
                                    >
                                        <div className="h-3 w-0.5 bg-gray-800/50 mt-6"></div>
                                        <span className="text-[10px] font-medium text-gray-800 mt-0.5">{date.getFullYear()}</span>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </footer>
        </>
    )
}