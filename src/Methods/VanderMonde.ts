// src/Methods/Vandermonde.ts
import { gaussianElimination } from "../Utils/EliminacionGaussiana";

export interface VandermondeResult {
    coefficients: number[];
    polynomial: string;
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

    return { coefficients, polynomial };
}