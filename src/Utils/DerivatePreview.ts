import { derivative } from "mathjs";

export function getDerivatives(fx: string): { first: string; second: string } {
    try {
        const first = derivative(fx, "x").toString();
        const second = derivative(derivative(fx, "x"), "x").toString();
        return { first, second };
    } catch (err) {
        return { first: "No válida", second: "No válida" };
    }
}