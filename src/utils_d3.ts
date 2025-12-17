import * as d3 from 'd3';

import { type LineWrapper, type StationWrapper } from './schemas';

export function update(dateNum: number, lines: LineWrapper[], stations: StationWrapper[]): void {
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

export function hoverMouseEnter(
    rect: Element,
    currentX: number, currentY: number,
    width: number, height: number,
    rx: number, scaleFactor: number
): void {
    d3.select(rect)
        .transition('hoverEffect')
        .duration(300)
        .attr('x', String(currentX - (width * scaleFactor - width) / 2))
        .attr('y', String(currentY - (height * scaleFactor - height) / 2))
        .attr('width', String(width * scaleFactor))
        .attr('height', String(height * scaleFactor))
        .attr('rx', String(rx * scaleFactor));
}

export function hoverMouseLeave(rect: Element,
    currentX: number, currentY: number,
    width: number, height: number,
    rx: number
): void {
    d3.select(rect)
        .transition('hoverEffect')
        .duration(300)
        .attr('x', String(currentX))
        .attr('y', String(currentY))
        .attr('width', String(width))
        .attr('height', String(height))
        .attr('rx', String(rx));
}

export function setupHoverEffect(svgDoc: Document, el: HTMLElement): HTMLElement {
    const href = el.getAttribute('xlink:href');

    if (el.localName === 'use' && href === '#station') {
        const circle = svgDoc.createElementNS('http://www.w3.org/2000/svg', 'circle');

        circle.setAttribute('cx', el.getAttribute('x')!);
        circle.setAttribute('cy', el.getAttribute('y')!);
        circle.setAttribute('r', '3');

        for (const attr of el.attributes) {
            if (['x', 'y', 'xlink:href', 'href'].includes(attr.name)) {
                continue;
            }
            circle.setAttribute(attr.name, attr.value);
        }
        circle.style.fill = '#fff';
        circle.style.stroke = '#000';
        circle.style.strokeWidth = '1';

        el.parentNode!.replaceChild(circle, el);

        d3.select(circle)
            .on('mouseenter.a', () => {
                d3.select(circle)
                    .transition('hoverEffect')
                    .duration(300)
                    .attr('r', '5');
            })
            .on('mouseleave.a', () => {
                d3.select(circle)
                    .transition('hoverEffect')
                    .duration(300)
                    .attr('r', '3');
            });

        return circle as unknown as HTMLElement;
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

        for (const attr of el.attributes) {
            if (['x', 'y', 'xlink:href', 'href'].includes(attr.name)) {
                continue;
            }
            rect.setAttribute(attr.name, attr.value);
        }
        rect.style.fill = '#fff';
        rect.style.stroke = '#000';
        rect.style.strokeWidth = '1';

        el.parentNode!.replaceChild(rect, el);

        const scaleFactor = 5 / 3;

        d3.select(rect)
            .on('mouseenter', () => hoverMouseEnter(rect as Element, currentX, currentY, width, height, rx, scaleFactor))
            .on('mouseleave', () => hoverMouseLeave(rect as Element, currentX, currentY, width, height, rx));

        return rect as unknown as HTMLElement;
    }
    return el;
}