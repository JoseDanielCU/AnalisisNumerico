export interface NewtonResult {
    coefficients: number[];
    polynomial: string;
}

export function newtonInterpolantMethod(points: [number, number][]): NewtonResult {
    const n = points.length;
    const x = points.map(p => p[0]);
    const y = points.map(p => p[1]);

    // Compute divided differences
    const f = Array(n).fill(0).map(() => Array(n).fill(0));
    for (let i = 0; i < n; i++) {
        f[i][0] = y[i];
    }
    for (let j = 1; j < n; j++) {
        for (let i = j; i < n; i++) {
            f[i][j] = (f[i][j - 1] - f[i - 1][j - 1]) / (x[i] - x[i - j]);
        }
    }

    const coefficients = f[n - 1].slice(0, n);

    // Construct polynomial string
    let polynomial = "";
    for (let i = 0; i < n; i++) {
        let term = coefficients[i].toFixed(4);
        for (let j = 0; j < i; j++) {
            const sign = x[j] > 0 ? "-" : "+";
            term += `*(x ${sign} ${Math.abs(x[j]).toFixed(4)})`;
        }
        polynomial += (i > 0 && coefficients[i] >= 0 ? "+" : "") + term;
    }

    return { coefficients, polynomial };
}