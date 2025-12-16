
import { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'

import { type LineWrapper, type StationWrapper } from '../schemas'
import { MAX_DATE, MIN_DATE, formatDate, parseLabelDates } from '../utils'
import { setupHoverEffect, update } from '../utils_d3'

import mapSvg from '../assets/map.svg'

export default function Map() {
    const svgRef = useRef<HTMLObjectElement | null>(null);
    const linesRef = useRef<LineWrapper[]>([]);
    const stationsRef = useRef<StationWrapper[]>([]);

    const [svgLoaded, setSvgLoaded] = useState(false);
    const [time, setTime] = useState<number>(MIN_DATE.getTime());

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
                `absolute top-0 left-0 w-screen pt-15 flex flex-col justify-center items-center gap-3 text-center pointer-events-none`
            }>
                <div>
                    <h1 className="text-5xl font-bold font-serif text-shadow-xl">MTR History</h1>
                    <h2 className="text-2xl font-zh">港铁历史</h2>
                </div>
                <div>
                    <h2 className="text-sm text-shadow-xl opacity-70">Explore the historical development of Hong Kong's MTR system</h2>
                    <h3 className="effect-underline pointer-events-auto">Read more</h3>
                </div>
            </header>
            <footer className={
                `absolute bottom-0 left-0 w-screen p-4 pt-2 flex flex-col justify-center items-center gap-2
                bg-gray-400/50`
            }>
                <label htmlFor="date-slider" className="text-lg font-medium">
                    {formatDate(new Date(time))}
                </label>
                <div className="w-full flex items-center gap-4">
                    <span>{formatDate(MIN_DATE, 7)}</span>
                    <input
                        id="date-slider"
                        type="range"
                        min={MIN_DATE.getTime()}
                        max={MAX_DATE.getTime()}
                        defaultValue={MIN_DATE.getTime()}
                        onChange={(e) => setTime(Number(e.target.value))}
                        className="grow"
                    />
                    <span>{formatDate(MAX_DATE, 7)}</span>
                </div>
            </footer>
        </div>
    )
}