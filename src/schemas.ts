export interface DateInterval {
    appear: Date
    removed: Date
}

export interface LegendWrapper {
    color: string
    states: State[]
}

export interface LineWrapper {
    el: SVGPathElement
    dateRange: DateInterval
}

export interface State {
    name: string
    dateRange: DateInterval
}

export interface StationWrapper {
    el: HTMLElement
    isRedundant: boolean
    states: State[]
}

export interface RawTooltipData {
    x: number
    y: number
    station: StationWrapper
}