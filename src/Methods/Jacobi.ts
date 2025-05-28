export interface IterationJacobi {
    iter: number;
    x: number[];
    error: number;      // Error absoluto
    error_abs: number;  // Error absoluto (igual que error)
    error_rel: number;  // Error relativo
}

export function jacobiMethod(
    A: number[][],
    b: number[],
    options: { tol: number; maxIter: number }
): { iterations: IterationJacobi[]; spectralRadius: number; converges: boolean } {
    const n = A.length;
    let x = new Array(n).fill(0);
    let xNew = new Array(n).fill(0);
    const iterations: IterationJacobi[] = [];

    // Matriz de iteración: T = D^(-1)*(L + U)
    const T = Array(n)
        .fill(0)
        .map(() => new Array(n).fill(0));
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            if (i !== j) {
                T[i][j] = -A[i][j] / A[i][i];
            }
        }
    }

    // Radio espectral aproximado con la suma máxima de filas
    const spectralRadius = Math.max(
        ...T.map((row) => row.reduce((acc, val) => acc + Math.abs(val), 0))
    );
    const converges = spectralRadius < 1;

    let error = Number.MAX_VALUE;
    let iter = 0;

    while (iter < options.maxIter && error > options.tol) {
        for (let i = 0; i < n; i++) {
            let sum = 0;
            for (let j = 0; j < n; j++) {
                if (j !== i) sum += A[i][j] * x[j];
            }
            xNew[i] = (b[i] - sum) / A[i][i];
        }

        // Error absoluto: la máxima diferencia entre la nueva y la anterior aproximación
        const error_abs = Math.max(...xNew.map((xi, i) => Math.abs(xi - x[i])));
        // Error relativo: error absoluto dividido por el máximo valor absoluto de xNew (evitando división por cero)
        const maxVal = Math.max(...xNew.map((xi) => Math.abs(xi)));
        const error_rel = maxVal !== 0 ? error_abs / maxVal : Number.MAX_VALUE;

        error = error_abs;

        iterations.push({
            iter: iter + 1,
            x: [...xNew],
            error: error_abs,
            error_abs,
            error_rel,
        });

        x = [...xNew];
        iter++;
    }

    return { iterations, spectralRadius, converges };
}