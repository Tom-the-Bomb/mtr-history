
import { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'

import { type LineWrapper, type StationWrapper } from '../schemas'
import { MAX_DATE, MIN_DATE, formatDate, parseLabelDates } from '../utils'

import mapSvg from '../assets/map.svg'

function update(dateNum: number, lines: LineWrapper[], stations: StationWrapper[]) {
    const now = new Date(Number(dateNum));

    for (const { el, dateRange: { appear, removed } } of lines) {
        if (appear <= now && now <= removed) {
            if (el.style.strokeDashoffset !== '0') {
                d3.select(el)
                    .transition()
                    .duration(500)
                    .ease(d3.easeLinear)
                    .style('stroke-dashoffset', '0');

                if (el.id === 'airportexpress_shared_section') {
                    el.style.strokeDasharray = '6, 6';
                }
            }
        } else {
            if (el.style.strokeDashoffset == '0') {
                const length = el.getTotalLength().toString();

                d3.select(el)
                    .transition()
                    .duration(500)
                    .ease(d3.easeLinear)
                    .style('stroke-dashoffset', length);

                if (el.id === 'airportexpress_shared_section') {
                    el.style.strokeDasharray = length;
                }
            }
        }
    }

    for (const { el, states } of stations) {
        if (states.some(({ dateRange: { appear, removed } }) => appear <= now && now <= removed)) {
            if (el.style.opacity !== '1') {
                d3.select(el)
                    .transition()
                    .duration(500)
                    .ease(d3.easeLinear)
                    .style('opacity', '1')
            }
        } else {
            if (el.style.opacity === '1') {
                d3.select(el)
                    .transition()
                    .duration(500)
                    .ease(d3.easeLinear)
                    .style('opacity', '0')
            }
        }
    }
}

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

                const href = el.getAttribute('xlink:href') || el.getAttribute('href');
                
                if (el.localName === 'use' && href === '#station') {
                    const circle = svgDoc.createElementNS('http://www.w3.org/2000/svg', 'circle');

                    const x = el.getAttribute('x');
                    const y = el.getAttribute('y');
                    if (x) circle.setAttribute('cx', x);
                    if (y) circle.setAttribute('cy', y);
                    circle.setAttribute('r', '3');

                    Array.from(el.attributes).forEach(attr => {
                        if (['x', 'y', 'xlink:href', 'href'].includes(attr.name)) return;
                        circle.setAttribute(attr.name, attr.value);
                    });

                    // Restore default styles from #station definition
                    circle.style.fill = '#fff';
                    circle.style.stroke = '#000';
                    circle.style.strokeWidth = '1';

                    el.parentNode!.replaceChild(circle, el);

                    d3.select(circle)
                        .on('mouseenter', function () {
                            d3.select(this)
                                .transition('hoverEffect')
                                .duration(200)
                                .attr('r', '6');
                        })
                        .on('mouseleave', function () {
                            d3.select(this)
                                .transition('hoverEffect')
                                .duration(200)
                                .attr('r', '3');
                        });

                    return {
                        el: circle as unknown as HTMLElement,
                        states: parseLabelDates(circle.getAttribute('inkscape:label')!)
                    };
                }

                if (el.localName === 'use' && href === '#interchange') {
                    const rect = svgDoc.createElementNS('http://www.w3.org/2000/svg', 'rect');

                    const useX = parseFloat(el.getAttribute('x') || '0');
                    const useY = parseFloat(el.getAttribute('y') || '0');

                    const width = 6;
                    const height = 10;
                    const rx = 3.5;
                    const defX = -3;
                    const defY = -5;

                    const currentX = useX + defX;
                    const currentY = useY + defY;

                    rect.setAttribute('x', String(currentX));
                    rect.setAttribute('y', String(currentY));
                    rect.setAttribute('width', String(width));
                    rect.setAttribute('height', String(height));
                    rect.setAttribute('rx', String(rx));

                    Array.from(el.attributes).forEach(attr => {
                        if (['x', 'y', 'xlink:href', 'href'].includes(attr.name)) return;
                        rect.setAttribute(attr.name, attr.value);
                    });

                    // Restore default styles from #interchange definition
                    rect.style.fill = '#fff';
                    rect.style.stroke = '#000';
                    rect.style.strokeWidth = '1';

                    el.parentNode!.replaceChild(rect, el);

                    d3.select(rect)
                        .on('mouseenter', function () {
                            d3.select(this)
                                .transition('hoverEffect')
                                .duration(200)
                                .attr('x', String(currentX - width / 2))
                                .attr('y', String(currentY - height / 2))
                                .attr('width', String(width * 2))
                                .attr('height', String(height * 2))
                                .attr('rx', String(rx * 2));
                        })
                        .on('mouseleave', function () {
                            d3.select(this)
                                .transition('hoverEffect')
                                .duration(200)
                                .attr('x', String(currentX))
                                .attr('y', String(currentY))
                                .attr('width', String(width))
                                .attr('height', String(height))
                                .attr('rx', String(rx));
                        });

                    return {
                        el: rect as unknown as HTMLElement,
                        states: parseLabelDates(rect.getAttribute('inkscape:label')!)
                    };
                }

                const originalTransform = el.getAttribute('transform') || '';
                const selection = d3.select(el);

                selection
                    .on('mouseenter', function () {
                        d3.select(this)
                            .transition('hoverEffect')
                            .duration(200)
                            .attr('transform', `${originalTransform} scale(2)`);
                    })
                    .on('mouseleave', function () {
                        d3.select(this)
                            .transition('hoverEffect')
                            .duration(200)
                            .attr('transform', originalTransform);
                    });

                return {
                    el,
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