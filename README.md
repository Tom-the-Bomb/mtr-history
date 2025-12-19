# MTR History

A comprehensive overview of the Mass Transit Railway (MTR) Corporation and its railway network in Hong Kong, including relevant parts of the Kowloon Canton Railway (KCR).

## Features

1. Interactive Map
Features an interactive map with a timeline that animates the history of the MTR.
Powered by [`D3.js`](https://d3js.org/)

2. Overview
Overview of the MTR system in an article-like format (click on `Read More`)

Powered by `React` with `TS`, `Tailwind`, and `Vite`

## Labels

Since the `SVG` for the map was processed in [`inkscape`](https://inkscape.org/)
This app uses a special syntax within the inkscape labels
for the website to process the station and line names, dates and other relevant information:

The label processing code can be found at `parseLabelDates()` in [`utils.ts`](https://github.com/Tom-the-Bomb/mtr-history/blob/main/src/utils.ts)

```txt
[^!]?*?<name>=<start-date>-<end-date>,...
```

if there is no end-date, we assume **present day**

### Indicators

- `^` indicates that this station was once part of the [KCR](https://en.wikipedia.org/wiki/Kowloon%E2%80%93Canton_Railway)
- `!` indicates that this station was once part of BOTH the MTR and KCR.
- `*` indicates that this station will have an interchange version of it appear underneath it in the future
(this is needed for propogating hover events)

#### Example

```txt
*chater=1980_02_12-1985_05_31,central=1985_05_31-1986_05_23
```

(Chater/Central station will become an interchange station once the island line is constructed)
