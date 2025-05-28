import { gaussianElimination } from "../Utils/EliminacionGaussiana";

export interface VandermondeResult {
    coefficients: number[];
    polynomial: string;
    error_abs: number;  // Error absoluto (máxima diferencia entre y real y y calculado)
    error_rel: number;  // Error relativo (error_absoluto / máximo valor absoluto de y)
}

export function vandermondeMethod(points: [number, number][]): VandermondeResult {
    const n = points.length;
    const x = points.map(p => p[0]);
    const y = points.map(p => p[1]);

    // Build Vandermonde matrix
    const A = Array(n).fill(0).map((_, i) =>
        Array(n).fill(0).map((_, j) => Math.pow(x[i], n - 1 - j))
    );

    // Solve A * c = y using Gaussian elimination
    const coefficients = gaussianElimination(A, y);

    // Construct polynomial string
    const polynomial = coefficients
        .map((coef, i) => {
            if (Math.abs(coef) < 1e-10) return "";
            const power = n - 1 - i;
            const sign = coef > 0 && i > 0 ? "+" : "";
            return `${sign}${coef.toFixed(4)}${power > 0 ? `x^${power}` : ""}`;
        })
        .filter(term => term)
        .join(" ");

    // Evaluamos el polinomio en cada punto y calculamos el error
    const predictedY = x.map(xVal => {
        return coefficients.reduce((acc, coef, i) => {
            const power = n - 1 - i;
            return acc + coef * Math.pow(xVal, power);
        }, 0);
    });
    
    const residuals = y.map((yi, i) => Math.abs(yi - predictedY[i]));
    const error_abs = Math.max(...residuals);
    const maxY = Math.max(...y.map(val => Math.abs(val)));
    const error_rel = maxY !== 0 ? error_abs / maxY : Number.MAX_VALUE;

    return { coefficients, polynomial, error_abs, error_rel };
}