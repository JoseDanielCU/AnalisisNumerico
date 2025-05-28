import { evaluate } from "mathjs";
import { getDerivatives } from "../Utils/DerivatePreview";

interface Iteration {
    iter: number;
    x: number;
    fx: number;
    dfx: number;
    error: number;
    error_abs: number;
    error_rel: number;
}

export function newtonMethod(
    fx: string,
    x0: number,
    options: { tol: number; maxIter: number }
): Iteration[] {
    const results: Iteration[] = [];
    const f = (x: number) => evaluate(fx, { x });

    const { first: dfxExpr } = getDerivatives(fx);
    if (dfxExpr === "No válida") {
        throw new Error("La derivada de la función no es válida");
    }

    const df = (x: number) => evaluate(dfxExpr, { x });

    let iter = 0;
    let error_abs = Number.MAX_VALUE;
    let error_rel = Number.MAX_VALUE;
    let x = x0;

    while (iter < options.maxIter && error_abs > options.tol) {
        const fxVal = f(x);
        const dfxVal = df(x);

        if (dfxVal === 0) {
            break; // Evitar división por cero
        }

        const xNew = x - fxVal / dfxVal;
        error_abs = Math.abs(xNew - x);
        error_rel = xNew !== 0 ? error_abs / Math.abs(xNew) : Number.MAX_VALUE;

        results.push({
            iter: iter + 1,
            x,
            fx: fxVal,
            dfx: dfxVal,
            error: error_abs,
            error_abs,
            error_rel,
        });

        x = xNew;
        iter++;
    }

    return results;
}