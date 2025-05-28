import { evaluate } from "mathjs";
import { getDerivatives } from "../Utils/DerivatePreview";

interface Iteration {
    iter: number;
    x: number;
    f_x: number;
    df_x: number;
    d2f_x: number;
    error: number;
    error_abs: number;
    error_rel: number;
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
        const error_abs = Math.abs(nextX - x);
        const error_rel = nextX !== 0 ? error_abs / Math.abs(nextX) : Number.MAX_VALUE;
        error = error_abs; // Usamos el error absoluto para la convergencia

        results.push({
            iter: iter + 1,
            x,
            f_x: fxVal,
            df_x: dfxVal,
            d2f_x: d2fxVal,
            error,      // error absoluto para comparación
            error_abs,
            error_rel,
        });

        x = nextX;
        iter++;
    }

    return results;
}