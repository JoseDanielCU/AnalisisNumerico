export interface LinearSplineResult {
    segments: { m: number; b: number; interval: [number, number] }[];
    polynomial: string;
}

export function linearSplineMethod(points: [number, number][]): LinearSplineResult {
    const n = points.length;
    const segments: { m: number; b: number; interval: [number, number] }[] = [];

    // Sort points by x to ensure correct intervals
    const sortedPoints = [...points].sort((a, b) => a[0] - b[0]);

    // Compute linear segments
    for (let i = 0; i < n - 1; i++) {
        const x0 = sortedPoints[i][0], y0 = sortedPoints[i][1];
        const x1 = sortedPoints[i + 1][0], y1 = sortedPoints[i + 1][1];
        const m = (y1 - y0) / (x1 - x0);
        const b = y0 - m * x0;
        segments.push({ m, b, interval: [x0, x1] });
    }

    // Construct piecewise polynomial string
    const polynomial = segments
        .map(({ m, b, interval }, i) => {
            const sign = b >= 0 ? "+" : "";
            return `P${i + 1}(x) = ${m.toFixed(4)}x ${sign} ${b.toFixed(4)} for x in [${interval[0].toFixed(4)}, ${interval[1].toFixed(4)}]`;
        })
        .join("\n");

    return { segments, polynomial };
}