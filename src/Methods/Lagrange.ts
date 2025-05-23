export interface LagrangeResult {
    polynomial: string;
}

export function lagrangeMethod(points: [number, number][]): LagrangeResult {
    const n = points.length;
    const x = points.map(p => p[0]);
    const y = points.map(p => p[1]);

    // Construct Lagrange polynomial
    let polynomial = "";
    for (let i = 0; i < n; i++) {
        let term = `${y[i].toFixed(4)}`;
        let denominator = 1;
        for (let j = 0; j < n; j++) {
            if (i !== j) {
                term += `*(x - ${x[j].toFixed(4)})`;
                denominator *= x[i] - x[j];
            }
        }
        term = `(${term})/(${denominator.toFixed(4)})`;
        polynomial += (i > 0 && y[i] >= 0 ? "+" : "") + term;
    }

    return { polynomial };
}