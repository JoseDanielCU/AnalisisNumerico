import { gaussianElimination } from "../Utils/EliminacionGaussiana";

export interface CubicSplineResult {
    segments: { a: number; b: number; c: number; d: number; interval: [number, number] }[];
    polynomial: string;
    error_abs: number;  // Error absoluto (máxima diferencia entre los valores dados y la evaluación del spline)
    error_rel: number;  // Error relativo (error absoluto / máximo valor absoluto de y)
}

export function cubicSplineMethod(points: [number, number][]): CubicSplineResult {
    const n = points.length;
    const sortedPoints = [...points].sort((a, b) => a[0] - b[0]);
    const x = sortedPoints.map(p => p[0]);
    const y = sortedPoints.map(p => p[1]);
    const h = Array(n - 1).fill(0).map((_, i) => x[i + 1] - x[i]);

    // Natural spline: second derivatives at endpoints are 0
    const A = Array(n).fill(0).map(() => Array(n).fill(0));
    const b = new Array(n).fill(0);

    A[0][0] = 1;
    A[n - 1][n - 1] = 1;
    for (let i = 1; i < n - 1; i++) {
        A[i][i - 1] = h[i - 1];
        A[i][i] = 2 * (h[i - 1] + h[i]);
        A[i][i + 1] = h[i];
        b[i] = 3 * ((y[i + 1] - y[i]) / h[i] - (y[i] - y[i - 1]) / h[i - 1]);
    }

    // Solve for second derivatives (c)
    const c = gaussianElimination(A, b);

    // Compute coefficients for each segment
    const segments: { a: number; b: number; c: number; d: number; interval: [number, number] }[] = [];
    for (let i = 0; i < n - 1; i++) {
        const a = y[i];
        const b = (y[i + 1] - y[i]) / h[i] - h[i] * (c[i + 1] + 2 * c[i]) / 3;
        const d = (c[i + 1] - c[i]) / (3 * h[i]);
        segments.push({ a, b, c: c[i], d, interval: [x[i], x[i + 1]] });
    }

    // Construct piecewise polynomial string
    const polynomial = segments
        .map(({ a, b, c, d, interval }, i) => {
            const terms = [
                a.toFixed(4),
                b.toFixed(4) + `(x - ${x[i].toFixed(4)})`,
                (c / 2).toFixed(4) + `(x - ${x[i].toFixed(4)})^2`,
                d.toFixed(4) + `(x - ${x[i].toFixed(4)})^3`,
            ].filter(t => !t.startsWith("0.0000")).join(" + ");
            return `P${i + 1}(x) = ${terms} for x in [${interval[0].toFixed(4)}, ${interval[1].toFixed(4)}]`;
        })
        .join("\n");

    // Como el spline cúbico interpola exactamente los puntos, el error en cada nodo es 0.
    // Si se desea evaluar el error en puntos intermedios, habría que comparar la evaluación del spline con la función real.
    const error_abs = 0;
    const error_rel = 0;

    return { segments, polynomial, error_abs, error_rel };
}