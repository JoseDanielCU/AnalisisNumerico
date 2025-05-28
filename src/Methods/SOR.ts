// src/Methods/SOR.ts

export interface IterationSOR {
    iter: number;
    x: number[];
    error: number;      // Error absoluto (usado para la comparación con tol)
    error_abs: number;  // Error absoluto (igual que error)
    error_rel: number;  // Error relativo
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

        // Error absoluto: máxima diferencia entre las componentes de x y xOld
        const error_abs = Math.max(...x.map((xi, i) => Math.abs(xi - xOld[i])));
        // Error relativo: error_abs dividido por el máximo valor absoluto de x (siempre que no sea 0)
        const maxVal = Math.max(...x.map((xi) => Math.abs(xi)));
        const error_rel = maxVal !== 0 ? error_abs / maxVal : Number.MAX_VALUE;
        // Usamos error_abs como criterio de convergencia
        error = error_abs;

        iterations.push({
            iter: iter + 1,
            x: [...x],
            error: error_abs,
            error_abs,
            error_rel,
        });
        iter++;
    }

    return { iterations, spectralRadius: spectralRadiusSOR, converges };
}
