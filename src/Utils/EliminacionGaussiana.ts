export function gaussianElimination(A: number[][], b: number[]): number[] {
    const n = A.length;
    const augmented = A.map((row, i) => [...row, b[i]]);

    // Forward elimination
    for (let i = 0; i < n; i++) {
        let pivot = augmented[i][i];
        if (Math.abs(pivot) < 1e-10) throw new Error("Matriz singular o mal condicionada");
        for (let j = i + 1; j < n; j++) {
            const factor = augmented[j][i] / pivot;
            for (let k = i; k <= n; k++) {
                augmented[j][k] -= factor * augmented[i][k];
            }
        }
    }

    // Back substitution
    const x = new Array(n).fill(0);
    for (let i = n - 1; i >= 0; i--) {
        let sum = augmented[i][n];
        for (let j = i + 1; j < n; j++) {
            sum -= augmented[i][j] * x[j];
        }
        x[i] = sum / augmented[i][i];
    }

    return x;
}