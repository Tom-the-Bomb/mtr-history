
import { useEffect, useRef, useState, useMemo } from 'react'
import * as d3 from 'd3'

import { type LineWrapper, type StationWrapper } from '../schemas'
import { MAX_DATE, MIN_DATE, formatDate, parseLabelDates } from '../utils'

import mapSvg from '../assets/map.svg'
import { update, setupHoverEffect } from '../utils_d3'

export default function Map() {
    const svgRef = useRef<HTMLObjectElement | null>(null);
    const linesRef = useRef<LineWrapper[]>([]);
    const stationsRef = useRef<StationWrapper[]>([]);

    const [svgLoaded, setSvgLoaded] = useState(false);
    const [time, setTime] = useState<number>(MIN_DATE.getTime());

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

                return {
                    el: setupHoverEffect(svgDoc, el),
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

    return (
        <div className="">
            <main className="w-screen h-screen">
                <object
                    ref={svgRef}
                    data={mapSvg}
                    onLoad={() => setSvgLoaded(true)}
                    type="image/svg+xml"
                    className="absolute top-0 left-0 w-full h-full"
                />
            </main>
            <header className={
                `absolute top-0 left-0 w-screen pt-15 flex flex-col justify-center items-center gap-3 text-center`
            }>
                <div>
                    <h1 className="text-5xl font-bold font-serif text-shadow-xl">MTR History</h1>
                    <h2 className="text-2xl font-zh">港铁历史</h2>
                </div>
                <div>
                    <h2 className="text-sm text-shadow-xl opacity-70">Explore the historical development of Hong Kong's MTR system</h2>
                    <h3 className="effect-underline">Read more</h3>
                </div>
            </header>
            <footer className={
                `absolute bottom-0 left-0 w-screen p-4 pt-2 flex flex-col justify-center items-center gap-2
                bg-gray-400/50`
            }>
                <label htmlFor="date-slider" className="text-lg font-medium">
                    {formatDate(new Date(time))}
                </label>
                <div className="relative w-full h-12 flex items-center px-4">
                    <input
                        id="date-slider"
                        type="range"
                        min={MIN_DATE.getTime()}
                        max={MAX_DATE.getTime()}
                        defaultValue={MIN_DATE.getTime()}
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
        </div>
    )
}