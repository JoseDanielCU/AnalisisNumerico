// src/Methods/SOR.ts

export interface IterationSOR {
    iter: number;
    x: number[];
    error: number;
}

export function sorMethod(
    A: number[][],
    b: number[],
    options: { tol: number; maxIter: number; omega: number }
): { iterations: IterationSOR[]; spectralRadius: number; converges: boolean } {
    const n = A.length;
    let x = new Array(n).fill(0);
    const iterations: IterationSOR[] = [];
    const omega = options.omega;

    // Construcción matriz de iteración para SOR es más compleja,
    // para aproximar radio espectral se podría usar el de GS modificado por omega.
    // Aquí simplificamos y reutilizamos matriz T de GS:
    const Tgs = Array(n)
        .fill(0)
        .map(() => new Array(n).fill(0));

    for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
            Tgs[i][j] = -A[i][j] / A[i][i];
        }
    }
    const spectralRadiusGS = Math.max(
        ...Tgs.map((row) => row.reduce((acc, val) => acc + Math.abs(val), 0))
    );
    // Radio espectral de SOR puede aproximarse: |1 - ω| + ω * ρ(Tgs)
    // Para omega en (0,2), converge si este valor < 1
    const spectralRadiusSOR = Math.abs(1 - omega) + omega * spectralRadiusGS;
    const converges = spectralRadiusSOR < 1;

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
            const xNew = (b[i] - sum1 - sum2) / A[i][i];
            x[i] = (1 - omega) * xOld[i] + omega * xNew;
        }

        error = Math.max(...x.map((xi, i) => Math.abs(xi - xOld[i])));
        iterations.push({ iter: iter + 1, x: [...x], error });

        iter++;
    }

    return { iterations, spectralRadius: spectralRadiusSOR, converges };
}
