import { evaluate } from "mathjs";

interface Iteration {
    iter: number;
    x0: number;
    x1: number;
    fx0: number;
    fx1: number;
    error: number;
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
    let error = Number.MAX_VALUE;

    while (iter < options.maxIter && error > options.tol) {
        const fx0 = f(x0);
        const fx1 = f(x1);
        if (fx1 - fx0 === 0) throw new Error("División por cero en método de la secante");

        const x2 = x1 - fx1 * (x1 - x0) / (fx1 - fx0);
        error = Math.abs(x2 - x1);

        results.push({ iter: iter + 1, x0, x1, fx0, fx1, error });

        x0 = x1;
        x1 = x2;
        iter++;
    }

    return results;
}