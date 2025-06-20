import { evaluate } from "mathjs";

interface Iteration {
    iter: number;
    a: number;
    b: number;
    mid: number;
    f_mid: number;
    error_abs: number;
    error_rel: number;
}

export function bisectionMethod(
    fx: string,
    a: number,
    b: number,
    options: { tol: number; maxIter: number }
): Iteration[] {
    const results: Iteration[] = [];
    const f = (x: number) => evaluate(fx, { x });

    let fa = f(a);
    let fb = f(b);
    if (fa * fb > 0) {
        throw new Error("f(a) y f(b) deben tener signos opuestos");
    }

    let iter = 0;
    let errorAbs = Number.MAX_VALUE;
    let mid = a;
    let prevMid = a;

    while (iter < options.maxIter && errorAbs > options.tol) {
        mid = (a + b) / 2;
        const fmid = f(mid);

        errorAbs = iter === 0 ? Math.abs(fmid) : Math.abs(mid - prevMid);
        const errorRel = mid !== 0 ? errorAbs / Math.abs(mid) : Number.MAX_VALUE;

        results.push({
            iter: iter + 1,
            a,
            b,
            mid,
            f_mid: fmid,
            error_abs: errorAbs,
            error_rel: errorRel,
        });

        if (fmid === 0) break;

        if (fa * fmid < 0) {
            b = mid;
            fb = fmid;
        } else {
            a = mid;
            fa = fmid;
        }

        prevMid = mid;
        iter++;
    }

    return results;
}