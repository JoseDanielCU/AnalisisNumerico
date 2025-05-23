// src/Methods/GaussSeidel.ts

export interface IterationGS {
    iter: number;
    x: number[];
    error: number;
}

export function gaussSeidelMethod(
    A: number[][],
    b: number[],
    options: { tol: number; maxIter: number }
): { iterations: IterationGS[]; spectralRadius: number; converges: boolean } {
    const n = A.length;
    let x = new Array(n).fill(0);
    const iterations: IterationGS[] = [];

    // Matriz de iteración para GS: T = (D - L)^(-1) * U
    // Para simplificar cálculo aproximado del radio espectral,
    // usaremos el máximo de suma de valores absolutos por fila de T (norma infinito)
    // En práctica, calcular radio espectral exacto requiere eigenvalues.

    // Construimos matriz T aproximada para el radio espectral
    const T = Array(n)
        .fill(0)
        .map(() => new Array(n).fill(0));

    for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
            // U
            T[i][j] = -A[i][j] / A[i][i];
        }
        for (let j = 0; j < i; j++) {
            // L - incluido en (D-L)^(-1), aproximamos cero para j<i
            T[i][j] = 0;
        }
    }

    const spectralRadius = Math.max(
        ...T.map((row) => row.reduce((acc, val) => acc + Math.abs(val), 0))
    );
    const converges = spectralRadius < 1;

    let error = Number.MAX_VALUE;
    let iter = 0;

    while (iter < options.maxIter && error > options.tol) {
        const xOld = [...x];

        for (let i = 0; i < n; i++) {
            let sum1 = 0;
            for (let j = 0; j < i; j++) {
                sum1 += A[i][j] * x[j];
            }
            let sum2 = 0;
            for (let j = i + 1; j < n; j++) {
                sum2 += A[i][j] * xOld[j];
            }
            x[i] = (b[i] - sum1 - sum2) / A[i][i];
        }

        error = Math.max(...x.map((xi, i) => Math.abs(xi - xOld[i])));
        iterations.push({ iter: iter + 1, x: [...x], error });

        iter++;
    }

    return { iterations, spectralRadius, converges };
}
