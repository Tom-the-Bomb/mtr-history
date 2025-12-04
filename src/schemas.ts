export interface DateInterval {
    appear: Date
    removed: Date
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
    states: State[]
}