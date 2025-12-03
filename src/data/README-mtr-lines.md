Populate `mtr-lines.json` with mappings from SVG element `id` → opening year.

How to use
- Open `src/assets/map.svg` and inspect elements (IDs are usually on `<path>`, `<g>`, or `<line>` elements).
- For each segment you want animated, add a property in `src/data/mtr-lines.json` where the key is the element's `id` and the value is the year (number) it opened.

Example `mtr-lines.json`:
```
{
  "tsuenWan-line-1": 1982,
  "island-line-A": 1985,
  "kowloon-connector": 1998
}
```

Notes
- The component looks for elements by `id`. If your SVG doesn't have useful IDs, add them so they match keys in the JSON.
- For elements that are paths, the component will animate the stroke drawing. For non-path shapes it will fade in.
- After editing the JSON, adjust the `min`/`max` years or ensure the years cover the range you want.
