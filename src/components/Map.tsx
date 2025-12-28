
import * as d3 from 'd3'
import {
    useEffect,
    useState,
    useMemo,
    useRef,
} from 'react'

import {
    type LineWrapper,
    type StationWrapper,
    type RawTooltipData,
} from '../schemas'

import {
    MAX_DATE,
    MIN_DATE,
    findName,
    formatDate,
    parseLabelDates,
    playPause,
    KCR_MERGER_DATE,
} from '../utils'

import {
    update,
    setupHoverEffect,
    hoverMouseEnter,
    hoverMouseLeave,
} from '../utils_d3'

import kcrLogo from '../assets/kcr.svg'
import mtrLogo from '../assets/mtr.svg'
import mapSvg from '../assets/map.svg'
import pause from '../assets/pause.svg'
import play from '../assets/play.svg'
import plus from '../assets/plus.svg'
import minus from '../assets/minus.svg'

import linesData from '../assets/data/lines.json'

function renderTooltip(
    stations: StationWrapper[],
    tooltip: RawTooltipData | null,
    time: number
): React.ReactElement | null {
    if (!tooltip) {
        return null;
    }

    let name = findName(tooltip.station.states, time);
    let status = tooltip.station.status;

    if (!name && tooltip.station.isRedundant) {
        const idx = stations.findIndex(station => station === tooltip.station);

        const interchange = stations[idx - 1];
        name = findName(stations[idx - 1].states, time);
        status = interchange.status;
    }

    if (name) {
        return (
            <div
                className={
                    `absolute px-3 py-2 bg-gray-900/90 text-white text-sm rounded-md
                    shadow-lg pointer-events-none z-50 whitespace-nowrap backdrop-blur-sm`
                }
                style={{
                    left: `${tooltip.x + 10}px`,
                    top: `${tooltip.y + 10}px`,
                    transform: 'translate(0, -50%)'
                }}
            >
                <div className="flex gap-2 items-center">
                    {
                        (status !== 0 && time < KCR_MERGER_DATE) && <img src={kcrLogo} className="h-4"/>
                    }
                    {
                        (status !== 1 || time >= KCR_MERGER_DATE) && <img src={mtrLogo} className="h-4"/>
                    }
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
    const [stations, setStations] = useState<StationWrapper[]>([]);
    const zoomRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);
    const svgD3Ref = useRef<d3.Selection<SVGSVGElement, unknown, null, undefined> | null>(null);

    const [svgLoaded, setSvgLoaded] = useState(false);
    const [time, setTime] = useState<number>(MIN_DATE.getTime());
    const [playing, setPlaying] = useState(false);
    const [tooltip, setTooltip] = useState<RawTooltipData | null>(null);
    const timeRef = useRef(time);

    useEffect(() => {
        timeRef.current = time;
    }, [time]);

    function keyDownHandler(e: KeyboardEvent) {
        if (e.code === 'Space') {
            e.preventDefault();
            playPause(setPlaying, timeRef.current, setTime);
        }
    }

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
        function handler() {
            window.location.reload();
        }
        window.addEventListener('resize', handler);

        return () => window.removeEventListener('resize', handler);
    }, []);

    useEffect(() => {
        document.addEventListener('keydown', keyDownHandler);
        return () => document.removeEventListener('keydown', keyDownHandler);
    }, []);

    const legend = useMemo(() =>
        linesData.lines.map(line => ({
            color: line.color,
            states: parseLabelDates(line.label),
        })),
        [],
    );

    useEffect(() => {
        if (!(svgLoaded && svgRef.current)) return;

        const svgDoc = svgRef.current.contentDocument!;

        svgDoc.addEventListener('keydown', keyDownHandler);

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
                let label = el.getAttribute('inkscape:label')!;

                const status = label.startsWith('^')
                    ? 1
                    : label.startsWith('!')
                        ? 2
                        : 0;
                label = label.replace(/^[!^]/, '');
                const isRedundant = label.startsWith('*');
                label = label.replace(/^\*/, '');

                const station = {
                    el: wrappedEl,
                    isRedundant,
                    status,
                    states: parseLabelDates(label),
                };

                if (el.localName === 'use') {
                    wrappedEl.addEventListener('mouseenter', (e) => {
                        const rect = svgRef.current!.getBoundingClientRect();
                        setTooltip({
                            x: e.clientX - rect.left,
                            y: e.clientY - rect.top,
                            station,
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
                }
                return station;
            });

        setStations(stationsRef.current);

        for (const station of stationsRef.current) {
            if (station.isRedundant) {
                const idx = stationsRef.current.findIndex(st => st === station);
                const interchange = stationsRef.current[idx - 1];

                const x = parseFloat(interchange.el.getAttribute('x') || '0');
                const y = parseFloat(interchange.el.getAttribute('y') || '0');
                const width = parseFloat(interchange.el.getAttribute('width') || '0');
                const height = parseFloat(interchange.el.getAttribute('height') || '0');
                const rx = parseFloat(interchange.el.getAttribute('rx') || '0');

                d3.select(station.el)
                    .on('mouseenter.b', () => {
                        hoverMouseEnter(interchange.el, x, y, width, height, rx, 5 / 3);
                    })
                    .on('mouseleave.b', () => {
                        hoverMouseLeave(interchange.el, x, y, width, height, rx);
                    });
            }
        }

        update(MIN_DATE.getTime(), linesRef.current, stationsRef.current);

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

        svgEl.addEventListener('touchmove', (e) => {
            e.preventDefault();
        }, { passive: false });

        let lastDistance = 0;

        svgEl.addEventListener('touchstart', (e) => {
            if (e.touches.length === 2) {
                const touch1 = e.touches[0];
                const touch2 = e.touches[1];
                lastDistance = Math.hypot(
                    touch2.clientX - touch1.clientX,
                    touch2.clientY - touch1.clientY
                );
            }
        }, { passive: true });

        svgEl.addEventListener('touchmove', (e) => {
            if (e.touches.length === 2) {
                const touch1 = e.touches[0];
                const touch2 = e.touches[1];

                const distance = Math.hypot(
                    touch2.clientX - touch1.clientX,
                    touch2.clientY - touch1.clientY
                );

                if (lastDistance > 0) {
                    const scale = distance / lastDistance;
                    if (svgD3Ref.current && zoomRef.current) {
                        svgD3Ref.current.call(
                            zoomRef.current.scaleBy,
                            scale
                        );
                    }
                    lastDistance = distance;
                }
            }
        }, { passive: false });

        svgEl.addEventListener('touchend', () => {
            lastDistance = 0;
        }, { passive: true });

        svgd3
            .call(zoom)
            .call(zoom.transform, d3.zoomIdentity.translate(initialTranslateX, initialTranslateY).scale(initialScale));

        zoomRef.current = zoom;
        svgD3Ref.current = svgd3;

        svgEl.removeAttribute('viewBox');
        svgEl.style.width = '100%';
        svgEl.style.height = '100%';

        return () => svgDoc.removeEventListener('keydown', keyDownHandler);
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
        <div className="w-dvw h-dvh flex justify-center items-center touch-none">
            <main className="w-dvw h-dvh touch-none">
                <object
                    ref={svgRef}
                    data={mapSvg}
                    onLoad={() => setSvgLoaded(true)}
                    type="image/svg+xml"
                    className="absolute top-0 left-0 w-full h-full touch-none"
                />
                {svgLoaded && renderTooltip(stations, tooltip, time)}
            </main>
            <header className={
                `absolute top-0 left-0 w-dvw pt-15 flex flex-col justify-center items-center gap-3 text-center pointer-events-none`
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
            <div className="absolute bottom-31 left-4 flex flex-col gap-2 pointer-events-auto">
                <button
                    type="button"
                    onClick={() => {
                        if (svgD3Ref.current && zoomRef.current) {
                            svgD3Ref.current
                                .transition()
                                .duration(300)
                                .call(zoomRef.current.scaleBy, 1.3);
                        }
                    }}
                    className="zoom-btn"
                    aria-label="Zoom in"
                >
                    <img src={plus} alt="Zoom in" className="h-6 w-6"/>
                </button>
                <button
                    type="button"
                    onClick={() => {
                        if (svgD3Ref.current && zoomRef.current) {
                            svgD3Ref.current
                                .transition()
                                .duration(300)
                                .call(zoomRef.current.scaleBy, 1 / 1.3);
                        }
                    }}
                    className="zoom-btn"
                    aria-label="Zoom out"
                >
                    <img src={minus} alt="Zoom out" className="h-6 w-6"/>
                </button>
            </div>
            <div className="absolute bottom-29 flex flex-wrap justify-center w-2/3 lg:w-1/2 items-center gap-1 pointer-events-none">
                {
                    legend.map((line) => {
                        const name = findName(line.states, time);

                        if (name) {
                            return (
                                <div key={line.color} className={
                                    `p-1 rounded-md
                                    flex items-center gap-2 text-[7px] md:text-[10px] pointer-events-none
                                    bg-gray-400/10 text-gray-600`
                                }>
                                    <div className="w-3 md:w-4 h-1 md:h-2 rounded-sm" style={{ backgroundColor: line.color }}></div>
                                    {name}
                                </div>
                            )
                        }
                        return null;
                    })
                }
            </div>
            <footer className={
                `absolute bottom-0 left-0 w-dvw p-4 pt-2 flex flex-col justify-center items-center gap-2
                bg-gray-400/50 pointer-events-none`
            }>
                <button
                    type="button"
                    onClick={() => playPause(setPlaying, time, setTime)}
                    className="absolute left-5 top-4 h-10 flex justify-center items-center pointer-events-auto"
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
                <div className="relative w-full h-12 flex items-center px-4 pointer-events-auto">
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
                                const min_time = MIN_DATE.getTime();
                                const pct = (
                                    (date.getTime() - min_time)
                                    / (MAX_DATE.getTime() - min_time)
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
        </div>
    )
}