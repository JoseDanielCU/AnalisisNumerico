import { evaluate } from "mathjs";
import { getDerivatives } from "../Utils/DerivatePreview";

interface Iteration {
    iter: number;
    x: number;
    f_x: number;
    df_x: number;
    d2f_x: number;
    error: number;
}

export function multipleRootsMethod(
    fx: string,
    x0: number,
    options: { tol: number; maxIter: number }
): Iteration[] {
    const results: Iteration[] = [];

    const f = (x: number) => evaluate(fx, { x });

    const { first: dfxExpr, second: d2fxExpr } = getDerivatives(fx);
    if (dfxExpr === "No válida" || d2fxExpr === "No válida") {
        throw new Error("No se pudieron calcular las derivadas correctamente");
    }

    const df = (x: number) => evaluate(dfxExpr, { x });
    const d2f = (x: number) => evaluate(d2fxExpr, { x });

    let iter = 0;
    let x = x0;
    let error = Number.MAX_VALUE;

    while (iter < options.maxIter && error > options.tol) {
        const fxVal = f(x);
        const dfxVal = df(x);
        const d2fxVal = d2f(x);

        const denom = Math.pow(dfxVal, 2) - fxVal * d2fxVal;
        if (denom === 0) throw new Error("Denominador nulo en método de raíces múltiples");

        const nextX = x - (fxVal * dfxVal) / denom;
        error = Math.abs(nextX - x);

        results.push({
            iter: iter + 1,
            x,
            f_x: fxVal,
            df_x: dfxVal,
            d2f_x: d2fxVal,
            error,
        });

        x = nextX;
        iter++;
    }

    return results;
}
