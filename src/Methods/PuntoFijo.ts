import { evaluate, derivative } from "mathjs";

export interface Iteration {
    iter: number;
    xn: number;
    fx: number;
    error: number;
    error_abs: number;
    error_rel: number;
    status?: string;
}

export function fixedPointMethod(
    x0: number,
    options: { tol: number; maxIter: number; fx: string }
): Iteration[] {
    const results: Iteration[] = [];
    const k = 0.1; // Factor de escalamiento fijo para g(x) = x - k * f(x)
    const A = 0; // Parámetro fijo A

    // Define g(x) = x - k * f(x)
    const g = (x: number) => x - k * evaluate(options.fx, { x, A });
    // Define f(x)
    const f = (x: number) => evaluate(options.fx, { x, A });

    // Verifica la condición de convergencia: |g'(x0)| < 1
    try {
        const gPrime = `1 - ${k} * (${derivative(options.fx, "x").toString()})`;
        const gPrimeValue = evaluate(gPrime, { x: x0, A });
        if (Math.abs(gPrimeValue) >= 1) {
            results.push({
                iter: 0,
                xn: x0,
                fx: f(x0),
                error: options.tol + 1,
                error_abs: Math.abs(f(x0)),
                error_rel: x0 !== 0 ? Math.abs(f(x0)) / Math.abs(x0) : Number.MAX_VALUE,
                status: "Advertencia: |g'(x0)| ≥ 1, posible no convergencia",
            });
        }
    } catch (err) {
        // Si falla la verificación de la derivada, se continúa sin ella
    }

    let iter = 0;
    let xPrev = x0;
    let xNew = x0;
    let error_abs = options.tol + 1;
    let error_rel = Number.MAX_VALUE;
    let fxValue = f(x0);

    // Iteración inicial
    results.push({
        iter: 0,
        xn: x0,
        fx: fxValue,
        error: error_abs,
        error_abs,
        error_rel,
    });

    try {
        while (error_abs > options.tol && fxValue !== 0 && iter < options.maxIter) {
            xNew = g(xPrev);
            fxValue = f(xNew);
            error_abs = iter === 0 ? Math.abs(fxValue) : Math.abs(xNew - xPrev);
            error_rel = xNew !== 0 ? error_abs / Math.abs(xNew) : Number.MAX_VALUE;

            iter++;
            results.push({
                iter,
                xn: xNew,
                fx: fxValue,
                error: error_abs,
                error_abs,
                error_rel,
            });

            xPrev = xNew;
        }

        const last = results[results.length - 1];
        if (fxValue === 0) {
            last.status = `${xNew.toFixed(6)} es raíz exacta`;
        } else if (error_abs <= options.tol) {
            last.status = `${xNew.toFixed(6)} es una aproximación con tolerancia ${options.tol}`;
        } else {
            last.status = `Fracasó en ${options.maxIter} iteraciones`;
        }
    } catch (err) {
        results.push({
            iter,
            xn: xNew,
            fx: fxValue,
            error: error_abs,
            error_abs,
            error_rel,
            status: `Error: ${String(err)}`,
        });
    }

    return results;
}