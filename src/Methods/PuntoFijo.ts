// src/Methods/PuntoFijo.ts
import { evaluate, derivative } from "mathjs";

export interface Iteration {
    iter: number;
    xn: number;
    fx: number;
    error: number;
    status?: string;
}

export function fixedPointMethod(
    gx: string,
    x0: number,
    options: { tol: number; maxIter: number; fx: string; A?: number; k?: number }
): Iteration[] {
    const results: Iteration[] = [];
    const A = options.A ?? 0;
    const k = options.k ?? 0.1; // Default k for automatic g(x)

    // Define g(x): use provided gx or derive g(x) = x - k * f(x)
    const g = gx
        ? (x: number) => evaluate(gx, { x, A })
        : (x: number) => x - k * evaluate(options.fx, { x, A });

    // Define f(x)
    const f = (x: number) => evaluate(options.fx, { x, A });

    // Check convergence condition: |g'(x0)| < 1
    try {
        const gPrime = gx
            ? derivative(gx, "x").toString()
            : `1 - ${k} * (${derivative(options.fx, "x").toString()})`;
        const gPrimeValue = evaluate(gPrime, { x: x0, A });
        if (Math.abs(gPrimeValue) >= 1) {
            results.push({
                iter: 0,
                xn: x0,
                fx: f(x0),
                error: options.tol + 1,
                status: "Advertencia: |g'(x0)| ≥ 1, posible no convergencia",
            });
        }
    } catch (err) {
        // Skip derivative check if it fails
    }

    let iter = 0;
    let xPrev = x0;
    let xNew = x0;
    let error = options.tol + 1;
    let fxValue = f(x0);

    // Initial iteration
    results.push({
        iter: 0,
        xn: x0,
        fx: fxValue,
        error: error,
    });

    try {
        while (error > options.tol && fxValue !== 0 && iter < options.maxIter) {
            xNew = g(xPrev);
            fxValue = f(xNew);
            error = Math.abs(xNew - xPrev);

            iter++;
            results.push({
                iter,
                xn: xNew,
                fx: fxValue,
                error,
            });

            xPrev = xNew;
        }

        const last = results[results.length - 1];
        if (fxValue === 0) {
            last.status = `${xNew.toFixed(6)} es raíz exacta`;
        } else if (error <= options.tol) {
            last.status = `${xNew.toFixed(6)} es una aproximación con tolerancia ${options.tol}`;
        } else {
            last.status = `Fracasó en ${options.maxIter} iteraciones`;
        }
    } catch (err) {
        results.push({
            iter,
            xn: xNew,
            fx: fxValue,
            error,
            status: `Error: ${String(err)}`,
        });
    }

    return results;
}