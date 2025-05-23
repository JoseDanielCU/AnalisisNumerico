import { evaluate } from "mathjs";

interface Iteration {
    iter: number;
    a: number;
    b: number;
    x1: number;
    f_x1: number;
    error: number;
}

export function falseRuleMethod(
    fx: string,
    a: number,
    b: number,
    options: { tol: number; maxIter: number }
): Iteration[] {
    const results: Iteration[] = [];
    const f = (x: number) => evaluate(fx, { x });

    let fa = f(a);
    let fb = f(b);
    if (fa * fb > 0) throw new Error("f(a) y f(b) deben tener signos opuestos");

    let iter = 0;
    let x1 = a;
    let prev = a;
    let error = Number.MAX_VALUE;

    while (iter < options.maxIter && error > options.tol) {
        x1 = b - fb * (b - a) / (fb - fa);
        const fx1 = f(x1);
        error = iter === 0 ? Math.abs(fx1) : Math.abs(x1 - prev);

        results.push({ iter: iter + 1, a, b, x1, f_x1: fx1, error });

        if (fa * fx1 < 0) {
            b = x1;
            fb = fx1;
        } else {
            a = x1;
            fa = fx1;
        }

        prev = x1;
        iter++;
    }

    return results;
}