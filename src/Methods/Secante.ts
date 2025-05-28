import { evaluate } from "mathjs";

interface Iteration {
    iter: number;
    x0: number;
    x1: number;
    fx0: number;
    fx1: number;
    error: number;
    error_abs: number;
    error_rel: number;
}

export function secantMethod(
    fx: string,
    x0: number,
    x1: number,
    options: { tol: number; maxIter: number }
): Iteration[] {
    const results: Iteration[] = [];
    const f = (x: number) => evaluate(fx, { x });

    let iter = 0;
    let error_abs = Number.MAX_VALUE;
    let error_rel = Number.MAX_VALUE;

    while (iter < options.maxIter && error_abs > options.tol) {
        const fx0 = f(x0);
        const fx1 = f(x1);
        if (fx1 - fx0 === 0) throw new Error("División por cero en método de la secante");

        const x2 = x1 - fx1 * (x1 - x0) / (fx1 - fx0);
        error_abs = Math.abs(x2 - x1);
        error_rel = x2 !== 0 ? error_abs / Math.abs(x2) : Number.MAX_VALUE;

        results.push({
            iter: iter + 1,
            x0,
            x1,
            fx0,
            fx1,
            error: error_abs, // error se asigna al error absoluto para la comparación inicialmente
            error_abs,
            error_rel,
        });

        x0 = x1;
        x1 = x2;
        iter++;
    }

    return results;
}