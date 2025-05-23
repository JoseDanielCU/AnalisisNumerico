// src/Methods/Jacobi.ts

export interface IterationJacobi {
    iter: number;
    x: number[];
    error: number;
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
    // Primero calcular D^-1 * (L+U)
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

    // Radio espectral aproximado con la norma espectral o con power method (simplificamos con max fila suma)
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

        error = Math.max(...xNew.map((xi, i) => Math.abs(xi - x[i])));
        iterations.push({ iter: iter + 1, x: [...xNew], error });

        x = [...xNew];
        iter++;
    }

    return { iterations, spectralRadius, converges };
}
