export interface NewtonResult {
    coefficients: number[];
    polynomial: string;
    error_abs: number;  // Máxima diferencia entre y real e interpolado en los nodos
    error_rel: number;  // error_abs dividido entre el máximo valor absoluto de y
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

        // Función para evaluar el polinomio en un valor xVal usando la fórmula de Newton
    function evaluateNewton(xVal: number): number {
        let result = coefficients[0];
        let prod = 1;
        for (let i = 1; i < n; i++) {
            prod *= (xVal - x[i - 1]);
            result += coefficients[i] * prod;
        }
        return result;
    }

    // Calcular el error en los nodos (en interpolación exacta el error es teóricamente 0, 
    // pero pueden aparecer diferencias por redondeo)
    const errors = points.map(([xi, yi]) => Math.abs(yi - evaluateNewton(xi)));
    const error_abs = Math.max(...errors);
    const maxY = Math.max(...y.map(val => Math.abs(val)));
    const error_rel = maxY !== 0 ? error_abs / maxY : 0;

    return { coefficients, polynomial, error_abs, error_rel };

}