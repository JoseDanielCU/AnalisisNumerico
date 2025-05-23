// src/Components/MethodFormChapter2.tsx
import { useState } from "react";
import { jacobiMethod } from "../Methods/Jacobi";
import { gaussSeidelMethod } from "../Methods/Gauss-Seidel";
import { sorMethod } from "../Methods/SOR";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, LineElement, PointElement, LinearScale, CategoryScale } from "chart.js";

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale);

const MethodFormChapter2 = ({ method }: { method: string }) => {
    const [matrixSize, setMatrixSize] = useState(3);
    const [A, setA] = useState<number[][]>(
        Array(3).fill(0).map(() => Array(3).fill(0))
    );
    const [b, setB] = useState<number[]>(Array(3).fill(0));
    const [tol, setTol] = useState(5e-4);
    const [maxIter, setMaxIter] = useState(100);
    const [omega, setOmega] = useState(1.25);
    const [results, setResults] = useState<any[]>([]);
    const [spectralRadius, setSpectralRadius] = useState(0);
    const [converges, setConverges] = useState(true);
    const [showHelp, setShowHelp] = useState(false);
    const [generateReport, setGenerateReport] = useState(false);
    const [reportResults, setReportResults] = useState<
        { name: string; iterations: any[]; spectralRadius: number; converges: boolean }[]
    >([]);
    const [errorMessage, setErrorMessage] = useState("");

    const methodDescriptions: Record<string, string> = {
        jacobi: "El método de Jacobi resuelve sistemas lineales iterativamente actualizando cada variable usando los valores de la iteración anterior.",
        gaussSeidel: "El método de Gauss-Seidel mejora Jacobi al usar los valores más recientes en cada iteración, lo que puede acelerar la convergencia.",
        sor: "El método SOR (Sobre-Relajación Sucesiva) introduce un parámetro de relajación ω para acelerar la convergencia de Gauss-Seidel. Requiere 0 < ω < 2.",
    };

    const handleMatrixInput = (
        e: React.ChangeEvent<HTMLInputElement>,
        row: number,
        col: number
    ) => {
        const newA = [...A];
        newA[row][col] = parseFloat(e.target.value) || 0;
        setA(newA);
    };

    const handleVectorInput = (
        e: React.ChangeEvent<HTMLInputElement>,
        index: number
    ) => {
        const newB = [...b];
        newB[index] = parseFloat(e.target.value) || 0;
        setB(newB);
    };

    const handleSizeChange = (size: number) => {
        setMatrixSize(size);
        setA(Array(size).fill(0).map(() => Array(size).fill(0)));
        setB(Array(size).fill(0));
        setResults([]);
        setReportResults([]);
        setErrorMessage("");
    };

    const validateInputs = () => {
        // Check for valid matrix (non-zero diagonal)
        for (let i = 0; i < matrixSize; i++) {
            if (A[i][i] === 0) {
                setErrorMessage("Los elementos de la diagonal principal no pueden ser cero.");
                return false;
            }
        }
        // Basic check for matrix size and b length
        if (A.length !== matrixSize || A.some(row => row.length !== matrixSize) || b.length !== matrixSize) {
            setErrorMessage("La matriz A y el vector b no coinciden en dimensiones.");
            return false;
        }
        return true;
    };

    const runMethod = () => {
        if (!validateInputs()) return;

        setErrorMessage("");
        const options = { tol, maxIter, omega };

        let res: { iterations: any[]; spectralRadius: number; converges: boolean } = {
            iterations: [],
            spectralRadius: 0,
            converges: false,
        };

        try {
            switch (method) {
                case "jacobi":
                    res = jacobiMethod(A, b, { tol, maxIter });
                    break;
                case "gaussSeidel":
                    res = gaussSeidelMethod(A, b, { tol, maxIter });
                    break;
                case "sor":
                    if (omega <= 0 || omega >= 2) {
                        setErrorMessage("El parámetro ω debe estar entre 0 y 2.");
                        return;
                    }
                    res = sorMethod(A, b, options);
                    break;
            }

            setResults(res.iterations);
            setSpectralRadius(res.spectralRadius);
            setConverges(res.converges);

            if (generateReport) {
                const methodsToRun = [
                    { name: "Jacobi", fn: () => jacobiMethod(A, b, { tol, maxIter }) },
                    { name: "Gauss-Seidel", fn: () => gaussSeidelMethod(A, b, { tol, maxIter }) },
                    { name: "SOR", fn: () => sorMethod(A, b, { tol, maxIter, omega }) },
                ];

                const report = methodsToRun.map(({ name, fn }) => {
                    try {
                        return { name, ...fn() };
                    } catch (err) {
                        return { name, iterations: [], spectralRadius: 0, converges: false };
                    }
                });

                setReportResults(report);
            } else {
                setReportResults([]);
            }
        } catch (err) {
            setErrorMessage("Error al ejecutar el método. Verifica los datos de entrada.");
        }
    };

    return (
        <div className="space-y-4">
            <div className="mt-4 p-3 bg-yellow-100 rounded border border-yellow-300">
                <strong>Descripción del método:</strong>
                <p>{methodDescriptions[method] || "Selecciona un método para ver su descripción."}</p>
            </div>

            {errorMessage && (
                <div className="p-3 bg-red-100 rounded border border-red-300 text-red-800">
                    {errorMessage}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label className="block font-medium">Tamaño de la matriz (n x n):</label>
                    <select
                        value={matrixSize}
                        onChange={(e) => handleSizeChange(parseInt(e.target.value))}
                        className="w-full border p-2 rounded"
                    >
                        {[2, 3, 4, 5, 6, 7].map((size) => (
                            <option key={size} value={size}>
                                {size}x{size}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block font-medium">Matriz A:</label>
                    <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${matrixSize}, minmax(0, 1fr))` }}>
                        {A.map((row, i) =>
                            row.map((val, j) => (
                                <input
                                    key={`${i}-${j}`}
                                    type="number"
                                    value={val}
                                    onChange={(e) => handleMatrixInput(e, i, j)}
                                    className="border p-2 rounded text-center"
                                    placeholder={`a${i + 1}${j + 1}`}
                                />
                            ))
                        )}
                    </div>
                </div>

                <div>
                    <label className="block font-medium">Vector b:</label>
                    <div className="grid gap-2">
                        {b.map((val, i) => (
                            <input
                                key={i}
                                type="number"
                                value={val}
                                onChange={(e) => handleVectorInput(e, i)}
                                className="border p-2 rounded text-center"
                                placeholder={`b${i + 1}`}
                            />
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block font-medium">Tolerancia:</label>
                    <input
                        type="number"
                        value={tol}
                        onChange={(e) => setTol(parseFloat(e.target.value))}
                        className="w-full border p-2 rounded"
                        step="any"
                    />
                </div>

                <div>
                    <label className="block font-medium">Máximo de Iteraciones:</label>
                    <input
                        type="number"
                        value={maxIter}
                        onChange={(e) => setMaxIter(parseInt(e.target.value))}
                        className="w-full border p-2 rounded"
                    />
                </div>

                {method === "sor" && (
                    <div>
                        <label className="block font-medium">Parámetro ω:</label>
                        <input
                            type="number"
                            value={omega}
                            onChange={(e) => setOmega(parseFloat(e.target.value))}
                            className="w-full border p-2 rounded"
                            step="any"
                        />
                    </div>
                )}
            </div>

            <div className="flex items-center space-x-2 mt-2">
                <input
                    type="checkbox"
                    id="reportToggle"
                    checked={generateReport}
                    onChange={() => setGenerateReport(!generateReport)}
                    className="w-4 h-4"
                />
                <label htmlFor="reportToggle" className="text-sm text-gray-700">
                    Generar informe comparativo entre métodos
                </label>
            </div>

            <button
                onClick={() => setShowHelp(!showHelp)}
                className="text-blue-600 text-sm underline"
            >
                {showHelp ? "Ocultar ayuda" : "¿Cómo ingresar los datos?"}
            </button>

            {showHelp && (
                <div className="mt-2 text-sm text-gray-700 border border-gray-200 p-3 rounded bg-gray-50">
                    <p>Instrucciones para ingresar datos:</p>
                    <ul className="list-disc list-inside mt-1">
                        <li>Selecciona el tamaño de la matriz (n x n, hasta 7x7).</li>
                        <li>Ingresa los coeficientes de la matriz A en la grilla. Cada entrada a<sub>ij</sub> corresponde a la fila i y columna j.</li>
                        <li>Ingresa los valores del vector b en las entradas correspondientes.</li>
                        <li>Los elementos de la diagonal de A no deben ser cero.</li>
                        <li>Para SOR, el parámetro ω debe estar entre 0 y 2.</li>
                        <li>Ejemplo para 2x2: A = [[4, 1], [1, 3]], b = [1, 2]</li>
                    </ul>
                </div>
            )}
<td></td>
            <button
                onClick={runMethod}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
                Ejecutar método
            </button>

            {results.length > 0 && (
                <>
                    <h3 className="text-xl font-semibold mt-4">Resultados</h3>
                    <p>
                        <strong>Radio Espectral:</strong> {spectralRadius.toFixed(6)} (
                        {converges ? "Converge" : "No converge"})
                    </p>
                    <div className="overflow-x-auto max-h-[300px] overflow-y-auto border rounded">
                        <table className="min-w-full text-sm">
                            <thead>
                            <tr className="bg-gray-200">
                                <th className="px-2 py-1 border">Iteración</th>
                                {results[0].x.map((_: number, i: number) => (
                                    <th key={i} className="px-2 py-1 border">{`x${i + 1}`}</th>
                                ))}
                                <th className="px-2 py-1 border">Error</th>
                            </tr>
                            </thead>
                            <tbody>
                            {results.map((row, idx) => (
                                <tr key={idx} className="odd:bg-white even:bg-gray-100">
                                    <td className="px-2 py-1 border">{row.iter}</td>
                                    {row.x.map((val: number, i: number) => (
                                        <td key={i} className="px-2 py-1 border">
                                            {val.toFixed(6)}
                                        </td>
                                    ))}
                                    <td className="px-2 py-1 border">{row.error.toFixed(6)}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>

                    <h4 className="font-semibold mt-4">Gráfica de error</h4>
                    <Line
                        data={{
                            labels: results.map((r) => r.iter),
                            datasets: [
                                {
                                    label: "Error",
                                    data: results.map((r) => r.error),
                                    borderColor: "rgb(37, 99, 235)",
                                    fill: false,
                                },
                            ],
                        }}
                    />

                    {generateReport && reportResults.length > 0 && (
                        <div className="mt-8">
                            <h3 className="text-xl font-bold mb-2">Informe comparativo de métodos</h3>
                            <table className="min-w-full text-sm border">
                                <thead className="bg-gray-200">
                                <tr>
                                    <th className="px-2 py-1 border">Método</th>
                                    <th className="px-2 py-1 border">Iteraciones</th>
                                    <th className="px-2 py-1 border">Error final</th>
                                    <th className="px-2 py-1 border">Radio Espectral</th>
                                    <th className="px-2 py-1 border">Converge</th>
                                </tr>
                                </thead>
                                <tbody>
                                {reportResults.map(({ name, iterations, spectralRadius, converges }, idx) => {
                                    const last = iterations[iterations.length - 1] || {};
                                    return (
                                        <tr key={idx} className="odd:bg-white even:bg-gray-100">
                                            <td className="px-2 py-1 border">{name}</td>
                                            <td className="px-2 py-1 border">{iterations.length}</td>
                                            <td className="px-2 py-1 border">
                                                {last.error ? last.error.toFixed(6) : "—"}
                                            </td>
                                            <td className="px-2 py-1 border">{spectralRadius.toFixed(6)}</td>
                                            <td className="px-2 py-1 border">{converges ? "Sí" : "No"}</td>
                                        </tr>
                                    );
                                })}
                                </tbody>
                            </table>

                            {(() => {
                                const validResults = reportResults
                                    .filter((m) => m.iterations.length > 0)
                                    .map((m) => ({
                                        name: m.name,
                                        error: m.iterations[m.iterations.length - 1]?.error ?? Infinity,
                                        iterations: m.iterations.length,
                                        spectralRadius: m.spectralRadius,
                                        converges: m.converges,
                                    }));

                                if (validResults.length === 0) return null;

                                const best = validResults.reduce((prev, curr) =>
                                    curr.error < prev.error ? curr : prev
                                );

                                return (
                                    <div className="mt-4 p-4 border rounded bg-green-50 text-green-800 font-semibold">
                                        Mejor método: <strong>{best.name}</strong> con error final de{" "}
                                        <code>{best.error.toFixed(6)}</code> en {best.iterations} iteraciones.
                                        <br />
                                        Radio espectral: <code>{best.spectralRadius.toFixed(6)}</code> (
                                        {best.converges ? "Converge" : "No converge"}).
                                    </div>
                                );
                            })()}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default MethodFormChapter2;